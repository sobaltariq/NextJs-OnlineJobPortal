"use client";
import MyApi from "@/api/MyApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import { string } from "yup";

import LoadingImg from "../../../../assets/Loader.svg";
import Image from "next/image";

interface UserProfile {
  params: {
    userId: string;
    userType: "employer" | "job-seeker";
  };
}

interface JobPostings {
  jobPostId: string;
  jobPostTitle: string;
}

interface ProfileData {
  message: string;
  employerId?: string;
  seekerId?: string;
  userId?: string;
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

const UserPage: React.FC<UserProfile> = ({ params }) => {
  const [userError, setUserError] = useState<string>("");

  const [apiData, setApiData] = useState<ProfileData | null>(null);

  const [isLoading, setLoader] = useState<boolean>(true);

  const router = useRouter();

  const { userId, userType } = params;

  const getUserProfile = async () => {
    try {
      const loginToken = localStorage?.getItem("login_token");

      if (!loginToken) {
        router.push("/login");
      }

      const endPoint = `/${userType}/${userId}`;

      const response = await MyApi.get(endPoint, {
        headers: {
          Authorization: `Bearer ${loginToken}`,
        },
      });
      console.log(response.data?.data);
      setApiData(response.data?.data);
    } catch (err: any) {
      setUserError(err.response.data?.message || "Get Single user");
      console.error("Get Single user:", err.response.data);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  if (isLoading) {
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
      <div className="single-user-page">
        {userError && <p>{userError}</p>}
        {apiData && (
          <div className="single-user-wrapper">
            <div className="info-box">
              <p>Name</p>
              <p className="capitalize">{apiData?.userName}</p>
            </div>
            <div className="info-box">
              <p>User Type</p>
              <p className="capitalize">{apiData?.userRole}</p>
            </div>
            <div className="info-box">
              <p>Registration Date</p>
              <p>{new Date(apiData?.userCreatedAt).toLocaleDateString()}</p>
            </div>

            {apiData.userRole === "employer" && (
              <div className="info-box">
                <p>Job Postings</p>
                <p>
                  {apiData.jobPostings.length <= 0
                    ? "0"
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
                  <p>Saved Jobs</p>
                  <p>
                    {apiData.seekerSavedJobs.length > 0
                      ? apiData.seekerSavedJobs
                      : "Empty"}
                  </p>
                </div>
                <div className="info-box">
                  <p>Education</p>
                  <p>
                    {apiData.seekerEducation
                      ? apiData.seekerEducation
                      : "Empty"}
                  </p>
                </div>
                <div className="info-box">
                  <p>Work Experience</p>
                  <p>
                    {apiData.seekerWorkExperience
                      ? apiData.seekerWorkExperience
                      : "Empty"}
                  </p>
                </div>
                <div className="info-box">
                  <p className="">Skills</p>
                  <p>
                    {apiData.seekerSkills.length > 0
                      ? apiData.seekerSkills.map((item, i) => {
                          return (
                            <Fragment key={i}>
                              <span>{item}</span>{" "}
                            </Fragment>
                          );
                        })
                      : "Empty"}
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  }
};

export default UserPage;
