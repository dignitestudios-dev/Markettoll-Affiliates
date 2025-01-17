import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Global/Loader";
import { BASE_URL } from "../../api/api";
import ProductCard from "../Global/ProductCard";
import ServiceCard from "../Global/ServiceCard";
import { toast } from "react-toastify";

const SearchProductList = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchedService, setSearchedService] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const query = new URLSearchParams(location.search);
      const searchQuery = query.get("name");
      const category = query.get("category");
      const subCategory = query.get("subCategory");
      const page = query.get("page");

      try {
        setLoading(true);
        const res = await axios.get(
          `${BASE_URL}/users/home-screen-searched-products?name=${searchQuery}&category=${
            category || ""
          }&subCategory=${subCategory || ""}&page=${page || 1}`
        );
        const serviceRes = await axios.get(
          `${BASE_URL}/users/home-screen-searched-services?name=${searchQuery}&page=${
            page || 1
          }`
        );
        setSearchedService(serviceRes?.data?.data || []);
        setProducts(res.data?.data || []);
        // console.log("searched products >>>", res?.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error(error?.response?.data?.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.search]);

  if (loading) return <Loader />;

  return (
    <div className="w-full py-12 padding-x min-h-[70vh]">
      <h2 className="blue-text font-bold text-[28px] mb-6">Search Results</h2>
      {products.length > 0 ? (
        <div className="product-list w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((product, index) => (
            <ProductCard product={product} key={index} />
          ))}
        </div>
      ) : (
        <div className="w-full">
          <p></p>
        </div>
      )}
      {searchedService?.length > 0 && (
        <div className="product-list w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {searchedService.map((service, index) => (
            <ServiceCard service={service} key={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchProductList;
