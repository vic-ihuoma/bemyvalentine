import { describe, it, expect } from "vitest";
import {
  getDistance,
  shouldDodge,
  calculateDodgePosition,
} from "../../src/lib/dodge";
import { DODGE_PROXIMITY_THRESHOLD } from "../../src/lib/config";

describe("getDistance", () => {
  it("calculates distance between two points", () => {
    expect(getDistance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
  });

  it("returns 0 for same point", () => {
    expect(getDistance({ x: 10, y: 20 }, { x: 10, y: 20 })).toBe(0);
  });

  it("works with negative coordinates", () => {
    expect(getDistance({ x: -3, y: 0 }, { x: 0, y: 4 })).toBe(5);
  });
});

describe("shouldDodge", () => {
  it("returns true when cursor is within threshold", () => {
    expect(
      shouldDodge(
        { x: 100, y: 100 },
        { x: 100 + DODGE_PROXIMITY_THRESHOLD - 1, y: 100 },
      ),
    ).toBe(true);
  });

  it("returns false when cursor is outside threshold", () => {
    expect(
      shouldDodge({ x: 0, y: 0 }, { x: DODGE_PROXIMITY_THRESHOLD + 1, y: 0 }),
    ).toBe(false);
  });

  it("returns true when cursor is exactly on button", () => {
    expect(shouldDodge({ x: 200, y: 200 }, { x: 200, y: 200 })).toBe(true);
  });
});

describe("calculateDodgePosition", () => {
  const viewport = { width: 1920, height: 1080 };
  const buttonSize = { width: 120, height: 48 };

  it("moves button away from cursor", () => {
    const cursor = { x: 500, y: 500 };
    const button = { x: 550, y: 500 };
    const result = calculateDodgePosition(cursor, button, buttonSize, viewport);

    // Should move further right (away from cursor on the left)
    expect(result.x).toBeGreaterThan(button.x);
  });

  it("wraps to opposite side when pushed off right edge", () => {
    const cursor = { x: 1800, y: 540 };
    const button = { x: 1850, y: 540 };
    const result = calculateDodgePosition(cursor, button, buttonSize, viewport);

    // Should wrap to the left side
    const minX = 20 + buttonSize.width / 2;
    expect(result.x).toBe(minX);
  });

  it("wraps to opposite side when pushed off left edge", () => {
    const cursor = { x: 120, y: 540 };
    const button = { x: 70, y: 540 };
    const result = calculateDodgePosition(cursor, button, buttonSize, viewport);

    // Should wrap to the right side
    const maxX = viewport.width - 20 - buttonSize.width / 2;
    expect(result.x).toBe(maxX);
  });

  it("wraps vertically when pushed off bottom", () => {
    const cursor = { x: 960, y: 1000 };
    const button = { x: 960, y: 1050 };
    const result = calculateDodgePosition(cursor, button, buttonSize, viewport);

    const minY = 20 + buttonSize.height / 2;
    expect(result.y).toBe(minY);
  });

  it("returns a valid position within viewport bounds or wrapped", () => {
    const cursor = { x: 960, y: 540 };
    const button = { x: 1000, y: 540 };
    const result = calculateDodgePosition(cursor, button, buttonSize, viewport);

    // Result should be a valid point
    expect(typeof result.x).toBe("number");
    expect(typeof result.y).toBe("number");
    expect(Number.isFinite(result.x)).toBe(true);
    expect(Number.isFinite(result.y)).toBe(true);
  });
});
