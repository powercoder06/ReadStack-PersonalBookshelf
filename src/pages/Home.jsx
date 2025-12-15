import { useEffect, useRef } from "react";
import "../styles/homeStyles/home.css";
import Illustration from "../assets/Illustration.svg";
import { motion } from "framer-motion";
import { SearchForm } from "../components/ui/SearchForm";
import { BookGrid } from "../components/ui/BookGrid";
import { ScrollToTop } from "../components/ui/ScrollToTop";
import ErrorFallback from "../components/ErrorFallback";
import { useBookSearch } from "../hooks/useBookSearch";
import { useScrollBehavior } from "../hooks/useScrollBehavior";
import { usePerformanceMonitor } from "../hooks/usePerformanceMonitor";

function Home({ darkMode }) {
  const { data, loading, error, searchBooks, retrySearch, clearError } = useBookSearch();
  const { showScrollTop, scrollToTop, scrollToElement } = useScrollBehavior();
  const { measureOperation } = usePerformanceMonitor("Home");
  const booksRef = useRef();

  const handleSearch = async query => {
    await measureOperation("search", () => searchBooks(query))();
  };

  useEffect(() => {
    if (data) {
      scrollToElement(booksRef.current);
    }
  }, [data, scrollToElement]);

  return (
    <motion.main
      className={darkMode ? "home-container dark-mode" : "home-container"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <article className="hero">
        <section className="hero-text">
          <div className="quote">
            <h1>&quot; The right book can turn a non-reader into a bookworm &quot;</h1>
          </div>
          <div className="get-started">
            <h2>Get ready to transform !</h2>
            <SearchForm darkMode={darkMode} onSearch={handleSearch} />
          </div>
        </section>
        <section className="hero-image">
          <img
            src={Illustration}
            alt="Illustration of three people reading books made by Storyset"
          />
        </section>
      </article>

      <div ref={booksRef}>
        {loading && <div>Loading...</div>}
        {error && (
          <ErrorFallback
            error={error}
            retry={() => retrySearch(error.context?.query)}
            resetError={clearError}
          />
        )}
        <BookGrid books={data} darkMode={darkMode} />
      </div>

      <ScrollToTop show={showScrollTop} darkMode={darkMode} onClick={scrollToTop} />
    </motion.main>
  );
}

export default Home;
