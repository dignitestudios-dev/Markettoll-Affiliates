import React, { useContext, useEffect, useState } from "react";
import ProductCard from "../Global/ProductCard";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";
import { useParams } from "react-router-dom";

const SellerProducts = () => {
  const [myProducts, setMyProducts] = useState([]);
  const { user } = useContext(AuthContext);
  const { sellerId } = useParams();

  const fetchMyProducts = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/users/seller-products/${sellerId}?page=1`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      // console.log("my products >>>", res?.data?.data);
      setMyProducts(res?.data?.data);
    } catch (error) {
      console.log(
        "error while fetching products >>>",
        error?.response?.data?.message
      );
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);
  return (
    <div className="w-full mt-8">
      {myProducts && myProducts?.length > 0 ? (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {myProducts?.map((product, index) => {
            return <ProductCard product={product} key={index} />;
          })}
        </div>
      ) : (
        <div className="w-full">
          <h2 className="blue-text font-bold text-xl">No Products Found</h2>
        </div>
      )}
    </div>
  );
};

export default SellerProducts;
