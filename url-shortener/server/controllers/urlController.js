import bcrypt from 'bcryptjs';
import Url from '../models/Url.js';
import generateShortId from '../utils/generateShortId.js';
import { isValidUrl, isValidAlias } from '../utils/validateUrl.js';

const BASE_URL = () => process.env.BASE_URL || 'http://localhost:5000';

/**
 * POST /api/shorten
 * Creates a new short URL. If the same original URL was already shortened
 * (and no custom alias / password / expiry was requested), the existing
 * record is returned instead of creating a duplicate.
 */
export const shortenUrl = async (req, res, next) => {
  try {
    const { originalUrl, customAlias, password, expiresAt, title } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ success: false, message: 'A URL is required.' });
    }

    if (!isValidUrl(originalUrl)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid URL, including http:// or https://.',
      });
    }

    // Reuse an existing short link for the same long URL, unless the
    // request asks for something that makes this link unique (alias,
    // password, or expiry).
    if (!customAlias && !password && !expiresAt) {
      const existing = await Url.findOne({ originalUrl, customAlias: false, password: null, expiresAt: null });
      if (existing) {
        return res.status(200).json({ success: true, data: existing, reused: true });
      }
    }

    let shortId;

    if (customAlias) {
      if (!isValidAlias(customAlias)) {
        return res.status(400).json({
          success: false,
          message: 'Custom alias must be 3-30 characters: letters, numbers, hyphens or underscores.',
        });
      }
      const aliasTaken = await Url.findOne({ shortId: customAlias });
      if (aliasTaken) {
        return res.status(409).json({ success: false, message: 'That alias is already taken.' });
      }
      shortId = customAlias;
    } else {
      // Guarantee uniqueness even in the unlikely event of a collision.
      let unique = false;
      while (!unique) {
        shortId = generateShortId();
        // eslint-disable-next-line no-await-in-loop
        const exists = await Url.findOne({ shortId });
        if (!exists) unique = true;
      }
    }

    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const url = await Url.create({
      originalUrl,
      shortId,
      shortUrl: `${BASE_URL()}/${shortId}`,
      customAlias: Boolean(customAlias),
      title: title || '',
      password: hashedPassword,
      expiresAt: expiresAt || null,
    });

    return res.status(201).json({ success: true, data: url, reused: false });
  } catch (error) {
    next(error);
  }
};

