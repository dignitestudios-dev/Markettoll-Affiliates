import React, { useContext, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../Global/Loader";

const CartProductCard = ({ products, fetchCartProducts }) => {
  const [quantity, setQuantity] = useState(products?.quantity);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleIncrementQuantity = async (type) => {
    if (type === "increment" && products?.product?.quantity === quantity) {
      toast.error("No more quantity available.");
      return;
    }
    const endpoint =
      type === "increment"
        ? `${BASE_URL}/users/cart-product-increment-by-one/${products?.product?._id}`
        : `${BASE_URL}/users/cart-product-decrement-by-one/${products?.product?._id}`;
    // setLoading(true);
    try {
      const res = await axios.put(
        endpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      // console.log("increment by one res >>>>>>", res);
      if (res.status == 200) {
        setQuantity(res?.data?.data?.quantity);
        fetchCartProducts();
      }
    } catch (error) {
      // console.log("decrement by one err >>>>>>", error);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleRemoveCartItems = async () => {
    try {
      const res = await axios.delete(
        `${BASE_URL}/users/cart-product/${products?.product?._id}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      console.log("removed cart items >>>", res?.data);
      if (res?.data?.success) {
        toast.success(res?.data?.message);
        fetchCartProducts();
      }
    } catch (error) {
      console.log(
        "error while deleting cart items >>>>",
        error?.response?.data
      );
      toast.error(error?.response?.data?.message);
    }
  };

  // if (loading) {
  //   return <Loader />;
  // }

  return (
    <div className="border-t py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img
          src={products?.product?.images[0].url}
          alt="product image"
          className="w-[80px] h-[80px] rounded-[15px]"
        />
        <div className="flex flex-col items-start justify-center gap-1">
          <span className="text-base font-semibold">
            {products?.product?.name}
          </span>
          <span className="text-sm font-normal text-[#9D9D9DDD]">
            {products?.fulfillmentMethod?.delivery ? "Delivery" : "Pickup"}
          </span>
          <span className="font-semibold text-[16px] blue-text">
            ${products?.product?.price}.00
          </span>
          <div className="md:hidden">
            <div className="flex items-center justify-center">
              <button
                type="button"
                disabled={quantity === 1}
                onClick={() => handleIncrementQuantity("decrement")}
                className="py-1 px-2 rounded-l-[10px] text-center blue-bg"
              >
                <FaMinus className="text-sm text-white" />
              </button>
              <button
                type="button"
                disabled
                className="py-[0.5px] px-5 w-full border-t border-b text-center bg-white text-black text-[13px] font-medium cursor-default"
              >
                {quantity}
              </button>
              <button
                type="button"
                disabled={quantity === products?.quantity}
                onClick={() => handleIncrementQuantity("increment")}
                className="py-1 px-2 rounded-r-[10px] text-center blue-bg disabled:cursor-not-allowed"
              >
                <FaPlus className="text-sm text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="md:flex flex-col items-start gap-1 hidden">
        <span className="text-[#9D9D9DDD] text-sm">Price</span>
        <span className="font-semibold text-[20px] blue-text">
          ${products?.product?.price}.00
        </span>
      </div>
      <div className="hidden md:flex flex-col items-end">
        <button
          type="button"
          onClick={() => handleRemoveCartItems()}
          className="text-[#9D9D9DDD] text-sm flex items-center justify-center gap-1 mb-1"
        >
          <img
            src="/trash-icon.png"
            alt="trash-icon"
            className="w-[14px] h-[15px]"
          />
          Delete
        </button>
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={() => handleIncrementQuantity("decrement")}
            className="py-3.5 px-6 rounded-l-[20px] text-center blue-bg"
          >
            <FaMinus className="text-lg text-white" />
          </button>
          <button
            type="button"
            disabled
            className="py-[9px] px-10 w-full border-t border-b text-center bg-white text-black text-[18px] font-medium cursor-default"
          >
            {quantity}
          </button>
          <button
            type="button"
            onClick={() => handleIncrementQuantity("increment")}
            className="py-3.5 px-6 rounded-r-[20px] text-center blue-bg"
          >
            <FaPlus className="text-lg text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartProductCard;
