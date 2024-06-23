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
    email: Yup.string().email("Invalid email").required("Email is required"),
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

        const { token, role } = response.data;

        localStorage.setItem("login_token", token);
        localStorage.setItem("user_role", role);

        // save role in redux store
        dispatch(setAuthData({ token, userRole: role }));

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
    <div>
      <h1>Login</h1>
      {loginError && <p className="error">{loginError}</p>}
      <div className="flex justify-between items-center">
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
            </div>
            <div className="mt-3 mb-3">
              <Field type="password" id="password" name="password" />
            </div>
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
            <div>
              <ErrorMessage name="email" component="div" />
              <ErrorMessage name="password" component="div" />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default composeHOCs(LoginAuth)(LoginPage);
