import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { BASE_URL } from "../../api/api";
import axios from "axios";
import Loader from "../Global/Loader";
import { toast } from "react-toastify";

const OrdersReceivedCurrent = () => {
  const [orders, setOrders] = useState([]);
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
      // console.log("orders received current >>>>>", res?.data?.data);
      setOrders(res?.data?.data);
    } catch (error) {
      console.log("orders received current err >>>>>", error);
      toast.error(error?.response?.data?.message || "Something went wrong.");
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

  if (orders.length === 0) {
    return (
      <h2 className="blue-text font-bold text-lg px-2">No Orders Found</h2>
    );
  }

  return (
    <div className="w-full">
      <div className=""></div>
    </div>
  );
};

export default OrdersReceivedCurrent;
