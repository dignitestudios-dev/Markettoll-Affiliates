import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import Loader from "../Global/Loader";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import ProductCard from "../Global/ProductCard";

const CategoryProducts = () => {
  const [products, setProducts] = useState([]);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { category } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const name = searchParams.get("name") || "";
  const subCategory = searchParams.get("subCategory") || "";

  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const fetchProducts = async (pageNum) => {
    if (!hasMore || loading) return;

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
      )}&subCategory=${subCategory}&page=${pageNum}`;

      const res = await axios.get(apiUrl, options);

      const newProducts = res?.data?.data?.products || [];
      const totalPages = res?.data?.data?.totalPages || 1;

      setProducts((prev) => [...prev, ...newProducts]);

      if (pageNum >= totalPages || newProducts.length === 0) {
        setHasMore(false);
      }
    } catch (error) {
      console.log("Error fetching products >>>>", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch whenever "page" changes
  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  // Infinite scroll handler
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        if (
          window.innerHeight + document.documentElement.scrollTop + 1000 >=
            document.documentElement.scrollHeight &&
          !loading &&
          hasMore
        ) {
          setPage((prev) => prev + 1);
        }
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  return (
    <div className="w-full padding-x py-6">
      <div className="w-full">
        <Link
          onClick={() => navigate(-1)}
          className="flex items-center justify-start gap-1"
        >
          <FiArrowLeft className="light-blue-text text-lg" />
          <span className="font-medium text-gray-500">Back</span>
        </Link>

        <h2 className="font-bold blue-text text-[26px] mt-3">{category}</h2>
      </div>

      <div className="w-full mt-4">
        {products?.length > 0 ? (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((product, index) => (
              <ProductCard product={product} key={index} />
            ))}
          </div>
        ) : (
          !loading && (
            <div className="w-full">
              <p>No Products Found</p>
            </div>
          )
        )}

        {loading && products.length ? (
          <div className="flex justify-center my-12">
            <Loader w="fit" />
          </div>
        ) : loading ? (
          <div className="flex justify-center my-6">
            <Loader />
          </div>
        ) : (
          ""
        )}

        {!hasMore && (
          <div className="flex justify-center my-6 text-gray-500">
            <p>No more products to load</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
