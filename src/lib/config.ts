export const VALENTINE_PASSWORD = "sheep";

export const STORAGE_KEY = "bemyvalentine_state";

export const COLORS = {
  primary: "#FFB6C1",
  accent: "#FF69B4",
  neutral: "#FFF0F5",
  text: "#4A0020",
} as const;

export const DODGE_PROXIMITY_THRESHOLD = 150;
export const DODGE_ANIMATION_DURATION = 300;

// Debug mode: set to true and adjust DEBUG_COUNTDOWN_SECONDS to test the full flow locally.
// The countdown will target DEBUG_COUNTDOWN_SECONDS from page load instead of Feb 14.
export const DEBUG_MODE = true;
export const DEBUG_COUNTDOWN_SECONDS = 120; // 2 minutes
