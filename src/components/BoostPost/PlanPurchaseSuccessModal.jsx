import React from "react";
import { FaCheck } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

const PlanPurchaseSuccessModal = () => {
  return (
    <div
      className={`w-full h-screen fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] flex items-center justify-center padding-x`}
    >
      <div className="w-full bg-white lg:w-[440px] h-[244px] rounded-[16px] flex flex-col items-center justify-center relative gap-2">
        <button
          type="button"
          className="w-[30px] h-[30px] bg-gray-200 absolute top-4 right-4 rounded-full p-1"
        >
          <IoClose className="w-full h-full" />
        </button>
        <div className="w-[69.67px] h-[69.67px] rounded-full blue-bg flex items-center justify-center p-2.5">
          <FaCheck className="w-full h-full text-white" />
        </div>
        <span className="text-[20px] font-bold blue-text">
          Congratulations!
        </span>
        <span className="text-base font-normal text-[#5C5C5C]">
          You have successfully Purchase plan 2
        </span>
      </div>
    </div>
  );
};

export default PlanPurchaseSuccessModal;
