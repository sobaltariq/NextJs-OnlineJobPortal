import Link from "next/link";
import React from "react";

interface UserProfile {
  profileData: {
    name: string;
    role: string;
    email: string;
    createdAt: string;
    employerId: string;
    seekerId: string;
  };
}

const ProfileCard: React.FC<UserProfile> = ({ profileData }) => {
  const roleLink =
    profileData.role === "job seeker"
      ? `job-seeker/${profileData.seekerId}`
      : `employer/${profileData.employerId}`;
  return (
    <div className="my-8 py-4 px-2 shadow-inner rounded-lg bg-stone-200">
      <Link href={`${roleLink}/`}>
        <div className="flex gap-8">
          <p>{profileData.name}</p>
          <p>{profileData.role}</p>
        </div>
        <p>{profileData.email}</p>
        <p>{new Date(profileData.createdAt).toLocaleDateString()}</p>
      </Link>
    </div>
  );
};

export default ProfileCard;
