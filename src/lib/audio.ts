let audioCtx: AudioContext | null = null;
let isPlaying = false;

const NOTES: Record<string, number> = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  E5: 659.25,
};

// Gentle romantic melody in C major
const MELODY: { note: string; duration: number; delay: number }[] = [
  { note: "E4", duration: 0.6, delay: 0 },
  { note: "G4", duration: 0.6, delay: 0.7 },
  { note: "C5", duration: 0.8, delay: 1.4 },
  { note: "B4", duration: 0.4, delay: 2.3 },
  { note: "A4", duration: 0.6, delay: 2.8 },
  { note: "G4", duration: 0.8, delay: 3.5 },
  { note: "E4", duration: 0.6, delay: 4.4 },
  { note: "F4", duration: 0.6, delay: 5.1 },
  { note: "G4", duration: 0.6, delay: 5.8 },
  { note: "E4", duration: 1.0, delay: 6.5 },
  { note: "D4", duration: 0.6, delay: 7.6 },
  { note: "C4", duration: 1.2, delay: 8.3 },
];

const LOOP_DURATION = 10;

function playNote(
  ctx: AudioContext,
  frequency: number,
  startTime: number,
  duration: number,
) {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, startTime);

  // Piano-like envelope: quick attack, gentle decay, soft sustain, smooth release
  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
  gainNode.gain.exponentialRampToValueAtTime(0.08, startTime + duration * 0.4);
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

function scheduleLoop(ctx: AudioContext, baseTime: number) {
  for (const { note, duration, delay } of MELODY) {
    const freq = NOTES[note];
    if (freq) {
      playNote(ctx, freq, baseTime + delay, duration);
    }
  }
}

export function startMelody(): boolean {
  if (isPlaying) return true;

  try {
    audioCtx = new AudioContext();
    isPlaying = true;

    const scheduleAhead = () => {
      if (!audioCtx || !isPlaying) return;

      const now = audioCtx.currentTime;
      // Schedule a few loops ahead
      for (let i = 0; i < 3; i++) {
        const loopStart =
          Math.ceil(now / LOOP_DURATION) * LOOP_DURATION + i * LOOP_DURATION;
        scheduleLoop(audioCtx, loopStart);
      }
    };

    // Initial scheduling
    scheduleLoop(audioCtx, audioCtx.currentTime);
    scheduleLoop(audioCtx, audioCtx.currentTime + LOOP_DURATION);

    // Re-schedule periodically
    const intervalId = setInterval(scheduleAhead, (LOOP_DURATION * 1000) / 2);

    // Store cleanup reference
    (
      audioCtx as AudioContext & {
        _intervalId?: ReturnType<typeof setInterval>;
      }
    )._intervalId = intervalId;

    return true;
  } catch {
    return false;
  }
}

export function stopMelody(): void {
  if (audioCtx) {
    const ctx = audioCtx as AudioContext & {
      _intervalId?: ReturnType<typeof setInterval>;
    };
    if (ctx._intervalId) {
      clearInterval(ctx._intervalId);
    }
    audioCtx.close();
    audioCtx = null;
  }
  isPlaying = false;
}
