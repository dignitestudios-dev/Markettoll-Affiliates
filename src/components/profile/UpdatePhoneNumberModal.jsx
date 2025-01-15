import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import ButtonLoader from "../Global/ButtonLoader";
import VerifyOtpModal from "./VerifyOtpModal";

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
export default UpdatePhoneNumberModal;
