import React from "react";
import { IoIosStar } from "react-icons/io";

const ProductReviewCard = () => {
  return (
    <div className="border-t py-3 pb-5">
      <div className="flex items-center gap-1 my-2">
        <IoIosStar className="text-yellow-400 text-xl" />
        <IoIosStar className="text-yellow-400 text-xl" />
        <IoIosStar className="text-yellow-400 text-xl" />
        <IoIosStar className="text-yellow-400 text-xl" />
        <IoIosStar className="text-gray-300 text-xl" />
      </div>
      <p className="text-sm font-normal leading-[14.4px]">
        Amazing product. I booked on Monday and I got my order on the next day.
        I’m highly impressed with their services. Highly recommended!
      </p>
      <div className="flex items-center gap-2 mt-2">
        <img
          src="/customer-img.png"
          alt="customer-img"
          className="w-[34px] h-[32px]"
        />
        <span className="text-xs font-medium">Jason Cruz</span>
        <span className="text-xs font-normal text-[#5C5C5C]">
          27 April, 2024
        </span>
      </div>
    </div>
  );
};

export default ProductReviewCard;
