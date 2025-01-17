import React from "react";
import SettingsLayout from "../../components/Settings/SettingsLayout";

const SettingsPage = ({ page }) => {
  return (
    <div className="w-full padding-x py-20 lg:py-6">
      <SettingsLayout page={page} />
    </div>
  );
};

export default SettingsPage;
