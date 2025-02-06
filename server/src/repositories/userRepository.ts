import path from "path";
import PDFModel from "../models/PDFModel";
import UserModel from "../models/userModel";
import { PDFDocument } from "pdf-lib";

const fetchUserDetails = async (id: string) => {
  try {
    return await UserModel.findOne({ _id: id });
  } catch (error) {
    throw new Error("Error in fetching user details");
  }
};

const storeExtractedPdf = async (userId: string, filePath: string) => {
  console.log("user repo", userId, filePath);
  const pdfEntry = {
    fileReference: `/uploads/pdf/${path.basename(filePath)}`,
    userId,
  };

  const newPdf = new PDFModel(pdfEntry);
  await newPdf.save();
  console.log(newPdf);
  return newPdf;
};

const fetchUserPdfs = async (id: string, page: number, limit: number) => {
  try {
    const pdfs = await PDFModel.find({ userId: id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    const totalDocs = await PDFModel.countDocuments();
    const totalPages = Math.ceil(totalDocs / limit);
    return { pdfs, totalDocs, totalPages };
  } catch (error) {
    throw new Error("Error in fetching pdfs");
  }
};

const deletePdf = async (id: string) => {
  try {
    return await PDFModel.deleteOne({ _id: id });
  } catch (error) {
    throw new Error("Error in deleting pdf");
  }
};

export default {
  fetchUserDetails,
  storeExtractedPdf,
  fetchUserPdfs,
  deletePdf,
};
