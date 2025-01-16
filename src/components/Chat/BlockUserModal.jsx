import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";
import SuccessModal from "./SuccessModal";
import {
  arrayUnion,
  db,
  doc,
  arrayRemove,
  updateDoc,
  getDoc,
} from "../../firebase/firebase";

const BlockUserModal = ({ state, onclose, sellerId, blockedStatus }) => {
  const { user, setIsBlockedByUser, setHasBlocked } = useContext(AuthContext);
  const [userBlocked, setUserBlocked] = useState(false);
  const [BlockUpdate, setBlockUpdate] = useState(false);

  const handleBlockUser = async () => {
    try {
      const userRef = doc(db, "blockStatus", user?._id);
      await updateDoc(userRef, {
        blockedUsers: blockedStatus
          ? arrayRemove(sellerId)
          : arrayUnion(sellerId),
      });
      setBlockUpdate(!BlockUpdate);
      onclose();
    } catch (error) {
      console.log("err while blocking user >>>>", error);
      toast.error(error?.response?.data?.message);
    }
  };
  const checkBlockUser = async () => {
    const userDoc = await getDoc(doc(db, "blockStatus", user?._id));
    const sellerDoc = await getDoc(doc(db, "blockStatus", sellerId));

    if (userDoc.exists() && sellerDoc.exists()) {
      const userBlockedList = userDoc.data().blockedUsers || [];
      const sellerBlockedList = sellerDoc.data().blockedUsers || [];
      setHasBlocked(userBlockedList.includes(sellerId));
      setIsBlockedByUser(sellerBlockedList.includes(user?._id));
    } else {
      setHasBlocked(false);
      setIsBlockedByUser(false);
    }
  };
  useEffect(() => {
    //  Checking Blocked User
    checkBlockUser();
    //  Checking Blocked User
  }, [BlockUpdate]);

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
