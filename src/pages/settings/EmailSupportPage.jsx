import React from "react";
import { Link } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";

const EmailSupportPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div className="w-full px-5">
      <div className="flex items-center gap-2">
        <Link to="/settings/support-request">
          <GoArrowLeft className="text-2xl" />
        </Link>
        <h2 className="font-bold text-[28px] blue-text">Email Support</h2>
      </div>
      <div className="w-full border mt-5 mb-4" />

      <form onSubmit={handleSubmit} className="w-full">
        <div className="w-full flex flex-col items-start gap-1">
          <label htmlFor="title" className="text-[13px] font-medium">
            Title
          </label>
          <input
            type="text"
            placeholder="Enter Title"
            required
            className="border rounded-2xl px-4 py-3 text-sm text-[#5c5c5c] w-full outline-none"
          />
        </div>
        <div className="w-full flex flex-col items-start gap-1 my-5">
          <textarea
            name="description"
            id="description"
            placeholder="Description"
            required
            rows={7}
            className="border rounded-2xl px-4 py-3 text-sm text-[#5c5c5c] w-full outline-none"
          ></textarea>
        </div>

        <button
          type="submit"
          className="blue-bg text-white py-3 text-base font-bold rounded-2xl w-full"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default EmailSupportPage;
