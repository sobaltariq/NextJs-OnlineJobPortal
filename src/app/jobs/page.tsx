"use client";
import MyApi from "@/api/MyApi";
import Link from "next/link";
import React, { useEffect, useState } from "react";

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
  jobId: string;
  title: string;
  applications: JobApplicationInterface[];
  createdAt: string;
  description: string;
  employer: EmployerInterface;
  location: string;
  requirements: string[];
  salary: string;
}

const AllJobsPage = () => {
  const [showError, setShowError] = useState<string>("");
  const [apiData, setApiData] = useState<JobsInterface[] | []>([]);

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
      if (err.response) {
        setShowError(err.response.data?.error);
        console.error(`get jobs error: `, err.response.data?.error);
      }
    }
  };

  useEffect(() => {
    getAllJobs();
  }, []);

  return (
    <div>
      {apiData.length > 0 ? (
        <div className="grid grid-cols-2 gap-8">
          {apiData.map((jobData: JobsInterface, i: number) => {
            return (
              <Link href={`/jobs/${jobData.jobId}`} key={i}>
                <div className="py-4 px-2 shadow-inner rounded-lg bg-stone-200">
                  <h3>{jobData.title}</h3>
                  <div className="flex justify-between">
                    <p>Salary: {jobData.salary}</p>
                    <p>Location: {jobData.location}</p>
                  </div>
                  <p>
                    Posted at:{" "}
                    {new Date(jobData?.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    Requirements:{" "}
                    {jobData.requirements.map((item, i) => (
                      <span key={i}>{item} </span>
                    ))}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <p>{showError}</p>
      )}
    </div>
  );
};

export default AllJobsPage;
