import React, { useContext, useEffect, useState } from "react";
import ProductCard from "../Global/ProductCard";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";
import Loader from "../Global/Loader";

const MyProductsList = ({ postType }) => {
  const [myProducts, setMyProducts] = useState([]);
  const { user } = useContext(AuthContext);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchMyProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        postType === "Post"
          ? `${BASE_URL}/users/products?page=${page}`
          : `${BASE_URL}/users/products-boosted?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      setMyProducts(res?.data?.data);
    } catch (error) {
      console.log("my products err >>>>", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, [postType]);

  if (loading) {
    return <Loader />;
  }
  if (myProducts.length === 0) {
    return (
      <div className="w-full min-h-[50vh]">
        <h2 className="font-bold blue-text text-lg px-2 mt-10">
          No Products Found
        </h2>
      </div>
    );
  }
  return (
    <div className="mt-10 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {myProducts?.map((product, index) => {
        return (
          <ProductCard
            product={product}
            key={index}
            fetchMyProducts={fetchMyProducts}
          />
        );
      })}
    </div>
  );
};

export default MyProductsList;
