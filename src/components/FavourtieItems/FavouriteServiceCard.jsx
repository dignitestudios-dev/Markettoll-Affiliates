import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import ProductRating from "../Global/ProductRating";
// import ProductRating from "./ProductRating";

const FavoriteServiceCard = ({ service, handleRemoveFromFavorite }) => {
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

  const displayImage = service?.serviceDetails?.images?.find(
    (image) => image.displayImage === true
  );
  console.log("service >>>>", service);

  const handleNavigateToProductDetails = () => {
    navigate(`/services/${service?.serviceDetails?._id}`);
  };

  return (
    <div className="bg-white rounded-[20px] p-3 relative w-full custom-shadow cursor-pointer">
      <div className="w-full relative h-[276px] 2xl:h-[320px]">
        <button
          type="button"
          className="absolute z-10 top-4 right-4"
          onClick={() => handleRemoveFromFavorite(service?.serviceDetails?._id)}
        >
          <FaHeart className="text-white text-2xl" />
        </button>
        <img
          src={displayImage?.url}
          alt="product"
          className="w-full h-[276px] 2xl:h-[320px]"
          onClick={handleNavigateToProductDetails}
        />
      </div>
      <div className="w-full" onClick={handleNavigateToProductDetails}>
        <h4 className="mt-2 font-medium text-base">
          {service?.serviceDetails?.name}
        </h4>
        <p className="my-1 text-sm text-[#9D9D9DDD]">
          {service?.serviceDetails?.fulfillmentMethod?.selfPickup
            ? "Pickup"
            : "Delivery"}
        </p>
        <div className="w-full flex items-center justify-between">
          <ProductRating productAvgRating={safeAvgRating} />
          <p className="text-[18px] font-bold blue-text">
            ${service?.serviceDetails?.price}.00
          </p>
        </div>
      </div>
    </div>
  );
};

export default FavoriteServiceCard;
