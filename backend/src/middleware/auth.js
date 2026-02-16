import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Token de autenticação não fornecido',
      });
    }

    const token = authHeader.substring(7);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expirado',
        expiredAt: error.expiredAt,
      });
    }
    
    return res.status(401).json({
      error: 'Token inválido',
    });
  }
};

export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    }
    
    next();
  } catch (error) {
    // Se o token for inválido, continua sem autenticação
    next();
  }
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Não autenticado',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Acesso negado. Permissão insuficiente.',
        required_roles: roles,
      });
    }

    next();
  };
};

export const requireAuthor = authenticate;

export const requireAdmin = (req, res, next) => {
  authenticate(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Acesso exclusivo de administradores',
      });
    }
    next();
  });
};
