import React from "react";
import { IoClose } from "react-icons/io5";

const PhoneNumberSuccessModal = ({ onclose, state }) => {
  return (
    state && (
      <div className="w-full h-screen fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center px-4">
        <div className="bg-white p-10 w-full md:w-2/3 lg:w-[487px] h-[210px] relative flex flex-col items-center justify-center gap-2 rounded-xl text-center">
          <button
            type="button"
            onClick={onclose}
            className="w-[30px] h-[30px] p-1 rounded-full bg-[#F5F5F5] absolute top-5 right-5"
          >
            <IoClose className="w-full h-full" />
          </button>
          <img
            src="/check-image.png"
            alt="check-image"
            className="w-[69.67px] h-[69.67px]"
          />
          <p className="text-[#003DAC] text-[20px] font-bold">Number Updated</p>
          <p className="">Your number has been successfully updated!</p>
        </div>
      </div>
    )
  );
};

export default PhoneNumberSuccessModal;
