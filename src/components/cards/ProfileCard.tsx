import Link from "next/link";
import React from "react";

interface JobPostings {
  applications: string[];
  companyName: string;
  createdAt: string;
  dataPosted: string;
  description: string;
  employer: string;
  location: string;
  requirements: string[];
  salary: string;
  title: string;
}

interface UserProfile {
  profileData: {
    name: string;
    role: string;
    email: string;
    createdAt: string;
    employerId: string;
    seekerId: string;
    jobPostings: JobPostings[];
  };
}

const ProfileCard: React.FC<UserProfile> = ({ profileData }) => {
  const roleLink =
    profileData.role === "job seeker"
      ? `job-seeker/${profileData.seekerId}`
      : `employer/${profileData.employerId}`;
  return (
    <div className="job-card">
      <Link href={`${roleLink}/`} className="job-card-link">
        <div className="flex justify-between">
          <p>
            Name: <span>{profileData.name}</span>
          </p>
        </div>
        <div className="flex justify-between pt-4">
          <p>
            User Type: <span>{profileData.role}</span>
          </p>
          {profileData.role === "employer" && (
            <p>
              Total Jobs:{" "}
              <span>
                {profileData.jobPostings.length <= 0
                  ? "Empty"
                  : profileData.jobPostings.length}
              </span>
            </p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProfileCard;
