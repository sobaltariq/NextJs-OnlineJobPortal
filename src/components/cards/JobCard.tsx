"use client";
import Link from "next/link";
import React, { useState } from "react";
import DeleteJobModal from "../modals/DeleteJobModal";
import EditJobModal from "../modals/EditJobModal";

interface JobPropsInterface {
  isMyJob: boolean;
  jobId: string;
  title: string;
  salary: string;
  location: string;
  createdAt: string;
  requirements: string[];
}

const JobCard: React.FC<JobPropsInterface> = ({
  isMyJob = false,
  jobId,
  title,
  salary,
  location,
  createdAt,
  requirements,
}) => {
  const [jobDeleteModal, setJobDeleteModal] = useState<boolean>(false);
  const [isEditJobModalOpen, setIsEditJobModalOpen] = useState<boolean>(false);

  return (
    <div className="py-4 px-2 shadow-inner rounded-lg bg-stone-200">
      <Link href={`/jobs/${jobId}`} key={jobId}>
        <h3>{title}</h3>
        <div className="flex justify-between">
          <p>Salary: {salary}</p>
          <p>Location: {location}</p>
        </div>
        <div className="flex justify-between">
          <div>
            <p>Posted at: {new Date(createdAt).toLocaleDateString()}</p>
            <p>
              Requirements:{" "}
              {requirements.map((item, i) => (
                <span key={i}>{item} </span>
              ))}
            </p>
          </div>
        </div>
      </Link>
      {isMyJob && (
        <div className="flex justify-between pt-2">
          <div>
            <button
              className="text-red-500"
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
      )}
    </div>
  );
};

export default JobCard;
