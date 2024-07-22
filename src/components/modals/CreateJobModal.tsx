"use client";
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
import React, { useEffect, useState } from "react";
import * as yup from "yup";

interface ModalProps {
  isPostJobModalOpen: boolean;
  setIsPostJobModalOpen: (value: boolean) => void;
}

interface FormValues {
  title: string;
  description: string;
  companyName: string;
  requirements: string[];
  location: string;
  salary: string;
}

const CreateJobModal: React.FC<ModalProps> = ({
  isPostJobModalOpen,
  setIsPostJobModalOpen,
}) => {
  const [showError, setShowError] = useState<string>("");

  const initialValues: FormValues = {
    title: "",
    description: "",
    companyName: "",
    requirements: [""],
    location: "",
    salary: "",
  };

  const jobPostingSchema = yup.object().shape({
    title: yup.string().required("Title is required"),
    description: yup.string().required("Description is required"),
    companyName: yup.string().required("Company name is required"),
    requirements: yup
      .array()
      .of(yup.string().required("Requirement is required")),
    location: yup.string().required("Location is required"),
    salary: yup.string().required("Salary is required"),
  });

  const createPostHandler = async (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>
  ) => {
    const loginToken = localStorage.getItem("login_token");
    const userType = localStorage.getItem("user_role");
    try {
      const endPoint = "/employer/job-postings";

      const response = await MyApi.post(endPoint, values, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginToken}`,
        },
      });

      console.log(response.data);
      setIsPostJobModalOpen(response.data?.message);

      await waitSec(3000);
      setIsPostJobModalOpen(false);

      setShowError("");
      resetForm();
    } catch (err: any) {
      if (err.response && err.response.data) {
        if (!err.response.data.errors) {
          setShowError(err.response.data?.message);
          console.log(err.response.data?.message);
        } else {
          setShowError(err.response.data?.errors[0].msg);
          console.error("Login error:", err.response.data);
        }
      }
      setShowError(
        err.response.data?.message ||
          err.response.data.errors[0].msg ||
          "An unknown error occurred"
      );
    }
  };

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape" && isPostJobModalOpen) {
      setIsPostJobModalOpen(false);
    }
  };

  // Add event listener for escape key press to close modal
  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isPostJobModalOpen]);

  return (
    <div
      className={`modal-container fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center ${
        isPostJobModalOpen ? "block" : "hidden"
      }`}
    >
      <div className="modal-wrapper relative w-2/5">
        <div className="border-solid border-2 border-sky-500 p-4 rounded-lg">
          <h2>Create New Job</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={jobPostingSchema}
            onSubmit={createPostHandler}
          >
            {({ isSubmitting, values, resetForm }) => (
              <Form className="pt-4">
                <div className="">
                  <Field
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Title"
                  />
                  <ErrorMessage name="title" component="div" />
                </div>
                <div className="my-4">
                  <Field
                    type="text"
                    id="description"
                    name="description"
                    placeholder="Description"
                  />
                  <ErrorMessage name="description" component="div" />
                </div>
                <div className="">
                  <Field
                    type="text"
                    id="companyName"
                    name="companyName"
                    placeholder="Company Name"
                  />
                  <ErrorMessage name="companyName" component="div" />
                </div>
                <div className="my-4">
                  <FieldArray name="requirements">
                    {({ remove, push }) => (
                      <div className="req">
                        {values.requirements.map((skill, index) => (
                          <div key={index}>
                            {" "}
                            {/* Add unique key prop */}
                            <Field
                              name={`requirements[${index}]`}
                              type="text"
                              placeholder="Requirements"
                            />
                            <ErrorMessage
                              name={`requirements[${index}]`}
                              component="div"
                            />{" "}
                            {/* Correct field name */}
                            <div className="flex justify-between pt-2">
                              <button
                                type="button"
                                onClick={() => remove(index)}
                              >
                                Remove
                              </button>
                              <button type="button" onClick={() => push("")}>
                                Add Skill
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </FieldArray>
                </div>
                <div className="flex justify-between gap-4">
                  <div className="">
                    <Field
                      type="text"
                      id="location"
                      name="location"
                      placeholder="Location"
                    />
                    <ErrorMessage name="location" component="div" />
                  </div>
                  <div className="">
                    <Field
                      type="text"
                      id="salary"
                      name="salary"
                      placeholder="Salary"
                    />
                    <ErrorMessage name="salary" component="div" />
                  </div>
                </div>

                <div className="flex justify-between pt-8">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPostJobModalOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting}>
                    Save
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

export default CreateJobModal;
