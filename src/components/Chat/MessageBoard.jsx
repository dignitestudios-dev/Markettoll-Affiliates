import React from "react";
import { TbDotsVertical } from "react-icons/tb";
import { IoSend } from "react-icons/io5";

const MessageBoard = () => {
  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="chat-header w-full h-[8%] border-b flex items-center justify-between px-5">
        <div className="flex items-center gap-2">
          <img
            src="/chat-img.png"
            alt="user profile"
            className="w-[42px] h-[42px]"
          />
          <span className="text-sm font-semibold">Carlos Tremblay</span>
        </div>
        <button type="button">
          <TbDotsVertical className="text-lg" />
        </button>
      </div>

      {/* Messages Box */}
      <div className="w-full h-[68vh] overflow-y-auto chat-list">
        <div className="p-4">
          <p>Message 1</p>
          <p>Message 2</p>
        </div>
        <div className="p-4">
          <p>Message 1</p>
          <p>Message 2</p>
        </div>
        <div className="p-4">
          <p>Message 1</p>
          <p>Message 2</p>
        </div>
        <div className="p-4">
          <p>Message 1</p>
          <p>Message 2</p>
        </div>
        <div className="p-4">
          <p>Message 1</p>
          <p>Message 2</p>
        </div>
        <div className="p-4">
          <p>Message 1</p>
          <p>Message 2</p>
        </div>
        <div className="p-4">
          <p>Message 1</p>
          <p>Message 2</p>
        </div>
        <div className="p-4">
          <p>Message 1</p>
          <p>Message 2</p>
        </div>
        <div className="p-4">
          <p>Message 1</p>
          <p>Message 2</p>
        </div>
        <div className="p-4">
          <p>Message 1</p>
          <p>Message 2</p>
        </div>
        <div className="p-4">
          <p>Message 1</p>
          <p>Message 2</p>
        </div>
      </div>

      {/* Input Box */}
      <div className="w-full h-[8%] px-5 flex items-center justify-center border-t">
        <div className="border rounded-[20px] w-full flex items-center gap-2 px-4 py-2">
          <input
            type="text"
            className="w-full text-sm outline-none border-none"
            placeholder="Type here..."
          />
          <button
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
