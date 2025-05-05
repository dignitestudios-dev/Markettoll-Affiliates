import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { GoPlus } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { STATES } from "../../constants/states";
import { ProductDataReview } from "../../context/addProduct";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";
import Loader from "../Global/Loader";
import ButtonLoader from "../Global/ButtonLoader";

const EditServiceForm = () => {
  const [service, setService] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [serviceName, setServiceName] = useState(service?.name || "");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const location = useLocation();

  const navigateBack = () => {
    navigate(-1);
  };

  const handleFetchService = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/users/service/${serviceId}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setService(res?.data?.data);
    } catch (error) {
      console.log("service details err >>>", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchService();
  }, []);

  useEffect(() => {
    if (service) {
      setServiceName(service?.name);
      setDescription(service?.description);
      setPrice(service?.price);
      setSelectedState(service?.state);
      setSelectedCity(service?.city);
      setProductImages(service?.images);
      const existingImages = service?.images || [];
      setProductImages(existingImages);
    }
  }, [service]);

  if (loading) {
    return <Loader />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdate(true);

    if (!price) {
      toast.error("Please add price");
      return;
    } else if (price <= 0) {
      toast.error("Price can not be 0");
    }

    try {
      const response = await axios.put(
        `${BASE_URL}/users/service/${serviceId}`,
        { price: price },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      console.log("Service uploaded successfully:", response.data);
      if (response.data.success) {
        toast.success(response.data.message);
        navigate(`/services/${response?.data?.data?._id}`);
        return response.data;
      }
    } catch (error) {
      console.error("Error uploading service:", error);
      if (error.status == 409) {
        setOpenModal(true);
      }
      if (error.status == 403) {
        handleModal();
      }
      toast.error(error?.response?.data?.message);
      throw error;
    } finally {
      setUpdate(false);
    }
  };

  const handleNavigateBack = () => {
    navigate(location?.state?.from || "/");
  };

  return (
    <div className="padding-x w-full py-6">
      <form
        onSubmit={handleSubmit}
        className="w-full bg-[#F7F7F7] rounded-[30px] px-4 lg:px-8 py-12"
      >
        <div className="w-full flex items-center gap-6">
          <button
            type="button"
            onClick={navigateBack}
            className="flex items-center gap-1"
          >
            <GoArrowLeft className="light-blue-text text-xl" />{" "}
            <span className="text-sm font-medium text-[#5C5C5C]">Back</span>
          </button>

          <h2 className="blue-text font-bold text-[24px]">
            Add Service Details
          </h2>
        </div>

        <div className="w-full padding-x mt-6">
          <label htmlFor="productImage" className="text-sm font-semibold">
            Photos
          </label>
          <div className="w-full flex items-start justify-start mt-2 gap-6">
            {/* Image Upload Area */}
            {/* <div className="flex items-start flex-col justify-start">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center h-[170px] w-[170px] rounded-[20px] cursor-pointer bg-white hover:bg-gray-100 relative"
              >
                <div className="flex flex-col items-center justify-center w-full h-full rounded-full">
                  <GoPlus className="w-[48px] h-[48px] text-light-blue" />
                </div>
                <input
                  onChange={handleImageChange}
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  disabled={productImages.length >= 5}
                />
              </label>
              <span className="text-sm font-normal mt-1 mx-auto">
                Upload Product Photo
              </span>
            </div> */}

            {/* Image Preview and Selection */}
            <div className="flex gap-6">
              {productImages.map((image, index) => {
                const imageUrl =
                  image.url ||
                  (image.file ? URL.createObjectURL(image.file) : "");
                return (
                  <div key={index} className="relative">
                    <img
                      src={imageUrl}
                      alt={`product-image-${index}`}
                      className="h-[170px] w-[170px] rounded-[20px] object-cover"
                    />
                    {/* <button
                      type="button"
                      onClick={() => handleDeleteImage(index)}
                      className="w-5 h-5 z-20 rounded-full bg-gray-300 p-1 absolute top-2 right-2"
                    >
                      <IoClose className="w-full h-full" />
                    </button> */}

                    {/* Checkbox for selecting cover photo */}
                    {/* <div className="flex items-center gap-1 mt-1">
                      <input
                        type="checkbox"
                        checked={coverImageIndex === index}
                        onChange={() => handleCoverPhotoChange(index)}
                        className="w-[14px] h-[14px]"
                      />
                      <label className="text-sm font-medium">
                        Select as cover photo
                      </label>
                    </div> */}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-full border my-6" />

          <div className="w-full flex flex-col gap-6">
            <div className="w-full">
              <label htmlFor="serviceName" className="text-sm font-semibold">
                Service Name
              </label>
              <input
                type="text"
                id="serviceName"
                name="serviceName"
                disabled
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="Xbox Series X 1 TB"
                className="w-full py-4 px-5 outline-none text-sm rounded-[20px] bg-white text-[#5C5C5C] placeholder:text-[#5C5C5C]"
              />
              <span className="text-[13px] text-[#5C5C5C] float-end">0/55</span>
            </div>

            <div className="w-full">
              <label htmlFor="description" className="text-sm font-semibold">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={6}
                disabled
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full py-4 px-5 outline-none text-sm rounded-[20px] bg-white text-[#5C5C5C] placeholder:text-[#5C5C5C]"
              ></textarea>
            </div>

            <div className="w-full">
              <label htmlFor="price" className="text-sm font-semibold">
                Price
              </label>
              <input
                type="text"
                placeholder="$199.00"
                value={price}
                onChange={(e) => {
                  const newValue = e.target.value;
                  const filteredValue = newValue.replace(/[^0-9]/g, "");
                  if (filteredValue === "" || Number(filteredValue) >= 1) {
                    setPrice(filteredValue);
                  }
                }}
                className="w-full py-4 px-5 outline-none text-sm rounded-[20px] bg-white text-[#5C5C5C] placeholder:text-[#5C5C5C]"
              />
            </div>

            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="flex flex-col items-start gap-1 w-full">
                <label htmlFor="state" className="text-sm font-medium">
                  State
                </label>
                <input
                  type="text"
                  placeholder="$199.00"
                  value={selectedState}
                  disabled
                  //   onChange={(e) => setPrice(e.target.value)}
                  className="w-full py-4 px-5 outline-none text-sm rounded-[20px] bg-white text-[#5C5C5C] placeholder:text-[#5C5C5C]"
                />
              </div>
              <div className="flex flex-col items-start gap-1 w-full">
                <label htmlFor="city" className="text-sm font-medium">
                  City
                </label>
                <input
                  type="text"
                  placeholder="$199.00"
                  value={selectedCity}
                  disabled
                  //   onChange={(e) => setPrice(e.target.value)}
                  className="w-full py-4 px-5 outline-none text-sm rounded-[20px] bg-white text-[#5C5C5C] placeholder:text-[#5C5C5C]"
                />
              </div>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
              <button
                type="button"
                onClick={() => navigateBack()}
                className="bg-white light-blue-text font-semibold text-sm py-3 rounded-[20px] text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="blue-bg text-white font-semibold text-sm py-3 rounded-[20px] h-[50px]"
              >
                {update ? <ButtonLoader /> : "Save"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditServiceForm;
