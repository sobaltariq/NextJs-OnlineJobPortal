"use client";
import MyApi from "@/api/MyApi";
import composeHOCs from "@/hocs/composeHOCs";
import LoginAuth from "@/hocs/LoginAuth";
import {
  isChatEnabled,
  setChatApplicationId,
} from "@/redux/features/chatSlicer";
import { RootState } from "@/redux/store";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import LoadingImg from "../../assets/Loader.svg";
import { setAppStatus } from "@/redux/features/globalSlicer";

interface MyApplicationsInterface {
  appId: string;
  appDate: string;
  appStatus: string;
  jobId: string;
  jobTitle: string;
  jobCreatedAt: string;
}

const MyApplicationsPage: React.FC = () => {
  const router = useRouter();
  const [showError, setShowError] = useState<string>("");
  const [apiData, setApiData] = useState<MyApplicationsInterface[]>([]);

  const [isLoading, setLoader] = useState<boolean>(true);

  const dispatch = useDispatch();
  const { isChat, chatApplicationId } = useSelector(
    (state: RootState) => state.chat
  );
  const { appStatus } = useSelector((state: RootState) => state.global);

  const getMyApplications = async () => {
    try {
      const loginToken = localStorage?.getItem("login_token");

      const endPoint = `job-seeker/application/my-applications`;

      const response = await MyApi.get(endPoint, {
        headers: {
          Authorization: `Bearer ${loginToken}`,
        },
      });
      setApiData(response.data?.data);
    } catch (err: any) {
      setShowError(err.response.data?.message || err.response.data?.error);
      console.error("Get Single Application:", err.response.data);
      dispatch(setAppStatus(err.response.status));
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    dispatch(isChatEnabled(false));
    getMyApplications();
  }, []);

  const chatHandler = () => {
    dispatch(isChatEnabled(!isChat));
    router.push("/chat");
  };

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
      <div className="applications-page">
        {apiData.length > 0 ? (
          <div className="applications-wrapper">
            <h1>
              My Applications: <span>{apiData.length}</span>
            </h1>
            <div className="grid grid-cols-2 gap-8">
              {apiData.map((app: MyApplicationsInterface, i: number) => {
                return (
                  <div key={i} className="job-card">
                    <div>
                      <h2 className="capitalize">
                        <Link href={`/jobs/${app.jobId}`}>{app.jobTitle}</Link>
                      </h2>
                    </div>
                    <div className="flex justify-between py-2">
                      <p>
                        Job Posted:{" "}
                        <span>
                          {new Date(app.jobCreatedAt).toLocaleDateString()}
                        </span>
                      </p>
                      <p>
                        Applied Date:{" "}
                        <span>
                          {new Date(app.appDate).toLocaleDateString()}
                        </span>
                      </p>
                    </div>
                    <div className="flex justify-between py-2">
                      <p>
                        Status:{" "}
                        <span className="capitalize">{app.appStatus}</span>
                      </p>
                      {app.appStatus === "accepted" && (
                        <button
                          onClick={() => {
                            chatHandler();
                            dispatch(setChatApplicationId(app.appId));
                          }}
                        >
                          Chat Now
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div>
            {showError ? (
              <p>{showError}</p>
            ) : (
              <p
                className="flex justify-center items-center"
                style={{ height: "70dvh" }}
              >
                No Application Found
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
};

export default composeHOCs(LoginAuth)(MyApplicationsPage);
