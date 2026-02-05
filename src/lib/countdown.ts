export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  isComplete: boolean;
}

export function getNextValentineTarget(now: Date = new Date()): Date {
  const year = now.getUTCFullYear();
  const feb14 = new Date(Date.UTC(year, 1, 14, 0, 0, 0));

  if (now < feb14) {
    return feb14;
  }

  return new Date(Date.UTC(year + 1, 1, 14, 0, 0, 0));
}

export function calculateCountdown(
  now: Date = new Date(),
  target: Date = getNextValentineTarget(now),
): CountdownResult {
  const totalMs = target.getTime() - now.getTime();

  if (totalMs <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalMs: 0,
      isComplete: true,
    };
  }

  const totalSeconds = Math.floor(totalMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, totalMs, isComplete: false };
}

export function formatCountdown(result: CountdownResult): string {
  const pad = (n: number) => n.toString().padStart(2, "0");

  if (result.isComplete) {
    return "00:00:00";
  }

  if (result.days > 0) {
    return `${result.days} day${result.days !== 1 ? "s" : ""}, ${pad(result.hours)}:${pad(result.minutes)}:${pad(result.seconds)}`;
  }

  return `${pad(result.hours)}:${pad(result.minutes)}:${pad(result.seconds)}`;
}

export function isValentinesDay(now: Date = new Date()): boolean {
  return now.getUTCMonth() === 1 && now.getUTCDate() === 14;
}
