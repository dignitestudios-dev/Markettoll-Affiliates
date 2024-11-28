import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import ProductCard from "../Global/ProductCard";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";
import Loader from "../Global/Loader";

const CategoryProductsList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const previousPage = location.state?.from || "/";
  const { category } = useParams();
  // console.log("category >>>", category);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const handleNavigate = () => {
    if (previousPage === "/") {
      navigate("/");
    } else if (previousPage === "categories") {
      navigate("/categories/:category");
    } else {
      navigate("/categories");
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/users/home-screen-products`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      // console.log("category products >>", res?.data?.data);
      setProducts(res?.data?.data);
    } catch (error) {
      console.log("category products err >>>>", error);
    } finally {
      setLoading(false);
    }
  };

  const categoryProducts = products.find((product) => {
    return product.category === category;
  });
  // console.log(" >>>>>>", categoryProducts);

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <div className="flex flex-col items-start gap-3">
        <button
          type="button"
          onClick={handleNavigate}
          className="flex items-center gap-1"
        >
          <GoArrowLeft className="light-blue-text text-xl" />
          <span className="font-medium text-sm text-[#5C5C5C]">Back</span>
        </button>

        <span className="blue-text text-[28px] font-bold">{category}</span>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-5">
        {products?.length > 0 ? (
          <>
            {categoryProducts?.products?.length > 0 ? (
              <>
                {categoryProducts?.products?.map((prod, index) => {
                  return <ProductCard product={prod} key={index} />;
                })}
              </>
            ) : (
              <h2 className="text-sm blue-text">
                No Products Found for this category
              </h2>
            )}
          </>
        ) : (
          <h2>No Products Found for this category</h2>
        )}
      </div>
    </div>
  );
};

export default CategoryProductsList;
