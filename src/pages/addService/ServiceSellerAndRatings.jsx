import React from "react";
import { IoIosStar } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { FaRegStar } from "react-icons/fa6";

const ServiceSellerAndRatings = ({ serviceData }) => {
  const totalRatings =
    serviceData?.sellerDetails?.avgProductRating?.oneStar +
    serviceData?.sellerDetails?.avgProductRating?.twoStar * 2 +
    serviceData?.sellerDetails?.avgProductRating?.threeStar * 3 +
    serviceData?.sellerDetails?.avgProductRating?.fourStar * 4 +
    serviceData?.sellerDetails?.avgProductRating?.fiveStar * 5;
  const totalVotes =
    serviceData?.sellerDetails?.avgProductRating?.oneStar +
    serviceData?.sellerDetails?.avgProductRating?.twoStar +
    serviceData?.sellerDetails?.avgProductRating?.threeStar +
    serviceData?.sellerDetails?.avgProductRating?.fourStar +
    serviceData?.sellerDetails?.avgProductRating?.fiveStar;

  const avgRating = totalVotes > 0 ? totalRatings / totalVotes : 0;

  const fillPercentage = (avgRating / 5) * 100;

  return (
    <div className="w-full">
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1 relative">
          {avgRating === 0 ? (
            <FaRegStar className="text-black text-sm" />
          ) : (
            <IoIosStar
              className="text-yellow-400 text-lg"
              style={{
                clipPath: `polygon(0 0, ${fillPercentage}% 0, ${fillPercentage}% 100%, 0% 100%)`,
              }}
            />
          )}

          <span className="text-sm">{avgRating.toFixed(1)}</span>
        </span>
      </div>
    </div>
  );
};

export default ServiceSellerAndRatings;
