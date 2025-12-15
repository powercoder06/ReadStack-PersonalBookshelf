import { useEffect, useRef, useState } from "react";
import "../styles/headerStyles/header.css";
import logo from "../assets/logo1light.png";
import logoDarkMode from "../assets/logo1.png";
import sunIcon from "../assets/sun-icon.svg";
import moonIcon from "../assets/moon-icon.svg";
import hamburgerMenuIcon from "../assets/hamburger-menu-icon.svg";
import hamburgerMenuIconDarkMode from "../assets/hamburger-menu-icon-darkmode.svg";
import closeIcon from "../assets/close-icon.svg";
import closeIconDarkMode from "../assets/close-icon-darkmode.svg";
import { Link, NavLink } from "react-router-dom";

function Header({ darkMode, setDarkMode }) {
  const [sideBar, setSideBar] = useState(false);
  const navRef = useRef();

  const handleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const showSideBar = () => {
    setSideBar(!sideBar);
  };

  const getNavLinkStyle = ({ isActive }) => {
    if (!isActive) return {};
    return darkMode
      ? { backgroundColor: "#c20aff", color: "#1f1f1f" }
      : { backgroundColor: "#7800ac", color: "#ffffff" };
  };

  useEffect(() => {
    const closeSideBar = e => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setSideBar(false);
      }
    };
    document.body.addEventListener("click", closeSideBar, true);
    return () => document.body.removeEventListener("click", closeSideBar, true);
  });
  return (
    <header className={darkMode ? "header dark-mode" : "header"}>
      <img
        className="humburger-menu"
        src={darkMode ? hamburgerMenuIconDarkMode : hamburgerMenuIcon}
        alt="hamburger menu icon"
        onClick={showSideBar}
      />
      <div className="header-logo">
        <Link to="/" reloadDocument>
          <img src={darkMode ? logoDarkMode : logo} alt="Books icon" />
        </Link>
      </div>
      <nav className={sideBar ? "header-nav show-sidebar" : "header-nav"} ref={navRef}>
        <img
          className="close"
          src={darkMode ? closeIconDarkMode : closeIcon}
          alt="close icon"
          onClick={showSideBar}
        />
        <ul>
          <li>
            <NavLink className="link" style={getNavLinkStyle} to="/">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink className="link" style={getNavLinkStyle} to="mybooks">
              Bookshelf
            </NavLink>
          </li>
          <li>
            <NavLink className="link" style={getNavLinkStyle} to="mynotes/currentreadingbooksnotes">
              My Notes
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className={darkMode ? "mode dark-mode" : "mode"}>
        <img src={darkMode ? moonIcon : sunIcon} alt={darkMode ? "moon icon" : "sun icon"} />
        <label className="toggle">
          <input type="checkbox" onClick={handleDarkMode} />
          <span className="slider"></span>
        </label>
      </div>
    </header>
  );
}

export default Header;
