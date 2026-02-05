<script lang="ts">
  import { validatePassword, shouldShowError } from "../lib/password";

  interface Props {
    onSuccess?: () => void;
  }

  let { onSuccess }: Props = $props();

  let value = $state("");
  let errorMessage = $state("");
  let showError = $state(false);
  let isExiting = $state(false);

  function handleInput(e: Event) {
    const input = e.target as HTMLInputElement;
    value = input.value;

    if (validatePassword(value)) {
      isExiting = true;
      setTimeout(() => {
        onSuccess?.();
      }, 600);
      return;
    }

    if (shouldShowError(value)) {
      errorMessage = "Not quite, love";
      showError = true;
      setTimeout(() => {
        showError = false;
        value = "";
      }, 2000);
    }
  }
</script>

<div class="password-container" class:exiting={isExiting}>
  <div class="input-row">
    <input
      type="text"
      bind:value
      oninput={handleInput}
      placeholder="Enter password"
      autocomplete="off"
      spellcheck="false"
      class="password-input"
    />
    <span class="sheep-hint">🐑</span>
  </div>

  {#if showError}
    <p class="error-message">{errorMessage}</p>
  {/if}
</div>

<style>
  .password-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    z-index: 20;
    position: relative;
    transition: opacity 0.6s ease;
  }

  .password-container.exiting {
    opacity: 0;
    transform: scale(0.95);
    transition:
      opacity 0.6s ease,
      transform 0.6s ease;
  }

  .password-input {
    width: 280px;
    padding: 16px 24px;
    font-size: 1.25rem;
    text-align: center;
    border: 2px solid #ffb6c1;
    border-radius: 16px;
    outline: none;
    background: rgba(255, 240, 245, 0.9);
    color: #4a0020;
    box-shadow: 0 4px 20px rgba(255, 182, 193, 0.3);
    font-family: "Inter", sans-serif;
    transition: border-color 0.3s ease;
  }

  .password-input:focus {
    border-color: #ff69b4;
    box-shadow: 0 4px 25px rgba(255, 105, 180, 0.3);
  }

  .password-input::placeholder {
    color: #b08a94;
    font-size: 1rem;
  }

  .input-row {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .sheep-hint {
    font-size: 2.5rem;
    line-height: 1;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  }

  .error-message {
    color: #ff69b4;
    font-family: "Inter", sans-serif;
    font-size: 0.95rem;
    font-style: italic;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
