"use client";
import MyApi from "@/api/MyApi";
import React, { useEffect, useState } from "react";

interface JobParamsInterface {
  params: {
    jobId: string;
  };
}

interface JobApplicationInterface {
  appId: string;
  appJobSeeker: string;
  appStatus: "pending" | "rejected" | "accepted";
  appCreatedAt: string;
}

interface JobsInterface {
  jobId: string;
  jobTitle: string;
  applications: JobApplicationInterface[];
  jobCreatedAt: string;
  jobDescription: string;
  employerId: string;
  employerName: string;
  jobLocation: string;
  jobRequirements: string[];
  jobSalary: string;
  jobCompany: string;
}

const SingleJobPage: React.FC<JobParamsInterface> = ({ params }) => {
  const [showError, setShowError] = useState<string>("");
  const [apiData, setApiData] = useState<JobsInterface | null>(null);
  const [userType, setUserType] = useState<string | null>(null);

  const { jobId } = params;

  const getOneJob = async () => {
    try {
      const loginToken = localStorage?.getItem("login_token");
      const userRole = localStorage?.getItem("user_role");

      const endPoint = `/employer/job-postings/${jobId}`;

      const response = await MyApi.get(endPoint, {
        headers: {
          Authorization: `Bearer ${loginToken}`,
        },
      });
      console.log(response.data?.data);
      setApiData(response.data?.data);
      setUserType(userRole);
    } catch (err: any) {
      setShowError(err.response.data?.message || "Get Single Job");
      console.error("Get Single Job:", err.response);
    }
  };

  useEffect(() => {
    getOneJob();
  }, []);
  return (
    <div>
      {apiData ? (
        <div>
          <h1>{apiData.jobTitle}</h1>

          <div>
            <p>Date: {new Date(apiData?.jobCreatedAt).toLocaleDateString()}</p>
            <p>Salary: {apiData.jobSalary}</p>
            <p>Location: {apiData.jobLocation}</p>
            <p>Company: {apiData.jobCompany}</p>
            <p>Employer: {apiData.employerName}</p>
          </div>
          <p>
            Requirements:{" "}
            {apiData.jobRequirements.map((item, i) => (
              <span key={i}>{item} </span>
            ))}
          </p>
          <p>Applications: {apiData.applications.length}</p>
          <div>
            <h4>About Job</h4>
            <p>{apiData.jobDescription}</p>
          </div>
          {userType === "job seeker" && (
            <div>
              <p>Apply Now</p>
            </div>
          )}
        </div>
      ) : (
        <p>{showError}</p>
      )}
    </div>
  );
};

export default SingleJobPage;
