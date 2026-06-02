import React, { useContext, useEffect, useState, useRef } from "react";
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

  // Products infinite scroll states
  const [productPages, setProductPages] = useState({});
  const [productHasMore, setProductHasMore] = useState({});
  const [loadingMoreProducts, setLoadingMoreProducts] = useState({});

  // Ref to track ongoing fetch requests per category
  const fetchingRef = useRef({});

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
  const [activeCategory, setActiveCategory] = useState("All");
  const [city, setCity] = useState();
  const [state, setState] = useState("");
  const [lat, setLat] = useState({
    lat: "",
    lng: "",
  });
  const [applyFilter, setApplyFilter] = useState(false);
  const [productCategory, setProductCategory] = useState("All");

  // Refs to track category sections
  const categoryRefs = useRef({});

  const getProductKey = (product) => {
    const id = product?.id || product?._id;
    if (id) return String(id);

    const name = product?.name?.trim().toLowerCase() || "";
    const categoryLabel = product?.category?.trim().toLowerCase() || "";
    return `${name}-${categoryLabel}`;
  };

  const removeDuplicateProducts = (products = []) => {
    const seen = new Set();
    return (products || []).filter((product) => {
      const key = getProductKey(product);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const createCategoryGroup = (category, products = []) => ({
    category: category || "All",
    products: removeDuplicateProducts(
      (products || []).map((product) => ({
        ...product,
        category: category || product?.category || "All",
      }))
    ),
  });

  const normalizeGroupedProducts = (data) => {
    if (!Array.isArray(data)) {
      return [createCategoryGroup("All", [])];
    }

    const hasCategoryGroups = data.some(
      (item) => item && Array.isArray(item.products)
    );

    if (!hasCategoryGroups) {
      return [createCategoryGroup("All", data)];
    }

    const seen = new Set();
    return (data || [])
      .map((group) => {
        const category = group?.category || "All";
        const uniqueProducts = removeDuplicateProducts(
          (group?.products || []).map((product) => ({
            ...product,
            category,
          }))
        ).filter((product) => {
          const key = getProductKey(product);
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        return {
          ...group,
          category,
          products: uniqueProducts,
        };
      })
      .filter((group) => Array.isArray(group.products) && group.products.length > 0);
  };

  const fetchProducts = async (category = "All") => {
    setLoading(true);

    try {
      let url = "";

      if (category === "All") {
        url = `${BASE_URL}/users/v2/home-screen-products?page=1&limit=100`;
      } else {
        url = `${BASE_URL}/users/v2/home-screen-products?category=${encodeURIComponent(
          category
        )}&page=1&limit=20`;
      }

      const res = await axios.get(url);
      const responseProducts = res?.data?.data?.products || [];
      const totalPages = res?.data?.data?.totalPages || 1;

      const productsData =
        category === "All"
          ? normalizeGroupedProducts(responseProducts)
          : [createCategoryGroup(category, responseProducts)];

      console.log("Fetched products >>>>", productsData);
      setProducts(productsData);
      setFilteredProducts(productsData);
      setProductCategory(category);
      setActiveCategory(category);
      setProductPages((prev) => ({
        ...prev,
        [category]: 2,
      }));
      setProductHasMore((prev) => ({
        ...prev,
        [category]: totalPages > 1,
      }));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const handleCategoryClick = (categoryName) => {
    setActiveCategory(categoryName);
    setProductCategory(categoryName);
    fetchProducts(categoryName);
  };

  // Fetch more products for a specific category
  const fetchMoreProducts = async (categoryName) => {
    if (!productHasMore[categoryName] || loadingMoreProducts[categoryName]) {
      console.log(`Skipping fetch for ${categoryName}:`, {
        hasMore: productHasMore[categoryName],
        loading: loadingMoreProducts[categoryName],
      });
      return;
    }

    console.log(
      `Fetching more products for ${categoryName}, page:`,
      productPages[categoryName]
    );

    setLoadingMoreProducts((prev) => ({
      ...prev,
      [categoryName]: true,
    }));

    try {
      const currentPage = productPages[categoryName] || 2;
      const isAllCategory = categoryName === "All";
      const apiUrl = isAllCategory
        ? `${BASE_URL}/users/v2/home-screen-products?page=${currentPage}&limit=100`
        : `${BASE_URL}/users/home-screen-searched-products?name=&category=${encodeURIComponent(
          categoryName
        )}&subCategory=&page=${currentPage}&limit=8`;

      const res = await axios.get(apiUrl);

      console.log(`Response for ${categoryName}:`, res.data);

      const newProducts = res?.data?.data?.products || [];
      const totalPages = res?.data?.data?.totalPages || 0;

      console.log(
        `Got ${newProducts.length} products, currentPage: ${currentPage}, totalPages: ${totalPages}`
      );

      // Check if we've reached the last page
      if (currentPage >= totalPages || newProducts.length === 0) {
        console.log(`No more products for ${categoryName}`);
        setProductHasMore((prev) => ({
          ...prev,
          [categoryName]: false,
        }));
      }

      if (newProducts.length > 0) {
        setFilteredProducts((prev) =>
          prev.map((categoryData) => {
            if (categoryData.category === categoryName) {
              console.log(
                `Adding ${newProducts.length} products to ${categoryName}`
              );
              return {
                ...categoryData,
                products: removeDuplicateProducts(
                  [
                    ...(Array.isArray(categoryData?.products)
                      ? categoryData.products
                      : []),
                    ...newProducts.map((product) => ({
                      ...product,
                      category: categoryName,
                    })),
                  ]
                ),
              };
            }
            return categoryData;
          })
        );

        setProductPages((prev) => ({
          ...prev,
          [categoryName]: currentPage + 1,
        }));
      }
    } catch (error) {
      console.log("fetch more products error >>>>", error);
    } finally {
      setLoadingMoreProducts((prev) => ({
        ...prev,
        [categoryName]: false,
      }));
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

  // Fetch jobs (paginated)
  const fetchJobs = async (pageNum) => {
    if (!jobHasMore || loadingJobs) return;

    try {
      setLoadingJobs(true);

      const res = await axios.get(`${BASE_URL}/users/get-jobs?page=${pageNum}`);
      console.log(res, "resresresresres");
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

  // Handle job like/unlike
  const handleJobLike = async (jobId) => {
    try {
      const res = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({ data: { success: true } });
        }, 300);
      });

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

  // Infinite scroll for services and jobs
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

  // Infinite scroll for products by category
  useEffect(() => {
    if (showServices || showJobs || filteredProducts.length === 0) return;

    let ticking = false;
    let debounceTimer = null;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      // Clear any existing debounce timer
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      requestAnimationFrame(() => {
        // Add debounce to prevent rapid-fire calls
        filteredProducts.forEach((categoryData) => {
          const categoryRef = categoryRefs.current[categoryData.category];
          if (!categoryRef) return;

          const rect = categoryRef.getBoundingClientRect();
          const threshold = 800; // Trigger when 800px away from bottom of category section

          // Check if we're near the bottom of this category section
          if (
            rect.bottom <= window.innerHeight + threshold &&
            rect.bottom > 0 &&
            productHasMore[categoryData.category] &&
            !loadingMoreProducts[categoryData.category] &&
            !fetchingRef.current[categoryData.category]
          ) {
            fetchMoreProducts(categoryData.category);
          }
        });

        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [
    showServices,
    showJobs,
    filteredProducts,
    productHasMore,
    loadingMoreProducts,
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
      setProducts(res?.data?.data);
      setFilteredProducts(res?.data?.data);
    } catch (error) {
      console.log("home screen products err >>>>", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
              onClick={() => handleCategoryClick("All")}
              className={`${productCategory == "All"
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
                  onClick={() => handleCategoryClick(category?.name || "All")}
                  className={`${productCategory === category?.name
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
            className={`py-3 ${!showServices && !showJobs
              ? "blue-bg text-white"
              : "bg-[#F7F7F7] text-black"
              } text-base flex items-center  gap-1 font-bold px-5 mr-4 rounded-2xl text-nowrap`}
          >
            Apply Filters <CiFilter size={25} />
          </button>
          <button
            type="button"
            onClick={() => handleShowServices("products")}
            className={`py-3 ${!showServices && !showJobs
              ? "blue-bg text-white"
              : "bg-[#F7F7F7] text-black"
              } text-base font-bold px-5 rounded-l-2xl`}
          >
            Products
          </button>
          <button
            type="button"
            onClick={() => handleShowServices("services")}
            className={`py-3 ${showServices ? "blue-bg text-white" : "bg-[#F7F7F7] text-black"
              } text-base font-bold px-5`}
          >
            Services
          </button>
          <button
            type="button"
            onClick={() => handleShowServices("jobs")}
            className={`py-3 ${showJobs ? "blue-bg text-white" : "bg-[#F7F7F7] text-black"
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

          <div className="w-full mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    const productItems = Array.isArray(productList?.products)
                      ? productList.products
                      : [];

                    return (
                      <div
                        key={index}
                        className="mt-10"
                        ref={(el) => {
                          if (productList?.category) {
                            categoryRefs.current[productList.category] = el;
                          }
                        }}
                      >
                        {console.log("Rendering products for category >>>>", productList?.category, productList)}
                        <div className="w-full mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          {productItems.length > 0 &&
                            productItems.map((product, i) => (
                              <ProductCard
                                product={product}
                                key={product?.id || product?._id || `${product?.name}-${product?.category}-${i}`}
                              />
                            ))}
                        </div>

                        {/* Loading indicator for this category */}
                        {loadingMoreProducts[productList?.category] && (
                          <div className="flex justify-center my-8">
                            <Loader w="fit" />
                          </div>
                        )}

                        {/* End message for this category */}
                        {!productHasMore[productList?.category] &&
                          productItems.length > 0 && (
                            <div className="flex justify-center my-8">
                              <p className="text-gray-500 text-sm">
                                🎉 You've explored all products in{" "}
                                {productList?.category}
                              </p>
                            </div>
                          )}
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
