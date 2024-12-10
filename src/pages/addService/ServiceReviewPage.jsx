import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ProductDataReview } from "../../context/addProduct";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";

const ServiceReviewPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { serviceData } = useContext(ProductDataReview);
  const [loading, setLoading] = useState(false);
  console.log(serviceData);

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

  const handleAddService = async () => {
    navigate("/boost-service");
  };
  const uploadService = async () => {
    setLoading(true);
    try {
      const formData = new FormData();

      serviceData?.productImages.forEach((productImages) => {
        formData.append("images", productImages);
      });

      formData.append("displayImageIndex", serviceData?.coverImageIndex);
      formData.append("name", serviceData?.productName);
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

      // Handle success
      console.log("Service uploaded successfully:", response.data);
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
    <div className="padding-x py-6 w-full">
      <div className="w-full px-4 md:px-8 lg:px-12 py-12 rounded-[30px] bg-[#F7F7F7]">
        <div className="w-full flex flex-col lg:flex-row justify-start gap-x-8 gap-y-6">
          <div className="w-full">
            {displayImage && (
              <img
                src={displayImage?.name} // Assuming `name` is the file name for the image URL
                alt="Service Image"
                className="w-full h-auto lg:h-[336px] rounded-[20px]"
              />
            )}
            {/* Display the thumbnail images */}
            <div className="w-full grid grid-cols-4 mt-3 gap-3">
              {serviceData?.productImages?.map((image, index) => (
                <img
                  key={index}
                  src={image?.name} // Use `name` as the image source
                  alt={`Thumbnail ${index + 1}`}
                  className={`rounded-xl h-[97px] w-full object-cover cursor-pointer ${
                    image?.name === displayImage?.name
                      ? "border-2 border-blue-500"
                      : ""
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
              <div className="grid grid-cols-2 gap-y-3">
                <p className="text-[13px] text-[#7C7C7C] font-medium">City</p>
                <p className="text-[13px] font-medium">
                  {serviceData?.selectedCity}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-y-3">
                <p className="text-[13px] text-[#7C7C7C] font-medium">State</p>
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
          <Link
            to="/add-service"
            className="bg-white light-blue-text py-3 text-center rounded-full w-full text-sm font-bold"
          >
            Back
          </Link>
          <button
            type="button"
            onClick={() => uploadService()}
            className="blue-bg text-white py-3 text-center rounded-full w-full text-sm font-bold"
          >
            {loading ? "Posting..." : "Post Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceReviewPage;
