import React from "react";
import { IoClose } from "react-icons/io5";

const SuccessModal = ({ open, onclose, text }) => {
  return (
    open && (
      <div className="w-full h-screen fixed inset-0 z-50 flex items-center justify-center padding-x py-6 bg-[rgba(0,0,0,0.4)]">
        <div className="bg-white w-full md:w-[440px] h-[183px] rounded-[16px] p-5 relative flex flex-col items-center justify-center gap-4">
          <button
            type="button"
            onClick={onclose}
            className="w-6 h-6 rounded-full p-1 bg-gray-100 absolute right-5 top-5"
          >
            <IoClose className="w-full h-full" />
          </button>
          <img
            src="/check-image.png"
            alt="check-image"
            className="w-[69.67px] h-[69.67px]"
          />
          <p className="text-[#5C5C5C]">{text}</p>
        </div>
      </div>
    )
  );
};

export default SuccessModal;
