import arrowUpIcon from "../../assets/arrow-up-icon.svg";
import arrowUpIconDark from "../../assets/arrow-up-icon-darkmode.svg";

export const ScrollToTop = ({ show, darkMode, onClick }) => {
  return (
    <img
      className={show ? "arrow-up fixed" : "arrow-up"}
      src={darkMode ? arrowUpIconDark : arrowUpIcon}
      alt="arrow up icon"
      onClick={onClick}
    />
  );
};
