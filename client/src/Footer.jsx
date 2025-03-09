import githubLogo from "./assets/github-logo.png";

const Footer = ({
  borderingColor = "white",
}) => {
  return (
    <div className="bg-darkBlue text-white px-[100px] py-[50px] flex justify-between text-left flex-col relative" role="contentinfo">
      <div className = "absolute w-3/4 h-[20px] top-0 left-1/2 transform -translate-x-1/2 rounded-bl-xl rounded-br-xl"
       style = {{backgroundColor: borderingColor}}></div>
      <h1 className="text-3xl font-bold mb-3 ml-[15px]">TITLE OF PRODUCT</h1>
      <div style={{width: "fit-content"}}>
        <a href="https://github.com/Adeline-Liu/Intervu" target="_blank" rel="noreferrer noopener" role="button" aria-label="View GitHub Repository">
          <div className="ml-[5px] p-[10px]">
            <img src={githubLogo} alt="GitHub Logo" width="50" height="50" className="noselect"/>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Footer;
