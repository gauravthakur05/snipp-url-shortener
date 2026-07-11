# Snipp — URL Shortener

A production-ready, full-stack URL shortener with a premium SaaS-style UI: instant link
shortening, QR codes, click analytics, custom aliases, password-protected and expiring
links, dark mode, and a searchable dashboard.

**Frontend:** React (Vite) · Tailwind CSS · React Router · Axios · Framer Motion · Chart.js · React Icons
**Backend:** Node.js · Express · MongoDB (Mongoose) · NanoID · bcryptjs

---

## 1. Project structure

```
url-shortener/
├── client/                 # React (Vite) frontend
│   ├── src/
│   │   ├── components/     # Reusable UI pieces (Navbar, cards, modals, sections…)
│   │   ├── pages/          # Home, Dashboard, LinkAnalytics, NotFound
│   │   ├── hooks/          # useTheme, useUrls
│   │   ├── utils/          # api.js (Axios client), helpers.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
└── server/                 # Express + MongoDB backend
    ├── config/db.js        # Mongoose connection
    ├── models/Url.js       # Url schema
    ├── controllers/        # Route handlers / business logic
    ├── routes/              # /api routes + top-level redirect route
    ├── middleware/          # Error handling, rate limiting
    ├── utils/               # Short ID generation, URL validation
    ├── index.js             # App entry point
    └── package.json
```

---

## 2. Prerequisites

- Node.js 18+
- A MongoDB database — either:
  - Local MongoDB (`mongod` running on `localhost:27017`), or
  - A free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (recommended)

---

## 3. Backend setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/url-shortener
PORT=5000
BASE_URL=http://localhost:5000
CLIENT_URL=http://localhost:5173
SHORT_ID_LENGTH=7
```

- `MONGO_URI` — your MongoDB connection string (local or Atlas).
- `BASE_URL` — the public URL of **this server**. It's used to build the short links
  themselves (e.g. `http://localhost:5000/aB3xQ9`). In production, set this to your
  deployed API domain.
- `CLIENT_URL` — the origin(s) allowed to call the API (CORS). Comma-separate multiple
  origins if needed.

Run the server:

```bash
npm run dev     # nodemon, auto-restarts on changes
# or
npm start
```

The API will be live at `http://localhost:5000`. Check `GET /api/health` to confirm it's up.

---

## 4. Frontend setup

```bash
cd client
npm install
cp .env.example .env
```

Edit `client/.env` if needed (defaults work with the backend above):

```env
VITE_API_URL=http://localhost:5000
```

> During local development, Vite also proxies `/api` requests to `http://localhost:5000`
> (see `vite.config.js`), so the app works even if `VITE_API_URL` is left blank.

Run the dev server:

```bash
npm run dev
```

Open `http://localhost:5173`.

---

## 5. Building for production

```bash
cd client
npm run build      # outputs static files to client/dist
```

Deploy `client/dist` to any static host (Vercel, Netlify, Cloudflare Pages, S3, etc.),
and deploy `server/` to any Node host (Render, Railway, Fly.io, EC2, etc.). Point
`VITE_API_URL` at your deployed API, and `CLIENT_URL` / `BASE_URL` at your deployed
frontend/API domains respectively.

---

## 6. API reference

| Method | Endpoint                  | Description                                             |
|--------|----------------------------|-----------------------------------------------------------|
| POST   | `/api/shorten`             | Create a short URL. Body: `originalUrl`, optional `customAlias`, `password`, `expiresAt`, `title`. |
| GET    | `/:shortId`                 | Redirects to the original URL and records the click.    |
| GET    | `/api/urls`                 | List URLs. Query: `search`, `sort` (`newest`/`oldest`/`clicks`), `page`, `limit`, `favorites`. |
| DELETE | `/api/url/:id`               | Delete a URL by its Mongo `_id`.                          |
| PATCH  | `/api/url/:id/favorite`       | Toggle the favorite flag on a URL.                         |
| GET    | `/api/analytics/:id`          | Detailed analytics (click series, last visited, etc.) for one URL. |
| GET    | `/api/analytics`              | Aggregate stats: total links, total clicks, active links, top links. |
| GET    | `/api/health`                  | Health check.                                              |

### MongoDB schema (`Url`)

```js
{
  originalUrl: String,
  shortId: String,       // unique
  shortUrl: String,
  customAlias: Boolean,
  title: String,
  clicks: Number,
  lastVisited: Date,
  isFavorite: Boolean,
  password: String,      // bcrypt hash, or null
  expiresAt: Date,        // or null
  visits: [{ visitedAt: Date, referrer: String }],
  createdAt: Date,
  updatedAt: Date,
}
```

---

## 7. Features

- Instant URL shortening with validation and duplicate detection
- Custom aliases, password-protected links, and link expiration
- Auto-generated, downloadable QR codes for every short link
- One-click copy with animated confirmation
- Full dashboard: search, sort (newest/oldest/most clicked), favorites, CSV export, pagination
- Per-link analytics page with a Chart.js click-trend chart
- Homepage analytics preview (total links / clicks / active links)
- Dark mode with persisted preference
- Toasts, skeleton loading states, and Framer Motion transitions throughout
- Keyboard shortcut: press `n` on the dashboard to open the "new link" form
- Responsive from mobile to desktop; visible focus states for keyboard navigation

---

## 8. Notes on production hardening

This project is functionally complete and ready to run, but before a real production
launch you'd typically also want to add: user accounts/auth if links should be scoped
per-user, HTTPS termination, a CDN in front of static assets, structured logging, and
automated tests. The rate limiter on `POST /api/shorten` (30 requests/minute/IP) is
already wired up via `express-rate-limit`.
