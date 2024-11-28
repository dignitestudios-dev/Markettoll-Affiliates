import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";
import Loader from "../Global/Loader";

const PastOrderList = () => {
  const [pastOrders, setPastOrders] = useState([]);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const fetchPastPurchasedProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/users/order-product-purchased-past?page=1`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      // console.log("past orders data >>>>>", res?.data?.data);
      setPastOrders(res?.data?.data);
    } catch (error) {
      console.log("past orders data err >>>>>", error?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("past orders fetched");
    fetchPastPurchasedProducts();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-full">
      {pastOrders?.length === 0 ? (
        <h2 className="blue-text text-lg font-bold px-2">No Past Orders</h2>
      ) : (
        <>
          <div className="w-full flex items-center justify-between border-b py-3 mt-2">
            <p className="font-bold text-base">Past Order ID # 5649</p>
            <Link
              to="/order-history/order-details/123456"
              className="font-bold text-xs md:text-sm"
            >
              View Product Details
            </Link>
          </div>

          <div className="w-full grid grid-cols-1 lg:grid-cols-3 py-3 border-b">
            <div className="flex items-center justify-start gap-2">
              <img
                src="/product-img-1.png"
                alt="product-img"
                className="w-[80px] h-[80px] rounded-xl"
              />
              <div className="flex flex-col items-start justify-center gap-0">
                <span className="text-sm md:text-base font-semibold">
                  Product name here
                </span>
                <span className="text-xs md:text-sm text-[#9D9D9DDD]">
                  Pick/Delivery
                </span>
                <div className="lg:hidden flex items-center justify-center gap-1">
                  <span className="text-sm text-[#9D9D9DDD]">Price</span>
                  <span className="text-sm blue-text font-semibold pl-10">
                    $199.00
                  </span>
                </div>
                <Link
                  to="/orders/1231"
                  className="text-xs font-semibold md:hidden"
                >
                  View Product Details
                </Link>
              </div>
            </div>

            <div className="hidden lg:flex flex-col items-center justify-center gap-1">
              <span className="text-sm text-[#9D9D9DDD]">Price</span>
              <span className="text-xl blue-text font-semibold pl-10">
                $199.00
              </span>
            </div>

            <div className="hidden text-end lg:flex items-center justify-end">
              <Link to="/products/123245" className="font-bold text-sm">
                View Product Details
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PastOrderList;
