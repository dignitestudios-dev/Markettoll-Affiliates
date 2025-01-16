import React, { useEffect, useRef } from "react";
import { FaCheck } from "react-icons/fa6";

const NotificationsDropdown = ({
  openNotifications,
  notifications,
  setOpenNotifications,
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setOpenNotifications]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const options = { month: "short", day: "numeric" };
    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      date
    );

    return formattedDate;
  };

  if (!openNotifications) return null;

  return (
    openNotifications && (
      <div
        ref={dropdownRef}
        className="max-h-[332px] overflow-y-scroll notification-dropdown p-4 bg-white z-50 w-[340px] custom-shadow rounded-lg absolute top-20 right-2 lg:right-72 cursor-default"
      >
        <h3 className="blue-text font-bold text-lg text-start">
          Notifications
        </h3>

        {notifications && notifications?.length > 0 ? (
          <>
            {notifications?.map((notification, index) => {
              return (
                <div
                  key={index}
                  className="w-full flex items-center justify-between border-b border-blue-400 py-3"
                >
                  <div className="flex items-center gap-2 w-[90%]">
                    <div className="border-[3px] border-blue-400 rounded-full p-1 w-8 h-8">
                      <FaCheck className="w-full h-full light-blue-text" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-[15px]">{notification?.title}</span>
                      <span className="text-xs">
                        {notification?.body?.substring(0, 40)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px]">
                      {formatDate(notification?.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <div className="w-full text-center pt-3">
            <p className="text-xs font-medium">No Notifications</p>
          </div>
        )}
      </div>
    )
  );
};

export default NotificationsDropdown;
