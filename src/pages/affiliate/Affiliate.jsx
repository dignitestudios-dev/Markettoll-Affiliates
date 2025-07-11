import React, { useContext, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import Stats from "../../components/affiliate/Stats";
import CommisionBreakDown from "../../components/affiliate/CommisionBreakDown";
import AffiliateBreakDown from "../../components/affiliate/AffiliateBreakDown";
import { AuthContext } from "../../context/authContext";
import { BASE_URL } from "../../api/api";
import axios from "axios";
import { toast } from "react-toastify";

export default function Affiliate() {
  const { userProfile, setUserProfile, user } = useContext(AuthContext);
  const [openModal, setOpenModal] = useState(false);
  const [activeView, setActiveView] = useState("main"); // "main" | "commission" | "affiliate"
  const [RefralLink, setRefralLink] = useState("");
  const [refrals, setRefrals] = useState([]);
  const [showAffiliate, setShowAffliate] = useState([]);

  const fetchRefrals = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/influencer/my-referrals`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setRefrals(res?.data?.data);
    } catch (error) {
      console.log("Error fetching referrals:", error?.response?.data);
    }
  };
  const fetchAffliate = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/influencer/my-affiliates`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setShowAffliate(res?.data?.data);
    } catch (error) {
      console.log("Error fetching referrals:", error?.response?.data);
    }
  };

  const fetchUserProfile = async () => {
    const userCookie = localStorage.getItem("user");
    const user2 = userCookie ? JSON.parse(userCookie) : null;
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
    fetchAffliate();
  }, []);
  console.log(showAffiliate, "affiliates")
  return (
    <div className="padding-x py-6 z-0">
      {activeView === "main" && (
        <>
          <div className="w-full flex items-center justify-between z-0">
            <h2 className="text-2xl lg:text-[36px] font-bold">
              <span className="blue-text">Welcome {userProfile?.name}!</span>
            </h2>
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  try {
                    const res = await axios.post(
                      `${BASE_URL}/influencer/generate-referral-link`,
                      {},
                      {
                        headers: { Authorization: `Bearer ${user?.token}` },
                      }
                    );
                    setRefralLink(res?.data?.data?.referralLink);
                    setOpenModal(true);
                  } catch (error) {
                    console.log(error);
                  }
                }}
                className="blue-bg text-white flex items-center gap-1 px-5 py-2 rounded-[20px] font-medium text-base"
              >
                Generate Referral Link
              </button>

              <button
                onClick={async () => {
                  try {
                    const res = await axios.post(
                      `${BASE_URL}/influencer/generate-affiliate-link`,
                      {},
                      {
                        headers: { Authorization: `Bearer ${user?.token}` },
                      }
                    );
                    setRefralLink(res?.data?.data?.referralLink);
                    setOpenModal(true);
                  } catch (error) {
                    console.log(error);
                  }
                }}
                className="blue-bg text-white flex items-center gap-1 px-5 py-2 rounded-[20px] font-medium text-base"
              >
                Generate Affiliate Link
              </button>
            </div>
          </div>
          <Stats refrals={showAffiliate} setActiveView={setActiveView}  />
        </>
      )}

      {activeView === "commission" || activeView === "main" && (
        <CommisionBreakDown
          refrals={refrals}
          setActiveView={setActiveView}
        />
      )}

      {activeView === "affiliate" && (
        <AffiliateBreakDown
          refrals={showAffiliate}
          setActiveView={setActiveView}
        />
      )}

      <Popup
        openModal={openModal}
        RefralLink={RefralLink}
        onclick={() => setOpenModal(false)}
      />
    </div>
  );
}

const Popup = ({ openModal, onclick, RefralLink }) => {
  return (
    openModal && (
      <div className="w-full h-screen bg-[rgba(0,0,0,0.5)] fixed inset-0 z-50 flex items-center justify-center">
        <div className="w-[440px] h-auto p-5 rounded-2xl bg-white flex flex-col gap-3 relative">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-[#000000] font-bold text-lg">Generate Link</h3>
              <p className="text-[#18181899] text-[16px]">
                Share this link to start earning commissions on every referral.
              </p>
            </div>
            <button onClick={onclick} className="w-6 h-6 rounded-full bg-gray-100 p-1">
              <IoClose className="w-full h-full" />
            </button>
          </div>

          <div className="w-full bg-[#F2F2F2] rounded-[14px] p-2 flex items-center justify-between">
            <span>{RefralLink?.slice(0, 50)}</span>
            <button
              className="blue-bg text-white px-5 py-2 rounded-[12px]"
              onClick={() => {
                navigator.clipboard
                  .writeText(RefralLink)
                  .then(() => toast.success("Link copied to clipboard!"))
                  .catch(() => toast.error("Failed to copy link."));
              }}
            >
              Copy
            </button>
          </div>

          <div className="w-full bg-[#F2F2F2] rounded-[14px] p-2">
            <h2 className="text-[14px]">How your affiliate link works</h2>
            <p className="text-[#18181899] text-[14px]">
              Anyone who clicks and subscribes through your link will be tagged to your account. You’ll earn 1% commission on every successful subscription they make.
            </p>
          </div>
        </div>
      </div>
    )
  );
};
