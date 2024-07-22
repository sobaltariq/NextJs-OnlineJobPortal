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
  userId: string;
  isEditProfileModalOpen: boolean;
  setIsEditProfileModalOpen: (value: boolean) => void;
}

interface FormValues {
  education: string;
  skills: string[];
  workExperience: string;
}

const EditProfileModal: React.FC<ModalProps> = ({
  userId,
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

  const editProfileHandler = async (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>
  ) => {
    const loginToken = localStorage.getItem("login_token");
    const userType = localStorage.getItem("user_role");
    try {
      const endPoint =
        userType === "employer"
          ? `/employer/profile/${userId}`
          : `/job-seeker/profile/${userId}`;

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
      setChangePassError(
        err.response.data?.message || err.response.data?.errors[0].msg
      );
      console.error(
        "Edit seeker error:",
        err.response.data?.message || err.response.data?.errors[0].msg
      );
    }
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

  return (
    <div
      className={`modal-container fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center ${
        isEditProfileModalOpen ? "block" : "hidden"
      }`}
    >
      <div className="modal-wrapper relative">
        <div className="">
          <h3>Edit Profile</h3>
          {changePassError && <p className="">{changePassError}</p>}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={editProfileHandler}
          >
            {({ isSubmitting, values, resetForm }) => (
              <Form>
                <div className="">
                  <Field
                    type="text"
                    id="education"
                    name="education"
                    placeholder="Education"
                  />
                  <ErrorMessage name="education" component="div" />
                </div>
                <div className="my-4 ">
                  <FieldArray name="skills">
                    {({ remove, push }) => (
                      <div className="req">
                        {values.skills.map((skill, index) => (
                          <div key={index}>
                            {" "}
                            {/* Add unique key prop */}
                            <Field
                              name={`skills[${index}]`}
                              type="text"
                              placeholder="Add Skill"
                            />
                            <ErrorMessage
                              name={`skills[${index}]`}
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
                <div className="">
                  <Field
                    type="text"
                    id="workExperience"
                    name="workExperience"
                    placeholder="Work Experience in Years"
                  />
                  <ErrorMessage name="workExperience" component="div" />
                </div>

                <div className="flex justify-between pt-8">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditProfileModalOpen(false);
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

export default EditProfileModal;
