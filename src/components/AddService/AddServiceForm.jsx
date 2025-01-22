import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { GoPlus } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { STATES } from "../../constants/states";
import { ProductDataReview } from "../../context/addProduct";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { CitySelect, StateSelect } from "react-country-state-city";

const AddServiceForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [countryid, setCountryid] = useState(0);
  const [stateid, setstateid] = useState(0);

  const [productImages, setProductImages] = useState(
    location?.state?.serviceData?.productImages || []
  );
  const [serviceName, setServiceName] = useState(
    location?.state?.serviceData?.serviceName || ""
  );
  const [description, setDescription] = useState(
    location?.state?.serviceData?.description || ""
  );
  const [price, setPrice] = useState(location?.state?.serviceData?.price || "");
  const [selectedState, setSelectedState] = useState(
    location?.state?.serviceData?.selectedState || ""
  );
  const [selectedCity, setSelectedCity] = useState(
    location?.state?.serviceData?.selectedCity || ""
  );
  const [coverImageIndex, setCoverImageIndex] = useState(
    location?.state?.serviceData?.coverImageIndex || ""
  );
  const { setServiceData } = useContext(ProductDataReview);


  const [fullStateName, setFullStateName] = useState(
    location?.state?.serviceData?.selectedState || ""
  );
  
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (productImages.length + files.length <= 5) {
      setProductImages((prevImages) => [...prevImages, ...files]);
    } else {
      toast.error("You can only upload up to 5 images.");
    }
  };

  const handleDeleteImage = (index) => {
    setProductImages((prevImages) => prevImages.filter((_, i) => i !== index));
    if (coverImageIndex === index) {
      setCoverImageIndex(null);
    }
  };
  const handleCoverPhotoChange = (index) => {
    setCoverImageIndex(index);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (productImages.length == 0) {
      toast.error("Please upload service images");
    } else if (productImages.length < 3) {
      toast.error("At least three images are required");
      return;
    }
    if (coverImageIndex === "") {
      toast.error("Please choose a cover image");
      return;
    }
    if (!serviceName) {
      toast.error("Please enter service name");
      return;
    }
    if (!description) {
      toast.error("Please add description");
      return;
    } else if (description.length < 100) {
      toast.error("Description can not be less than 100 characters");
      return;
    }
    if (!price) {
      toast.error("Please add price");
      return;
    } else if (price <= 0) {
      toast.error("Price can not be 0");
    }
    if (!selectedState) {
      toast.error("Please select a state");
      return;
    }
    if (!selectedCity) {
      toast.error("Please select a city");
      return;
    }
    setServiceData({
      productImages,
      serviceName,
      description,
      price,
      selectedState: fullStateName,
      selectedCity,
      coverImageIndex,
    });
    navigate("/service-review", {
      state: {
        serviceData: {
          productImages,
          serviceName,
          description,
          price,
          selectedState: fullStateName,
          selectedCity,
          coverImageIndex,
        },
      },
    });
  };

  return (
    <div className="padding-x w-full py-6">
      <form
        onSubmit={handleSubmit}
        className="w-full bg-[#F7F7F7] rounded-[30px] px-4 lg:px-8 py-12"
      >
        <div className="w-full flex items-center gap-6">
          <Link
            to="/add-service-or-product"
            className="flex items-center gap-1"
          >
            <GoArrowLeft className="light-blue-text text-xl" />{" "}
            <span className="text-sm font-medium text-[#5C5C5C]">Back</span>
          </Link>

          <h2 className="blue-text font-bold text-[24px]">
            Add Service Details
          </h2>
        </div>

        <div className="w-full padding-x mt-6">
          <label htmlFor="productImage" className="text-sm font-semibold">
            Upload Photos
          </label>
          <div className="w-full flex items-start justify-start mt-2 gap-6">
            {/* Image Upload Area */}
            <div className="flex items-start flex-col justify-start">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center border border-[#d9d9d9] justify-center h-[170px] w-[170px] rounded-[20px] cursor-pointer bg-white hover:bg-gray-100 relative"
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
            </div>

            {/* Image Preview and Selection */}
            <div className="flex gap-6">
              {productImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`product-image-${index}`}
                    className="h-[170px] w-[170px] rounded-[20px] object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(index)}
                    className="w-5 h-5 z-20 rounded-full bg-gray-300 p-1 absolute top-2 right-2"
                  >
                    <IoClose className="w-full h-full" />
                  </button>

                  {/* Checkbox for selecting cover photo */}
                  <div className="flex items-center gap-1 mt-1">
                    <input
                      type="checkbox"
                      checked={
                        location?.state?.serviceData?.coverImageIndex ||
                        coverImageIndex === index
                      }
                      onChange={() => handleCoverPhotoChange(index)}
                      className="w-[14px] h-[14px]"
                    />
                    <label className="text-sm font-medium">
                      Select as cover photo
                    </label>
                  </div>
                </div>
              ))}
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
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="Xbox Series X 1 TB"
                className="w-full py-4 px-5 border border-[#d9d9d9] outline-none text-sm rounded-[20px] bg-white text-[#5C5C5C] placeholder:text-[#5C5C5C]"
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
                onChange={(e) => setDescription(e.target.value)}
                className="w-full py-4 border border-[#d9d9d9] px-5 outline-none text-sm rounded-[20px] bg-white text-[#5C5C5C] placeholder:text-[#5C5C5C]"
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
                className="w-full py-4 px-5 border border-[#d9d9d9] outline-none text-sm rounded-[20px] bg-white text-[#5C5C5C] placeholder:text-[#5C5C5C]"
              />
            </div>
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5">       
              <div className="flex flex-col items-start gap-1 w-full increas-child-width">
                <label htmlFor="state" className="text-sm font-medium">
                  State
                </label>
                 <StateSelect
                 countryid={233}
                 onChange={(e) => {
                   setstateid(e.id);
                   setFullStateName(e.name);
                   setSelectedState(e.name);
                 }}
                 placeHolder="Select State"
                 className="w-full"
                 style={{ border: "none" }}
              />
              </div>
              <div className="flex flex-col items-start gap-1 w-full increas-child-width">
                <label htmlFor="city" className="text-sm font-medium">
                  City
                </label>         
                <CitySelect
                countryid={233}
                stateid={stateid}
                onChange={(e) => {
                  console.log(e);
                  setSelectedCity(e.name);
                }}
                placeHolder="Select City"
                style={{ border: "none" }}
              />
              </div>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
              <Link
                to="/add-service-or-product"
                className="bg-white light-blue-text font-semibold text-sm py-3 rounded-[20px] text-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="blue-bg text-white font-semibold text-sm py-3 rounded-[20px]"
              >
                Review
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddServiceForm;
