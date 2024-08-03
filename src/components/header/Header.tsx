"use client";
import React, { useEffect, useRef, useState } from "react";
// import "../header/headerMedia.scss";
import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout, setSearch } from "@/redux/features/auth/authSlice";
import { RootState } from "@/redux/store";
import { RxCross2 } from "react-icons/rx";
import { IoSearchSharp } from "react-icons/io5";
import MyApi from "@/api/MyApi";

import { FiMenu } from "react-icons/fi";

interface JobsInterface {
  jobId: string;
  jobTitle: string;
  jobCreatedAt: string;
  jobDescription: string;
  jobLocation: string;
  jobSalary: string;
  jobCompany: string;
  employerUserId: string;
  employerName: string;
}

const Header: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [apiData, setApiData] = useState<JobsInterface[] | []>([]);
  const [filteredData, setFilteredData] = useState<JobsInterface[] | []>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);
  const menuContainerRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  const { isLoggedIn, userRole, isSearch } = useSelector(
    (state: RootState) => state.auth
  );

  const router = useRouter();
  const pathname = usePathname();

  const logoutHandler: () => void = () => {
    dispatch(logout());
    router.push("/login");
  };

  const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log("value", value);

    setSearchValue(value);
    if (value) {
      const filtered = apiData.filter((job) =>
        job.jobTitle.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered);

      console.log("fil", filtered);
    } else {
      setFilteredData([]);
    }

    dispatch(setSearch(true));
  };

  useEffect(() => {
    if (!isSearch && inputRef.current) {
      inputRef.current.blur();
    }
    console.log(isSearch);

    const getAllJobs = async () => {
      try {
        const loginToken = localStorage.getItem("login_token");

        const response = await MyApi.get("/employer/job-postings/all-jobs", {
          headers: {
            Authorization: `Bearer ${loginToken}`,
          },
        });
        console.log("aaaaa", response.data?.data);
        // response.data?.data.map((job: JobsInterface)=> job.jobTitle)
        setApiData(response.data?.data);
      } catch (err: any) {
        if (err.response) {
          console.error(`get jobs error: `, err.response.data?.error);
        }
      }
    };

    getAllJobs();
  }, [isSearch, inputRef]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        dispatch(setSearch(false));
        setSearchValue("");
        setFilteredData([]);
      }
    };
    const handleClickMenuOutside = (event: MouseEvent) => {
      if (
        menuContainerRef.current &&
        !menuContainerRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("mousedown", handleClickMenuOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("mousedown", handleClickMenuOutside);
    };
  }, [dispatch]);

  return (
    <header className="width-container">
      <div
        className="outer-wrapper"
        ref={menuContainerRef}
        onClick={() => {
          isMenuOpen && setMenuOpen(false);
        }}
      >
        <div
          className="mobile"
          onClick={() => {
            setMenuOpen(true);
          }}
        >
          <FiMenu />
        </div>
        <nav className="header-wrapper" data-is-menu-open={isMenuOpen}>
          <ul>
            {isLoggedIn && (
              <>
                <li className={`link ${pathname === "/" ? "active" : ""}`}>
                  <Link href="/" className="">
                    Home
                  </Link>
                </li>
                <li
                  className={`link ${
                    pathname === "/user/employer" ? "active" : ""
                  }`}
                >
                  <Link href="/user/employer">Employer</Link>
                </li>
                <li
                  className={`link ${
                    pathname === "/user/job-seeker" ? "active" : ""
                  }`}
                >
                  <Link href="/user/job-seeker">Job Seeker</Link>
                </li>
                {userRole === "employer" && (
                  <li
                    className={`link ${
                      pathname === "/jobs/my-jobs" ? "active" : ""
                    }`}
                  >
                    <Link href="/jobs/my-jobs">My Jobs</Link>
                  </li>
                )}
                {userRole === "job seeker" && (
                  <li
                    className={`link ${
                      pathname === "/applications" ? "active" : ""
                    }`}
                  >
                    <Link href="/applications">My Applications</Link>
                  </li>
                )}
              </>
            )}
          </ul>
          <div className="side-header">
            {isLoggedIn && (
              <div className="logged-in">
                <div className="search-container" ref={searchContainerRef}>
                  <div className="search flex justify-between gap-2 items-center">
                    <label
                      htmlFor="search"
                      className="flex justify-start items-center gap-2"
                    >
                      <IoSearchSharp />

                      <input
                        type="text"
                        placeholder="Search Job..."
                        id="search"
                        ref={inputRef}
                        value={searchValue}
                        onChange={searchHandler}
                      />
                    </label>
                    {isSearch && (
                      <RxCross2
                        onClick={() => {
                          dispatch(setSearch(false));
                          setSearchValue("");
                          setFilteredData([]);
                        }}
                      />
                    )}
                  </div>
                  {isSearch && (
                    <div className="search-results ">
                      <div className="s-bar">
                        {filteredData.length <= 0 && (
                          <p>
                            <span>No Job Found</span>
                          </p>
                        )}
                        <>
                          {filteredData.map((job: JobsInterface, i) => {
                            return (
                              <p key={i}>
                                <Link
                                  href={`/jobs/${job.jobId}`}
                                  onClick={() => {
                                    dispatch(setSearch(false));
                                    setFilteredData([]);
                                    setSearchValue("");
                                  }}
                                >
                                  <span>{job.jobTitle}</span>
                                </Link>
                              </p>
                            );
                          })}
                        </>
                      </div>
                    </div>
                  )}
                </div>
                <div
                  className={`link ${pathname === "/profile" ? "active" : ""}`}
                >
                  <Link href="/profile">Profile</Link>
                </div>
                {isLoggedIn && <button onClick={logoutHandler}>Logout</button>}
              </div>
            )}
            {!isLoggedIn && (
              <div className="logged-out">
                <Link
                  href="/login"
                  className={`link ${pathname === "/login" ? "active" : ""}`}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className={`link ${pathname === "/register" ? "active" : ""}`}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
