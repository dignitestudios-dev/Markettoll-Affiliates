import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import ButtonLoader from "../Global/ButtonLoader";
import VerifyOtpModal from "./VerifyOtpModal";
import UpdatePhoneNumberModal from "./UpdatePhoneNumberModal";
import PhoneNumberSuccessModal from "./PhoneNumberSuccessModal";
import { collection, db, getDocs } from "../../firebase/firebase";

const PersonalInfo = () => {
  const [openNameModal, setOpenNameModal] = useState(false);
  const { user, userProfile } = useContext(AuthContext);
  const [openProfileImageModal, setOpenProfileImageModal] = useState(false);
  const [username, setUsername] = useState(userProfile?.name || "");
  const [phoneNumber, setPhoneNumber] = useState(
    userProfile?.phoneNumber?.value
  );

  const handleToggleNameModal = () => {
    setOpenNameModal(!openNameModal);
  };
  const [openPhoneModal, setOpenPhoneModal] = useState(false);
  const handleTogglePhoneModal = () => {
    setOpenPhoneModal(!openPhoneModal);
  };

  const toggleProfileImageModal = () => [
    setOpenProfileImageModal(!openProfileImageModal),
  ];
  return (
    <div className="w-full bg-[#F7F7F7] p-4 rounded-[30px]">
      <div className="w-full bg-white rounded-[30px] p-5">
        <div>
          <Link
            to="/"
            className="text-sm text-[#5C5C5C] flex items-center justify-start gap-1"
          >
            <GoArrowLeft className="text-xl light-blue-text" />
            Back
          </Link>
        </div>
        <h2 className="text-[18px] font-semibold my-4">Personal Information</h2>

        <div className="w-full border" />

        <div className="w-full flex items-center justify-start gap-4 mt-4">
          <div className="flex flex-col items-center gap-2">
            <img
              src={userProfile?.profileImage}
              alt="personal-info-img"
              className="w-[69px] md:w-[129px] h-[69px] md:h-[129px] rounded-full object-cover"
            />
            <button
              type="button"
              onClick={toggleProfileImageModal}
              className="text-sm font-medium blue-text underline pb-0.5"
            >
              Edit Photo
            </button>
          </div>
          <div className="flex flex-col items-start justify-start mb-3 gap-1">
            <span className="font-bold text-[20px]">{userProfile?.name}</span>
            <span className="text-sm text-[#5C5C5C]">
              {userProfile?.email?.value}
            </span>
          </div>
        </div>
        <div className="w-full lg:w-[715px] bg-[#F7F7F7] rounded-[24px] p-4 md:p-8 mt-5">
          <div className="w-full">
            <div className="flex items-center justify-between">
              <label htmlFor="name" className="text-sm">
                Name
              </label>
              <button
                type="button"
                onClick={handleToggleNameModal}
                className="text-sm light-blue-text underline pb-0.5"
              >
                Edit
              </button>
            </div>
            <input
              type="text"
              value={userProfile?.name}
              disabled
              className="bg-white p-3.5 outline-none rounded-[15px] w-full text-sm"
              placeholder="John Smith"
            />
          </div>
          <div className="w-full mt-3">
            <div className="flex items-center justify-between">
              <label htmlFor="phoneNumber" className="text-sm">
                Phone Number
              </label>
              <button
                type="button"
                onClick={handleTogglePhoneModal}
                className="text-sm light-blue-text underline pb-0.5"
              >
                Edit
              </button>
            </div>
            <input
              type="text"
              disabled
              value={userProfile?.phoneNumber?.value}
              className="bg-white p-3.5 outline-none rounded-[15px] w-full text-sm"
              placeholder="+1 000 000 0000"
            />
          </div>
        </div>
      </div>
      <UpdateNameModal
        openNameModal={openNameModal}
        onclick={handleToggleNameModal}
      />
      <UpdatePhoneNumberModal
        openPhoneModal={openPhoneModal}
        onclick={handleTogglePhoneModal}
      />
      <UpdateProfileImage
        openProfileImageModal={openProfileImageModal}
        onclick={toggleProfileImageModal}
      />
      <PhoneNumberSuccessModal />
    </div>
  );
};

export default PersonalInfo;

