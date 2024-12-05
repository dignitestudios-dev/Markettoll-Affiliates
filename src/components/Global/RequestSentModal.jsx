import React from "react";
import { IoClose } from "react-icons/io5";

const RequestSentModal = ({ onclose, success }) => {
  return (
    success && (
      <div className="w-full h-screen fixed inset-0 z-50 bg-[rgba(0,0,0,0.2)] flex items-center justify-center">
        <div className="bg-white rounded-2xl p-6 w-full lg:w-[440px] h-[227px] relative flex flex-col items-center justify-center gap-2">
          <button
            type="button"
            onClick={onclose}
            className="w-6 h-6 rounded-full bg-gray-200 p-1 absolute top-5 right-5"
          >
            <IoClose />
          </button>
          <img
            src="/check-image.png"
            alt="check-image"
            className="w-[69px] h-[69px]"
          />
          <span className="blue-text text-lg font-bold">Request Submitted</span>
          <span className="text-[#5C5C5C]">
            Your request has been submitted. We will email you.
          </span>
        </div>
      </div>
    )
  );
};

export default RequestSentModal;
