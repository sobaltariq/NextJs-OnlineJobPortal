"use client";
import MyApi from "@/api/MyApi";
import React, { useState } from "react";

interface EmployerInterface {
  userId: string;
  userName: string;
}

interface JobApplicationInterface {
  _id: string;
  jobSeeker: string;
  jobPosting: string;
  status: "pending" | "rejected" | "accepted";
  createdAt: string;
}

interface JobsInterface {
  title: string;
  applications: JobApplicationInterface[];
  createdAt: string;
  description: string;
  employer: EmployerInterface;
  location: string;
  requirements: string[];
  salary: string;
}

const Jobs = () => {
  const [showError, setShowError] = useState<string>("");
  const [apiData, setApiData] = useState<JobsInterface | []>([]);

  const getAllJobs = async () => {
    try {
      const loginToken = localStorage.getItem("login_token");
      const response = await MyApi.get("/employer/job-postings/all-jobs", {
        headers: {
          Authorization: `Bearer ${loginToken}`,
        },
      });
      console.log(response.data?.data);
      setApiData(response.data?.data);
    } catch (err: any) {
      const errorMessage =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "An error occurred while fetching jobs.";
      setShowError(errorMessage);
      console.error(`get jobs error: `, errorMessage);
    }
  };

  useState(() => {
    getAllJobs();
  }, []);

  return (
    <div>
      {showError && <p>{showError}</p>}
      {apiData.length > 0 ? (
        <div>
          {apiData.map((jobData: JobsInterface, i: number) => {
            return <div key={i}>{jobData.title}</div>;
          })}
        </div>
      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
};

export default Jobs;
