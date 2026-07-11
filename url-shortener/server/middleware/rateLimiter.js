import rateLimit from 'express-rate-limit';

/**
 * Limits link creation to prevent abuse. Read-only endpoints (dashboard
 * listing, analytics, redirects) are left unthrottled.
 */
const shortenLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many links created from this IP. Please wait a moment and try again.',
  },
});

export default shortenLimiter;
