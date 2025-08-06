import React, { useContext, useEffect } from "react";
import LoginForm from "../../components/Auth/LoginForm";
import { AuthContext } from "../../context/authContext";

const LoginPage = () => {
  const {setVerificationStatus}=useContext(AuthContext)
  useEffect(() => {
    setVerificationStatus({
      email: false,
      phone: false,
    });
  }, []);


  return (
    <div className="padding-x py-6">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
