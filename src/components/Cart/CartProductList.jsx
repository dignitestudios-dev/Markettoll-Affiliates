import React, { useContext, useState } from "react";
import CartProductCard from "./CartProductCard";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import Loader from "../Global/Loader";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CartProductList = ({
  cartProducts,
  fetchCartProducts,
  removeCartProducts,
  loading,
}) => {
  // if (loading) {
  //   return <Loader />;
  // }
  return (
    <div className="bg-white p-6 rounded-[20px]">
      <div className="w-full flex items-center justify-between mb-5">
        <h2 className="text-[28px] blue-text font-bold">Cart</h2>
        <button
          type="button"
          disabled={cartProducts?.length == 0 || !cartProducts}
          onClick={() => removeCartProducts()}
          className="text-sm text-[#9D9D9DDD] flex items-center gap-1 disabled:cursor-not-allowed"
        >
          <img
            src="/trash-icon.png"
            alt="trash icon"
            className="w-[14px] h-[16px]"
          />
          Remove All
        </button>
      </div>

      {cartProducts?.length > 0 ? (
        <>
          {cartProducts?.map((cartProd, index) => {
            return (
              <CartProductCard
                products={cartProd}
                key={index}
                fetchCartProducts={fetchCartProducts}
              />
            );
          })}
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default CartProductList;
