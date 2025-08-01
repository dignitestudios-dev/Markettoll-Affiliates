import React, { useContext, useEffect, useState } from "react";
import ProductCard from "../Global/ProductCard";
import { Link, useNavigate } from "react-router-dom";
import ServiceCard from "../Global/ServiceCard";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";
import Loader from "../Global/Loader";
import { SearchedProductContext } from "../../context/searchedProductContext";
import { CiFilter } from "react-icons/ci";
import FilterProductModal from "./FiltetProducts";
import Pagination from "../Global/Pagination";

const ProductList = () => {
  const [showServices, setShowServices] = useState(false);
  const [FilterModal, setFilterModal] = useState(false);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [services, setServices] = useState([]);
  const { user, setUserProfile } = useContext(AuthContext);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { searchResults, searchQuery } = useContext(SearchedProductContext);
  const [categories, setCategories] = useState([]);
  const [currentAddress, setCurrentAddress] = useState(true);
  const [paginationNum, setPaginationNum] = useState(1);
  const [mile, setMile] = useState(50);
  const [city, setCity] = useState();
  const [state, setState] = useState("");
  const [lat, setLat] = useState({
    lat: "",
    lng: "",
  });
  const [applyFilter, setApplyFilter] = useState(false);
  const [productCategory, setProductCategory] = useState("All");
  const fetchProducts = async () => {
    const options = user?.token
      ? {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      : {};

    const queryParams = [];

    if (currentAddress) {
      if (city)
        queryParams.push(
          `city=${encodeURIComponent(city).replace(/%20/g, " ")}`
        );
      if (state)
        queryParams.push(
          `state=${encodeURIComponent(state).replace(/%20/g, " ")}`
        );
    } else {
      if (lat.lat) queryParams.push(`lat=${lat.lat}`);
      if (lat.lng) queryParams.push(`lng=${lat.lng}`);
      if (mile) queryParams.push(`radius=${mile}`);
    }

    const queryString = queryParams.length ? `?${queryParams.join("&")}` : "";

    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/users/home-screen-products${queryString}`,
        options
      );
      setFilterModal(false);
      setProducts(res?.data?.data);
      setFilteredProducts(res?.data?.data);
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
    setLoading(true);
    try {
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

  const fetchUserProfile = async () => {
    if (user?.token) {
      // Only fetch if user is logged in and profile is not fetched
      try {
        const res = await axios.get(`${BASE_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setUserProfile(res?.data?.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchServices();
    fetchCategories();
    fetchUserProfile();
  }, [applyFilter]);

  const handleShowServices = (category) => {
    if (category == "services") {
      setShowServices(true);
    } else {
      setShowServices(false);
    }
  };

  const filterProducts = (categoryName) => {
    if (categoryName === "All") {
      setProductCategory("All");
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (prod) => prod.category === categoryName
      );
      setProductCategory(categoryName);
      setFilteredProducts(filtered);
    }
  };

  const handleSearchProduct = async () => {
    setLoading(true);
    const options = user?.token
      ? {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      : {};

    try {
      const res = await axios.get(
        `${BASE_URL}/users/home-screen-searched-products?name=${searchQuery}&category=&subCategory=&page=${paginationNum}  `,
        options
      );
       setLoading(false);
      setFilterModal(false);
      console.log(res.data.data, "response");
      setProducts(res?.data?.data);
      setFilteredProducts(res?.data?.data);
    } catch (error) {
      console.log("home screen products err >>>>", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearchProduct();
    console.log(searchQuery, "searchQuery");
    if (searchQuery == "") {
      fetchProducts();
    }
  }, [searchQuery, paginationNum]);

  const handleFilterModal = () => {
    setFilterModal(!FilterModal);
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
              className={`${
                productCategory == "All"
                  ? "blue-bg text-white"
                  : "bg-[#F7F7F7] text-black"
              } text-[13px] font-medium rounded-lg px-3 py-2`}
            >
              All
            </button>
            {products?.map((p, index) => {
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => filterProducts(p?.category)}
                  className={`${
                    productCategory === p?.category
                      ? "blue-bg text-white"
                      : "bg-[#F7F7F7] text-black"
                  } text-[13px] font-medium rounded-lg px-3 py-2`}
                >
                  {p?.category}
                </button>
              );
            })}
            {/* <button
              type="button"
              onClick={() => filterProducts("Electronics")}
              className={`${
                productCategory === "Electronics"
                  ? "blue-bg text-white"
                  : "bg-[#F7F7F7] text-black"
              } text-[13px] font-medium rounded-lg px-3 py-2`}
            >
              Electronics
            </button>
            <button
              type="button"
              onClick={() => filterProducts("Home Appliances")}
              className={`${
                productCategory == "Home Appliances"
                  ? "blue-bg text-white"
                  : "bg-[#F7F7F7] text-black"
              } text-[13px] font-medium rounded-lg px-3 py-2`}
            >
              Home Appliances
            </button>
            <button
              type="button"
              onClick={() => filterProducts("Home & Furniture")}
              className={`${
                productCategory == "Home & Furniture"
                  ? "blue-bg text-white"
                  : "bg-[#F7F7F7] text-black"
              } text-[13px] font-medium rounded-lg px-3 py-2`}
            >
              Home Decor & Interiors
            </button>
            <button
              type="button"
              onClick={() => filterProducts("Phone & Tablet")}
              className={`${
                productCategory == "Phone & Tablet"
                  ? "blue-bg text-white"
                  : "bg-[#F7F7F7] text-black"
              } text-[13px] font-medium rounded-lg px-3 py-2`}
            >
              Phone & Tablet
            </button>
            <button
              type="button"
              onClick={() => filterProducts("Fashion")}
              className={`${
                productCategory == "Fashion"
                  ? "blue-bg text-white"
                  : "bg-[#F7F7F7] text-black"
              } text-[13px] font-medium rounded-lg px-3 py-2`}
            >
              Clothing
            </button> */}
            <Link
              to={`/home/categories/${categories[0]?.name}`}
              className={`bg-[#F7F7F7] text-black text-[13px] font-medium rounded-lg px-3 py-2`}
            >
              See All
            </Link>
          </div>
        )}
        {showServices && <div></div>}
        <div className="hidden lg:flex items-center justify-end">
          <button
            type="button"
            onClick={() => handleFilterModal()}
            className={`py-3 ${
              !showServices ? "blue-bg text-white" : "bg-[#F7F7F7] text-black"
            } text-base flex items-center  gap-1 font-bold px-5 mr-4 rounded-2xl`}
          >
            Apply Filters <CiFilter size={25} />
          </button>
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

          <div className="w-full mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services && services?.length > 0 ? (
              <>
                {services?.map((service, index) => {
                  return <ServiceCard service={service} key={index} />;
                })}
              </>
            ) : (
              <p>No services found</p>
            )}
          </div>
        </>
      ) : (
        <>
          {loading ? (
            <Loader />
          ) : (
            <>
              {filteredProducts.length > 0 ? (
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
                          {productList?.products?.length > 0 &&
                            productList?.products
                              ?.slice(0, 4)
                              ?.map((product, i) => (
                                <ProductCard product={product} key={i} />
                              ))}
                        </div>
                      </div>
                    );
                  })}
                  <Pagination
                    setPaginationNum={setPaginationNum}
                    paginationNum={paginationNum}
                  />
                </>
              ) : (
                <p className="mt-5 text-sm blue-text">No products found.</p>
              )}
            </>
          )}
        </>
      )}
      <FilterProductModal
        applyFilter={applyFilter}
        onclick={handleFilterModal}
        setApplyFilter={setApplyFilter}
        setCurrentAddress={setCurrentAddress}
        setLat={setLat}
        FilterModal={FilterModal}
        setState={setState}
        setMile={setMile}
        setCity={setCity}
      />
    </div>
  );
};

export default ProductList;
