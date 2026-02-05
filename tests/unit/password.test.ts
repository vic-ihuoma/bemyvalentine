import { describe, it, expect } from "vitest";
import { validatePassword, shouldShowError } from "../../src/lib/password";

describe("validatePassword", () => {
  it("accepts correct password in lowercase", () => {
    expect(validatePassword("sheep")).toBe(true);
  });

  it("accepts correct password in uppercase", () => {
    expect(validatePassword("SHEEP")).toBe(true);
  });

  it("accepts correct password in mixed case", () => {
    expect(validatePassword("ShEeP")).toBe(true);
  });

  it("accepts correct password with leading/trailing whitespace", () => {
    expect(validatePassword("  sheep  ")).toBe(true);
  });

  it("rejects incorrect password", () => {
    expect(validatePassword("goat")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(validatePassword("")).toBe(false);
  });

  it("rejects partial match", () => {
    expect(validatePassword("shee")).toBe(false);
  });

  it("rejects password with extra characters", () => {
    expect(validatePassword("sheeps")).toBe(false);
  });
});

describe("shouldShowError", () => {
  it("returns false when input is shorter than password", () => {
    expect(shouldShowError("she")).toBe(false);
    expect(shouldShowError("shee")).toBe(false);
  });

  it("returns true when input length equals password but is wrong", () => {
    expect(shouldShowError("goats")).toBe(true);
  });

  it("returns true when input is longer than password and wrong", () => {
    expect(shouldShowError("horses")).toBe(true);
  });

  it("returns false when input is correct", () => {
    expect(shouldShowError("sheep")).toBe(false);
  });

  it("returns false when correct with whitespace", () => {
    expect(shouldShowError("  sheep  ")).toBe(false);
  });
});
