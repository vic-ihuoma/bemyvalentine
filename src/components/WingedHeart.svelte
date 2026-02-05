<script lang="ts">
  interface Props {
    dodging?: boolean;
  }

  let { dodging = false }: Props = $props();
</script>

<div class="winged-heart" class:dodging>
  <svg
    width="30"
    height="24"
    viewBox="0 0 30 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- Left wing -->
    <g class="wing left-wing">
      <path
        d="M8 10 C4 6, 0 8, 2 12 C3 14, 6 13, 8 12"
        fill="#FFB6C1"
        opacity="0.8"
      />
    </g>
    <!-- Right wing -->
    <g class="wing right-wing">
      <path
        d="M22 10 C26 6, 30 8, 28 12 C27 14, 24 13, 22 12"
        fill="#FFB6C1"
        opacity="0.8"
      />
    </g>
    <!-- Heart body -->
    <path
      d="M15 20 C12 17, 7 14, 7 10 C7 7, 9 6, 11 6 C13 6, 14 7, 15 9 C16 7, 17 6, 19 6 C21 6, 23 7, 23 10 C23 14, 18 17, 15 20Z"
      fill="#FF69B4"
    />
  </svg>
</div>

<style>
  .winged-heart {
    display: inline-block;
    position: relative;
  }

  .wing {
    transform-origin: center;
    animation: flap 0.8s ease-in-out infinite alternate;
  }

  .left-wing {
    transform-origin: 8px 11px;
  }

  .right-wing {
    transform-origin: 22px 11px;
  }

  @keyframes flap {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(-15deg);
    }
  }

  @keyframes flap-right {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(15deg);
    }
  }

  .right-wing {
    animation-name: flap-right;
  }

  .dodging .wing {
    animation-duration: 0.15s;
  }

  .dodging .left-wing {
    animation-name: flap-fast;
  }

  .dodging .right-wing {
    animation-name: flap-fast-right;
  }

  @keyframes flap-fast {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(-25deg);
    }
  }

  @keyframes flap-fast-right {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(25deg);
    }
  }
</style>
