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
  const { category } = useParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const name = searchParams.get("name") || "";
  const subCategory = searchParams.get("subCategory") || "";
  const page = searchParams.get("page") || 1;

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

      const apiUrl = `${BASE_URL}/users/home-screen-searched-products?name=${name}&category=${encodeURIComponent(
        category
      )}&subCategory=${subCategory}&page=${page}`;

      const res = await axios.get(apiUrl, options);

      setProducts(res?.data?.data);
      console.log("Fetched products >>>>>", res?.data?.data);
    } catch (error) {
      console.log("Error fetching products >>>>", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products when component mounts or when the user changes
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on category when products or category change
  useEffect(() => {
    if (products.length > 0 && category) {
      const filteredCategory = products.filter((p) => p.category === category);
      setFilteredProducts(filteredCategory);
    }
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
