import express from 'express';
import {
  createText,
  getTextById,
  getTextBySlug,
  getAuthorTexts,
  updateText,
  publishText,
  deleteText,
  getPublishedTexts,
  searchTexts,
} from '../controllers/textController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Rotas públicas
router.get('/published', getPublishedTexts);
router.get('/search', searchTexts);
router.get('/slug/:slug', getTextBySlug);
router.get('/id/:id', optionalAuth, getTextById);
router.get('/author/:authorId', getAuthorTexts);

// Rotas autenticadas
router.post('/', authenticate, createText);
router.put('/:id', authenticate, updateText);
router.post('/:id/publish', authenticate, publishText);
router.delete('/:id', authenticate, deleteText);

export default router;
