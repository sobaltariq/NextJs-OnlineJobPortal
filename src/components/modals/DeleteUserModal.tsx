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
      className={`modal-container fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center ${
        accountDeleteModal ? "block" : "hidden"
      }`}
    >
      <div className="modal-wrapper relative">
        <div className="">
          <div className="flex justify-center flex-col items-center">
            <h3>Are You Sure</h3>
            <p>Confirm to delete your account</p>
          </div>
          <div className="flex justify-between pt-8">
            <button
              onClick={() => {
                setAccountDeleteModal(false);
              }}
            >
              Cancel
            </button>
            <button className="del-btn" onClick={deleteProfileHandler}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;
