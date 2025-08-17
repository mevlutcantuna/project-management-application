import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret-key";

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN
  ? (process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"])
  : "7d";

export interface JWTPayload {
  id: string;
  email: string;
}

export function generateToken(payload: JWTPayload): string {
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

    return {
      id: decoded.id,
      email: decoded.email,
    };
  } catch (error) {
    console.error("Error verifying token:", error);
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
