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
  jobId: string;
  isEditJobModalOpen: boolean;
  setIsEditJobModalOpen: (value: boolean) => void;
}

interface FormValues {
  title: string;
  description: string;
  companyName: string;
  requirements: string[];
  location: string;
  salary: string;
}

const EditJobModal: React.FC<ModalProps> = ({
  jobId,
  isEditJobModalOpen,
  setIsEditJobModalOpen,
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

  const validationSchema = Yup.object().shape({
    title: Yup.string().trim().required("Title is required"),
    description: Yup.string().trim().required("Description is required"),
    companyName: Yup.string().trim().required("Company Name is required"),
    requirements: Yup.array().of(
      Yup.string().trim().required("Requirements are required")
    ),
    location: Yup.string().trim().required("Location is required"),
    salary: Yup.string().trim().required("Salary is required"),
  });

  const editJobHandler = async (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>
  ) => {
    const loginToken = localStorage.getItem("login_token");
    try {
      const response = await MyApi.put(
        `/employer/job-postings/${jobId}`,
        values,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${loginToken}`,
          },
        }
      );

      console.log(response.data);
      setShowError(response.data?.message);

      await waitSec(3000);
      setIsEditJobModalOpen(false);

      setShowError("");
      resetForm();
    } catch (err: any) {
      setShowError(
        err.response.data?.message || err.response.data?.errors[0].msg
      );
      console.error(
        "Edit Job error:",
        err.response.data?.message || err.response.data?.errors[0].msg
      );
    }
  };

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape" && isEditJobModalOpen) {
      setIsEditJobModalOpen(false);
    }
  };

  // Add event listener for escape key press to close modal
  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isEditJobModalOpen]);

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center ${
        isEditJobModalOpen ? "block" : "hidden"
      }`}
    >
      <div className="relative bg-white rounded-xl p-4 shadow-lg w-96 z-51 ">
        <div className="border-solid border-2 border-sky-500 p-4 rounded-lg">
          <h1>Edit Job</h1>
          {showError && <p className="">{showError}</p>}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={editJobHandler}
          >
            {({ isSubmitting, values, resetForm }) => (
              <Form>
                <div className="mt-4">
                  <Field
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Title"
                  />
                  <ErrorMessage name="title" component="div" />
                </div>
                <div className="mt-4">
                  <Field
                    type="text"
                    id="description"
                    name="description"
                    placeholder="Description"
                  />
                  <ErrorMessage name="description" component="div" />
                </div>
                <div className="mt-4">
                  <Field
                    type="text"
                    id="companyName"
                    name="companyName"
                    placeholder="Company Name"
                  />
                  <ErrorMessage name="companyName" component="div" />
                </div>
                <div className="mt-4 ">
                  <FieldArray name="requirements">
                    {({ remove, push }) => (
                      <div>
                        {values.requirements.map(
                          (requirement: any, index: number) => (
                            <div key={index}>
                              {" "}
                              {/* Add unique key prop */}
                              <Field
                                name={`requirements[${index}]`}
                                type="text"
                                placeholder="Add requirement"
                              />
                              <ErrorMessage
                                name={`requirements[${index}]`}
                                component="div"
                              />{" "}
                              {/* Correct field name */}
                              <button
                                type="button"
                                onClick={() => remove(index)}
                              >
                                Remove
                              </button>
                            </div>
                          )
                        )}
                        <button type="button" onClick={() => push("")}>
                          Add requirement
                        </button>
                      </div>
                    )}
                  </FieldArray>
                </div>
                <div className="mt-4 mb-4">
                  <Field
                    type="text"
                    id="location"
                    name="location"
                    placeholder="Location"
                  />
                  <ErrorMessage name="location" component="div" />
                </div>
                <div className="mt-4 mb-4">
                  <Field
                    type="text"
                    id="salary"
                    name="salary"
                    placeholder="Salary"
                  />
                  <ErrorMessage name="salary" component="div" />
                </div>

                <div className="flex gap-8">
                  <button type="submit" disabled={isSubmitting}>
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditJobModalOpen(false);
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

export default EditJobModal;
