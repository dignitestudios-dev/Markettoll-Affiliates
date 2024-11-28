import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { FaArrowLeftLong } from "react-icons/fa6";
import Cookies from "js-cookie";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/authContext";

const validate = () => {
  const errors = {};
  if (otp.some((digit) => digit === "")) {
    errors.otp = "Please fill all digits.";
  }
  return errors;
};

const VerifyOtpForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const previousPage = location.state?.from || "/";
  const verificationType = location.state?.type;
  console.log("verificationType >>>", verificationType);
  const { setVerificationStatus } = useContext(AuthContext);

  const { user } = useContext(AuthContext);
  const userEmail = JSON.parse(Cookies.get("user-email"));

  const [otp, setOtp] = useState(["", "", "", ""]);

  const handleOtpChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const updatedOtp = [...otp];
      updatedOtp[index] = value;
      setOtp(updatedOtp);

      // Automatically move focus to the next input
      if (value && index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleOtpPaste = (e) => {
    const pastedData = e.clipboardData.getData("Text").slice(0, 4);
    if (/^\d{4}$/.test(pastedData)) {
      setOtp([...pastedData]);
    }
  };

  const handleNavigateToBack = () => {
    if (previousPage === "verify-otp") {
      navigate("/forgot-password");
    } else if (previousPage === "review-profile") {
      navigate("/review-profile");
    } else if (previousPage === "forgot-password") {
      navigate("/forgot-password");
    } else {
      navigate("/");
    }
  };

  const validate = () => {
    const errors = {};
    if (otp.some((digit) => digit === "")) {
      errors.otp = "Please fill all digits.";
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {},
    validate,
    onSubmit: async (_, { resetForm }) => {
      const endpoint =
        verificationType === "email"
          ? `${BASE_URL}/users/verify-email-verify-email-otp`
          : verificationType === "forgot-password"
          ? `${BASE_URL}/users/forgot-password-verify-email-otp`
          : `${BASE_URL}/users/verify-phone-number-verify-sms-otp`;
      try {
        const res = await axios.post(
          endpoint,
          { otp: otp.join(""), email: userEmail },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("verify phone OTP response >> ", res.data);
        resetForm();
        setOtp(["", "", "", ""]);
        toast.success(res?.data?.message);
        setVerificationStatus((prev) => ({
          ...prev,
          [verificationType]: true,
        }));
        if (previousPage == "forgot-password") {
          navigate("/update-password");
        } else {
          navigate("/review-profile");
        }
      } catch (error) {
        console.error(
          "verify phone OTP error >> ",
          error?.response?.data?.message
        );
        toast.error(error?.response?.data?.message);
      }
    },
  });

  const handleResendOtp = async () => {
    const endpoint =
      verificationType === "email"
        ? `${BASE_URL}/users/verify-email-send-email-otp`
        : `${BASE_URL}/users/verify-phone-number-send-sms-otp`;

    try {
      const res = await axios.post(
        endpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      console.log("verify email otp res >> ", res);
      toast.success(res?.data?.message);
    } catch (error) {
      console.log("verify email otp err  >> ", error);
    }
  };

  return (
    <div
      className="w-full min-h-screen relative flex items-center justify-end p-4 md:p-10"
      style={{
        backgroundImage: `url('/signup-mockup.png')`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        borderRadius: "30px",
      }}
    >
      <form
        onSubmit={formik.handleSubmit}
        className="min-h-[90vh] w-full lg:w-1/2 rounded-[30px] bg-[#FFFFFFA6] p-4 md:p-8 xl:p-12 flex flex-col items-start justify-center gap-4 relative"
        onPaste={handleOtpPaste}
      >
        <button
          type="button"
          onClick={handleNavigateToBack}
          className="absolute top-5 left-4 md:left-8"
        >
          <img
            src="/left-arrow-icon.png"
            alt="left arrow icon"
            className="w-[35px]"
          />
        </button>
        <h2 className="blue-text text-[36px] font-bold">Verification</h2>
        <p className="text-base font-medium lg:w-[90%]">
          Please enter the code that we sent to your email.
        </p>

        <div className="w-full flex items-center justify-between mt-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleOtpChange(e.target.value, index)}
              className="bg-[#fff] outline-none w-[60.5px] h-[60.5px] p-4 rounded-[20px] text-center blue-text text-[36px] font-bold"
            />
          ))}
        </div>
        {formik.errors.otp && (
          <div className="text-xs text-red-500">{formik.errors.otp}</div>
        )}

        <div className="w-full text-sm flex items-center gap-2">
          <p>Don’t Receive the Code? </p>
          <button
            type="button"
            onClick={handleResendOtp}
            className="light-blue-text font-bold"
          >
            Resend Now
          </button>
        </div>

        <button
          type="submit"
          className="blue-bg text-white rounded-[20px] text-base font-bold py-3.5 w-full"
          disabled={otp.some((digit) => digit === "")}
        >
          Verify
        </button>
      </form>
    </div>
  );
};

export default VerifyOtpForm;
