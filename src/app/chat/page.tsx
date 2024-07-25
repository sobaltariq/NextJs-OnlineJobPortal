"use client";
import MyApi from "@/api/MyApi";
import * as Yup from "yup";
import { RootState } from "@/redux/store";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface FormValuesInterface {
  email: string;
}

const ChatPage = () => {
  const router = useRouter();

  const { isChat } = useSelector((state: RootState) => state.chat);

  useEffect(() => {
    if (!isChat) {
      //   router.push("/applications");
      console.log(isChat);
    }
  }, []);

  const loginHandler = () => {
    console.log("form");
  };

  const initialValues: FormValuesInterface = {
    email: "",
  };

  return (
    <div className="chat-page">
      {isChat ? (
        <div className="chat-wrapper">
          <h1>Chat</h1>
          <div className="chat-container">
            <div>
              <div className="message-list s-bar">
                <div className={`message`}>ok good</div>
                <div className={`message`}>ok good</div>
                <div className={`message`}>ok good</div>
                <div className={`message`}>ok good</div>
                <div className={`message`}>ok good</div>
                <div className={`message`}>ok good</div>
                <div className={`message`}>ok good</div>
                <div className={`message`}>ok good</div>
                <div className={`message`}>ok good</div>
                <div className={`message`}>ok good</div>
                <div className={`message`}>ok good</div>
                <div className={`message`}>ok good</div>
                <div className={`message`}>ok good</div>
                <div className={`message`}>ok good</div>
                <div className={`message`}>ok good</div>
                <div className={`message`}>ok good</div>
                <div className={`message`}>ok good</div>
                <div className={`message`}>ok good</div>
                <div className={`message`}>ok good</div>
                <div className={`message`}>ok good</div>
                <div className={`message`}>ok good</div>
                <div className={`message`}>ok good</div>
                <div className={`message`}>ok good</div>
                <div className={`message`}>ok good</div>
                <div className={`message`}>ok good</div>
                <div className={`message`}>ok good</div>
              </div>
            </div>
            <Formik initialValues={initialValues} onSubmit={loginHandler}>
              {({ isSubmitting }) => (
                <Form className="mt-8">
                  <div>
                    <Field type="email" id="email" name="email" />
                    <button type="submit" disabled={isSubmitting}>
                      Send
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ChatPage;
