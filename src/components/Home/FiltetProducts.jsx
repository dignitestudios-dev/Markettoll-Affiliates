import React, { useContext, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";
import FilterAddress from "./Address";
import DistanceSlider from "./MilesSlider";
import ButtonLoader from "../Global/ButtonLoader";

const FilterProductModal = ({
  FilterModal,
  onclick,
  setCity,
  setState,
  setMile,
  setLat,
  setCurrentAddress,
  setApplyFilter,
  applyFilter,
}) => {
  const { user, fetchUserProfile, userProfile } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const [linkActive, setLinkActive] = useState(true);
  const [searchByCity, setSearchByCity] = useState(false);
  const [searchByMiles, setSearchByMiles] = useState(false);

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState(null);

  const handleCityCheckbox = (checked) => {
    setSearchByCity(checked);
    if (checked) {
      setSearchByMiles(false);
      setLinkActive(false);
    }
  };

  const handleMilesCheckbox = (checked) => {
    setSearchByMiles(checked);
    if (checked) {
      setSearchByCity(false);
      setLinkActive(false);
    }
  };

  return (
    FilterModal && (
      <div className="w-full  z-50 h-screen fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center">
        <div className="bg-white relative w-full lg:w-[700px]  rounded-2xl p-6 flex flex-col items-start justify-center gap-5">
          <button
            type="button"
            onClick={onclick}
            className="w-6 h-6 rounded-full bg-gray-200 p-1 absolute top-4 right-4"
          >
            <IoClose className="w-full h-full" />
          </button>
          <div className="flex justify-between items-center w-full mt-6">
            <p className="text-[18px] font-[600]">Filters</p>
            <button
              onClick={() => {
                setLat({});
                setCity("");
                setState("");
                setMile();
                setApplyFilter(!applyFilter);
                onclick();
              }}
              className="text-[12px] font-[500] text-[#00AAD5] "
            >
              Clear All
            </button>
          </div>
          <div className="flex items-center -mb-4 justify-between w-full">
            <p className="text-[13px] font-[400]">
              Default location set to United States
            </p>
            <div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={async () => {
                      // Only allow toggle if no checkboxes are selected
                      if (!searchByCity && !searchByMiles) {
                        setLinkActive(!linkActive);
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition(
                            (position) => {
                              setLatitude(position.coords.latitude);
                              setCurrentAddress(false);
                              setLongitude(position.coords.longitude);
                              setLat({
                                lat: position.coords.latitude,
                                lng: position.coords.longitude,
                              });
                            },
                            (error) => {
                              setError(error.message);
                              if (error.code === error.PERMISSION_DENIED) {
                                setCurrentAddress(true);
                                toast.error("Please Reset Location Permission");
                                setLinkActive(true);
                              }
                            }
                          );
                        } else {
                          setError(
                            "Geolocation is not supported by this browser."
                          );
                          setLinkActive(true);
                        }
                      }
                    }}
                    disabled={searchByCity || searchByMiles}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                      linkActive ? "bg-green-500" : "bg-gray-300"
                    } ${
                      searchByCity || searchByMiles
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        linkActive ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Checkbox Options */}
          <div className="flex items-center flex-col -space-x-6 gap-3 mb-4">
            <label className="flex items-center  space-x-2">
              <input
                type="checkbox"
                checked={searchByCity}
                onChange={(e) => handleCityCheckbox(e.target.checked)}
                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
              />
              <span className="text-sm font-medium text-gray-700">
                Search with city state
              </span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={searchByMiles}
                onChange={(e) => handleMilesCheckbox(e.target.checked)}
                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
              />
              <span className="text-sm font-medium text-gray-700">
                Search with miles
              </span>
            </label>
          </div>

          {/* Conditional Rendering based on selection */}
          {searchByCity ? (
            <FilterAddress setCity={setCity} setState={setState} />
          ) : searchByMiles ? (
            <DistanceSlider setMile={setMile} />
          ) : null}
          <div className="w-full ">
            <button
              type={"button"}
              onClick={() => setApplyFilter(!applyFilter)}
              className="blue-bg text-white rounded-full font-bold py-3 w-full  h-[50px]"
            >
              {loading ? <ButtonLoader /> : "Apply Filters"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default FilterProductModal;
