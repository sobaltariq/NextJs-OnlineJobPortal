import MyApi from "@/api/MyApi";
import { waitSec } from "@/utils/CommonWait";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useState, useEffect } from "react";
import * as Yup from "yup";

interface ModalProps {
  accountDeleteModal: boolean;
  handleCloseModal?: () => void;
}

interface FormValues {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePasswordModal: React.FC<ModalProps> = ({
  accountDeleteModal,
  handleCloseModal,
}) => {
  const [changePassError, setChangePassError] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState(accountDeleteModal);

  const initialValues: FormValues = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Old password is required"),
    newPassword: Yup.string()
      .min(8, "New Password must be at least 8 characters")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .min(8, "Confirm Password must be at least 8 characters")
      .required("New password is required"),
  });

  const changePasswordHandler = async (values: FormValues) => {
    const loginToken = localStorage.getItem("login_token");
    const userType = localStorage.getItem("user_role");
    try {
      const endPoint =
        userType === "admin"
          ? "/admin/change-password"
          : userType === "employer"
          ? "/employer/change-password"
          : "/job-seeker/change-password";

      const response = await MyApi.put(endPoint, values, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginToken}`,
        },
      });

      console.log(response.data);
      setChangePassError(response.data?.message);

      await waitSec(3000);
    } catch (err: any) {
      if (err.response && err.response.data) {
        if (!err.response.data.errors) {
          setChangePassError(err.response.data?.message);
          console.log(err.response.data?.message);
        } else {
          setChangePassError(err.response.data?.errors[0].msg);
          console.error("Login error:", err.response.data);
        }
      }
      setChangePassError(
        err.response.data?.message ||
          err.response.data.errors[0].msg ||
          "An unknown error occurred"
      );
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    handleCloseModal?.(); // Call provided onClose function if exists
  };

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape" && isModalOpen) {
      handleClose();
    }
  };

  // Sync isModalOpen with open prop
  useEffect(() => {
    setIsModalOpen(accountDeleteModal);
  }, [accountDeleteModal]);

  // Add event listener for escape key press to close modal
  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isModalOpen]);

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center ${
        isModalOpen ? "block" : "hidden"
      }`}
    >
      <div className="relative bg-white rounded-xl p-4 shadow-lg w-96 z-51 ">
        <div className="border-solid border-2 border-sky-500 p-4 rounded-lg">
          <h1>Change Password</h1>
          {changePassError && <p className="error">{changePassError}</p>}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={changePasswordHandler}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mt-4">
                  <Field
                    type="password"
                    id="oldPassword"
                    name="oldPassword"
                    placeholder="old password"
                  />
                  <ErrorMessage name="oldPassword" component="div" />
                </div>
                <div className="mt-4 mb-4">
                  <Field
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    placeholder="new password"
                  />
                  <ErrorMessage name="newPassword" component="div" />
                </div>
                <div className="mt-4 mb-4">
                  <Field
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="confirm password"
                  />
                  <ErrorMessage name="confirmPassword" component="div" />
                </div>

                <div className="flex gap-8">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    onClick={() => {}}
                  >
                    Save
                  </button>
                  <button onClick={handleClose}>Cancel</button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