const UpdateNameModal = ({ openNameModal, onclick }) => {
  const { user, userProfile, fetchUserProfile } = useContext(AuthContext);
  const [name, setName] = useState(userProfile?.name || "");
  const [loading, setLoading] = useState(false);

  const handleUpdateName = async () => {
    const savedUser = JSON.parse(localStorage.getItem("user"));

    setLoading(true);
    try {
      const res = await axios.put(
        `${BASE_URL}/users/name`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      fetchUserProfile();
      savedUser.name = res?.data?.data;
      // Cookies.set("user", JSON.stringify(savedUser));
      toast.success("Name updated");
      onclick();
    } catch (error) {
      console.log("update name error >>>>", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const chatsRef = collection(db, "chats");
  async function getMyUsersSubcollection(docRef) {
    const myUsersCollectionRef = collection(docRef, "myUsers");
    const myUsersSnapshot = await getDocs(myUsersCollectionRef);

    const myUsers = [];
    myUsersSnapshot.forEach((doc) => {
      myUsers.push(doc.data()); // Push the data of each document in "myUsers"
    });

    return myUsers;
  }

  // Fetch "myUsers" subcollection for each document in "chats"
  async function fetchAllChats() {
    const querySnapshot = await getDocs(chatsRef);
  console.log(querySnapshot)
    // Loop through each document in the "chats" collection
    for (const docSnapshot of querySnapshot.docs) {
      console.log(
        `Fetching "myUsers" subcollection for document: ${docSnapshot.id}`
      );

      // Get a reference to the document
      const docRef = doc(db, "chats", docSnapshot.id);

      // Fetch "myUsers" subcollection for this document
      const myUsers = await getMyUsersSubcollection(docRef);

      // Log the "myUsers" subcollection data for the current document
      console.log(`"myUsers" for ${docSnapshot.id}:`, myUsers);
    }
  }
  useEffect(() => {
    fetchAllChats();
  }, []);

  return (
    openNameModal && (
      <div className="w-full h-screen fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center px-4">
        <div className="w-full lg:w-[487px] h-[323px] flex flex-col items-center justify-center gap-4 relative bg-white rounded-[12px]">
          <button
            type="button"
            onClick={onclick}
            className="w-6 h-6 rounded-full p-1 bg-[#F7F7F7] absolute top-4 right-4"
          >
            <IoClose className="w-full h-full" />
          </button>
          <div className="w-[80%] flex flex-col text-center gap-2 items-center justify-center">
            <p className="blue-text text-[20px] font-bold">Update Name</p>
            <p className="leading-[15.6px] text-[#5C5C5C] text-[13px]">
              Please enter your new name below. This will help us update your
              profile accordingly.
            </p>
          </div>
          <div className="w-[80%] flex flex-col text-center gap-1 items-start justify-center">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white p-3.5 outline-none border rounded-[15px] w-full text-sm"
              placeholder="John Smith"
            />
            <button
              className="w-full w-ful py-3 rounded-[15px] blue-bg text-white font-semibold mt-4 h-[50px]"
              type="button"
              onClick={handleUpdateName}
            >
              {loading ? <ButtonLoader /> : "Update"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

const UpdateProfileImage = ({ openProfileImageModal, onclick }) => {
  const { user, fetchUserProfile } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpdateProfileImage = async () => {
    // const savedUser = JSON.parse(localStorage.getItem("user"));

    setLoading(true);
    const formData = new FormData();
    formData.append("profileImage", image);
    try {
      const res = await axios.put(`${BASE_URL}/users/profile-image`, formData, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      console.log("update image res >>>>>", res?.data);
      if (res?.data?.success) {
        fetchUserProfile();
        toast.success(res?.data?.message);
        onclick();
      }

      // toast.success("Name updated");
    } catch (error) {
      console.log("update name error >>>>", error);
      toast.error("Something went wrong");
      onclick();
    } finally {
      setLoading(false);
    }
  };
  return (
    openProfileImageModal && (
      <div className="w-full h-screen fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center px-4">
        <div className="w-full lg:w-[487px] h-[323px] flex flex-col items-center justify-center gap-4 relative bg-white rounded-[12px]">
          <button
            type="button"
            onClick={onclick}
            className="w-6 h-6 rounded-full p-1 bg-[#F7F7F7] absolute top-4 right-4"
          >
            <IoClose className="w-full h-full" />
          </button>
          <div className="w-[80%] flex flex-col text-center gap-2 items-center justify-center">
            <p className="blue-text text-[20px] font-bold">
              Update Profile Image
            </p>
          </div>
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
          <div className="w-[80%] flex flex-col text-center gap-1 items-start justify-center">
            <button
              className="w-full w-ful py-3 rounded-[15px] blue-bg text-white font-semibold mt-4 h-[50px]"
              type="button"
              onClick={handleUpdateProfileImage}
            >
              {loading ? <ButtonLoader /> : "Update"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};
