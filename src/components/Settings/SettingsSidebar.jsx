import React from "react";
import { Link, useLocation } from "react-router-dom";

const SettingsSidebar = () => {
  const location = useLocation();
  return (
    <div className="w-full flex flex-col items-start border-r pr-5">
      <h2 className="text-[28px] font-bold blue-text mb-5">Settings</h2>
      <Link
        to="/settings"
        className={`text-lg font-semibold px-5 border-t border-b py-3.5 w-full ${
          location?.pathname === "/settings" && "bg-gray-100"
        }`}
      >
        Notifications
      </Link>
      <Link
        to="/settings/payment"
        className={`text-lg font-semibold px-5 border-b py-3.5 w-full ${
          location?.pathname === "/settings/payment" && "bg-gray-100"
        }`}
      >
        Payment
      </Link>
      <Link
        to="/settings/addresses"
        className={`text-lg font-semibold px-5 border-b py-3.5 w-full ${
          location?.pathname === "/settings/addresses" && "bg-gray-100"
        }`}
      >
        Address
      </Link>
      <Link
        to="/settings/change-password"
        className={`text-lg font-semibold px-5 border-b py-3.5 w-full ${
          location?.pathname === "/settings/change-password" && "bg-gray-100"
        }`}
      >
        Change Password
      </Link>
      <Link
        to="/settings/deactivate-listing"
        className={`text-lg font-semibold px-5 border-b py-3.5 w-full ${
          location?.pathname === "/settings/deactivate-listing" && "bg-gray-100"
        }`}
      >
        Deactivate Listing
      </Link>
      <Link
        to="/settings/terms-and-conditions"
        className={`text-lg font-semibold px-5 border-b py-3.5 w-full ${
          location?.pathname === "/settings/terms-and-conditions" &&
          "bg-gray-100"
        }`}
      >
        Terms & Conditions
      </Link>
      <Link
        to="/settings/privacy-policy"
        className={`text-lg font-semibold px-5 border-b py-3.5 w-full ${
          location?.pathname === "/settings/privacy-policy" && "bg-gray-100"
        }`}
      >
        Privacy Policy
      </Link>
      <Link
        to="/settings/support-request"
        className={`text-lg font-semibold px-5 border-b py-3.5 w-full ${
          location?.pathname === "/settings/support-request" ||
          location?.pathname === "/settings/support-request/live-chat"
            ? "bg-gray-100"
            : location?.pathname === "/settings/support-request/email-support"
            ? "bg-gray-100"
            : ""
        }`}
      >
        Support Request
      </Link>
      <Link
        to="/settings/delete-account"
        className={`text-lg font-semibold px-5 py-3.5 w-full ${
          location?.pathname === "/settings/delete-account" && "bg-gray-100"
        }`}
      >
        Delete Account
      </Link>
    </div>
  );
};

export default SettingsSidebar;
