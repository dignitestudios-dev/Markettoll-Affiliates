import React from "react";
import ChatListCard from "./ChatListCard";
import { CiSearch } from "react-icons/ci";

const ChatList = () => {
  return (
    <div className="w-full h-full border-r overflow-hidden pr-5">
      <div className="w-full border-b h-[15%] px-5 pt-5">
        <h2 className="blue-text font-bold text-[28px]">Chat</h2>

        <div className="w-full border my-3" />

        <div className="w-full border rounded-2xl px-3 bg-white flex items-center justify-between gap-2">
          <input
            type="text"
            placeholder="Search"
            className="text-sm font-normal text-[#5C5C5C] w-full py-2.5 outline-none"
          />
          <CiSearch className="light-blue-text text-xl" />
        </div>
      </div>
      <div className="w-full max-h-[80%] py-2 overflow-y-scroll chat-list">
        <ChatListCard />
        <ChatListCard />
        <ChatListCard />
        <ChatListCard />
        <ChatListCard />
        <ChatListCard />
        <ChatListCard />
        <ChatListCard />
        <ChatListCard />
        <ChatListCard />
      </div>
    </div>
  );
};

export default ChatList;
