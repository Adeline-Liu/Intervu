const Footer = ({ borderingColor = "white" }) => {
  return (
    <div className="bg-darkBlue text-white px-[100px] py-[50px] flex justify-between text-left flex-col relative">
      <div
        className="absolute w-3/4 h-[20px] top-0 left-1/2 transform -translate-x-1/2 rounded-bl-xl rounded-br-xl"
        style={{ backgroundColor: borderingColor }}
      ></div>
      <h1 className="text-3xl font-bold mb-3 ml-10">TITLE OF PRODUCT</h1>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="#213555"
        style={{ filter: "invert(100%)" }}
        className="ml-10 mt-1 "
        viewBox="0 0 100 100"
        width="50"
        height="50"
      >
        <path d="M 48.854 0 C 21.839 0 0 22 0 49.217 c 0 21.756 13.993 40.172 33.405 46.69 c 2.427 0.49 3.316 -1.059 3.316 -2.362 c 0 -1.141 -0.08 -5.052 -0.08 -9.127 c -13.59 2.934 -16.42 -5.867 -16.42 -5.867 c -2.184 -5.704 -5.42 -7.17 -5.42 -7.17 c -4.448 -3.015 0.324 -3.015 0.324 -3.015 c 4.934 0.326 7.523 5.052 7.523 5.052 c 4.367 7.496 11.404 5.378 14.235 4.074 c 0.404 -3.178 1.699 -5.378 3.074 -6.6 c -10.839 -1.141 -22.243 -5.378 -22.243 -24.283 c 0 -5.378 1.94 -9.778 5.014 -13.2 c -0.485 -1.222 -2.184 -6.275 0.486 -13.038 c 0 0 4.125 -1.304 13.426 5.052 a 46.97 46.97 0 0 1 12.214 -1.63 c 4.125 0 8.33 0.571 12.213 1.63 c 9.302 -6.356 13.427 -5.052 13.427 -5.052 c 2.67 6.763 0.97 11.816 0.485 13.038 c 3.155 3.422 5.015 7.822 5.015 13.2 c 0 18.905 -11.404 23.06 -22.324 24.283 c 1.78 1.548 3.316 4.481 3.316 9.126 c 0 6.6 -0.08 11.897 -0.08 13.526 c 0 1.304 0.89 2.853 3.316 2.364 c 19.412 -6.52 33.405 -24.935 33.405 -46.691 C 97.707 22 75.788 0 48.854 0 Z" />
      </svg>
    </div>
  );
};

export default Footer;
