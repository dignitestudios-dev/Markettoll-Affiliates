import React, { useContext, useState } from "react";
import { GoArrowLeft } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import ButtonLoader from "../Global/ButtonLoader";
import { toast } from "react-toastify";
import {
  CitySelect,
  CountrySelect,
  StateSelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";

const AddLocationForm = ({}) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [zipCode, setZipCode] = useState("");
  const { user, fetchUserProfile } = useContext(AuthContext);
  const [stateFullName, setStateFullName] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [countryid, setCountryid] = useState(0);
  const [stateid, setstateid] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Something went wrong");
      return;
    }
    if (!stateFullName || !selectedCity) {
      toast.error("Please select both state and city.");
      return;
    }
    setLoading(true);
    const addressData = {
      streetAddress: "",
      apartment_suite: "",
      country: "United States",
      state: stateFullName,
      city: selectedCity,
      zipCode: zipCode,
    };
    try {
      const response = await axios.put(
        `${BASE_URL}/users/address`,
        addressData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response?.data?.success) {
        fetchUserProfile();
        toast.success("Address added successfully");
        navigate("/add-service-or-product");
        return response.data;
      }
    } catch (error) {
      toast.error(error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  const navigateBack = () => {
    navigate(-1);
  };

  return (
    <div className="w-full padding-x py-6">
      <div className="w-full bg-[#F7F7F7] rounded-[30px] px-4 py-12 flex flex-col items-center gap-5 relative">
        <button
          type="button"
          onClick={() => navigateBack()}
          className="text-sm text-[#5C5C5C] font-medium absolute top-5 left-10 flex items-center gap-1"
        >
          <GoArrowLeft className="text-xl light-blue-text" />
          Back
        </button>
        <h2 className="text-[36px] font-bold blue-text">Add Location</h2>
        <div className="w-full lg:w-[630px] flex flex-col gap-5">
          <div className="w-full lg:w-[630px] flex flex-col items-start gap-1 location">
            <h6 className="text-[13px] font-medium">Country</h6>
            <CountrySelect
              onChange={(e) => {
                setCountryid(e.id);
              }}
              placeHolder="Select Country"
            />
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="w-full flex flex-col items-start gap-1 location">
              <h6 className="text-[13px] font-medium">State</h6>
              <StateSelect
                countryid={countryid}
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
                countryid={countryid}
                stateid={stateid}
                onChange={(e) => {
                  console.log(e);
                  setSelectedCity(e.name);
                }}
                placeHolder="Select City"
              />
            </div>
          </div>
          <div className="w-full lg:w-[630px] flex flex-col items-start gap-1">
            <label htmlFor="zipCode" className="text-sm font-medium">
              Zip Code
            </label>
            <input
              type="text"
              placeholder="00000"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="w-full px-4 py-3 rounded-[16px] border outline-none text-sm bg-white"
            />
          </div>
        </div>
        <div className="w-full lg:w-[635px]">
          <button
            type={"button"}
            onClick={handleSubmit}
            className="blue-bg text-white rounded-full font-bold py-3 w-full lg:w-[635px] h-[50px]"
          >
            {loading ? <ButtonLoader /> : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddLocationForm;
