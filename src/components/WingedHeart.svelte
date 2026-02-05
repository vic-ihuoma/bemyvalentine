<script lang="ts">
  interface Props {
    dodging?: boolean;
  }

  let { dodging = false }: Props = $props();
</script>

<div class="winged-heart" class:dodging>
  <svg
    width="60"
    height="48"
    viewBox="0 0 60 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- Left wing -->
    <g class="wing left-wing">
      <path
        d="M16 20 C10 10, -2 12, 2 22 C4 28, 12 26, 16 24"
        fill="#E87DA9"
        stroke="#C4608A"
        stroke-width="1"
      />
      <path d="M16 18 C12 12, 2 14, 5 20 C6 22, 12 22, 16 20" fill="#F2A0BE" />
    </g>
    <!-- Right wing -->
    <g class="wing right-wing">
      <path
        d="M44 20 C50 10, 62 12, 58 22 C56 28, 48 26, 44 24"
        fill="#E87DA9"
        stroke="#C4608A"
        stroke-width="1"
      />
      <path
        d="M44 18 C48 12, 58 14, 55 20 C54 22, 48 22, 44 20"
        fill="#F2A0BE"
      />
    </g>
    <!-- Heart body -->
    <path
      d="M30 40 C24 34, 14 28, 14 20 C14 14, 18 12, 22 12 C26 12, 28 14, 30 18 C32 14, 34 12, 38 12 C42 12, 46 14, 46 20 C46 28, 36 34, 30 40Z"
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
    transform-origin: 16px 22px;
  }

  .right-wing {
    transform-origin: 44px 22px;
  }

  @keyframes flap {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(-20deg);
    }
  }

  @keyframes flap-right {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(20deg);
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
      transform: rotate(-35deg);
    }
  }

  @keyframes flap-fast-right {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(35deg);
    }
  }
</style>
