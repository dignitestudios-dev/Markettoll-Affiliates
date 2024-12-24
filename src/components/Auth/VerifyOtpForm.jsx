import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/authContext";
import ButtonLoader from "../Global/ButtonLoader";

const VerifyOtpForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const previousPage = location.state?.from || "/";
  const verificationType = location.state?.type;
  const { setVerificationStatus } = useContext(AuthContext);
  const data = JSON.parse(localStorage.getItem("user")) || null;
  const { user } = useContext(AuthContext);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleOtpChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const updatedOtp = [...otp];
      updatedOtp[index] = value;
      setOtp(updatedOtp);

      if (value && index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleOtpPaste = (e) => {
    const pastedData = e.clipboardData.getData("Text").slice(0, 4);
    if (/^\d{4}$/.test(pastedData)) {
      const updatedOtp = [...pastedData];
      setOtp(updatedOtp);

      document.getElementById(`otp-3`).focus();
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
      setLoading(true);
      const endpoint =
        verificationType === "email"
          ? `${BASE_URL}/users/verify-email-verify-email-otp`
          : verificationType === "forgot-password"
          ? `${BASE_URL}/users/forgot-password-verify-email-otp`
          : `${BASE_URL}/users/verify-phone-number-verify-sms-otp`;
      try {
        const res = await axios.post(
          endpoint,
          { otp: otp.join(""), email: location?.state?.email },
          {
            headers: {
              Authorization: `Bearer ${data?.token}`,
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
          navigate("/update-password", {
            state: { email: location?.state?.email },
          });
        } else {
          navigate("/review-profile");
        }
      } catch (error) {
        console.error(
          "verify phone OTP error >> ",
          error?.response?.data?.message
        );
        toast.error(error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleResendOtp = async () => {
    if (location?.state?.from === "forgot-password") {
      try {
        const res = await axios.post(
          `${BASE_URL}/users/forgot-password-send-email-otp`,
          { email: location?.state?.email },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        console.log("verify email resend otp res >> ", res);
        toast.success(res?.data?.message);
        setTimer(60);
      } catch (error) {
        console.log("verify email resend otp err  >> ", error);
        toast.error(error?.response?.data?.message);
      }
    } else {
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
        console.log("verify email resend otp res >> ", res);
        toast.success(res?.data?.message);
        setTimer(60);
      } catch (error) {
        console.log("verify email resend otp err  >> ", error);
        toast.error(error?.response?.data?.message);
      }
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
              onKeyDown={(e) => handleOtpKeyDown(e, index)}
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
            className={`light-blue-text font-bold ${
              timer > 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={timer > 0}
          >
            Resend {timer > 0 && `in ${timer}`}
          </button>
        </div>

        <button
          type="submit"
          className="blue-bg text-white rounded-[20px] text-base font-bold py-3.5 w-full cursor-pointer relative h-[50px]"
          disabled={otp.some((digit) => digit === "")}
        >
          {loading ? <ButtonLoader /> : "Verify"}
        </button>
      </form>
    </div>
  );
};

export default VerifyOtpForm;
