import React, { useState } from "react";
import OrdersReceived from "./OrdersReceived";
import OrdersPlaced from "./OrdersPlaced";

const OrderHistoryList = () => {
  const [showReceived, setShowReceived] = useState(false);

  return (
    <div className="w-full p-5 bg-[#F7F7F7] rounded-[30px]">
      <div className="w-full bg-white rounded-[18px] p-5 lg:p-7">
        <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h2 className="text-[#003DAC] font-bold text-[28px] leading-[35px] tracking-tight capitalize">
            Order Tracking
          </h2>
          <div className="flex shrink-0">
            <button
              type="button"
              onClick={() => setShowReceived(false)}
              className={`${
                !showReceived
                  ? "bg-[#0098EA] text-white font-bold"
                  : "bg-[#F7F7F7] text-black font-medium"
              } px-4 py-3 rounded-l-[20px] text-sm md:text-base capitalize min-w-[140px] text-center`}
            >
              orders placed
            </button>
            <button
              type="button"
              onClick={() => setShowReceived(true)}
              className={`${
                showReceived
                  ? "bg-[#0098EA] text-white font-bold"
                  : "bg-[#F7F7F7] text-black font-medium"
              } px-4 py-3 rounded-r-[20px] text-sm md:text-base capitalize min-w-[140px] text-center`}
            >
              orders received
            </button>
          </div>
        </div>

        {showReceived ? <OrdersReceived /> : <OrdersPlaced />}
      </div>
    </div>
  );
};

export default OrderHistoryList;
