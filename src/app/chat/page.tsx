"use client";
import MyApi from "@/api/MyApi";
import * as Yup from "yup";
import { RootState } from "@/redux/store";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

interface ChatMessageInterface {
  message: string;
}

interface FormValuesInterface {
  message: string;
}

// const socket = io(
//   "http://localhost:5010"
//     , {
//     auth: {
//       token: localStorage?.getItem("login_token"), // Add your token logic
//     },
//   }
// );
const socket = io("http://localhost:5010");

const ChatPage = () => {
  const router = useRouter();

  const { isChat } = useSelector((state: RootState) => state.chat);

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messagesList, setMessagesList] = useState<ChatMessageInterface[]>([]);
  // const [newMessage, setNewMessage] = useState<string>("");

  useEffect(() => {
    const handleConnect = () => {
      console.log("Connected to WebSocket server");
      setIsConnected(true);
    };

    const handleDisconnect = (reason: any) => {
      console.log("Disconnected from WebSocket server, Reason:", reason);
      setIsConnected(false);
    };

    const handleMessage = (message: ChatMessageInterface) => {
      console.log("Received message:", message); // Debug log
      setMessagesList((prevMessages) => [...prevMessages, message]);
    };

    const handleError = (err: any) => {
      console.error("Connection Error:", err);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("chat message", handleMessage);
    socket.on("connect_error", handleError);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("chat message", handleMessage);
      socket.off("connect_error", handleError);
    };

    // Cleanup on component unmount
    // return () => {
    //   if (isConnected) {
    //     socket.off("connect");
    //     socket.off("disconnect");
    //     socket.off("chat message");
    //     socket.off("connect_error");
    //     socket.disconnect();
    //   }
    // };
  }, []);

  useEffect(() => {
    if (!isChat) {
      router.push("/");
      console.log(isChat);
    }
  }, [isChat]);

  const sendMessage = (
    values: FormValuesInterface,
    { resetForm }: FormikHelpers<FormValuesInterface>
  ) => {
    const chat: ChatMessageInterface = {
      message: values.message,
    };

    if (chat.message.trim() === "") return;

    console.log("message: ", chat.message, "message list: ", messagesList);

    // Emit message to server
    if (chat.message) {
      socket.emit("chat message", chat);
    }

    // Optimistically update the UI
    setMessagesList((prevMessages) => [...prevMessages, chat]);

    // Clear the input field
    resetForm();
    // setNewMessage("");
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
                {messagesList.map((msg, i) => {
                  return (
                    <div className={`message`} key={i}>
                      <div className="msg-top flex justify-between mb-2">
                        <h5>{"Anonymous"}</h5>
                        <p>{new Date().toLocaleTimeString()}</p>
                      </div>
                      <p>{msg.message}</p>
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
                      disabled={isSubmitting || values.message.trim() === ""}
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
