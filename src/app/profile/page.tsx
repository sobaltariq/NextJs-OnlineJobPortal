"use client";
import MyApi from "@/api/MyApi";
import ChangePasswordModal from "@/components/modals/ChangePasswordModal";
import DeleteUserModal from "@/components/modals/DeleteUserModal";
import EditProfileModal from "@/components/modals/EditProfileModal";
import composeHOCs from "@/hocs/composeHOCs";
import LoginAuth from "@/hocs/LoginAuth";
import { logout } from "@/redux/features/auth/authSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import LoadingImg from "../../assets/Loader.svg";
import Image from "next/image";
import { RootState } from "@/redux/store";
import { setAppStatus } from "@/redux/features/globalSlicer";

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

const ProfilePage: React.FC = () => {
  const [showError, setShowError] = useState<string>("");
  const [apiData, setApiData] = useState<ProfileData | null>(null);

  const [accountDeleteModal, setAccountDeleteModal] = useState<boolean>(false);

  const [isPasswordModalOpen, setIsPasswordModalOpen] =
    useState<boolean>(false);

  const [isEditProfileModalOpen, setIsEditProfileModalOpen] =
    useState<boolean>(false);

  const { appStatus } = useSelector((state: RootState) => state.global);

  const [isLoading, setLoader] = useState<boolean>(true);

  const router = useRouter();

  const dispatch = useDispatch();

  const loginToken = localStorage?.getItem("login_token");
  const userType = localStorage?.getItem("user_role");

  const getProfileHandler = async () => {
    try {
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
      dispatch(setAppStatus(err.response.status));
    } finally {
      setLoader(false);
      if (loginToken) {
        dispatch(setAppStatus(200));
      }
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
  if (isLoading || !(appStatus === 200)) {
    return (
      <div className="home-page flex justify-center items-center">
        <Image
          src={LoadingImg}
          alt="Loading"
          height={100}
          width={100}
          priority
        />
      </div>
    );
  } else {
    return (
      <div className="user-profile-page">
        {apiData ? (
          <div className="profile-wrapper">
            <h1>Profile</h1>
            <div className="profile-details">
              <div className="info-box">
                <p>Name:</p> <p>{apiData?.userName}</p>
              </div>
              <div className="info-box">
                <p>Email: </p> <p>{apiData.userEmail}</p>
              </div>
              <div className="info-box">
                <p>Role: </p>
                <p>{apiData.userRole}</p>
              </div>
              <div className="info-box">
                <p>Registration Date:</p>{" "}
                <p>{new Date(apiData.userCreatedAt).toLocaleDateString()}</p>
              </div>
              {/* for employer */}
              {apiData.userRole === "employer" && (
                <div className="info-box">
                  <p>Job Postings: </p>{" "}
                  <p className="">
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
                  </p>
                </div>
              )}
              {/* for seeker */}
              {apiData.userRole === "job seeker" && (
                <>
                  <div className="info-box">
                    <p>Education:</p>
                    <p>
                      {apiData.seekerEducation
                        ? apiData.seekerEducation
                        : "Empty"}
                    </p>
                  </div>
                  <div className="info-box">
                    <p>Work Experience:</p>
                    <p>
                      {apiData.seekerWorkExperience
                        ? apiData.seekerWorkExperience
                        : "Empty"}
                    </p>
                  </div>
                  <div className="info-box">
                    <p>Saved Jobs:</p>
                    <p>
                      {apiData.seekerSavedJobs.length > 0
                        ? apiData.seekerSavedJobs
                        : "Empty"}
                    </p>
                  </div>
                  <div className="info-box">
                    <p className="flex gap-2 justify-items-center">Skills:</p>
                    <p>
                      {apiData.seekerSkills.length <= 0
                        ? "Empty"
                        : apiData.seekerSkills.map((item, i) => {
                            return (
                              <Fragment key={i}>
                                <span className="bg-neutral-200 px-2 select-none">
                                  {item}
                                </span>{" "}
                              </Fragment>
                            );
                          })}
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="bottom-buttons-wrapper">
              {/* for deletion of a user */}
              <div>
                <button
                  className="del-btn"
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
                  className="cp-btn"
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
                    className="edit-btn"
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
          </div>
        ) : (
          <p
            className="msg-p flex justify-center items-center"
            style={{ height: "70dvh" }}
          >
            {showError || "Profile Not Found"}
          </p>
        )}
      </div>
    );
  }
};

export default composeHOCs(LoginAuth)(ProfilePage);
