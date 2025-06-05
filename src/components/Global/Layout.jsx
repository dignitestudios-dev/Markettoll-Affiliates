import React, { useContext, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WelcomePopup from "./WelcomePopup";
import { AuthContext } from "../../context/authContext";

const Layout = ({ page }) => {
  const [closeModal, setCloseModal] = useState(true);
 const { user } = useContext(AuthContext);
  const handleCloseModal = () => {
    setCloseModal(!closeModal);
  };

  return (
    <div>
      <Navbar />
      {page}
      <Footer />
      {/* <WelcomePopup closeModal={closeModal} onclick={handleCloseModal} /> */}
    </div>
  );
};

export default Layout;
