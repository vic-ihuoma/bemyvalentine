# Be My Valentine - Technical Specification

**Domain:** bemyvalentinebaby.com
**Repository:** https://github.com/vic-ihuoma/bemyvalentine
**Branch strategy:** Feature branches merged to `main` only

---

## 1. Project Overview

A romantic Valentine's Day website for Josephine. The site cycles annually: it shows a countdown to February 14th, and on the day itself, reveals an interactive experience culminating in a "Will you be my Valentine?" proposal with a celebration screen.

---

## 2. Tech Stack

| Layer      | Technology                                                                      |
| ---------- | ------------------------------------------------------------------------------- |
| Framework  | Astro (static site generation)                                                  |
| UI Island  | Svelte (single interactive island for all client-side logic)                    |
| Styling    | Tailwind CSS                                                                    |
| Language   | TypeScript                                                                      |
| Animations | SVG (clouds), HTML Canvas (celebration sparkles), CSS transitions (UI elements) |
| Audio      | Web Audio API (programmatic gentle piano melody)                                |
| Linting    | ESLint + Prettier                                                               |
| Git Hooks  | Husky (pre-commit: lint + tests)                                                |
| Testing    | Vitest (unit tests) + Browser Agent skill with snapshots (visual smoke tests)   |
| Hosting    | Cloudflare Pages                                                                |
| Domain     | bemyvalentinebaby.com (to be purchased and configured via Cloudflare)           |

---

## 3. Color Palette (Blush)

| Role                 | Color          | Hex       |
| -------------------- | -------------- | --------- |
| Primary              | Light Pink     | `#FFB6C1` |
| Accent               | Hot Pink       | `#FF69B4` |
| Neutral / Background | Lavender Blush | `#FFF0F5` |
| Text                 | Dark Rose      | `#4A0020` |

**Gradient sky background:** Soft gradient from `#FFB6C1` (light pink) to a lavender/periwinkle tone, evoking a dreamy dawn sky. Used on the countdown page and as the base behind all screens.

---

## 4. Typography

| Use                           | Font                                                | Style                       |
| ----------------------------- | --------------------------------------------------- | --------------------------- |
| Countdown timer               | Monospace (JetBrains Mono or Space Mono)            | Bold, large                 |
| "Will you be my Valentine?"   | Script/handwritten (e.g., Dancing Script, Pacifico) | Large, centered             |
| Body text / teaser / messages | Sans-serif (Inter or system font)                   | Regular weight              |
| "I love you Josephine"        | Script font, same as Valentine question             | Large, typewriter animation |

Fonts loaded via Google Fonts or self-hosted for performance.

---

## 5. Page Flow & States

The site is a single-page application within one Svelte island. State transitions are managed in-component. There is no routing; all screens render in the same viewport.

### State Machine

```
LOADING (if needed)
    |
    v
DEVICE_CHECK ──(mobile)──> MOBILE_MESSAGE (with mini countdown)
    |
  (desktop)
    |
    v
DATE_CHECK ──(before Feb 14 UTC)──> COUNTDOWN
    |
  (Feb 14 UTC)
    |
    v
CLOUDS_ANIMATION ──(clouds part)──> PASSWORD_INPUT
    |
  (correct password)
    |
    v
VALENTINE_QUESTION ──("Yes" clicked)──> CELEBRATION
```

### State Persistence (localStorage)

- Key: `bemyvalentine_state`
- Value: JSON `{ year: number, step: string }`
- On Feb 14: if `year` matches current year and `step` is `"celebration"`, skip directly to CELEBRATION.
- After Feb 14 (Feb 15+): localStorage is cleared. The site shows a countdown to the **next** Feb 14.
- The password is stored in a config constant for easy annual updates.

---

## 6. Screen Specifications

### 6.1 Mobile Message Screen

**Trigger:** Viewport width < 1024px (standard desktop breakpoint).

**Content:**

- Text: "Open me on your laptop for a surprise" in sans-serif, centered.
- Below the text: a mini countdown timer showing the same contextual format as desktop.
- Background: Same gradient sky as desktop.
- No interactive elements.

**Detection:** CSS media query check + JS `window.innerWidth` on mount. If the window is resized to desktop width, the full experience loads.

---

### 6.2 Countdown Screen (Pre-Feb 14)

**Trigger:** Current UTC date is before February 14th of the current year.

**Target:** Midnight UTC, February 14th (`YYYY-02-14T00:00:00Z`).

