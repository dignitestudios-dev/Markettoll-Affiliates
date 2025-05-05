import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import Loader from "../Global/Loader";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const OrdersReceivedPast = () => {
  const [pastOrders, setPastOrders] = useState([]);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const fetchPastPurchasedProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/users/order-product-received-past?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      // console.log("past orders data >>>>>", res?.data?.data);
      setPastOrders(res?.data?.data);
    } catch (error) {
      // console.log("past orders data err >>>>>", error?.response?.data);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPastPurchasedProducts();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (pastOrders.length === 0) {
    return (
      <h2 className="blue-text font-bold text-lg px-2">No Orders Found</h2>
    );
  }

  const handleNavigate = (id, data) => {
    navigate(`/order-history/order-received-details/${id}`, {
      state: { data, type: "orders-received-past" },
    });
  };

  return (
    <div className="w-full">
      {pastOrders.length > 0 ? (
        <>
          {pastOrders?.map((currentOrder, index) => {
            return (
              <div className="w-full" key={index}>
                <div className="w-full flex items-center justify-between border-b pb-3 mt-6">
                  <p className="font-bold text-base">
                    Order ID # {currentOrder?._id?.substr(-4)?.toUpperCase()}
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
                {currentOrder?.products?.map((product, index) => {
                  // console.log(" >>>", product);
                  const userDetail = {
                    id: product?.product?.seller?._id,
                    lastMessage: {
                      profileImage: product?.product?.seller?.profileImage,
                      profileName: product?.product?.seller?.name,
                      id: product?.product?.seller?._id,
                    },
                  };
                  return (
                    <div
                      key={index}
                      className="w-full flex items-center justify-between border-b py-3"
                    >
                      <div className="flex items-center justify-start gap-2">
                        <img
                          src={product?.product?.images[0]?.url}
                          alt=""
                          className="w-[80px] h-[80px] rounded-2xl"
                        />
                        <div className="flex flex-col items-start gap-1">
                          <span className="font-semibold">
                            {product?.product?.name}
                          </span>
                          <span className="text-sm text-[#9D9D9DDD]">
                            {product?.product?.fulfillmentMethod?.selfPickup
                              ? "Self Pickup"
                              : "Delivery"}
                          </span>
                          <Link
                            to={`/chats`}
                            state={{ data: userDetail }}
                            className="flex items-center gap-1"
                          >
                            <img
                              src="/chat-icon.png"
                              alt="chat icon"
                              className="w-[18px] h-[18px]"
                            />
                            <span className="text-[#676767] text-[13px]">
                              Chat with seller
                            </span>
                          </Link>
                        </div>
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-sm text-[#9D9D9DDD]">Price</span>
                        <span className="text-[#003DAC] text-[20px] font-bold">
                          {product?.product?.price?.toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <Link
                          to={`/products/${product?.product?._id}`}
                          className="text-[13px] font-bold"
                        >
                          View Product Details
                        </Link>
                      </div>
                    </div>
                  );
                })}
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

export default OrdersReceivedPast;
