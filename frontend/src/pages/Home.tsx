import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import image from "../assets/login_background.jpg";
import { useDropzone } from "react-dropzone";
import * as pdfjsLib from "pdfjs-dist";
import api from "../api/api";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

function Home() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [extractedPdfUrl, setExtractedPdfUrl] = useState<string | null>(null);
  const [pdfDocument, setPdfDocument] =
    useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();
  const userId = user?.id;

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  });

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const allowedTypes = ["application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload a PDF.");
      return;
    }
    setPdfFile(file);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      setPdfDocument(pdf);
      setTotalPages(pdf.numPages);
    };
    reader.readAsArrayBuffer(file);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    // accept: ".pdf",
  });

  const handlePageSelection = (pageIndex: number) => {
    setSelectedPages((prev) => {
      const newPages = new Set(prev);
      if (newPages.has(pageIndex)) {
        newPages.delete(pageIndex);
      } else {
        newPages.add(pageIndex);
      }
      return newPages;
    });
  };

  const handlePageClick = (pageIndex: number) => {
    handlePageSelection(pageIndex);
  };

  useEffect(() => {
    if (pdfDocument) {
      const renderPages = async () => {
        for (let i = 1; i <= totalPages; i++) {
          const page = await pdfDocument.getPage(i);
          const canvas = document.getElementById(
            `page-${i}`
          ) as HTMLCanvasElement;
          const context = canvas?.getContext("2d");
          const viewport = page.getViewport({ scale: 1 });
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          page.render({
            canvasContext: context!,
            viewport,
          });
        }
      };
      renderPages();
    }
  }, [pdfDocument, totalPages]);

  const handleExtractPdf = async () => {
    if (!pdfFile || selectedPages.size === 0) {
      toast.error("Select the pages to be extracted");
      return;
    }

    if (!userId) {
      return;
    }

    const formData = new FormData();
    formData.append("pdf", pdfFile);
    formData.append("pages", JSON.stringify(Array.from(selectedPages)));
    formData.append("userId", userId);

    try {
      const response = await api.post("users/extract-pdf", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
      toast.success("File extracted successfully");
      const url = response.data.fileReference.fileReference;
      const fileUrl = `http://localhost:8080${url}`;
      setExtractedPdfUrl(fileUrl);
      setSelectedPages(new Set());
    } catch (error) {
      console.error("Error extracting PDF:", error);
    }
  };

  return (
    <div
      className="bg-cover max-w-full h-fit overflow-hidden backdrop-blur-xl bg-opacity-50 min-h-screen"
      style={{ backgroundImage: `url('${image}')` }}
    >
      <Navbar />
      <div className="w-full max-w-8xl mx-auto gap-2 px-10 pt-20 min-h-[80%]">
        <div className="w-full col-span-4 mb-2 drop-shadow-lg p-2 text-center mt-4">
          {!pdfFile && (
            <div>
              <p className="font-extrabold text-6xl text-white text-shadow-lg">
                Extract Pages From PDF
              </p>
              <p className="text-lg font-bold text-gray-200 mt-8">
                Get a new document containing only the desired pages
              </p>
            </div>
          )}
          <div className=" w-fit mx-auto">
            {!pdfFile && (
              <div {...getRootProps()} className="mt-10">
                <input {...getInputProps()} />
                <label className="flex flex-col items-center px-20 py-8 bg-white text-blue-500 rounded-lg shadow-lg tracking-wide uppercase border border-blue-500 cursor-pointer hover:bg-blue-500 hover:text-white">
                  <svg
                    className="w-12 h-12"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M16.88 6.88A3 3 0 0015 6H5a3 3 0 000 6h10a3 3 0 001.88-.88zM4.5 4h11a3.5 3.5 0 000-7h-11A3.5 3.5 0 001 4.5v11a3.5 3.5 0 007 0v-2A3.5 3.5 0 014.5 4zM3 5.5V4.5A2.5 2.5 0 015.5 2h9a2.5 2.5 0 012.5 2.5v1a2.5 2.5 0 01-2.5 2.5h-9A2.5 2.5 0 013 5.5z"></path>
                  </svg>
                  <span className="mt-2 text-lg leading-normal">
                    Select or drop a PDF
                  </span>
                </label>
              </div>
            )}

            {pdfFile && (
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-200 mt-8">
                  Select Pages to Extract:
                </h3>
                <div className="flex flex-wrap justify-center mt-3 h-[70vh] overflow-auto hide-scrollbar bg-gray-400 w-[90vw]">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <div key={index} className="mb-2 mr-4">
                      <label
                        className={`w-10 text-bold text-white cursor-pointer ${
                          selectedPages.has(index) ? "bg-blue-500 p-1" : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedPages.has(index)}
                          onChange={() => handlePageSelection(index)}
                          className="mr-1 "
                        />
                        {index + 1}
                      </label>
                      <canvas
                        id={`page-${index + 1}`}
                        className={`w-52 shadow-lg click:w-80 transition-all duration-300 ${
                          selectedPages.has(index)
                            ? "border-4 border-blue-500"
                            : ""
                        }`}
                        onClick={() => handlePageClick(index)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="fixed top-20 w-full">
        <div className="text-center h-fit flex justify-center gap-2">
          {pdfFile && (
            <button
              onClick={handleExtractPdf}
              className="bg-blue-500 p-1 px-2 text-white rounded-lg hover:bg-blue-400"
            >
              Extract Selected Pages
            </button>
          )}
          {extractedPdfUrl && (
            <div className="mt-1">
              <a
                href={extractedPdfUrl}
                download="extracted.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white px-2 p-1 rounded-lg hover:bg-green-400"
              >
                Download Extracted PDF
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
