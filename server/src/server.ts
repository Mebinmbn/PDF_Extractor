import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import dbConnect from "./config/database";
import cors from "cors";
import logger from "./config/logger";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import otpRoutes from "./routes/otpRoutes";
import tokenRouter from "./routes/tokenRoutes";
import path from "path";
import { createServer } from "http";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

const server = createServer(app);

dbConnect();

app.use(
  cors({
    credentials: true,
    origin: " http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "User-Type"],
  })
);
app.use(cookieParser());
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/token", tokenRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).json({ message: "Internal Server Error" });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
