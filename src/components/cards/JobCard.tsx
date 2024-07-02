import Link from "next/link";
import React from "react";

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
  return (
    <Link href={`/jobs/${jobId}`} key={jobId}>
      <div className="py-4 px-2 shadow-inner rounded-lg bg-stone-200">
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

          {isMyJob && <button className="text-red-500">Delete</button>}
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
