import React, { useContext, useEffect, useState } from "react";
import ProductCard from "../Global/ProductCard";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";
import { useParams } from "react-router-dom";
import Loader from "../Global/Loader";

const SellerProducts = () => {
  const [myProducts, setMyProducts] = useState([]);
  const { user } = useContext(AuthContext);
  const { sellerId } = useParams();
  const [loading, setLoading] = useState(false);

  const fetchMyProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/users/seller-products/${sellerId}?page=1`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      setMyProducts(res?.data?.data);
    } catch (error) {
      console.log(
        "error while fetching products >>>",
        error?.response?.data?.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  if (loading) {
    return <Loader />;
  }
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
