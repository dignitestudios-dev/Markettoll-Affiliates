import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { GoArrowLeft } from "react-icons/go";
import PlanPurchaseSuccessModal from "../BoostPost/PlanPurchaseSuccessModal";
// import PostBoostedSuccessModal from "../BoostPost/PostBoostedSuccessModal";
import { IoClose } from "react-icons/io5";
// import PlanPurchaseSuccessModal from "./PlanPurchaseSuccessModal";
// import PostBoostedSuccessModal from "./PostBoostedSuccessModal";

const packageInfo = {
  title: "2.99",
  duration: "7 days",
  features: [
    "Lorem ipsum dolor sit amet consectetur.",
    "Lorem ipsum dolor sit amet consectetur.",
    "Lorem ipsum dolor sit amet consectetur.",
    "Lorem ipsum dolor sit amet consectetur.",
    "Lorem ipsum dolor sit amet consectetur.",
  ],
};

const AddPaymentDetails = () => {
  const [addCard, setAddCard] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const navigate = useNavigate();

  const handleBuyPlan = () => {
    setShowSuccessModal(true);
    setShowInfoModal(true);

    //     setTimeout(() => {
    //     //   setShowSuccessModal(false);
    // }, 800);
  };

  const handleCloseInfoModal = () => {
    setShowInfoModal(false);
    navigate("/");
  };

  const handleAddCardTrue = () => {
    setAddCard(!addCard);
  };

  const handleAddCardFalse = () => {
    setAddCard(!addCard);
    setShowCard(!showCard);
  };

  return (
    <div className="w-full py-12 lg:py-16 rounded-[30px] bg-[#F7F7F7] relative">
      {addCard && (
        <button
          type="button"
          onClick={handleAddCardTrue}
          className="flex items-center gap-1 absolute left-4 lg:left-10 top-6"
        >
          <GoArrowLeft className="text-xl light-blue-text" />
          <span className="text-sm font-medium text-[#5C5C5C]">Back</span>
        </button>
      )}
      <h2 className="text-2xl lg:text-[36px] blue-text font-bold text-center">
        {addCard ? "Add Your Card Details" : "Add Your Payment Details"}
      </h2>

      {addCard ? (
        <p className="text-[18px] font-medium text-[#5C5C5C] text-center mt-3 mb-4">
          Kindly Add your debit or credit card details.
        </p>
      ) : (
        <p className="text-[#5C5C5C] text-lg font-medium text-center mt-3 mb-4">
          Kindly enter your debit or credit card details for processing.
        </p>
      )}

      {addCard ? (
        <div className="w-full flex flex-col items-center gap-5 mt-10">
          <div className="w-full flex flex-col items-start gap-1 lg:w-[635px]">
            <label htmlFor="cardHolderName" className="font-medium text-sm">
              Card Holder Name
            </label>
            <input
              type="text"
              id="cardHolderName"
              name="cardHolderName"
              placeholder="John Smith"
              className="w-full bg-white rounded-full px-6 py-4 text-sm text-[#5C5C5C] outline-none"
            />
          </div>
          <div className="w-full flex flex-col items-start gap-1 lg:w-[635px]">
            <label htmlFor="cardNumber" className="font-medium text-sm">
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              placeholder="0000 0000 0000"
              className="w-full bg-white rounded-full px-6 py-4 text-sm text-[#5C5C5C] outline-none"
            />
          </div>
          <div className="w-full lg:w-[635px] grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="w-full flex flex-col items-start gap-1">
              <label htmlFor="expiry" className="font-medium text-sm">
                Expiry
              </label>
              <input
                type="text"
                id="expiry"
                name="expiry"
                placeholder="MM/YY"
                className="w-full bg-white rounded-full px-6 py-4 text-sm text-[#5C5C5C] outline-none"
              />
            </div>
            <div className="w-full flex flex-col items-start gap-1">
              <label htmlFor="cvc" className="font-medium text-sm">
                CVC
              </label>
              <input
                type="text"
                id="cvc"
                name="cvc"
                placeholder="0000"
                className="w-full bg-white rounded-full px-6 py-4 text-sm text-[#5C5C5C] outline-none"
              />
            </div>
          </div>
          <div className="w-full lg:w-[635px] mt-2">
            <button
              type="button"
              onClick={handleAddCardFalse}
              className="py-3 px-10 rounded-full w-full blue-bg text-white font-bold text-base"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full mt-10 grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8 padding-x">
          <div className="flex justify-center lg:justify-end">
            <div
              className={`relative rounded-[30px] p-6 lg:p-7 xl:pt-20 xl:px-10 flex flex-col gap-1 w-full lg:w-[500px] bg-white`}
            >
              <div className="w-full absolute top-4 right-4">
                <span
                  className={`blue-bg text-white px-6 lg:px-10 py-2.5 rounded-full text-center font-medium text-sm float-end`}
                >
                  Plan 2
                </span>
              </div>
              <h3 className={`blue-text font-bold text-4xl lg:text-[81px]`}>
                <span className="text-[22px] relative -top-2.5 lg:-top-10">
                  $
                </span>
                <span className="mx-1">{packageInfo.title}</span>
                <span className="text-[22px]">/ {packageInfo.duration}</span>
              </h3>
              <ul className={`bg-white px-4 rounded-xl`}>
                {packageInfo.features?.map((p, index) => {
                  return (
                    <li
                      key={index}
                      className="flex items-center w-full gap-2 my-5"
                    >
                      <div className="w-[17px] h-[17px] blue-bg p-1 rounded-full block">
                        <FaCheck className="text-white w-full h-full" />
                      </div>

                      <span className="text-base">{p}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-[22px] font-bold blue-text">Payment Method</h3>
            <div className="w-full flex items-center justify-between mt-4">
              <p className="text-base font-normal">Credit/Debit Card</p>
              <p className="text-base font-normal">
                Total Amount:{" "}
                <span className="blue-text font-bold text-[24px]">$18</span>{" "}
                <span className="text-[12px]">/month</span>
              </p>
            </div>

            <div className="w-full my-4">
              <button
                type="button"
                onClick={() => handleAddCardTrue()}
                className="flex items-center bg-white rounded-full px-6 py-3.5 justify-between w-full"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={
                      showCard
                        ? "/mastercard-icon.png"
                        : "/credit-card-icon.png"
                    }
                    alt="credit-card-icon"
                    className={`${
                      showCard ? "w-[24.79px] h-[15.33px]" : "w-[20px] h-[20px]"
                    }`}
                  />
                  <span className="text-sm font-normal text-[#5C5C5C]">
                    {showCard
                      ? "**** **** **** 8941"
                      : "Add Debit/ Credit Card"}
                  </span>
                </div>
                <MdOutlineKeyboardArrowRight className="text-2xl light-blue-text" />
              </button>
            </div>

            <button
              type="button"
              disabled={!showCard}
              onClick={() => handleBuyPlan()}
              className={`py-3.5 text-center w-full rounded-full ${
                showCard ? "blue-bg" : "bg-[#B4B5B6]"
              } text-base font-bold text-white`}
            >
              Pay Now
            </button>
          </div>
        </div>
      )}

      {/* {showSuccessModal && <PlanPurchaseSuccessModal />} */}
      {showInfoModal && (
        <PostBoostedSuccessModal onclick={handleCloseInfoModal} />
      )}
      {/* <PostBoostedSuccessModal /> */}
    </div>
  );
};

export default AddPaymentDetails;

const PostBoostedSuccessModal = ({ onclick }) => {
  return (
    <div
      className={`w-full h-screen fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] flex items-center justify-center padding-x`}
    >
      <div className="w-full bg-white lg:w-[440px] h-[244px] rounded-[16px] flex flex-col items-center justify-center relative gap-2">
        <button
          type="button"
          onClick={onclick}
          className="w-[30px] h-[30px] bg-gray-200 absolute top-4 right-4 rounded-full p-1"
        >
          <IoClose className="w-full h-full" />
        </button>
        <div className="w-[69.67px] h-[69.67px] rounded-full blue-bg flex items-center justify-center p-3.5">
          <FaCheck className="w-full h-full text-white" />
        </div>
        <span className="text-[20px] font-bold blue-text">
          Congratulations, John Smith
        </span>
        <span className="text-base font-normal text-[#5C5C5C]">
          Your've successfully subscribed to the plan 2.
        </span>
      </div>
    </div>
  );
};
