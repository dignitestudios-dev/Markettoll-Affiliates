import React, { useContext, useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoClose, IoSearchOutline } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NotificationsDropdown from "./NotificationsDropdown";
import { TbMenu2 } from "react-icons/tb";
import Cookies from "js-cookie";
import { AuthContext } from "../../context/authContext";
import { SearchedProductContext } from "../../context/searchedProductContext";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";
import { CartProductContext } from "../../context/cartProductContext";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

const Navbar = () => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const loc = useLocation("");
  console.log(loc?.pathname == "/login");

  const navigate = useNavigate();
  const { user, userProfile, fetchUserProfile } = useContext(AuthContext);
  const { cartCount, setCartCount } = useContext(CartProductContext);
  const { searchQuery, setSearchQuery, searchResults, setSearchResults } =
    useContext(SearchedProductContext);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);
  const [searchHistory, setSearchHistory] = useState([]);

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleNavigate = (url, msg) => {
    if (user) {
      navigate(url);
    } else {
      toast.info(msg);
    }
  };
  const deleteFcmToken = async () => {
    const fcmToken = JSON.parse(localStorage.getItem("fcmTokenMarkettoll"));
    try {
      const res = await axios.delete(
        `${BASE_URL}/users/push-notification-token?platform=web&token=${fcmToken}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      // console.log("fcmToken deleted >>>", res?.data);
      localStorage.removeItem("fcmTokenMarkettoll");
    } catch (error) {
      // console.log("err while deleting fcmToken >>>", error);
    }
  };

  const handleLogout = () => {
    navigate("/login");
    Cookies.remove("market-signup");
    Cookies.remove("user");
    localStorage.removeItem("user");
    localStorage.removeItem("market-signup");
    setShowProfileDropdown(!showProfileDropdown);
    deleteFcmToken();
    fetchUserProfile();
    setOpenSidebar(false);
  };

  const handleShowProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleOpenNotifications = () => {
    setOpenNotifications((prev) => !prev);
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/users/notifications?page=1`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      // console.log("notifications >>>", res?.data?.data?.notifications);
      setNotifications(res?.data?.data?.notifications);
    } catch (error) {
      // console.log(
      //   "error while fetching notifications >>>",
      //   error?.response?.data
      // );
    }
  };

  const handleSearchProduct = async (e) => {
    e.preventDefault();
    if (!searchQuery) {
      navigate("/");
      return;
    }
    const queryParams = {
      name: searchQuery,
      category: "",
      subCategory: "",
      page: 1,
    };
    navigate(
      `/search-product?name=${searchQuery}&category=${queryParams?.category}&subCategory=${queryParams?.subCategory}&page=1`
    );
  };

  const fetchSearchedProductsHistory = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/users/home-screen-searched-products-history`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      console.log("search history >>>", res?.data?.data);
      setSearchHistory(res?.data?.data?.keywords);
    } catch (error) {
      // console.log("err while fetching search history >>>", error);
    }
  };

  const handleSearchHistoryClick = (historyItem) => {
    setSearchQuery(historyItem);
    setIsDropdownVisible(false);
    const queryParams = {
      name: historyItem,
      category: "",
      subCategory: "",
      page: 1,
    };
    navigate(
      `/search-product?name=${historyItem}&category=${queryParams?.category}&subCategory=${queryParams?.subCategory}&page=1`
    );
  };

  useEffect(() => {
    fetchNotifications();
    fetchUserProfile();
    fetchSearchedProductsHistory();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  console.log(user?.verified, "verifiedTest");
  return (
    <nav className="padding-x w-full py-5 flex items-center justify-between blue-bg sticky top-0 z-50 ">
      <Link to="/">
        <img src="/logo-white.png" alt="logo" className="w-[74px] h-[57px]" />
      </Link>
      <div className="hidden lg:flex items-center justify-end gap-3">
        {user?.token && loc?.pathname != "/login" ? (
          <div className="hidden lg:flex items-center justify-end gap-3 relative">
            {user?.role != "influencer" && (
              <>
                <form
                  onSubmit={handleSearchProduct}
                  className="h-[42px] w-[357px] flex items-center justify-between gap-2 px-3 rounded-[15px] bg-[#38adebe7] border-none"
                >
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsDropdownVisible(true)}
                    onBlur={() =>
                      setTimeout(() => setIsDropdownVisible(false), 200)
                    }
                    className="outline-none bg-transparent w-full h-full text-sm text-[#ffff] placeholder:text-[#ffff]"
                  />
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        navigate("/");
                      }}
                    >
                      <IoClose className="text-white text-xl" />
                    </button>
                  ) : (
                    <button type="submit">
                      <IoSearchOutline className="text-white text-2xl" />
                    </button>
                  )}
                </form>
                {isDropdownVisible && searchHistory?.length > 0 && (
                  <div className="absolute top-[45px] w-[357px] left-0 right-0 bg-white border rounded-xl shadow-lg mt-1 z-10">
                    <ul className="max-h-[200px] overflow-y-auto py-2 px-5">
                      {searchHistory
                        .filter((item) =>
                          item.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((historyItem, index) => (
                          <li
                            key={index}
                            className={`py-2 cursor-pointer flex items-center justify-between text-[16px] ${
                              index !== 0 && "border-b-2"
                            }`}
                            onClick={() =>
                              handleSearchHistoryClick(historyItem)
                            }
                          >
                            <span>{historyItem}</span>
                            <MdOutlineKeyboardArrowRight className="blue-text text-xl" />
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => handleNavigate("/chats", "Login to see chats")}
                  className="w-[32px] h-[32px] rounded-[10px] bg-white flex items-center justify-center"
                >
                  <img
                    src="/message-icon-blue.png"
                    alt="messages-icon"
                    className="w-[18px] h-[18px]"
                  />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleNavigate("/favourites", "Login to see favourites")
                  }
                  className="w-[32px] h-[32px] rounded-[10px] bg-white flex items-center justify-center"
                >
                  <img
                    src="/heart-icon-blue.png"
                    alt="heart-icon"
                    className="w-[18px] h-[18px]"
                  />
                </button>
                <button
                  type="button"
                  onClick={handleOpenNotifications}
                  className="w-[32px] h-[32px] rounded-[10px] bg-white flex items-center justify-center"
                >
                  <img
                    src="/notifications-icon-blue.png"
                    alt="notifications-icon"
                    className="w-[18px] h-[18px]"
                  />
                  <NotificationsDropdown
                    openNotifications={openNotifications}
                    notifications={notifications}
                    setOpenNotifications={setOpenNotifications}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate("/cart", "Login to see cart")}
                  to="/cart"
                  className="w-[32px] h-[32px] rounded-[10px] bg-white relative inline-flex items-center text-center justify-center"
                >
                  <img
                    src="/cart-icon-blue.png"
                    alt="cart-icon"
                    className="w-[18px] h-[18px]"
                  />
                  <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-3 -end-3 dark:border-gray-900">
                    {user ? cartCount : 0}
                  </div>
                </button>
              </>
            )}
            <button
              type="button"
              onClick={handleShowProfileDropdown}
              className="flex items-center gap-2"
            >
              <img
                src={
                  userProfile?.profileImage
                    ? userProfile?.profileImage
                    : "/upload-profile-image-icon.png"
                }
                alt="profile-image"
                className="w-[32px] h-[32px] rounded-full object-cover"
              />
              <span className="text-base font-medium text-white">
                {userProfile?.name !== "" || userProfile?.name !== null
                  ? userProfile?.name
                  : ""}
              </span>
              <IoIosArrowDown className="text-white" />
            </button>{" "}
          </div>
        ) : (
          <>
            {loc?.pathname == "/login" ? (
              <Link
                to="/sign-up"
                state={{ role: "influencer" }}
                className="bg-white px-4 py-1.5 rounded-[10px] light-blue-text font-semibold text-sm"
              >
                Become an Affiliate
              </Link>
            ) : (
              <Link
                to="/login"
                className="bg-white px-4 py-1.5 rounded-[10px] light-blue-text font-semibold text-sm"
              >
                Login
              </Link>
            )}
          </>
        )}
        {showProfileDropdown && (
          <div
            ref={dropdownRef}
            className="w-auto h-auto p-4 bg-white z-50 shadow-lg rounded-lg absolute top-20"
          >
            <ul className="flex flex-col items-start gap-2">
              {user?.role == "influencer" ? (
                <>
                  <li className="text-xs font-medium py-0.5">
                    <Link
                      to="/account/peronal-info"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      Personal Information
                    </Link>
                  </li>

                  <li className="text-xs font-medium py-0.5">
                    <Link
                      to="/account/my-wallet"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      My Wallet
                    </Link>
                  </li>

                  <li
                    className="text-xs font-medium py-0.5"
                    onClick={() => setShowProfileDropdown(false)}
                  >
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
                  <li className="text-xs font-medium py-0.5">
                    <Link
                      to="/account/peronal-info"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      Personal Information
                    </Link>
                  </li>
                  <li className="text-xs font-medium py-0.5">
                    <Link
                      to="/account/my-listings"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      My Listings
                    </Link>
                  </li>
                  <li className="text-xs font-medium py-0.5">
                    <Link
                      to="/account/my-wallet"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      My Wallet
                    </Link>
                  </li>
                  <li className="text-xs font-medium py-0.5">
                    <Link
                      to="/account/subscriptions"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      Subscriptions
                    </Link>
                  </li>
                  <li className="text-xs font-medium py-0.5">
                    <Link
                      to="/order-history"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      Order History
                    </Link>
                  </li>
                  <li className="text-xs font-medium py-0.5">
                    <Link
                      to="/settings"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      Settings
                    </Link>
                  </li>
                  <li className="text-xs font-medium py-0.5">
                    <Link to="/sign-up" state={{ role: "influencer" }}>
                      Become an Affiliate
                    </Link>
                  </li>

                  <li
                    className="text-xs font-medium py-0.5"
                    onClick={() => setShowProfileDropdown(false)}
                  >
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
        )}
      </div>

      <div className="lg:hidden flex items-center justify-end gap-3">
        {user?.role != "influencer" && loc?.pathname != "/login" && (
          <Link
            to="/chats"
            className="w-[28px] h-[28px] bg-white rounded-[10px] flex items-center justify-center"
          >
            <img
              src="/message-icon-blue.png"
              alt="messages-icon"
              className="w-[15px] h-[15px]"
            />
          </Link>
        )}
        {user?.role != "influencer" && loc?.pathname != "/login" && (
          <button
            type="button"
            onClick={() =>
              handleNavigate("/favourites", "Login to see favourites")
            }
            className="w-[28px] h-[28px] rounded-[10px] bg-white flex items-center justify-center"
          >
            <img
              src="/heart-icon-blue.png"
              alt="heart-icon"
              className="w-[18px] h-[18px]"
            />
          </button>
        )}
        {user?.role != "influencer" && loc?.pathname != "/login" && (
          <Link
            to="/cart"
            className="w-[28px] h-[28px] rounded-[10px] bg-white flex items-center justify-center"
          >
            <img
              src="/cart-icon-blue.png"
              alt="cart-icon"
              className="w-[15px] h-[15px]"
            />
          </Link>
        )}
        {user?.role != "influencer" && loc?.pathname != "/login" && (
          <button
            type="button"
            onClick={handleOpenNotifications}
            className="w-[28px] h-[28px] rounded-[10px] bg-white flex items-center justify-center"
          >
            <img
              src="/notifications-icon-blue.png"
              alt="notifications-icon"
              className="w-[15px] h-[15px]"
            />
            <NotificationsDropdown openNotifications={openNotifications} />
          </button>
        )}

        {user && loc?.pathname != "/login" ? (
          <button type="button" onClick={() => setOpenSidebar(!openSidebar)}>
            <TbMenu2 className="text-2xl text-white" />
          </button>
        ) : (
          <>
            {loc?.pathname == "/login" ? (
              <Link
                to="/sign-up"
                state={{ role: "influencer" }}
                className="bg-white px-4 py-1.5 rounded-[10px] light-blue-text font-semibold text-sm"
              >
                Become an Affiliate
              </Link>
            ) : (
              <Link
                to="/login"
                className="bg-white px-4 py-1.5 rounded-[10px] light-blue-text font-semibold text-sm"
              >
                Login
              </Link>
            )}
          </>
        )}
      </div>

      <div
        className={`w-full h-screen fixed inset-0 z-50 ${
          openSidebar ? "-translate-x-0" : "-translate-x-full"
        } transition-all duration-700`}
      >
        <Sidebar
          user={user}
          handleLogout={handleLogout}
          openSidebar={openSidebar}
          setOpenSidebar={setOpenSidebar}
        />
      </div>
    </nav>
  );
};

export default Navbar;
