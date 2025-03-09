import React from "react";
import { useNavigate } from "react-router-dom";

import Header from "../Header";
import Footer from "../Footer";
import WaveGenerator from "../components/WaveGenerator";

const CoverPage = () => {
  const navigate = useNavigate();
  const waveHeight = 125;

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div>
      <Header />
      <div role="main">
        <section className="relative text-left bg-beige screen_height" role="banner">
          {/* Title section */}
          <div className = "title flex items-left h-[75%] px-[100px] py-[50px] items-center">
            <div>
              <h1 className="text-8xl font-bold text-darkBlue mb-10 max-w-5xl">
                Practice <i>Smarter</i>
              </h1>
              <h1 className="text-8xl font-bold text-darkBlue mb-10 max-w-5xl ml-20">
                Interview <i>Better</i>
              </h1>
            </div>
          </div>
          {/* Wave border */}
          <div className="absolute left-0 right-0 -bottom-1 w-full">
            <WaveGenerator amplitude={waveHeight/2} frequency={0.005} height={waveHeight} speed={0.05} unmaskedBg = "var(--color-beige)"
            leftGradient = "var(--color-darkPurple)" rightGradient = "var(--color-lightPurple)"/>
          </div>
        </section>

        {/* Info section */}
        <section className="bg-darkGolden relative z-10 p-10 px-[100px] py-[50px]" role="region" aria-labelledby="IntroHeader">
          <div className="absolute left-0 right-0 top-0 w-full rotate-180"
          style={{ zIndex: -1 }}>
            <WaveGenerator amplitude={waveHeight/2} frequency={0.005} height={waveHeight + 30} speed={0.08} unmaskedBg = "var(--color-darkGolden)"
            leftGradient = "var(--color-darkPurple)" rightGradient = "var(--color-lightPurple)" is_rotated = {1}/>
          </div>
          <div>
            <h2 id="IntroHeader" className="text-5xl font-semibold text-white mb-3 ml-6 py-[20px]">
              Simple. Smart. Effective.
            </h2>
            <div className="w-30 border-b-5 border-darkGolden mb-6 ml-6"></div>
            <div>
              <div className="space-y-10 ml-6 text-3xl" role="list">
                {[
                  "Upload your resume",
                  "Upload your job description",
                  "Practice interview with AI",
                  "Get curated feedback",
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 text-darkBlue text-3xl"
                    role="listitem"
                  >
                    <span className="bg-darkBlue text-white w-20 h-20 flex items-center justify-center rounded-full font-bold mr-10 text-3xl">
                      {index + 1}
                    </span>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                className="text-center text-3xl bg-brown text-white px-[32px] py-[20px] rounded-md hover:bg-[#3b2e23] transition-colors"
                onClick={handleLoginClick}
                role="button"
              >
                Get Started
              </button>
            </div>
          </div>
        </section>
      </div>
      <Footer borderingColor = "var(--color-darkGolden)"/>
    </div>
  );
};

export default CoverPage;
