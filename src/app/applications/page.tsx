"use client";
import MyApi from "@/api/MyApi";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface MyApplicationsInterface {
  appDate: string;
  appStatus: string;
  jobId: string;
  jobTitle: string;
  jobCreatedAt: string;
}

const MyApplicationsPage: React.FC = () => {
  const [showError, setShowError] = useState<string>("");
  const [apiData, setApiData] = useState<MyApplicationsInterface[]>([]);
  const [userType, setUserType] = useState<string | null>(null);

  const getMyApplications = async () => {
    try {
      const loginToken = localStorage?.getItem("login_token");
      const userRole = localStorage?.getItem("user_role");

      const endPoint = `job-seeker/application/my-applications`;

      const response = await MyApi.get(endPoint, {
        headers: {
          Authorization: `Bearer ${loginToken}`,
        },
      });
      console.log(response.data);
      setApiData(response.data?.data);
      setUserType(userRole);
    } catch (err: any) {
      setShowError(err.response.data?.message || err.response.data?.error);
      console.error("Get Single Application:", err.response.data);
    }
  };

  useEffect(() => {
    getMyApplications();
  }, []);

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
                    <h2>
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
                      <span>{new Date(app.appDate).toLocaleDateString()}</span>
                    </p>
                  </div>
                  <div>
                    <p>
                      Status: <span>{app.appStatus}</span>
                    </p>
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
};

export default MyApplicationsPage;
