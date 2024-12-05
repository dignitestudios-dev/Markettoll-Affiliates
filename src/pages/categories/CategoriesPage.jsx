import React, { useContext, useEffect, useState } from "react";
import CategoriesSidebar from "../../components/Categories/CategoriesSidebar";
import { AuthContext } from "../../context/authContext";
import { BASE_URL } from "../../api/api";
import axios from "axios";
import Loader from "../../components/Global/Loader";
import { useParams } from "react-router-dom";

const CategoriesPage = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

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

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="padding-x flex items-start gap-6 py-12 w-full">
      <div className="lg:max-w-[40%]">
        <CategoriesSidebar products={products} />
      </div>
      <div className="w-full lg:w-[60%]">{children}</div>
    </div>
  );
};

export default CategoriesPage;
