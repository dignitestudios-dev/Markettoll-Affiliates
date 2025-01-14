import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ProductDataReview } from "../../context/addProduct";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import ButtonLoader from "../../components/Global/ButtonLoader";

const ProductReviewPage = () => {
  const navigate = useNavigate();
  // const { productData } = useContext(ProductDataReview);
  const { user } = useContext(AuthContext);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [displayImage, setDisplayImage] = useState(null);
  const { state } = useLocation();
  const handleNavigate = () => {
    navigate("/add-product", { state: { productData: state?.productData } });
  };

  // Set the default display image on component load
  useEffect(() => {
    if (state?.productData?.productImages?.length > 0) {
      const defaultDisplayImage =
        state?.productData?.productImages.find(
          (image) => image.displayImage === true
        ) || state?.productData?.productImages[0];
      setDisplayImage(defaultDisplayImage);
    }
  }, [state]);

  // Handle thumbnail click to update display image
  const handleThumbnailClick = (image) => {
    setDisplayImage(image);
  };

  const handleModal = () => {
    setOpenModal(!openModal);
  };

  const uploadProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();

      state?.productData?.productImages.forEach((productImages) => {
        formData.append("images", productImages);
      });

      formData.append("displayImageIndex", state?.productData?.coverImageIndex);
      formData.append("name", state?.productData?.productName);
      formData.append("description", state?.productData?.description);
      formData.append("category", state?.productData?.productCategory);
      formData.append("subCategory", state?.productData?.productSubCategory);
      formData.append("country", "United States");
      formData.append("state", state?.productData?.selectedState);
      formData.append("city", state?.productData?.selectedCity);
      formData.append(
        "fulfillmentMethod",
        JSON.stringify(state?.productData?.fulfillmentMethod)
      );
      formData.append("pickupAddress", state?.productData?.pickupAddress || "");
      formData.append("price", state?.productData?.price);
      formData.append("quantity", state?.productData?.quantity);

      const response = await axios.post(`${BASE_URL}/users/product`, formData, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Handle success
      // console.log("Product uploaded successfully:", response.data);
      toast.success(response.data.message);
      navigate("/would-you-boost-your-product", {
        state: {
          from: window.location.href,
          type: "product",
          id: response?.data?.data?._id,
        },
      });
      localStorage.setItem("product", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      // console.error("Error uploading product:", error);
      if (error) {
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
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
    <div className="padding-x w-full py-6 overflow-hidden">
      <div className="w-full px-4 md:px-8 lg:px-12 py-12 rounded-[30px] bg-[#F7F7F7]">
        <div className="w-full px-4 md:px-8 lg:px-12 py-12 rounded-[30px] bg-[#fff]">
          <div className="w-full flex flex-col lg:flex-row justify-start gap-x-8 gap-y-6">
            <div className="w-full lg:w-1/2">
              {/* Main displayed image */}
              {displayImage && (
                <img
                  src={URL.createObjectURL(displayImage)}
                  alt="product thumbnail"
                  className="w-full h-auto lg:h-[336px] rounded-[20px]"
                />
              )}

              {/* Thumbnails */}
              <div className="w-full flex gap-5 overflow-x-auto mt-3 thumbnail-scroll">
                {state?.productData?.productImages?.map((image, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(image)}
                    alt={`Thumbnail ${index + 1}`}
                    className={`rounded-xl h-[97px] w-[97px] object-cover cursor-pointer ${
                      image === displayImage ? "border-2 border-blue-500" : ""
                    }`}
                    onClick={() => handleThumbnailClick(image)}
                  />
                ))}
              </div>
            </div>

            <div className="w-full lg:w-1/2 flex flex-col items-start gap-5">
              <div className="w-full flex flex-col lg:flex-row items-start lg:items-center justify-between">
                <h2 className="text-[20px] blue-text font-bold">
                  {state?.productData?.productName}
                </h2>
                <h3 className="text-[24px] font-bold">
                  ${state?.productData?.price}.00
                </h3>
              </div>

              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <div className="grid grid-cols-2 gap-y-3">
                  <p className="text-[13px] text-[#7C7C7C] font-medium">City</p>
                  <p className="text-[13px] font-medium">
                    {state?.productData?.selectedCity}
                  </p>
                  <p className="text-[13px] text-[#7C7C7C] font-medium text-wrap">
                    Category
                  </p>
                  <p className="text-[13px] font-medium">
                    {state?.productData?.productCategory}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-y-3">
                  <p className="text-[13px] text-[#7C7C7C] font-medium">
                    State
                  </p>
                  <p className="text-[13px] font-medium">
                    {state?.productData?.selectedState}
                  </p>
                  <p className="text-[13px] text-[#7C7C7C] font-medium">
                    Sub Category
                  </p>
                  <p className="text-[13px] font-medium">
                    {state?.productData?.productSubCategory}
                  </p>
                </div>
              </div>

              <div className="w-full">
                <p className="text-[13px] text-[#7C7C7C] font-medium mb-3">
                  Pickup Address
                </p>
                <p className="text-[13px] font-medium">
                  {state?.productData?.pickupAddress}
                </p>
              </div>

              <div className="w-full">
                <p className="text-[16px] text-[#003DAC] font-bold mb-3">
                  Description
                </p>
                <p className="text-[14px] font-normal w-[90%] text-wrap break-words">
                  {state?.productData?.description}
                </p>
              </div>

              <div className="w-full flex items-center gap-3">
                <p className="text-[13px] text-[#7C7C7C] font-medium">
                  Available Quantity:
                </p>
                <p className="text-[13px] font-medium">
                  {state?.productData?.quantity}
                </p>
              </div>
            </div>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            <button
              type="button"
              onClick={handleNavigate}
              className="bg-[#F7F7F7] light-blue-text py-3 text-center rounded-full w-full text-sm font-bold"
            >
              Back
            </button>
            <button
              type="button"
              onClick={uploadProduct}
              className="blue-bg text-white py-3 text-center rounded-full w-full text-sm font-bold"
            >
              {loading ? <ButtonLoader /> : " Post Now"}
            </button>
          </div>
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
