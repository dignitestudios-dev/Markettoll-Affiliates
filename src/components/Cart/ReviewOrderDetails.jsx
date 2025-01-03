import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import Cookies from "js-cookie";
import { BASE_URL } from "../../api/api";
import axios from "axios";

const ReviewOrderDetails = () => {
  const location = useLocation();
  console.log("orderData >>>", location?.state);
  const { user } = useContext(AuthContext);
  const [sellerProfile, setSellerProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState(
    location?.state?.orderData?.products[0]?.fulfillmentMethods
  );
  // console.log("products >>>", products);

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
                <span className="text-[#808080]">26413</span>
              </p>
              <p>
                <span className="font-medium">Order Placed:</span>{" "}
                <span className="text-[#808080]">21 Jan, 2024</span>
              </p>
            </div>

            <div className="">
              {products?.some(
                (p) => p.method === "selfPickup" && p.products?.length > 0
              ) && (
                <>
                  <h3 className="font-bold mb-2">Pickup Orders</h3>
                  <div className="w-full flex items-center gap-2">
                    <img
                      src={sellerProfile?.profileImage}
                      alt={sellerProfile?.name}
                      className="w-[28px] h-[28px] rounded-full object-cover"
                    />
                    <p className="font-medium">{sellerProfile?.name}</p>
                    <Link
                      to={`/seller-profile/${location?.state?.orderData?.products[0]?.seller?.id}`}
                      className="text-[13px] font-semibold underline"
                    >
                      View Profile
                    </Link>
                  </div>
                  <div className="w-full border-t border-[#D6D6D6] mt-5 pt-3">
                    {products?.map((p, index) => {
                      return (
                        p?.method === "selfPickup" &&
                        p?.products?.length > 0 && (
                          <div className="w-full" key={index}>
                            {p?.products?.map((prod, i) => {
                              return (
                                <div
                                  className="w-full flex items-center justify-between"
                                  key={i}
                                >
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
                                        Pickup
                                      </p>
                                      <Link
                                        to={``}
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
                              );
                            })}
                          </div>
                        )
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {products?.some(
              (p) => p.method === "delivery" && p.products?.length > 0
            ) && (
              <div className="w-full border-t mt-5 pt-4">
                <div className="">
                  <h3 className="font-bold mb-2">Delivery Orders</h3>
                  <div className="w-full flex items-center gap-2">
                    <img
                      src={sellerProfile?.profileImage}
                      alt={sellerProfile?.name}
                      className="w-[28px] h-[28px] rounded-full object-cover"
                    />
                    <p className="font-medium">{sellerProfile?.name}</p>
                    <Link
                      to={`/seller-profile/${location?.state?.orderData?.products[0]?.seller?.id}`}
                      className="text-[13px] font-semibold underline"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
                <div className="w-full mt-5">
                  {products?.map((p, index) => {
                    return (
                      p?.method === "delivery" &&
                      p?.products?.length > 0 && (
                        <>
                          <div className="w-full" key={index}>
                            {p?.products?.map((prod, i) => {
                              return (
                                <div
                                  className="w-full flex items-center justify-between border-t border-b border-[#D6D6D6] py-3"
                                  key={i}
                                >
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
                                        Pickup
                                      </p>
                                      <Link
                                        to={``}
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
                              );
                            })}
                          </div>
                        </>
                      )
                    );
                  })}
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
                  Subtotal (3 items)
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
