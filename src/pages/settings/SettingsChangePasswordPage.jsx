import React, { useContext, useState } from "react";
import { FiEyeOff } from "react-icons/fi";
import { FiEye } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { useFormik } from "formik";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";

const validate = (values) => {
  const errors = {};

  if (!values.currentPassword) {
    errors.currentPassword = "Required";
  }

  // if (!values.newPassword) {
  //   errors.newPassword = "Required";
  // } else if (values.newPassword < 8) {
  //   errors.newPassword = "Password must be 8 characters";
  // } else if (!/(?=.*[a-z])(?=.*[A-Z])/.test(values.newPassword)) {
  //   errors.newPassword =
  //     "Password must contain at least one uppercase letter and one lowercase letter";
  // }

  if (!values.newPassword) {
    errors.newPassword = "Required";
  } else if (values.newPassword.length < 8) {
    errors.newPassword = "Password must be at least 8 characters";
  } else if (!/(?=.*[a-z])/.test(values.newPassword)) {
    errors.newPassword = "Password must contain at least one lowercase letter";
  } else if (!/(?=.*[A-Z])/.test(values.newPassword)) {
    errors.newPassword = "Password must contain at least one uppercase letter";
  } else if (!/(?=.*[0-9])/.test(values.newPassword)) {
    errors.password = "Password must contain at least one number";
  } else if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(values.newPassword)) {
    errors.newPassword = "Password must contain at least one special character";
  }

  if (!values.confirmNewPassword) {
    errors.confirmNewPassword = "Required";
  } else if (values.confirmNewPassword !== values.newPassword) {
    errors.confirmNewPassword = "Passwords do not match";
  }

  return errors;
};

const SettingsChangePasswordPage = () => {
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleToggleModal = () => {
    setShowModal(!showModal);
  };

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validate,
    onSubmit: async (values, { resetForm }) => {
      console.log("values ", JSON.stringify(values, null, 2));
      setLoading(true);
      try {
        const res = await axios.put(
          `${BASE_URL}/users/password`,
          {
            currentPassword: values.currentPassword,
            newPassword: values?.newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        console.log("change password res >>>", res);
        if (res?.status == 200) {
          resetForm();
          handleToggleModal();
        }
      } catch (error) {
        console.log("change password error >>>", error?.response?.data);
        toast.error(error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // handleToggleModal();
  };

  return (
    <div className="w-full px-5">
      <h2 className="font-bold text-[28px] blue-text">Change Password</h2>
      <div className="w-full border mt-5 mb-4" />

      <form
        onSubmit={formik.handleSubmit}
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
              name="currentPassword"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.currentPassword}
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
          {formik.errors.currentPassword ? (
            <div>{formik.errors.currentPassword}</div>
          ) : null}
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
              name="newPassword"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.newPassword}
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
          {formik.errors.newPassword ? (
            <div>{formik.errors.newPassword}</div>
          ) : null}
        </div>
        <div className="w-full flex flex-col items-start gap-1">
          <label
            htmlFor="confirmNewPassword"
            className="text-[13px] font-medium"
          >
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
              id="confirmNewPassword"
              name="confirmNewPassword"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmNewPassword}
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
          {formik.errors.confirmNewPassword ? (
            <div>{formik.errors.confirmNewPassword}</div>
          ) : null}
        </div>

        <div className="w-full">
          <button
            type="submit"
            className="blue-bg text-white font-bold text-base w-full py-3 rounded-2xl"
          >
            {loading ? "Saving..." : "Save"}
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
