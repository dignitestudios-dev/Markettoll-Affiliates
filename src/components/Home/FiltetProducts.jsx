import React, { useContext, useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";

const FilterProductModal = ({
  FilterModal,
  onclick,
}) => {
  const { user, fetchUserProfile, userProfile } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  return (
    FilterModal && (
      <div className="w-full h-screen fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center">
        <div className="bg-white relative w-full lg:w-[575px] h-[370px] rounded-2xl p-6 flex flex-col items-start justify-center gap-5">
          <button
            type="button"
            onClick={onclick}
            className="w-6 h-6 rounded-full bg-gray-200 p-1 absolute top-4 right-4"
          >
            <IoClose className="w-full h-full" />
          </button>
          <p className="text-lg font-bold">Apply Filter</p>

         

         
        </div>
      
      </div>
    )
  );
};


export default FilterProductModal;
