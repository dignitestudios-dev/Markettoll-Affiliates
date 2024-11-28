import React, { useState } from "react";
import { createContext } from "react";

export const ProductDataReview = createContext();

const AddProductProvider = ({ children }) => {
  const [productData, setProductData] = useState("");
  const [serviceData, setServiceData] = useState("");

  return (
    <ProductDataReview.Provider
      value={{ productData, setProductData, serviceData, setServiceData }}
    >
      {children}
    </ProductDataReview.Provider>
  );
};

export default AddProductProvider;
