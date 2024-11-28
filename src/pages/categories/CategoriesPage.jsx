import React, { useContext, useEffect, useState } from "react";
import CategoriesSidebar from "../../components/Categories/CategoriesSidebar";
import CategoriesList from "../../components/Categories/CategoriesList";
import { AuthContext } from "../../context/authContext";
import { BASE_URL } from "../../api/api";
import axios from "axios";
import Loader from "../../components/Global/Loader";

const CategoriesPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/users/home-screen-products`, {
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

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="padding-x flex items-start gap-6 py-12">
      <div className="lg:w-[290px]">
        <CategoriesSidebar products={products} />
      </div>
      <div className="">
        <CategoriesList />
      </div>
    </div>
  );
};

export default CategoriesPage;
