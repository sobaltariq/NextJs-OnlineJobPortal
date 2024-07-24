"use client";
import MyApi from "@/api/MyApi";
import JobCard from "@/components/cards/JobCard";
import LoginAuth from "@/hocs/LoginAuth";
import composeHOCs from "@/hocs/composeHOCs";
import React, { useEffect, useState } from "react";

interface JobApplicationInterface {
  appId: string;
  appJobSeeker: string;
  appStatus: "pending" | "rejected" | "accepted";
  appCreatedAt: string;
}

interface MyJobsInterface {
  jobId: string;
  jobTitle: string;
  jobCreatedAt: string;
  jobDescription: string;
  jobLocation: string;
  jobRequirements: string[];
  jobSalary: string;
  jobCompany: string;
  employerUserId: string;
  employerName: string;
  applications: JobApplicationInterface[];
}

const MyJobsPage = () => {
  const [showError, setShowError] = useState<string>("");
  const [apiData, setApiData] = useState<MyJobsInterface[] | []>([]);
  const [userType, setUserType] = useState<string | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<any>(null);

  const getMyJobs = async () => {
    try {
      const loginToken = localStorage?.getItem("login_token");
      const userRole = localStorage?.getItem("user_role");
      const loggedIn = localStorage.getItem("logged_in");
      if (loggedIn) {
        const user = JSON.parse(loggedIn);
        setLoggedInUser(user);
      }

      const endPoint = `employer/job-postings/my-jobs`;

      const response = await MyApi.get(endPoint, {
        headers: {
          Authorization: `Bearer ${loginToken}`,
        },
      });
      console.log(response.data?.data);
      setApiData(response.data?.data);
      setUserType(userRole);
    } catch (err: any) {
      setShowError(err.response.data?.message || err.response.data?.error);
      console.error("Get Single user:", err.response.data);
    }
  };

  useEffect(() => {
    getMyJobs();
  }, []);

  return (
    <div>
      {apiData.length > 0 ? (
        <div>
          <p>{showError}</p>
          <h2 className="pb-8">Total Jobs: {apiData.length}</h2>
          <div className="grid grid-cols-2 gap-8">
            {apiData.map((jobData: MyJobsInterface) => {
              return (
                <JobCard
                  key={jobData.jobId}
                  loggedInUserId={loggedInUser?.id}
                  {...jobData}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <div>
          {showError ? (
            <p>{showError}</p>
          ) : (
            <p
              className="flex justify-center items-center"
              style={{ height: "70dvh" }}
            >
              No Job Found
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default composeHOCs(LoginAuth)(MyJobsPage);
