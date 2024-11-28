import React from "react";
import { Link } from "react-router-dom";

const SettingsSidebar = () => {
  return (
    <div className="w-full flex flex-col items-start border-r pr-5">
      <h2 className="text-[28px] font-bold blue-text mb-5">Settings</h2>
      <Link
        to="/settings"
        className="text-lg font-semibold px-5 border-t border-b py-3.5 w-full bg-gray-100"
      >
        Notifications
      </Link>
      <Link
        to="/settings/payment"
        className="text-lg font-semibold px-5 border-b py-3.5 w-full"
      >
        Payment
      </Link>
      <Link
        to="/settings/addresses"
        className="text-lg font-semibold px-5 border-b py-3.5 w-full"
      >
        Address
      </Link>
      <Link
        to="/settings/change-password"
        className="text-lg font-semibold px-5 border-b py-3.5 w-full"
      >
        Change Password
      </Link>
      <Link
        to="/settings/deactivate-listing"
        className="text-lg font-semibold px-5 border-b py-3.5 w-full"
      >
        Deactivate Listing
      </Link>
      <Link
        to="/settings/terms-and-conditions"
        className="text-lg font-semibold px-5 border-b py-3.5 w-full"
      >
        Terms & Conditions
      </Link>
      <Link
        to="/settings/privacy-policy"
        className="text-lg font-semibold px-5 border-b py-3.5 w-full"
      >
        Privacy Policy
      </Link>
      <Link
        to="/settings/support-request"
        className="text-lg font-semibold px-5 border-b py-3.5 w-full"
      >
        Support Request
      </Link>
      <Link
        to="/settings/delete-account"
        className="text-lg font-semibold px-5 py-3.5 w-full"
      >
        Delete Account
      </Link>
    </div>
  );
};

export default SettingsSidebar;
