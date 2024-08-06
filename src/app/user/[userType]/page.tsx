"use client";
import MyApi from "@/api/MyApi";
import ProfileCard from "@/components/cards/ProfileCard";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import LoadingImg from "../../../assets/Loader.svg";
import Image from "next/image";
import { setAppStatus } from "@/redux/features/gobalSlicer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface ParamsData {
  params: {
    userType: "employer" | "job-seeker";
  };
}

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

interface ProfileData {
  message: string;
  employerId: string;
  seekerId: string;
  userId?: string;
  role: string;
  name: string;
  email: string;
  createdAt: string;
  jobPostings: JobPostings[];
  skills: string[];
  savedJobs: string[];
}

const UserTypePage: React.FC<ParamsData> = ({ params }) => {
  const [apiData, setApiData] = useState<ProfileData[]>([]);
  const [showError, setShowError] = useState<string>("");

  const [isLoading, setLoader] = useState<boolean>(true);

  const { appStatus } = useSelector((state: RootState) => state.global);

  const dispatch = useDispatch();

  const router = useRouter();

  const { userType } = params;

  const getAllUsers = async () => {
    try {
      const loginToken = localStorage?.getItem("login_token");

      if (!loginToken) {
        router.push("/login");
      }

      const response = await MyApi.get(`${userType}`, {
        headers: {
          Authorization: `Bearer ${loginToken}`,
        },
      });
      console.log(response.data.data);
      setApiData(response.data.data);
    } catch (err: any) {
      setShowError(err.response.data?.message);
      console.error(`${userType} error: `, err.response.data?.error);
      dispatch(setAppStatus(err.response.status));
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);
  if (isLoading || !(appStatus === 200)) {
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
      <div className="users-page">
        <div>
          {apiData.length > 0 ? (
            <div className="grid grid-cols-2 gap-8">
              {apiData.map((user: ProfileData, index: number) => (
                <ProfileCard key={index} profileData={user} />
              ))}
            </div>
          ) : (
            <p
              className="flex justify-center items-center"
              style={{ height: "70dvh" }}
            >
              {showError || "User Not Found."}
            </p>
          )}
        </div>
      </div>
    );
  }
};

export default UserTypePage;
