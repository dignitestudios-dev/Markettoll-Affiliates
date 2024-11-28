import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WelcomePopup from "./WelcomePopup";

const Layout = ({ page }) => {
  const [closeModal, setCloseModal] = useState(true);

  const handleCloseModal = () => {
    setCloseModal(!closeModal);
  };

  return (
    <div>
      <Navbar />
      {page}
      <Footer />
      <WelcomePopup closeModal={closeModal} onclick={handleCloseModal} />
    </div>
  );
};

export default Layout;
