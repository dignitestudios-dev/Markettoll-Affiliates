import axios from "axios";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";
import Loader from "../Global/Loader";
import OrderStatusTabs from "./OrderStatusTabs";
import OrderTrackingCard from "./OrderTrackingCard";
import {
  extractPlacedProducts,
  resolveOrderStatus,
  statusMatchesTab,
} from "./orderTrackingUtils";

const normalizeOrdersResponse = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.orders)) return payload.orders;
  if (Array.isArray(payload?.data?.orders)) return payload.data.orders;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  return [];
};

const OrdersPlaced = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(false);
  const [page] = useState(1);
  const [limit] = useState(10);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/users/user-orders?page=${page}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );

      const list = normalizeOrdersResponse(res?.data);
      setOrders(list);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, limit]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order, index) => {
      const status = resolveOrderStatus(order, index, false);
      return statusMatchesTab(status, activeTab);
    });
  }, [orders, activeTab]);

  const handleNavigate = (order) => {
    navigate(`/order-history/order-details/${order._id}`, {
      state: {
        data: order,
        type: "current-orders",
      },
    });
  };

  if (loading) return <Loader />;

  return (
    <div className="w-full">
      <OrderStatusTabs activeTab={activeTab} onChange={setActiveTab} />

      <div className="w-full flex flex-col gap-4 mt-6 min-h-[40vh]">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order, index) => {
            const status = resolveOrderStatus(order, index, false);
            return (
              <OrderTrackingCard
                key={order?._id || index}
                orderId={order?._id}
                status={status}
                products={extractPlacedProducts(order)}
                onViewOrderDetails={() => handleNavigate(order)}
              />
            );
          })
        ) : (
          <h2 className="blue-text text-xl font-bold">No order Found</h2>
        )}
      </div>
    </div>
  );
};

export default OrdersPlaced;
