import express from 'express';
import {
  shortenUrl,
  getUrls,
  deleteUrl,
  toggleFavorite,
  getAnalytics,
  getOverview,
} from '../controllers/urlController.js';

const router = express.Router();

// Order matters: /analytics (overview) must be declared before /analytics/:id
router.post('/shorten', shortenUrl);
router.get('/urls', getUrls);
router.get('/analytics', getOverview);
router.get('/analytics/:id', getAnalytics);
router.delete('/url/:id', deleteUrl);
router.patch('/url/:id/favorite', toggleFavorite);

export default router;
