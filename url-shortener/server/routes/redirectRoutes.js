import express from 'express';
import { redirectToUrl } from '../controllers/urlController.js';

const router = express.Router();

// GET /:shortId — lives outside /api so short links stay clean,
// e.g. https://yourdomain.com/aB3xQ9
router.get('/:shortId', redirectToUrl);

export default router;
