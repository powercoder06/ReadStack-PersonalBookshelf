import { useState } from "react";
import { bookService } from "../services/bookService";

export const useBookSearch = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchBooks = async query => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const results = await bookService.searchBooks(query);
      setData(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, searchBooks };
};
