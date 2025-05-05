import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";
import Loader from "../Global/Loader";
import { toast } from "react-toastify";

const CurrentOrderList = () => {
  const [currentOrders, setCurrentOrders] = useState([]);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchCurrentPurchasedProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/users/order-product-purchased-current`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      // console.log("current orders placed >>>>", res?.data?.data);
      setCurrentOrders(res?.data?.data);
    } catch (error) {
      // console.log("current orders data err >>>>>", error?.response?.data);
      toast.error(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentPurchasedProducts();
  }, []);

  if (loading) {
    return <Loader />;
  }

  const handleNavigate = (id, data) => {
    navigate(`/order-history/order-details/${id}`, {
      state: { data, type: "current-orders" },
    });
  };

  return (
    <div className="w-full">
      {currentOrders.length > 0 ? (
        <>
          {currentOrders?.map((currentOrder, index) => {
            return (
              <div className="w-full" key={index}>
                <div className="w-full flex items-center justify-between border-b py-3 mt-2">
                  <p className="font-bold text-base">
                    Order ID # {currentOrder?._id?.slice(0, 4)?.toUpperCase()}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      handleNavigate(currentOrder?._id, currentOrder)
                    }
                    // to={`/order-history/order-details/${currentOrder?._id}`}
                    className="font-bold text-xs md:text-sm"
                  >
                    View Order Summary
                  </button>
                </div>

                <div className="w-full">
                  {currentOrder?.sellersProducts?.map(
                    (sellerProduct, index) => {
                      return (
                        <div className="w-full" key={index}>
                          {sellerProduct?.fulfillmentMethods?.map(
                            (product, key) => {
                              return (
                                <div className="w-full" key={key}>
                                  {product?.products?.map((pro, abc) => {
                                    const userDetail = {
                                      id: pro?.product?.seller?._id,
                                      lastMessage: {
                                        profileImage:
                                          pro?.product?.seller?.profileImage,
                                        profileName: pro?.product?.seller?.name,
                                        id: product?.pro?.seller?._id,
                                      },
                                    };
                                    return (
                                      <div
                                        className="w-full grid grid-cols-1 lg:grid-cols-3 py-3 border-b"
                                        key={abc}
                                      >
                                        <div className="flex items-center justify-start gap-2">
                                          <img
                                            src={pro?.product?.images[0]?.url}
                                            alt="product-img"
                                            className="w-[80px] h-[80px] rounded-xl"
                                          />
                                          <div className="flex flex-col items-start justify-center gap-0">
                                            <span className="text-sm md:text-base font-semibold">
                                              {pro?.product?.name}
                                            </span>
                                            <span className="text-xs md:text-sm text-[#9D9D9DDD]">
                                              {pro?.fulfillmentMethod?.delivery
                                                ? "Delivery"
                                                : "Self-Pickup"}
                                            </span>
                                            <Link
                                              to={`/chats`}
                                              state={{ data: userDetail }}
                                              className="font-normal mt-0.5 text-[13px] text-[#9D9D9DDD] flex items-center gap-2"
                                            >
                                              <img
                                                src="/chat-icon.png"
                                                alt="chat-icon"
                                                className="w-[14px] md:w-[18px] h-[14px] md:h-[18px]"
                                              />
                                              Chat With Seller
                                            </Link>
                                            <div className="lg:hidden flex items-center justify-center gap-1">
                                              <span className="text-sm text-[#9D9D9DDD]">
                                                Price
                                              </span>
                                              <span className="text-sm blue-text font-semibold pl-10">
                                                $
                                                {pro?.product?.price?.toFixed(
                                                  2
                                                )}
                                              </span>
                                            </div>
                                            <Link
                                              to={`/products/${pro?.product?._id}`}
                                              className="text-xs font-semibold md:hidden"
                                            >
                                              View Product Details
                                            </Link>
                                          </div>
                                        </div>

                                        <div className="hidden lg:flex flex-col items-center justify-center gap-1">
                                          <span className="text-sm text-[#9D9D9DDD]">
                                            Price
                                          </span>
                                          <span className="text-xl blue-text font-semibold pl-10">
                                            ${pro?.product?.price?.toFixed(2)}
                                          </span>
                                        </div>

                                        <div className="hidden text-end lg:flex items-center justify-end">
                                          <Link
                                            to={`/products/${pro?.product?._id}`}
                                            className="font-bold text-sm"
                                          >
                                            View Product Details
                                          </Link>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            }
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <div>
          <h2 className="blue-text text-2xl font-bold">No order Found</h2>
        </div>
      )}
    </div>
  );
};

export default CurrentOrderList;
