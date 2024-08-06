"use client";
import MyApi from "@/api/MyApi";
import JobCard from "@/components/cards/JobCard";
import CreateJobModal from "@/components/modals/CreateJobModal";
import LoginAuth from "@/hocs/LoginAuth";
import composeHOCs from "@/hocs/composeHOCs";
import { isJobDeleted } from "@/redux/features/jobsSlicer";
import { RootState } from "@/redux/store";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import LoadingImg from "../assets/Loader.svg";

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

const AllJobsPage: React.FC = () => {
  const [showError, setShowError] = useState<string>("");
  const [apiData, setApiData] = useState<JobsInterface[] | []>([]);
  const [userTye, setUserType] = useState<string | null>(null);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState<boolean>(false);
  const [loggedInUser, setLoggedInUser] = useState<LoginInterface | null>(null);

  const [isLoading, setLoader] = useState<boolean>(true);

  const { jobDeleted } = useSelector((state: RootState) => state.jobs);

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
        setShowError(
          err.response.data?.error ||
            err.response.data?.error ||
            "something went wrong"
        );
        console.error(`get jobs error: `, err.response);
      }
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getAllJobs();
  }, [isPostJobModalOpen, jobDeleted]);
  if (isLoading) {
    return (
      <div className="home-page flex justify-center items-center">
        <Image
          src={LoadingImg}
          alt="Loading"
          height={100}
          width={100}
          priority
        />
      </div>
    );
  } else {
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
            {showError && <p>{showError}</p>}
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
  }
};

export default composeHOCs(LoginAuth)(AllJobsPage);
