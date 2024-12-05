import React, { useContext, useEffect, useState } from "react";
import ProductCard from "../Global/ProductCard";
import { Link, useNavigate } from "react-router-dom";
import ServiceCard from "../Global/ServiceCard";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";
import Loader from "../Global/Loader";
import { SearchedProductContext } from "../../context/searchedProductContext";

const ProductList = () => {
  const [showServices, setShowServices] = useState(false);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [services, setServices] = useState([]);
  const { user, fetchUserProfile } = useContext(AuthContext);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const { searchResults } = useContext(SearchedProductContext);
  const [categories, setCategories] = useState([]);

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
      setFilteredProducts(res?.data?.data);
      // console.log("products >>>>>", res?.data?.data);
    } catch (error) {
      console.log("home screen products err >>>>", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
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
        `${BASE_URL}/users/home-screen-services?page=${page}`,
        options
      );
      setServices(res?.data?.data);
    } catch (error) {
      console.log("services error >>>>", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/users/product-categories`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setCategories(res?.data?.data);
      // console.log("setCategories >>>", res?.data?.data);
    } catch (error) {
      console.log("home screen products err >>>>", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchProducts();
    fetchServices();
    fetchCategories();
  }, []);

  const handleShowServices = (category) => {
    if (category == "services") {
      setShowServices(true);
    } else {
      setShowServices(false);
    }
  };

  const handleNavigate = () => {
    navigate("/categories/consoles", { state: { from: "/" } });
  };

  const filterProducts = (categoryName) => {
    if (categoryName === "All") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (prod) => prod.category === categoryName
      );
      setFilteredProducts(filtered);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-full min-h-[70vh]">
      <div className="w-full flex items-center justify-between mt-6">
        {!showServices && (
          <div className="flex items-center gap-2 category-buttons flex-wrap">
            <button
              type="button"
              onClick={() => filterProducts("All")}
              className="blue-bg text-white text-[13px] font-medium rounded-lg px-3 py-2"
            >
              All
            </button>
            <button
              type="button"
              onClick={() => filterProducts("Electronics")}
              className="bg-[#F7F7F7] text-black text-[13px] font-medium rounded-lg px-3 py-2"
            >
              Electronics
            </button>
            <button
              type="button"
              onClick={() => filterProducts("Home Appliances")}
              className="bg-[#F7F7F7] text-black text-[13px] font-medium rounded-lg px-3 py-2"
            >
              Home Appliances
            </button>
            <button
              type="button"
              onClick={() => filterProducts("Home & Furniture")}
              className="bg-[#F7F7F7] text-black text-[13px] font-medium rounded-lg px-3 py-2"
            >
              Home Decor & Interiors
            </button>
            <button
              type="button"
              onClick={() => filterProducts("Phone & Tablet")}
              className="bg-[#F7F7F7] text-black text-[13px] font-medium rounded-lg px-3 py-2"
            >
              Phone & Tablet
            </button>
            <button
              type="button"
              onClick={() => filterProducts("Fashion")}
              className="bg-[#F7F7F7] text-black text-[13px] font-medium rounded-lg px-3 py-2"
            >
              Clothing
            </button>
            <Link
              to={`/categories/${categories[0]?.name}`}
              className="bg-[#F7F7F7] text-black text-[13px] font-medium rounded-lg px-3 py-2"
            >
              See All
            </Link>
          </div>
        )}
        {showServices && <div></div>}
        <div className="hidden lg:flex items-center justify-end">
          <button
            type="button"
            onClick={() => handleShowServices("products")}
            className={`py-3 ${
              !showServices ? "blue-bg text-white" : "bg-[#F7F7F7] text-black"
            } text-base font-bold px-5 rounded-l-2xl`}
          >
            Products
          </button>
          <button
            type="button"
            onClick={() => handleShowServices("services")}
            className={`py-3 ${
              showServices ? "blue-bg text-white" : "bg-[#F7F7F7] text-black"
            } text-base font-bold px-5 rounded-r-2xl`}
          >
            Services
          </button>
        </div>
      </div>

      {showServices ? (
        <>
          <div className="w-full flex items-center justify-between mt-10">
            <h3 className="text-2xl lg:text-[28px] font-bold blue-text">
              Services
            </h3>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <>
              <div className="w-full mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {services && services?.length > 0 ? (
                  <>
                    {services?.map((service, index) => {
                      return <ServiceCard service={service} key={index} />;
                    })}
                  </>
                ) : null}
              </div>
            </>
          )}
        </>
      ) : (
        <>
          {Array.isArray(products) && filteredProducts.length > 0 ? (
            <>
              {filteredProducts?.map((productList, index) => {
                return (
                  <div key={index} className="mt-10">
                    <div className="w-full flex items-center justify-between">
                      <h3 className="text-2xl lg:text-[28px] font-bold blue-text">
                        {productList?.category}
                      </h3>
                      <Link
                        to={`/categories/${productList?.category}`}
                        className="text-[#6C6C6C] text-[18px] font-medium"
                      >
                        See all
                      </Link>
                    </div>

                    <div className="w-full mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {productList?.products?.length > 0 ? (
                        productList?.products
                          ?.slice(0, 4)
                          ?.map((product, i) => (
                            <ProductCard product={product} key={i} />
                          ))
                      ) : (
                        <p>No products available in this category.</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <p className="mt-5 text-sm blue-text">
              No products available in this category.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;
