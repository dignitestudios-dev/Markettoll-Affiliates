import React, { useContext, useEffect, useRef, useState } from "react";
import CategoriesSidebar from "../../components/Categories/CategoriesSidebar";
import { AuthContext } from "../../context/authContext";
import { BASE_URL } from "../../api/api";
import axios from "axios";
import Loader from "../../components/Global/Loader";
import { Link, useParams } from "react-router-dom";

const CategoriesPage = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const { category } = useParams();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/users/product-categories`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setProducts(res?.data?.data);
      // console.log("products >>>", res?.data?.data);
    } catch (error) {
      console.log("home screen products err >>>>", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const scrollContainerRef = useRef(null);

  // Function to scroll left
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  // Function to scroll right
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="padding-x flex flex-col lg:flex-row items-start gap-x-20 py-12 w-full">
      <div className="lg:w-[25%] lg:hidden w-full overflow-x-hidden">
        <div className="relative w-full">
          {/* Left scroll button */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-[#0098EA] text-white py-1 px-3 rounded-full z-10 shadow"
          >
            &lt;
          </button>

          <div
            ref={scrollContainerRef}
            className="w-full flex items-center justify-start gap-2 overflow-x-auto py-2 category-buttons px-5"
          >
            {products?.map((pro, index) => (
              <Link
                to={`/home/categories/${pro?.name}`}
                key={index}
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

          {/* Right scroll button */}
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-[#0098EA] text-white py-1 px-3 rounded-full z-10 shadow"
          >
            &gt;
          </button>
        </div>
      </div>
      <div className="lg:w-[25%] hidden lg:block">
        <CategoriesSidebar products={products} />
      </div>
      <div className="w-full lg:w-[75%]">{children}</div>
    </div>
  );
};

export default CategoriesPage;
