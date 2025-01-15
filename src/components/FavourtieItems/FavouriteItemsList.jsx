import React, { useContext, useEffect, useState } from "react";
import ProductCard from "../Global/ProductCard";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import FavoriteProductCard from "../Global/FavoriteProductCard";
import Loader from "../Global/Loader";
import { toast } from "react-toastify";
import FavoriteServiceCard from "./FavouriteServiceCard";

const FavouriteItemsList = () => {
  const [showServices, setShowServices] = useState(false);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const { user, fetchUserProfile } = useContext(AuthContext);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    const options = user?.token
      ? {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      : {};
    try {
      setLoading(true);
      const res = await axios.get(
        `${BASE_URL}/users/wishlist-products?page=${page}`,
        options
      );
      setProducts(res?.data?.data);
    } catch (error) {
      console.log("home screen products err >>>>", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchServices = async () => {
    const options = user?.token
      ? {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      : {};
    try {
      setLoading(true);
      const res = await axios.get(
        `${BASE_URL}/users/wishlist-services?page=${page}`,
        options
      );
      // console.log("wishlist-services >>>", res?.data);
      setServices(res?.data?.data);
    } catch (error) {
      console.log("home screen products err >>>>", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchServices();
  }, []);

  const handleRemoveFromFavorite = async (id) => {
    if (user?.token) {
      try {
        const res = await axios.delete(
          `${BASE_URL}/users/wishlist-product/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        console.log("product removed from favorite >>>>>", res);
        if (res?.status == 200) {
          fetchUserProfile();
          fetchProducts();
          // toast.success(res?.data?.message);
        }
      } catch (error) {
        console.log("product removed from favorite err >>>>>", error);
        if (error?.status === 409) {
          toast.error(error?.response?.data?.message);
        }
      }
    } else {
      navigate("/login");
    }
  };
  const handleRemoveServiceFromFavorite = async (id) => {
    if (user?.token) {
      try {
        const res = await axios.delete(
          `${BASE_URL}/users/wishlist-service/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        console.log("product removed from favorite >>>>>", res);
        if (res?.status == 200) {
          fetchUserProfile();
          fetchServices();
          // toast.success(res?.data?.message);
        }
      } catch (error) {
        console.log("product removed from favorite err >>>>>", error);
        if (error?.status === 409) {
          toast.error(error?.response?.data?.message);
        }
      }
    } else {
      navigate("/login");
    }
  };

  const handleShowServices = (category) => {
    if (category == "services") {
      setShowServices(true);
    } else {
      setShowServices(false);
    }
  };

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="w-full min-h-screen">
      <div className="w-full flex items-center justify-between">
        <h2 className="text-[28px] font-bold blue-text">
          {showServices ? "Favorite Services" : "Favorite Products"}
        </h2>
        <div className="hidden lg:flex items-center justify-end">
          <button
            type="button"
            onClick={() => handleShowServices("products")}
            className={`py-3 ${
              showServices ? "bg-[#F7F7F7] text-black" : "blue-bg text-white"
            } text-base font-bold px-5 rounded-l-2xl`}
          >
            Products
          </button>
          <button
            type="button"
            onClick={() => handleShowServices("services")}
            className={`py-3 ${
              !showServices ? "bg-[#F7F7F7] text-black" : "blue-bg text-white"
            } text-base font-bold px-5 rounded-r-2xl`}
          >
            Services
          </button>
        </div>
      </div>
      {showServices ? (
        // services
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-10">
          {services?.length > 0 ? (
            <>
              {services?.map((service, index) => {
                return (
                  <FavoriteServiceCard
                    service={service}
                    key={index}
                    handleRemoveFromFavorite={handleRemoveServiceFromFavorite}
                  />
                );
              })}
            </>
          ) : (
            <h3 className="blue-text font-bold">No Services Added Yet.</h3>
          )}
        </div>
      ) : (
        // products
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-10">
          {products?.length > 0 ? (
            <>
              {products?.map((product, index) => {
                return (
                  <FavoriteProductCard
                    product={product}
                    key={index}
                    handleRemoveFromFavorite={handleRemoveFromFavorite}
                  />
                );
              })}
            </>
          ) : (
            <h3 className="blue-text font-bold">No Products Found</h3>
          )}
        </div>
      )}
    </div>
  );
};

export default FavouriteItemsList;
