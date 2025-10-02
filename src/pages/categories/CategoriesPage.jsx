import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import CategoriesSidebar from "../../components/Categories/CategoriesSidebar";
import { AuthContext } from "../../context/authContext";
import { BASE_URL } from "../../api/api";
import axios from "axios";
import Loader from "../../components/Global/Loader";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../../components/Global/ProductCard";

const CategoriesPage = () => {
  const [products, setProducts] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState(null);
  const [loading, setLoading] = useState(false);

  const { user } = useContext(AuthContext);
  const { category } = useParams();
  const [selectedCategory, setSelectedCategory] = useState("Automotive");

  const scrollContainerRef = useRef(null);

  const fetchData = async (callback) => {
    try {
      setLoading(true);
      await callback();
    } catch (error) {
      console.error("API error >>>", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all categories
  const fetchProducts = useCallback(async () => {
    await fetchData(async () => {
      const { data } = await axios.get(`${BASE_URL}/users/product-categories`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setProducts(data?.data || []);
    });
  }, [user?.token]);

  // Fetch products for selected category
  const fetchCategoryProduct = useCallback(async () => {
    await fetchData(async () => {
      const { data } = await axios.get(
        `${BASE_URL}/users/home-screen-searched-products?name=&category=${selectedCategory}&subCategory=&page=1&limit=12`
      );
      // const match = data?.data?.find((p) => p.category == selectedCategory);
      // console.log(match, "math Product");
      console.log(data, "dataItems,");
      setCategoryProducts(data?.data?.products || null);
    });
  }, [user?.token, selectedCategory]);

  // Effects
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchCategoryProduct();
  }, [fetchCategoryProduct]);

  // Scroll handlers
  const scroll = (dir) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: dir === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="padding-x flex flex-col lg:flex-row items-start gap-x-20 py-12 w-full">
      {/* Mobile category scroller */}
      <div className="lg:w-[25%] lg:hidden w-full overflow-x-hidden">
        <div className="relative w-full">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-[#0098EA] text-white py-1 px-3 rounded-full z-10 shadow"
          >
            &lt;
          </button>

          <div
            ref={scrollContainerRef}
            className="w-full flex items-center justify-start gap-2 overflow-x-auto py-2 category-buttons px-5"
          >
            {products.map((pro, index) => (
              <Link
                // to={`/home/categories/${pro?.name}`}
                key={index}
                onClick={() => setSelectedCategory(pro?.name)}
                className={`${
                  pro?.name === category
                    ? "bg-[#0098EA] text-white"
                    : "bg-gray-100 text-black"
                } px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap`}
              >
                {pro?.name}
              </Link>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-[#0098EA] text-white py-1 px-3 rounded-full z-10 shadow"
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="lg:w-[25%] hidden lg:block">
        <CategoriesSidebar
          handleCategoryTab={setSelectedCategory}
          products={products}
          selectedCategory={selectedCategory}
        />
      </div>

      {/* Products grid */}

      <div className="w-full mt-10 lg:w-[75%]">
        <div className="w-full flex items-center justify-end">
          <Link
            to={`/home/categories/${selectedCategory}`}
            className="text-[#6C6C6C] text-[18px] font-medium"
          >
            See all
          </Link>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mt-5">
            {categoryProducts?.length ? (
              categoryProducts?.map((prod, index) => (
                <ProductCard product={prod} key={index} />
              ))
            ) : (
              <h2 className="text-sm blue-text">
                No Products Found for this category
              </h2>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
