import React from "react";

const ProfilePicture = ({ image, setImage }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-[150px] h-[150px] border-2 border-gray-400 border-dashed rounded-full cursor-pointer bg-white hover:bg-gray-100"
        >
          <div class="flex flex-col items-center justify-center w-full h-full rounded-full">
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt=""
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <img
                src="/upload-profile-image-icon.png"
                alt=""
                className="h-[40px] w-[43.1px]"
              />
            )}
          </div>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            id="dropzone-file"
            type="file"
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};

export default ProfilePicture;
