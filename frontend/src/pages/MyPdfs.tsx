import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import icon from "../assets/pdf_icon.png";

import api from "../api/api";

import UserNav from "../components/UserNav";
import { toast } from "react-toastify";

import ConfirmationModal from "../components/ConfirmationModal";

import { PDF } from "../types";

function MyPdfs() {
  const [pdfs, setPdfs] = useState<PDF[]>([]);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmationCallback, setConfirmationCallback] = useState<() => void>(
    () => () => {}
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [message, setMessage] = useState("");
  const user = useSelector((state: RootState) => state.user.user);
  const limit = 10;

  const fetchPdfs = useCallback(async () => {
    try {
      const response = await api.get(
        `/users/pdfs/${user?.id}?page=${currentPage}&${limit}`
      );
      if (response.data.success) {
        setPdfs(response.data.pdfs);
        setTotalPages(response.data.meta.totalPages);
        console.log(pdfs);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchPdfs();
  }, [currentPage]);

  const showConfirmationModal = (message: string, onConfirm: () => void) => {
    setMessage(message);
    setIsConfirmModalOpen(true);
    setConfirmationCallback(() => onConfirm);
  };
  const handleDelete = async (id: string) => {
    console.log("handledelete");
    showConfirmationModal("Do you want to delete?", async () => {
      try {
        const response = await api.delete(`/users/Pdfs/${id}`);
        if (response.data.success) {
          fetchPdfs();
          toast.success("Blog deleted Successfully");
        }
        setIsConfirmModalOpen(false);
      } catch (error) {
        console.log(error);
      }
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <UserNav />
      <div className="p-4 w-4/5 mx-auto mt-20">
        <table className="min-w-full bg-white border border-gray-300 ">
          <thead className="">
            <tr className="w-full bg-gray-200 text-center">
              <th className="p-2 border-r border-gray-300">Title</th>
              <th className="p-2 border-r border-gray-300">Date</th>
              <th className="p-2 border-r border-gray-300"></th>
              <th className="p-2 border-r border-gray-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {pdfs &&
              pdfs.map((pdf: PDF, index) => (
                <tr key={index} className="hover:bg-gray-100 border-b-2">
                  <td className="p-2 border-r border-gray-300">
                    {pdf.fileReference.split("/").pop()}
                  </td>
                  <td className="p-2 border-r border-gray-300">
                    {pdf.createdAt.toString().slice(0, 10)}
                  </td>
                  <td className="p-2 border-r border-gray-300 text-center">
                    <a
                      href={`http://localhost:8080${pdf.fileReference}`}
                      download="extracted.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className=" text-center"
                    >
                      <img src={icon} alt="pdf" className="h-10 mx-auto mt-4" />
                    </a>
                  </td>
                  <td className="p-2 border-r border-gray-300 text-center">
                    <button
                      className="bg-red-500 text-white p-1 rounded"
                      onClick={() => handleDelete(pdf._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {totalPages > limit && (
          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-2 py-1 mb-1 ${
                  currentPage === page
                    ? "bg-blue-500 text-white rounded-full"
                    : "text-black"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>

      <ConfirmationModal
        showModal={isConfirmModalOpen}
        message={message}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={() => {
          if (confirmationCallback) confirmationCallback();
          setIsConfirmModalOpen(false);
        }}
      />
    </div>
  );
}

export default MyPdfs;
