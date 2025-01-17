import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import Cookies from "js-cookie";
import { BASE_URL } from "../../api/api";
import axios from "axios";
import Loader from "../Global/Loader";

const ReviewOrderDetails = () => {
  const location = useLocation();
  // console.log("orderData >>>", location?.state?.orderData);
  const { user, userProfile } = useContext(AuthContext);
  const [sellerProfile, setSellerProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  if (!location?.state?.orderData) {
    return navigate(-1);
  }

  // Extract products by fulfillment methods
  const extractedProducts = location?.state?.orderData?.products.reduce(
    (acc, product) => {
      if (Array.isArray(product.fulfillmentMethods)) {
        product.fulfillmentMethods.forEach((fulfillment) => {
          if (fulfillment.method === "selfPickup") {
            acc.selfPickup = [
              ...acc.selfPickup,
              ...(fulfillment.products || []),
            ];
          } else if (fulfillment.method === "delivery") {
            acc.delivery = [...acc.delivery, ...(fulfillment.products || [])];
          }
        });
      }
      return acc;
    },
    { selfPickup: [], delivery: [] }
  );
  console.log("extractedProducts >>>>", extractedProducts);

  const fetchSellerPrfile = async () => {
    const headers = user?.token
      ? { Authorization: `Bearer ${user?.token}` }
      : {};
    setLoading(true);
    if (!user) {
      toast.error("Login to see the seller profile");
      return navigate("/login");
    }
    try {
      const res = await axios.get(
        `${BASE_URL}/users/profile-details/${location?.state?.orderData?.products[0]?.seller?.id}`,
        {
          headers: headers,
        }
      );
      // console.log("user profile >>", res?.data?.data);
      setSellerProfile(res?.data?.data);
    } catch (error) {
      console.log(
        "err while fetching user profile >>>>",
        error?.response?.data
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerPrfile();
  }, []);

  function formatDate(isoDate) {
    if (!isoDate) {
      return null;
    }
    const date = new Date(isoDate);

    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  }

  if (loading) {
    return <Loader />;
  }

  console.log(sellerProfile, "sellterProfile");

  const userDetail = {
    id: location?.state?.orderData?.products[0]?.seller?.id,
    lastMessage: {
      profileImage: sellerProfile?.profileImage,
      profileName: sellerProfile?.name,
      id: location?.state?.orderData?.products[0]?.seller?.id,
    },
  };

  return (
    <div className="w-full padding-x py-6">
      <div className="bg-[#F7F7F7] rounded-[30px] p-5">
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="w-full col-span-1 lg:col-span-2 bg-white p-7 rounded-xl">
            <h2 className="lg:text-[28px] text-xl font-bold blue-text">
              Thank you for placing an order!
            </h2>

            <div className="my-6">
              <p>
                <span className="font-medium">Order ID:</span>{" "}
                <span className="text-[#808080]">
                  {location?.state?.orderData?._id?.substr(-7)}
                </span>
              </p>
              <p>
                <span className="font-medium">Order Placed:</span>{" "}
                <span className="text-[#808080]">
                  {location?.state?.orderData &&
                    formatDate(location?.state?.orderData?.createdAt)}
                </span>
              </p>
            </div>

            {extractedProducts?.delivery?.length > 0 && (
              <div className="">
                <h3 className="font-bold mb-2">Delivery Orders</h3>

                <div className="w-full">
                  {extractedProducts?.delivery?.length > 0 && (
                    <div className="w-full">
                      {extractedProducts?.delivery?.map((prod, i) => {
                        return (
                          <div className="w-full mb-3" key={i}>
                            <div className="w-full flex items-center gap-2">
                              <img
                                src={prod?.product?.seller?.profileImage}
                                alt={sellerProfile?.product?.name}
                                className="w-[28px] h-[28px] rounded-full object-cover"
                              />
                              <p className="font-medium">
                                {prod?.product?.seller?.name}
                              </p>
                              <Link
                                to={`/seller-profile/${prod?.product?.seller?._id}`}
                                className="text-[13px] font-semibold underline"
                              >
                                View Profile
                              </Link>
                            </div>

                            <div className="w-full flex items-center justify-between border-t border-b border-[#D6D6D6] py-3 mt-2">
                              <div className="flex items-center gap-4">
                                <img
                                  src={prod?.product?.images[0]?.url}
                                  alt=""
                                  className="w-[80px] h-[80px] rounded-[15px] object-cover"
                                />
                                <div>
                                  <p className="text-base font-semibold">
                                    {prod?.product?.name}
                                  </p>
                                  <p className="text-sm text-[#9D9D9DDD]">
                                    {prod?.fulfillmentMethod?.delivery
                                      ? "Delivery"
                                      : "Self Pickup"}
                                  </p>
                                  <Link
                                    to={`/chats`}
                                    state={{ data: userDetail }}
                                    className="text-[13px] text-[#676767] flex items-center gap-2 mt-0.5"
                                  >
                                    <img
                                      src="/chat-icon.png"
                                      alt="chat icon"
                                      className="w-[18px] h-[18px]"
                                    />
                                    Chat With Seller
                                  </Link>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm text-[#9D9D9DDD]">
                                  Price
                                </p>
                                <p className="text-[20px] font-semibold blue-text">
                                  ${prod?.product?.price}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {extractedProducts?.selfPickup?.length > 0 && (
              <div className="w-full mt-8 pt-4">
                <div className="w-full mt-5">
                  <div className="w-full">
                    {extractedProducts?.selfPickup?.map((prod, i) => {
                      return (
                        <div className="w-full" key={i}>
                          <div className="w-full flex items-center gap-2">
                            <img
                              src={prod?.product?.seller?.profileImage}
                              alt={sellerProfile?.product?.name}
                              className="w-[28px] h-[28px] rounded-full object-cover"
                            />
                            <p className="font-medium">
                              {prod?.product?.seller?.name}
                            </p>
                            <Link
                              to={`/seller-profile/${prod?.product?.seller?._id}`}
                              className="text-[13px] font-semibold underline"
                            >
                              View Profile
                            </Link>
                          </div>
                          <div className="w-full border-t border-b border-[#D6D6D6] py-3 mt-2">
                            <div className="w-full flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <img
                                  src={prod?.product?.images[0]?.url}
                                  alt=""
                                  className="w-[80px] h-[80px] rounded-[15px] object-cover"
                                />
                                <div className="">
                                  <p className="text-base font-semibold">
                                    {prod?.product?.name}
                                  </p>
                                  <p className="text-sm text-[#9D9D9DDD]">
                                    {prod?.fulfillmentMethod?.delivery
                                      ? "Delivery"
                                      : "Self Pickup"}
                                  </p>
                                  <Link
                                    to={`/chats`}
                                    state={{ data: userDetail }}
                                    className="text-[13px] text-[#676767] flex items-center gap-2 mt-0.5"
                                  >
                                    <img
                                      src="/chat-icon.png"
                                      alt="chat icon"
                                      className="w-[18px] h-[18px]"
                                    />
                                    Chat With Seller
                                  </Link>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm text-[#9D9D9DDD]">
                                  Price
                                </p>
                                <p className="text-[20px] font-semibold blue-text">
                                  ${prod?.product?.price}
                                </p>
                              </div>
                            </div>
                            <div className="w-full pt-3">
                              <div className="flex items-center gap-2">
                                <img
                                  src="/call-icon-filled.png"
                                  alt="call-icon-filled"
                                  className="w-[15px] h-[15px]"
                                />
                                <span className="text-black text-sm">
                                  {prod?.product?.seller?.phoneNumber?.value}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <img
                                  src="/location-icon.png"
                                  alt="call-icon-filled"
                                  className="w-[18px] h-[20px]"
                                />
                                <span className="text-black text-sm">
                                  {
                                    prod?.product?.seller?.pickupAddress
                                      ?.apartment_suite
                                  }{" "}
                                  {
                                    prod?.product?.seller?.pickupAddress
                                      ?.streetAddress
                                  }{" "}
                                  {prod?.product?.seller?.pickupAddress?.city}{" "}
                                  {prod?.product?.seller?.pickupAddress?.state}{" "}
                                  {
                                    prod?.product?.seller?.pickupAddress
                                      ?.country
                                  }{" "}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* order summary */}
          <div className="w-full col-span-1 lg:col-span-1">
            <div className="w-full bg-white p-7 rounded-xl">
              <h2 className="lg:text-[28px] text-xl font-bold blue-text">
                Order Summary
              </h2>

              <div className="w-full flex items-center justify-between mt-10">
                <span className="text-[#000000B2] font-[400]">
                  Subtotal (
                  {extractedProducts?.delivery?.length +
                    extractedProducts?.selfPickup?.length}{" "}
                  items)
                </span>
                <span className="text-[#000000B2] font-[400]">
                  ${location?.state?.orderData?.total}
                </span>
              </div>
              <div className="w-full border border-[#D6D6D6] mt-4" />
              <div className="w-full flex items-center justify-between mt-5">
                <span className="text-[#000000] font-bold">Total</span>
                <span className="text-[#000000] font-bold">
                  ${location?.state?.orderData?.total}
                </span>
              </div>
              <Link
                to="/"
                className="w-full block text-center bg-[#0098EA] py-3 rounded-[20px] text-white font-bold mt-4"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewOrderDetails;
