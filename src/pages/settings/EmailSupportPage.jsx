import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";
import RequestSentModal from "../../components/Global/RequestSentModal";
import ButtonLoader from "../../components/Global/ButtonLoader";

const EmailSupportPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/users/email-support-request`,
        {
          title,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      console.log("email support sent >>>>", res);
      if (res?.status == 201) {
        setSuccess(true);
      }
    } catch (error) {
      console.log("err while sending email >>>", error?.response);
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSuccess(false);
    navigate("/settings/support-request");
  };
  return (
    <div className="w-full px-0 md:px-5">
      <div className="flex items-center gap-2">
        <Link to="/settings/support-request">
          <GoArrowLeft className="text-2xl" />
        </Link>
        <h2 className="font-bold text-[28px] blue-text">Email Support</h2>
      </div>
      <div className="w-full border mt-5 mb-4" />

      <form onSubmit={handleSubmit} className="w-full">
        <div className="w-full flex flex-col items-start gap-1">
          <label htmlFor="title" className="text-[13px] font-medium">
            Title
          </label>
          <input
            type="text"
            placeholder="Enter Title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded-2xl px-4 py-3 text-sm text-[#5c5c5c] w-full outline-none"
          />
        </div>
        <div className="w-full flex flex-col items-start gap-1 my-5">
          <textarea
            name="description"
            id="description"
            placeholder="Description"
            required
            rows={7}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded-2xl px-4 py-3 text-sm text-[#5c5c5c] w-full outline-none"
          ></textarea>
        </div>

        <button
          type="submit"
          className="blue-bg text-white py-3 text-base font-bold rounded-2xl w-full h-[50px]"
        >
          {loading ? <ButtonLoader /> : "Submit Request"}
        </button>
      </form>
      <RequestSentModal onclose={handleCloseModal} success={success} />
    </div>
  );
};

export default EmailSupportPage;