**Layout:**

- Full viewport, gradient sky background (light pink to lavender/periwinkle).
- Centered vertically and horizontally.
- Teaser text: **"Patience, love..."** in sans-serif, subtle opacity, above the timer.
- Countdown timer below in monospace font, bold, large.

**Timer Format (Contextual):**

- When > 1 day remaining: Show `X days, HH:MM:SS`
- When <= 1 day remaining: Show `HH:MM:SS` only
- Updates every second via `requestAnimationFrame` or `setInterval(1000)`.

**Ambient effects:** None - keep the countdown clean and minimal.

---

### 6.3 Cloud Animation Screen (Feb 14, Entry)

**Trigger:** UTC date is February 14th and user has not yet completed the flow this year.

**Animation sequence:**

1. Screen shows SVG clouds covering the viewport in soft, layered formations. Light pink/white clouds on the gradient sky background.
2. **Ambient motion:** Clouds gently float and drift (subtle horizontal translation + slight vertical bob) continuously.
3. After a 1-2 second pause, clouds begin to **slowly part** toward the left and right edges of the screen over **3-5 seconds**.
4. Clouds **remain at the screen edges**, framing the password input area that's revealed in the center.
5. Clouds continue gentle ambient motion at the edges.

**Cloud rendering:** SVG `<path>` elements with organic shapes. CSS `transform` and `transition` for ambient movement. The parting animation uses CSS transitions or Svelte `tweened`/`spring` stores for smooth easing.

**Cloud count:** 6-10 cloud SVGs of varying sizes, layered at different z-indices and opacities for depth.

---

### 6.4 Password Input Screen

**Trigger:** Clouds have finished parting.

**Layout:**

- Centered in the viewport, framed by clouds at edges.
- Gradient sky background visible behind.
- Single text input field, styled with rounded corners, soft shadow, light pink border.
- **Placeholder/hint:** A sheep emoji (🐑) as placeholder text inside the input.
- No submit button - auto-validates on keystroke.

**Password logic:**

