import React, { useContext, useEffect, useState } from "react";
import SellerProducts from "./SellerProducts";
import SellerServices from "./SellerServices";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { IoIosStar } from "react-icons/io";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import Loader from "../Global/Loader";
import { toast } from "react-toastify";
import ReportSellerModal from "./ReportSellerModal";

const SellerProfile = () => {
  const [category, setCategory] = useState("Products");
  const [myProfile, setMyProfile] = useState(null);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { sellerId } = useParams();
  const [openReportModal, setOpenReportModal] = useState(false);
  const [sellerReviews, setSellerReviwes] = useState(null);

  const fetchUserPrfile = async () => {
    const headers = user?.token
      ? { Authorization: `Bearer ${user?.token}` }
      : {};
    setLoading(true);
    if (!user) {
      toast.error("Login to see the seller profile");
      return navigate("/login");
    }
    try {
      const res = await axios.get(`${BASE_URL}/users/profile/${sellerId}`, {
        headers: headers,
      });
      // console.log("seller profile >>", res?.data?.data);
      setMyProfile(res?.data?.data);
    } catch (error) {
      console.log(
        "err while fetching user profile >>>>",
        error?.response?.data
      );
      toast.error(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReviews = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/users/seller-reviews/${sellerId}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      // console.log("seller reviews >>>", res?.data);
      setSellerReviwes(res?.data?.data);
    } catch (error) {
      // console.log("error while fetch seller reviews >>>>", error);
      toast.error(error?.response?.data?.message || "Something went wrong.");
    }
  };

  useEffect(() => {
    fetchUserReviews();
    fetchUserPrfile();
  }, []);

  const totalReviews =
    myProfile?.avgProductRating?.oneStar +
    myProfile?.avgProductRating?.twoStar +
    myProfile?.avgProductRating?.threeStar +
    myProfile?.avgProductRating?.fourStar +
    myProfile?.avgProductRating?.fiveStar;

  const averageRating =
    totalReviews > 0
      ? (
          (1 * myProfile?.avgProductRating?.oneStar +
            2 * myProfile?.avgProductRating?.twoStar +
            3 * myProfile?.avgProductRating?.threeStar +
            4 * myProfile?.avgProductRating?.fourStar +
            5 * myProfile?.avgProductRating?.fiveStar) /
          totalReviews
        ).toFixed(1)
      : 0;

  const filledStars = Math.floor(averageRating);
  const halfStar = averageRating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - filledStars - halfStar;

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="padding-x py-6">
      <div className="w-full bg-[#F7F7F7] rounded-[20px] p-6 lg:p-12 relative">
        <div>
          <Link
            to={location?.state ? location?.state?.from : "/"}
            className="flex items-center gap-1"
          >
            <GoArrowLeft className="light-blue-text text-xl" />
            <span className="text-[#5C5C5C] text-sm font-medium">Back</span>
          </Link>
        </div>

        <div className="w-full mt-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img
              src={
                myProfile ? myProfile?.profileImage : "/seller-profile-img.png"
              }
              alt="seller profile"
              className="w-[89.1px] h-[89.1px] object-cover rounded-full"
            />

            <div className="flex flex-col items-start gap-1">
              <span className="text-[26px] font-bold">
                {myProfile && myProfile?.name}
              </span>
              <div className="flex items-center gap-1">
                {Array.from({ length: filledStars }).map((_, index) => (
                  <IoIosStar
                    key={`filled-${index}`}
                    className="text-xl text-yellow-400"
                  />
                ))}

                {halfStar > 0 && (
                  <IoIosStar
                    key="half"
                    className="text-xl text-yellow-400 opacity-50"
                  />
                )}

                {Array.from({ length: emptyStars }).map((_, index) => (
                  <IoIosStar
                    key={`empty-${index}`}
                    className="text-xl text-gray-300"
                  />
                ))}

                <span className="text-sm ml-2">{totalReviews} reviews</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpenReportModal(!openReportModal)}
            className="text-[13px] text-[#5C5C5C] flex items-center gap-2"
          >
            <img
              src="/report-icon.png"
              alt="report-icon"
              className="w-[18.51px] h-[16px]"
            />{" "}
            Report
          </button>
        </div>
      </div>

      <div className="w-full mt-10">
        <div className="w-full flex items-center justify-between">
          <h2 className="text-[28px] font-bold blue-text">{category}</h2>

          <div>
            <button
              type="button"
              onClick={() => setCategory("Products")}
              className={`py-3 px-6 rounded-l-xl text-base font-bold ${
                category == "Products"
                  ? "text-white blue-bg"
                  : "bg-[#F7F7F7] text-black"
              }`}
            >
              Products
            </button>
            <button
              type="button"
              onClick={() => setCategory("Services")}
              className={`py-3 px-6 rounded-r-xl  text-base font-bold ${
                category == "Services"
                  ? "text-white blue-bg"
                  : "bg-[#F7F7F7] text-black"
              }`}
            >
              Services
            </button>
          </div>
        </div>
      </div>

      {category == "Services" ? <SellerServices /> : <SellerProducts />}
      <ReportSellerModal
        openReportModal={openReportModal}
        setOpenReportModal={setOpenReportModal}
        sellerId={sellerId}
      />
    </div>
  );
};

export default SellerProfile;
