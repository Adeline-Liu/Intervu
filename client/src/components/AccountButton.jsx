import { useNavigate } from "react-router-dom";

const AccountButton = ({
  bgColor = "white",
  bgColorHover = "grey",
  textColor = "black",
}) => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="flex justify-center items-center">
      <button
        className="text-center text-3xl font-semibold px-[32px] py-[20px] rounded-md transition-colors duration-300"
        onClick={handleLoginClick}
        style={{
          backgroundColor: bgColor,
          color: textColor,
          transition: "background-color 0.3s ease, color 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = bgColorHover;
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = bgColor;
        }}
      >
        Login
      </button>
    </div>
  );
};

export default AccountButton;
