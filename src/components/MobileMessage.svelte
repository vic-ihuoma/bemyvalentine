<script lang="ts">
  import Countdown from "./Countdown.svelte";
  import { getNextValentineTarget } from "../lib/countdown";

  const target = getNextValentineTarget();
</script>

<div
  class="flex min-h-screen flex-col items-center justify-center gap-8 px-6"
  style="background: linear-gradient(135deg, #FFB6C1, #C5B9CD);"
>
  <p
    class="max-w-xs text-center text-2xl font-medium"
    style="color: #4A0020; font-family: 'Inter', sans-serif;"
  >
    Open me on your laptop for a surprise
  </p>

  <Countdown {target} compact />
</div>
