"use client";
import MyApi from "@/api/MyApi";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface ApplicationParamsInterface {
  jobIdParam: string;
}

interface JobApplicationInterface {
  appId: string;
  appStatus: "pending" | "rejected" | "accepted";
  appCreatedAt: string;
  seekerId: string;
  seekerSkills: string[];
  seekerUserId: string;
  seekerUserName: string;
  seekerUserEmail: string;
}

const ApplicationsOnMyJob: React.FC<ApplicationParamsInterface> = ({
  jobIdParam,
}) => {
  const [showError, setShowError] = useState<string>("");
  const [apiData, setApiData] = useState<JobApplicationInterface[] | []>([]);
  // const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    getApplicationsOnMyJob();
  }, []);

  const getApplicationsOnMyJob = async () => {
    try {
      const loginToken = localStorage?.getItem("login_token");

      const endPoint = `employer/applications/job/${jobIdParam}`;

      const response = await MyApi.get(endPoint, {
        headers: {
          Authorization: `Bearer ${loginToken}`,
        },
      });
      console.log(response.data);
      setApiData(response.data?.data);
    } catch (err: any) {
      setShowError(err.response.data?.message || err.response.data?.error);
      console.error("Get Applications:", err.response);
    }
  };

  const changeAppStatus = async (
    newStatus: "pending" | "accepted" | "rejected",
    appId: string
  ) => {
    try {
      const loginToken = localStorage?.getItem("login_token");

      const endPoint = `/employer/applications/job/${appId}/status`;

      const response = await MyApi.patch(
        endPoint,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${loginToken}`,
          },
        }
      );
      console.log(response.data);
    } catch (err: any) {
      setShowError(err.response.data?.message || err.response.data?.error);
      console.error("Set Applications Status:", err.response);
    }
  };

  return (
    <div className="py-8">
      {apiData.length > 0 ? (
        <div>
          {showError && <p>{showError}</p>}
          <h2 className="pb-4">Applications On MyJob</h2>
          <div className="grid grid-cols-2 gap-8">
            {apiData.map((app: JobApplicationInterface) => {
              return (
                <div
                  key={app.appId}
                  className="py-4 px-2 shadow-inner rounded-lg bg-stone-200"
                >
                  <Link href={`/user/job-seeker/${app.seekerId}`}>
                    <h3>Name:{app?.seekerUserName}</h3>
                    <p>
                      Applied At:{" "}
                      {new Date(app?.appCreatedAt).toLocaleDateString()}
                    </p>
                    <p>Email: {app?.seekerUserEmail}</p>
                    <p>Status: {app?.appStatus}</p>
                  </Link>
                  <div>
                    <div className="flex justify-between pt-4">
                      {app.appStatus !== "pending" && (
                        <button
                          onClick={() => changeAppStatus("pending", app.appId)}
                        >
                          Pending
                        </button>
                      )}
                      {app.appStatus !== "accepted" && (
                        <button
                          onClick={() => changeAppStatus("accepted", app.appId)}
                        >
                          Accept
                        </button>
                      )}
                      {app.appStatus !== "rejected" && (
                        <button
                          onClick={() => changeAppStatus("rejected", app.appId)}
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p>Application not found</p>
      )}
    </div>
  );
};

export default ApplicationsOnMyJob;
