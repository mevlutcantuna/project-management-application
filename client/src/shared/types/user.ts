export interface DecodedUser {
  sub: string;
  iat: number;
  exp: number;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  profilePicture: string | null;
  createdAt: Date;
  updatedAt: Date;
}
