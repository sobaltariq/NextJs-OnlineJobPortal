"use client";
import MyApi from "@/api/MyApi";
import LoginAuth from "@/hocs/LoginAuth";
import composeHOCs from "@/hocs/composeHOCs";
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
}

const UserProfile: React.FC = () => {
  const [showError, setShowError] = useState<string>("");
  const [apiData, setApiData] = useState<ProfileData | null>(null);

  const [isDeleted, setIsDeleted] = useState<boolean>(false);

  const router = useRouter();

  const dispatch = useDispatch();

  const loginToken = localStorage?.getItem("login_token");
  const userType = localStorage?.getItem("user_role");

  const endPoint =
    userType === "admin"
      ? "/admin/"
      : userType === "employer"
      ? "/employer/"
      : "/job-seeker/";

  const getProfileHandler = async () => {
    try {
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
            <p>Name: {apiData.name}</p>
            <p>Email: {apiData.email}</p>
            <p>Role: {apiData.role}</p>
            <p>
              Registration Date:{" "}
              {new Date(apiData.createdAt).toLocaleDateString()}
            </p>
          </div>
        )}

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
          <div className="flex justify-between">
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
      </div>
    </div>
  );
};

export default UserProfile;
