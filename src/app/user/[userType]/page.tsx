"use client";
import MyApi from "@/api/MyApi";
import ProfileCard from "@/components/profileCard/ProfileCard";
import React, { useEffect, useState } from "react";

interface ParamsData {
  params: {
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
  employerId: string;
  seekerId: string;
  userId?: string;
  role: string;
  name: string;
  email: string;
  createdAt: string;
  jobPostings: JobPostings;
  skills: string[];
  savedJobs: string[];
}

const UserTypePage: React.FC<ParamsData> = ({ params }) => {
  const [apiData, setApiData] = useState<ProfileData[]>([]);
  const [showError, setShowError] = useState<string>("");

  const { userType } = params;

  const getAllUsers = async () => {
    try {
      const loginToken = localStorage?.getItem("login_token");

      const response = await MyApi.get(`${userType}`, {
        headers: {
          Authorization: `Bearer ${loginToken}`,
        },
      });
      console.log(response.data.data);
      setApiData(response.data.data);
    } catch (err: any) {
      setShowError(err.response.data?.message);
      console.error(`${userType} error: `, err.response.data?.error);
    }
  };

  useEffect(() => {
    getAllUsers();
    // console.log(userType);
  }, []);
  return (
    <div>
      <div>
        {showError && <p>{showError}</p>}
        <div>
          {apiData.length > 0 ? (
            <div>
              {apiData.map((user: ProfileData, index: number) => (
                <ProfileCard key={index} profileData={user} />
              ))}
            </div>
          ) : (
            <p>No user data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserTypePage;
