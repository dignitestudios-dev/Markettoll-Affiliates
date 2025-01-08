import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { GoPlus } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { LuMinus } from "react-icons/lu";
import { HiPlus } from "react-icons/hi";
import { AuthContext } from "../../context/authContext";
import { ProductDataReview } from "../../context/addProduct";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { City, Country, State } from "country-state-city";

const AddProductForm = () => {
  const { user, userProfile } = useContext(AuthContext);
  const location = useLocation();
  const product = location?.state?.productData;
  const [productName, setProductName] = useState(
    product ? product?.productName : ""
  );
  const [productCategory, setProductCategory] = useState(
    product ? product?.productCategory : ""
  );
  const [productSubCategory, setProductSubCategory] = useState(
    product ? product?.productSubCategory : ""
  );
  const [description, setDescription] = useState(
    product ? product?.description : ""
  );
  const [price, setPrice] = useState(product ? product?.price : "");
  const [productImages, setProductImages] = useState(
    product ? product?.productImages : []
  );
  const [selectedState, setSelectedState] = useState(
    product ? product?.selectedState : ""
  );
  const [selectedCity, setSelectedCity] = useState(
    product ? product?.selectedCity : ""
  );
  const [quantity, setQuantity] = useState(product ? product?.quantity : 1);
  const [fulfillmentMethod, setFulfillmentMethod] = useState({
    selfPickup: product ? product?.fulfillmentMethod?.selfPickup : false,
    delivery: product ? product?.fulfillmentMethod?.delivery : false,
  });
  const [pickupAddress, setPickupAddress] = useState("");
  const [isPickupAddressSameAsProfile, setIsPickupAddressSameAsProfile] =
    useState(false);
  const [coverImageIndex, setCoverImageIndex] = useState(
    product ? product?.coverImageIndex : ""
  );
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [productCategories, setProductCategories] = useState([]);
  const [fullStateName, setFullStateName] = useState(
    product ? product?.selectedState : ""
  );
  const [states, setStates] = useState([]);
  const [stateCities, setStateCities] = useState([]);

  useEffect(() => {
    const usStates = State.getStatesOfCountry("US");
    setStates(usStates);
  }, []);

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
      setFullStateName(fullState);
      // setStateFullName(fullState);
    } else {
      setFullStateName("");
    }
  }, [selectedState]);

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
    setSelectedCity("");
  };

  const fetchProductCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/users/product-categories`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setProductCategories(res?.data?.data);
    } catch (error) {
      console.log(
        "err while fetching product categories",
        error?.response?.data
      );
    }
  };

  useEffect(() => {
    fetchProductCategories();
  }, []);

  const productPickupAddress = userProfile?.pickupAddress;

  const { setProductData } = useContext(ProductDataReview);

  const selectedCategory = productCategories.find(
    (category) => category.name === productCategory
  );
  const subcategories = selectedCategory ? selectedCategory?.subCategories : [];

  const handleFulfillmentMethodChange = (e) => {
    const { name, checked } = e.target;

    if (name === "selfPickup") {
      setFulfillmentMethod({
        selfPickup: checked,
        delivery: !checked,
      });
    } else if (name === "delivery") {
      setFulfillmentMethod({
        selfPickup: !checked,
        delivery: checked,
      });
    }
  };

  const handleCategoryChange = (e) => {
    setProductCategory(e.target.value);
    setProductSubCategory("");
  };

  const handleSubCategoryChange = (e) => {
    setProductSubCategory(e.target.value);
  };

  const handleImageChange = (e) => {
    const files = Array.from(event.target.files);
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
    console.log("cover image index >>>>", index);
    setCoverImageIndex(index);
  };

  const uploadProduct = async (e) => {
    e.preventDefault();
    if (productImages === null || productImages.length === 0) {
      toast.error("Please upload product images");
      return;
    }
    if (coverImageIndex === "") {
      toast.error("Please choose a cover image");
      return;
    }
    if (!productName) {
      toast.error("Please enter product name");
      return;
    }
    if (!productCategory) {
      toast.error("Please choose a product category");
      return;
    }
    if (!productSubCategory) {
      toast.error("Please choose a product sub category");
      return;
    }
    if (!description) {
      toast.error("Please write some description for the product");
      return;
    } else if (description.length < 100) {
      toast.error("Description can not be less than 100 characters");
      return;
    }
    if (!price) {
      toast.error("Please enter price");
      return;
    } else if (description.length <= 0) {
      toast.error("Price can not be 0");
      return;
    }
    if (!fullStateName) {
      toast.error("Please select a state");
      return;
    }
    if (!selectedCity) {
      toast.error("Please select a city");
      return;
    }
    if (!quantity) {
      toast.error("Please enter quantity");
      return;
    } else if (quantity <= 0) {
      toast.error("Quantity can not be 0");
      return;
    }
    if (!fulfillmentMethod?.selfPickup && !fulfillmentMethod?.delivery) {
      toast.error("Please choose a fulfillment method.");
      return;
    }

    navigate("/product-review", {
      state: {
        productData: {
          productName,
          description,
          productCategory,
          productSubCategory,
          selectedState: fullStateName,
          selectedCity,
          fulfillmentMethod,
          pickupAddress: isPickupAddressSameAsProfile
            ? productPickupAddress
            : pickupAddress,
          price,
          quantity,
          productImages,
          coverImageIndex,
        },
      },
    });
  };

  return (
    <div className="padding-x w-full py-6">
      <div className="w-full bg-[#F7F7F7] rounded-[30px] px-4 lg:px-8 py-12">
        <div className="w-full flex items-center gap-6">
          <Link
            to="/add-service-or-product"
            className="flex items-center gap-1"
          >
            <GoArrowLeft className="light-blue-text text-xl" />{" "}
            <span className="text-sm font-medium text-[#5C5C5C]">Back</span>
          </Link>

          <h2 className="blue-text font-bold text-[24px]">
            Add Product Details
          </h2>
        </div>

        <form onSubmit={uploadProduct} className="w-full padding-x mt-6">
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
                      checked={index === coverImageIndex}
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
              <label htmlFor="productName" className="text-sm font-semibold">
                Product Name
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Xbox Series X 1 TB"
                className="w-full py-4 px-5 outline-none text-sm rounded-[20px] bg-white text-[#5C5C5C] placeholder:text-[#5C5C5C]"
              />
              <span className="text-[13px] text-[#5C5C5C] float-end">0/55</span>
            </div>

            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="w-full">
                <label
                  htmlFor="productCategory"
                  className="text-sm font-semibold"
                >
                  Category
                </label>
                <select
                  name="productCategory"
                  id="productCategory"
                  className="w-full py-4 px-5 outline-none text-sm rounded-[20px] bg-white text-[#5C5C5C] placeholder:text-[#5C5C5C]"
                  value={productCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="">Select Category</option>
                  {productCategories.map((category) => (
                    <option key={category.name} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full">
                <label
                  htmlFor="productSubCategory"
                  className="text-sm font-semibold"
                >
                  Sub Category
                </label>
                <select
                  name="productSubCategory"
                  id="productSubCategory"
                  className="w-full py-4 px-5 outline-none text-sm rounded-[20px] bg-white text-[#5C5C5C] placeholder:text-[#5C5C5C]"
                  value={productSubCategory}
                  onChange={handleSubCategoryChange}
                  disabled={!productCategory} // Disable if no category is selected
                >
                  <option value="">Select Sub Category</option>
                  {subcategories?.map((sub, index) => (
                    <option key={index} value={sub?.name}>
                      {sub?.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="w-full">
              <label htmlFor="description" className="text-sm font-semibold">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
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
                  disabled={!selectedState}
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
              {/* Self Pickup Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="selfPickup"
                  id="selfPickup"
                  className="w-[16px] h-[16px]"
                  checked={fulfillmentMethod.selfPickup}
                  onChange={handleFulfillmentMethodChange}
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
                  onChange={handleFulfillmentMethodChange}
                />
                <label htmlFor="delivery" className="text-sm font-medium">
                  Delivery
                </label>
              </div>
            </div>

            {fulfillmentMethod?.selfPickup && (
              <>
                <div className="w-full">
                  <label
                    htmlFor="pickupAddress"
                    className="text-sm font-semibold"
                  >
                    Pickup Address
                  </label>
                  <input
                    type="text"
                    id="pickupAddress"
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    name="pickupAddress"
                    placeholder="16 Maple Avenue, Los Angeles, United States"
                    className="w-full py-4 px-5 outline-none text-sm rounded-[20px] bg-white text-[#5C5C5C] placeholder:text-[#5C5C5C]"
                  />
                </div>
                {/* <AddPickupAddressForm
                  pickupAddressCity={pickupAddressCity}
                  setPickupAddresCity={setPickupAddresCity}
                  pickupAddressState={pickupAddressState}
                  setPickupAddressState={setPickupAddressState}
                  pickupAddressZipCode={pickupAddressZipCode}
                  setPickupAddressZipCode={setPickupAddressZipCode}
                  pickupApartment={pickupApartment}
                  setPickupApartment={setPickupApartment}
                  pickupStreetAddress={pickupStreetAddress}
                  setPickupStreetAddress={setPickupStreetAddress}
                /> */}
                {userProfile?.pickupAddress?.state !== "" && (
                  <div>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        value={isPickupAddressSameAsProfile}
                        className="sr-only peer"
                        onChange={(e) =>
                          setIsPickupAddressSameAsProfile(e.target.checked)
                        }
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      <span className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Same as profile
                      </span>
                    </label>
                  </div>
                )}
              </>
            )}

            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                type="button"
                className="bg-white light-blue-text font-semibold text-sm py-3 rounded-[20px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="blue-bg text-white font-semibold text-sm py-3 rounded-[20px]"
              >
                {loading ? "Reviewing..." : "Review"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductForm;
