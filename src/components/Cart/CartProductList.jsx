import React, { useContext, useEffect, useState } from "react";
import CartProductCard from "./CartProductCard";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";

const CartProductList = ({ cartProducts }) => {
  // const [cartProducts, setCartProducts] = useState([]);
  const { user } = useContext(AuthContext);

  // const fetchCartProducts = async () => {
  //   try {
  //     const res = await axios.get(`${BASE_URL}/users/cart-products`, {
  //       headers: {
  //         Authorization: `Bearer ${user?.token}`,
  //       },
  //     });
  //     // console.log("cartProducts >>>", res?.data?.data);
  //     setCartProducts(res?.data?.data);
  //   } catch (error) {
  //     console.log("cartProducts err >>>", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchCartProducts();
  // }, []);

  return (
    <div className="bg-white p-6 rounded-[20px]">
      <div className="w-full flex items-center justify-between mb-5">
        <h2 className="text-[28px] blue-text font-bold">Cart</h2>
        <button
          type="button"
          className="text-sm text-[#9D9D9DDD] flex items-center gap-1"
        >
          <img
            src="/trash-icon.png"
            alt="trash icon"
            className="w-[14px] h-[16px]"
          />
          Remove All
        </button>
      </div>

      {cartProducts?.map((cartProd, index) => {
        return <CartProductCard products={cartProd} key={index} />;
      })}
    </div>
  );
};

export default CartProductList;
