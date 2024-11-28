import React from "react";
import { Link } from "react-router-dom";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

const SupportRequestPage = () => {
  return (
    <div className="w-full px-5">
      <h2 className="font-bold text-[28px] blue-text">Support Request</h2>
      <div className="w-full border mt-5 mb-4" />

      <div className="w-full mt-5">
        <Link
          to="/settings/support-request/live-chat"
          className="w-full flex items-center justify-between py-3.5 px-4 custom-shadow bg-white rounded-2xl"
        >
          <div className="flex items-center gap-2">
            <img
              src="/chat-icon.png"
              alt="chat-icon"
              className="w-[18px] h-[18px]"
            />
            <span className="text-[#5c5c5c] text-sm">Live Chat</span>
          </div>
          <MdOutlineKeyboardArrowRight className="light-blue-text text-xl" />
        </Link>
        <Link
          to="/settings/support-request/email-support"
          className="w-full mt-4 flex items-center justify-between py-3.5 px-4 custom-shadow bg-white rounded-2xl"
        >
          <div className="flex items-center gap-2">
            <img
              src="/mail-icon.png"
              alt="chat-icon"
              className="w-[18px] h-[17px]"
            />
            <span className="text-[#5c5c5c] text-sm">Email Support</span>
          </div>
          <MdOutlineKeyboardArrowRight className="light-blue-text text-xl" />
        </Link>
      </div>
    </div>
  );
};

export default SupportRequestPage;
