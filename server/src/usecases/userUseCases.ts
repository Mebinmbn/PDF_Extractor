import userRepository from "../repositories/userRepository";

import { extractPages } from "../services/pdfService";

export const getUser = async (id: string) => {
  try {
    return await userRepository.fetchUserDetails(id);
  } catch (error) {
    throw new Error("Error in fetching user details");
  }
};

export const extractAndStorePdf = async (
  file: Express.Multer.File,
  pages: number[],
  userId: string
) => {
  console.log("In useCases", file, pages, userId);
  const extractedPdfPath = await extractPages(file, pages);
  return userRepository.storeExtractedPdf(userId, extractedPdfPath);
};

export const getUserPdfs = async (id: string, page: number, limit: number) => {
  try {
    return await userRepository.fetchUserPdfs(id, page, limit);
  } catch (error) {
    throw new Error("Error in fetching user pdfs");
  }
};

export const deleteUserPdf = async (id: string) => {
  try {
    return await userRepository.deletePdf(id);
  } catch (error) {
    throw new Error("Error in deleting user pdf");
  }
};
