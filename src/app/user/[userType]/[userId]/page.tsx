"use client";
import MyApi from "@/api/MyApi";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import { string } from "yup";

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

  const { userId, userType } = params;

  const getUserProfile = async () => {
    try {
      const loginToken = localStorage?.getItem("login_token");

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
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  return (
    <div>
      {userError && <p>{userError}</p>}
      {apiData && (
        <div>
          <p>Name: {apiData?.userName}</p>
          <p>User Type: {apiData?.userRole}</p>
          <p>
            Registration Date:{" "}
            {new Date(apiData?.userCreatedAt).toLocaleDateString()}
          </p>
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
                Saved Jobs:{" "}
                {apiData.seekerSavedJobs.length > 0
                  ? apiData.seekerSavedJobs
                  : "Empty"}
              </p>
              <p>
                Education:{" "}
                {apiData.seekerEducation ? apiData.seekerEducation : "Empty"}
              </p>
              <p>
                Work Experience:{" "}
                {apiData.seekerWorkExperience
                  ? apiData.seekerWorkExperience
                  : "Empty"}
              </p>
              <p className="flex gap-2 justify-items-center">
                Skills:{" "}
                {apiData.seekerSkills.length > 0
                  ? apiData.seekerSkills.map((item, i) => {
                      return (
                        <span key={i} className="bg-red-400 py-1 px-3 rounded">
                          {item}{" "}
                        </span>
                      );
                    })
                  : "Empty"}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserPage;
