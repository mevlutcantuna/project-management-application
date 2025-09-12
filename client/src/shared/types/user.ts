export type UserRole = "Admin" | "Manager" | "Member";

export interface DecodedUser {
  sub: string;
  iat: number;
  exp: number;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string | null;
  createdAt: Date;
  updatedAt: Date;
}
