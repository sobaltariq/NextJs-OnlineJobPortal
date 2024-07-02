"use client";
import MyApi from "@/api/MyApi";
import JobCard from "@/components/cards/JobCard";
import LoginAuth from "@/hocs/LoginAuth";
import composeHOCs from "@/hocs/composeHOCs";
import React, { useEffect, useState } from "react";

interface MyJobsInterface {
  jobId: string;
  title: string;
  applications: string[];
  companyName: string;
  createdAt: string;
  description: string;
  employer: string;
  location: string;
  requirements: string[];
  salary: string;
}

const MyJobsPage = () => {
  const [showError, setShowError] = useState<string>("");
  const [apiData, setApiData] = useState<MyJobsInterface[] | []>([]);
  const [userType, setUserType] = useState<string | null>(null);

  const getMyJobs = async () => {
    try {
      const loginToken = localStorage?.getItem("login_token");
      const userRole = localStorage?.getItem("user_role");

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
          <h2 className="py-4">Total Jobs: {apiData.length}</h2>
          <div className="grid grid-cols-2 gap-8">
            {apiData.map((myJob) => {
              return <JobCard key={myJob.jobId} isMyJob={true} {...myJob} />;
            })}
          </div>
        </div>
      ) : (
        <p>No Job Found</p>
      )}
    </div>
  );
};

export default composeHOCs(LoginAuth)(MyJobsPage);
