import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { GoPlus } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { STATES } from "../../constants/states";
import { ProductDataReview } from "../../context/addProduct";
import { useFormik } from "formik";

const validate = (values) => {
  const errors = {};
  if (!values.serviceName) {
    errors.serviceName = "Required";
  } else if (values.serviceName.length > 35) {
    errors.serviceName = "Must be 35 characters or less";
  }

  if (!values.description) {
    errors.description = "Required";
  } else if (values.description.length < 20) {
    errors.description = "Must be 20 characters or greater";
  }

  if (!values.productImages) {
    errors.productImages = "Required";
  } else if (values.productImages.length < 3) {
    errors.productImages = "Must be 3 images or greater";
  }

  if (!values.price) {
    errors.price = "Required";
  } else if (values.price.length <= 0) {
    errors.price = "Must be greater than 0";
  }

  if (!values.selectedState) {
    errors.selectedState = "Required";
  }

  if (!values.selectedCity) {
    errors.selectedCity = "Required";
  }

  if (!values.coverImageIndex) {
    errors.coverImageIndex = "Required";
  }

  return errors;
};

const AddServiceForm = () => {
  const [productImages, setProductImages] = useState([]);
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [coverImageIndex, setCoverImageIndex] = useState(null);
  const { setServiceData } = useContext(ProductDataReview);
  const navigate = useNavigate();

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
    setSelectedCity("");
  };

  // Get cities for the selected state
  const selectedStateData = STATES.find(
    (state) => state.name === selectedState
  );
  const cities = selectedStateData ? selectedStateData.cities : [];

  // Handle adding an image
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (productImages.length + files.length <= 5) {
      setProductImages((prevImages) => [...prevImages, ...files]);
    } else {
      alert("You can only upload up to 5 images.");
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

  const formik = useFormik({
    initialValues: {
      productImages,
      serviceName,
      description,
      price,
      selectedState,
      selectedCity,
      coverImageIndex,
    },
    validate,
    onSubmit: (values) => {
      // alert(JSON.stringify(values, null, 2));
      setServiceData(values);
      navigate("/service-review");
    },
  });

  // const uploadService = async (e) => {
  //   e.preventDefault();
  //   setServiceData({
  //     productImages,
  //     serviceName,
  //     description,
  //     price,
  //     selectedState,
  //     selectedCity,
  //     coverImageIndex,
  //   });
  //   navigate("/service-review");
  // };

  return (
    <div className="padding-x w-full py-6">
      <form
        onSubmit={formik.handleSubmit}
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
                      checked={coverImageIndex === index}
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
                onChange={formik.handleChange}
                value={formik.values.serviceName}
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

            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="flex flex-col items-start gap-1 w-full">
                <label htmlFor="state" className="text-sm font-medium">
                  State
                </label>
                <select
                  name="state"
                  id="state"
                  className="w-full py-4 px-5 outline-none text-sm rounded-[20px] bg-white text-[#5C5C5C] placeholder:text-[#5C5C5C]"
                  value={selectedState}
                  onChange={handleStateChange}
                >
                  <option value="">Select a State</option>
                  {STATES.map((state, index) => (
                    <option key={index} value={state.name}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col items-start gap-1 w-full">
                <label htmlFor="city" className="text-sm font-medium">
                  City
                </label>
                <select
                  name="city"
                  id="city"
                  className="w-full py-4 px-5 outline-none text-sm rounded-[20px] bg-white text-[#5C5C5C] placeholder:text-[#5C5C5C]"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  disabled={!selectedState}
                >
                  <option value="">Select a City</option>
                  {cities.map((city, index) => (
                    <option key={index} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
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
                type="button"
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
