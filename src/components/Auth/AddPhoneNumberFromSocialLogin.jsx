import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddPhoneNumberFromSocialLogin = () => {
  const [phone, setPhone] = useState("");
  const { userProfile, fetchUserProfile, user } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [otpModal, setOtpModal] = useState(false);
  const toggleOtpModal = () => {
    setOtpModal(!otpModal);
  };

  const handleAddPhoneNumber = async (e) => {
    e.preventDefault();
    const user2 = JSON.parse(localStorage.getItem("user"));
    if (!phone) {
      setError("Required");
      return;
    } else if (phone?.length < 10 || phone?.length > 10) {
      setError("Phone number must contain 10 digits");
      return;
    }
    try {
      const res = await axios.post(
        `${BASE_URL}/users/update-phone-number-send-sms-otp`,
        {
          phoneNumber: {
            code: 1,
            value: phone,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${user2?.token}`,
          },
        }
      );
      console.log("phone number added res >>>>>", res?.data);
      if (res?.data?.success) {
        setOtpModal(true);
      }
    } catch (error) {
      console.log("error while adding phone number >>>>", error);
    }
  };

  return (
    <>
      <div className="padding-x py-6 w-full">
        <form
          onSubmit={handleAddPhoneNumber}
          className="w-full bg-[#F7F7F7] rounded-[30px] px-6 py-12 relative flex flex-col items-center justify-center gap-5"
        >
          <h2 className="blue-text font-bold text-xl md:text-[28px] mb-5">
            Add Phone Number
          </h2>

          <div className="w-full lg:w-[630px] flex flex-col items-start gap-1">
            <label htmlFor="phone" className="font-medium text-sm">
              Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
              className="w-full rounded-[20px] py-3 px-5 text-sm text-[#5C5C5C] outline-none"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>

          <div className="w-full lg:w-[635px]">
            <button
              type="submit"
              className="blue-bg text-white rounded-[20px] w-full py-3 text-base font-bold"
            >
              Add
            </button>
          </div>
        </form>
      </div>
      <VerifyOtpModal
        otpModal={otpModal}
        onclick={toggleOtpModal}
        phone={phone}
      />
    </>
  );
};

export default AddPhoneNumberFromSocialLogin;

const VerifyOtpModal = ({ otpModal, onclick, phone }) => {
  const [showLoader, setShowLoader] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]); // state to handle OTP digits
  const [timeLeft, setTimeLeft] = useState(60); // timer state
  const { user } = useContext(AuthContext);
  const inputRefs = useRef([]); // for managing input fields
  const navigate = useNavigate();

  // Move focus to the next input after entering a digit
  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return; // Allow only numbers
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // Move focus to next input if current one is filled
    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Start the countdown timer when the modal opens
  useEffect(() => {
    if (otpModal) {
      setTimeLeft(60); // Reset the timer
    }
  }, [otpModal]);

  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft((prev) => prev - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Handle OTP verification
  const handleVerifyOtp = async () => {
    setShowLoader(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/users/update-phone-number-verify-sms-otp`,
        {
          phoneNumber: { code: 1, value: phone },
          otp: otp.join(""), // Joining OTP digits into a string
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      console.log("Phone OTP verified >>>", res);
      if (res?.status == 200) {
        toast.success("Phone number verified successfully");
        navigate("/identity-verified");
      }
      setShowLoader(false);
      // Close modal after verification
      onclick();
    } catch (error) {
      console.log("Error while phone OTP verification >>>", error);
      toast.error("Somthing went wrong");
      setShowLoader(false);
    }
  };

  // Handle Resend OTP
  const handleResendOtp = async () => {
    try {
      setOtp(["", "", "", ""]); // Reset OTP
      setTimeLeft(60); // Reset timer
      const res = await axios.post(
        `${BASE_URL}/users/resend-otp`,
        { phoneNumber: { code: 1, value: phone } },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      console.log("OTP resent >>>", res);
    } catch (error) {
      console.log("Error while resending OTP >>>", error);
    }
  };

  return (
    otpModal && (
      <div className="w-full h-screen fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center px-4">
        <div className="w-full lg:w-[487px] h-[323px] flex flex-col items-center justify-center gap-4 relative bg-white rounded-[12px] p-5">
          <button
            type="button"
            onClick={onclick}
            className="w-6 h-6 rounded-full p-1 bg-[#F7F7F7] absolute top-4 right-4"
          >
            <IoClose className="w-full h-full" />
          </button>
          <div className="w-[80%] flex flex-col text-center gap-2 items-center justify-center">
            <p className="blue-text text-[20px] font-bold">Verification</p>
            <p className="leading-[15.6px] text-[#5C5C5C] text-[13px]">
              Please enter the verification code sent to your new phone number:
              +1 {phone}.
            </p>
          </div>
          {showLoader ? (
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-[80px] h-[80px] mt-4 text-gray-200 animate-spin fill-[#0098EA]"
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
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            <>
              <div className="w-[80%] flex text-center gap-4 items-start justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)}
                    className="bg-[#F7F7F7] w-[50px] text-center h-[50px] outline-none border rounded-[15px] text-sm"
                    placeholder=""
                    maxLength={1}
                    ref={(el) => (inputRefs.current[index] = el)}
                  />
                ))}
              </div>
              <p className="text-[13px] text-[#5C5C5C]">
                Didn’t receive OTP code?{" "}
                <button
                  type="button"
                  className="light-blue-text font-bold"
                  onClick={handleResendOtp}
                >
                  Resend now
                </button>
              </p>
              <p className="text-[13px] text-[#5C5C5C]">
                Time remaining: {timeLeft}s
              </p>
              <button
                className="w-[80%] w-full py-3 rounded-[15px] blue-bg text-white font-semibold mt-4"
                type="button"
                onClick={handleVerifyOtp}
              >
                Verify
              </button>
            </>
          )}
        </div>
      </div>
    )
  );
};
