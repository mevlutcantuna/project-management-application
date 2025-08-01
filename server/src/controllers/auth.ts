import { Request, Response } from "express";

const register = (req: Request, res: Response) => {
  res.status(201).json({ message: "User created successfully" });
};

const login = (req: Request, res: Response) => {
  res.status(200).json({ message: "User logged in successfully" });
};

export { register, login };
