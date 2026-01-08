import jwt from 'jsonwebtoken';

export const generateAccessToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  return jwt.sign({ userId }, secret, {
    expiresIn: process.env.JWT_EXPIRE || '24h',
  } as jwt.SignOptions);
};

export const generateRefreshToken = (userId: string): string => {
  const secret = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
  return jwt.sign({ userId }, secret, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
  } as jwt.SignOptions);
};

export const verifyRefreshToken = (token: string): { userId: string } => {
  const secret = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
  return jwt.verify(token, secret) as { userId: string };
};
