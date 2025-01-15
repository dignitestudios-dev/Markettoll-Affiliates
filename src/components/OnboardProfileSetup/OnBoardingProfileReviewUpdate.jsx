import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ButtonLoader from "../Global/ButtonLoader";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";

const OnBoardingProfileReviewUpdate = () => {
  const location = useLocation();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, userProfile, fetchUserProfile } = useContext(AuthContext);
  // console.log(userProfile);
  const navigate = useNavigate();

  // Trigger the hidden input file dialog
  const handleEditPhotoClick = () => {
    document.getElementById("dropzone-file").click();
  };

  const handleEditPhoto = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("profileImage", image);
    try {
      const response = await axios.put(
        `${BASE_URL}/users/profile-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response?.data?.success) {
        fetchUserProfile();
        navigate("/add-location");
        return response.data;
      }
    } catch (error) {
      console.error(
        "Error Updating Profile Image:",
        error.response ? error.response.data : error.message
      );
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white padding-x py-6">
      <div className="w-full bg-[#F7F7F7] rounded-[30px] px-4 py-12 relative text-center">
        <h2 className="text-[36px] font-bold blue-text">Add Profile Picture</h2>

        <div className="flex items-center justify-center w-full mt-5">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-[150px] h-[150px] border-2 border-gray-400 border-dashed rounded-full cursor-pointer bg-white hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center w-full h-full rounded-full">
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="Profile"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <img
                  src={
                    userProfile
                      ? userProfile?.profileImage
                      : location?.state?.userData
                  }
                  alt="Default Profile"
                  className="h-full w-full rounded-full object-cover"
                />
              )}
            </div>
            {/* Hidden input for file upload */}
            <input
              onChange={(e) => setImage(e.target.files[0])}
              id="dropzone-file"
              type="file"
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>

        <div className="w-full flex justify-center mt-5">
          <button
            onClick={handleEditPhotoClick}
            className="w-[100px] py-2 bg-white rounded-[100px] text-[13px] blue-text font-bold"
          >
            Edit Photo
          </button>
        </div>

        <div className="w-full lg:w-[635px] mx-auto mt-5">
          <button
            type={"button"}
            onClick={() => handleEditPhoto()}
            className="blue-bg text-white rounded-full font-bold py-3 w-full lg:w-[635px] h-[50px]"
          >
            {loading ? <ButtonLoader /> : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnBoardingProfileReviewUpdate;
