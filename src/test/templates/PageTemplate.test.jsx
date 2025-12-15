import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import PageName from "../page/PageName";

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, "localStorage", { value: mockLocalStorage });

const renderWithRouter = component => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("PageName", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders page content", () => {
    renderWithRouter(<PageName />);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("handles localStorage operations", () => {
    mockLocalStorage.getItem.mockReturnValue("[]");
    renderWithRouter(<PageName />);
    expect(mockLocalStorage.getItem).toHaveBeenCalled();
  });

  it("displays empty state when no data", () => {
    mockLocalStorage.getItem.mockReturnValue("[]");
    renderWithRouter(<PageName />);
    expect(screen.getByText(/no.*found/i)).toBeInTheDocument();
  });
});
