import React from "react";

const DeleteServiceModal = ({ onclose, ondelete, state }) => {
  return (
    state && (
      <div className="w-full h-screen fixed inset-0 z-50 padding-x flex items-center justify-center bg-[rgba(0,0,0,0.4)]">
        <div className="bg-white p-6 rounded-xl w-full md:w-2/3 lg:w-[340px] flex flex-col items-start gap-1">
          <p className="font-bold text-lg">Delete Post</p>
          <p>Are your sure you want to delete post?</p>
          <div className="w-full flex items-center justify-end gap-4 mt-2">
            <button
              type="button"
              onClick={ondelete}
              className="text-red-500 font-bold text-sm"
            >
              Yes
            </button>
            <button
              type="button"
              onClick={onclose}
              className="text-black font-bold text-sm"
            >
              No
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default DeleteServiceModal;
