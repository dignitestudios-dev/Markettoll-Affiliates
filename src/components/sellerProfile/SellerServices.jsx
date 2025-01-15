import React, { useContext, useEffect, useState } from "react";
import ProductCard from "../Global/ProductCard";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import ServiceCard from "../Global/ServiceCard";
import { useParams } from "react-router-dom";
import Loader from "../Global/Loader";

const SellerServices = () => {
  const [myServices, setMyServices] = useState([]);
  const { user } = useContext(AuthContext);
  const { sellerId } = useParams();
  const [loading, setLoading] = useState(false);

  const fetchUserServices = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/users/seller-services/${sellerId}?page=1`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      setMyServices(res?.data?.data);
    } catch (error) {
      console.log(
        "error while fetching services >>>",
        error?.response?.data?.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserServices();
  }, []);
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-full mt-8">
      {myServices && myServices?.length > 0 ? (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {myServices?.map((service, index) => {
            return <ServiceCard service={service} key={index} />;
          })}
        </div>
      ) : (
        <div className="w-full">
          <h2 className="blue-text font-bold text-xl">No Services Found</h2>
        </div>
      )}
    </div>
  );
};

export default SellerServices;
