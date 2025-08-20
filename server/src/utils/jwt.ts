import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret-key";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key";

export interface JWTPayload {
  id: string;
  email: string;
  full_name: string;
  type: "access" | "refresh";
  iat: number;
  exp: number;
}

export function generateToken(
  payload: Omit<JWTPayload, "type" | "iat" | "exp">,
  type: "access" | "refresh" = "access"
): string {
  const now = Math.floor(Date.now() / 1000);
  const expiration =
    type === "access"
      ? now + 6 * 60 * 60 // 6 hours
      : now + 7 * 24 * 60 * 60; // 7 days

  const tokenPayload = {
    ...payload,
    type,
    iat: now,
    exp: expiration,
  };

  const secret = type === "access" ? JWT_SECRET : JWT_REFRESH_SECRET;
  return jwt.sign(tokenPayload, secret);
}

export function verifyToken(
  token: string,
  type: "access" | "refresh" = "access"
): JWTPayload | null {
  try {
    const secret = type === "access" ? JWT_SECRET : JWT_REFRESH_SECRET;
    const decoded = jwt.verify(token, secret) as JWTPayload;

    if (decoded.type !== type) {
      return null;
    }

    return decoded;
  } catch (error) {
    console.error(`Error verifying ${type} token:`, error);
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
