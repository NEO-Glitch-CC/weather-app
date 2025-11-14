import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const DEFAULT_EXPIRES_SECONDS = 60 * 60 * 24 * 30; // 30 days

export function signToken(payload: object, expiresInSeconds = DEFAULT_EXPIRES_SECONDS) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresInSeconds });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch (err) {
    return null;
  }
}
