import { describe, it, expect } from "vitest";
import {
  getNextValentineTarget,
  calculateCountdown,
  formatCountdown,
  isValentinesDay,
} from "../../src/lib/countdown";

describe("getNextValentineTarget", () => {
  it("returns current year Feb 14 when before that date", () => {
    const jan1 = new Date(2026, 0, 1, 12, 0, 0);
    const target = getNextValentineTarget(jan1);
    expect(target.getFullYear()).toBe(2026);
    expect(target.getMonth()).toBe(1);
    expect(target.getDate()).toBe(14);
    expect(target.getHours()).toBe(0);
  });

  it("returns next year Feb 14 when on Feb 14", () => {
    const feb14 = new Date(2026, 1, 14, 0, 0, 0);
    const target = getNextValentineTarget(feb14);
    expect(target.getFullYear()).toBe(2027);
    expect(target.getMonth()).toBe(1);
    expect(target.getDate()).toBe(14);
  });

  it("returns next year Feb 14 when after Feb 14", () => {
    const march1 = new Date(2026, 2, 1, 0, 0, 0);
    const target = getNextValentineTarget(march1);
    expect(target.getFullYear()).toBe(2027);
    expect(target.getMonth()).toBe(1);
    expect(target.getDate()).toBe(14);
  });

  it("returns current year Feb 14 when on Feb 13", () => {
    const feb13 = new Date(2026, 1, 13, 23, 59, 59);
    const target = getNextValentineTarget(feb13);
    expect(target.getFullYear()).toBe(2026);
    expect(target.getMonth()).toBe(1);
    expect(target.getDate()).toBe(14);
  });
});

describe("calculateCountdown", () => {
  it("calculates correct days, hours, minutes, seconds", () => {
    const now = new Date(2026, 1, 12, 10, 30, 45);
    const target = new Date(2026, 1, 14, 0, 0, 0);
    const result = calculateCountdown(now, target);

    expect(result.days).toBe(1);
    expect(result.hours).toBe(13);
    expect(result.minutes).toBe(29);
    expect(result.seconds).toBe(15);
    expect(result.isComplete).toBe(false);
  });

  it("returns isComplete when target is reached", () => {
    const now = new Date(2026, 1, 14, 0, 0, 0);
    const target = new Date(2026, 1, 14, 0, 0, 0);
    const result = calculateCountdown(now, target);

    expect(result.isComplete).toBe(true);
    expect(result.totalMs).toBe(0);
  });

  it("returns isComplete when past target", () => {
    const now = new Date(2026, 1, 14, 1, 0, 0);
    const target = new Date(2026, 1, 14, 0, 0, 0);
    const result = calculateCountdown(now, target);

    expect(result.isComplete).toBe(true);
  });

  it("handles exactly 0 seconds remaining", () => {
    const target = new Date(2026, 1, 14, 0, 0, 0);
    const result = calculateCountdown(target, target);

    expect(result.days).toBe(0);
    expect(result.hours).toBe(0);
    expect(result.minutes).toBe(0);
    expect(result.seconds).toBe(0);
    expect(result.isComplete).toBe(true);
  });

  it("handles sub-day countdown correctly", () => {
    const now = new Date(2026, 1, 13, 20, 0, 0);
    const target = new Date(2026, 1, 14, 0, 0, 0);
    const result = calculateCountdown(now, target);

    expect(result.days).toBe(0);
    expect(result.hours).toBe(4);
    expect(result.minutes).toBe(0);
    expect(result.seconds).toBe(0);
  });
});

describe("formatCountdown", () => {
  it("shows days when more than 1 day", () => {
    const result = formatCountdown({
      days: 5,
      hours: 3,
      minutes: 12,
      seconds: 45,
      totalMs: 100000,
      isComplete: false,
    });
    expect(result).toBe("5 days, 03:12:45");
  });

  it("uses singular 'day' for 1 day", () => {
    const result = formatCountdown({
      days: 1,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalMs: 86400000,
      isComplete: false,
    });
    expect(result).toBe("1 day, 00:00:00");
  });

  it("shows only HH:MM:SS when less than 1 day", () => {
    const result = formatCountdown({
      days: 0,
      hours: 12,
      minutes: 5,
      seconds: 3,
      totalMs: 43503000,
      isComplete: false,
    });
    expect(result).toBe("12:05:03");
  });

  it("shows 00:00:00 when complete", () => {
    const result = formatCountdown({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalMs: 0,
      isComplete: true,
    });
    expect(result).toBe("00:00:00");
  });

  it("pads single-digit values", () => {
    const result = formatCountdown({
      days: 0,
      hours: 1,
      minutes: 2,
      seconds: 3,
      totalMs: 3723000,
      isComplete: false,
    });
    expect(result).toBe("01:02:03");
  });
});

describe("isValentinesDay", () => {
  it("returns true on Feb 14 local time", () => {
    expect(isValentinesDay(new Date(2026, 1, 14, 0, 0, 0))).toBe(true);
    expect(isValentinesDay(new Date(2026, 1, 14, 23, 59, 59))).toBe(true);
  });

  it("returns false on Feb 13", () => {
    expect(isValentinesDay(new Date(2026, 1, 13, 23, 59, 59))).toBe(false);
  });

  it("returns false on Feb 15", () => {
    expect(isValentinesDay(new Date(2026, 1, 15, 0, 0, 0))).toBe(false);
  });
});
