import logger from "../utils/logger";
import { getErrorMessage } from "../utils/errorMessages";

class BookService {
  constructor() {
    this.apiKey = import.meta.env.VITE_APP_API_KEY;
    this.baseUrl = "https://www.googleapis.com/books/v1/volumes";
  }

  async searchBooks(query, maxResults = 40) {
    try {
      const url = `${this.baseUrl}?q=${encodeURIComponent(query)}&orderBy=relevance&key=${this.apiKey}&langRestrict=en&maxResults=${maxResults}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return this.filterValidBooks(result.items || []);
    } catch (error) {
      logger.error("Book search failed", {
        query,
        error: error.message,
        userMessage: getErrorMessage("BOOK_SEARCH_FAILED"),
      });
      throw new Error(getErrorMessage("BOOK_SEARCH_FAILED"));
    }
  }

  filterValidBooks(books) {
    return books.filter(
      book =>
        book.volumeInfo.pageCount &&
        book.volumeInfo.title &&
        book.volumeInfo.imageLinks?.thumbnail &&
        book.volumeInfo.authors &&
        book.volumeInfo.publishedDate &&
        book.volumeInfo.description &&
        book.volumeInfo.categories
    );
  }
}

export const bookService = new BookService();
