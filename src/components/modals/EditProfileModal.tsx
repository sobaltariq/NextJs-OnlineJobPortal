import MyApi from "@/api/MyApi";
import { waitSec } from "@/utils/CommonWait";
import {
  ErrorMessage,
  Field,
  FieldArray,
  Form,
  Formik,
  FormikHelpers,
} from "formik";
import React, { useState, useEffect } from "react";
import * as Yup from "yup";

interface ModalProps {
  isEditProfileModalOpen: boolean;
  setIsEditProfileModalOpen: (value: boolean) => void;
}

interface FormValues {
  education: string;
  skills: string[];
  workExperience: string;
}

const EditProfileModal: React.FC<ModalProps> = ({
  isEditProfileModalOpen,
  setIsEditProfileModalOpen,
}) => {
  const [changePassError, setChangePassError] = useState<string>("");

  const initialValues: FormValues = {
    education: "",
    skills: [""],
    workExperience: "",
  };

  const validationSchema = Yup.object().shape({
    education: Yup.string().trim().required("Education is required"),
    skills: Yup.array().of(Yup.string().trim().required("Skill is required")),
    workExperience: Yup.string().trim().required("Work experience is required"),
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
      setIsEditProfileModalOpen(false);

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
  const onSubmit = (values: FormValues) => {
    console.log("Form data", values);
  };
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape" && isEditProfileModalOpen) {
      setIsEditProfileModalOpen(false);
    }
  };

  // Add event listener for escape key press to close modal
  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isEditProfileModalOpen]);

  function setFieldValue(arg0: string, arg1: any[]): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center ${
        isEditProfileModalOpen ? "block" : "hidden"
      }`}
    >
      <div className="relative bg-white rounded-xl p-4 shadow-lg w-96 z-51 ">
        <div className="border-solid border-2 border-sky-500 p-4 rounded-lg">
          <h1>Change Password</h1>
          {changePassError && <p className="">{changePassError}</p>}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting, values, resetForm }) => (
              <Form>
                <div className="mt-4">
                  <Field
                    type="text"
                    id="education"
                    name="education"
                    placeholder="Education"
                  />
                  <ErrorMessage name="education" component="div" />
                </div>
                <div>
                  <label>Skills</label>
                  <FieldArray name="skills">
                    {({ remove, push }) => (
                      <div>
                        {values.skills.map((skill, index) => (
                          <div key={index}>
                            {" "}
                            {/* Add unique key prop */}
                            <Field name={`skills[${index}]`} type="text" />
                            <ErrorMessage
                              name={`skills[${index}]`}
                              component="div"
                            />{" "}
                            {/* Correct field name */}
                            <button type="button" onClick={() => remove(index)}>
                              Remove
                            </button>
                          </div>
                        ))}
                        <button type="button" onClick={() => push("")}>
                          Add Skill
                        </button>
                      </div>
                    )}
                  </FieldArray>
                </div>
                <div className="mt-4 mb-4">
                  <Field
                    type="text"
                    id="workExperience"
                    name="workExperience"
                    placeholder="Work Experience in Years"
                  />
                  <ErrorMessage name="workExperience" component="div" />
                </div>

                <div className="flex gap-8">
                  <button type="submit" disabled={isSubmitting}>
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditProfileModalOpen(false);
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
