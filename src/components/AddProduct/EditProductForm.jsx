import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import { LuMinus } from "react-icons/lu";
import { HiPlus } from "react-icons/hi";
import ButtonLoader from "../Global/ButtonLoader";
import {
  CitySelect,
  CountrySelect,
  StateSelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";

const EditProductForm = () => {
  const [service, setService] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [serviceName, setServiceName] = useState(service?.name || "");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [coverImageIndex, setCoverImageIndex] = useState(null);
  const { productId } = useParams();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(service?.quantity);
  const [fulfillmentMethod, setFulfillmentMethod] = useState({
    selfPickup: false,
    delivery: false,
  });
  const [stateFullName, setStateFullName] = useState("");
  const [stateid, setstateid] = useState(0);
  const navigate = useNavigate();

  const navigateBack = () => {
    navigate(-1);
  };

  const handleFetchService = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/users/product/${productId}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      console.log("product details >>>>", res?.data?.data);
      setService(res?.data?.data);
    } catch (error) {
      console.log("service details err >>>", error);
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
      setQuantity(service?.quantity);
      setFulfillmentMethod(service?.fulfillmentMethod);
    }
  }, [service]);

  const handleBackClick = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/add-service-or-product");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!price) {
      toast.error("Please add price");
      return;
    } else if (price <= 0) {
      toast.error("Price can not be 0");
      return;
    }
    if (!quantity) {
      toast.error("Please add quanityt");
      return;
    } else if (quantity <= 0) {
      toast.error("Quantity can not be zero");
      return;
    }
    try {
      const response = await axios.put(
        `${BASE_URL}/users/product/${productId}`,
        { price, quantity },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      console.log("product updated successfully:", response.data);
      if (response.data.success) {
        toast.success(response.data.message);
        navigate(`/products/${response?.data?.data?._id}`);
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
      setLoading(false);
    }
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
            onClick={handleBackClick}
            className="flex items-center gap-1"
          >
            <GoArrowLeft className="light-blue-text text-xl" />{" "}
            <span className="text-sm font-medium text-[#5C5C5C]">Back</span>
          </button>

          <h2 className="blue-text font-bold text-[24px]">
            Edit Product Details
          </h2>
        </div>

        <div className="w-full padding-x mt-6">
          <label htmlFor="productImage" className="text-sm font-semibold">
            Upload Photos
          </label>
          <div className="w-full flex items-start justify-start mt-2 gap-6">
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
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-full border my-6" />

          <div className="w-full flex flex-col gap-6">
            <div className="w-full">
              <label htmlFor="serviceName" className="text-sm font-semibold">
                Product Name
              </label>
              <input
                type="text"
                id="serviceName"
                name="serviceName"
                value={serviceName}
                disabled
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
                value={description}
                disabled
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
                onChange={(e) => setPrice(e.target.value)}
                className="w-full py-4 px-5 outline-none text-sm rounded-[20px] bg-white text-[#5C5C5C] placeholder:text-[#5C5C5C]"
              />
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="w-full flex flex-col items-start gap-1 location">
                <h6 className="text-[13px] font-medium">State</h6>
                <StateSelect
                  countryid={233}
                  onChange={(e) => {
                    setstateid(e.id);
                    setStateFullName(e.name);
                  }}
                  placeHolder="Select State"
                  className="w-full"
                />
              </div>
              <div className="w-full flex flex-col items-start gap-1 location">
                <h6 className="text-[13px] font-medium">City</h6>
                <CitySelect
                  countryid={233}
                  stateid={stateid}
                  onChange={(e) => {
                    console.log(e);
                    setSelectedCity(e.name);
                  }}
                  placeHolder="Select City"
                />
              </div>
            </div>

            <div className="w-full">
              <label htmlFor="quantity" className="text-sm font-semibold">
                Quantity
              </label>
              <div className="flex items-center justify-start gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setQuantity(quantity - 1)}
                  className="w-[24px] h-[24px] bg-[#dcdbdb] rounded-full p-1"
                >
                  <LuMinus className="w-full h-full" />
                </button>
                <input
                  type="number"
                  placeholder="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-[60px] text-center py-4 px-5 outline-none text-sm rounded-[10px] bg-white text-[#5C5C5C] placeholder:text-[#5C5C5C]"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-[24px] h-[24px] bg-[#0085FF] rounded-full p-1"
                >
                  <HiPlus className="w-full h-full text-white" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 mt-4">
              <label
                htmlFor="fulfillmentMethod"
                className="text-sm font-semibold mb-2"
              >
                Fulfillment Method
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="selfPickup"
                  id="selfPickup"
                  className="w-[16px] h-[16px]"
                  checked={fulfillmentMethod.selfPickup}
                />
                <label htmlFor="selfPickup" className="text-sm font-medium">
                  Self Pickup
                </label>
              </div>
              {/* Delivery Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="delivery"
                  id="delivery"
                  className="w-[16px] h-[16px]"
                  checked={fulfillmentMethod.delivery}
                />
                <label htmlFor="delivery" className="text-sm font-medium">
                  Delivery
                </label>
              </div>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
              <button
                type="button"
                onClick={navigateBack}
                className="bg-white light-blue-text font-semibold text-sm py-3 rounded-[20px] text-center outline-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="blue-bg text-white font-semibold text-sm py-3 rounded-[20px]"
              >
                {loading ? <ButtonLoader /> : "Save"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProductForm;
