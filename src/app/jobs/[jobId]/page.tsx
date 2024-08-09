"use client";
import MyApi from "@/api/MyApi";
import ApplicationsOnMyJob from "@/components/applications/ApplicationsOnMyJob";
import { isChatEnabled } from "@/redux/features/chatSlicer";
import { useRouter } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import LoadingImg from "../../../assets/Loader.svg";
import Image from "next/image";
import { RootState } from "@/redux/store";
import { setAppStatus } from "@/redux/features/globalSlicer";

interface JobParamsInterface {
  params: {
    jobId: string;
  };
}

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
  applications: JobApplicationInterface[];
  jobCreatedAt: string;
  jobDescription: string;
  employerUserId: string;
  employerName: string;
  jobLocation: string;
  jobRequirements: string[];
  jobSalary: string;
  jobCompany: string;
}

const SingleJobPage: React.FC<JobParamsInterface> = ({ params }) => {
  const [showError, setShowError] = useState<string>("");
  const [apiData, setApiData] = useState<JobsInterface | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<any>(null);

  const [isLoading, setLoader] = useState<boolean>(true);

  const { appStatus } = useSelector((state: RootState) => state.global);

  const dispatch = useDispatch();

  const router = useRouter();

  const { jobId } = params;

  const getOneJob = async () => {
    try {
      const loginToken = localStorage?.getItem("login_token");
      const userRole = localStorage?.getItem("user_role");
      const loggedIn = localStorage.getItem("logged_in");

      if (!loginToken) {
        router.push("/login");
      }

      const endPoint = `/employer/job-postings/${jobId}`;

      const response = await MyApi.get(endPoint, {
        headers: {
          Authorization: `Bearer ${loginToken}`,
        },
      });
      console.log(response.data?.data);
      setApiData(response.data?.data);
      setUserType(userRole);
      if (loggedIn) {
        const user: LoginInterface = JSON.parse(loggedIn);
        setLoggedInUser(user);
      }
    } catch (err: any) {
      setShowError(err.response.data?.message || "Get Single Job");
      console.error("Get Single Job:", err.response);
      dispatch(setAppStatus(err.response.status));
    } finally {
      setLoader(false);
      if (loggedInUser) {
        dispatch(setAppStatus(200));
      }
    }
  };

  useEffect(() => {
    dispatch(isChatEnabled(false));

    getOneJob();
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
      <div className="single-job-page">
        {apiData ? (
          <div
            className="single-job-wrapper"
            data-is-employer={
              apiData.employerUserId === loggedInUser?.id ? "true" : "false"
            }
          >
            <div className="user-data">
              <div>
                <h1 className="capitalize">{apiData.jobTitle}</h1>

                <div className="info-box">
                  <p>Date</p>
                  <p>{new Date(apiData?.jobCreatedAt).toLocaleDateString()}</p>
                </div>
                <div className="info-box">
                  <p>Salary</p>
                  <p>{apiData.jobSalary}</p>
                </div>
                <div className="info-box">
                  <p>Location</p>
                  <p>{apiData.jobLocation}</p>
                </div>
                <div className="info-box">
                  <p>Company</p>
                  <p className="capitalize">{apiData.jobCompany}</p>
                </div>
                <div className="info-box">
                  <p>Employer</p>
                  <p className="capitalize">{apiData.employerName}</p>
                </div>
                <div className="info-box">
                  <p>Applications</p>
                  <p>{apiData.applications.length}</p>
                </div>
                <div className="info-box">
                  <h4>About Job</h4>
                  <p>{apiData.jobDescription}</p>
                </div>

                <div className="info-box mb-0">
                  <p>Requirements</p>
                  <p>
                    {apiData.jobRequirements.map((item, i) => {
                      return (
                        <Fragment key={i}>
                          <span className="px-2 select-none ">{item}</span>{" "}
                        </Fragment>
                      );
                    })}
                  </p>
                </div>
              </div>
            </div>
            {apiData.employerUserId === loggedInUser?.id && (
              <ApplicationsOnMyJob jobIdParam={jobId} />
            )}
          </div>
        ) : (
          <div className="single-job-wrapper">
            <p className="msg-p flex justify-center items-center">
              {showError || "Job Not Found"}
            </p>
          </div>
        )}
      </div>
    );
  }
};

export default SingleJobPage;
