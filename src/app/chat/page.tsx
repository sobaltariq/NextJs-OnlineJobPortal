"use client";
import MyApi from "@/api/MyApi";
import * as Yup from "yup";
import { RootState } from "@/redux/store";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";

interface MyApplicationsInterface {
  appDate: string;
  appStatus: string;
  jobId: string;
  jobTitle: string;
  jobCreatedAt: string;
}

interface ChatMessageInterface {
  applicationId: string;
  content: string;
}

interface FormValuesInterface {
  message: string;
}

// let socket: Socket | null = null;

// const socket = io("http://localhost:5010");

const ChatPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isChat, chatApplicationId } = useSelector(
    (state: RootState) => state.chat
  );

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [messagesList, setMessagesList] = useState<ChatMessageInterface[]>([]);
  const [apiData, setApiData] = useState<MyApplicationsInterface[]>([]);
  const [joined, setJoined] = useState<boolean>(false);

  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    if (chatApplicationId) {
      const token = localStorage.getItem("login_token");
      const socket = io("http://localhost:5010", {
        transports: ["websocket"], // Use WebSocket transport
        auth: {
          token: `Bearer ${token}`,
        },
      });

      const handleConnect = () => {
        console.log("Connected to WebSocket server");
        setIsConnected(true);
      };

      const handleDisconnect = (reason: any) => {
        console.log("Disconnected from WebSocket server, Reason:", reason);
        setIsConnected(false);
      };

      const handleError = (err: any) => {
        console.error("Connection Error:", err);
      };

      socket.emit("joinRoom", chatApplicationId);

      const handleRoomJoined = () => {
        setJoined(true);
        // setLoading(false);
      };

      const handleMessage = (message: ChatMessageInterface) => {
        console.log("Received message:", message); // Debug log
        setMessagesList((prevMessages) => [...prevMessages, message]);
      };

      socket.on("connect", handleConnect);
      socket.on("disconnect", handleDisconnect);
      socket.on("roomJoined", handleRoomJoined);
      socket.on("receiveMessage", handleMessage);
      socket.on("connect_error", handleError);

      return () => {
        socket.off("connect", handleConnect);
        socket.off("disconnect", handleDisconnect);
        socket.off("roomJoined", handleRoomJoined);
        socket.off("receiveMessage", handleMessage);
        socket.off("connect_error", handleError);
      };
    }
  }, [chatApplicationId]);

  useEffect(() => {
    if (!isChat && !chatApplicationId) {
      // router.push("/");
      console.log(isChat);
    }
  }, [isChat]);

  const sendMessage = (
    values: FormValuesInterface,
    { resetForm }: FormikHelpers<FormValuesInterface>
  ) => {
    const chat: ChatMessageInterface = {
      applicationId: chatApplicationId,
      content: values.message,
    };

    if (chat.content.trim() === "") return;

    // console.log("message: ", chat.message, "message list: ", messagesList);

    socket.current?.emit("sendMessage", chat);
    setMessagesList((prevMessages) => [...prevMessages, chat]);
    // Clear the input field
    resetForm();
    // setNewMessage("");
  };

  // const sendMessage = () => {
  //   console.log("sent");
  // };
  const initialValues: FormValuesInterface = {
    message: "",
  };

  return (
    <div className="chat-page">
      {isChat && chatApplicationId ? (
        <div className="chat-wrapper">
          <h2>Chat</h2>
          <div className="chat-container">
            <div>
              <div className="message-list s-bar">
                {messagesList.map((msg, i) => {
                  return (
                    <div className={`message`} key={i}>
                      <div className="msg-top flex justify-between mb-2">
                        <h5>{"Anonymous"}</h5>
                        <p>{new Date().toLocaleTimeString()}</p>
                      </div>
                      <p>{msg.content}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <Formik initialValues={initialValues} onSubmit={sendMessage}>
              {({ isSubmitting, values }) => (
                <Form className="mt-8">
                  <div>
                    <Field type="text" id="message" name="message" />
                    <button
                      type="submit"
                      // disabled={isSubmitting || values.message.trim() === ""}
                    >
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
