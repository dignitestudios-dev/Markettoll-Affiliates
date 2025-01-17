import React, { useContext, useState } from "react";
import { FiEyeOff } from "react-icons/fi";
import { FiEye } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import Cookies from "js-cookie";
import ButtonLoader from "../../components/Global/ButtonLoader";

const SettingsDeleteAccountPage = () => {
  const [showPass, setShowPass] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const navigate = useNavigate();
  const { userProfile, user, fetchUserProfile } = useContext(AuthContext);
  const [currentPass, setCurrentPass] = useState("");
  //  `${BASE_URL}/stripe/unsubscribe-paid-plan-stripe`,
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      const unsubscribeResponse = await axios.post(
        `${BASE_URL}/stripe/unsubscribe-paid-plan-stripe`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (unsubscribeResponse?.data?.success) {
        const res = await axios.post(
          `${BASE_URL}/users/delete`,
          {
            password: currentPass,
          },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        console.log("delete account res >>>", res);
        if (res?.status == 200) {
          navigate("/login");
          Cookies.remove("market-signup");
          Cookies.remove("user");
          localStorage.removeItem("user");
          localStorage.removeItem("market-signup");
          fetchUserProfile();
        }
      } else {
        toast.error("Something went wrong while deleting your account.");
      }
    } catch (error) {
      console.log("error deleting account >>>", error?.response?.data);
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-5">
      <h2 className="font-bold text-[28px] blue-text">Delete Account</h2>
      <div className="w-full border mt-5 mb-4" />

      <div className="w-ful">
        <p className="text-[13px] font-medium mb-1">Current Password</p>
        <div className="w-full border rounded-[20px] px-4 h-[50px] flex items-center justify-between">
          <div className="flex items-center justify-start gap-2 w-full">
            <img
              src="/lock-icon.png"
              alt="lock-icon"
              className="w-[11px] h-[13px]"
            />
            <input
              type={showPass ? "text" : "password"}
              value={currentPass}
              onChange={(e) => setCurrentPass(e.target.value)}
              placeholder="Current Password"
              className="h-[50px] px-2 text-sm text-[#5c5c5c] w-full bg-transparent outline-none"
            />
          </div>
          <button type="button" onClick={() => setShowPass(!showPass)}>
            {!showPass ? (
              <FiEye className="text-[#5c5c5c] text-base" />
            ) : (
              <FiEyeOff className="text-[#5c5c5c] text-base" />
            )}
          </button>
        </div>
      </div>

      <p className="text-sm mt-4">
        Deleting your account will remove all of your information from database.
        This cannot be undone.
      </p>

      <div className="mt-4">
        <p className="text-base font-semibold">Note</p>
        <p className="text-sm mt-1">
          You cannot delete your account until all pending orders are fulfilled
          and any remaining balance is withdrawn.
        </p>
      </div>

      <div className="w-full mt-4">
        <button
          type="button"
          disabled={!currentPass}
          onClick={handleDeleteAccount}
          className="bg-[#FF3B30] text-white py-3 rounded-[20px] w-full text-base font-bold disabled:cursor-not-allowed"
        >
          {loading ? <ButtonLoader /> : "Delete Account"}
        </button>
      </div>

      <SuccessModal isDeleted={isDeleted} onclose={handleDeleteAccount} />
    </div>
  );
};

export default SettingsDeleteAccountPage;

const SuccessModal = ({ isDeleted, onclose }) => {
  return (
    isDeleted && (
      <div className="w-full h-screen fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center">
        <div className="bg-white flex flex-col items-center justify-center gap-3 relative w-[440px] h-[212px] rounded-lg">
          <button
            type="button"
            onClick={onclose}
            className="w-6 h-6 rounded-full bg-gray-100 p-1 absolute top-5 right-5"
          >
            <IoClose className="w-full h-full" />
          </button>

          <div className="w-[69.67px] h-[69.67px] blue-bg rounded-full p-3">
            <FaCheck className="w-full h-full text-white" />
          </div>
          <p className="text-lg font-bold blue-text">Account Deleted</p>
          <p className="text-[#5c5c5c] text-base">
            Your account has been deleted successfully
          </p>
        </div>
      </div>
    )
  );
};
