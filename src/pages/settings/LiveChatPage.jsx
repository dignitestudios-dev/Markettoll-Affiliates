import React from "react";
import { GoArrowLeft } from "react-icons/go";
import { Link } from "react-router-dom";
import { IoSend } from "react-icons/io5";

const LiveChatPage = () => {
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

        <div className="w-full flex flex-col items-end">
          <div className="w-[80%] lg:w-[307px] blue-bg p-3 rounded-xl text-xs lg:text-sm text-white">
            Lorem ipsum dolor sit amet consectetur. Viverra ultrices aliquet
            quisque non justo augue malesuada enim. Vitae nunc duis.
          </div>
          <span className="text-[10px] text-[#5c5c5c]">12:30 PM</span>
        </div>
        <div className="w-full flex flex-col items-start mt-2">
          <div className="w-[80%] lg:w-[307px] bg-[#F7F7F7] p-3 rounded-xl text-xs lg:text-sm text-black">
            Lorem ipsum dolor sit amet consectetur. Viverra ultrices aliquet
            quisque non justo augue malesuada enim. Vitae nunc duis.
          </div>
          <span className="text-[10px] text-[#5c5c5c]">12:30 PM</span>
        </div>
      </div>

      <div className="w-full bg-white border-t h-16 absolute bottom-0 flex items-center justify-between gap-2">
        <div className="border rounded-2xl px-3 mr-8 h-[50px] py-1 w-full flex items-center justify-between">
          <img
            src="/emoji-icon.png"
            alt="emoji-icon"
            className="w-[17.3px] h-[17.3px]"
          />
          <input
            type="text"
            placeholder="Message"
            className="bg-white outline-none h-full text-sm text-[#5c5c5c] w-full px-3"
          />
          <button
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
