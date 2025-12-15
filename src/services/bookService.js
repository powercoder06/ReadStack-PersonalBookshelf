import logger from "../utils/logger";
import errorReporter from "../utils/errorReporter";
import { getErrorMessage, categorizeError } from "../utils/errorMessages";

class BookService {
  constructor() {
    this.apiKey = import.meta.env.VITE_APP_API_KEY;
    this.baseUrl = "https://www.googleapis.com/books/v1/volumes";
    this.timeout = 10000; // 10 seconds
    this.retryAttempts = 3;
    this.retryDelay = 1000;
  }

  async searchBooks(query, maxResults = 40) {
    const startTime = Date.now();

    try {
      logger.info("Book search started", { query, maxResults });

      const result = await this.fetchWithRetry(query, maxResults);
      const duration = Date.now() - startTime;

      logger.performance("Book search completed", duration, {
        query,
        resultCount: result.length,
        maxResults,
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorCategory = categorizeError(error);

      logger.error("Book search failed", {
        query,
        maxResults,
        duration,
        error: error.message,
        category: errorCategory,
        userMessage: getErrorMessage("BOOK_SEARCH_FAILED"),
      });

      errorReporter.reportApiError(
        error,
        {
          url: this.buildUrl(query, maxResults),
          method: "GET",
        },
        {
          query,
          maxResults,
          duration,
          category: errorCategory,
        }
      );

      throw new Error(getErrorMessage("BOOK_SEARCH_FAILED"));
    }
  }

  buildUrl(query, maxResults) {
    return `${this.baseUrl}?q=${encodeURIComponent(query)}&orderBy=relevance&key=${this.apiKey}&langRestrict=en&maxResults=${maxResults}`;
  }

  async fetchWithRetry(query, maxResults, attempt = 1) {
    try {
      const url = this.buildUrl(query, maxResults);
      const response = await this.fetchWithTimeout(url);

      if (!response.ok) {
        const error = new Error(`HTTP error! status: ${response.status}`);
        error.status = response.status;
        throw error;
      }

      const result = await response.json();

      if (!result.items || result.items.length === 0) {
        logger.warn("No books found", { query, maxResults });
        return [];
      }

      return this.filterValidBooks(result.items);
    } catch (error) {
      if (attempt < this.retryAttempts && this.shouldRetry(error)) {
        logger.warn(`Book search attempt ${attempt} failed, retrying...`, {
          query,
          attempt,
          error: error.message,
        });

        await this.delay(this.retryDelay * attempt);
        return this.fetchWithRetry(query, maxResults, attempt + 1);
      }

      throw error;
    }
  }

  async fetchWithTimeout(url) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          "User-Agent": "BookShelf/1.0",
        },
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === "AbortError") {
        const timeoutError = new Error("Request timeout");
        timeoutError.name = "TimeoutError";
        throw timeoutError;
      }

      throw error;
    }
  }

  shouldRetry(error) {
    // Retry on network errors, timeouts, and 5xx server errors
    return (
      error.name === "TypeError" || // Network error
      error.name === "TimeoutError" ||
      (error.status >= 500 && error.status < 600) ||
      error.status === 429 // Rate limiting
    );
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  filterValidBooks(books) {
    const validBooks = books.filter(
      book =>
        book.volumeInfo.pageCount &&
        book.volumeInfo.title &&
        book.volumeInfo.imageLinks?.thumbnail &&
        book.volumeInfo.authors &&
        book.volumeInfo.publishedDate &&
        book.volumeInfo.description &&
        book.volumeInfo.categories
    );

    logger.debug("Books filtered", {
      totalBooks: books.length,
      validBooks: validBooks.length,
      filteredOut: books.length - validBooks.length,
    });

    return validBooks;
  }
}

export const bookService = new BookService();
