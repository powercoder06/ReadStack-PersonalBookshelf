import { useEffect, useRef, useState } from "react";
import "../styles/headerStyles/header.css";
import logo from "../assets/logo1light.png";
import logoDarkMode from "../assets/logo1.png";
import hamburgerMenuIcon from "../assets/hamburger-menu-icon.svg";
import hamburgerMenuIconDarkMode from "../assets/hamburger-menu-icon-darkmode.svg";
import closeIcon from "../assets/close-icon.svg";
import closeIconDarkMode from "../assets/close-icon-darkmode.svg";
import { Link } from "react-router-dom";
import { Navigation } from "../components/layout/Navigation";
import { ThemeToggle } from "../components/ui/ThemeToggle";

function Header({ darkMode, setDarkMode }) {
  const [sideBar, setSideBar] = useState(false);
  const navRef = useRef();

  const showSideBar = () => {
    setSideBar(!sideBar);
  };

  const closeSideBar = () => {
    setSideBar(false);
  };

  useEffect(() => {
    const handleClickOutside = e => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setSideBar(false);
      }
    };
    document.body.addEventListener("click", handleClickOutside, true);
    return () => document.body.removeEventListener("click", handleClickOutside, true);
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
      <div ref={navRef}>
        <Navigation darkMode={darkMode} isOpen={sideBar} onClose={closeSideBar} />
        {sideBar && (
          <img
            className="close"
            src={darkMode ? closeIconDarkMode : closeIcon}
            alt="close icon"
            onClick={showSideBar}
          />
        )}
      </div>
      <ThemeToggle darkMode={darkMode} onToggle={setDarkMode} />
    </header>
  );
}

export default Header;
