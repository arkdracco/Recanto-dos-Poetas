import express from 'express';
import {
  register,
  login,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  getCurrentUser,
  updateProfile,
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Rotas públicas
router.post('/register', register);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);

// Rotas autenticadas
router.get('/me', authenticate, getCurrentUser);
router.put('/profile', authenticate, updateProfile);

export default router;
