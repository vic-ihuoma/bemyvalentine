<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { startSparkles, stopSparkles } from "../lib/canvas";
  import { startMelody, stopMelody } from "../lib/audio";

  interface Props {
    skipTypewriter?: boolean;
  }

  let { skipTypewriter = false }: Props = $props();

  let canvas: HTMLCanvasElement | null = $state(null);
  let displayedText = $state("");
  let typewriterDone = $state(skipTypewriter);
  let audioStarted = $state(false);
  let showAudioPrompt = $state(false);

  const fullText = "I love you Josephine";

  onMount(() => {
    if (canvas) {
      startSparkles(canvas);
    }

    // Try autoplay
    const success = startMelody();
    if (success) {
      audioStarted = true;
    } else {
      showAudioPrompt = true;
    }

    if (!skipTypewriter) {
      let i = 0;
      const typeInterval = setInterval(() => {
        if (i < fullText.length) {
          displayedText = fullText.slice(0, i + 1);
          i++;
        } else {
          typewriterDone = true;
          clearInterval(typeInterval);
        }
      }, 100);
    } else {
      displayedText = fullText;
    }
  });

  onDestroy(() => {
    stopSparkles();
    stopMelody();
  });

  function handleAudioClick() {
    const success = startMelody();
    if (success) {
      audioStarted = true;
      showAudioPrompt = false;
    }
  }
</script>

<div class="celebration-container">
  <!-- Rainbow ribbons -->
  <div class="ribbons">
    <div class="ribbon ribbon-1"></div>
    <div class="ribbon ribbon-2"></div>
    <div class="ribbon ribbon-3"></div>
    <div class="ribbon ribbon-4"></div>
    <div class="ribbon ribbon-5"></div>
  </div>

  <!-- Canvas for sparkles -->
  <canvas bind:this={canvas} class="sparkle-canvas"></canvas>

  <!-- Main text -->
  <div class="text-container">
    <h1 class="love-text">
      {displayedText}<span class="cursor" class:hidden={typewriterDone}>|</span>
    </h1>
  </div>

  <!-- Audio prompt -->
  {#if showAudioPrompt && !audioStarted}
    <button class="audio-prompt" onclick={handleAudioClick}>
      Tap to play music
    </button>
  {/if}
</div>

<style>
  .celebration-container {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #ffb6c1, #c5b9cd);
    overflow: hidden;
  }

  .sparkle-canvas {
    position: absolute;
    inset: 0;
    z-index: 2;
    pointer-events: none;
  }

  .text-container {
    position: relative;
    z-index: 3;
    text-align: center;
  }

  .love-text {
    font-family: "Dancing Script", cursive;
    font-size: 4rem;
    color: #4a0020;
    text-shadow:
      0 0 20px rgba(255, 182, 193, 0.5),
      0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .cursor {
    animation: blink 0.7s step-end infinite;
    color: #ff69b4;
  }

  .cursor.hidden {
    display: none;
  }

  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }

  /* Rainbow ribbons */
  .ribbons {
    position: absolute;
    inset: 0;
    z-index: 1;
    overflow: hidden;
    pointer-events: none;
  }

  .ribbon {
    position: absolute;
    width: 200%;
    height: 30px;
    background: linear-gradient(
      90deg,
      #ff6b6b,
      #ffa500,
      #ffd700,
      #90ee90,
      #87ceeb,
      #9370db,
      #ff69b4,
      #ff6b6b
    );
    opacity: 0.3;
    border-radius: 15px;
    animation: ribbon-flow linear infinite;
  }

  .ribbon-1 {
    top: 10%;
    left: -50%;
    height: 25px;
    animation-duration: 12s;
    transform: rotate(-3deg);
  }

  .ribbon-2 {
    top: 30%;
    left: -80%;
    height: 35px;
    animation-duration: 15s;
    animation-delay: -3s;
    transform: rotate(2deg);
  }

  .ribbon-3 {
    top: 55%;
    left: -60%;
    height: 28px;
    animation-duration: 18s;
    animation-delay: -7s;
    transform: rotate(-1deg);
  }

  .ribbon-4 {
    top: 75%;
    left: -70%;
    height: 32px;
    animation-duration: 14s;
    animation-delay: -5s;
    transform: rotate(3deg);
  }

  .ribbon-5 {
    top: 90%;
    left: -55%;
    height: 22px;
    animation-duration: 16s;
    animation-delay: -10s;
    transform: rotate(-2deg);
  }

  @keyframes ribbon-flow {
    from {
      transform: translateX(0) var(--ribbon-rotate, rotate(0deg));
    }
    to {
      transform: translateX(50%) var(--ribbon-rotate, rotate(0deg));
    }
  }

  .audio-prompt {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    padding: 10px 24px;
    font-family: "Inter", sans-serif;
    font-size: 0.875rem;
    color: #4a0020;
    background: rgba(255, 240, 245, 0.9);
    border: 1px solid #ffb6c1;
    border-radius: 20px;
    cursor: pointer;
    transition: opacity 0.3s ease;
  }

  .audio-prompt:hover {
    background: rgba(255, 182, 193, 0.3);
  }

  @media (prefers-reduced-motion: reduce) {
    .ribbon {
      animation: none !important;
    }

    .cursor {
      animation: none !important;
    }
  }
</style>
