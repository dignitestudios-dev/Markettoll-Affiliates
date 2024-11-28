import React, { useContext, useEffect, useState } from "react";
import Loader from "../Global/Loader";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";
import axios from "axios";

const MyServicesList = () => {
  const [myServices, setMyServices] = useState([]);
  const { user } = useContext(AuthContext);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchMyServices = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/users/seller-services/${user?._id}?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      //   console.log("my services res >>>>>", res?.data);
      setMyServices(res?.data?.data);
    } catch (error) {
      console.log("my services err >>>>", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyServices();
  }, []);

  if (loading) {
    return <Loader />;
  }
  if (myServices.length === 0) {
    return (
      <div className="w-full min-h-[50vh]">
        <h2 className="font-bold blue-text text-lg px-2 mt-10">
          You have not posted any service.
        </h2>
      </div>
    );
  }
  return <div>MyServicesList</div>;
};

export default MyServicesList;
