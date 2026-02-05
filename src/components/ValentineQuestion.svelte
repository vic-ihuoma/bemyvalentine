<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import WingedHeart from "./WingedHeart.svelte";
  import { shouldDodge, calculateDodgePosition } from "../lib/dodge";
  import { DODGE_ANIMATION_DURATION } from "../lib/config";

  interface Props {
    onYes?: () => void;
  }

  let { onYes }: Props = $props();

  let noButtonX = $state(0);
  let noButtonY = $state(0);
  let isDodging = $state(false);
  let noButtonEl: HTMLButtonElement | null = $state(null);
  let containerEl: HTMLDivElement | null = $state(null);
  let initialized = $state(false);

  let dodgeTimeout: ReturnType<typeof setTimeout> | null = null;

  onMount(() => {
    // Position the No button initially to the right of center
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    noButtonX = vw / 2 + 80;
    noButtonY = vh / 2 + 40;
    initialized = true;

    document.addEventListener("mousemove", handleMouseMove);
  });

  onDestroy(() => {
    document.removeEventListener("mousemove", handleMouseMove);
    if (dodgeTimeout) clearTimeout(dodgeTimeout);
  });

  function handleMouseMove(e: MouseEvent) {
    if (!noButtonEl || !initialized) return;

    const rect = noButtonEl.getBoundingClientRect();
    const buttonCenter = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    const cursor = { x: e.clientX, y: e.clientY };

    if (shouldDodge(cursor, buttonCenter)) {
      dodge(cursor, buttonCenter);
    }
  }

  function dodge(
    cursor: { x: number; y: number },
    buttonCenter: { x: number; y: number },
  ) {
    if (!noButtonEl) return;

    isDodging = true;
    const rect = noButtonEl.getBoundingClientRect();
    const newPos = calculateDodgePosition(
      cursor,
      buttonCenter,
      { width: rect.width, height: rect.height },
      { width: window.innerWidth, height: window.innerHeight },
    );

    noButtonX = newPos.x;
    noButtonY = newPos.y;

    if (dodgeTimeout) clearTimeout(dodgeTimeout);
    dodgeTimeout = setTimeout(() => {
      isDodging = false;
    }, DODGE_ANIMATION_DURATION + 100);
  }

  function handleNoClick() {
    // If somehow clicked, just dodge again
    if (!noButtonEl) return;
    const rect = noButtonEl.getBoundingClientRect();
    dodge(
      {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      },
      {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2 - 10,
      },
    );
  }
</script>

<div
  class="flex min-h-screen flex-col items-center justify-center gap-12"
  bind:this={containerEl}
>
  <h1 class="question-text">Will you be my Valentine?</h1>

  <div class="relative flex items-center gap-16">
    <!-- Yes button -->
    <button class="yes-button" onclick={onYes}> Yes </button>

    <!-- No button (absolutely positioned, dodges) -->
    {#if initialized}
      <button
        bind:this={noButtonEl}
        class="no-button"
        onclick={handleNoClick}
        style="
          position: fixed;
          left: {noButtonX}px;
          top: {noButtonY}px;
          transform: translate(-50%, -50%);
          transition: left {DODGE_ANIMATION_DURATION}ms cubic-bezier(0.34, 1.56, 0.64, 1),
                      top {DODGE_ANIMATION_DURATION}ms cubic-bezier(0.34, 1.56, 0.64, 1);
        "
      >
        No
        <span class="heart-guardian">
          <WingedHeart dodging={isDodging} />
        </span>
      </button>
    {/if}
  </div>
</div>

<style>
  .question-text {
    font-family: "Dancing Script", cursive;
    font-size: 3.5rem;
    color: #4a0020;
    text-align: center;
  }

  .yes-button {
    padding: 16px 48px;
    font-size: 1.25rem;
    font-family: "Inter", sans-serif;
    font-weight: 600;
    color: #4a0020;
    background: #ffb6c1;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    box-shadow: 0 0 30px rgba(255, 182, 193, 0.6);
    transition: box-shadow 0.3s ease;
  }

  .yes-button:hover {
    box-shadow: 0 0 40px rgba(255, 182, 193, 0.8);
  }

  .no-button {
    padding: 16px 48px;
    font-size: 1.25rem;
    font-family: "Inter", sans-serif;
    font-weight: 600;
    color: #4a0020;
    background: white;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    cursor: pointer;
    z-index: 30;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .heart-guardian {
    position: absolute;
    top: -20px;
    right: -15px;
  }
</style>
