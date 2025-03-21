import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import SignUp from "../components/SignUp";
import SignIn from "../components/SignIn";
import ForgetPassword from "../components/ForgetPassword";

const Login = () => {
  const { currentState } = useContext(ShopContext);

  if (currentState === "SignIn") {
    return <SignIn />;
  } else if (currentState === "SignUp") {
    return <SignUp />;
  } else if (currentState === "ForgetPassword") {
    return <ForgetPassword />;
  }
};

export default Login;
