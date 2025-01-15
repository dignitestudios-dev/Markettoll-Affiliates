import React from "react";

const ChatListCard = ({ item,selectedUser,lastMessage }) => {
  console.log(lastMessage,"lastMessages");
  
  return (
    <div onClick={()=>{
      selectedUser(item?.id,item)
    }} className="py-3 px-5 flex items-start justify-between border-b hover:bg-gray-50 transition-all duration-300 cursor-pointer">
      <div className="flex items-center gap-2">
        <img
          src={
            item?.profileImage
              ? item?.profileImage
              : "/chat-img.png"
          }
          alt="chat-img"
          className="w-[42px] rounded-full h-[42px]"
        />
        <div className="flex flex-col items-start">
          <span className="text-[13px]">{item?.name}</span>
          <span className="text-xs text-[#757575]">
            {lastMessage?.lastMessage?.contentType == "text"
              ? lastMessage?.lastMessage?.content
              : ""}
          </span>
        </div>
      </div>
      <div className="w-[20%]">
        <span className="text-xs font-medium">
          {new Date(lastMessage?.lastMessage?.timestamp?.toDate()).toLocaleTimeString(
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
};

export default ChatListCard;
