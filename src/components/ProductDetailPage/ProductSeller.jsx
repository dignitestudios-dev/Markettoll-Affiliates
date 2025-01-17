import React from "react";
import { IoIosStar } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { FaRegStar } from "react-icons/fa6";

const ProductSeller = ({ productData }) => {
  const navigate = useNavigate();
  // console.log(productData?.avgRating);
  const handleNavigateToSellerProfile = () => {
    navigate(`/seller-profile/${productData?.seller}`, {
      state: { from: window.location.href },
    });
  };

  const totalRatings =
    productData?.avgRating?.oneStar +
    productData?.avgRating?.twoStar * 2 +
    productData?.avgRating?.threeStar * 3 +
    productData?.avgRating?.fourStar * 4 +
    productData?.avgRating?.fiveStar * 5;
  const totalVotes =
    productData?.avgRating?.oneStar +
    productData?.avgRating?.twoStar +
    productData?.avgRating?.threeStar +
    productData?.avgRating?.fourStar +
    productData?.avgRating?.fiveStar;

  const avgRating = totalVotes > 0 ? totalRatings / totalVotes : 0;

  const fillPercentage = (avgRating / 5) * 100;

  return (
    <div className="w-full">
      <p className="blue-text text-sm font-bold mb-3">Seller</p>
      <div className="flex items-center gap-2">
        <img
          src={
            productData?.sellerDetails?.profileImage
              ? productData?.sellerDetails?.profileImage
              : "https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png"
          }
          alt={productData?.sellerDetails?.name || "Seller Profile Image"}
          className="w-[68px] h-[68px] rounded-full bg-cover"
        />
        <div className="flex flex-col items-start">
          <span className="text-[#676767] text-[13px] font-normal">
            Posted By
          </span>
          <div className="flex items-center gap-3">
            <span className="text-[18px] font-medium">
              {productData?.sellerDetails?.name}
            </span>
            <span className="flex items-center gap-1 relative">
              {avgRating === 0 ? (
                <FaRegStar className="text-black text-sm" />
              ) : (
                <IoIosStar
                  className="text-yellow-400 text-xl absolute inset-0"
                  style={{
                    clipPath: `polygon(0 0, ${fillPercentage}% 0, ${fillPercentage}% 100%, 0% 100%)`,
                  }}
                />
              )}

              <span className="text-sm">{avgRating.toFixed(1)}</span>
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleNavigateToSellerProfile()}
            className="text-[13px] font-semibold underline"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSeller;
