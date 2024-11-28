import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import Loader from "../Global/Loader";

const OrdersReceivedPast = () => {
  const [pastOrders, setPastOrders] = useState([]);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

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
      //   console.log("past orders data >>>>>", res?.data?.data);
      setPastOrders(res?.data?.data);
    } catch (error) {
      console.log("past orders data err >>>>>", error?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("received past orders >>>>");
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

  return <div>OrdersReceivedPast</div>;
};

export default OrdersReceivedPast;
