import express from "express";
import authMiddleware from "../middlewares/authMiddleware";
import userController from "../controllers/userController";
import upload from "../services/multerService";

const router = express.Router();

router.get("/userData/:id", authMiddleware, userController.user);

router.post(
  "/extract-pdf",
  authMiddleware,
  upload.single("pdf"),
  userController.extractFile
);

router.get("/pdfs/:id", authMiddleware, userController.getPdfs);

router.delete("/pdfs/:id", authMiddleware, userController.deletePdfs);

export default router;
