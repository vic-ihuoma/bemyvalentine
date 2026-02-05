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
  let yesButtonEl: HTMLButtonElement | null = $state(null);
  let initialized = $state(false);

  let dodgeTimeout: ReturnType<typeof setTimeout> | null = null;
  let lastDodgeTime = 0;

  onMount(() => {
    // Wait a tick for the Yes button to render, then place No right beside it
    requestAnimationFrame(() => {
      if (yesButtonEl) {
        const yesRect = yesButtonEl.getBoundingClientRect();
        noButtonX = yesRect.right + 40 + 60; // gap + half button width
        noButtonY = yesRect.top + yesRect.height / 2;
      } else {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        noButtonX = vw / 2 + 100;
        noButtonY = vh / 2 + 60;
      }
      initialized = true;
    });

    document.addEventListener("mousemove", handleMouseMove);
  });

  onDestroy(() => {
    document.removeEventListener("mousemove", handleMouseMove);
    if (dodgeTimeout) clearTimeout(dodgeTimeout);
  });

  function handleMouseMove(e: MouseEvent) {
    if (!noButtonEl || !initialized) return;

    // Throttle: don't re-dodge while a dodge animation is still playing
    const now = Date.now();
    if (now - lastDodgeTime < DODGE_ANIMATION_DURATION) return;

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

    lastDodgeTime = Date.now();
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

<div class="flex min-h-screen flex-col items-center justify-center gap-12">
  <h1 class="question-text">Will you be my Valentine?</h1>

  <div class="flex items-center gap-10">
    <!-- Yes button -->
    <button bind:this={yesButtonEl} class="yes-button" onclick={onYes}>
      Yes
    </button>
  </div>

  <!-- No button (fixed position, dodges away) -->
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
        transition: left {DODGE_ANIMATION_DURATION}ms ease-out,
                    top {DODGE_ANIMATION_DURATION}ms ease-out;
      "
    >
      No
      <span class="heart-guardian">
        <WingedHeart dodging={isDodging} />
      </span>
    </button>
  {/if}
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
    top: -35px;
    right: -30px;
  }
</style>