// Minimal, on-brand HTML shell used for the redirect route's edge cases
// (password prompt, expired link, not found) since a browser navigates
// to this URL directly — a JSON response would look broken to a person.
const htmlPage = ({ title, heading, body }) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
<style>
  body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;
    font-family:Inter,ui-sans-serif,system-ui,sans-serif;
    background:linear-gradient(135deg,#4F46E5 0%,#7C3AED 50%,#2563EB 100%);color:#0B0B14;padding:24px;box-sizing:border-box;}
  .card{background:#fff;border-radius:20px;padding:40px;max-width:420px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.25);text-align:center;}
  h1{font-size:22px;margin:0 0 8px;color:#1e1b2e;}
  p{color:#555;line-height:1.5;margin:0 0 20px;}
  input{width:100%;padding:12px 14px;border-radius:10px;border:1px solid #ddd;box-sizing:border-box;font-size:15px;margin-bottom:12px;}
  button{width:100%;padding:12px 14px;border-radius:10px;border:none;background:linear-gradient(135deg,#4F46E5,#7C3AED,#2563EB);
    color:#fff;font-weight:600;font-size:15px;cursor:pointer;}
  .err{color:#DC2626;font-size:13px;margin-top:-4px;margin-bottom:12px;}
</style></head>
<body><div class="card"><h1>${heading}</h1>${body}</div></body></html>`;

/**
 * GET /:shortId
 * Redirects to the original URL and records the visit.
 * Supports password-protected links via ?password= query param
 * (a small inline form posts back to the same URL with the value).
 */
export const redirectToUrl = async (req, res, next) => {
  try {
    const { shortId } = req.params;
    const { password } = req.query;

    const url = await Url.findOne({ shortId });

    if (!url) {
      return res.status(404).send(
        htmlPage({
          title: 'Link not found',
          heading: '🔗 Link not found',
          body: '<p>This short link doesn\'t exist or may have been deleted.</p>',
        })
      );
    }

    if (url.expiresAt && new Date(url.expiresAt) < new Date()) {
      return res.status(410).send(
        htmlPage({
          title: 'Link expired',
          heading: '⏳ This link has expired',
          body: '<p>The owner set an expiration date for this link and it has passed.</p>',
        })
      );
    }

    if (url.password) {
      const providedWrong = password && !(await bcrypt.compare(password, url.password));
      if (!password || providedWrong) {
        return res.status(401).send(
          htmlPage({
            title: 'Password required',
            heading: '🔒 Password protected',
            body: `
              <p>This link is protected. Enter the password to continue.</p>
              <form method="GET" action="/${shortId}">
                ${providedWrong ? '<div class="err">Incorrect password, please try again.</div>' : ''}
                <input type="password" name="password" placeholder="Enter password" autofocus required />
                <button type="submit">Continue</button>
              </form>`,
          })
        );
      }
    }

    url.clicks += 1;
    url.lastVisited = new Date();
    url.visits.push({ visitedAt: new Date(), referrer: req.get('referer') || 'direct' });
    await url.save();

    return res.redirect(url.originalUrl);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/urls
 * Returns all shortened URLs, with optional search/sort/pagination.
 * Query params: search, sort ('newest' | 'oldest' | 'clicks'), page, limit
 */
export const getUrls = async (req, res, next) => {
  try {
    const { search = '', sort = 'newest', page = 1, limit = 10, favorites } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { originalUrl: { $regex: search, $options: 'i' } },
        { shortId: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
      ];
    }
    if (favorites === 'true') {
      query.isFavorite = true;
    }

    const sortMap = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      clicks: { clicks: -1 },
    };

    const pageNum = Math.max(Number(page) || 1, 1);
    const limitNum = Math.min(Math.max(Number(limit) || 10, 1), 100);

    const [urls, total] = await Promise.all([
      Url.find(query)
        .sort(sortMap[sort] || sortMap.newest)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .select('-password -visits'),
      Url.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      data: urls,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum) || 1,
        limit: limitNum,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/url/:id
 */
export const deleteUrl = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Url.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Link not found.' });
    }

    return res.status(200).json({ success: true, message: 'Link deleted.' });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/url/:id/favorite
 * Toggles the favorite flag on a link.
 */
export const toggleFavorite = async (req, res, next) => {
  try {
    const { id } = req.params;
    const url = await Url.findById(id);

    if (!url) {
      return res.status(404).json({ success: false, message: 'Link not found.' });
    }

    url.isFavorite = !url.isFavorite;
    await url.save();

    return res.status(200).json({ success: true, data: url });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/analytics/:id
 * Returns detailed analytics for a single link, including a
 * day-bucketed click series for charting.
 */
export const getAnalytics = async (req, res, next) => {
  try {
    const { id } = req.params;
    const url = await Url.findById(id);

    if (!url) {
      return res.status(404).json({ success: false, message: 'Link not found.' });
    }

    // Bucket visits by day for the last 14 days.
    const days = 14;
    const buckets = Array.from({ length: days }, (_, i) => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - (days - 1 - i));
      return { date: d.toISOString().slice(0, 10), clicks: 0 };
    });

    url.visits.forEach((visit) => {
      const key = new Date(visit.visitedAt).toISOString().slice(0, 10);
      const bucket = buckets.find((b) => b.date === key);
      if (bucket) bucket.clicks += 1;
    });

    return res.status(200).json({
      success: true,
      data: {
        _id: url._id,
        originalUrl: url.originalUrl,
        shortUrl: url.shortUrl,
        shortId: url.shortId,
        title: url.title,
        clicks: url.clicks,
        createdAt: url.createdAt,
        lastVisited: url.lastVisited,
        expiresAt: url.expiresAt,
        isFavorite: url.isFavorite,
        hasPassword: Boolean(url.password),
        series: buckets,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/analytics
 * Aggregate stats for the analytics preview cards on the homepage/dashboard.
 */
export const getOverview = async (req, res, next) => {
  try {
    const [totalLinks, clicksAgg, activeLinks, topLinks] = await Promise.all([
      Url.countDocuments(),
      Url.aggregate([{ $group: { _id: null, totalClicks: { $sum: '$clicks' } } }]),
      Url.countDocuments({
        $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
      }),
      Url.find().sort({ clicks: -1 }).limit(5).select('-password -visits'),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalLinks,
        totalClicks: clicksAgg[0]?.totalClicks || 0,
        activeLinks,
        topLinks,
      },
    });
  } catch (error) {
    next(error);
  }
};
