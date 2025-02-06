import { config } from "dotenv";
import jwt from "jsonwebtoken";

config();

export const generateToken = (name: string, id: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET not defined");
  }

  return jwt.sign({ name, id }, secret, { expiresIn: "30m" });
};

export const generateRefreshToken = (name: string, id: string): string => {
  const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
  if (!refreshSecret) {
    throw new Error("REFRESH_TOKEN_SECRET not defined");
  }
  return jwt.sign({ name, id }, refreshSecret, { expiresIn: "7d" });
};
