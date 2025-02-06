import React from "react";

interface ModalProps {
  showModal: boolean;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmationModal: React.FC<ModalProps> = ({
  showModal,
  message,
  onClose,
  onConfirm,
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4 text-red-500">Confirmation</h2>
        <p className="mb-4">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
