"use client";
import MyApi from "@/api/MyApi";
import ChangePasswordModal from "@/components/modals/ChangePasswordModal";
import DeleteUserModal from "@/components/modals/DeleteUserModal";
import EditProfileModal from "@/components/modals/EditProfileModal";
import { logout } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

interface ProfileData {
  message: string;
  employerId?: string;
  seekerId: string;
  userId?: string;
  role: string;
  name: string;
  email: string;
  createdAt: string;
  jobPostings: string;
  skills: string[];
  savedJobs: string[];
  education: string;
  workExperience: string;
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
      console.log(response.data);

      setApiData(response.data);
    } catch (err: any) {
      setShowError(err.response.data?.message);
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
              <p>Name: {apiData.name}</p>
              <p>Email: {apiData.email}</p>
              <p>Role: {apiData.role}</p>
              <p>
                Registration Date:{" "}
                {new Date(apiData.createdAt).toLocaleDateString()}
              </p>
              {/* for employer */}
              {apiData.role === "employer" && (
                <p>
                  Job Postings:{" "}
                  {apiData.jobPostings.length > 0
                    ? apiData.jobPostings
                    : "Empty"}
                </p>
              )}

              {/* for seeker */}
              {apiData.role === "job seeker" && (
                <>
                  <p>Education: {apiData.education}</p>
                  <p>Work Experience: {apiData.workExperience}</p>
                  <p>
                    Saved Jobs:{" "}
                    {apiData.savedJobs.length > 0 ? apiData.savedJobs : "Empty"}
                  </p>
                  <p className="flex gap-2 justify-items-center">
                    Skills:{" "}
                    {apiData.skills.length > 0
                      ? apiData.skills.map((item, i) => {
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
            {apiData.role === "job seeker" && (
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
