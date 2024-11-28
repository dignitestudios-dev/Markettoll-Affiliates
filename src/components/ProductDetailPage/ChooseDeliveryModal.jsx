import React from "react";
import { GiCardPickup } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

const ChooseDeliveryModal = ({
  showPopup,
  handleShowPopup,
  fulfillmentMethod,
  setFulfillmentMethod,
  handleSelectFulfillmentMethod,
}) => {
  const handlePickupClick = () => {
    handleSelectFulfillmentMethod({ selfPickup: true, delivery: false });
  };

  const handleDeliveryClick = () => {
    handleSelectFulfillmentMethod({ selfPickup: false, delivery: true });
  };

  return (
    showPopup && (
      <div className="w-full h-screen z-50 fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center">
        <div className="w-[440px] h-[225px] bg-white rounded-[15px] p-8 relative flex flex-col items-start justify-center gap-3">
          <button
            type="button"
            onClick={handleShowPopup}
            className="w-6 h-6 rounded-full bg-[#F2F2F2] absolute top-4 right-4 p-1"
          >
            <IoClose className="w-full h-full" />
          </button>

          <h2 className="text-lg font-bold blue-text">Select type</h2>

          <button
            type="button"
            onClick={handlePickupClick}
            className="w-full bg-[#F2F2F2] p-3 rounded-xl flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div className="w-[32px] h-[32px] rounded-full blue-bg p-1.5">
                <GiCardPickup className="w-full h-full text-white" />
              </div>
              <span className="text-sm font-medium">Pickup</span>
            </div>
            <MdOutlineKeyboardArrowRight className="text-xl" />
          </button>

          <button
            type="button"
            onClick={handleDeliveryClick}
            className="w-full bg-[#F2F2F2] p-3 rounded-xl flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div className="w-[32px] h-[32px] rounded-full blue-bg p-1.5">
                <img
                  src="/truck-icon.png"
                  alt="truck-icon"
                  className="w-full h-full"
                />
              </div>
              <span className="text-sm font-medium">Delivery</span>
            </div>
            <MdOutlineKeyboardArrowRight className="text-xl" />
          </button>
        </div>
      </div>
    )
  );
};

export default ChooseDeliveryModal;
