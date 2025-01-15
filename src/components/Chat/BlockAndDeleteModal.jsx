import React from "react";

const BlockAndDeleteModal = ({ state, onclose }) => {
  return (
    state && (
      <div
        className={`w-full h-screen fixed inset-0 z-50 flex items-center justify-center padding-x py-6 bg-[rgba(0,0,0,0.4)]`}
      >
        <div className="bg-white p-6 rounded-xl w-full md:w-[330px] h-[133px] relative">
          <p className="text-[17px] font-semibold">{"Delete Chat"}</p>
          <p className="">{"Are you sure you want to delete chat?"}</p>
          <div className="w-full flex items-center justify-end gap-3 mt-4">
            <button
              type="button"
              //   onClick={onclose}
              className="text-[13px] font-semibold text-[#FF3B30]"
            >
              Yes
            </button>
            <button
              type="button"
              onClick={onclose}
              className="text-[13px] font-semibold text-[#000]"
            >
              No
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default BlockAndDeleteModal;
