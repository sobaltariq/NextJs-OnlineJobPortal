"use client";
import MyApi from "@/api/MyApi";
import JobCard from "@/components/cards/JobCard";
import CreateJobModal from "@/components/modals/CreateJobModal";
import LoginAuth from "@/hocs/LoginAuth";
import composeHOCs from "@/hocs/composeHOCs";
import React, { useEffect, useState } from "react";

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

const AllJobsPage = () => {
  const [showError, setShowError] = useState<string>("");
  const [apiData, setApiData] = useState<JobsInterface[] | []>([]);
  const [userTye, setUserType] = useState<string | null>(null);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState<boolean>(false);
  const [loggedInUser, setLoggedInUser] = useState<LoginInterface | null>(null);

  const getAllJobs = async () => {
    try {
      const loginToken = localStorage.getItem("login_token");
      const loggedIn = localStorage.getItem("logged_in");

      const response = await MyApi.get("/employer/job-postings/all-jobs", {
        headers: {
          Authorization: `Bearer ${loginToken}`,
        },
      });
      console.log(response.data?.data);
      setApiData(response.data?.data);
      setUserType(localStorage.getItem("user_role"));
      if (loggedIn) {
        const user: LoginInterface = JSON.parse(loggedIn);
        setLoggedInUser(user);
      }
    } catch (err: any) {
      if (err.response) {
        setShowError(err.response.data?.error);
        console.error(`get jobs error: `, err.response.data?.error);
      }
    }
  };

  useEffect(() => {
    getAllJobs();
  }, [isPostJobModalOpen]);

  return (
    <div className="home-page">
      {userTye === "employer" && (
        <div className="home-top pb-8">
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
      {apiData.length > 0 ? (
        <div className="jobs-container">
          <p>{showError}</p>
          <div className="jobs-wrapper grid grid-cols-2 gap-8">
            {apiData.map((jobData: JobsInterface) => {
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
        <p
          style={{ height: "70dvh" }}
          className="flex justify-center items-center"
        >
          Job Not Found
        </p>
      )}
    </div>
  );
};

export default composeHOCs(LoginAuth)(AllJobsPage);
