import React, { useState } from "react";
import { GoArrowLeft } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";

const SelectPaymentMethod = ({ onclick }) => {
  const [state, setState] = useState(false);
  const [openFundModal, setOpenFundMOdal] = useState(false);

  const handleToggleState = () => {
    setState(!state);
  };

  const handleToggleFundModal = () => {
    setOpenFundMOdal(!openFundModal);
  };

  return (
    <div className="bg-white rounded-[20px] p-6 w-full">
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
      <h2 className="text-[28px] font-bold blue-text mt-3">
        Select Payment Method
      </h2>

      <div className="flex flex-col items-start gap-3 mt-5 w-full">
        <div className="flex items-center gap-2 w-full">
          <input
            type="radio"
            name="address1"
            id="address1"
            className="w-5 h-5"
          />
          <label
            htmlFor="address1"
            className="bg-white border cursor-pointer rounded-[20px] px-3 py-3 text-sm w-full flex items-center justify-between"
          >
            <div className=" flex items-center gap-3">
              <img
                src="/mastercard-icon.png"
                alt="mastercard-icon"
                className="w-[24.79px] h-[15.33px]"
              />
              <span className="text-[#5C5C5C]">**** **** **** 8941</span>
            </div>
            <MdOutlineKeyboardArrowRight className="text-2xl light-blue-text" />
          </label>
        </div>

        <div className="flex items-center gap-2 w-full">
          <input
            type="radio"
            name="address1"
            id="address1"
            className="w-5 h-5"
          />
          <label
            htmlFor="address1"
            className="bg-white cursor-pointer border rounded-[20px] px-3 py-3 text-sm w-full flex items-center justify-between"
          >
            <div className=" flex items-center gap-3">
              <img
                src="/mastercard-icon.png"
                alt="mastercard-icon"
                className="w-[24.79px] h-[15.33px]"
              />
              <span className="text-[#5C5C5C]">Pay via Wallet</span>
            </div>
            <div className="flex items-center gap-5">
              <span className="text-[18px] font-medium">$240.00</span>
              <button
                type="button"
                onClick={handleToggleFundModal}
                className="light-blue-text underline"
              >
                Add Fund
              </button>
            </div>
          </label>
        </div>

        <button
          type="button"
          onClick={handleToggleState}
          className="flex items-center gap-2 w-full lg:pl-[3%]"
        >
          <div className="bg-white border rounded-[20px] px-3 py-3 text-sm w-full flex items-center justify-between">
            <div className=" flex items-center gap-3">
              <img
                src="/credit-card-icon.png"
                alt="credit-card-icon"
                className="w-[20px] h-[20px]"
              />
              <span className="text-[#5C5C5C]">Add Debit/ Credit Card</span>
            </div>
            <MdOutlineKeyboardArrowRight className="text-2xl light-blue-text" />
          </div>
        </button>
      </div>

      <AddPaymentMethod state={state} onclick={handleToggleState} />
      <AddFund state={openFundModal} onclick={handleToggleFundModal} />
    </div>
  );
};

export default SelectPaymentMethod;

const AddPaymentMethod = ({ state, onclick }) => {
  return (
    state && (
      <div className="w-full h-screen bg-[rgba(0,0,0,0.5)] fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-[15px] p-8 relative w-[680px] h-auto flex flex-col items-center gap-3">
          <div className="w-full flex items-start justify-between mb-4">
            <div>
              <h3 className="text-[28px] blue-text font-bold">
                Add Your Card Details
              </h3>
              <p className="text-[18px] font-medium text-[#5C5C5C]">
                Kindly Add your debit or credit card details.
              </p>
            </div>
            <button
              type="button"
              onClick={onclick}
              className="w-6 h-6 bg-[#F7F7F7] rounded-full p-1"
            >
              <IoClose className="w-full h-full" />
            </button>
          </div>

          <div className="w-full flex flex-col items-start gap-1">
            <label htmlFor="cardHolderName" className="text-[13px] font-medium">
              Card Holder Name
            </label>
            <input
              type="text"
              id="cardHolderName"
              name="cardHolderName"
              placeholder="John Smith"
              className="bg-white rounded-[16px] px-4 py-3 text-sm w-full outline-none border"
            />
          </div>

          <div className="w-full flex flex-col items-start gap-1">
            <label htmlFor="cardNumber" className="text-[13px] font-medium">
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              placeholder="0000 0000 0000"
              className="bg-white rounded-[16px] px-4 py-3 text-sm w-full outline-none border"
            />
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="w-full flex flex-col items-start gap-1">
              <label htmlFor="expiry" className="text-[13px] font-medium">
                Expiry
              </label>
              <input
                type="text"
                id="expiry"
                name="expiry"
                placeholder="MM/YY"
                className="bg-white rounded-[16px] px-4 py-3 text-sm w-full outline-none border"
              />
            </div>
            <div className="w-full flex flex-col items-start gap-1">
              <label htmlFor="cvc" className="text-[13px] font-medium">
                CVC
              </label>
              <input
                type="text"
                id="cvc"
                name="cvc"
                placeholder="0000"
                className="bg-white rounded-[16px] px-4 py-3 text-sm w-full outline-none border"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={onclick}
            className="text-base rounded-[16px] w-full py-3 blue-bg text-white font-bold"
          >
            Add
          </button>
        </div>
      </div>
    )
  );
};

