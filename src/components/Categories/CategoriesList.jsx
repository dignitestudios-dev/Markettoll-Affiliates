import React, { useContext, useEffect, useState } from "react";
import SubCategoryCard from "../Global/SubCategoryCard";
import { useParams } from "react-router-dom";
import Loader from "../Global/Loader";
import { BASE_URL } from "../../api/api";
import axios from "axios";
import { AuthContext } from "../../context/authContext";

const CategoriesList = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
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
    fetchCategories();
  }, []);

  if (loading) {
    return <Loader />;
  }

  const filteredProducts = products?.find((pros) => {
    return pros.name == category;
  });

  return (
    <div className="w-full pt-20">
      {/* {filteredProducts?.length > 0 ? ( */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts?.subCategories?.map((subCategory, index) => {
          return <SubCategoryCard key={index} subCategory={subCategory} />;
        })}
      </div>
      {/* ) : (
        <div className="w-full"></div>
      )} */}
    </div>
  );
};

export default CategoriesList;
