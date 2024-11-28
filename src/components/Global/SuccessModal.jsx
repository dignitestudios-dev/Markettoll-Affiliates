import React from "react";
import { FaCheck } from "react-icons/fa6";

const SuccessModal = ({ showModal }) => {
  return (
    showModal && (
      <div className="w-full h-screen fixed inset-0 z-50 bg-[rgba(0,0,0,0.4)] flex items-center justify-center px-4">
        <div className="w-full lg:w-[440px] py-10 px-10 flex flex-col items-center justify-center gap-5 bg-white rounded-2xl">
          <div className="w-[69px] h-[69px] rounded-full blue-bg p-3">
            <FaCheck className="text-white w-full h-full" />
          </div>
          <h2 className="text-[22px] blue-text font-bold">
            Account Created Successfully!
          </h2>
        </div>
      </div>
    )
  );
};

export default SuccessModal;
