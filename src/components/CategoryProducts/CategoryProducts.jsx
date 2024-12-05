import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import Loader from "../Global/Loader";
import { Link, useLocation, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import ProductCard from "../Global/ProductCard";

const CategoryProducts = () => {
  const [products, setProducts] = useState([]);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { category } = useParams();

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
        `${BASE_URL}/users/home-screen-products`,
        options
      );
      setProducts(res?.data?.data);
      //   console.log("products >>>>>", res?.data?.data);
    } catch (error) {
      console.log("home screen products err >>>>", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-full padding-x py-6">
      <div className="w-full">
        <Link to={`/`} className="flex items-center justify-start gap-1">
          <FiArrowLeft className="light-blue-text text-lg" />{" "}
          <span className="font-medium text-gray-500">Back</span>{" "}
        </Link>

        <h2 className="font-bold blue-text text-[26px] mt-3">{category}</h2>
      </div>
      <div className="w-full mt-4">
        {products?.length > 0 ? (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products?.map((product, index) => {
              return <ProductCard product={product} key={index} />;
            })}
          </div>
        ) : (
          <div className="w-full">
            <p className="">No Products Found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
