import React, { useState } from "react";
import OrdersReceived from "./OrdersReceived";
import OrdersPlaced from "./OrdersPlaced";

const OrderHistoryList = () => {
  const [state, setState] = useState(false);

  const handleToggleState = () => {
    setState(!state);
  };

  return (
    <div className="w-full p-5 bg-[#F7F7F7] rounded-[20px]">
      <div className="w-full bg-white rounded-[20px] p-5 lg:p-6">
        <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between">
          <h2 className="blue-text font-bold text-[28px]">Order History</h2>
          <div className="flex">
            <button
              type="button"
              onClick={handleToggleState}
              className={`${
                state ? "bg-[#F7F7F7] text-black" : "blue-bg text-white"
              } px-3 py-3 rounded-l-xl text-xs md:text-sm font-bold`}
            >
              Orders Placed
            </button>
            <button
              type="button"
              onClick={handleToggleState}
              className={`${
                !state ? "bg-[#F7F7F7] text-black" : "blue-bg text-white"
              } px-3 py-3 rounded-r-xl text-xs md:text-sm font-bold`}
            >
              Orders Received
            </button>
          </div>
        </div>
        {state ? <OrdersReceived /> : <OrdersPlaced />}
      </div>
    </div>
  );
};

export default OrderHistoryList;
