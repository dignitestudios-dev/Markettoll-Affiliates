import React from "react";
import { FaCheck } from "react-icons/fa6";

const NotificationsDropdown = ({ openNotifications }) => {
  return (
    openNotifications && (
      <div className="h-auto p-4 bg-white z-50 w-[340px] custom-shadow rounded-lg absolute top-20 right-2 lg:right-72 cursor-default">
        <h3 className="blue-text font-bold text-lg text-start">
          Notifications
        </h3>

        <div className="w-full flex items-center justify-between border-b border-blue-400 py-3">
          <div className="flex items-center gap-2 w-[90%]">
            <div className="border-[3px] border-blue-400 rounded-full p-1 w-8 h-8">
              <FaCheck className="w-full h-full light-blue-text" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[15px]">Order Received!</span>
              <span className="text-xs">
                Your order has been placed successfully!
              </span>
            </div>
          </div>
          <div>
            <span className="text-[10px]">July 11</span>
          </div>
        </div>
      </div>
    )
  );
};

export default NotificationsDropdown;
