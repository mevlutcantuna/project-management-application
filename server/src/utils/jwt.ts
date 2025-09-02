import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret-key";

export interface JWTPayload {
  sub: string;
  iat: number;
  exp: number;
}

export function generateToken(
  payload: Omit<JWTPayload, "iat" | "exp">,
  expiresIn: number
): string {
  const now = Math.floor(Date.now() / 1000);

  const tokenPayload = {
    ...payload,
    iat: now,
    exp: now + expiresIn,
  };

  return jwt.sign(tokenPayload, JWT_SECRET);
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

    return decoded;
  } catch (error) {
    console.error(`Error verifying token:`, error);
    return null;
  }
}

export function extractTokenFromHeader(
  authHeader: string | undefined
): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.substring(7); // Remove "Bearer " prefix
}
