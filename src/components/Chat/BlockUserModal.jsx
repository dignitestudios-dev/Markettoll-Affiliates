import axios from "axios";
import React, { useContext, useState } from "react";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";
import SuccessModal from "./SuccessModal";

const BlockUserModal = ({ state, onclose, sellerId }) => {
  const { user } = useContext(AuthContext);
  const [userBlocked, setUserBlocked] = useState(false);

  const handleBlockUser = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/users/chat-block-user/${sellerId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      console.log("block user res >>>>", res);
      if (res?.status === 201) {
        // toast.success();
        setUserBlocked(true);
      }
    } catch (error) {
      console.log("err while blocking user >>>>", error);
      toast.error(error?.response?.data?.message);
    }
  };

  const closeSuccessModal = () => {
    setUserBlocked(false);
    onclose();
  };
  return (
    state && (
      <div
        className={`w-full h-screen fixed inset-0 z-50 flex items-center justify-center padding-x py-6 bg-[rgba(0,0,0,0.4)]`}
      >
        <div className="bg-white p-6 rounded-xl w-full md:w-[330px] h-[133px] relative">
          <p className="text-[17px] font-semibold">Block User</p>
          <p className="">Are you sure you want to block user?</p>
          <div className="w-full flex items-center justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => handleBlockUser()}
              className="text-[13px] font-semibold text-[#FF3B30]"
            >
              Yes
            </button>
            <button
              type="button"
              onClick={onclose}
              className="text-[13px] font-semibold text-[#000]"
            >
              No
            </button>
          </div>
        </div>
        <SuccessModal
          open={userBlocked}
          onclose={closeSuccessModal}
          text={"You have successfully blocked the seller."}
        />
      </div>
    )
  );
};

export default BlockUserModal;
