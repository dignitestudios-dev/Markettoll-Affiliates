import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import ButtonLoader from "../Global/ButtonLoader";

const PersonalInfo = () => {
  const [openNameModal, setOpenNameModal] = useState(false);
  const { user, userProfile } = useContext(AuthContext);
  const [openProfileImageModal, setOpenProfileImageModal] = useState(false);
  const [username, setUsername] = useState(userProfile?.name || "");
  const [phoneNumber, setPhoneNumber] = useState(
    userProfile?.phoneNumber?.value
  );

  const handleToggleNameModal = () => {
    setOpenNameModal(!openNameModal);
  };
  const [openPhoneModal, setOpenPhoneModal] = useState(false);
  const handleTogglePhoneModal = () => {
    setOpenPhoneModal(!openPhoneModal);
  };

  const toggleProfileImageModal = () => [
    setOpenProfileImageModal(!openProfileImageModal),
  ];
  return (
    <div className="w-full bg-[#F7F7F7] p-4 rounded-[30px]">
      <div className="w-full bg-white rounded-[30px] p-5">
        <div>
          <Link
            to="/"
            className="text-sm text-[#5C5C5C] flex items-center justify-start gap-1"
          >
            <GoArrowLeft className="text-xl light-blue-text" />
            Back
          </Link>
        </div>
        <h2 className="text-[18px] font-semibold my-4">Personal Information</h2>

        <div className="w-full border" />

        <div className="w-full flex items-center justify-start gap-4 mt-4">
          <div className="flex flex-col items-center gap-2">
            <img
              src={userProfile?.profileImage}
              alt="personal-info-img"
              className="w-[69px] md:w-[129px] h-[69px] md:h-[129px] rounded-full object-cover"
            />
            <button
              type="button"
              onClick={toggleProfileImageModal}
              className="text-sm font-medium blue-text underline pb-0.5"
            >
              Edit Photo
            </button>
          </div>
          <div className="flex flex-col items-start justify-start mb-3 gap-1">
            <span className="font-bold text-[20px]">{userProfile?.name}</span>
            <span className="text-sm text-[#5C5C5C]">
              {userProfile?.email?.value}
            </span>
          </div>
        </div>
        <div className="w-full lg:w-[715px] bg-[#F7F7F7] rounded-[24px] p-4 md:p-8 mt-5">
          <div className="w-full">
            <div className="flex items-center justify-between">
              <label htmlFor="name" className="text-sm">
                Name
              </label>
              <button
                type="button"
                onClick={handleToggleNameModal}
                className="text-sm light-blue-text underline pb-0.5"
              >
                Edit
              </button>
            </div>
            <input
              type="text"
              value={userProfile?.name}
              disabled
              className="bg-white p-3.5 outline-none rounded-[15px] w-full text-sm"
              placeholder="John Smith"
            />
          </div>
          <div className="w-full mt-3">
            <div className="flex items-center justify-between">
              <label htmlFor="phoneNumber" className="text-sm">
                Phone Number
              </label>
              <button
                type="button"
                onClick={handleTogglePhoneModal}
                className="text-sm light-blue-text underline pb-0.5"
              >
                Edit
              </button>
            </div>
            <input
              type="text"
              disabled
              value={userProfile?.phoneNumber?.value}
              className="bg-white p-3.5 outline-none rounded-[15px] w-full text-sm"
              placeholder="+1 000 000 0000"
            />
          </div>
        </div>
      </div>
      <UpdateNameModal
        openNameModal={openNameModal}
        onclick={handleToggleNameModal}
      />
      <UpdatePhoneNumberModal
        openPhoneModal={openPhoneModal}
        onclick={handleTogglePhoneModal}
      />
      <UpdateProfileImage
        openProfileImageModal={openProfileImageModal}
        onclick={toggleProfileImageModal}
      />
    </div>
  );
};

export default PersonalInfo;

