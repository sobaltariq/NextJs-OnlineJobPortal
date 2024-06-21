"use client";
import MyApi from "@/api/MyApi";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// Define the types for the form values
interface FormValues {
  email: string;
  password: string;
}

function Page() {
  const [loginError, setLoginError] = useState(null);
  const router = useRouter();

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
    try {
      const response = await MyApi.post("/admin/login", values, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Logged in:", response.data);
      router.push("/");
    } catch (err: any) {
      setLoginError(err.response.data?.message || "Login failed");
      console.error("Login error:", err.response.data?.message);
    }
  };

  useEffect(() => {
    setLoginError(null);
    console.log(process.env.REACT_APP_BASE_URL);

    // MyApi.post("/admin/register", {});
    // loginHandler();
  }, []);
  return (
    <div>
      <h1>Login</h1>
      {loginError && <p className="error">{loginError}</p>}
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
            <div>
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

export default Page;
