import React, { useContext, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { STATES } from "../../constants/states";
import { toast } from "react-toastify";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { CitySelect, StateSelect } from "react-country-state-city";
const validationSchema = Yup.object({
  streetAddress: Yup.string()
    .min(5, "Street address must be at least 5 characters")
    .required("Street address is required"),
  apartment: Yup.string().optional(),
  zipCode: Yup.string()
    .matches(/^\d{5}(-\d{4})?$/, "Zip code is not valid")
    .required("Zip code is required"),
  selectedState: Yup.string().required("State is required"),
  selectedCity: Yup.string().required("City is required"),
});

const AddDeliveryAddressModal = ({ state, onclick }) => {
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [apartment, setApartment] = useState("");
  const { user, fetchUserProfile } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [stateCities, setStateCities] = useState([]);
  const [stateFullName, setStateFullName] = useState("");
  const [fullStateName, setFullStateName] = useState("");
  const [stateid, setstateid] = useState(0);

  const handleAddDeliveryAddress = async (values) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/users/delivery-address`,
        {
          streetAddress: values.streetAddress,
          apartment_suite: values.apartment,
          country: "United States",
          state: fullStateName,
          city: values.selectedCity,
          zipCode: values.zipCode,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("add delivery address res >>>>", res?.data);
      fetchUserProfile();

      if (res?.status === 201) {
        onclick();
      }
    } catch (error) {
      console.log("add delivery address err >>>>", error);
      toast.error(error?.response?.data?.message);
      onclick();
    } finally {
      setLoading(false);
    }
  };

  return (
    state && (
      <div className="w-full h-screen bg-[rgba(0,0,0,0.5)] fixed inset-0 z-50 flex items-center justify-center px-4">
        <Formik
          initialValues={{
            streetAddress,
            apartment,
            zipCode,
            selectedState,
            selectedCity,
          }}
          validationSchema={validationSchema}
          onSubmit={handleAddDeliveryAddress}
        >
          {({ setFieldValue, values }) => (
            <Form className="bg-white rounded-[15px] p-8 relative w-[680px] h-auto flex flex-col items-center gap-3">
              <div className="w-full flex items-center justify-between">
                <h3 className="text-[28px] blue-text font-bold">
                  Delivery Address
                </h3>
                <button
                  type="button"
                  onClick={onclick}
                  className="w-6 h-6 bg-[#F7F7F7] rounded-full p-1"
                >
                  <IoClose className="w-full h-full" />
                </button>
              </div>

              {/* Street Address */}
              <div className="w-full flex flex-col items-start gap-1">
                <label
                  htmlFor="streetAddress"
                  className="text-[13px] font-medium"
                >
                  Street Address
                </label>
                <Field
                  type="text"
                  name="streetAddress"
                  placeholder="Street address"
                  className="bg-white rounded-[16px] px-4 py-3 text-sm w-full outline-none border"
                />
                <ErrorMessage
                  name="streetAddress"
                  component="div"
                  className="text-red-500 text-xs"
                />
              </div>

              {/* Apartment */}
              <div className="w-full flex flex-col items-start gap-1">
                <label htmlFor="apartment" className="text-[13px] font-medium">
                  Apartment / Suite
                </label>
                <Field
                  type="text"
                  name="apartment"
                  placeholder="Apartment/ Suite"
                  className="bg-white rounded-[16px] px-4 py-3 text-sm w-full outline-none border"
                />
              </div>

              {/* Country */}
              <div className="w-full flex flex-col items-start gap-1">
                <label htmlFor="country" className="text-[13px] font-medium">
                  Country
                </label>
                <input
                  type="text"
                  placeholder="Country"
                  value={"United States"}
                  disabled
                  className="bg-white rounded-[16px] px-4 py-3 text-sm w-full outline-none border"
                />
              </div>

              {/* State and City */}
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div className="flex flex-col items-start gap-1 w-full location">
                  <label htmlFor="state" className="text-sm font-medium">
                    State
                  </label>
                  {/* <Field
                    as="select"
                    name="selectedState"
                    className="w-full px-4 py-3 rounded-full border outline-none text-sm bg-white"
                    onChange={(e) => {
                      setFieldValue("selectedState", e.target.value);
                      setSelectedState(e.target.value);
                      setSelectedCity(""); // Reset city when state changes
                    }}
                  >
                    <option value="">Select a State</option>
                    {states.map((state) => (
                      <option key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </option>
                    ))}
                  </Field> */}

                  <StateSelect
                    name="selectedState"
                    countryid={233}
                    onChange={(e) => {
                      setstateid(e.id);
                      setFieldValue("selectedState", e.name);
                      setFullStateName(e.name);
                      setSelectedState(e.name);
                      setSelectedCity("");
                    }}
                    placeHolder="Select State"
                    className="w-full"
                    style={{ border: "none" }}
                  />

                  <ErrorMessage
                    name="selectedState"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                <div className="flex flex-col items-start gap-1 w-full location">
                  <label htmlFor="city" className="text-sm font-medium">
                    City
                  </label>
                  {/* <Field
                    as="select"
                    name="selectedCity"
                    className="w-full px-4 py-3 rounded-full border outline-none text-sm bg-white"
                    disabled={!selectedState}
                  >
                    <option value="">Select a City</option>
                    {stateCities.map((city) => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </Field> */}

                  <CitySelect
                    name="selectedCity"
                    countryid={233}
                    stateid={stateid}
                    disabled={!selectedState}
                    onChange={(e) => {
                      console.log(e);
                      setSelectedCity(e.name);
                      setFieldValue("selectedCity", e.name);
                    }}
                    placeHolder="Select City"
                    style={{ border: "none" }}
                  />
                  <ErrorMessage
                    name="selectedCity"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>
              </div>

              {/* Zip Code */}
              <div className="w-full flex flex-col items-start gap-1">
                <label htmlFor="zipCode" className="text-[13px] font-medium">
                  Zip Code
                </label>
                <Field
                  type="text"
                  name="zipCode"
                  placeholder="Zip Code"
                  className="bg-white rounded-[16px] px-4 py-3 text-sm w-full outline-none border"
                />
                <ErrorMessage
                  name="zipCode"
                  component="div"
                  className="text-red-500 text-xs"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="text-base rounded-[16px] w-full py-3 blue-bg text-white font-bold"
              >
                {loading ? "Adding..." : "Add"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    )
  );
};

export default AddDeliveryAddressModal;
