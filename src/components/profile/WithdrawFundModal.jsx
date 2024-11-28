import React, { useContext, useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";

const WithdrawFundModal = ({ showModal, setShowModal, onclick }) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  console.log(user);

  const [amount, setAmount] = useState(0);

  const handleWithdrawFund = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/stripe/payout-from-wallet`,
        { amount },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Withdraw amount res >>>>>>", res);
      handleToggleSuccessModal();
    } catch (error) {
      console.log("withdraw amount error >>>>>>", error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSuccessModal = () => {
    if (showSuccessModal) {
      // Close both modals when success modal is closed
      setShowSuccessModal(false);
      setShowModal(false);
    } else {
      // Open the success modal and keep the withdraw modal open
      setShowSuccessModal(true);
    }
  };

  return (
    showModal && (
      <div className="w-full h-screen fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center">
        <div className="bg-white relative w-full lg:w-[575px] h-[276px] rounded-2xl p-6 flex flex-col items-start justify-center gap-5">
          <button
            type="button"
            onClick={onclick}
            className="w-6 h-6 rounded-full bg-gray-200 p-1 absolute top-4 right-4"
          >
            <IoClose className="w-full h-full" />
          </button>
          <p className="text-lg font-bold">Withdraw Funds</p>

          <div className="w-full flex flex-col items-start gap-1">
            <label htmlFor="amount" className="text-sm font-medium">
              Enter Amount
            </label>
            <div className="w-full border rounded-2xl px-3 flex items-center gap-2">
              <span className="light-blue-text text-sm">$</span>
              <input
                type="text"
                placeholder="200"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full outline-none p-3 text-sm"
              />
            </div>
          </div>

          <div className="w-full">
            <button
              type="button"
              onClick={handleWithdrawFund}
              className="text-white font-bold w-full blue-bg py-3 rounded-2xl"
            >
              {loading ? (
                <div
                  role="status"
                  className="mx-auto flex items-center justify-center"
                >
                  <svg
                    aria-hidden="true"
                    class="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-white"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span class="sr-only">Loading...</span>
                </div>
              ) : (
                "Withdraw"
              )}
            </button>
          </div>
        </div>
        <SuccessModal
          showSuccessModal={showSuccessModal}
          handleClose={handleToggleSuccessModal}
        />
      </div>
    )
  );
};

const SuccessModal = ({ showSuccessModal, handleClose }) => {
  return (
    showSuccessModal && (
      <div className="w-full h-screen fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center">
        <div className="bg-white relative w-full lg:w-[432px] h-auto rounded-2xl px-6 py-10 flex flex-col items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="w-6 h-6 rounded-full bg-gray-200 p-1 absolute top-4 right-4"
          >
            <IoClose className="w-full h-full" />
          </button>
          <div className="rounded-full blue-bg flex items-center justify-center w-[44px] h-[44px]">
            <FaCheck className="text-white text-2xl" />
          </div>
          <p className="text-lg font-bold">Withdraw Successfully!</p>

          <div className="flex flex-col items-center">
            <span className="text-[#959595] text-sm">Amount Withdraw</span>
            <span className="light-blue-text font-bold text-[24px]">
              USD $200
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[#959595] text-sm">Reference ID</span>
            <span className="light-blue-text font-bold text-[14px]">
              9621486393454
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[#959595] text-sm">Name</span>
            <span className="light-blue-text font-bold text-[14px]">
              Olivia James
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[#959595] text-sm">Date</span>
            <span className="light-blue-text font-bold text-[14px]">
              Wed, 10 Jan
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[#959595] text-sm">Type</span>
            <span className="light-blue-text font-bold text-[14px]">
              Withdrawal
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[#959595] text-sm">Description</span>
            <span className="light-blue-text font-bold text-[14px] text-center">
              Direct To Local Bank Account <br /> (**** **** ****499)
            </span>
          </div>
        </div>
      </div>
    )
  );
};

export default WithdrawFundModal;
