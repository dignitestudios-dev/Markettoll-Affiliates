import React from "react";
import AddServiceForm from "../../components/AddService/AddServiceForm";
import { Link } from "react-router-dom";

const AddServicePage = () => {
  return (
    <div>
      <div className="padding-x mt-5">
        <div className="rounded-[30px] bg-[#F7F7F7]  grid grid-cols-2 divide-x-2 overflow-hidden font-bold text-lg">
          <div className="p-5 text-center bg-[#0098EA] text-white">
            Add Service
          </div>
          <Link to={"/add-job"}>
            <div className="p-5 text-center">Add Job</div>
          </Link>
        </div>
      </div>
      <AddServiceForm />
    </div>
  );
};

export default AddServicePage;
