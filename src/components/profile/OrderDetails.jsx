import React, { useState } from "react";
import { Link } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { IoIosStar } from "react-icons/io";
import { FaCheck } from "react-icons/fa6";

const OrderDetails = () => {
  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);

  const handleToggleFeedbackModal = () => {
    setOpenFeedbackModal(!openFeedbackModal);
  };

  return (
    <div className="p-5 bg-[#F7F7F7] rounded-[20px] grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="p-5 rounded-[20px] bg-white col-span-1 lg:col-span-2">
        <Link to="/order-history" className="flex items-center gap-1 mb-4">
          <GoArrowLeft className="text-xl light-blue-text" />
          <span className="text-sm font-medium text-gray-500">Back</span>
        </Link>
        <p className="font-medium text-base">
          Order ID: <span className="text-[#808080]">26413</span>
        </p>
        <p className="font-medium text-base mt-2">
          Order Placed:
          <span className="text-[#808080]">21 Jan, 2024</span>
        </p>
        <div className="w-full mt-3">
          <h6 className="font-bold text-base">Delivery Address</h6>
          <div className="bg-[#F5F5F5] p-3.5 rounded-2xl px-4 text-sm">
            Unit 500, Montford Court, Montford Street, Salford, M50 2QP - 123456
          </div>
        </div>
        <div className="w-full mt-3">
          <h6 className="font-bold text-base">Payment Method</h6>
          <div className="bg-[#fff] border p-3.5 rounded-2xl px-4 text-sm flex items-center justify-start gap-2">
            <img
              src="/mastercard-icon.png"
              alt="master-card-icon"
              className="w-[24.79px] h-[15.33px]"
            />
            <span> **** **** **** 8941</span>
          </div>
        </div>

        {/* Delivery Orders */}
        <div className="w-full border-b py-3 mt-5">
          <h6 className="font-bold text-base">Delivery Orders</h6>
          <p className="text-sm">Will be delivered to your address</p>
        </div>
        <div className="w-full py-3 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/product-img-1.png"
              alt="product-img"
              className="w-[80px] h-[80px] rounded-[15px]"
            />
            <div className="flex flex-col items-start">
              <span className="font-semibold text-sm md:text-base">
                Product name here
              </span>
              <span className="font-normal text-sm text-[#9D9D9DDD]">
                Delivery
              </span>
              <div className="font-normal text-[13px] text-[#9D9D9DDD] flex items-center gap-2">
                <img
                  src="/chat-icon.png"
                  alt="chat-icon"
                  className="w-[14px] md:w-[18px] h-[14px] md:h-[18px]"
                />
                Chat With Seller
              </div>
            </div>
          </div>
          <div className="flex flex-col md:gap-2">
            <span className="text-[#9D9D9DDD] text-xs md:text-[16px]">
              Price
            </span>
            <span className="font-bold blue-text text-xs md:text-[18px]">
              $199.00
            </span>
            <button
              type="button"
              onClick={handleToggleFeedbackModal}
              className="px-5 md:px-8 lg:px-10 py-2 blue-bg text-white font-medium text-xs rounded-2xl"
            >
              Give Feedback
            </button>
          </div>
        </div>

        <div className="w-full py-3 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/product-img-1.png"
              alt="product-img"
              className="w-[80px] h-[80px] rounded-[15px]"
            />
            <div className="flex flex-col items-start">
              <span className="font-semibold text-sm md:text-base">
                Product name here
              </span>
              <span className="font-normal text-sm text-[#9D9D9DDD]">
                Delivery
              </span>
              <div className="font-normal text-[13px] text-[#9D9D9DDD] flex items-center gap-2">
                <img
                  src="/chat-icon.png"
                  alt="chat-icon"
                  className="w-[14px] md:w-[18px] h-[14px] md:h-[18px]"
                />
                Chat With Seller
              </div>
            </div>
          </div>
          <div className="flex flex-col  md:gap-2">
            <span className="text-[#9D9D9DDD] text-xs md:text-[16px]">
              Price
            </span>
            <span className="font-bold blue-text text-xs md:text-[18px]">
              $199.00
            </span>
            <button
              type="button"
              onClick={handleToggleFeedbackModal}
              className="px-5 md:px-8 lg:px-10 py-2 blue-bg text-white font-medium text-xs rounded-2xl"
            >
              Give Feedback
            </button>
          </div>
        </div>

        {/* Pickup orders */}
        <div className="w-full border-b py-3 mt-5">
          <h6 className="font-bold text-base">Pickup Orders</h6>
        </div>
        <div className="w-full py-3 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/product-img-1.png"
              alt="product-img"
              className="w-[80px] h-[80px] rounded-[15px]"
            />
            <div className="flex flex-col items-start">
              <span className="font-semibold text-sm md:text-base">
                Product name here
              </span>
              <span className="font-normal text-sm text-[#9D9D9DDD]">
                Delivery
              </span>
              <div className="font-normal text-[13px] text-[#9D9D9DDD] flex items-center gap-2">
                <img
                  src="/chat-icon.png"
                  alt="chat-icon"
                  className="w-[14px] md:w-[18px] h-[14px] md:h-[18px]"
                />
                Chat With Seller
              </div>
            </div>
          </div>
          <div className="flex flex-col md:gap-2">
            <span className="text-[#9D9D9DDD] text-xs md:text-[16px]">
              Price
            </span>
            <span className="font-bold blue-text text-xs md:text-[18px]">
              $199.00
            </span>
            <button
              type="button"
              onClick={handleToggleFeedbackModal}
              className="px-5 md:px-8 lg:px-10 py-2 blue-bg text-white font-medium text-xs rounded-2xl"
            >
              Give Feedback
            </button>
          </div>
        </div>
        <div className="w-full py-3 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/product-img-1.png"
              alt="product-img"
              className="w-[80px] h-[80px] rounded-[15px]"
            />
            <div className="flex flex-col items-start">
              <span className="font-semibold text-sm md:text-base">
                Product name here
              </span>
              <span className="font-normal text-sm text-[#9D9D9DDD]">
                Delivery
              </span>
              <div className="font-normal text-[13px] text-[#9D9D9DDD] flex items-center gap-2">
                <img
                  src="/chat-icon.png"
                  alt="chat-icon"
                  className="w-[14px] md:w-[18px] h-[14px] md:h-[18px]"
                />
                Chat With Seller
              </div>
            </div>
          </div>
          <div className="flex flex-col md:gap-2">
            <span className="text-[#9D9D9DDD] text-xs md:text-[16px]">
              Price
            </span>
            <span className="font-bold blue-text text-xs md:text-[18px]">
              $199.00
            </span>
            <button
              type="button"
              onClick={handleToggleFeedbackModal}
              className="px-5 md:px-8 lg:px-10 py-2 blue-bg text-white font-medium text-xs rounded-2xl"
            >
              Give Feedback
            </button>
          </div>
        </div>

        {/* Address and phone number */}
        <div className="w-full mt-7">
          <div className="flex items-center justify-start gap-3">
            <img
              src="/call-icon-filled.png"
              alt="call-icon-filled"
              className="w-[19px] h-[19px]"
            />
            <span className="text-sm">+1 123 456 7890</span>
          </div>
          <div className="flex items-center justify-start gap-3 mt-3 border-b pb-4">
            <img
              src="/location-icon.png"
              alt="location-icon"
              className="w-[17px] h-[20.1px]"
            />
            <span className="text-sm">
              Unit 500, Montford Court, Montford Street, Salford, M50 2QP -
              123456
            </span>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className=" col-span-1">
        <div className="w-full p-5 rounded-[20px] bg-white">
          <h3 className="blue-text font-bold text-[28px]">Order Summary</h3>

          <div className="w-full flex items-center justify-between mt-5">
            <span className="text-[#000000B2]">Subtotal (3 items)</span>
            <span className="text-[#000000B2]">$848.00</span>
          </div>
          <div className="w-full flex items-center justify-between mt-3">
            <span className="text-[#000000B2]">Shipping Fee</span>
            <span className="text-[#000000B2]">$100.00</span>
          </div>
          <div className="border my-4" />
          <div className="w-full flex items-center justify-between">
            <span className="text-[#000000B2] font-bold">Total</span>
            <span className="text-[#000000B2] font-bold">$948.00</span>
          </div>
        </div>
      </div>
      <FeedBackModal
        onclick={handleToggleFeedbackModal}
        openFeedbackModal={openFeedbackModal}
      />
    </div>
  );
};

