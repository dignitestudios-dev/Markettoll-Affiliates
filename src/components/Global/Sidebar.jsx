import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = ({ setOpenSidebar, handleLogout, openSidebar, user }) => {
  const [openSidebarDropdown, setOpenSidebarDropdown] = useState(false);
  const navigate = useNavigate();

  const handleToggleMenu = () => {
    setOpenSidebarDropdown(!openSidebarDropdown);
  };

  const toggleSidebarAndNavigate = (url) => {
    navigate(url);
    setOpenSidebar(!openSidebar);
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
          {user?.role != "influencer" ? (
            <>
              <li className="text-[15px] font-medium py-0.5">
                <button
                  type="button"
                  onClick={() =>
                    toggleSidebarAndNavigate("/account/peronal-info")
                  }
                  // to="/account/peronal-info"
                >
                  Personal Information
                </button>
              </li>
              <li className="text-[15px] font-medium py-0.5">
                <button
                  type="button"
                  onClick={() =>
                    toggleSidebarAndNavigate("/account/my-listings")
                  }
                  // to="/account/my-listings"
                >
                  My Listings
                </button>
              </li>
              <li className="text-[15px] font-medium py-0.5">
                <button
                  type="button"
                  onClick={() => toggleSidebarAndNavigate("/account/my-wallet")}
                  // to="/account/my-wallet"
                >
                  My Wallet
                </button>
              </li>
              <li className="text-[15px] font-medium py-0.5">
                <button
                  type="button"
                  onClick={() =>
                    toggleSidebarAndNavigate("/account/subscriptions")
                  }
                  // to="/account/subscriptions"
                >
                  Subscriptions
                </button>
              </li>
              <li className="text-[15px] font-medium py-0.5">
                <button
                  type="button"
                  onClick={() => toggleSidebarAndNavigate("/order-history")}
                  // to="/order-history"
                >
                  Order History
                </button>
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
                    <button
                      type="button"
                      onClick={() => {
                        toggleSidebarAndNavigate("/settings");
                        handleToggleMenu();
                      }}
                      className="text-[13px] font-medium py-0.5"
                    >
                      Notifications
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        toggleSidebarAndNavigate("/settings/payment");
                        handleToggleMenu();
                      }}
                      className="text-[13px] font-medium py-0.5"
                    >
                      Payment
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        toggleSidebarAndNavigate("/settings/addresses");
                        handleToggleMenu();
                      }}
                      className="text-[13px] font-medium py-0.5"
                    >
                      Address
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        toggleSidebarAndNavigate("/settings/change-password");
                        handleToggleMenu();
                      }}
                      className="text-[13px] font-medium py-0.5"
                    >
                      Change Password
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        toggleSidebarAndNavigate(
                          "/settings/deactivate-listing"
                        );
                        handleToggleMenu();
                      }}
                      className="text-[13px] font-medium py-0.5"
                    >
                      Deactivate Listing
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        toggleSidebarAndNavigate(
                          "/settings/terms-and-conditions"
                        );
                        handleToggleMenu();
                      }}
                      className="text-[13px] font-medium py-0.5"
                    >
                      Terms & Conditions
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        toggleSidebarAndNavigate("/settings/privacy-policy");
                        handleToggleMenu();
                      }}
                      className="text-[13px] font-medium py-0.5"
                    >
                      Privacy Policy
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        toggleSidebarAndNavigate("/settings/support-request");
                        handleToggleMenu();
                      }}
                      className="text-[13px] font-medium py-0.5"
                    >
                      Support Request
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        toggleSidebarAndNavigate("/settings/delete-account");
                        handleToggleMenu();
                      }}
                      className="text-[13px] font-medium py-0.5"
                    >
                      Delete Account
                    </button>
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
            </>
          ) : (
            <>
              <li className="text-[15px] font-medium py-0.5">
                <button
                  type="button"
                  onClick={() =>
                    toggleSidebarAndNavigate("/account/peronal-info")
                  }
                  // to="/account/peronal-info"
                >
                  Personal Information
                </button>
              </li>
            
              <li className="text-[15px] font-medium py-0.5">
                <button
                  type="button"
                  onClick={() => toggleSidebarAndNavigate("/account/my-wallet")}
                  // to="/account/my-wallet"
                >
                  My Wallet
                </button>
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
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
