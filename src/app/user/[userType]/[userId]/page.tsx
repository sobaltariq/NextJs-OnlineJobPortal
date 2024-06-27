"use client";
import MyApi from "@/api/MyApi";
import React, { useEffect, useState } from "react";

interface UserProfile {
  params: {
    userId: string;
    userType: "employer" | "job-seeker";
  };
}

interface JobPostings {
  applications: string[];
  companyName: string;
  createdAt: string;
  dataPosted: string;
  description: string;
  employer: string;
  location: string;
  requirements: string[];
  salary: string;
  title: string;
}

interface ProfileData {
  message: string;
  employerId?: string;
  userId?: string;
  role: string;
  name: string;
  email: string;
  createdAt: string;
  jobPostings: JobPostings;
  skills: string[];
  savedJobs: string[];
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
      console.log(response.data);
      setApiData(response.data);
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
          <p>Name: {apiData?.name}</p>
          <p>User Type: {apiData?.role}</p>
          <p>
            Registration Date:{" "}
            {new Date(apiData?.createdAt).toLocaleDateString()}
          </p>
          {apiData.role === "employer" && (
            <p>
              Job Postings:{" "}
              {/* {apiData.jobPostings.length > 0 ? apiData.jobPostings : "Empty"} */}
            </p>
          )}

          {/* for seeker */}
          {apiData.role === "job seeker" && (
            <>
              <p>
                Saved Jobs:{" "}
                {apiData.savedJobs.length > 0 ? apiData.savedJobs : "Empty"}
              </p>
              <p className="flex gap-2 justify-items-center">
                Skills:{" "}
                {apiData.skills.length > 0
                  ? apiData.skills.map((item, i) => {
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
