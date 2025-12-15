import Back from "./Back";
import Toast from "./Toast";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { BookActions } from "./book/BookActions/BookActions";
import { BookDetails } from "./book/BookDetails/BookDetails";
import { useBookActions } from "../hooks/business/useBookActions";

function Searched({ darkMode, archivedBooks }) {
  const location = useLocation();
  const book = location.state?.bookDetails;

  // Use custom hook for book actions persistence
  useBookActions();

  if (!book) return null;

  return (
    <motion.main
      className={darkMode ? "searched-container dark-mode" : "searched-container"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <section className="back-and-add-to">
        <Back darkMode={darkMode} />
        <BookActions book={book} darkMode={darkMode} archivedBooks={archivedBooks} />
      </section>

      <BookDetails darkMode={darkMode} />
      <Toast darkMode={darkMode} />
    </motion.main>
  );
}

export default Searched;
