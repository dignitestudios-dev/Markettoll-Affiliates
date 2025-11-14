import React, { useState } from "react";
import { IoIosStar } from "react-icons/io";
import { FiHeart, FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import ProductRating from "./ProductRating";

const ServiceCard = ({ service }) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  const productAvgRating =
    (service?.avgRating?.oneStar * 1 +
      service?.avgRating?.twoStar * 2 +
      service?.avgRating?.threeStar * 3 +
      service?.avgRating?.fourStar * 4 +
      service?.avgRating?.fiveStar * 5) /
    (service?.avgRating?.oneStar +
      service?.avgRating?.twoStar +
      service?.avgRating?.threeStar +
      service?.avgRating?.fourStar +
      service?.avgRating?.fiveStar);
  const safeAvgRating = isNaN(productAvgRating) ? 0 : productAvgRating;

  const handleNavigateToProductDetails = () => {
    navigate(`/services/${service?._id}`);
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const displayImage = service?.images?.find(
    (image) => image.displayImage === true
  );

  return (
    <div
      className="bg-white rounded-xl overflow-hidden custom-shadow cursor-pointer hover:shadow-xl transition-shadow duration-300 flex"
      onClick={handleNavigateToProductDetails}
    >
      {/* Image Section */}
      <div className="relative w-40 h-52 flex-shrink-0">
        <img
          src={displayImage?.url}
          alt={service?.name}
          className="w-full h-full object-cover"
        />
        {/* Heart Button */}
        <button
          type="button"
          onClick={handleLikeClick}
          className="absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-200"
        >
          <FiHeart
            className={`text-xl transition-colors duration-200 ${
              isLiked ? "fill-red-500 text-red-500" : "text-gray-400"
            }`}
          />
        </button>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        {/* Title */}
        <div>
          <h4 className="font-semibold text-gray-900 text-lg line-clamp-2 leading-snug">
            {service?.name}
          </h4>
        </div>

        {/* Description - optional */}
        <div className="my-2">
          <p className="text-gray-500 text-sm line-clamp-1">
            {service?.description || "Professional service"}
          </p>
        </div>

        <p className="text-lg font-bold text-blue-600">${service?.price}</p>

        {/* Rating and Price */}
        <div className="w-full flex items-center justify-end">
          <div className="flex items-center gap-2">
            <ProductRating productAvgRating={safeAvgRating} />
            <span className="text-xs text-gray-400">
              (
              {service?.avgRating?.oneStar +
                service?.avgRating?.twoStar +
                service?.avgRating?.threeStar +
                service?.avgRating?.fourStar +
                service?.avgRating?.fiveStar || 0}
              )
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
