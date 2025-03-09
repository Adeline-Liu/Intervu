import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from 'react';

import Header from "../Header";
import Footer from "../Footer";
import ResumeUploader from '../components/ResumeUploader';
import ResumePreviewer from '../components/ResumePreviewer';
import JobDescriptionSelector from "../components/JobDescriptionSelector";
import JobDescriptionSelected from "../components/JobDescriptionSelected";

const DashboardPage = () => {
  const navigate = useNavigate();

  const [fileKey, setFileKey] = useState(''); // for resume
  const [selectedJob, setSelectedJob] = useState(null); // for job description

//   NOTE: This is a very simple navigation click, checks still need to be done to ensure a resume is uploaded and job description
//         is selected before navigating to the mock interview page. Update when backend is done.
  const handleInterviewClick = () => {
    navigate("/mock_interview");
  };

  return (
    <div>
      <Header />
      <div role="main">
        {/* Title */}
        <section className = "px-[100px] py-[50px] items-center bg-beige">
          <h1 id="Dashboard" className="text-6xl font-bold text-darkBlue max-w-5xl leading-20">
              Dashboard
          </h1>
          <div className="w-35 border-b-5 border-lightPurple"></div>
        </section>
        <div role="region" aria-labelledby="Dashboard">
          {/* Resume upload */}
          <section role="region" aria-labelledby="ResumeUpload">
            <div className = "px-[100px] py-[50px] items-center bg-gradient-to-b from-beige to-darkGolden">
              <h2 id="ResumeUpload" className="text-4xl text-darkBlue py-[20px] font-bold">
                Resume Upload
              </h2>
              <div className = "flex">
                <div className = "w-1/2 flex items-center">
                    <ResumeUploader onUploadComplete={setFileKey} bgColor = "var(--color-brown)" textColor = "white" bgColorHover = "#3b2e23"/>
                </div>
                <div className = "w-1/2 flex items-center h-[300px]"> {/*Remove h-[300px] whem resume previewer is implemented*/}
                    {/* VERY IMPORTANT NOTE: ResumePreviewer has skeleton code and is not properly styled. Update when AWS Amplify is implemented */}
                    {fileKey && <ResumePreviewer fileKey={fileKey} />}
                    <p>Remove me later, I'm just here to let you know I exist :D (this is a resume previewer container)</p>
                </div>
              </div>
            </div>
          </section>
          {/* Job Description Upload/Search */}
          <section role="region" aria-labelledby="JobDescription">
            <div className = "px-[100px] py-[50px] items-center bg-gradient-to-b from-darkGolden to-darkPurple">
              <div id="JobDescription">
                <JobDescriptionSelector setSelectedJob={setSelectedJob} textColor = "var(--color-darkBlue)" itemBackgroundColor = "var(--color-darkBlue)"/>
                <JobDescriptionSelected selectedJob={selectedJob} />
              </div>
            </div>
          </section>
          {/* Practice with AI */}
          <section className = "px-[100px] py-[50px] items-center bg-darkPurple" role="region" aria-labelledby="PracticeNow">
            <h1 id="PracticeNow" className="text-5xl font-bold text-white w-full text-center my-[30px]">
                Practice Interview with AI
            </h1>
            <div className = "flex justify-center my-[30px]">
                <button
                    className="font-bold text-center text-3xl bg-[#5c6491] text-white px-[32px] py-[20px] rounded-md hover:bg-[#444A6B] transition-colors"
                    onClick={handleInterviewClick}
                    role="button">
                    Practice Now
                </button>
            </div>
          </section>
        </div>
      </div>
      <Footer borderingColor = "var(--color-darkPurple)"/>
    </div>
  );
};

export default DashboardPage;
