import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../Global/ProductCard";
import { IoClose } from "react-icons/io5";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import { AuthContext } from "../../context/authContext";
import MyServicesList from "./MyServicesList";
import MyProductsList from "./MyProductsList";
// import { Popup } from "../OnboardProfileSetup/WouldAddService";

const MyProductsAndServices = () => {
  const [showPopup, setShowPopup] = useState(false);
  const { user } = useContext(AuthContext);
  const [myProducts, setMyProducts] = useState([]);
  const [state, setState] = useState(false);
  // console.log(user?._id);

  const handleShowPopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div className="w-full">
      <SellPopup showPopup={showPopup} handleShowPopup={handleShowPopup} />
      <div className="w-full flex items-center justify-between">
        <h2 className="blue-text text-[28px] font-bold">My Products</h2>
        <button
          type="button"
          onClick={handleShowPopup}
          className="blue-bg px-3 py-2 rounded-xl flex items-center gap-2"
        >
          <span className="font-bold text-base text-white">Sell</span>
          <img
            src="/plus-icon.png"
            alt="plus-icon"
            className="w-[15px] h-[15px]"
          />
        </button>
      </div>
      <div className="flex items-center justify-between mt-6">
        <div>
          <button
            type="button"
            onClick={() => setState(false)}
            className={`${
              state ? "bg-[#F7F7F7] text-black" : "blue-bg text-white"
            } rounded-l-xl px-4 py-2.5 font-bold`}
          >
            Products
          </button>
          <button
            type="button"
            onClick={() => setState(true)}
            className={`${
              !state ? "bg-[#F7F7F7] text-black" : "blue-bg text-white"
            } rounded-r-xl px-4 py-2.5 font-bold`}
          >
            Services
          </button>
        </div>
        <div>
          <select
            id="countries"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 outline-none"
          >
            <option selected value="post">
              Post
            </option>
            <option value="boosted">Boosted</option>
          </select>
        </div>
      </div>
      {state ? <MyServicesList /> : <MyProductsList />}
    </div>
  );
};

export default MyProductsAndServices;

const SellPopup = ({ showPopup, handleShowPopup }) => {
  return (
    showPopup && (
      <div className="w-full h-screen fixed z-50 inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden">
        <div className="w-[90%] lg:w-[532px] h-[288px] relative rounded-[12px] bg-white py-12 px-5 flex flex-col items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleShowPopup}
            className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center absolute top-5 p-1 right-5"
            aria-label="Close Popup"
          >
            <IoClose className="w-full h-full" />
          </button>
          <h3 className="text-[18px] font-bold blue-text mb-4">Select Type</h3>

          <Link
            to="/add-product"
            className="w-full md:w-[343px] h-[56px] rounded-[14px] p-4 bg-[#F2F2F2] flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div className="w-[32px] h-[32px] blue-bg rounded-full flex items-center justify-center p-2">
                <FiPlus className="w-full h-full text-white" />
              </div>
              <span className="text-sm font-medium">Add Product</span>
            </div>
            <MdOutlineKeyboardArrowRight className="text-xl" />
          </Link>
          <Link
            to="/add-service"
            className="w-full md:w-[343px] h-[56px] rounded-[14px] p-4 bg-[#F2F2F2] flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div className="w-[32px] h-[32px] blue-bg rounded-full flex items-center justify-center p-2">
                <FiPlus className="w-full h-full text-white" />
              </div>
              <span className="text-sm font-medium">Add Service</span>
            </div>
            <MdOutlineKeyboardArrowRight className="text-xl" />
          </Link>
        </div>
      </div>
    )
  );
};
