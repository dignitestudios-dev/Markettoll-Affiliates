import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import Cookies from "js-cookie";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";

const ReviewProfileForm = () => {
  const navigate = useNavigate();
  const data = JSON.parse(Cookies.get("market-signup")) || null;
  // console.log("Cookies data >>>>>", data);
  const { verificationStatus } = useContext(AuthContext);
  console.log("verificationStatus >>", verificationStatus);

  const handleVerifyEmail = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/users/verify-email-send-email-otp`,
        {},
        {
          headers: {
            Authorization: `Bearer ${data?.token}`,
          },
        }
      );
      console.log("verify email otp res >> ", res);
      if (res.status == 200) {
        navigate("/verify-otp", {
          state: { from: "review-profile", type: "email" },
        });
      } else {
        alert("Something went wrong.");
      }
    } catch (error) {
      console.log("verify email otp err  >> ", error);
    }
  };

  const handleVerifyPhoneNumber = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/users/verify-phone-number-send-sms-otp`,
        {},
        {
          headers: {
            Authorization: `Bearer ${data?.token}`,
          },
        }
      );
      console.log("verify phone otp res >> ", res);
      if (res.status == 200) {
        navigate("/verify-otp", {
          state: { from: "review-profile", type: "phone" },
        });
      } else {
        alert("Something went wrong.");
      }
    } catch (error) {
      console.log("verify phone otp err  >> ", error);
    }
  };

  return (
    <div
      className={`w-full min-h-screen relative flex items-center justify-end p-4 md:p-10`}
      style={{
        backgroundImage: `url('/signup-mockup.png')`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        borderRadius: "30px",
      }}
    >
      <div className="min-h-[100%] w-full lg:w-1/2 rounded-[30px] bg-[#FFFFFFA6] p-4 md:p-8 xl:p-12 flex flex-col items-start justify-between">
        <h2 className={`blue-text text-[36px] font-bold`}>Verification</h2>
        <p className="text-base font-medium">
          Verify your email and phone number
        </p>

        <button
          type="button"
          onClick={handleVerifyEmail}
          className={`w-full flex items-center gap-5 my-5 ${
            verificationStatus.email ? "blue-bg" : "bg-white"
          } rounded-[20px] p-4`}
        >
          <div
            className={`rounded-[20px] ${
              verificationStatus.email ? "bg-white" : "blue-bg"
            } flex items-center justify-center w-[80px] h-[80px]`}
          >
            <MdEmail
              className={`${
                verificationStatus?.email ? "light-blue-text" : "text-white"
              } w-[37px] h-[37px]`}
            />
          </div>
          <div className="flex flex-col justify-center items-start gap-1">
            <h3
              className={`text-[18px] font-bold ${
                verificationStatus?.email ? "text-white" : "text-black"
              }`}
            >
              {data?.name}
            </h3>
            <p
              className={`text-sm ${
                verificationStatus?.email ? "text-white" : "text-[#5C5C5C]"
              }`}
            >
              {data?.email?.value}
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={handleVerifyPhoneNumber}
          className={`w-full flex items-center gap-5 mb-5 ${
            verificationStatus.phone ? "blue-bg" : "bg-white"
          } rounded-[20px] p-4`}
        >
          <div
            className={`rounded-[20px] ${
              verificationStatus.phone ? "bg-white" : "blue-bg"
            } flex items-center justify-center w-[80px] h-[80px]`}
          >
            <img
              src={
                verificationStatus.phone
                  ? "/verify-phone-icon-blue.png"
                  : "/verify-phone-icon.png"
              }
              // src="/verify-phone-icon.png"
              alt="verify-phone-icon"
              className="w-[38px] h-[40px]"
            />
          </div>
          <div className="flex flex-col justify-center items-start gap-1">
            <h3
              className={`text-[18px] font-bold ${
                verificationStatus?.phone ? "text-white" : "text-black"
              }`}
            >
              Phone Number
            </h3>
            <p
              className={`text-sm ${
                verificationStatus?.phone ? "text-white" : "text-[#5C5C5C]"
              }`}
            >{`${data?.phoneNumber?.code}${data?.phoneNumber?.value}`}</p>
          </div>
        </button>

        <button
          type="submit"
          onClick={() => navigate("/identity-verified")}
          disabled={!verificationStatus.email && !verificationStatus.phone}
          className="blue-bg text-white rounded-[20px] text-base font-bold py-3.5 w-full mb-7"
        >
          Next
        </button>

        <p className="text-sm text-center w-full mb-3">
          <span>Already Have An Account? </span>
          <Link to="/login" className="light-blue-text font-bold">
            Login
          </Link>
        </p>

        <p className="text-sm text-center w-full">
          <span>By registering, you accept our </span>
          <Link
            to="/terms-and-conditions"
            className="light-blue-text font-bold"
          >
            Terms & conditions
          </Link>
          <span> & </span>
          <Link to="/privacy-policy" className="light-blue-text font-bold">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ReviewProfileForm;

const AccountVerified = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/login");
    }, 600);

    return () => {};
  }, []);

  return (
    <div
      className={`w-full min-h-screen relative flex items-center justify-end p-4 md:p-10`}
      style={{
        backgroundImage: `url('/signup-mockup.png')`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        borderRadius: "30px",
      }}
    >
      <div className="min-h-[90vh] w-full lg:w-1/2 rounded-[30px] bg-[#FFFFFFA6] p-4 md:p-8 flex flex-col items-center justify-center gap-4 relative text-center">
        <img
          src="/password-update.png"
          alt="password-update"
          className="w-[79.1px] h-[83.59px]"
        />
        <h2 className={`blue-text text-[36px] font-bold`}>Account Verified</h2>
        <p className="text-base font-medium lg:w-[80%]">
          Your password has been Verified successfully!
        </p>
      </div>
    </div>
  );
};
