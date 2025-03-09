import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import Header from "../Header";
import Footer from "../Footer";
import CameraView from "../components/CameraView";
import InterviewWindow from "../components/InterviewWindow";

const InterviewPage = () => {
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    navigate("/dashboard");
  };

  return (
    <div>
      <Header />
      {/* Title */}
      <section className="px-[100px] py-[50px] items-center bg-navyBlue screen_height">
        <div className="flex justify-between">
          <div className="w-2/5">
            <h1 className="text-6xl font-bold text-beige max-w-5xl leading-20">
              Dashboard
            </h1>
            <div className="w-35 border-b-5 border-lightPurple mb-[20px]"></div>
            <h1 className="text-2xl font-semibold text-beige leading-10">
              <u>Job Title</u>: JOB TITLE
            </h1>
            <h1 className="text-2xl font-semibold text-beige leading-15">
              <u>Company</u>: COMPANY
            </h1>
            <button className="font-semibold text-center text-3xl bg-slateBlue text-white my-[50px] px-[50px] py-[20px] rounded-md hover:bg-[#28416B] transition-colors">
              Start
            </button>
            <CameraView />
          </div>
          <div className="w-3/5">
            <InterviewWindow />
          </div>
        </div>
      </section>
      {/* Feedback */}
      <section>
        <div className="px-[100px] py-[50px] items-center bg-navyBlue">
          <h2 className="text-4xl text-white py-[20px] font-bold">Feedback</h2>
          <div className="bg-darkBlue px-[50px] py-[30px] rounded-[15px]">
            <p className="text-2xl font-semibold text-white w-full">Yaya</p>
            <div className="flex justify-center my-[30px]">
              {/* This must be implemented when the backend is fully implemented */}
              <button className="font-bold text-center text-3xl bg-slateBlue text-white px-[32px] py-[20px] rounded-md hover:bg-[#28416B] transition-colors">
                Save to local directory
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-center bg-navyBlue">
          <button
            className="font-bold text-center text-3xl bg-[#4F567D] text-white my-[30px] px-[32px] py-[20px] rounded-md hover:bg-[#3E4361] transition-colors"
            onClick={handleDashboardClick}
          >
            Return to Dashboard
          </button>
        </div>
      </section>
      <Footer borderingColor="var(--color-navyBlue)" />
    </div>
  );
};

export default InterviewPage;
