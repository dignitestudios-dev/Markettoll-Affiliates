import React, { useContext } from "react";
import LoginForm from "../../components/Auth/LoginForm";
import { AuthContext } from "../../context/authContext";

const LoginPage = () => {
  const { user } = useContext(AuthContext);
  console.log("user", user);
  return (
    <div className="padding-x py-6">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
