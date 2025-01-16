import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { AuthContext } from "./authContext";
import { BASE_URL } from "../api/api";

export const CartProductContext = createContext();

const CartProductContextProvider = ({ children }) => {
  const [data, setData] = useState({});
  const [cartCount, setCartCount] = useState(0);
  const { user } = useContext(AuthContext);
  const updateData = (address) => {
    setData((prevData) => ({
      ...prevData,
      deliveryAddress: address,
    }));
  };
  const fetchCartProducts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/users/cart-products`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setCartCount(res?.data?.data?.length);
    } catch (error) {
      console.log("cartProducts err >>>", error);
    }
  };

  return (
    <CartProductContext.Provider
      value={{
        data,
        setData,
        updateData,
        cartCount,
        setCartCount,
        fetchCartProducts,
      }}
    >
      {children}
    </CartProductContext.Provider>
  );
};

export default CartProductContextProvider;
