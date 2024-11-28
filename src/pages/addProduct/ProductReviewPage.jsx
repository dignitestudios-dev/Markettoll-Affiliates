import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ProductDataReview } from "../../context/addProduct";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "../../api/api";

const ProductReviewPage = () => {
  const navigate = useNavigate();
  const { productData } = useContext(ProductDataReview);
  const { user } = useContext(AuthContext);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log("productData from product review >>>>", user);

  const handleModal = () => {
    setOpenModal(!openModal);
  };

  const uploadProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();

      productData?.productImages.forEach((productImages) => {
        formData.append("images", productImages);
      });

      formData.append("displayImageIndex", productData?.coverImageIndex);
      formData.append("name", productData?.productName);
      formData.append("description", productData?.description);
      formData.append("category", productData?.productCategory);
      formData.append("subCategory", productData?.productSubCategory);
      formData.append("country", "United States");
      formData.append("state", productData?.selectedState);
      formData.append("city", productData?.selectedCity);
      formData.append(
        "fulfillmentMethod",
        JSON.stringify(productData?.fulfillmentMethod)
      );
      formData.append("pickupAddress", productData?.pickupAddress || "");
      formData.append("price", productData?.price);
      formData.append("quantity", productData?.quantity);

      const response = await axios.post(`${BASE_URL}/users/product`, formData, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Handle success
      console.log("Product uploaded successfully:", response.data);
      toast.success(response.data.message);
      navigate("/product-review");
      return response.data;
    } catch (error) {
      console.error("Error uploading product:", error);
      if (error.status == 409) {
        // navigate("/subscriptions");
        setOpenModal(true);
      }
      if (error.status == 403) {
        handleModal();
      }
      toast.error(error?.response?.data?.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="padding-x w-full py-6">
      <div className="w-full px-4 md:px-8 lg:px-12 py-12 rounded-[30px] bg-[#F7F7F7]">
        <div className="w-full flex flex-col lg:flex-row justify-start gap-x-8 gap-y-6">
          <div className="w-full">
            {productData.productImages &&
              productData.productImages.length > 0 && (
                <img
                  src={URL.createObjectURL(
                    productData.productImages[productData?.coverImageIndex]
                  )}
                  alt="product image"
                  className="w-full h-auto lg:h-[336px] rounded-[20px]"
                />
              )}
            <div className="w-full grid grid-cols-4 mt-3 gap-3">
              {productData.productImages &&
                productData.productImages
                  .slice(1)
                  .map((file, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(file)}
                      alt={`Product Thumbnail ${index + 1}`}
                      className="rounded-xl object-cover"
                      style={{ width: "100%", height: "97px" }}
                    />
                  ))}
            </div>
          </div>

          <div className="w-full flex flex-col items-start gap-5">
            <div className="w-full flex flex-col lg:flex-row items-start lg:items-center justify-between">
              <h2 className="text-[20px] blue-text font-bold">
                {productData?.productName}
              </h2>
              <h3 className="text-[24px] font-bold">
                ${productData?.price}.00
              </h3>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <div className="grid grid-cols-2 gap-y-3">
                <p className="text-[13px] text-[#7C7C7C] font-medium">City</p>
                <p className="text-[13px] font-medium">
                  {productData?.selectedCity}
                </p>
                <p className="text-[13px] text-[#7C7C7C] font-medium">
                  Category
                </p>
                <p className="text-[13px] font-medium">
                  {productData?.productCategory}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-y-3">
                <p className="text-[13px] text-[#7C7C7C] font-medium">State</p>
                <p className="text-[13px] font-medium">
                  {productData?.selectedState}
                </p>
                <p className="text-[13px] text-[#7C7C7C] font-medium">
                  Sub Category
                </p>
                <p className="text-[13px] font-medium">
                  {productData?.productSubCategory}
                </p>
              </div>
            </div>

            <div className="w-full">
              <p className="text-[13px] text-[#7C7C7C] font-medium mb-3">
                Pickup Address
              </p>
              <p className="text-[13px] font-medium">
                {productData?.pickupAddress}
              </p>
            </div>

            <div className="w-full">
              <p className="text-[16px] text-[#003DAC] font-bold mb-3">
                Description
              </p>
              <p className="text-[14px] font-normal">
                {productData?.description}
              </p>
            </div>

            <div className="w-full flex items-center gap-3">
              <p className="text-[13px] text-[#7C7C7C] font-medium">
                Available Quantity:
              </p>
              <p className="text-[13px] font-medium">{productData?.quantity}</p>
            </div>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <Link
            to="/add-product"
            className="bg-white light-blue-text py-3 text-center rounded-full w-full text-sm font-bold"
          >
            Back
          </Link>
          <button
            type="button"
            onClick={uploadProduct}
            className="blue-bg text-white py-3 text-center rounded-full w-full text-sm font-bold"
          >
            {loading ? "Posting..." : " Post Now"}
          </button>
        </div>
      </div>
      <Modal openModal={openModal} onclick={handleModal} />
    </div>
  );
};

export default ProductReviewPage;

const Modal = ({ openModal, onclick }) => {
  return (
    openModal && (
      <div className="w-full fixed inset-0 h-screen z-50 bg-[rgba(0,0,0,0.5)] flex items-center justify-center px-4">
        <div className="w-full lg:w-[400px] p-10 relative bg-white flex flex-col items-start gap-3 rounded-2xl">
          <p className="font-semibold text-base">Your have no postings left!</p>
          <p className="text-[#5c5c5c] font-medium text-sm">
            Would you like to purchase a new subscription plan?
          </p>
          <div className="w-full flex items-center justify-end gap-4">
            <Link
              to="/account/subscriptions"
              className="text-sm font-semibold text-red-500"
            >
              Yes
            </Link>
            <button
              type="button"
              className="text-sm font-semibold"
              onClick={onclick}
            >
              No
            </button>
          </div>
        </div>
      </div>
    )
  );
};
