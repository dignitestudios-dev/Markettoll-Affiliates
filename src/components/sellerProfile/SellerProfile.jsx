import React, { useState } from "react";
import SellerProducts from "./SellerProducts";
import SellerServices from "./SellerServices";
import { Link } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { IoIosStar } from "react-icons/io";

const SellerProfile = () => {
  const [category, setCategory] = useState("Products");
  return (
    <div className="padding-x py-6">
      <div className="w-full bg-[#F7F7F7] rounded-[20px] p-6 lg:p-12 relative">
        <div>
          <Link to="/products/12324356" className="flex items-center gap-1">
            <GoArrowLeft className="light-blue-text text-xl" />
            <span className="text-[#5C5C5C] text-sm font-medium">Back</span>
          </Link>
        </div>

        <div className="w-full mt-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/seller-profile-img.png"
              alt="seller profile"
              className="w-[89.1px] h-[95.53px]"
            />
            <div className="flex flex-col items-start gap-1">
              <span className="text-[26px] font-bold">Adam Mill</span>
              <div className="flex items-center gap-1">
                <IoIosStar className="text-xl text-yellow-400" />
                <IoIosStar className="text-xl text-yellow-400" />
                <IoIosStar className="text-xl text-yellow-400" />
                <IoIosStar className="text-xl text-yellow-400" />
                <IoIosStar className="text-xl text-gray-300" />
                <span className="text-sm">(4)</span>
                <span className="text-sm text-gray-500">24</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="text-[13px] text-[#5C5C5C] flex items-center gap-2"
          >
            <img
              src="/report-icon.png"
              alt="report-icon"
              className="w-[18.51px] h-[16px]"
            />{" "}
            Report
          </button>
        </div>
      </div>

      <div className="w-full mt-10">
        <div className="w-full flex items-center justify-between">
          <h2 className="text-[28px] font-bold blue-text">{category}</h2>

          <div>
            <button
              type="button"
              onClick={() => setCategory("Products")}
              className={`py-3 px-6 rounded-l-xl text-base font-bold ${
                category == "Products"
                  ? "text-white blue-bg"
                  : "bg-[#F7F7F7] text-black"
              }`}
            >
              Products
            </button>
            <button
              type="button"
              onClick={() => setCategory("Services")}
              className={`py-3 px-6 rounded-r-xl  text-base font-bold ${
                category == "Services"
                  ? "text-white blue-bg"
                  : "bg-[#F7F7F7] text-black"
              }`}
            >
              Services
            </button>
          </div>
        </div>
      </div>

      {category == "Services" ? <SellerServices /> : <SellerProducts />}
    </div>
  );
};

export default SellerProfile;
