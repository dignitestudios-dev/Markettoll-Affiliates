import React, { useState } from "react";
import { FiEyeOff } from "react-icons/fi";
import { FiEye } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

const SettingsChangePasswordPage = () => {
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleToggleModal = () => {
    setShowModal(!showModal);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleToggleModal();
  };

  return (
    <div className="w-full px-5">
      <h2 className="font-bold text-[28px] blue-text">Change Password</h2>
      <div className="w-full border mt-5 mb-4" />

      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col items-start gap-5"
      >
        <div className="w-full flex flex-col items-start gap-1">
          <label htmlFor="currentPassword" className="text-[13px] font-medium">
            Current Password
          </label>
          <div className="w-full border rounded-2xl px-4 py-3 flex items-center justify-between gap-3">
            <img
              src="/lock-icon.png"
              alt="lock-icon"
              className="w-[11.42px] h-[13.87px]"
            />
            <input
              type={showCurrentPass ? "text" : "password"}
              id="currentPassword"
              className="w-full border-none outline-none text-sm text-[#5c5c5c]"
              placeholder="Current Password"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPass(!showCurrentPass)}
            >
              {showCurrentPass ? (
                <FiEye className="text-base text-[#5c5c5c]" />
              ) : (
                <FiEyeOff className="text-base text-[#5c5c5c]" />
              )}
            </button>
          </div>
        </div>
        <div className="w-full flex flex-col items-start gap-1">
          <label htmlFor="newPassword" className="text-[13px] font-medium">
            New Password
          </label>
          <div className="w-full border rounded-2xl px-4 py-3 flex items-center justify-between gap-3">
            <img
              src="/lock-icon.png"
              alt="lock-icon"
              className="w-[11.42px] h-[13.87px]"
            />
            <input
              type={showNewPass ? "text" : "password"}
              id="newPassword"
              className="w-full border-none outline-none text-sm text-[#5c5c5c]"
              placeholder="New Password"
            />
            <button type="button" onClick={() => setShowNewPass(!showNewPass)}>
              {showNewPass ? (
                <FiEye className="text-base text-[#5c5c5c]" />
              ) : (
                <FiEyeOff className="text-base text-[#5c5c5c]" />
              )}
            </button>
          </div>
        </div>
        <div className="w-full flex flex-col items-start gap-1">
          <label htmlFor="confirmPassword" className="text-[13px] font-medium">
            Confirm Password
          </label>
          <div className="w-full border rounded-2xl px-4 py-3 flex items-center justify-between gap-3">
            <img
              src="/lock-icon.png"
              alt="lock-icon"
              className="w-[11.42px] h-[13.87px]"
            />
            <input
              type={showConfirmPass ? "text" : "password"}
              id="confirmPassword"
              className="w-full border-none outline-none text-sm text-[#5c5c5c]"
              placeholder="Confirm Password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPass(!showConfirmPass)}
            >
              {showConfirmPass ? (
                <FiEye className="text-base text-[#5c5c5c]" />
              ) : (
                <FiEyeOff className="text-base text-[#5c5c5c]" />
              )}
            </button>
          </div>
        </div>

        <div className="w-full">
          <button
            type="submit"
            className="blue-bg text-white font-bold text-base w-full py-3 rounded-2xl"
          >
            Save
          </button>
        </div>
      </form>
      <DeleteSuccessModal showModal={showModal} onclose={handleToggleModal} />
    </div>
  );
};

export default SettingsChangePasswordPage;

const DeleteSuccessModal = ({ showModal, onclose }) => {
  return (
    showModal && (
      <div className="w-full h-screen fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
        <div className="bg-white w-full lg:w-[440px] h-[209px] p-7 relative rounded-[20px] flex flex-col items-center justify-center gap-2">
          <button
            type="button"
            onClick={onclose}
            className="bg-gray-200 w-6 h-6 rounded-full p-1 absolute top-5 right-5"
          >
            <IoClose className="w-full h-full" />
          </button>
          <div className="rounded-full blue-bg h-[69px] w-[69px] p-3">
            <FaCheck className="text-white w-full h-full" />
          </div>
          <span className="text-lg blue-text font-bold">Password Changed</span>
          <span className="text-[#000000]">Password changed successfully</span>
        </div>
      </div>
    )
  );
};
