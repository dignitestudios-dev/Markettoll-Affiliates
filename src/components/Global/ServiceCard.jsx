import React from "react";
import { IoIosStar } from "react-icons/io";
import { FiHeart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ServiceCard = ({ service }) => {
  const navigate = useNavigate();

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
          alt="product"
          className="w-full h-[276px]"
        />
      </div>
      <div className="w-full">
        <h4 className="mt-2.5 font-medium text-base">{service?.name}</h4>
        {/* <p className="my-1 text-sm text-[#9D9D9DDD]">Pick/Delivery</p> */}
        <div className="w-full flex items-center justify-center mt-1">
          <div className="flex items-center gap-1 w-full">
            <IoIosStar className="text-yellow-400 text-lg" />
            <span className="text-base text-[#606060] font-medium">4.3</span>
          </div>
          <p className="text-[18px] font-bold blue-text">
            ${service?.price}.00
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