export default OrderDetails;

const FeedBackModal = ({ onclick, openFeedbackModal }) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const handleSubmitFeedback = () => {
    setShowSuccessModal(true);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    onclick();
  };

  return (
    openFeedbackModal && (
      <div className="w-full h-screen fixed inset-0 flex items-center justify-center px-4 bg-[rgba(0,0,0,0.5)]">
        <div className="bg-white w-full lg:w-[611px] h-[398px] rounded-xl py-7 px-10 relative flex flex-col items-center justify-center gap-3">
          <button
            type="button"
            onClick={onclick}
            className="w-6 h-6 bg-[#F7F7F7] rounded-full p-1 absolute top-5 right-5"
          >
            <IoClose className="w-full h-full" />
          </button>
          <h3 className="text-xl font-bold blue-text">Give Feedback</h3>
          <p className="text-lg font-medium text-[#5C5C5C]">
            How was your experience?
          </p>
          <div className="w-[171.06px] flex items-center justify-between">
            <IoIosStar className="w-[26.32px] h-[25px] text-yellow-500" />
            <IoIosStar className="w-[26.32px] h-[25px] text-yellow-500" />
            <IoIosStar className="w-[26.32px] h-[25px] text-yellow-500" />
            <IoIosStar className="w-[26.32px] h-[25px] text-yellow-500" />
            <IoIosStar className="w-[26.32px] h-[25px] text-gray-300" />
          </div>

          <div className="w-full">
            <textarea
              name="feedback"
              id="feedback"
              rows={5}
              placeholder="Write your Review here"
              className="border rounded-2xl p-3 text-sm outline-none w-full mb-3 text-[#5C5C5C]"
            ></textarea>
            <button
              type="button"
              onClick={handleSubmitFeedback} // Trigger success modal on submit
              className="py-3 w-full text-center blue-bg text-white text-sm font-bold rounded-2xl"
            >
              Submit
            </button>
          </div>
        </div>

        <SuccessModal
          showSuccessModal={showSuccessModal}
          onclick={handleCloseSuccessModal}
        />
      </div>
    )
  );
};

const SuccessModal = ({ showSuccessModal, onclick }) => {
  return (
    showSuccessModal && (
      <div className="w-full h-screen fixed inset-0 flex items-center justify-center px-4 bg-[rgba(0,0,0,0.5)]">
        <div className="bg-white w-full lg:w-[440px] h-[201px] rounded-xl py-7 px-10 relative flex flex-col items-center justify-center gap-3">
          <button
            type="button"
            onClick={onclick}
            className="w-6 h-6 bg-[#F7F7F7] rounded-full p-1 absolute top-5 right-5"
          >
            <IoClose className="w-full h-full" />
          </button>
          <div className="blue-bg w-[69.67px] h-[69.67px] rounded-full p-3">
            <FaCheck className="text-white w-full h-full" />
          </div>
          <h3 className="text-xl font-bold blue-text">
            Thank you for your feedback
          </h3>
        </div>
      </div>
    )
  );
};
