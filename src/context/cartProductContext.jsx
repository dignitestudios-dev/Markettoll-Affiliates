import React, { useState } from "react";
import { createContext } from "react";

export const CartProductContext = createContext();

const CartProductContextProvider = ({ children }) => {
  const [data, setData] = useState({});
  const updateData = (address) => {
    setData((prevData) => ({
      ...prevData,
      deliveryAddress: address,
    }));
  };

  return (
    <CartProductContext.Provider value={{ data, setData, updateData }}>
      {children}
    </CartProductContext.Provider>
  );
};

export default CartProductContextProvider;
