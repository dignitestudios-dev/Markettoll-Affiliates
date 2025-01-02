import React, { useContext, useState } from "react";
import { GoArrowLeft } from "react-icons/go";
import { FiPlus } from "react-icons/fi";
import { AuthContext } from "../../context/authContext";
import { CartProductContext } from "../../context/cartProductContext";
import AddDeliveryAddressModal from "./AddDeliveryAddressModal";

const DeliveryAddress = ({ onclick }) => {
  const [state, setState] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const { user, userProfile } = useContext(AuthContext);
  const { setData, data } = useContext(CartProductContext);

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setData({ deliveryAddress: address });
  };

  const handleState = () => {
    setState(!state);
  };
  return (
    <div className="bg-white rounded-[20px] p-6">
      <div>
        <button
          type="button"
          onClick={onclick}
          className="flex items-center gap-1"
        >
          <GoArrowLeft className="text-xl light-blue-text" />
          <span className="text-sm font-medium text-gray-500">Black</span>
        </button>
      </div>
      <h2 className="text-[28px] font-bold blue-text">Delivery Address</h2>

      {!userProfile?.deliveryAddresses ||
      userProfile?.deliveryAddresses.length === 0 ? (
        <button
          type="button"
          onClick={handleState}
          className="text-[15px] font-medium flex items-center my-5"
        >
          <FiPlus className="light-blue-text" /> Add new delivery address
        </button>
      ) : (
        <div className="flex flex-col items-start gap-3 mt-5">
          {userProfile?.deliveryAddresses?.map((address, index) => {
            return (
              <>
                <div className="flex items-center gap-2" key={index}>
                  <input
                    type="radio"
                    name="address1"
                    id="address1"
                    className="w-5 h-5"
                    value={address?.streetAddress}
                    onChange={() => handleAddressSelect(address)}
                    checked={
                      selectedAddress?.streetAddress === address?.streetAddress
                    }
                  />
                  <label
                    htmlFor={`address-${index}`}
                    className="bg-[#F5F5F5] rounded-[20px] px-5 py-3.5 text-sm"
                  >
                    {address?.streetAddress} {address?.apartment_suite}{" "}
                    {address?.state} {address?.city} United States{" "}
                    {address?.zipCode}
                  </label>
                </div>
              </>
            );
          })}
          {userProfile?.deliveryAddresses.length < 3 && (
            <button
              type="button"
              onClick={handleState}
              className="text-[15px] font-medium flex items-center my-2"
            >
              <FiPlus className="light-blue-text" /> Add new delivery address
            </button>
          )}
        </div>
      )}

      <AddDeliveryAddressModal state={state} onclick={handleState} />
    </div>
  );
};

export default DeliveryAddress;
