import fs from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";

// Function to extract pages and save the new PDF
export const extractPages = async (
  pdfFile: Express.Multer.File,
  pages: number[]
): Promise<string> => {
  try {
    const storageDir = path.join(__dirname, "../uploads/pdf");

    // Ensure the storage directory exists
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }

    // Get the file path from the uploaded file
    const pdfPath = pdfFile.path;

    // Verify the file exists
    if (!fs.existsSync(pdfPath)) {
      throw new Error(`File not found at ${pdfPath}`);
    }

    console.log(`Reading PDF file from path: ${pdfPath}`);

    // Read the PDF file
    const existingPdfBytes = await fs.promises.readFile(pdfPath);
    const existingPdf = await PDFDocument.load(existingPdfBytes);

    if (!existingPdf) {
      throw new Error("Failed to load the existing PDF document.");
    }

    console.log(
      `Successfully loaded PDF. Number of pages: ${existingPdf.getPageCount()}`
    );

    // Convert pages to zero-based indices
    const pagesToExtract = pages.map((page) => page);

    // Ensure pages are valid
    for (const page of pagesToExtract) {
      if (page < 0 || page >= existingPdf.getPageCount()) {
        throw new Error(`Page ${page + 1} is out of bounds.`);
      }
    }

    // Create a new PDF document
    const newPdf = await PDFDocument.create();

    // Copy the selected pages to the new PDF
    for (const pageNum of pagesToExtract) {
      const [copiedPage] = await newPdf.copyPages(existingPdf, [pageNum]);
      newPdf.addPage(copiedPage);
    }

    // Save the new PDF to the server
    const newPdfBytes = await newPdf.save();
    const newFilePath = path.join(storageDir, `${Date.now()}-extracted.pdf`);

    await fs.promises.writeFile(newFilePath, newPdfBytes);
    console.log("new file path ", newFilePath);
    return newFilePath;
  } catch (error) {
    console.error("Error extracting PDF:", error);
    throw new Error("Failed to extract pages");
  }
};
