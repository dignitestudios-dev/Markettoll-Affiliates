import React from "react";
import SettingsSidebar from "./SettingsSidebar";

const SettingsLayout = ({ page }) => {
  return (
    <div className="bg-[#F7F7F7] w-full h-[90vh] rounded-xl p-3 md:p-5">
      <div className="w-full h-[85vh] p-5 rounded-xl overflow-hidden bg-white grid grid-cols-3">
        <div className="col-span-1 hidden lg:block">
          <SettingsSidebar />
        </div>
        <div className="col-span-3 lg:col-span-2 relative overflow-y-scroll settings">
          {page}
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;
