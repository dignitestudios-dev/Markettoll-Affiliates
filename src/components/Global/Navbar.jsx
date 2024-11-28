import React, { useContext, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoClose, IoSearchOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import NotificationsDropdown from "./NotificationsDropdown";
import { TbMenu2 } from "react-icons/tb";
import Cookies from "js-cookie";
import { AuthContext } from "../../context/authContext";

const Navbar = () => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openSidebarDropdown, setOpenSidebarDropdown] = useState(false);
  const navigate = useNavigate();
  const { user, userProfile } = useContext(AuthContext);
  // console.log("user from navbar ", user);

  const handleLogout = () => {
    navigate("/login");
    Cookies.remove("market-signup");
    Cookies.remove("user");
    localStorage.removeItem("user");
    localStorage.removeItem("market-signup");
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleShowProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleOpenNotifications = () => {
    setOpenNotifications(!openNotifications);
  };

  const handleToggleMenu = () => {
    setOpenSidebarDropdown(!openSidebarDropdown);
  };

  return (
    <nav className="padding-x w-full py-2 flex items-center justify-between border-b relative">
      <Link to="/">
        <img src="/LOGO-WHITE.jpg" alt="logo" className="w-[85px] h-[85px]" />
      </Link>

      <div className="hidden lg:flex items-center justify-end gap-3">
        <div className="w-[357px] h-[42px] flex items-center justify-between gap-2 px-3 rounded-[15px] border">
          <input
            type="text"
            placeholder="Search"
            className="outline-none bg-transparent w-full h-full text-sm text-[#5C5C5C] placeholder:text-[#5C5C5C]"
          />
          <IoSearchOutline className="light-blue-text text-2xl" />
        </div>
        <Link
          to="/chats"
          className="w-[32px] h-[32px] rounded-[10px] blue-bg flex items-center justify-center"
        >
          <img
            src="/messages-icon.png"
            alt="messages-icon"
            className="w-[18px] h-[18px]"
          />
        </Link>
        <Link
          to="/favourites"
          className="w-[32px] h-[32px] rounded-[10px] blue-bg flex items-center justify-center"
        >
          <img
            src="/heart-icon.png"
            alt="heart-icon"
            className="w-[18px] h-[18px]"
          />
        </Link>
        <button
          type="button"
          onClick={handleOpenNotifications}
          className="w-[32px] h-[32px] rounded-[10px] blue-bg flex items-center justify-center"
        >
          <img
            src="/notifications-icon.png"
            alt="notifications-icon"
            className="w-[18px] h-[18px]"
          />
          <NotificationsDropdown openNotifications={openNotifications} />
        </button>
        <Link
          to="/cart"
          className="w-[32px] h-[32px] rounded-[10px] blue-bg flex items-center justify-center"
        >
          <img
            src="/cart-icon.png"
            alt="cart-icon"
            className="w-[18px] h-[18px]"
          />
        </Link>
        {user && (
          <button
            type="button"
            onClick={handleShowProfileDropdown}
            className="flex items-center gap-2"
          >
            <img
              src="/profile-image.png"
              alt="profile-image"
              className="w-[32px] h-[32px]"
            />
            <span className="text-base font-medium">
              {userProfile?.name !== "" || userProfile?.name !== null
                ? userProfile?.name
                : ""}
            </span>
            <IoIosArrowDown />
          </button>
        )}
        {showProfileDropdown && (
          <div className="w-auto h-auto p-4 bg-white z-50 shadow-lg rounded-lg absolute top-20">
            <ul className="flex flex-col items-start gap-2">
              <li className="text-xs font-medium py-0.5">
                <Link to="/account/peronal-info">Personal Information</Link>
              </li>
              <li className="text-xs font-medium py-0.5">
                <Link to="/account/my-listings">My Listings</Link>
              </li>
              <li className="text-xs font-medium py-0.5">
                <Link to="/account/my-wallet">My Wallet</Link>
              </li>
              <li className="text-xs font-medium py-0.5">
                <Link to="/account/subscriptions">Subscriptions</Link>
              </li>
              <li className="text-xs font-medium py-0.5">
                <Link to="/order-history">Order History</Link>
              </li>
              <li className="text-xs font-medium py-0.5">
                <Link to="/settings">Settings</Link>
              </li>
              <li className="text-xs font-medium py-0.5">
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
        )}
      </div>

      <div className="lg:hidden flex items-center justify-end gap-3">
        <Link
          to="/chats"
          className="w-[28px] h-[28px] rounded-[10px] blue-bg flex items-center justify-center"
        >
          <img
            src="/messages-icon.png"
            alt="messages-icon"
            className="w-[15px] h-[15px]"
          />
        </Link>
        <Link
          to="/cart"
          className="w-[28px] h-[28px] rounded-[10px] blue-bg flex items-center justify-center"
        >
          <img
            src="/cart-icon.png"
            alt="cart-icon"
            className="w-[15px] h-[15px]"
          />
        </Link>
        <button
          type="button"
          onClick={handleOpenNotifications}
          className="w-[28px] h-[28px] rounded-[10px] blue-bg flex items-center justify-center"
        >
          <img
            src="/notifications-icon.png"
            alt="notifications-icon"
            className="w-[15px] h-[15px]"
          />
          <NotificationsDropdown openNotifications={openNotifications} />
        </button>

        <button type="button" onClick={() => setOpenSidebar(!openSidebar)}>
          <TbMenu2 className="text-2xl" />
        </button>
      </div>

      <div
        className={`w-full h-screen fixed inset-0 z-50 ${
          openSidebar ? "-translate-x-0" : "-translate-x-full"
        } transition-all duration-700`}
      >
        <div className="w-2/3 bg-white h-full custom-shadow p-5 relative  overflow-y-scroll">
          <button
            onClick={() => setOpenSidebar(!openSidebar)}
            className="absolute top-5 right-4 bg-white custom-shadow w-8 h-8 blue-bg rounded-xl flex items-center justify-center"
          >
            <IoClose className="text-2xl text-[#ffff]" />
          </button>
          <Link to="/" className="">
            <img
              src="/LOGO-WHITE.jpg"
              alt="logo"
              className="w-[85px] h-[85px]"
            />
          </Link>
          <div className="w-full mt-5 px-3">
            <ul className="flex flex-col items-start gap-3">
              <li className="text-[15px] font-medium py-0.5">
                <Link to="/account/peronal-info">Personal Information</Link>
              </li>
              <li className="text-[15px] font-medium py-0.5">
                <Link to="/account/peronal-info">Favorites</Link>
              </li>
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
                    <Link
                      to="/settings"
                      className="text-[13px] font-medium py-0.5"
                    >
                      Notifications
                    </Link>
                    <Link
                      to="/settingspayment"
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
      </div>
    </nav>
  );
};

export default Navbar;