const UpdateNameModal = ({ openNameModal, onclick }) => {
  const { user, userProfile, fetchUserProfile } = useContext(AuthContext);
  const [name, setName] = useState(userProfile?.name || "");
  const [loading, setLoading] = useState(false);

  const handleUpdateName = async () => {
    const savedUser = JSON.parse(localStorage.getItem("user"));

    setLoading(true);
    try {
      const res = await axios.put(
        `${BASE_URL}/users/name`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      fetchUserProfile();
      savedUser.name = res?.data?.data;
      // Cookies.set("user", JSON.stringify(savedUser));
      toast.success("Name updated");
      onclick();
    } catch (error) {
      console.log("update name error >>>>", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    openNameModal && (
      <div className="w-full h-screen fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center px-4">
        <div className="w-full lg:w-[487px] h-[323px] flex flex-col items-center justify-center gap-4 relative bg-white rounded-[12px]">
          <button
            type="button"
            onClick={onclick}
            className="w-6 h-6 rounded-full p-1 bg-[#F7F7F7] absolute top-4 right-4"
          >
            <IoClose className="w-full h-full" />
          </button>
          <div className="w-[80%] flex flex-col text-center gap-2 items-center justify-center">
            <p className="blue-text text-[20px] font-bold">Update Name</p>
            <p className="leading-[15.6px] text-[#5C5C5C] text-[13px]">
              Please enter your new name below. This will help us update your
              profile accordingly.
            </p>
          </div>
          <div className="w-[80%] flex flex-col text-center gap-1 items-start justify-center">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white p-3.5 outline-none border rounded-[15px] w-full text-sm"
              placeholder="John Smith"
            />
            <button
              className="w-full w-ful py-3 rounded-[15px] blue-bg text-white font-semibold mt-4 h-[50px]"
              type="button"
              onClick={handleUpdateName}
            >
              {loading ? <ButtonLoader /> : "Update"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

const UpdatePhoneNumberModal = ({ openPhoneModal, onclick }) => {
  const [otpModal, setOtpModal] = useState(false);
  const { userProfile } = useContext(AuthContext);

  const handleOtpModal = () => {
    setOtpModal(!otpModal);
  };
  const { user } = useContext(AuthContext);
  const [phone, setPhone] = useState(userProfile?.phoneNumber?.value || "");
  const [loading, setLoading] = useState(false);

  const handleUpdatePhoneNumber = async () => {
    setLoading(true);
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
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("update phone res >>>>>", res?.data);
      if (res?.data?.success) {
        handleOtpModal();
        // onclick();
        localStorage.setItem("phone", phone);
        // toast.success(res?.data?.message);
      }
    } catch (error) {
      console.log("update phone number error >>>>", error);
      toast.error(error?.response?.data?.message);
      onclick();
    } finally {
      setLoading(false);
    }
  };

  return (
    openPhoneModal && (
      <div className="w-full h-screen fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center px-4">
        <div className="w-full lg:w-[487px] h-[323px] flex flex-col items-center justify-center gap-4 relative bg-white rounded-[12px]">
          <button
            type="button"
            onClick={onclick}
            className="w-6 h-6 rounded-full p-1 bg-[#F7F7F7] absolute top-4 right-4"
          >
            <IoClose className="w-full h-full" />
          </button>
          <div className="w-[80%] flex flex-col text-center gap-2 items-center justify-center">
            <p className="blue-text text-[20px] font-bold">Update Number</p>
            <p className="leading-[15.6px] text-[#5C5C5C] text-[13px]">
              Enter your new phone number below. We will send a verification
              code to this number for confirmation.
            </p>
          </div>
          <div className="w-[80%] flex flex-col text-center gap-1 items-start justify-center">
            <label htmlFor="phoneNumber" className="text-sm font-medium">
              New Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-white p-3.5 outline-none border rounded-[15px] w-full text-sm"
              placeholder="+1 000 000 0000"
            />
            <button
              className="w-full w-ful py-3 rounded-[15px] blue-bg text-white font-semibold mt-4 h-[50px]"
              type="button"
              onClick={handleUpdatePhoneNumber}
            >
              {loading ? <ButtonLoader /> : "Update"}
            </button>
          </div>
        </div>
        <VerifyOtpModal
          otpModal={otpModal}
          onclick={handleOtpModal}
          onclick2={onclick}
        />
      </div>
    )
  );
};

const UpdateProfileImage = ({ openProfileImageModal, onclick }) => {
  const { user, fetchUserProfile } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpdateProfileImage = async () => {
    // const savedUser = JSON.parse(localStorage.getItem("user"));

    setLoading(true);
    const formData = new FormData();
    formData.append("profileImage", image);
    try {
      const res = await axios.put(`${BASE_URL}/users/profile-image`, formData, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      console.log("update image res >>>>>", res?.data);
      if (res?.data?.success) {
        fetchUserProfile();
        toast.success(res?.data?.message);
        onclick();
      }

      // toast.success("Name updated");
    } catch (error) {
      console.log("update name error >>>>", error);
      toast.error("Something went wrong");
      onclick();
    } finally {
      setLoading(false);
    }
  };
  return (
    openProfileImageModal && (
      <div className="w-full h-screen fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center px-4">
        <div className="w-full lg:w-[487px] h-[323px] flex flex-col items-center justify-center gap-4 relative bg-white rounded-[12px]">
          <button
            type="button"
            onClick={onclick}
            className="w-6 h-6 rounded-full p-1 bg-[#F7F7F7] absolute top-4 right-4"
          >
            <IoClose className="w-full h-full" />
          </button>
          <div className="w-[80%] flex flex-col text-center gap-2 items-center justify-center">
            <p className="blue-text text-[20px] font-bold">
              Update Profile Image
            </p>
          </div>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-[150px] h-[150px] border-2 border-gray-400 border-dashed rounded-full cursor-pointer bg-white hover:bg-gray-100"
            >
              <div class="flex flex-col items-center justify-center w-full h-full rounded-full">
                {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt=""
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <img
                    src="/upload-profile-image-icon.png"
                    alt=""
                    className="h-[40px] w-[43.1px]"
                  />
                )}
              </div>
              <input
                onChange={(e) => setImage(e.target.files[0])}
                id="dropzone-file"
                type="file"
                className="hidden"
              />
            </label>
          </div>
          <div className="w-[80%] flex flex-col text-center gap-1 items-start justify-center">
            <button
              className="w-full w-ful py-3 rounded-[15px] blue-bg text-white font-semibold mt-4 h-[50px]"
              type="button"
              onClick={handleUpdateProfileImage}
            >
              {loading ? <ButtonLoader /> : "Update"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

const VerifyOtpModal = ({ otpModal, onclick, onclick2 }) => {
  const [showLoader, setShowLoader] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60);
  const { user, fetchUserProfile } = useContext(AuthContext);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  useEffect(() => {
    if (otpModal) {
      setTimeLeft(60);
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

  const handleVerifyOtp = async () => {
    setShowLoader(true);
    const phone = localStorage.getItem("phone");
    try {
      const res = await axios.post(
        `${BASE_URL}/users/update-phone-number-verify-sms-otp`,
        {
          phoneNumber: { code: 1, value: phone },
          otp: otp.join(""),
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      // console.log("Phone OTP verified >>>", res);
      if (res?.status == 200) {
        onclick2();
        onclick();
        toast.success("Phone number verified successfully");
        fetchUserProfile();
      }
    } catch (error) {
      console.log("Error while phone OTP verification >>>", error);
      toast.error("Somthing went wrong");
    } finally {
      setShowLoader(false);
    }
  };

  // Handle Resend OTP
  const handleResendOtp = async () => {
    try {
      setOtp(["", "", "", ""]);
      setTimeLeft(60);
      const res = await axios.post(
        `${BASE_URL}/users/resend-otp`,
        { phoneNumber: { code: 1, value: phone } },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      // console.log("OTP resent >>>", res);
      toast.success("OTP sent");
    } catch (error) {
      console.log("Error while resending OTP >>>", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
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
              +1.
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
                className="lg:w-[80%] w-full py-3 rounded-[15px] blue-bg text-white font-semibold mt-4"
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
