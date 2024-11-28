import React from "react";

const ChatListCard = () => {
  return (
    <div className="py-3 px-5 flex items-start justify-between border-b hover:bg-gray-50 transition-all duration-300 cursor-pointer">
      <div className="flex items-center gap-2">
        <img src="/chat-img.png" alt="chat-img" className="w-[42px] h-[42px]" />
        <div className="flex flex-col items-start">
          <span className="text-[13px]">Carlos Tremblay</span>
          <span className="text-xs text-[#757575]">
            Lorem ipsum dolor sit amet consectetur. At a...
          </span>
        </div>
      </div>
      <div className="w-[20%]">
        <span className="text-xs font-medium">11 May, 2024</span>
      </div>
    </div>
  );
};

export default ChatListCard;
