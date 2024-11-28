import React from "react";

const SettingsAddressDeleteModal = ({ showModal, onclose }) => {
  return (
    showModal && (
      <div className="w-full h-screen fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
        <div className="bg-white w-full lg:w-[440px] p-7 relative rounded-[20px] flex flex-col items-start justify-center gap-2">
          <span className="text-lg blue-text font-bold">Delete address</span>
          <span className="text-[#000000]">
            Are you sure you want to Delete Addreess?
          </span>
          <div className="w-full flex justify-end items-center gap-4">
            <button
              type="button"
              onClick={onclose}
              className="text-sm font-semibold text-red-500"
            >
              Yes
            </button>
            <button
              type="button"
              onClick={onclose}
              className="text-sm font-semibold"
            >
              No
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default SettingsAddressDeleteModal;
