"use client";
import MyApi from "@/api/MyApi";
import ApplicationsOnMyJob from "@/components/applications/ApplicationsOnMyJob";
import React, { useEffect, useState } from "react";

interface JobParamsInterface {
  params: {
    jobId: string;
  };
}

interface LoginInterface {
  id: string;
  email: string;
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
  employerUserId: string;
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
  const [loggedInUser, setLoggedInUser] = useState<any>(null);

  const { jobId } = params;

  const getOneJob = async () => {
    try {
      const loginToken = localStorage?.getItem("login_token");
      const userRole = localStorage?.getItem("user_role");
      const loggedIn = localStorage.getItem("logged_in");

      const endPoint = `/employer/job-postings/${jobId}`;

      const response = await MyApi.get(endPoint, {
        headers: {
          Authorization: `Bearer ${loginToken}`,
        },
      });
      console.log(response.data?.data);
      setApiData(response.data?.data);
      setUserType(userRole);
      if (loggedIn) {
        const user: LoginInterface = JSON.parse(loggedIn);
        setLoggedInUser(user);
      }
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

          {apiData.employerUserId === loggedInUser?.id && (
            <ApplicationsOnMyJob jobIdParam={jobId} />
          )}
        </div>
      ) : (
        <p>{showError}</p>
      )}
    </div>
  );
};

export default SingleJobPage;
