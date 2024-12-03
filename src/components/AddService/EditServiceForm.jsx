import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { GoPlus } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { STATES } from "../../constants/states";
import { ProductDataReview } from "../../context/addProduct";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { Country, State, City } from "country-state-city";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";

const EditServiceForm = () => {
  const [service, setService] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [serviceName, setServiceName] = useState(service?.name || "");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [coverImageIndex, setCoverImageIndex] = useState(null);
  const { setServiceData } = useContext(ProductDataReview);
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const [fullStateName, setFullStateName] = useState("");
  const [states, setStates] = useState([]);
  const [stateCities, setStateCities] = useState([]);

  const handleFetchService = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/users/service/${serviceId}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      //   console.log("service details >>>>", res?.data?.data);
      setService(res?.data?.data);
    } catch (error) {
      console.log("service details err >>>", error);
    }
  };

  useEffect(() => {
    const allCountries = Country.getAllCountries();
    const usStates = State.getStatesOfCountry("US");
    setStates(usStates);
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
      // Fetching and setting the existing images from the service (URLs)
      const existingImages = service?.images || [];
      setProductImages(existingImages);
    }
  }, [service]);

  useEffect(() => {
    if (selectedState) {
      const allCities = City.getCitiesOfState("US", selectedState);
      setStateCities(allCities);
    } else {
      setStateCities([]);
    }
  }, [selectedState]);

  const getStateFullName = (abbreviation) => {
    const state = states.find((state) => state.isoCode === abbreviation);
    return state ? state.name : abbreviation;
  };

  useEffect(() => {
    if (selectedState) {
      const fullState = getStateFullName(selectedState);
      setFullStateName(fullState); // Set the full state name in the state
    } else {
      setFullStateName(""); // Clear full state name if no state is selected
    }
  }, [selectedState]);

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
    setSelectedCity("");
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (productImages.length + files.length <= 5) {
      // Add new images to state
      const newImages = files.map((file) => ({
        file,
        url: URL.createObjectURL(file),
        displayImage: false,
      }));
      setProductImages((prevImages) => [...prevImages, ...newImages]);
    } else {
      toast.error("You can only upload up to 5 images.");
    }
  };
  const handleDeleteImage = (index) => {
    const updatedImages = productImages.filter((_, i) => i !== index);
    setProductImages(updatedImages);

    if (coverImageIndex === index) {
      setCoverImageIndex(null);
    }
  };
  const handleCoverPhotoChange = (index) => {
    setCoverImageIndex(index);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (productImages.length == 0) {
      toast.error("Please upload service images");
    } else if (productImages.length < 3) {
      toast.error("At least three images are required");
      return;
    }
    if (!coverImageIndex) {
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
    try {
      const formData = new FormData();

      productImages.forEach((productImages) => {
        formData.append("images", productImages);
      });

      formData.append("displayImageIndex", coverImageIndex);
      formData.append("name", serviceName);
      formData.append("description", description);
      formData.append("country", "United States");
      formData.append("state", fullStateName);
      formData.append("city", selectedCity);

      formData.append("price", price);

      const response = await axios.put(
        `${BASE_URL}/users/service/${serviceId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Handle success
      console.log("Service uploaded successfully:", response.data);
      if (response.data.success) {
        toast.success(response.data.message);
        navigate(`/services/${response?.data?.data?._id}`);
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
                  className="w-full px-4 py-3 rounded-full border outline-none text-sm bg-white"
                  value={selectedState}
                  onChange={handleStateChange}
                >
                  <option value="">Select a State</option>
                  {states.map((state) => (
                    <option key={state.isoCode} value={state.isoCode}>
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
                  className="w-full px-4 py-3 rounded-full border outline-none text-sm bg-white"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  disabled={!selectedState} // Disable city dropdown if no state is selected
                >
                  <option value="">Select a City</option>
                  {stateCities.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
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
                type="submit"
                className="blue-bg text-white font-semibold text-sm py-3 rounded-[20px]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditServiceForm;
