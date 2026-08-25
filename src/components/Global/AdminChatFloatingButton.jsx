import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MdSupportAgent } from "react-icons/md";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";

const AdminChatFloatingButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [isHovered, setIsHovered] = useState(false);

  // Hidden on chat/auth pages to avoid redundancy
  const hideOnRoutes = [
    "/admin-chat",
    "/settings/support-request/live-chat",
    "/login",
    "/sign-up",
    "/forgot-password",
    "/verify-otp",
  ];

  // Hide if not logged in or on hidden routes
  if (!user?.token || hideOnRoutes.includes(location.pathname)) {
    return null;
  }

  const handleClick = () => {
    navigate("/admin-chat");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center">
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center gap-2.5 bg-gradient-to-r from-[#0098EA] to-[#003DAC] text-white px-4 py-3.5 rounded-full shadow-2xl hover:shadow-[#0098EA]/40 hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out cursor-pointer"
        aria-label="Chat with Admin"
      >
        {/* Pulsing online status indicator */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
        </span>

        {/* Support Icon */}
        <div className="text-2xl md:text-[26px] flex items-center justify-center transition-transform duration-300 group-hover:rotate-12">
          <MdSupportAgent />
        </div>

        {/* Text label */}
        <span className="font-semibold text-sm md:text-[15px] whitespace-nowrap tracking-wide select-none pr-1">
          Chat with Admin
        </span>
      </button>
    </div>
  );
};

export default AdminChatFloatingButton;
