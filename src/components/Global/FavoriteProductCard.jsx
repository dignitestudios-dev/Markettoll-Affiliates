import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import ProductRating from "./ProductRating";

const FavoriteProductCard = ({ product, handleRemoveFromFavorite }) => {
  const navigate = useNavigate();
  const productAvgRating =
    (product?.avgRating?.oneStar * 1 +
      product?.avgRating?.twoStar * 2 +
      product?.avgRating?.threeStar * 3 +
      product?.avgRating?.fourStar * 4 +
      product?.avgRating?.fiveStar * 5) /
    (product?.avgRating?.oneStar +
      product?.avgRating?.twoStar +
      product?.avgRating?.threeStar +
      product?.avgRating?.fourStar +
      product?.avgRating?.fiveStar);
  const safeAvgRating = isNaN(productAvgRating) ? 0 : productAvgRating;

  const displayImage = product?.productDetails?.images?.find(
    (image) => image.displayImage === true
  );

  const handleNavigateToProductDetails = () => {
    navigate(`/products/${product?._id}`);
  };

  return (
    <div className="bg-white rounded-[20px] p-3 relative w-full custom-shadow cursor-pointer">
      <div className="w-full relative h-[276px] 2xl:h-[320px]">
        <button
          type="button"
          className="absolute z-10 top-4 right-4"
          onClick={() => handleRemoveFromFavorite(product?.productDetails?._id)}
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
          {product?.productDetails?.name}
        </h4>
        <p className="my-1 text-sm text-[#9D9D9DDD]">
          {product?.productDetails?.fulfillmentMethod?.selfPickup
            ? "Pickup"
            : "Delivery"}
        </p>
        <div className="w-full flex items-center justify-center">
          <ProductRating productAvgRating={safeAvgRating} />
          <p className="text-[18px] font-bold blue-text">
            ${product?.productDetails?.price}.00
          </p>
        </div>
      </div>
    </div>
  );
};

export default FavoriteProductCard;
