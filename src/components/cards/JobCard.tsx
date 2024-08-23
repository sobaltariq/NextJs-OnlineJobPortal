"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import DeleteJobModal from "../modals/DeleteJobModal";
import EditJobModal from "../modals/EditJobModal";
import MyApi from "@/api/MyApi";
import { waitSec } from "@/utils/CommonWait";

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

const JobCard: React.FC<JobPropsInterface> = (props) => {
  const [jobDeleteModal, setJobDeleteModal] = useState<boolean>(false);
  const [isEditJobModalOpen, setIsEditJobModalOpen] = useState<boolean>(false);

  const [seekerId, setSeekerId] = useState<string | null>(null);
  const [isApplied, setIsApplied] = useState<boolean>(false);

  const loginToken = localStorage.getItem("login_token");
  const userType = localStorage.getItem("user_role");

  const jobApplyNowHandler = async () => {
    const postValue = {
      jobPosting: `${props.jobId}`,
    };
    try {
      const response = await MyApi.post(`/job-seeker/application/`, postValue, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginToken}`,
        },
      });

      console.log(response.data);

      setIsApplied(true);
    } catch (err: any) {
      console.error(
        "Apply Job error:",
        err.response.data?.message || err.response.data?.errors[0].msg
      );
    }
  };

  useEffect(() => {
    const callSeekerForId = async () => {
      const response = await MyApi.get(`job-seeker`, {
        headers: {
          Authorization: `Bearer ${loginToken}`,
        },
      });
      const seekerData = response.data.data;
      seekerData.map((seeker: any) => {
        if (props.loggedInUserId === seeker?.userId) {
          setSeekerId(seeker?.seekerId);
        }
      });
    };
    callSeekerForId();
  }, [props.loggedInUserId, loginToken]);

  return (
    <div className="job-card">
      <Link
        href={`/jobs/${props.jobId}`}
        key={props.jobId}
        className="job-card-link"
      >
        <h3 className="capitalize">{props.jobTitle}</h3>
        <div className="flex justify-between py-1">
          <p>
            Salary: <span>{props.jobSalary}</span>
          </p>
          <p>
            Location: <span>{props.jobLocation}</span>
          </p>
        </div>
        <div className="flex justify-between">
          <p>
            Total Applications: <span>{props.applications.length}</span>
          </p>
          <p>
            Posted at:{" "}
            <span>{new Date(props.jobCreatedAt).toLocaleDateString()}</span>
          </p>
        </div>
        <div>
          <p className="py-1">
            Requirements:{" "}
            {props.jobRequirements.map((item, i) => (
              <span key={i} className="item">
                {item}{" "}
              </span>
            ))}
          </p>
        </div>
      </Link>
      {userType === "job seeker" &&
        !props.applications.some((app) => app.appJobSeeker === seekerId) && (
          <div className="card-bottom pt-4">
            {isApplied ? (
              <div>
                <button className="apply-btn" disabled>
                  Applied
                </button>
              </div>
            ) : (
              <button
                className="apply-btn"
                onClick={() => {
                  jobApplyNowHandler();
                }}
              >
                Apply Now
              </button>
            )}
          </div>
        )}
      {userType === "job seeker" &&
        props.applications.some((app) => app.appJobSeeker === seekerId) && (
          <div className="card-bottom pt-4">
            <div>
              <button className="apply-btn" disabled>
                Applied
              </button>
            </div>
          </div>
        )}

      {props.employerUserId === props.loggedInUserId && (
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
                jobId={props.jobId}
              />
            </div>
            <div>
              <button
                onClick={() => {
                  setIsEditJobModalOpen(true);
                }}
              >
                Edit Job
              </button>
              <EditJobModal
                jobDetails={props}
                jobId={props.jobId}
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
