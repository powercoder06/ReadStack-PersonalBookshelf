import { useState } from "react";
import searchIcon from "../../assets/search-magnifying-glass-icon.svg";
import searchIconDark from "../../assets/search-magnifying-glass-icon-darkmode.svg";

export const SearchForm = ({ darkMode, onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="search-input">
        <img src={darkMode ? searchIconDark : searchIcon} alt="search magnifying glass icon" />
        <input
          type="text"
          placeholder="Search for a book..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>
      <button className="search" type="submit">
        Search
      </button>
    </form>
  );
};
