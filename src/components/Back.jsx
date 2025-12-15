import "../styles/backStyles/back.css";
import BackIcon from "../assets/back-icon.svg";
import BackIconDarkMode from "../assets/back-icon-darkmode.svg";
import { useNavigate } from "react-router-dom";

function Back({ darkMode }) {
  const navigate = useNavigate();

  return (
    <button className={darkMode ? "back dark-mode" : "back"} onClick={() => navigate(-1)}>
      Back <img src={darkMode ? BackIconDarkMode : BackIcon} alt="back icon" />
    </button>
  );
}

export default Back;
