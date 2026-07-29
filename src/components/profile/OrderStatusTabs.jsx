import React from "react";
import { ORDER_STATUS_TABS } from "./orderTrackingUtils";

const OrderStatusTabs = ({ activeTab, onChange }) => {
  return (
    <div className="relative w-fit mt-5">
      <div className="flex flex-wrap items-center gap-4 md:gap-6 border-b-[1.5px] border-[#CCCCCC]">
        {ORDER_STATUS_TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => onChange(tab)}
              className={`relative whitespace-nowrap text-sm font-semibold leading-[18px] pb-2 -mb-[1.5px] border-b-[1.5px] ${
                isActive
                  ? "text-[#0098EA] border-[#0098EA]"
                  : "text-black border-transparent"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusTabs;
