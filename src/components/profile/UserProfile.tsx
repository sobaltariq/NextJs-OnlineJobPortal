"use client";
import MyApi from "@/api/MyApi";
import { logout } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

interface ProfileData {
  message: string;
  employerId?: string;
  userId?: string;
  role: string;
  name: string;
  email: string;
  createdAt: string;
  jobPostings?: string;
  skills: string[];
  savedJobs: string[];
}

interface UserProfileProps {
  setChangePassword?: React.Dispatch<React.SetStateAction<boolean>>; // Optional prop
}

const UserProfile: React.FC<UserProfileProps> = ({ setChangePassword }) => {
  const [showError, setShowError] = useState<string>("");
  const [apiData, setApiData] = useState<ProfileData | null>(null);

  const [isDeleted, setIsDeleted] = useState<boolean>(false);

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
      if (isDeleted) {
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
        router.push("/login");
        dispatch(logout());
      }
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
            {apiData.role === "job seeker" && <button>Edit Profile</button>}
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
                <p>Job Postings: {apiData.jobPostings}</p>
              )}

              {/* for seeker */}
              {apiData.role === "job seeker" && (
                <>
                  <p>
                    Saved Jobs:{" "}
                    {apiData.savedJobs.length > 0 ? apiData.savedJobs : "Empty"}
                  </p>
                  <p>
                    Skills:{" "}
                    {apiData.skills.length > 0 ? apiData.skills : "Empty"}
                  </p>
                </>
              )}
            </div>

            {/* for deletion of a user */}
            {!isDeleted ? (
              <div>
                <button
                  onClick={() => {
                    setIsDeleted(true);
                  }}
                >
                  Delete Account
                </button>
              </div>
            ) : (
              <div className="flex gap-8">
                <button
                  onClick={() => {
                    setIsDeleted(false);
                  }}
                >
                  Cancel
                </button>
                <button onClick={deleteProfileHandler}>Delete</button>
              </div>
            )}

            {/* for password changing */}
            <div>
              <button
                onClick={() => {
                  setChangePassword?.(true);
                }}
              >
                Change Password
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
