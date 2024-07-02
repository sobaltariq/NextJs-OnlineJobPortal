"use client";
import MyApi from "@/api/MyApi";
import ChangePasswordModal from "@/components/modals/ChangePasswordModal";
import DeleteUserModal from "@/components/modals/DeleteUserModal";
import EditProfileModal from "@/components/modals/EditProfileModal";
import { logout } from "@/redux/features/auth/authSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

interface JobPostings {
  jobPostId: string;
  jobPostTitle: string;
}

interface ProfileData {
  message: string;
  employerId?: string;
  seekerId: string;
  userId: string;
  userRole: string;
  userName: string;
  userEmail: string;
  userCreatedAt: string;
  jobPostings: JobPostings[];
  seekerSkills: string[];
  seekerEducation: string;
  seekerWorkExperience: string;
  seekerSavedJobs: string[];
}

const UserProfile: React.FC = () => {
  const [showError, setShowError] = useState<string>("");
  const [apiData, setApiData] = useState<ProfileData | null>(null);

  const [accountDeleteModal, setAccountDeleteModal] = useState<boolean>(false);

  const [isPasswordModalOpen, setIsPasswordModalOpen] =
    useState<boolean>(false);

  const [isEditProfileModalOpen, setIsEditProfileModalOpen] =
    useState<boolean>(false);

  const router = useRouter();

  const dispatch = useDispatch();

  const getProfileHandler = async () => {
    try {
      const loginToken = localStorage?.getItem("login_token");
      const userType = localStorage?.getItem("user_role");

      const endPoint =
        userType === "admin"
          ? "/admin/"
          : userType === "employer"
          ? "/employer/"
          : "/job-seeker/";

      const response = await MyApi.get(`${endPoint}/profile`, {
        headers: {
          Authorization: `Bearer ${loginToken}`,
        },
      });
      console.log(response.data?.data);

      setApiData(response.data?.data);
    } catch (err: any) {
      setShowError(err.response.data?.message);
      console.log(err.response);

      console.error("Profile error:", err.response.data?.message);
    }
  };

  const deleteProfileHandler = async () => {
    try {
      const loginToken = localStorage?.getItem("login_token");
      const userType = localStorage?.getItem("user_role");

      const endPoint =
        userType === "admin"
          ? "/admin/"
          : userType === "employer"
          ? "/employer/"
          : "/job-seeker/";

      const response = await MyApi.delete(
        `${endPoint}/delete/${apiData?.userId}`,
        {
          headers: {
            Authorization: `Bearer ${loginToken}`,
          },
        }
      );

      localStorage.clear();
      console.log(response.data);
      setAccountDeleteModal(false);
      router.push("/login");
      dispatch(logout());
    } catch (err: any) {
      setShowError(err.response.data?.message);
      console.error("Delete User error:", err.response.data?.message);
    }
  };

  useEffect(() => {
    getProfileHandler();
  }, []);
  return (
    <div>
      {showError && <p>{showError}</p>}
      <div>
        <h1>Profile</h1>
        {apiData && (
          <div>
            <div>
              <p>Name: {apiData?.userName}</p>
              <p>Email: {apiData.userEmail}</p>
              <p>Role: {apiData.userRole}</p>
              <p>
                Registration Date:{" "}
                {new Date(apiData.userCreatedAt).toLocaleDateString()}
              </p>
              {/* for employer */}
              {apiData.userRole === "employer" && (
                <div className="flex gap-2">
                  <p>Job Postings: </p>{" "}
                  <div className="flex gap-4">
                    {apiData.jobPostings.length <= 0
                      ? "Empty"
                      : apiData.jobPostings.map((job, i) => {
                          return (
                            <Fragment key={i}>
                              <Link
                                href={`/jobs/${job.jobPostId}`}
                                className="bg-neutral-200 px-2"
                              >
                                {job.jobPostTitle}
                              </Link>{" "}
                            </Fragment>
                          );
                        })}
                  </div>
                </div>
              )}

              {/* for seeker */}
              {apiData.userRole === "job seeker" && (
                <>
                  <p>
                    Education:{" "}
                    {apiData.seekerEducation
                      ? apiData.seekerEducation
                      : "Empty"}
                  </p>
                  <p>
                    Work Experience:{" "}
                    {apiData.seekerWorkExperience
                      ? apiData.seekerWorkExperience
                      : "Empty"}
                  </p>
                  <p>
                    Saved Jobs:{" "}
                    {apiData.seekerSavedJobs.length > 0
                      ? apiData.seekerSavedJobs
                      : "Empty"}
                  </p>
                  <p className="flex gap-2 justify-items-center">
                    Skills:{" "}
                    {apiData.seekerSkills.length > 0
                      ? apiData.seekerSkills.map((item, i) => {
                          return (
                            <span
                              key={i}
                              className="bg-red-400 py-1 px-3 rounded"
                            >
                              {item}{" "}
                            </span>
                          );
                        })
                      : "Empty"}
                  </p>
                </>
              )}
            </div>

            {/* for deletion of a user */}
            <div>
              <button
                onClick={() => {
                  setAccountDeleteModal(true);
                }}
              >
                Delete Account
              </button>
              <DeleteUserModal
                accountDeleteModal={accountDeleteModal}
                setAccountDeleteModal={setAccountDeleteModal}
                deleteProfileHandler={deleteProfileHandler}
              />
            </div>

            {/* for password changing */}
            <div>
              <button
                onClick={() => {
                  setIsPasswordModalOpen(true);
                }}
              >
                Change Password
              </button>
              <ChangePasswordModal
                isPasswordModalOpen={isPasswordModalOpen}
                setIsPasswordModalOpen={setIsPasswordModalOpen}
              />
            </div>

            {/* Edit Profile */}
            {apiData.userRole === "job seeker" && (
              <div>
                <button
                  onClick={() => {
                    setIsEditProfileModalOpen(true);
                  }}
                >
                  Edit Profile
                </button>
                <EditProfileModal
                  userId={apiData.seekerId}
                  isEditProfileModalOpen={isEditProfileModalOpen}
                  setIsEditProfileModalOpen={setIsEditProfileModalOpen}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
