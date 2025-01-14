import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import ProductList from "../../components/Home/ProductList";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { toast } from "react-toastify";
import { CartProductContext } from "../../context/cartProductContext";

const HomePage = () => {
  const [openModal, setOpenModal] = useState(false);
  const { user, userProfile, setUserProfile } = useContext(AuthContext);
  const userCookie = localStorage.getItem("user");
  const user2 = userCookie ? JSON.parse(userCookie) : null;
  const { setData } = useContext(CartProductContext);
  const fetchUserProfile = async () => {
    if (user2?.token) {
      try {
        const res = await axios.get(`${BASE_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${user2.token}`,
          },
        });
        setUserProfile(res?.data?.data);
        // console.log(res?.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    }
  };

  useEffect(() => {
    setData({ deliveryAddress: "" });
    fetchUserProfile();
  }, []);

  const handleOpenModal = () => {
    setOpenModal(!openModal);
  };

  return (
    <div className="padding-x py-6 z-0">
      <div className="w-full flex items-center justify-between z-0">
        <h2 className="text-2xl lg:text-[36px] font-bold">
          <span className="blue-text">
            Welcome {userProfile?.name ? `${userProfile?.name},` : ""}
          </span>{" "}
          <span>Let’s Shop!</span>
        </h2>
        <button
          type="button"
          onClick={() => handleOpenModal()}
          className="blue-bg text-white flex items-center gap-1 px-5 py-2 rounded-[20px] font-medium text-base"
        >
          Sell <FiPlus className="text-lg" />
        </button>
      </div>

      <Popup openModal={openModal} onclick={handleOpenModal} />
      <ProductList />
    </div>
  );
};

export default HomePage;

const Popup = ({ openModal, onclick }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleNavigate = (url, title) => {
    if (!user) {
      toast.error(`Login to add ${title}`);
      onclick();
      return;
    }
    navigate(url, { state: { from: "/" } });
  };
  return (
    openModal && (
      <div className="w-full h-screen bg-[rgba(0,0,0,0.5)] fixed inset-0 z-50 flex items-center justify-center">
        <div className="w-[440px] h-auto py-10 rounded-2xl bg-white flex flex-col items-center justify-center gap-3 relative">
          <button
            type="button"
            onClick={() => onclick()}
            className="w-6 h-6 rounded-full bg-gray-100 p-1 absolute top-5 right-5"
          >
            <IoClose className="w-full h-full" />
          </button>
          <h3 className="blue-text font-bold text-lg">Select Type</h3>
          <button
            type="button"
            onClick={() => handleNavigate("/add-product", "product")}
            // to="/add-product"
            className="w-[343px] bg-[#F2F2F2] rounded-[14px] p-4 flex items-center justify-between"
          >
            <div className="flex items-center justify-start gap-2">
              <div className="blue-bg rounded-full w-[32px] p-2 h-[32px]">
                <FiPlus className="w-full h-full text-white" />
              </div>
              <span className="text-sm font-medium">Add Product</span>
            </div>
            <div>
              <MdOutlineKeyboardArrowRight className="text-xl" />
            </div>
          </button>
          <button
            type="button"
            // to="/add-service"
            onClick={() => handleNavigate("/add-service", "service")}
            className="w-[343px] bg-[#F2F2F2] rounded-[14px] p-4 flex items-center justify-between"
          >
            <div className="flex items-center justify-start gap-2">
              <div className="blue-bg rounded-full w-[32px] p-2 h-[32px]">
                <FiPlus className="w-full h-full text-white" />
              </div>
              <span className="text-sm font-medium">Add Service</span>
            </div>
            <div>
              <MdOutlineKeyboardArrowRight className="text-xl" />
            </div>
          </button>
        </div>
      </div>
    )
  );
};
