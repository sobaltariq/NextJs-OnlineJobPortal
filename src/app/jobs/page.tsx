"use client";
import MyApi from "@/api/MyApi";
import JobCard from "@/components/cards/JobCard";
import CreateJobModal from "@/components/modals/CreateJobModal";
import LoginAuth from "@/hocs/LoginAuth";
import composeHOCs from "@/hocs/composeHOCs";
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
  const [userTye, setUserType] = useState<string | null>(null);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState<boolean>(false);

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
      setUserType(localStorage.getItem("user_role"));
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
        <div>
          {userTye === "employer" && (
            <div className="py-8">
              <div>
                <button
                  onClick={() => {
                    setIsPostJobModalOpen(true);
                  }}
                >
                  Create New Job
                </button>
                <CreateJobModal
                  isPostJobModalOpen={isPostJobModalOpen}
                  setIsPostJobModalOpen={setIsPostJobModalOpen}
                />
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-8">
            {apiData.map((jobData: JobsInterface) => {
              return (
                <JobCard key={jobData.jobId} isMyJob={false} {...jobData} />
              );
            })}
          </div>
        </div>
      ) : (
        <p>{showError}</p>
      )}
    </div>
  );
};

export default composeHOCs(LoginAuth)(AllJobsPage);
