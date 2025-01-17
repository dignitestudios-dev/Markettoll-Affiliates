import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";

const Sidebar = ({ setOpenSidebar, handleLogout, openSidebar }) => {
  const [openSidebarDropdown, setOpenSidebarDropdown] = useState(false);
  const handleToggleMenu = () => {
    setOpenSidebarDropdown(!openSidebarDropdown);
  };
  return (
    <div className="w-2/3 bg-white h-full custom-shadow p-5 relative  overflow-y-scroll">
      <button
        onClick={() => setOpenSidebar(!openSidebar)}
        className="absolute top-5 right-4 bg-white custom-shadow w-8 h-8 blue-bg rounded-xl flex items-center justify-center"
      >
        <IoClose className="text-2xl text-[#ffff]" />
      </button>
      <Link to="/" className="">
        <img src="/LOGO-WHITE.jpg" alt="logo" className="w-[85px] h-[85px]" />
      </Link>
      <div className="w-full mt-5 px-3">
        <ul className="flex flex-col items-start gap-3">
          <li className="text-[15px] font-medium py-0.5">
            <Link to="/account/peronal-info">Personal Information</Link>
          </li>
          {/* <li className="text-[15px] font-medium py-0.5">
            <Link to="/account/peronal-info">Favorites</Link>
          </li> */}
          <li className="text-[15px] font-medium py-0.5">
            <Link to="/account/my-listings">My Listings</Link>
          </li>
          <li className="text-[15px] font-medium py-0.5">
            <Link to="/account/my-wallet">My Wallet</Link>
          </li>
          <li className="text-[15px] font-medium py-0.5">
            <Link to="/account/subscriptions">Subscriptions</Link>
          </li>
          <li className="text-[15px] font-medium py-0.5">
            <Link to="/order-history">Order History</Link>
          </li>
          <li className="w-full">
            <button
              type="button"
              onClick={handleToggleMenu}
              className="text-[15px] font-medium py-0.5 w-full flex items-end justify-between"
            >
              <span>Settings</span>
              <IoIosArrowDown
                className={`text-sm ${
                  openSidebarDropdown ? "rotate-180" : "rotate-0"
                } transition-all duration-300`}
              />
            </button>
            {openSidebarDropdown && (
              <div className="py-1 px-3 flex flex-col items-start gap-1">
                <Link to="/settings" className="text-[13px] font-medium py-0.5">
                  Notifications
                </Link>
                <Link
                  to="/settings/payment"
                  className="text-[13px] font-medium py-0.5"
                >
                  Payment
                </Link>
                <Link
                  to="/settings/addresses"
                  className="text-[13px] font-medium py-0.5"
                >
                  Address
                </Link>
                <Link
                  to="/settings/change-password"
                  className="text-[13px] font-medium py-0.5"
                >
                  Change Password
                </Link>
                <Link
                  to="/settings/deactivate-listing"
                  className="text-[13px] font-medium py-0.5"
                >
                  Deactivate Listing
                </Link>
                <Link
                  to="/settings/terms-and-conditions"
                  className="text-[13px] font-medium py-0.5"
                >
                  Terms & Conditions
                </Link>
                <Link
                  to="/settings/privacy-policy"
                  className="text-[13px] font-medium py-0.5"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/settings/support-request"
                  className="text-[13px] font-medium py-0.5"
                >
                  Support Request
                </Link>
                <Link
                  to="/settings/delete-account"
                  className="text-[13px] font-medium py-0.5"
                >
                  Delete Account
                </Link>
              </div>
            )}
          </li>
          <li className="text-[15px] font-medium py-0.5">
            <button
              type="button"
              onClick={handleLogout}
              className="text-red-500"
            >
              Log out
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
