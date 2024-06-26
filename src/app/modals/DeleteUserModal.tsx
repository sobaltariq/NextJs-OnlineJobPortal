import React, { useState, useEffect } from "react";

interface ModalProps {
  accountDeleteModal: boolean;
  handleCloseModal?: () => void;
  deleteProfileHandler?: () => void;
}

const DeleteUserModal: React.FC<ModalProps> = ({
  accountDeleteModal,
  handleCloseModal,
  deleteProfileHandler,
}) => {
  const [isOpen, setIsOpen] = useState(accountDeleteModal);

  const handleClose = () => {
    setIsOpen(false);
    handleCloseModal?.(); // Call provided onClose function if exists
  };

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape" && isOpen) {
      handleClose();
    }
  };

  // Sync isOpen with open prop
  useEffect(() => {
    setIsOpen(accountDeleteModal);
  }, [accountDeleteModal]);

  // Add event listener for escape key press to close modal
  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div className="relative bg-white rounded-xl p-4 shadow-lg w-96 z-51 ">
        <div className="border-solid border-2 border-sky-500 p-4 rounded-lg">
          <div className="flex justify-center flex-col items-center gap-4 mb-6">
            <p>Are You Sure</p>
            <p>Confirm to delete your account</p>
          </div>
          <div className="flex justify-between">
            <button onClick={handleClose}>Cancel</button>
            <button onClick={deleteProfileHandler}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;
