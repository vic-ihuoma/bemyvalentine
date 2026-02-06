import { describe, it, expect } from "vitest";
import { determineInitialStep } from "../../src/lib/state";

describe("determineInitialStep", () => {
  it("returns countdown before Feb 14", () => {
    const jan1 = new Date(2026, 0, 1, 12, 0, 0);
    expect(determineInitialStep(jan1, null)).toBe("countdown");
  });

  it("returns clouds on Feb 14 with no saved state", () => {
    const feb14 = new Date(2026, 1, 14, 12, 0, 0);
    expect(determineInitialStep(feb14, null)).toBe("clouds");
  });

  it("returns celebration on Feb 14 with saved celebration state", () => {
    const feb14 = new Date(2026, 1, 14, 12, 0, 0);
    expect(determineInitialStep(feb14, "celebration")).toBe("celebration");
  });

  it("returns clouds on Feb 14 even with saved non-celebration state", () => {
    const feb14 = new Date(2026, 1, 14, 12, 0, 0);
    expect(determineInitialStep(feb14, "password")).toBe("clouds");
  });

  it("returns countdown after Feb 14 (Feb 15)", () => {
    const feb15 = new Date(2026, 1, 15, 0, 0, 0);
    expect(determineInitialStep(feb15, null)).toBe("countdown");
  });

  it("returns countdown after Feb 14 even with saved celebration state", () => {
    const feb15 = new Date(2026, 1, 15, 0, 0, 0);
    expect(determineInitialStep(feb15, "celebration")).toBe("countdown");
  });

  it("treats midnight Feb 14 as Valentine's Day", () => {
    const midnightFeb14 = new Date(2026, 1, 14, 0, 0, 0);
    expect(determineInitialStep(midnightFeb14, null)).toBe("clouds");
  });

  it("treats 23:59:59 Feb 14 as Valentine's Day", () => {
    const lateFeb14 = new Date(2026, 1, 14, 23, 59, 59);
    expect(determineInitialStep(lateFeb14, null)).toBe("clouds");
  });
});
