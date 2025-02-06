import { Request, Response } from "express";
import {
  deleteUserPdf,
  extractAndStorePdf,
  getUser,
  getUserPdfs,
} from "../usecases/userUseCases";

const user = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await getUser(id);
    console.log("user", user);
    if (user) {
      res.status(200).json({
        success: true,
        user,
        message: "user detials collected successfully",
      });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
};

const extractFile = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log(req.file);
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const { userId } = req.body;
    let selectedPages: number[];

    try {
      selectedPages = JSON.parse(req.body.pages);
      console.log("Selected pages", selectedPages);
      if (!Array.isArray(selectedPages) || selectedPages.length === 0) {
        throw new Error("Invalid selected pages");
      }
    } catch (error) {
      res.status(400).json({ error: "Invalid selected pages format" });
      return;
    }

    if (!userId) {
      console.log("User ID is required");
      res.status(400).json({ error: "User ID is required" });
      return;
    }

    const fileReference = await extractAndStorePdf(
      req.file,
      selectedPages,
      userId
    );

    console.log("fileReference", fileReference);

    res.status(200).json({ success: true, fileReference });
  } catch (error) {
    console.error("Error extracting PDF:", error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

const getPdfs = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    console.log(id);

    const { pdfs, totalDocs, totalPages } = await getUserPdfs(id, page, limit);
    console.log(pdfs);
    if (pdfs) {
      res.status(200).json({
        success: true,
        pdfs,
        meta: { page, limit, totalDocs, totalPages },
        message: "successfully feteched user blogs",
      });
    }
  } catch (error) {
    console.error("Error extracting PDF:", error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

const deletePdfs = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const response = await deleteUserPdf(id);
    if (response) {
      res.status(200).json({ success: true, message: "Deleted successfully" });
    }
  } catch (error) {
    console.error("Error extracting PDF:", error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export default {
  user,
  extractFile,
  getPdfs,
  deletePdfs,
};
