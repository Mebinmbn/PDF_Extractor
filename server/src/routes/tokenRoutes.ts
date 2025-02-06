import express from "express";
import tokenController from "../controllers/tokenController";

const router = express.Router();

router.post("/", tokenController.refreshtoken);

export default router;
