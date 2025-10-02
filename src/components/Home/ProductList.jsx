import React, { useContext, useEffect, useState } from "react";
import ProductCard from "../Global/ProductCard";
import { Link, useNavigate } from "react-router-dom";
import ServiceCard from "../Global/ServiceCard";
import JobCard from "../Global/JobCard";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";
import Loader from "../Global/Loader";
import { SearchedProductContext } from "../../context/searchedProductContext";
import { CiFilter } from "react-icons/ci";
import FilterProductModal from "./FiltetProducts";

const ProductList = () => {
  const [showServices, setShowServices] = useState(false);
  const [showJobs, setShowJobs] = useState(false);

  // Services infinite scroll states
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingServices, setLoadingServices] = useState(false);
  const [services, setServices] = useState([]);

  // Jobs infinite scroll states
  const [jobPage, setJobPage] = useState(1);
  const [jobHasMore, setJobHasMore] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [jobs, setJobs] = useState([]);

  const [FilterModal, setFilterModal] = useState(false);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { user, setUserProfile } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
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

  // Fetch services (paginated)
  const fetchServices = async (pageNum) => {
    if (!hasMore || loadingServices) return;

    const options = user?.token
      ? { headers: { Authorization: `Bearer ${user?.token}` } }
      : {};

    try {
      setLoadingServices(true);
      const res = await axios.get(
        `${BASE_URL}/users/home-screen-services?page=${pageNum}`,
        options
      );

      const newServices = res?.data?.data?.services || [];
      setServices((prev) => [...prev, ...newServices]);

      if (!newServices || newServices.length === 0) {
        setHasMore(false);
      }
    } catch (error) {
      console.log("services error >>>>", error);
    } finally {
      setLoadingServices(false);
    }
  };

  // Fetch jobs (paginated) - Dummy API for now
  const fetchJobs = async (pageNum) => {
    if (!jobHasMore || loadingJobs) return;

    try {
      setLoadingJobs(true);

      const res = await axios.get(
        `${BASE_URL}/users/get-jobs?page=${pageNum}`,
        {
          headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OGQyN2I4NTA0ODY1M2E1ODg2NDVhZjUiLCJpYXQiOjE3NTk0MjY3MTZ9.jEU4xlkUTZwDLpL3rn5O-qJe4d5Id5fN2vIPIS2ZcNk` },
        }
      );

      console.log("res of jobs: ",res)

      const newJobs = res?.data?.jobs || [];
      setJobs((prev) => [...prev, ...newJobs]);

      if (!newJobs || newJobs.length === 0) {
        setJobHasMore(false);
      }
    } catch (error) {
      console.log("jobs error >>>>", error);
    } finally {
      setLoadingJobs(false);
    }
  };

  // Handle job like/unlike - Dummy API for now
  const handleJobLike = async (jobId) => {
    try {
      // Dummy API call for liking job - replace with actual endpoint
      const res = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({ data: { success: true } });
        }, 300);
      });

      // Update job liked status in state
      setJobs((prev) =>
        prev.map((job) =>
          job.id === jobId ? { ...job, isLiked: !job.isLiked } : job
        )
      );
    } catch (error) {
      console.log("job like error >>>>", error);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const res = await axios.get(`${BASE_URL}/users/product-categories`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setCategories(res?.data?.data);
    } catch (error) {
      console.log("home screen products err >>>>", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchUserProfile = async () => {
    if (user?.token) {
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
    fetchCategories();
    fetchUserProfile();
  }, []);

  const handleShowServices = (category) => {
    if (category === "services") {
      setShowServices(true);
      setShowJobs(false);
      setPage(1);
      setServices([]);
      setHasMore(true);
    } else if (category === "jobs") {
      setShowJobs(true);
      setShowServices(false);
      setJobPage(1);
      setJobs([]);
      setJobHasMore(true);
    } else {
      setShowServices(false);
      setShowJobs(false);
      setPage(1);
      setJobPage(1);
    }
  };

  useEffect(() => {
    if (!showServices && !showJobs) return;

    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        if (
          window.innerHeight + document.documentElement.scrollTop + 600 >=
            document.documentElement.scrollHeight &&
          ((showServices && !loadingServices && hasMore) ||
            (showJobs && !loadingJobs && jobHasMore))
        ) {
          if (showServices) {
            setPage((prev) => prev + 1);
          } else if (showJobs) {
            setJobPage((prev) => prev + 1);
          }
        }
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [
    showServices,
    showJobs,
    loadingServices,
    loadingJobs,
    hasMore,
    jobHasMore,
  ]);

  useEffect(() => {
    if (showServices) {
      fetchServices(page);
    }
  }, [page, showServices]);

  useEffect(() => {
    if (showJobs) {
      fetchJobs(jobPage);
    }
  }, [jobPage, showJobs]);

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

    try {
      const res = await axios.get(
        `${BASE_URL}/users/home-screen-searched-products?name=${searchQuery}&category=&subCategory=&page=${paginationNum}`
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
    console.log(searchQuery, "searchQuery");
    fetchProducts();
  }, [paginationNum, applyFilter]);

  const handleFilterModal = () => {
    setFilterModal(!FilterModal);
  };

  if (loading || loadingCategories) {
    return <Loader />;
  }

  return (
    <div className="w-full min-h-[70vh]">
      <div className="w-full flex items-center justify-between mt-6">
        {!showServices && !showJobs && (
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
            {categories?.map((category, index) => {
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => filterProducts(category?.name)}
                  className={`${
                    productCategory === category?.name
                      ? "blue-bg text-white"
                      : "bg-[#F7F7F7] text-black"
                  } text-[13px] font-medium rounded-lg px-3 py-2`}
                >
                  {category?.name}
                </button>
              );
            })}
            <Link
              to={`/home/categories/`}
              className={`bg-[#F7F7F7] text-black text-[13px] font-medium rounded-lg px-3 py-2`}
            >
              See All
            </Link>
          </div>
        )}
        {(showServices || showJobs) && <div></div>}
        <div className="hidden lg:flex items-center justify-end">
          <button
            type="button"
            onClick={() => handleFilterModal()}
            className={`py-3 ${
              !showServices && !showJobs
                ? "blue-bg text-white"
                : "bg-[#F7F7F7] text-black"
            } text-base flex items-center  gap-1 font-bold px-5 mr-4 rounded-2xl text-nowrap`}
          >
            Apply Filters <CiFilter size={25} />
          </button>
          <button
            type="button"
            onClick={() => handleShowServices("products")}
            className={`py-3 ${
              !showServices && !showJobs
                ? "blue-bg text-white"
                : "bg-[#F7F7F7] text-black"
            } text-base font-bold px-5 rounded-l-2xl`}
          >
            Products
          </button>
          <button
            type="button"
            onClick={() => handleShowServices("services")}
            className={`py-3 ${
              showServices ? "blue-bg text-white" : "bg-[#F7F7F7] text-black"
            } text-base font-bold px-5`}
          >
            Services
          </button>
          <button
            type="button"
            onClick={() => handleShowServices("jobs")}
            className={`py-3 ${
              showJobs ? "blue-bg text-white" : "bg-[#F7F7F7] text-black"
            } text-base font-bold px-5 rounded-r-2xl`}
          >
            Jobs
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
            {services && services.length > 0 ? (
              services.map((service, index) => (
                <ServiceCard service={service} key={index} />
              ))
            ) : loadingServices ? (
              ""
            ) : (
              <p>No services found</p>
            )}
          </div>

          {loadingServices && services.length ? (
            <div className="flex justify-center my-12">
              <Loader w="fit" />
            </div>
          ) : loadingServices ? (
            <div className="flex justify-center my-20">
              <Loader w="fit" />
            </div>
          ) : (
            ""
          )}

          {!hasMore && services.length > 0 && (
            <div className="flex justify-center my-6 text-gray-500">
              <p>No more services to load</p>
            </div>
          )}
        </>
      ) : showJobs ? (
        <>
          <div className="w-full flex items-center justify-between mt-10">
            <h3 className="text-2xl lg:text-[28px] font-bold blue-text">
              Jobs
            </h3>
          </div>

          <div className="w-full mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs && jobs.length > 0 ? (
              jobs.map((job, index) => (
                <JobCard job={job} key={index} onLike={handleJobLike} />
              ))
            ) : loadingJobs ? (
              ""
            ) : (
              <p>No jobs found</p>
            )}
          </div>

          {loadingJobs && jobs.length ? (
            <div className="flex justify-center my-12">
              <Loader w="fit" />
            </div>
          ) : loadingJobs ? (
            <div className="flex justify-center my-20">
              <Loader w="fit" />
            </div>
          ) : (
            ""
          )}

          {!jobHasMore && jobs.length > 0 && (
            <div className="flex justify-center my-6 text-gray-500">
              <p>No more jobs to load</p>
            </div>
          )}
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
                            to={`/home/categories/${productList?.category}`}
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
                </>
              ) : (
                <p className="mt-5 text-sm blue-text">No product found.</p>
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
