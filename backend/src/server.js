import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import 'express-async-errors';
import dotenv from 'dotenv';

// Importar rotas
import authRoutes from './routes/authRoutes.js';
import textRoutes from './routes/textRoutes.js';

// Importar middleware
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ===== MIDDLEWARE DE SEGURANÇA =====
app.use(helmet());

// ===== RATE LIMITING =====
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requisições por windowMs
  message: 'Muitas requisições deste IP, tente novamente mais tarde.',
});
app.use(limiter);

// ===== CORS =====
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200,
}));

// ===== BODY PARSER =====
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ===== HEALTH CHECK =====
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ===== ROTAS =====
app.use('/api/auth', authRoutes);
app.use('/api/texts', textRoutes);

// ===== ROTA 404 =====
app.use((req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.path,
    method: req.method,
  });
});

// ===== ERROR HANDLER =====
app.use(errorHandler);

// ===== INICIAR SERVIDOR =====
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
  console.log(`📊 Health check em http://localhost:${PORT}/health`);
  console.log(`🔐 Ambiente: ${process.env.NODE_ENV}`);
});

export default app;
