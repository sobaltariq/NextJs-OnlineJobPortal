"use client";
import MyApi from "@/api/MyApi";
import * as Yup from "yup";
import { RootState } from "@/redux/store";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
import { waitSec } from "@/utils/CommonWait";
import Image from "next/image";

import LoadingImg from "../../assets/Loader.svg";
import { setAppStatus } from "@/redux/features/globalSlicer";

interface LoginInterface {
  id: string;
  email: string;
}

interface ChatMessageInterface {
  applicationId: string;
  content: string;
}

interface ReceivedMessageInterface {
  sender: string;
  content: string;
  timestamp: string;
}

interface FormValuesInterface {
  message: string;
}

interface UserInterface {
  userId: string;
  userName: string;
}

const ChatPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isChat, chatApplicationId } = useSelector(
    (state: RootState) => state.chat
  );

  const [showError, setShowError] = useState<string>("");

  const [loggedInUser, setLoggedInUser] = useState<LoginInterface | null>(null);
  const token = localStorage.getItem("login_token");
  const loggedIn = localStorage.getItem("logged_in");

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [messagesList, setMessagesList] = useState<ReceivedMessageInterface[]>(
    []
  );
  const [isRoomJoined, setIsRoomJoined] = useState<boolean>(false);

  const [isLoading, setLoader] = useState<boolean>(true);

  //  for name
  const [usersList, setUsersList] = useState<UserInterface[]>([]);

  const socket = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { appStatus } = useSelector((state: RootState) => state.global);

  useEffect(() => {
    const getMyChatHistory = async () => {
      try {
        const endPoint = `chat/${chatApplicationId}`;

        const response = await MyApi.get(endPoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (loggedIn) {
          const user: LoginInterface = JSON.parse(loggedIn);
          setLoggedInUser(user);
        }

        console.log("getMyChatHistory", response.data?.data);
        setMessagesList(response.data?.data?.messages);

        const messages = response.data?.data?.messages || [];
        const uniqueSenders: string[] = Array.from(
          new Set(messages.map((msg: any) => msg.sender))
        );
        console.log("uniqueSenders", uniqueSenders);

        const userDataPromises = uniqueSenders.map((userId) => getUser(userId));
        const usersData: any = await Promise.all(userDataPromises);
        console.log("usersData", usersData);

        setUsersList(usersData);
      } catch (err: any) {
        console.error("Get Chat History:", err.response.data);
        setShowError(err.response.data.message);

        dispatch(setAppStatus(err.response.status));
      } finally {
        setLoader(false);
      }
    };

    getMyChatHistory();
  }, [chatApplicationId, token]);

  const getUser = async (id: string): Promise<UserInterface | null> => {
    try {
      const endPoint = `chat/users/${id}`;

      const response = await MyApi.get(endPoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("getUser", response.data?.data);
      return response.data?.data;
    } catch (err: any) {
      console.error("getUser:", err.response.data);
      return null;
    }
  };

  useEffect(() => {
    if (chatApplicationId) {
      const newSocket = io(`${process.env.REACT_APP_BASE_URL}`, {
        transports: ["websocket"], // Use WebSocket transport
        auth: {
          token: `Bearer ${token}`,
        },
      });

      socket.current = newSocket;

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
      console.log("chatApplicationId", chatApplicationId);

      newSocket.emit("joinRoom", chatApplicationId);

      const handleRoomJoined = () => {
        setIsRoomJoined(!isRoomJoined);
      };

      const handleMessageReceived = (message: ReceivedMessageInterface) => {
        console.log("Received message:", message);
        setMessagesList((prevMessages) => [...prevMessages, message]);
      };

      newSocket.on("connect", handleConnect);
      newSocket.on("disconnect", handleDisconnect);
      newSocket.on("connect_error", handleError);

      newSocket.on("roomJoined", handleRoomJoined);
      newSocket.on("receiveMessage", handleMessageReceived);

      return () => {
        newSocket.off("connect", handleConnect);
        newSocket.off("disconnect", handleDisconnect);
        newSocket.off("connect_error", handleError);

        newSocket.off("roomJoined", handleRoomJoined);
        newSocket.off("receiveMessage", handleMessageReceived);
      };
    }
  }, [chatApplicationId]);

  useEffect(() => {
    if (!isChat && !chatApplicationId) {
      router.push("/");
    }
  }, [chatApplicationId, isChat, router]);

  useEffect(() => {
    const scrollToBottom = async () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollTo({
          top: messagesEndRef.current.scrollHeight,
        });
      }
    };

    scrollToBottom();
  }, [messagesList, chatApplicationId, isChat, isRoomJoined]);

  const sendMessage = (
    values: FormValuesInterface,
    { resetForm }: FormikHelpers<FormValuesInterface>
  ) => {
    const chatMessage: ChatMessageInterface = {
      applicationId: chatApplicationId,
      content: values.message,
    };

    if (chatMessage.content.trim() === "") return;

    console.log("message: ", chatMessage, "message list: ", messagesList);
    if (socket.current) {
      socket.current.emit("sendMessage", chatMessage);
    } else {
      console.error("Socket is not initialized");
    }

    resetForm();
    console.log(usersList);
  };

  function formatTime(timestamp: string) {
    const date = new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  const initialValues: FormValuesInterface = {
    message: "",
  };

  if (isLoading || !(appStatus === 200)) {
    return (
      <div className="home-page flex justify-center items-center">
        <Image
          src={LoadingImg}
          alt="Loading"
          height={100}
          width={100}
          priority
        />
      </div>
    );
  } else {
    return (
      <div className="chat-page">
        {isChat && chatApplicationId ? (
          <div className="chat-wrapper">
            {/* <h2>Chat Room: {chatApplicationId}</h2> */}
            {!isRoomJoined && (
              <p className="flex justify-center items-center h-full">
                Joining room...
              </p>
            )}
            {isRoomJoined && (
              <div className="chat-container">
                <div>
                  <div className={`message-list s-bar`} ref={messagesEndRef}>
                    {messagesList.map((msg, i) => {
                      return (
                        <div
                          className={`message ${
                            loggedInUser?.id === msg.sender
                              ? "mr-20 my"
                              : "ml-20"
                          } `}
                          data-user-margin={loggedInUser?.id === msg.sender}
                          key={i}
                        >
                          {usersList && (
                            <div className="msg-top flex justify-between mb-2">
                              <h5 className="capitalize">
                                {usersList.find(
                                  (user: UserInterface) =>
                                    user && user.userId === msg.sender
                                )?.userName || "Unknown User"}
                                :
                              </h5>
                              <p>{formatTime(msg.timestamp)}</p>
                            </div>
                          )}
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
                        <Field
                          type="text"
                          id="message"
                          name="message"
                          autoFocus=""
                        />
                        <button
                          type="submit"
                          disabled={
                            isSubmitting || values.message.trim() === ""
                          }
                        >
                          Send
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            )}
          </div>
        ) : showError ? (
          <p
            style={{ height: "70dvh" }}
            className="flex justify-center items-center"
          >
            {showError}
          </p>
        ) : (
          <p className="flex justify-center items-center h-full">
            Something went wrong
          </p>
        )}
      </div>
    );
  }
};

export default ChatPage;
