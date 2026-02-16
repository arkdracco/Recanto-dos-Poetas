export const errorHandler = (err, req, res, next) => {
  console.error('Erro:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Erro de validação
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Erro de validação',
      details: err.message,
    });
  }

  // Erro de banco de dados
  if (err.code === '23505') {
    // Violação de UNIQUE constraint
    return res.status(409).json({
      error: 'Registro duplicado',
      field: err.constraint,
    });
  }

  if (err.code === '23503') {
    // Violação de FOREIGN KEY
    return res.status(400).json({
      error: 'Referência inválida',
      details: err.message,
    });
  }

  // Erro genérico
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Erro interno do servidor'
    : err.message;

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.path,
    method: req.method,
  });
};

export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const validationError = (message) => {
  const error = new AppError(message, 400);
  error.name = 'ValidationError';
  return error;
};
