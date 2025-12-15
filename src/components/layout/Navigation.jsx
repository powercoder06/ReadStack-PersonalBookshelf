import { NavLink } from "react-router-dom";

export const Navigation = ({ darkMode, isOpen, onClose }) => {
  const getNavLinkStyle = ({ isActive }) => {
    if (!isActive) return {};
    return darkMode
      ? { backgroundColor: "#c20aff", color: "#1f1f1f" }
      : { backgroundColor: "#7800ac", color: "#ffffff" };
  };

  return (
    <nav className={isOpen ? "header-nav show-sidebar" : "header-nav"}>
      <ul>
        <li>
          <NavLink className="link" style={getNavLinkStyle} to="/" onClick={onClose}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink className="link" style={getNavLinkStyle} to="mybooks" onClick={onClose}>
            Bookshelf
          </NavLink>
        </li>
        <li>
          <NavLink
            className="link"
            style={getNavLinkStyle}
            to="mynotes/currentreadingbooksnotes"
            onClick={onClose}
          >
            My Notes
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};
