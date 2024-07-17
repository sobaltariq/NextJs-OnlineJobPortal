"use client";
import MyApi from "@/api/MyApi";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import composeHOCs from "@/hocs/composeHOCs";
import LoginAuth from "@/hocs/LoginAuth";

import { useSelector, useDispatch } from "react-redux";
import { setAuthData } from "@/redux/features/auth/authSlice";

// Define the types for the form values
interface FormValues {
  email: string;
  password: string;
}

function LoginPage() {
  const [userType, setUserType] = useState("admin");
  const [loginError, setLoginError] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const initialValues: FormValues = {
    email: "",
    password: "",
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .trim()
      .email("Invalid email")
      .required("Email is required")
      .transform((value) => value.toLowerCase()),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const loginHandler = async (values: FormValues) => {
    const loginToken = localStorage.getItem("login_token");
    if (!loginToken || loginToken === "undefined") {
      try {
        const endPoint =
          userType === "admin"
            ? "/admin/login"
            : userType === "employer"
            ? "/employer/login"
            : "/job-seeker/login";
        const response = await MyApi.post(endPoint, values, {
          headers: { "Content-Type": "application/json" },
        });

        console.log(response.data);

        const { token, role, email, id } = response.data;
        const loggedInUser = {
          id,
          email,
        };
        localStorage.setItem("login_token", token);
        localStorage.setItem("user_role", role);
        localStorage.setItem("logged_in", JSON.stringify(loggedInUser));

        // save role in redux store
        dispatch(
          setAuthData({
            token,
            role,
            isLoggedIn: false,
          })
        );

        router.push("/");
      } catch (err: any) {
        setLoginError(err.response.data?.message || "Login failed");
        console.error("Login error:", err.response.data?.message);
      }
    }
  };
  useEffect(() => {
    setLoginError(null);
  }, []);

  return (
    <div className="login-page">
      <div className="page-wrapper">
        <h1>Login</h1>
        {loginError && <p className="error">{loginError}</p>}
        <div className="user-type">
          <button
            onClick={() => {
              setUserType("seeker");
            }}
          >
            Job Seeker
          </button>
          <button
            onClick={() => {
              setUserType("employer");
            }}
          >
            Employer
          </button>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={loginHandler}
        >
          {({ isSubmitting }) => (
            <Form>
              <div>
                <Field type="email" id="email" name="email" />
                <ErrorMessage name="email" component="div" />
              </div>
              <div className="mt-3 mb-3">
                <Field type="password" id="password" name="password" />
                <ErrorMessage name="password" component="div" />
              </div>
              <button type="submit" disabled={isSubmitting}>
                Submit
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default composeHOCs(LoginAuth)(LoginPage);
