import React from "react";
import { useNavigate } from "react-router-dom";

import Header from "../Header";
import Footer from "../Footer";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleSignupClick = () => {
    navigate("/signup");
  };

  // TEMPORARY
  const handleDashboardClick = () => {
    navigate("/dashboard");
  };
  //TEMPORARY

  return (
    <div>
      <Header />

      <div className="flex items-center justify-center px-[100px] py-[50px] bg-darkGolden screen_height" role="main">
        <div className="bg-beige p-10 rounded-xl shadow-md w-[50%] h-fit">
          <h2 className="text-center text-4xl font-semibold text-darkBlue">
            Login to
          </h2>
          <h1 className="text-center text-4xl font-bold text-darkBlue mt-1">
            TITLE OF PRODUCT
          </h1>
          <div className="w-18 border-b-2 border-darkGolden mx-auto mt-2"></div>

          <form className="mt-6" role="form">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Username"
                className="text-2xl w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 mt-3 bg-white"
              />
            </div>
            <div>
            <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                className="text-2xl w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 mt-3 bg-white"
              />
            </div>
            <div className="flex mt-3">
              <a href="" className="text-darkBlue text-2xl hover:underline" onClick={handleSignupClick}>
                Don't have an account? Sign up here
              </a>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="text-center text-3xl bg-brown text-white px-[32px] py-[20px] rounded-md hover:bg-[#3b2e23] transition-colors mt-[20px]"
                onClick={handleDashboardClick}
                role="button">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer borderingColor = "var(--color-darkGolden)"/>
    </div>
  );
};

export default LoginPage;
