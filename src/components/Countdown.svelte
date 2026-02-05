<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import {
    calculateCountdown,
    formatCountdown,
    type CountdownResult,
  } from "../lib/countdown";

  interface Props {
    target: Date;
    compact?: boolean;
    onComplete?: () => void;
  }

  let { target, compact = false, onComplete }: Props = $props();

  let result: CountdownResult = $state(calculateCountdown(new Date(), target));
  let display: string = $state(formatCountdown(result));
  let intervalId: ReturnType<typeof setInterval> | null = null;

  onMount(() => {
    intervalId = setInterval(() => {
      result = calculateCountdown(new Date(), target);
      display = formatCountdown(result);

      if (result.isComplete && onComplete) {
        onComplete();
        if (intervalId) clearInterval(intervalId);
      }
    }, 1000);
  });

  onDestroy(() => {
    if (intervalId) clearInterval(intervalId);
  });
</script>

{#if compact}
  <div class="text-center">
    <p class="font-mono text-lg font-bold" style="color: #4A0020;">
      {display}
    </p>
  </div>
{:else}
  <div class="flex flex-col items-center justify-center gap-6">
    <p
      class="text-xl tracking-wide opacity-70"
      style="color: #4A0020; font-family: 'Inter', sans-serif;"
    >
      Patience, love...
    </p>
    <p
      class="text-6xl font-bold md:text-7xl lg:text-8xl"
      style="color: #4A0020; font-family: 'JetBrains Mono', monospace;"
    >
      {display}
    </p>
  </div>
{/if}
