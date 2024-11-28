import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { FiPlus } from "react-icons/fi";

const WouldAddService = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleShowPopup = () => {
    setShowPopup(!showPopup);
  };
  return (
    <div className="w-full padding-x py-6 overflow-hidden">
      <div className="w-full flex flex-col items-center justify-center gap-6 bg-[#F7F7F7] px-4 py-12 rounded-[30px]">
        <h2 className="text-[36px] font-bold blue-text">
          Would you like to add Product or services?
        </h2>

        <img
          src="/would-add-service.png"
          alt="would-add-service"
          className="w-[183px] h-[183px]"
        />

        <button
          type="button"
          onClick={handleShowPopup}
          className="blue-bg text-white font-bold py-3 w-full rounded-full lg:w-[635px]"
        >
          Next
        </button>

        <Link to="/" className="text-sm font-bold blue-text">
          Skip
        </Link>
        <Popup showPopup={showPopup} handleShowPopup={handleShowPopup} />
      </div>
    </div>
  );
};

export default WouldAddService;

export const Popup = ({ showPopup, handleShowPopup }) => {
  return (
    showPopup && (
      <div className="w-full h-screen fixed z-50 bg-[rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden ">
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
