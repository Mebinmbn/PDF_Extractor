import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "dotenv";

config();

interface UserPayload extends jwt.JwtPayload {
  name: string;
  id: string;
}
interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "No token, authorization denied" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;

    req.user = decoded;

    console.log("middleware touched", req.user);

    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      res.status(401).json({ message: "Token expired" });
      return;
    }
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default authMiddleware;
