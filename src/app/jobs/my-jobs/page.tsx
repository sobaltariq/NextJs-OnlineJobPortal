"use client";
import MyApi from "@/api/MyApi";
import JobCard from "@/components/cards/JobCard";
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

  const getMyJobs = async () => {
    try {
      const loginToken = localStorage?.getItem("login_token");
      const userType = localStorage?.getItem("user_role");

      const endPoint = `employer/job-postings/my-jobs`;

      const response = await MyApi.get(endPoint, {
        headers: {
          Authorization: `Bearer ${loginToken}`,
        },
      });
      console.log(response.data?.data);
      setApiData(response.data?.data);
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
          <h2>Total Jobs: {apiData.length}</h2>
          <div className="grid grid-cols-2 gap-8">
            {apiData.map((myJob) => {
              return <JobCard key={myJob.jobId} {...myJob} />;
            })}
          </div>
        </div>
      ) : (
        <p>{showError}</p>
      )}
    </div>
  );
};

export default MyJobsPage;
