import React, { useState } from "react";
import { TbDotsVertical } from "react-icons/tb";
import { IoSend } from "react-icons/io5";
import {
  addDoc,
  collection,
  db,
  doc,
  serverTimestamp,
  setDoc,
} from "../../firebase/firebase";

const MessageBoard = ({
  messages,
  userId,
  seller,
  fetchMessages,
  userInfo,
}) => {
  console.log(userInfo, "seller");

  const [message, setMessage] = useState("");
  const handleSendMessage = async () => {
    if (message.trim() === "") return;
    const chatId = seller?.lastMessage?.senderId;

    // Prepare the new message objects for both the sender and receiver
    const lastMessage = {
      senderId: userId,
      receiverId: seller?.lastMessage?.receiverId,
      content: message,
      contentType: "text",
      isRead: false,
      profileImage: seller?.lastMessage?.profileImage,
      profileName: seller?.lastMessage?.profileName,
      timestamp: serverTimestamp(),
    };

    const RecReflastMessage = {
      senderId: seller?.lastMessage?.receiverId,
      receiverId: userId,
      content: message,
      contentType: "text",
      isRead: false,
      profileImage: userInfo?.profileImage,
      profileName: userInfo?.name,
      timestamp: serverTimestamp(),
    };

    const messageData = {
      senderId: userId,
      receiverId: seller?.lastMessage?.receiverId,
      content: message,
      contentType: "text",
      timestamp: serverTimestamp(),
    };

    try {
      const messagesRef = collection(
        db,
        "chats",
        chatId,
        seller?.lastMessage?.receiverId
      );
      await addDoc(messagesRef, messageData);
      await setDoc(
        doc(db, "chats", chatId, "myUsers", seller?.lastMessage?.receiverId),
        {
          lastMessage: lastMessage,
        }
      );
      const recRef = collection(
        db,
        "chats",
        seller?.lastMessage?.receiverId,
        chatId
      );
      await addDoc(recRef, messageData);
      await setDoc(
        doc(db, "chats", seller?.lastMessage?.receiverId, "myUsers", chatId),
        {
          lastMessage: RecReflastMessage,
        }
      );
      fetchMessages(seller);
      setMessage("");
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };
console.log(seller?.lastMessage,"sellerImages")
  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="chat-header w-full h-[8%] border-b flex items-center justify-between px-5">
        <div className="flex items-center gap-2">
          <img
            src={seller?.lastMessage?.profileImage?seller?.lastMessage?.profileImage:"/chat-img.png"}
            alt="user profile"
            className="w-[42px] rounded-full h-[42px]"
          />
          <span className="text-sm font-semibold">
            {seller?.lastMessage?.profileName}
          </span>
        </div>
        <button type="button">
          <TbDotsVertical className="text-lg" />
        </button>
      </div>
      {/* Messages Box */}
      {/* <div className="w-full h-[68vh] overflow-y-auto chat-list"> */}
      <div className="w-full h-[68vh] overflow-y-auto chat-list overflow-x-hidden">
        <p className="text-sm text-[#5c5c5c] text-center font-medium mb-2">
          Today
        </p>
        {messages
          .sort((a, b) => a?.timestamp?.toDate() - b?.timestamp?.toDate())
          ?.map((item) => (
            <div
              className={`w-full px-2 flex flex-col ${
                item.senderId !== userId ? "items-start" : "items-end"
              }`}
            >
              <div
                className={`w-[80%] lg:w-[307px] ${
                  item.senderId !== userId
                    ? "bg-[#F7F7F7] text-[#000000]"
                    : "blue-bg text-white"
                } p-3 rounded-xl text-wrap break-words text-xs lg:text-sm`}
              >
                {item.content}
              </div>
              <span className="text-[10px] text-[#5c5c5c]">
                {new Date(item?.timestamp?.toDate()).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))}
      </div>
      {/* </div> */}

      {/* Input Box */}
      <div className="w-full  px-5 flex items-center justify-center bg-white">
        <div className="border rounded-[20px] w-full flex items-center gap-2 px-4 py-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full text-sm outline-none border-none"
            placeholder="Type here..."
          />
          <button
            onClick={handleSendMessage}
            type="button"
            className="w-[40px] h-[40px] rounded-full bg-blue-500 p-2.5"
          >
            <IoSend className="text-white w-full h-full" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageBoard;
