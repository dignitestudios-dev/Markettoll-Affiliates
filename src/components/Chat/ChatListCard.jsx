import React from "react";

const ChatListCard = ({ item, selectedUser, lastMessage, onlineStatus,toggleChatList }) => {
  console.log(lastMessage, "lastMessages", item, onlineStatus);

  return (
    <div
      onClick={() => {
        if (toggleChatList) {
          toggleChatList();          
        }
        selectedUser(lastMessage?.id, lastMessage,onlineStatus);
      }}
      className="py-3 px-5 flex items-start justify-between border-b hover:bg-gray-50 transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-center gap-2">
        <div className="flex relative">
          <img
            src={
              lastMessage?.lastMessage?.profileImage
                ? lastMessage?.lastMessage?.profileImage
                : "/chat-img.png"
            }
            alt="chat-img"
            className="w-[42px] rounded-full h-[42px]"
          />
          <span
            className={`flex absolute -right-[10px] w-3 h-3 me-3 ${
              onlineStatus?.isOnline ? "bg-green-300" : "bg-yellow-300"
            } rounded-full`}
          ></span>
        </div>

        <div className="flex flex-col items-start">
          <span className="text-[13px] flex items-center">
            {lastMessage?.lastMessage?.profileName}{" "}
          </span>

          <span className="text-xs text-[#757575]">
            {lastMessage?.lastMessage?.contentType == "text"
              ? lastMessage?.lastMessage?.content
              : ""}
          </span>
        </div>
      </div>
      <div className="w-[20%]">
        <span className="text-xs font-medium">
          {new Date(
            lastMessage?.lastMessage?.timestamp?.toDate()
          ).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
};

export default ChatListCard;
