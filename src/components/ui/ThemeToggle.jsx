import sunIcon from "../../assets/sun-icon.svg";
import moonIcon from "../../assets/moon-icon.svg";

export const ThemeToggle = ({ darkMode, onToggle }) => {
  return (
    <div className={darkMode ? "mode dark-mode" : "mode"}>
      <img src={darkMode ? moonIcon : sunIcon} alt={darkMode ? "moon icon" : "sun icon"} />
      <label className="toggle">
        <input type="checkbox" onChange={onToggle} checked={darkMode} />
        <span className="slider" />
      </label>
    </div>
  );
};
