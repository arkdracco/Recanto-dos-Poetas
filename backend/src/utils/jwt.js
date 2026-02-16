import jwt from 'jsonwebtoken';

export const generateTokens = (userId, email, role) => {
  const accessToken = jwt.sign(
    { id: userId, email, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '15m' }
  );

  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
  );

  return { accessToken, refreshToken };
};

export const verifyToken = (token, secret = process.env.JWT_SECRET) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};

export const generateToken = (payload, secret = process.env.JWT_SECRET, expiresIn = '15m') => {
  return jwt.sign(payload, secret, { expiresIn });
};

export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};
