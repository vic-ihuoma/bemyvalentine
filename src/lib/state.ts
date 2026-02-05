import { STORAGE_KEY } from "./config";

export type AppStep =
  | "countdown"
  | "clouds"
  | "password"
  | "question"
  | "celebration";

interface SavedState {
  year: number;
  step: AppStep;
}

export function saveState(step: AppStep): void {
  const year = new Date().getUTCFullYear();
  const state: SavedState = { year, step };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadState(): AppStep | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed: SavedState = JSON.parse(raw);
    const currentYear = new Date().getUTCFullYear();

    if (parsed.year !== currentYear) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return parsed.step;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function clearState(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function determineInitialStep(
  now: Date = new Date(),
  savedStep: AppStep | null = null,
): AppStep {
  const year = now.getUTCFullYear();
  const feb14Start = new Date(Date.UTC(year, 1, 14, 0, 0, 0));
  const feb15Start = new Date(Date.UTC(year, 1, 15, 0, 0, 0));
  const isValentines = now >= feb14Start && now < feb15Start;

  if (savedStep === "celebration" && isValentines) {
    return "celebration";
  }

  if (isValentines) {
    return "clouds";
  }

  return "countdown";
}
