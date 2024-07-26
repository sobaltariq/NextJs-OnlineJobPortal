"use client";
import MyApi from "@/api/MyApi";
import * as Yup from "yup";
import { RootState } from "@/redux/store";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

interface ChatMessage {
  sender: string;
  message: string;
  date: string;
}

interface FormValuesInterface {
  message: string;
}

const socket = io(
  "http://localhost:5000"
  //   , {
  //   auth: {
  //     token: localStorage?.getItem("login_token"), // Add your token logic
  //   },
  // }
);

const ChatPage = () => {
  const router = useRouter();

  const { isChat } = useSelector((state: RootState) => state.chat);

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState<string>("");

  // useEffect(() => {
  //   // Listen for incoming messages
  //   socket.on("chat message", (message) => {
  //     // setMessages((prevMessages) => [...prevMessages, message]);
  //   });

  //   // Cleanup on component unmount
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  useEffect(() => {
    if (!isChat) {
      //   router.push("/applications");
      console.log(isChat);
    }
  }, []);

  const sendMessage = () => {
    console.log("ok");
  };

  const initialValues: FormValuesInterface = {
    message: "",
  };

  return (
    <div className="chat-page">
      {isChat ? (
        <div className="chat-wrapper">
          <div className="chat-container">
            <div>
              <div className="message-list s-bar">
                {messages.map((msg, i) => {
                  return (
                    <div className={`message`} key={i}>
                      <div className="msg-top flex justify-between mb-2">
                        <h5>{msg}</h5>
                        <p>{msg}</p>
                      </div>
                      <p>{msg}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <Formik initialValues={initialValues} onSubmit={sendMessage}>
              {({ isSubmitting }) => (
                <Form className="mt-8">
                  <div>
                    <Field type="text" id="message" name="message" />
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
