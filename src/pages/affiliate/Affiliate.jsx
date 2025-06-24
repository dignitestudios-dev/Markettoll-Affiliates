import React, { useContext, useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import Stats from "../../components/affiliate/Stats";
import CommisionBreakDown from "../../components/affiliate/CommisionBreakDown";
import { AuthContext } from "../../context/authContext";
import { BASE_URL } from "../../api/api";
import axios from "axios";
import { toast } from "react-toastify";

export default function Affiliate() {
  const {userProfile, setUserProfile  ,user } = useContext(AuthContext);
  const [openModal, setOpenModal] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const handleOpenModal = () => {
    setOpenModal(!openModal);
  };
  const [RefralLink, setRefralLink] = useState("");
  const [refrals, setRefrals] = useState([]);
  const fetchRefrals = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/influencer/my-referrals`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      console.log(res, "resss");
      setRefrals(res?.data?.data);
    } catch (error) {
      console.log(
        "error while fetching notifications >>>",
        error?.response?.data
      );
    }
  };

  const userCookie = localStorage.getItem("user");
  const user2 = userCookie ? JSON.parse(userCookie) : null;
  const fetchUserProfile = async () => {
    if (user2?.token) {
      try {
        const res = await axios.get(`${BASE_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${user2.token}`,
          },
        });
        setUserProfile(res?.data?.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    }
  };



  useEffect(() => {
    fetchUserProfile();
    fetchRefrals();
  }, []);
  return (
    <div className="padding-x py-6 z-0">
      {!showAll && (
        <>
          <div className="w-full flex items-center justify-between z-0">
            <h2 className="text-2xl lg:text-[36px] font-bold">
              <span className="blue-text">Welcome {userProfile?.name}!</span>{" "}
            </h2>
            <button
              type="button"
              onClick={async () => {
                try {
                  const response = await axios.post(
                    `${BASE_URL}/influencer/generate-referral-link`,
                    {}, 
                    {
                      headers: {
                        Authorization: `Bearer ${user?.token}`,
                      },
                    }
                  );
                  console.log(response, "resss");
                  setRefralLink(response?.data?.data?.referralLink);
                  handleOpenModal();
                } catch (error) {
                  console.log(error);
                }
              }}
              className="blue-bg text-white flex items-center gap-1 px-5 py-2 rounded-[20px] font-medium text-base"
            >
              Generate Affilate Link
            </button>
          </div>
          <div>
            <Stats />
          </div>
        </>
      )}
      <CommisionBreakDown
        showAll={showAll}
        setShowAll={setShowAll}
        refrals={refrals}
      />

      <Popup
        openModal={openModal}
        RefralLink={RefralLink}
        onclick={handleOpenModal}
      />
    </div>
  );
}

const Popup = ({ openModal, onclick, RefralLink }) => {
  return (
    openModal && (
      <div className="w-full h-screen bg-[rgba(0,0,0,0.5)] fixed inset-0 z-50 flex items-center justify-center">
        <div className="w-[440px] h-auto p-5 rounded-2xl bg-white flex flex-col  justify-center gap-3 relative">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-[#000000]  font-bold text-lg">
                Affiliate Link
              </h3>
              <p className="text-[#18181899] font-[400] text-[16px] ">
                Share this link to start earning commissions on every referral.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onclick()}
              className="w-6 h-6 rounded-full bg-gray-100 p-1"
            >
              <IoClose className="w-full h-full" />
            </button>
          </div>
          <div className="w-full bg-[#F2F2F2] rounded-[14px] p-2 flex items-center justify-between">
           <span>{RefralLink?.slice(1, 50)}</span>
            <button
              className="blue-bg text-white flex items-center gap-1 px-5 py-2 rounded-[12px] font-medium text-base"
              onClick={() => {
                navigator.clipboard
                  .writeText(RefralLink)
                  .then(() => {
                    toast.success("Link copied to clipboard!");
                  })
                  .catch((err) => {
                    toast.error("Failed to copy: ");
                  });
              }}
            >
              Copy
            </button>
          </div>
          <div className="w-full bg-[#F2F2F2] rounded-[14px] p-2">
            <h2 className="font-[400] text-[14px]">
              How your affiliate link works
            </h2>
            <p className="text-[#18181899] font-[400] text-[14px] ">
              Anyone who clicks and subscribes through your link will be
              automatically tagged to your account. You’ll earn 1% commission on
              every successful subscription they make.
            </p>
          </div>
        </div>
      </div>
    )
  );
};
