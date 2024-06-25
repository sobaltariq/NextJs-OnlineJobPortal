import MyApi from "@/api/MyApi";
import { waitSec } from "@/utils/CommonWait";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";

interface UserProfileProps {
  setChangePassword?: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FormValues {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword: React.FC<UserProfileProps> = ({ setChangePassword }) => {
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

      setChangePassword?.(false);
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

  return (
    <div>
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
                onClick={() => {
                  setChangePassword?.(true);
                }}
              >
                Save
              </button>
              <button
                onClick={() => {
                  setChangePassword?.(false);
                }}
              >
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ChangePassword;
