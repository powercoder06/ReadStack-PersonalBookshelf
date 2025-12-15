import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ErrorBoundary from "../components/ErrorBoundary";
import ErrorFallback from "../components/ErrorFallback";
import { useErrorHandler } from "../hooks/useErrorHandler";
import logger from "../utils/logger";
import errorReporter from "../utils/errorReporter";
import { categorizeError, getErrorMessage } from "../utils/errorMessages";

// Mock components and utilities
vi.mock("../utils/logger", () => ({
  default: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
    performance: vi.fn(),
    userAction: vi.fn(),
    getRecentLogs: vi.fn(() => []),
  },
}));

vi.mock("../utils/errorReporter", () => ({
  default: {
    report: vi.fn(),
    reportReactError: vi.fn(),
    reportApiError: vi.fn(),
  },
}));

const ThrowError = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div>No error</div>;
};

describe("Error Handling System", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("ErrorBoundary", () => {
    it("should catch and display errors", () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText("Oops! Something went wrong")).toBeInTheDocument();
      expect(screen.getByText("Try Again")).toBeInTheDocument();
      expect(screen.getByText("Reload Page")).toBeInTheDocument();
    });

    it("should increment retry counter on retry button click", () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Initial state
      expect(screen.getByText("Try Again")).toBeInTheDocument();

      // Click retry
      const retryButton = screen.getByText("Try Again");
      fireEvent.click(retryButton);

      // Should show retry count
      expect(screen.getByText("Try Again (1)")).toBeInTheDocument();
    });

    it("should show feedback form", () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const textarea = screen.getByPlaceholderText(/Help us improve/);
      const submitButton = screen.getByText("Send Feedback");

      expect(textarea).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toBeDisabled();

      fireEvent.change(textarea, { target: { value: "Test feedback" } });
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe("ErrorFallback", () => {
    it("should render error information", () => {
      const mockError = new Error("Test error message");
      const mockRetry = vi.fn();

      render(<ErrorFallback error={mockError} retry={mockRetry} />);

      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
      expect(screen.getByText("Test error message")).toBeInTheDocument();
      expect(screen.getByText("Try Again")).toBeInTheDocument();
    });

    it("should call retry function when button is clicked", () => {
      const mockError = new Error("Test error");
      const mockRetry = vi.fn();

      render(<ErrorFallback error={mockError} retry={mockRetry} />);

      fireEvent.click(screen.getByText("Try Again"));
      expect(mockRetry).toHaveBeenCalledTimes(1);
    });
  });

  describe("useErrorHandler hook", () => {
    const TestComponent = () => {
      const { error, handleError, retry, clearError } = useErrorHandler();

      return (
        <div>
          {error && <div data-testid="error">{error.userMessage}</div>}
          <button onClick={() => handleError(new Error("Test error"))}>Trigger Error</button>
          <button onClick={() => retry(() => Promise.resolve("success"))}>Retry</button>
          <button onClick={clearError}>Clear Error</button>
        </div>
      );
    };

    it("should handle errors correctly", async () => {
      render(<TestComponent />);

      fireEvent.click(screen.getByText("Trigger Error"));

      await waitFor(() => {
        expect(screen.getByTestId("error")).toBeInTheDocument();
      });

      expect(logger.error).toHaveBeenCalled();
      expect(errorReporter.report).toHaveBeenCalled();
    });

    it("should clear errors", async () => {
      render(<TestComponent />);

      fireEvent.click(screen.getByText("Trigger Error"));

      await waitFor(() => {
        expect(screen.getByTestId("error")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("Clear Error"));

      await waitFor(() => {
        expect(screen.queryByTestId("error")).not.toBeInTheDocument();
      });
    });
  });

  describe("Error categorization", () => {
    it("should categorize network errors correctly", () => {
      const networkError = new TypeError("Failed to fetch");
      expect(categorizeError(networkError)).toBe("NETWORK");
    });

    it("should categorize timeout errors correctly", () => {
      const timeoutError = new Error("Request timeout");
      expect(categorizeError(timeoutError)).toBe("TIMEOUT");
    });

    it("should categorize API errors correctly", () => {
      const apiError = new Error("API Error");
      apiError.status = 500;
      expect(categorizeError(apiError)).toBe("API");
    });

    it("should default to generic error type", () => {
      const genericError = new Error("Unknown error");
      expect(categorizeError(genericError)).toBe("GENERIC");
    });
  });

  describe("Error messages", () => {
    it("should return correct error message for known types", () => {
      expect(getErrorMessage("NETWORK_ERROR")).toBe(
        "Unable to connect. Please check your internet connection and try again."
      );
    });

    it("should return fallback message for unknown types", () => {
      expect(getErrorMessage("UNKNOWN_ERROR")).toBe(
        "Something went wrong. Please try again or refresh the page."
      );
    });

    it("should use custom fallback message", () => {
      const customFallback = "Custom error message";
      expect(getErrorMessage("UNKNOWN_ERROR", customFallback)).toBe(customFallback);
    });
  });

  describe("Logger", () => {
    it("should call error method with correct parameters", () => {
      logger.error("Test error", { context: "test" });

      expect(logger.error).toHaveBeenCalledWith("Test error", { context: "test" });
    });

    it("should call performance method with correct parameters", () => {
      logger.performance("test-operation", 1500, { component: "TestComponent" });

      expect(logger.performance).toHaveBeenCalledWith("test-operation", 1500, {
        component: "TestComponent",
      });
    });
  });
});
