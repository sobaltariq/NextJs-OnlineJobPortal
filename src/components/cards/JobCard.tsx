"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import DeleteJobModal from "../modals/DeleteJobModal";
import EditJobModal from "../modals/EditJobModal";
import MyApi from "@/api/MyApi";

interface JobApplicationInterface {
  appId: string;
  appJobSeeker: string;
  appStatus: "pending" | "rejected" | "accepted";
  appCreatedAt: string;
}

interface JobPropsInterface {
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
  loggedInUserId?: string;
}

const JobCard: React.FC<JobPropsInterface> = ({
  jobId,
  jobTitle,
  jobCreatedAt,
  jobDescription,
  jobLocation,
  jobRequirements,
  jobSalary,
  jobCompany,
  employerUserId,
  employerName,
  applications,
  loggedInUserId,
}) => {
  const [jobDeleteModal, setJobDeleteModal] = useState<boolean>(false);
  const [isEditJobModalOpen, setIsEditJobModalOpen] = useState<boolean>(false);

  const [loggedInUser, setLoggedInUser] = useState<any | null>(null);

  const loginToken = localStorage.getItem("login_token");
  const userType = localStorage.getItem("user_role");

  const jobApplyNowHandler = async () => {
    const postValue = {
      jobPosting: `${jobId}`,
    };
    try {
      const response = await MyApi.post(`/job-seeker/application/`, postValue, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginToken}`,
        },
      });

      console.log(response.data);
    } catch (err: any) {
      console.error(
        "Apply Job error:",
        err.response.data?.message || err.response.data?.errors[0].msg
      );
    }
  };

  return (
    <div className="job-card">
      <Link href={`/jobs/${jobId}`} key={jobId} className="job-card-link">
        <h3>{jobTitle}</h3>
        <div className="flex justify-between py-1">
          <p>
            Salary: <span>{jobSalary}</span>
          </p>
          <p>
            Location: <span>{jobLocation}</span>
          </p>
        </div>
        <div className="flex justify-between">
          <p>
            Total Applications: <span>{applications.length}</span>
          </p>
          <p>
            Posted at:{" "}
            <span>{new Date(jobCreatedAt).toLocaleDateString()}</span>
          </p>
        </div>
        <div>
          <p className="py-1">
            Requirements:{" "}
            {jobRequirements.map((item, i) => (
              <span key={i} className="item">
                {item}{" "}
              </span>
            ))}
          </p>
        </div>
      </Link>
      {userType === "job seeker" && (
        <div className="card-bottom pt-4">
          <button className="text-blue-800" onClick={jobApplyNowHandler}>
            Apply Now
          </button>
        </div>
      )}
      {employerUserId === loggedInUserId && (
        <React.Fragment>
          <div className="card-bottom flex justify-between pt-4">
            <div>
              <button
                className="del-btn"
                onClick={() => {
                  setJobDeleteModal(true);
                }}
              >
                Delete
              </button>
              <DeleteJobModal
                jobDeleteModal={jobDeleteModal}
                setJobDeleteModal={setJobDeleteModal}
                jobId={jobId}
              />
            </div>
            <div>
              <button
                onClick={() => {
                  setIsEditJobModalOpen(true);
                }}
              >
                Edit Profile
              </button>
              <EditJobModal
                jobId={jobId}
                isEditJobModalOpen={isEditJobModalOpen}
                setIsEditJobModalOpen={setIsEditJobModalOpen}
              />
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default JobCard;
