import "../styles/myNotesStyles/myNotes.css";
import Back from "../components/Back";
import { motion } from "framer-motion";
import { NavLink, Outlet } from "react-router-dom";

function MyNotes({ darkMode }) {
  const getNavLinkStyle = ({ isActive }) => {
    if (!isActive) return {};
    return darkMode
      ? { backgroundColor: "#c20aff", color: "#1f1f1f" }
      : { backgroundColor: "#5d0085", color: "#ffffff" };
  };

  return (
    <motion.main
      className={darkMode ? "my-notes-container dark-mode" : "my-notes-container"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Back darkMode={darkMode} />
      <div className="book-notes-selection">
        <NavLink className="link" style={getNavLinkStyle} to="/mynotes/currentreadingbooksnotes">
          Current reading books notes
        </NavLink>
        <NavLink className="link" style={getNavLinkStyle} to="/mynotes/archivedbooksnotes">
          Archived books notes
        </NavLink>
      </div>
      <Outlet />
    </motion.main>
  );
}

export default MyNotes;
