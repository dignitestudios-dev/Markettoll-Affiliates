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

const FilterAddress = ({setCity,setState}) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
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

  return (
    <div className="w-full ">
      <div className="w-full  rounded-[30px]  flex flex-col relative">
         <h2 className="text-2xl font-semibold text-gray-800 mb-4">Location</h2>
        <div className="w-full  flex flex-col gap-4 ">
          <div className="w-full grid grid-cols-1 md:grid-cols-2  gap-3">
            <div className="w-full flex flex-col items-start  location">
              <h6 className="text-[13px] font-medium">State</h6>
              <StateSelect
                countryid={233}
                onChange={(e) => {
                  setstateid(e.id);
                  setStateFullName(e.name);
                  setState(e.name)
                }}
                placeHolder="Select State"
                className="w-full relative"
              />
            </div>
            <div className="w-full flex flex-col items-start  location">
              <h6 className="text-[13px] font-medium">City</h6>
              <CitySelect
                countryid={233}
                stateid={stateid}
                onChange={(e) => {
                  console.log(e);
                  setCity(e.name)
                  setSelectedCity(e.name);
                }}
                placeHolder="Select City"
              />
            </div>
          </div>
         
        </div>
        
      </div>
    </div>
  );
};

export default FilterAddress;