- Correct password: `"sheep"` (configurable via a constant in source code for annual updates).
- Input is normalized to lowercase before comparison: `input.trim().toLowerCase() === password`.
- **Auto-validation:** On every `input` event, check if the current value (normalized) matches the password.
- **Wrong password trigger:** When the input length reaches the password length (5 characters) and doesn't match, show the error message.
- **Error message:** "Not quite, love" - appears below the input in the accent color (#FF69B4), fades in, stays for 2 seconds, then fades out. Input clears simultaneously.
- **Correct password:** Input field fades out, clouds fully exit or stay framing, transition to Valentine question.

---

### 6.5 Valentine Question Screen

**Trigger:** Correct password entered.

**Layout:**

- Full viewport, clean gradient background (same gradient sky, no clouds).
- Text: **"Will you be my Valentine?"** in script/handwritten font, large, centered in the upper third.
- Two buttons below, horizontally spaced:
  - **"Yes" button:** Rounded, pink background (`#FFB6C1`), dark rose text. **Constant soft glow** effect - a steady, warm light pink aura/box-shadow (`0 0 30px rgba(255, 182, 193, 0.6)`) around the button.
  - **"No" button:** Rounded, neutral/white background, normal appearance. No glow.

**"No" button dodge mechanics:**

- A small **winged heart** character (CSS/SVG animated heart with tiny wings that flap gently) is **always visible** near the "No" button, positioned to its right or above it.
- **Proximity detection:** When the mouse cursor comes within 100-150px of the "No" button's center, the dodge triggers.
- **Dodge behavior:** The button (and its guardian heart) **smoothly animates** to a new position away from the cursor. The heart's wings **flap faster** during the dodge movement.
- **Movement boundary:** Entire viewport. If the button is pushed to an edge, it **wraps to the opposite side** of the screen.
- **The "No" button is unclickable:** The dodge always triggers before the cursor can reach the button. The proximity threshold ensures this. As a fallback, the button's `click` handler also triggers a dodge (in case of edge cases).
- **Pointer events on "No":** The button uses `pointer-events: none` is NOT used (we need hover detection). Instead, the dodge is fast enough to prevent clicks. If a click somehow occurs, it triggers another dodge instead of any action.

**Heart with wings:**

- Small (20-30px) SVG or CSS heart shape with two tiny wings.
- Wings flap with a CSS animation (`@keyframes flap`) at a gentle pace normally, faster during dodges.
- Positioned absolutely, follows the "No" button's position with a slight offset.
- No sparkle trail - wings flap only during dodge.

---

### 6.6 Celebration Screen

**Trigger:** "Yes" button clicked.

**Saves state:** `{ year: currentYear, step: "celebration" }` to localStorage.

**Layout & effects (all continuous, running as long as page is open):**

1. **Background:** Gradient sky with rainbow gradient ribbons flowing dynamically across the screen. Ribbons are CSS elements or Canvas-drawn with `linear-gradient` fills, animating along curved/sinusoidal paths. Multiple ribbons at different speeds and angles.

2. **Stars/sparkles:** HTML Canvas overlay rendering sparkle particles falling straight down like glittery rain. Particles have:
   - Varying sizes (2-6px)
   - Varying speeds
   - Slight horizontal drift
   - Opacity fade near the bottom
   - Gold, white, and light pink colors

3. **Text:** **"I love you Josephine"** in script font, large, centered.
   - **Typewriter effect:** Text types out letter by letter on first appearance.
   - After typewriter completes, text remains static and visible.
   - On subsequent visits (via localStorage), text appears immediately (no re-typewriter).

4. **Audio:** Web Audio API-generated gentle piano melody.
   - Simple romantic chord progression (e.g., C major - Am - F - G or similar).
   - Looping softly.
   - Uses OscillatorNode with a soft waveform (sine or triangle) and GainNode for volume envelope to simulate piano-like notes.
   - Starts playing when the celebration screen mounts.
   - Respects browser autoplay policies: if autoplay is blocked, show a small "tap to play music" prompt that fades after interaction.

---

## 7. Annual Reset Logic

```typescript
function getCurrentState(): AppState {
  const now = new Date();
  const currentYear = now.getUTCFullYear();
  const feb14 = new Date(Date.UTC(currentYear, 1, 14, 0, 0, 0)); // Month is 0-indexed
  const feb15 = new Date(Date.UTC(currentYear, 1, 15, 0, 0, 0));

  const saved = localStorage.getItem("bemyvalentine_state");
  const parsed = saved ? JSON.parse(saved) : null;

  // Clear stale state from previous years
  if (parsed && parsed.year !== currentYear) {
    localStorage.removeItem("bemyvalentine_state");
    return determineStateFromDate(now, feb14, feb15);
  }

  // If saved state exists for this year, resume
  if (parsed && parsed.year === currentYear) {
    return parsed.step;
  }

  return determineStateFromDate(now, feb14, feb15);
}

function determineStateFromDate(now, feb14, feb15): string {
  if (now >= feb14 && now < feb15) return "clouds"; // Feb 14 UTC
  return "countdown"; // Before Feb 14 or after Feb 14 (countdown to next year)
}
```

**Next-year countdown:** When the current date is after Feb 14 of the current year (and no saved celebration state), the countdown targets `YYYY+1-02-14T00:00:00Z`.

---

## 8. Password Configuration

The password is stored as a constant in the source code for simplicity:

```typescript
// src/config.ts
export const VALENTINE_PASSWORD = "sheep";
```

To change the password annually, update this constant and redeploy. No environment variable needed since the site is fully static and the "security" is just a fun gate, not actual protection.

---

## 9. Cloudflare Pages Deployment

### Setup Steps (for domain guidance):

1. **Purchase domain:** Buy `bemyvalentinebaby.com` from a registrar (Cloudflare Registrar recommended for simplest setup, or Namecheap/Google Domains with nameserver transfer).
2. **Cloudflare account:** Create or use existing Cloudflare account.
3. **Add site to Cloudflare:** Add the domain, update nameservers at registrar to Cloudflare's if not using Cloudflare Registrar.
4. **Create Cloudflare Pages project:**
   - Connect to the GitHub repo `vic-ihuoma/bemyvalentine`.
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Framework preset: Astro
5. **Custom domain:** In Cloudflare Pages project settings, add `bemyvalentinebaby.com` as a custom domain. Cloudflare auto-configures DNS.
6. **SSL:** Cloudflare provides automatic SSL/TLS.

### Build Configuration:

```
Build command: npm run build
Build output: dist/
Node version: 20 (set via .node-version or environment variable)
```

---

## 10. Project Structure

```
bemyvalentine/
├── .husky/
│   └── pre-commit          # Runs lint + tests
├── src/
│   ├── layouts/
│   │   └── Layout.astro    # Base HTML layout with meta tags, fonts
│   ├── pages/
│   │   └── index.astro     # Single page, mounts Svelte island
│   ├── components/
│   │   ├── App.svelte      # Main Svelte island - state machine orchestrator
│   │   ├── Countdown.svelte
│   │   ├── MobileMessage.svelte
│   │   ├── CloudAnimation.svelte
│   │   ├── PasswordInput.svelte
│   │   ├── ValentineQuestion.svelte
│   │   ├── Celebration.svelte
│   │   └── WingedHeart.svelte
│   ├── lib/
│   │   ├── config.ts           # Password constant, color tokens
│   │   ├── countdown.ts        # Countdown calculation logic
│   │   ├── state.ts            # localStorage state management
│   │   ├── audio.ts            # Web Audio API piano melody
│   │   ├── canvas.ts           # Canvas sparkle/star rendering
│   │   └── dodge.ts            # No-button dodge math (proximity, wrapping)
│   ├── assets/
│   │   └── clouds.svg          # Cloud SVG shapes (or inline in component)
│   └── styles/
│       └── global.css          # Tailwind directives + custom CSS
├── tests/
│   ├── unit/
│   │   ├── countdown.test.ts
│   │   ├── password.test.ts
│   │   ├── state.test.ts
│   │   └── dodge.test.ts
│   └── snapshots/              # Visual smoke test snapshots (browser agent)
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
├── .eslintrc.cjs
├── .prettierrc
├── .node-version
├── .gitignore
└── spec.md
```

---

## 11. Linting & Formatting

- **ESLint:** With `@typescript-eslint`, `eslint-plugin-svelte`, and `eslint-plugin-astro`.
- **Prettier:** With `prettier-plugin-svelte`, `prettier-plugin-astro`, and `prettier-plugin-tailwindcss`.
- **Config:** Single `.eslintrc.cjs` and `.prettierrc` at root.

---

## 12. Husky Pre-Commit Hook

```bash
#!/bin/sh
npx lint-staged
npx vitest run --reporter=verbose
```

**lint-staged config (in package.json):**

```json
{
  "lint-staged": {
    "*.{ts,svelte,astro}": ["eslint --fix", "prettier --write"],
    "*.{css,json,md}": ["prettier --write"]
  }
}
```

---

## 13. Testing Strategy

### Unit Tests (Vitest)

| Test File           | What It Tests                                                                                                              |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `countdown.test.ts` | Countdown calculation: correct time remaining, contextual format switching, next-year rollover, edge cases at midnight UTC |
| `password.test.ts`  | Password normalization (case insensitivity, trimming, exact match), wrong password detection at correct length             |
| `state.test.ts`     | localStorage read/write/clear, year-based reset, state transitions                                                         |
| `dodge.test.ts`     | Proximity detection math, dodge direction calculation, viewport wrapping logic, boundary clamping                          |

### Visual Smoke Tests

Using the browser agent skill with snapshots saved to `tests/snapshots/`. These capture key visual states:

- Countdown screen appearance
- Cloud animation (pre-part and post-part)
- Password input with cloud framing
- Valentine question with both buttons
- Celebration screen

---

## 14. Accessibility & Performance Notes

- **Keyboard navigation:** The "Yes" button is focusable and can be activated via keyboard (Enter/Space). The "No" button dodge only applies to mouse pointer; keyboard focus on "No" triggers a dodge of the visual button but does not prevent keyboard activation (acceptable since the joke is mouse-based).
- **Reduced motion:** Respect `prefers-reduced-motion` media query: skip cloud ambient motion, reduce sparkle count, disable typewriter effect (show text immediately).
- **Performance:** Canvas sparkles use `requestAnimationFrame` with particle pooling. SVG clouds use CSS `will-change: transform` for GPU acceleration. Limit canvas particle count to ~200 max.
- **SEO:** Not relevant (personal site), but include a basic `<title>` and meta description for the browser tab: "Be My Valentine".
- **Favicon:** A small pink heart emoji or heart SVG as the favicon.

---

## 15. Browser Support

Target modern evergreen browsers: Chrome, Firefox, Safari, Edge (latest 2 versions). No IE11 support needed.

---

## 16. Open Items / Future Considerations

- Domain purchase and Cloudflare DNS setup (guided during deployment phase).
- Audio melody composition: specific note sequence to be finalized during implementation.
- Cloud SVG shapes: exact organic shapes to be designed during implementation.
- Annual password update workflow: update `config.ts` and push to `main`.
