import React, { useState, useEffect } from "react";

interface ModalProps {
  accountDeleteModal: boolean;
  setAccountDeleteModal: (value: boolean) => void;
  deleteProfileHandler?: () => void;
}

const DeleteUserModal: React.FC<ModalProps> = ({
  accountDeleteModal,
  setAccountDeleteModal,
  deleteProfileHandler,
}) => {
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape" && accountDeleteModal) {
      setAccountDeleteModal(false);
    }
  };

  //   useEffect(() => {}, [accountDeleteModal]);

  // Add event listener for escape key press to close modal
  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [accountDeleteModal]);

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center ${
        accountDeleteModal ? "block" : "hidden"
      }`}
    >
      <div className="relative bg-white rounded-xl p-4 shadow-lg w-96 z-51 ">
        <div className="border-solid border-2 border-sky-500 p-4 rounded-lg">
          <div className="flex justify-center flex-col items-center gap-4 mb-6">
            <p>Are You Sure</p>
            <p>Confirm to delete your account</p>
          </div>
          <div className="flex justify-between">
            <button
              onClick={() => {
                setAccountDeleteModal(false);
              }}
            >
              Cancel
            </button>
            <button onClick={deleteProfileHandler}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;