import React, { useState } from "react";
import { TbDotsVertical } from "react-icons/tb";
import { IoArrowBack } from "react-icons/io5";

const ChatHeader = ({
  selectedUser,
  onBackMobile,
  onDeleteChat,
  onBlockUser,
  onReportUser,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!selectedUser) return null;

  const name = selectedUser?.user_name || selectedUser?.name || selectedUser?.lastMessage?.profileName || "";
  const orderId = (selectedUser?.order_id || selectedUser?.orderId) ? `#${selectedUser.order_id || selectedUser.orderId}` : "";
  const image =
    selectedUser?.image ||
    selectedUser?.profileImage ||
    selectedUser?.lastMessage?.profileImage;

  const initial = name ? name.trim().charAt(0).toUpperCase() : "?";
  const hasCustomImage = image && image !== "/chat-img.png" && !imgError;

  return (
    <div className="w-full py-3 px-4 border-b border-gray-100 flex items-center justify-between bg-white rounded-t-2xl">
      <div className="flex items-center gap-3">
        {/* Mobile back button */}
        {onBackMobile && (
          <button
            onClick={onBackMobile}
            className="lg:hidden text-gray-600 hover:text-gray-900 p-1"
          >
            <IoArrowBack size={20} />
          </button>
        )}

        {hasCustomImage ? (
          <img
            src={image}
            alt={name}
            className="w-10 h-10 rounded-full object-cover border border-gray-100 shrink-0"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-[#0098EA] text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0 uppercase">
            {initial}
          </div>
        )}
        <div>
          <h3 className="font-semibold text-gray-900 text-sm md:text-base leading-tight">
            {name}
          </h3>
          {orderId && (
            <p className="text-xs text-[#0098EA] font-medium">{orderId}</p>
          )}
        </div>
      </div>

      {/* 3 Dots Menu */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
        >
          <TbDotsVertical className="text-xl" />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-20 text-sm">

            <button
              onClick={() => {
                setDropdownOpen(false);
                onReportUser?.();
              }}
              className="w-full text-left px-4 py-1.5 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
