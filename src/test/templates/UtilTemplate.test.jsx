import { describe, it, expect } from "vitest";
import { utilFunction } from "../utils/utilFunction";

describe("utilFunction", () => {
  it("returns expected result for valid input", () => {
    const input = "test input";
    const result = utilFunction(input);

    expect(result).toBe("expected output");
  });

  it("handles edge cases", () => {
    expect(utilFunction("")).toBe("");
    expect(utilFunction(null)).toBe(null);
    expect(utilFunction(undefined)).toBe(undefined);
  });

  it("throws error for invalid input", () => {
    expect(() => utilFunction(-1)).toThrow("Invalid input");
  });

  it("processes arrays correctly", () => {
    const input = [1, 2, 3];
    const result = utilFunction(input);

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(3);
  });
});
