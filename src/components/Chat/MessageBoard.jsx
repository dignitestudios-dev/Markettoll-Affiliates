import React, { useContext, useEffect, useState } from "react";
import { TbDotsVertical } from "react-icons/tb";
import { IoSend } from "react-icons/io5";
import {
  collection,
  db,
  doc,
  serverTimestamp,
  writeBatch,
} from "../../firebase/firebase";
import BlockAndDeleteModal from "./BlockAndDeleteModal";
import BlockUserModal from "./BlockUserModal";
import ReportChatUserModal from "./ReportChatUserModal";
import { AuthContext } from "../../context/authContext";
import EmojiPicker from "emoji-picker-react";
import { SlEmotsmile } from "react-icons/sl";
import { BASE_URL } from "../../api/api";
import { toast } from "react-toastify";
import axios from "axios";
const MessageBoard = ({
  messages,
  userId,
  seller,
  fetchMessages,
  userInfo,
  singleOnline,
}) => {
  const [EmogiPick, SetEmogiPick] = useState(false);
  const [message, setMessage] = useState("");
  const [dropdown, setDropdown] = useState(false);
  const [openDeleteChatModal, setOpenDeleteChatModal] = useState(false);
  const [openBlockUserModal, setOpenBlockUserModal] = useState(false);
  const [openReportModal, setOpenReportModal] = useState(false);

  const { isBlockedByUser, hasBlocked } = useContext(AuthContext);
  const toggleDropdown = () => {
    setDropdown(!dropdown);
  };

  const toggleDeleteChatModal = () => {
    setOpenDeleteChatModal(!openDeleteChatModal);
    setDropdown(false);
  };
  const toggleBlockUserModal = () => {
    setOpenBlockUserModal(!openBlockUserModal);
    setDropdown(false);
  };

  const toggleReportModal = () => {
    setOpenReportModal(!openReportModal);
    setDropdown(false);
  };

  const handleSendMessage = async () => {
    if (message.trim() === "") return;

    const chatId = userId;
    const lastMessage = {
      userSendId: userId,
      senderId: userId,
      receiverId: seller?.id,
      content: message,
      contentType: "text",
      isRead: false,
      profileImage: seller?.lastMessage?.profileImage,
      profileName: seller?.lastMessage?.profileName,
      timestamp: serverTimestamp(),
    };

    const RecReflastMessage = {
      userSendId: userId,
      senderId: seller?.id,
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
      receiverId: seller?.id,
      content: message,
      contentType: "text",
      timestamp: serverTimestamp(),
    };

    const batch = writeBatch(db);

    try {
      const messagesRef = collection(db, "chats", chatId, seller?.id);
      batch.set(doc(db, "chats", chatId, "myUsers", seller?.id), {
        lastMessage,
      });
      batch.set(doc(db, "chats", seller?.id, "myUsers", chatId), {
        lastMessage: RecReflastMessage,
      });
      batch.set(doc(messagesRef), messageData);
      const recRef = collection(db, "chats", seller?.id, chatId);
      batch.set(doc(recRef), messageData);
      await batch.commit();
      fetchMessages(seller?.id, seller);
      setMessage("");
      const notificationData = {
        title: "This is a chat message notification.",
        attachments: [],
        body: RecReflastMessage?.content,
      };

      const res = await axios.post(
        `${BASE_URL}/users/chat-message-notification/${seller?.id}`,
        notificationData,
        {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error sending message: ", error);
      toast.error(error?.response?.data?.message);
    }
  };

  const formatDate = (timestamp) => {
    const today = new Date();
    const messageDate = new Date(timestamp?.toDate());

    // Check if the message was sent today
    if (
      today.getDate() === messageDate.getDate() &&
      today.getMonth() === messageDate.getMonth() &&
      today.getFullYear() === messageDate.getFullYear()
    ) {
      return "Today"; // If the message is from today
    }
    const month = messageDate.getMonth() + 1; // Months are zero-indexed
    const day = messageDate.getDate();
    const year = messageDate.getFullYear();

    return `${month}/${day}/${year}`; // Format as 1/12/2025
  };
  const handleEmojiClick = (e) => {
    setMessage((prevMessage) => prevMessage + e.emoji);
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <BlockAndDeleteModal
        state={openDeleteChatModal}
        onclose={toggleDeleteChatModal}
        sellerId={seller?.id}
        userId={userInfo?._id}
        fetchMessages={fetchMessages}
        seller={seller}
      />
      <BlockUserModal
        state={openBlockUserModal}
        onclose={toggleBlockUserModal}
        sellerId={seller?.id}
        blockedStatus={hasBlocked || (isBlockedByUser && hasBlocked)}
      />
      <ReportChatUserModal
        state={openReportModal}
        onclose={toggleReportModal}
        sellerId={seller?.lastMessage?.receiverId}
      />
      <div className="chat-header w-full h-[8%] border-b flex items-center justify-between px-5">
        <div className="flex items-center gap-2">
          <div className="relative flex">
            <img
              src={
                seller?.lastMessage?.profileImage
                  ? seller?.lastMessage?.profileImage
                  : "/chat-img.png"
              }
              alt="user profile"
              className="w-[42px] rounded-full h-[42px]"
            />
            {/* <span
              className={`flex absolute -right-[10px] w-3 h-3 me-3 ${
                LastMessages.filter(e=>e.id.includes(seller?.lastMessage?.id)) ? "bg-green-300" : "bg-yellow-300"
              } rounded-full`}
            ></span> */}
          </div>
          <span className="text-sm font-semibold">
            {seller?.lastMessage?.profileName}
          </span>
        </div>
        <div className="relative">
          <button type="button" onClick={toggleDropdown} className="relative">
            <TbDotsVertical className="text-lg" />
          </button>
          {dropdown && (
            <div className="min-w-32 min-h-24 bg-white py-2 rounded-xl shadow z-10 absolute right-3 text-start">
              <button
                type="button"
                onClick={() => toggleDeleteChatModal()}
                className="text-base font-medium w-full px-5 py-1 text-start"
              >
                Delete Chat
              </button>
              <button
                type="button"
                onClick={() => toggleBlockUserModal()}
                className="text-base font-medium w-full px-5 py-1 text-start"
              >
                {hasBlocked ? "Unblock" : "Block"}
              </button>
              <button
                type="button"
                onClick={() => toggleReportModal()}
                className="text-base font-medium w-full px-5 py-1 text-start"
              >
                Report
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Messages Box */}
      {/* <div className="w-full h-[68vh] overflow-y-auto chat-list"> */}
      <div className="w-full h-[68vh] overflow-y-auto chat-list overflow-x-hidden">
        {/* Display dynamic date or "Today" */}
        {messages
          .sort((a, b) => a?.timestamp?.toDate() - b?.timestamp?.toDate())
          ?.map((item, index, arr) => {
            const currentMessageDate = formatDate(item.timestamp);
            const prevMessageDate =
              index > 0 ? formatDate(arr[index - 1].timestamp) : "";
            return (
              <div key={item.id}>
                {currentMessageDate !== prevMessageDate &&
                  currentMessageDate && (
                    <p className="text-sm text-[#5c5c5c] mt-2 text-center font-medium mb-2">
                      {currentMessageDate.includes("NaN/")
                        ? ""
                        : currentMessageDate}
                    </p>
                  )}
                <div
                  className={`w-full px-2 flex flex-col ${
                    item.senderId !== userId ? "items-start" : "items-end"
                  }`}
                >
                  <div
                    className={`min-w-auto max-w-[50%] ${
                      item.senderId !== userId
                        ? "bg-[#F7F7F7] text-[#000000]"
                        : "blue-bg text-white"
                    } p-3 rounded-xl text-wrap break-words text-xs lg:text-sm`}
                  >
                    {item.content}
                  </div>
                  <span className="text-[10px] text-[#5c5c5c]">
                    {new Date(item?.timestamp?.toDate()).toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </span>
                </div>
              </div>
            );
          })}
      </div>
      {/* </div> */}

      {/* Input Box */}
      {EmogiPick && (
        <div className="absolute bottom-0">
          <EmojiPicker onEmojiClick={(e) => handleEmojiClick(e)} />
        </div>
      )}
      <div className="w-full  px-5 flex relative items-center justify-center bg-white">
        {hasBlocked || isBlockedByUser ? (
          <div className="flex items-center justify-center bg-gray-100 p-4 rounded-[20px] w-full text-center">
            <span className="text-sm text-red-500">
              {hasBlocked ? "You blocked this user" : "User blocked you"}
            </span>
          </div>
        ) : (
          <div className="border rounded-[20px] w-full flex items-center gap-2 px-4 py-2">
            <SlEmotsmile
              onClick={() => SetEmogiPick(!EmogiPick)}
              size={25}
              className="cursor-pointer text-[#0098EA]"
            />
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
        )}
      </div>
    </div>
  );
};

export default MessageBoard;
