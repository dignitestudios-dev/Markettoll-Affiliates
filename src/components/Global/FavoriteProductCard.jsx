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

  const pDetails = product?.productDetails || product;

  const hasDiscount =
    Boolean(pDetails?.pricing?.discount) ||
    (pDetails?.pricing?.discountedPrice !== undefined &&
      pDetails?.pricing?.originalPrice !== undefined &&
      Number(pDetails?.pricing?.discountedPrice) <
        Number(pDetails?.pricing?.originalPrice));

  const discountType =
    pDetails?.pricing?.discount?.type?.toUpperCase() ||
    (pDetails?.pricing?.discountAmount ? "FIXED_AMOUNT" : "");

  const discountBadgeLabel =
    discountType === "PERCENTAGE"
      ? `${
          pDetails?.pricing?.discount?.value ||
          Math.round(
            ((Number(pDetails?.pricing?.originalPrice) -
              Number(pDetails?.pricing?.discountedPrice)) /
              Number(pDetails?.pricing?.originalPrice)) *
              100
          )
        }% OFF`
      : pDetails?.pricing?.discountAmount || pDetails?.pricing?.discount?.value
      ? `$${
          pDetails?.pricing?.discountAmount ||
          pDetails?.pricing?.discount?.value
        } OFF`
      : hasDiscount &&
        pDetails?.pricing?.originalPrice &&
        pDetails?.pricing?.discountedPrice
      ? `${Math.round(
          ((Number(pDetails?.pricing?.originalPrice) -
            Number(pDetails?.pricing?.discountedPrice)) /
            Number(pDetails?.pricing?.originalPrice)) *
            100
        )}% OFF`
      : "";

  const originalPrice =
    pDetails?.pricing?.originalPrice !== undefined
      ? pDetails.pricing.originalPrice
      : pDetails?.price || "0.0";

  const finalPrice = hasDiscount
    ? pDetails?.pricing?.discountedPrice
    : pDetails?.price || "0.0";

  return (
    <div className="bg-white rounded-[20px] p-3 relative w-full custom-shadow cursor-pointer">
      <div className="w-full relative h-[276px] 2xl:h-[320px]">
        {hasDiscount && (
          <div className="absolute z-10 top-4 left-4 bg-[#E53935] text-white text-xs font-extrabold px-3 py-1 rounded-lg shadow-lg tracking-wide flex items-center gap-1">
            <span>{discountBadgeLabel}</span>
          </div>
        )}

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
        <h4 className="mt-2 font-semibold text-base text-gray-900 truncate" title={product?.productDetails?.name}>
          {product?.productDetails?.name}
        </h4>
        <div className="flex flex-wrap items-center gap-1.5 my-2">
          {/* Fulfillment Tag */}
          <span
            className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
              product?.productDetails?.fulfillmentMethod?.selfPickup
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-blue-50 text-[#003DAC] border-blue-200"
            }`}
          >
            {product?.productDetails?.fulfillmentMethod?.selfPickup
              ? "Pickup"
              : "Delivery"}
          </span>

          {/* Stock Tag */}
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
              Number(pDetails?.quantity ?? 0) > 0
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-rose-50 text-rose-600 border-rose-200"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                Number(pDetails?.quantity ?? 0) > 0
                  ? "bg-emerald-500"
                  : "bg-rose-500"
              }`}
            />
            {Number(pDetails?.quantity ?? 0) > 0
              ? `Stock: ${pDetails?.quantity}`
              : "Out of Stock"}
          </span>

          {/* Sold Tag */}
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-50 text-gray-600 border border-gray-200 flex items-center gap-1">
            Sold: <span className="font-semibold text-gray-900">{pDetails?.quantitySold ?? product?.quantitySold ?? 0}</span>
          </span>
        </div>
        <div className="w-full flex items-center justify-between">
          <ProductRating productAvgRating={safeAvgRating} />
          <div className="flex items-center gap-2">
            <div className="flex items-baseline gap-1.5">
              <p
                className={`text-[19px] font-bold ${
                  hasDiscount ? "text-[#E53935]" : "blue-text"
                }`}
              >
                $
                {Number(finalPrice) % 1 === 0
                  ? `${Number(finalPrice)}.00`
                  : finalPrice}
              </p>
              {hasDiscount && (
                <span className="text-xs text-gray-400 line-through font-medium">
                  $
                  {Number(originalPrice) % 1 === 0
                    ? `${Number(originalPrice)}.00`
                    : originalPrice}
                </span>
              )}
            </div>
            {hasDiscount && (
              <span className="bg-red-50 text-[#E53935] border border-red-200 text-[10px] font-extrabold px-1.5 py-0.5 rounded tracking-wider">
                {discountType === "PERCENTAGE" ? "% OFF" : "FIXED"}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoriteProductCard;
