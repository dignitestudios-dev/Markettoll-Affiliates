import React from "react";
import { IoIosStar } from "react-icons/io";
import { FiHeart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import ProductRating from "./ProductRating";

const ServiceCard = ({ service }) => {
  const navigate = useNavigate();
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

  const displayImage = service?.images?.find(
    (image) => image.displayImage === true
  );

  return (
    <div
      className="bg-white rounded-[20px] p-3 relative w-full custom-shadow cursor-pointer"
      onClick={handleNavigateToProductDetails}
    >
      <div className="w-full relative h-[276px]">
        <button type="button" className="absolute z-10 top-4 right-4">
          <FiHeart className="text-white text-2xl" />
        </button>
        <img
          src={displayImage?.url}
          alt={service?.name}
          className="w-full h-[276px]"
        />
      </div>
      <div className="w-full">
        <h4 className="mt-2.5 font-medium text-base">{service?.name}</h4>
        <div className="w-full flex items-center justify-between mt-1">
          <ProductRating productAvgRating={safeAvgRating} />
          <p className="text-[18px] font-bold blue-text">
            ${service?.price}.00
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
