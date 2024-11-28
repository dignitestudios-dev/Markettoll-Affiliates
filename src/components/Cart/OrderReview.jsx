import React from "react";
import { GoArrowLeft } from "react-icons/go";
import { Link } from "react-router-dom";

const OrderReview = ({ onclick, isOrderPlaced }) => {
  return (
    <div className="bg-white rounded-[20px] p-6 flex flex-col items-start gap-5">
      <div>
        <button
          type="button"
          onClick={onclick}
          className="flex items-center gap-1"
        >
          <GoArrowLeft className="text-xl light-blue-text" />
          <span className="text-sm font-medium text-gray-500">Black</span>
        </button>
      </div>
      <h3 className="font-bold text-[28px] blue-text">
        {/* {isOrderPlaced ? "Thank you for placing an order!" : "Order Summary"} */}
        Order Summary
      </h3>

      <div className="w-full">
        <p className="text-base font-bold">Delivery Address</p>
        <div className="bg-[#F5F5F5] px-5 py-3 rounded-[20px]">
          <span className="text-sm font-normal">
            Unit 500, Montford Court, Montford Street, Salford, M50 2QP - 123456
          </span>
        </div>
      </div>

      <div className="w-full">
        <p className="text-base font-bold">Payment Method</p>
        <div className="bg-[#fff] border px-5 py-3 rounded-[20px] flex items-center justify-start gap-3">
          <img
            src="/mastercard-icon.png"
            alt="mastercard-icon"
            className="w-[24px] h-[15px]"
          />
          <span className="text-sm font-normal">**** **** **** 8941</span>
        </div>
      </div>

      <div className="w-full">
        <p className="text-base font-bold">Delivery Orders</p>
        <div className="flex items-center justify-start gap-3 my-4">
          <img
            src="/seller-profile-img.png"
            alt="seller profile"
            className="w-[25.2px] h-[25.2px]"
          />
          <span className="text-base font-medium">Adam Mill</span>
          <Link to="/seller" className="text-[13px] font-semibold underline">
            View Profile
          </Link>
        </div>
        <div className="border-t py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/product-1.png"
              alt="product image"
              className="w-[80px] h-[80px] rounded-[15px]"
            />
            <div className="flex flex-col items-start justify-center gap-1">
              <span className="text-base font-semibold">Product name here</span>
              <span className="text-sm font-normal text-[#9D9D9DDD]">
                Pick/Delivery
              </span>
            </div>
          </div>
          <div className="md:flex flex-col items-start gap-1 hidden">
            <span className="text-[#9D9D9DDD] text-sm">Price</span>
            <span className="font-semibold text-[20px] blue-text">$199.00</span>
          </div>
        </div>
        <div className="border-t py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/product-1.png"
              alt="product image"
              className="w-[80px] h-[80px] rounded-[15px]"
            />
            <div className="flex flex-col items-start justify-center gap-1">
              <span className="text-base font-semibold">Product name here</span>
              <span className="text-sm font-normal text-[#9D9D9DDD]">
                Pick/Delivery
              </span>
            </div>
          </div>
          <div className="md:flex flex-col items-start gap-1 hidden">
            <span className="text-[#9D9D9DDD] text-sm">Price</span>
            <span className="font-semibold text-[20px] blue-text">$199.00</span>
          </div>
        </div>
      </div>

      <div className="w-full">
        <p className="text-base font-bold">Pickup Orders</p>
        <div className="flex items-center justify-start gap-3 my-4">
          <img
            src="/seller-profile-img.png"
            alt="seller profile"
            className="w-[25.2px] h-[25.2px]"
          />
          <span className="text-base font-medium">Adam Mill</span>
          <Link to="/seller" className="text-[13px] font-semibold underline">
            View Profile
          </Link>
        </div>
        <div className="border-t py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/product-1.png"
              alt="product image"
              className="w-[80px] h-[80px] rounded-[15px]"
            />
            <div className="flex flex-col items-start justify-center gap-1">
              <span className="text-base font-semibold">Product name here</span>
              <span className="text-sm font-normal text-[#9D9D9DDD]">
                Pick/Delivery
              </span>
            </div>
          </div>
          <div className="md:flex flex-col items-start gap-1 hidden">
            <span className="text-[#9D9D9DDD] text-sm">Price</span>
            <span className="font-semibold text-[20px] blue-text">$199.00</span>
          </div>
        </div>
        <div className="border-t py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/product-1.png"
              alt="product image"
              className="w-[80px] h-[80px] rounded-[15px]"
            />
            <div className="flex flex-col items-start justify-center gap-1">
              <span className="text-base font-semibold">Product name here</span>
              <span className="text-sm font-normal text-[#9D9D9DDD]">
                Pick/Delivery
              </span>
            </div>
          </div>
          <div className="md:flex flex-col items-start gap-1 hidden">
            <span className="text-[#9D9D9DDD] text-sm">Price</span>
            <span className="font-semibold text-[20px] blue-text">$199.00</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderReview;
