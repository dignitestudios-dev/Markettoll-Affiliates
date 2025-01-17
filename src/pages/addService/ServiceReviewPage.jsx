import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ProductDataReview } from "../../context/addProduct";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";
import ButtonLoader from "../../components/Global/ButtonLoader";
import { GoArrowLeft } from "react-icons/go";

const ServiceReviewPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  // const { serviceData } = useContext(ProductDataReview);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const serviceData = location?.state?.serviceData;
  // console.log(serviceData);

  const [displayImage, setDisplayImage] = useState(null);
  useEffect(() => {
    if (serviceData?.productImages?.length > 0) {
      // Set the initial display image based on `coverImageIndex`
      const defaultDisplayImage =
        serviceData.productImages[serviceData.coverImageIndex] ||
        serviceData.productImages[0];
      setDisplayImage(defaultDisplayImage);
    }
  }, [serviceData]);

  const handleThumbnailClick = (image) => {
    setDisplayImage(image);
  };

  useEffect(() => {
    if (!serviceData) {
      return navigate("/add-service");
    }
  }, [serviceData]);

  const uploadService = async () => {
    setLoading(true);
    try {
      const formData = new FormData();

      serviceData?.productImages.forEach((productImages) => {
        formData.append("images", productImages);
      });

      formData.append("displayImageIndex", serviceData?.coverImageIndex);
      formData.append("name", serviceData?.serviceName);
      formData.append("description", serviceData?.description);
      formData.append("country", "United States");
      formData.append("state", serviceData?.selectedState);
      formData.append("city", serviceData?.selectedCity);

      formData.append("price", serviceData?.price);

      const response = await axios.post(`${BASE_URL}/users/service`, formData, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // console.log("Service uploaded successfully:", response.data);
      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem("serviceId", JSON.stringify(response.data.data));
        navigate("/boost-service", {
          state: {
            from: window.location.href,
            type: "service",
            id: response?.data?.data?._id,
          },
        });
        return response.data;
      }
    } catch (error) {
      console.error("Error uploading service:", error);
      if (error) {
        toast.error(error?.response?.data?.message);
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

  const handleNavigateBack = () => {
    navigate("/add-service", {
      state: { serviceData: location?.state?.serviceData },
    });
  };

  return (
    <div className="padding-x py-6 w-full">
      <div className="w-full px-4 md:px-8 lg:px-12 py-5 rounded-[30px] bg-[#F7F7F7]">
        <button
          type="button"
          onClick={handleNavigateBack}
          className="mb-5 flex items-center justify-start gap-1.5"
        >
          <GoArrowLeft className="text-[#0098EA]" />{" "}
          <span className="text-sm text-gray-500 font-medium">Back</span>
        </button>
        <div className="w-full bg-white px-4 md:px-8 lg:px-12 py-12 rounded-[30px]">
          <div className="w-full flex flex-col lg:flex-row justify-start gap-x-8 gap-y-6">
            <div className="w-full">
              {displayImage && (
                <img
                  src={URL.createObjectURL(displayImage)}
                  alt="Service Image"
                  className="w-full h-auto lg:h-[336px] rounded-[20px]"
                />
              )}
              {/* Display the thumbnail images */}
              <div className="w-full overflow-x-scroll flex items-start gap-5 mt-3 thumbnail-scroll">
                {serviceData?.productImages?.map((image, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(image)}
                    alt={`Thumbnail ${index + 1}`}
                    className={`rounded-xl h-[97px] w-[111px] object-cover cursor-pointer ${
                      image === displayImage ? "border-2 border-blue-500" : ""
                    }`} // Highlight the active thumbnail
                    onClick={() => handleThumbnailClick(image)}
                  />
                ))}
              </div>
            </div>

            <div className="w-full flex flex-col items-start gap-5">
              <div className="w-full flex flex-col lg:flex-row items-start lg:items-center justify-between">
                <h2 className="text-[20px] blue-text font-bold">
                  {serviceData?.serviceName}
                </h2>
                <h3 className="text-[24px] font-bold">${serviceData?.price}</h3>
              </div>

              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <div className="flex items-center gap-4 lg:gap-10 gap-y-3">
                  <p className="text-[13px] text-[#7C7C7C] font-medium">City</p>
                  <p className="text-[13px] font-medium">
                    {serviceData?.selectedCity}
                  </p>
                </div>
                <div className="flex items-center gap-4 lg:gap-10 gap-y-3">
                  <p className="text-[13px] text-[#7C7C7C] font-medium">
                    State
                  </p>
                  <p className="text-[13px] font-medium">
                    {serviceData?.selectedState}
                  </p>
                </div>
              </div>

              <div className="w-full">
                <p className="text-[16px] text-[#003DAC] font-bold mb-3">
                  Description
                </p>
                <p className="text-[14px] font-normal">
                  {serviceData?.description}
                </p>
              </div>
            </div>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            <button
              type="button"
              onClick={handleNavigateBack}
              className="bg-white border light-blue-text py-3 text-center rounded-full w-full text-sm font-bold"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => uploadService()}
              className="blue-bg text-white py-3 text-center rounded-full w-full text-sm font-bold h-[50px]"
            >
              {loading ? <ButtonLoader /> : "Post Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceReviewPage;
