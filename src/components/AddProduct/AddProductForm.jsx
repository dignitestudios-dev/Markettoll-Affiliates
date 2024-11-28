import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { GoPlus } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { STATES } from "../../constants/states";
import { LuMinus } from "react-icons/lu";
import { HiPlus } from "react-icons/hi";
import { productCategories } from "../../constants/productCategories";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";
import { ProductDataReview } from "../../context/addProduct";

const AddProductForm = () => {
  const { user } = useContext(AuthContext);
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productSubCategory, setProductSubCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [productImages, setProductImages] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [fulfillmentMethod, setFulfillmentMethod] = useState({
    selfPickup: false,
    delivery: false,
  });
  const [pickupAddress, setPickupAddress] = useState("");
  const [coverImageIndex, setCoverImageIndex] = useState(null);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(coverImageIndex);

  const { setProductData } = useContext(ProductDataReview);

  const selectedCategory = productCategories.find(
    (category) => category.name === productCategory
  );
  const subcategories = selectedCategory ? selectedCategory.subcategories : [];

  const handleFulfillmentMethodChange = (e) => {
    const { name, checked } = e.target;
    setFulfillmentMethod((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleCategoryChange = (e) => {
    setProductCategory(e.target.value);
    setProductSubCategory("");
  };

  const handleSubCategoryChange = (e) => {
    setProductSubCategory(e.target.value);
  };

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
    setSelectedCity("");
  };

  const selectedStateData = STATES.find(
    (state) => state.name === selectedState
  );
  const cities = selectedStateData ? selectedStateData.cities : [];

  const handleImageChange = (e) => {
    const files = Array.from(event.target.files);
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

  const uploadProduct = async (e) => {
    e.preventDefault();
    setProductData({
      productName,
      description,
      productCategory,
      productSubCategory,
      selectedState,
      selectedCity,
      fulfillmentMethod,
      pickupAddress,
      price,
      quantity,
      productImages,
      coverImageIndex,
    });
    navigate("/product-review");
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
                  {/* {productImages.length === 0 ? (
                  ) : (
                    <GoPlus className="w-[48px] h-[48px] text-light-blue" />
                  )} */}
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
                  {subcategories.map((sub, index) => (
                    <option key={index} value={sub}>
                      {sub}
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
                  onChange={handleFulfillmentMethodChange}
                />
                <label htmlFor="selfPickup" className="text-sm font-medium">
                  Self Pickup
                </label>
              </div>
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

            <div className="w-full">
              <label htmlFor="pickupAddress" className="text-sm font-semibold">
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

            <div>
              <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Same as profile
                </span>
              </label>
            </div>

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
      {/* <Modal openModal={openModal} onclick={handleModal} /> */}
    </div>
  );
};

export default AddProductForm;

// const Modal = ({ openModal, onclick }) => {
//   return (
//     openModal && (
//       <div className="w-full fixed inset-0 h-screen z-50 bg-[rgba(0,0,0,0.5)] flex items-center justify-center px-4">
//         <div className="w-full lg:w-[400px] p-10 relative bg-white flex flex-col items-start gap-3 rounded-2xl">
//           <p className="font-semibold text-base">No bank account attached</p>
//           <p className="text-[#5c5c5c] font-medium text-sm">
//             Connect your bank account first to add a product.
//           </p>
//           <div className="w-full flex items-center justify-end gap-4">
//             <Link
//               to="/settings/payment"
//               className="text-sm font-semibold text-red-500"
//             >
//               Yes
//             </Link>
//             <button
//               type="button"
//               className="text-sm font-semibold"
//               onClick={onclick}
//             >
//               No
//             </button>
//           </div>
//         </div>
//       </div>
//     )
//   );
// };
