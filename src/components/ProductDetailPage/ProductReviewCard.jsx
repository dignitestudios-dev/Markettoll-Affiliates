import React from "react";
import { IoIosStar } from "react-icons/io";

const ProductReviewCard = ({ review }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    return new Intl.DateTimeFormat("en-GB", options).format(date);
  };

  const renderStars = (rating) => {
    const totalStars = 5;
    const filledStars = Math.floor(rating);
    const emptyStars = totalStars - filledStars;

    return (
      <>
        {[...Array(filledStars)].map((_, index) => (
          <IoIosStar
            key={`filled-${index}`}
            className="text-yellow-400 text-xl"
          />
        ))}
        {[...Array(emptyStars)].map((_, index) => (
          <IoIosStar key={`empty-${index}`} className="text-gray-300 text-xl" />
        ))}
      </>
    );
  };

  return (
    <div className="border-t py-3 pb-5">
      <div className="flex items-center gap-1 my-2">
        {renderStars(review?.rating)}
      </div>
      <p className="text-sm font-normal leading-[14.4px]">
        {review?.description?.substring(0, 200)}
      </p>
      <div className="flex items-center gap-2 mt-2">
        <img
          src={review?.reviewer?.profileImage}
          alt="customer-img"
          className="w-[34px] h-[32px] rounded-full bg-cover"
        />
        <span className="text-xs font-medium">{review?.reviewer?.name}</span>
        <span className="text-xs font-normal text-[#5C5C5C]">
          {formatDate(review?.createdAt)}
        </span>
      </div>
    </div>
  );
};

export default ProductReviewCard;
