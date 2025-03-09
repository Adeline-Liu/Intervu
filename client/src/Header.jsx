import AccountButton from "./components/AccountButton";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <nav className="text-3xl bg-darkBlue text-white sticky" role="navigation">
      <div className="px-[100px] py-[20px] top-0 flex justify-between w-full items-center">
        <div style={{ position: "relative" }}>
          <button
            className="fancyButton font-bold px-[32px] py-[20px]"
            onClick={handleHomeClick}
            role="button"
          >
            Intervu
          </button>
        </div>
        {/* <AccountButton bgColor = "var(--color-darkBlue)" textColor = "white" bgColorHover = "var(--color-slateGrey)" role="button"/> */}
      </div>
    </nav>
  );
};

export default Header;
