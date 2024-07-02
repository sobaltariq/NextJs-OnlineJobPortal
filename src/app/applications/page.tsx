"use client";
import MyApi from "@/api/MyApi";
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
    <div>
      {apiData ? (
        <div>
          <h2 className="pb-4">
            My Applications: <span>{apiData.length}</span>
          </h2>
          <div className="flex justify-between flex-wrap gap-4">
            {apiData.map((app: MyApplicationsInterface, i: number) => {
              return (
                <div
                  key={i}
                  className="py-4 px-2 shadow-inner rounded-lg bg-stone-200 w-[49%]"
                >
                  <div>
                    <h3>{app.jobTitle}</h3>
                    <p>
                      Status: <span>{app.appStatus}</span>
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p>
                      Job Posted:{" "}
                      {new Date(app.jobCreatedAt).toLocaleDateString()}
                    </p>
                    <p>
                      Applied Date: {new Date(app.appDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p>No Application Found</p>
      )}
    </div>
  );
};

export default MyApplicationsPage;
