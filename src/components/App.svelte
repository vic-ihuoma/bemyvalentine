<script lang="ts">
  import { onMount } from "svelte";
  import Countdown from "./Countdown.svelte";
  import MobileMessage from "./MobileMessage.svelte";
  import CloudAnimation from "./CloudAnimation.svelte";
  import PasswordInput from "./PasswordInput.svelte";
  import ValentineQuestion from "./ValentineQuestion.svelte";
  import Celebration from "./Celebration.svelte";
  import {
    loadState,
    saveState,
    determineInitialStep,
    type AppStep,
  } from "../lib/state";
  import { getNextValentineTarget } from "../lib/countdown";
  import { DEBUG_MODE, DEBUG_COUNTDOWN_SECONDS } from "../lib/config";

  let currentStep: AppStep = $state("countdown");
  let isMobile = $state(false);
  let ready = $state(false);
  let countdownTarget: Date = $state(getNextValentineTarget());
  let skipTypewriter = $state(false);

  onMount(() => {
    // Check device
    isMobile = window.innerWidth < 1024;

    // Listen for resize
    window.addEventListener("resize", () => {
      isMobile = window.innerWidth < 1024;
    });

    if (DEBUG_MODE) {
      // In debug mode, set a short countdown and start from countdown step
      countdownTarget = new Date(Date.now() + DEBUG_COUNTDOWN_SECONDS * 1000);
      currentStep = "countdown";
    } else {
      // Determine initial step from date and saved state
      const savedStep = loadState();
      currentStep = determineInitialStep(new Date(), savedStep);

      // If resuming celebration, skip typewriter
      if (currentStep === "celebration" && savedStep === "celebration") {
        skipTypewriter = true;
      }

      // Update countdown target
      countdownTarget = getNextValentineTarget();
    }

    ready = true;
  });

  function handleCountdownComplete() {
    currentStep = "clouds";
  }

  function handleCloudsParted() {
    currentStep = "password";
  }

  function handlePasswordSuccess() {
    currentStep = "question";
  }

  function handleYes() {
    saveState("celebration");
    currentStep = "celebration";
  }
</script>

{#if !ready}
  <!-- Waiting for client-side hydration -->
{:else if isMobile}
  <MobileMessage />
{:else}
  <div
    class="min-h-screen"
    style="background: linear-gradient(135deg, #FFB6C1, #C5B9CD);"
  >
    {#if currentStep === "countdown"}
      <div class="flex min-h-screen items-center justify-center">
        <Countdown
          target={countdownTarget}
          onComplete={handleCountdownComplete}
        />
      </div>
    {:else if currentStep === "clouds" || currentStep === "password"}
      <CloudAnimation onPartComplete={handleCloudsParted} />
      {#if currentStep === "password"}
        <div
          class="flex min-h-screen items-center justify-center"
          style="position: relative; z-index: 20;"
        >
          <PasswordInput onSuccess={handlePasswordSuccess} />
        </div>
      {/if}
    {:else if currentStep === "question"}
      <ValentineQuestion onYes={handleYes} />
    {:else if currentStep === "celebration"}
      <Celebration {skipTypewriter} />
    {/if}
  </div>
{/if}