const AddFund = ({ state, onclick }) => {
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  const handleToggleSuccessModal = () => {
    setOpenSuccessModal(!openSuccessModal);
  };

  return (
    state && (
      <div className="w-full h-screen bg-[rgba(0,0,0,0.5)] fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-[15px] p-8 relative w-[680px] h-auto flex flex-col items-center gap-3">
          <div className="w-full flex items-start justify-between mb-4">
            <div>
              <h3 className="text-[28px] blue-text font-bold">Add Fund</h3>
            </div>
            <button
              type="button"
              onClick={onclick}
              className="w-6 h-6 bg-[#F7F7F7] rounded-full p-1"
            >
              <IoClose className="w-full h-full" />
            </button>
          </div>

          <div className="w-full flex flex-col items-start gap-1">
            <div className="bg-[#F5F5F5] rounded-[16px] px-4 w-full flex items-center gap-3">
              <img
                src="/mastercard-icon.png"
                alt="mastercard-icon"
                className="w-[24.79px] h-[15.33px]"
              />
              <input
                type="text"
                id="cardHolderName"
                name="cardHolderName"
                disabled
                placeholder="**** **** **** 8941"
                className=" py-3 text-sm w-full outline-none"
              />
            </div>
          </div>

          <div className="w-full flex items-center justify-between my-4 gap-1">
            <span className="text-sm font-medium">
              Available Wallet balance
            </span>
            <span className="text-sm font-bold">$240.00</span>
          </div>

          <div className="w-full flex flex-col items-start gap-1">
            <label htmlFor="amount" className="text-[13px] font-medium">
              Enter Amount
            </label>
            <div className="w-full bg-white rounded-[16px] px-4 border flex items-center gap-2">
              <span className="light-blue-text font-bold">$</span>
              <input
                type="text"
                id="amount"
                name="amount"
                placeholder="120"
                className=" py-3 text-sm w-full outline-none"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleSuccessModal}
            className="text-base rounded-[16px] w-full py-3 blue-bg text-white font-bold mt-4"
          >
            Add
          </button>
        </div>
        <AddFundSuccess
          openSuccessModal={openSuccessModal}
          onclick={handleToggleSuccessModal}
        />
      </div>
    )
  );
};

const AddFundSuccess = ({ openSuccessModal, onclick }) => {
  return (
    openSuccessModal && (
      <div className="w-full h-screen bg-[rgba(0,0,0,0.5)] fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-[15px] p-8 relative w-[440px] h-auto flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={onclick}
            className="w-6 h-6 bg-[#F7F7F7] rounded-full p-1 absolute top-4 right-4"
          >
            <IoClose className="w-full h-full" />
          </button>
          <div className="w-[69.67px] h-[69.67px] rounded-full blue-bg p-3">
            <FaCheck className="w-full h-full text-white" />
          </div>
          <h3 className="text-[18px] blue-text font-bold">Add Fund</h3>
          <h4 className="text-[18px] blue-text font-bold">$120.00</h4>
          <p className="text-base text-[#5C5C5C]">
            Funds has been added to your wallet
          </p>
        </div>
      </div>
    )
  );
};
