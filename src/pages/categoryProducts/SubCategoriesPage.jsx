import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";
import ProductCard from "../../components/Global/ProductCard";
import { FiArrowLeft } from "react-icons/fi";

const SubCategoriesPage = () => {
  const { category, subCategory } = useParams();
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const location = useLocation();
  console.log(category);
  console.log(category);

  const subCategoryProducts = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/users/home-screen-searched-products?name=o&category=${encodeURIComponent(
          category
        )}&subCategory=${encodeURIComponent(subCategory)}&page=1`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      // console.log("sub-category products >>>", res?.data);
      setProducts(res?.data?.data);
    } catch (error) {
      console.log("err >>>", error);
    }
  };

  useEffect(() => {
    subCategoryProducts();
  }, []);
  return (
    <div className="padding-x py-6 w-full">
      <Link
        to={location?.state ? location?.state?.from : "/"}
        className="flex items-center gap-1 text-gray-500 text-sm font-medium"
      >
        <FiArrowLeft className="text-lg light-blue-text" />
        Back
      </Link>
      <h2 className="font-bold blue-text text-2xl mt-3">{subCategory}</h2>
      <div className="w-full mt-8 min-h-[40vh]">
        {products?.length > 0 ? (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products?.map((product, index) => {
              return <ProductCard key={index} product={product} />;
            })}
          </div>
        ) : (
          <div className="w-full">
            <h2>No Products Found</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubCategoriesPage;
