<script lang="ts">
  import { onMount } from "svelte";

  interface Props {
    onPartComplete?: () => void;
  }

  let { onPartComplete }: Props = $props();

  let parting = $state(false);
  let parted = $state(false);

  onMount(() => {
    // Start parting after a brief pause
    setTimeout(() => {
      parting = true;
    }, 1500);

    // Signal parting complete after animation
    setTimeout(() => {
      parted = true;
      onPartComplete?.();
    }, 5500); // 1.5s delay + 4s animation
  });
</script>

<div class="clouds-container">
  <!-- Left cloud group -->
  <div class="cloud-group left" class:parting class:parted>
    <svg
      class="cloud cloud-1"
      viewBox="0 0 300 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M30 140 C30 100, 60 80, 90 80 C90 50, 130 30, 160 50 C180 30, 230 30, 240 60 C270 50, 290 70, 280 100 C300 110, 290 140, 260 140 Z"
        fill="white"
        opacity="0.9"
      />
    </svg>
    <svg
      class="cloud cloud-2"
      viewBox="0 0 250 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 120 C20 90, 50 70, 80 75 C85 45, 120 35, 150 55 C170 40, 200 45, 210 70 C235 65, 245 85, 235 105 C250 115, 240 130, 215 125 Z"
        fill="#FFF0F5"
        opacity="0.7"
      />
    </svg>
    <svg
      class="cloud cloud-3"
      viewBox="0 0 280 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M25 130 C25 95, 55 75, 85 80 C90 50, 125 35, 155 55 C175 35, 215 38, 225 65 C255 58, 270 78, 260 105 C280 112, 268 135, 240 130 Z"
        fill="white"
        opacity="0.6"
      />
    </svg>
  </div>

  <!-- Right cloud group -->
  <div class="cloud-group right" class:parting class:parted>
    <svg
      class="cloud cloud-4"
      viewBox="0 0 300 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 140 C10 110, 30 80, 60 85 C65 50, 110 30, 140 55 C165 30, 210 35, 220 65 C250 55, 275 75, 265 105 C285 115, 275 140, 245 140 Z"
        fill="white"
        opacity="0.9"
      />
    </svg>
    <svg
      class="cloud cloud-5"
      viewBox="0 0 260 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 120 C15 85, 45 65, 75 72 C82 42, 115 30, 148 52 C168 35, 205 40, 215 68 C240 60, 255 82, 242 108 C258 118, 248 135, 220 128 Z"
        fill="#FFF0F5"
        opacity="0.7"
      />
    </svg>
    <svg
      class="cloud cloud-6"
      viewBox="0 0 270 155"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22 128 C22 92, 52 72, 82 78 C88 48, 122 32, 152 54 C172 34, 212 38, 222 64 C252 56, 265 76, 255 104 C275 112, 262 132, 238 128 Z"
        fill="white"
        opacity="0.6"
      />
    </svg>
  </div>
</div>

<style>
  .clouds-container {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 10;
    overflow: hidden;
  }

  .cloud-group {
    position: absolute;
    top: 0;
    width: 55%;
    height: 100%;
    transition: transform 4s cubic-bezier(0.25, 0.1, 0.25, 1);
  }

  .cloud-group.left {
    left: 0;
  }

  .cloud-group.right {
    right: 0;
  }

  .cloud-group.left.parting {
    transform: translateX(-60%);
  }

  .cloud-group.right.parting {
    transform: translateX(60%);
  }

  .cloud-group.left.parted {
    transform: translateX(-60%);
  }

  .cloud-group.right.parted {
    transform: translateX(60%);
  }

  .cloud {
    position: absolute;
    width: 100%;
  }

  .cloud-1 {
    top: 5%;
    left: -10%;
    width: 80%;
    animation: float-1 6s ease-in-out infinite;
  }

  .cloud-2 {
    top: 35%;
    left: 5%;
    width: 70%;
    animation: float-2 8s ease-in-out infinite;
  }

  .cloud-3 {
    top: 65%;
    left: -5%;
    width: 75%;
    animation: float-3 7s ease-in-out infinite;
  }

  .cloud-4 {
    top: 10%;
    right: -10%;
    left: auto;
    width: 80%;
    animation: float-1 7s ease-in-out infinite;
  }

  .cloud-5 {
    top: 40%;
    right: 0%;
    left: auto;
    width: 72%;
    animation: float-2 6.5s ease-in-out infinite;
  }

  .cloud-6 {
    top: 68%;
    right: -5%;
    left: auto;
    width: 74%;
    animation: float-3 8.5s ease-in-out infinite;
  }

  @keyframes float-1 {
    0%,
    100% {
      transform: translate(0, 0);
    }
    50% {
      transform: translate(10px, -8px);
    }
  }

  @keyframes float-2 {
    0%,
    100% {
      transform: translate(0, 0);
    }
    50% {
      transform: translate(-8px, 6px);
    }
  }

  @keyframes float-3 {
    0%,
    100% {
      transform: translate(0, 0);
    }
    50% {
      transform: translate(6px, -10px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .cloud {
      animation: none !important;
    }

    .cloud-group {
      transition-duration: 0.01s;
    }
  }
</style>
