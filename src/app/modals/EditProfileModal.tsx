import MyApi from "@/api/MyApi";
import { waitSec } from "@/utils/CommonWait";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import React, { useState, useEffect } from "react";
import * as Yup from "yup";

interface ModalProps {
  isPasswordModalOpen: boolean;
  setIsPasswordModalOpen: (value: boolean) => void;
}

interface FormValues {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const EditProfileModal: React.FC<ModalProps> = ({
  isPasswordModalOpen,
  setIsPasswordModalOpen,
}) => {
  const [changePassError, setChangePassError] = useState<string>("");

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

  const changePasswordHandler = async (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>
  ) => {
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
      setIsPasswordModalOpen(false);

      setChangePassError("");
      resetForm();
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

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape" && isPasswordModalOpen) {
      setIsPasswordModalOpen(false);
    }
  };

  // Add event listener for escape key press to close modal
  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isPasswordModalOpen]);

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center ${
        isPasswordModalOpen ? "block" : "hidden"
      }`}
    >
      <div className="relative bg-white rounded-xl p-4 shadow-lg w-96 z-51 ">
        <div className="border-solid border-2 border-sky-500 p-4 rounded-lg">
          <h1>Change Password</h1>
          {changePassError && <p className="">{changePassError}</p>}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={changePasswordHandler}
          >
            {({ isSubmitting, resetForm }) => (
              <Form>
                <div className="mt-4">
                  <Field
                    type="password"
                    id="oldPassword"
                    name="oldPassword"
                    placeholder="Old password"
                  />
                  <ErrorMessage name="oldPassword" component="div" />
                </div>
                <div className="mt-4 mb-4">
                  <Field
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    placeholder="New password"
                  />
                  <ErrorMessage name="newPassword" component="div" />
                </div>
                <div className="mt-4 mb-4">
                  <Field
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm password"
                  />
                  <ErrorMessage name="confirmPassword" component="div" />
                </div>

                <div className="flex gap-8">
                  <button type="submit" disabled={isSubmitting}>
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsPasswordModalOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
