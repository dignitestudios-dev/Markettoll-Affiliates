import React from "react";
import AddJobForm from "../../components/AddJob/AddJobForm";
import { Link } from "react-router-dom";

const AddJobPage = () => {
  return (
    <div>
      <div className="padding-x mt-5">
        <div className="rounded-[30px] bg-[#F7F7F7]  grid grid-cols-2 divide-x-2 overflow-hidden font-bold text-lg">
          <Link to={"/add-service"}>
            <div className="p-5 text-center">Add Service</div>
          </Link>

          <div className="p-5 text-center bg-[#0098EA] text-white">Add Job</div>
        </div>
      </div>
      <AddJobForm />
    </div>
  );
};

export default AddJobPage;
