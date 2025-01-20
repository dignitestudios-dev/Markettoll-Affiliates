import React, { useContext, useEffect, useState } from "react";
import { GoArrowLeft } from "react-icons/go";
import { Link } from "react-router-dom";
import { IoSend } from "react-icons/io5";
import { AuthContext } from "../../context/authContext";
import {
  addDoc,
  collection,
  db,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
} from "../../firebase/firebase";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "../../api/api";

const LiveChatPage = () => {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const adminId = "6759530c2f12b98bc6a5c19b";
  const userId = user?._id;

  const sendNotification = async () => {
    const fcmTokenMarkettoll = JSON.parse(
      localStorage.getItem("fcmTokenMarkettoll")
    );
    if (!fcmTokenMarkettoll) {
      toast.error("FCM Token not found.");
      return;
    }
    try {
      await axios.post(
        `${BASE_URL}/users/customer-support-chat-message-notification/${adminId}`,
        {
          title: "chat Support Notification.",
          attachments: [{ url: "https://image.png", type: "png" }],
          body: message,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
    } catch (error) {
      console.log("chat support notifixation could not be sent.", error);
    }
  };

  const handleSendMessage = async () => {
    if (message.trim() === "") return;

    const chatId = `chat_${userId}_${adminId}`;

    const messageData = {
      senderId: userId,
      text: message,
      timestamp: new Date().toISOString(),
    };

    try {
      const messagesRef = collection(db, "Adminchats", chatId, "messages");
      await addDoc(messagesRef, messageData);
      await setDoc(doc(db, "userChats", userId), {
        user: {
          name: user?.name,
          pic: user?.profileImage,
        },
        chatId,
        lastMessage: message,
        timestamp: new Date().toISOString(),
      });
      sendNotification();
      setMessage("");
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  // Fetch messages and listen for real-time updates
  const fetchMessages = () => {
    const chatId = `chat_${userId}_${adminId}`;
    const messagesRef = collection(db, "Adminchats", chatId, "messages");

    const messagesQuery = query(messagesRef);

    // Real-time listener for messages
    onSnapshot(messagesQuery, (querySnapshot) => {
      const messagesList = querySnapshot.docs.map((doc) => doc.data());
      // console.log(messagesList, "messageList");
      setMessages(messagesList); // Update state with new messages
    });
  };

  useEffect(() => {
    if (userId) {
      fetchMessages(); // Start listening for messages once userId is available
    }
  }, [userId]);

  return (
    <div className="w-full px-0 md:px-5">
      <div className="flex items-center gap-2">
        <Link to="/settings/support-request">
          <GoArrowLeft className="text-2xl" />
        </Link>
        <h2 className="font-bold text-[28px] blue-text">Live Chat</h2>
      </div>
      <div className="w-full border mt-5 mb-4" />

      <div className="w-full h-[450px] relative">
        <p className="text-sm text-[#5c5c5c] text-center font-medium mb-2">
          Today
        </p>
        {messages
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
          .map((item) => (
            <div
              key={item.timestamp}
              className={`w-full flex flex-col ${
                item.senderId !== userId ? "items-start" : "items-end"
              }`}
            >
              <div
                className={`w-[80%] lg:w-[307px] ${
                  item.senderId !== userId
                    ? "bg-[#F7F7F7] text-[#000000]"
                    : "blue-bg text-white"
                } p-3 rounded-xl text-xs lg:text-sm `}
              >
                {item.text}
              </div>
              <span className="text-[10px] text-[#5c5c5c]">
                {new Date(item.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))}
      </div>

      <div className="w-full bg-white border-t h-16 absolute bottom-0 flex items-center justify-between gap-2">
        <div className="border rounded-2xl px-2 mr-0 md:mr-5 h-[50px] py-1 w-full flex items-center justify-between">
          <img
            src="/emoji-icon.png"
            alt="emoji-icon"
            className="w-[17.3px] h-[17.3px]"
          />
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message"
            className="bg-white outline-none h-full text-sm text-[#5c5c5c] w-full px-3"
          />
          <button
            onClick={handleSendMessage}
            type="submit"
            className="h-[40px] w-[40px] blue-bg rounded-full p-2"
          >
            <IoSend className="text-white w-full h-full" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveChatPage;
