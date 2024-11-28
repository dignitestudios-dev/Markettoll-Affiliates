import React from "react";
import { IoIosStar } from "react-icons/io";
import { Link } from "react-router-dom";

const ProductSeller = ({ productData }) => {
  return (
    <div className="w-full">
      <p className="blue-text text-sm font-bold mb-3">Seller</p>
      <div className="flex items-center gap-2">
        <img
          src={
            productData?.sellerDetails
              ? productData?.sellerDetails?.profileImage
              : "/seller-profile-img.png"
          }
          alt="seller profile image"
          className="w-[68px] h-[68px] rounded-full bg-cover"
        />
        <div className="flex flex-col items-start">
          <span className="text-[#676767] text-[13px] font-normal">
            Posted By
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[18px] font-medium">
              {productData?.sellerDetails?.name}
            </span>
            {/* <span className="flex items-center gap-1">
              <IoIosStar className="text-yellow-400" /> 4.8
            </span> */}
          </div>
          <Link
            to={`/seller-profile/${productData?.sellerDetails?._id}`}
            className="text-[13px] font-semibold underline"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductSeller;
