# EarthRhythm accessibility implementation plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task by task. The user approved execution and requested a copy of the branch.

**Goal:** Extend equivalent written, keyboard and tactile access without rearranging the current interface.

**Architecture:** Extend the existing component and preference menu in `prototipos/I11-eic/Main.dc.html`, using the same analysis and playback clock. Keep the current build and runtime, without product dependencies.

**Tech Stack:** HTML, CSS, JavaScript, Web Audio, Vibration API; Node tests and browser checks.

**Spec:** `docs/ACCESIBILIDAD_PROPUESTA.md`, approved in chat on 2026-11-15.

## Global constraints

- The experiment used a local copy of the source at the time.
- Preserve current layout, brand, music, selections and routes. Add settings and collapsed information only.
- Do not ask for diagnoses. Keep all additions in Spanish and English.
- Vibration is opt-in and phone-only; unsupported browsers retain written alternatives.
- Do not claim universal accessibility or WCAG certification.

## Review focus

- A stored vibration preference must never vibrate a desktop that exposes a stub API.
- Phone/browser detection is approximate; no vibration API means an honest unsupported notice.
- Muted audio and reduced visual motion must not disable the selected tactile channel.
- Missing/nonfinite map values must remain absent, not become zero or degrees.
- Opening data/help and switching language must retain focus, map, file and playback state.

## Task 1: Independent tactile preferences and system motion

**Files:** `prototipos/I11-eic/Main.dc.html`, `scripts/test_guides.cjs`.
**Interfaces:** `isPhoneDevice(navigator): boolean`, `HapticFeedback.supported()`, `playbackPulse(fired, levels)`, saved preferences and system motion listener.

- [x] Add behavioral tests for desktop exclusion, phones with/without API, muted and reduced-motion tactile playback, and system-motion/manual precedence. Run and observe failures.
- [x] Implement conservative phone detection, phone-only template visibility and preference choice, tactile/audio independence, and system preference synchronization with disposal.
- [x] Update existing tests whose expected behavior intentionally changes. Run `node scripts/test_guides.cjs` to zero failures.

## Task 2: Equivalent text data and usage guidance

**Files:** `prototipos/I11-eic/Main.dc.html`, `scripts/test_guides.cjs`.
**Interfaces:** `accessibleDataVm()`, `selectDataColumn(event)`, render values `accessibleData` and `accessHelp`.

- [x] Add tests for reading 16 rows of any of 28 columns, unavailable data, rainfall/custom-image source labels, translations and preservation of playback/state. Run and observe failures.
- [x] Add a collapsed data consultation adjacent to the current readout, labeled native column selector, derived-value table and source/date metadata. Add collapsed usage guidance in the current accessibility menu.
- [x] Add labels/descriptions and clear status messages without live announcements on every note. Run the full logic suite.

## Task 3: Browser verification and delivery

**Files:** `scripts/verify_accessibility_flow.cjs`, `docs/ACCESIBILIDAD_VERIFICACION.md`, `README.md`.

- [x] Build with an installed Python executable, install QA tooling outside product dependencies if needed, and open the built application.
- [x] Verify desktop/phone visibility, keyboard data access, state preservation, system motion and browser axe checks. Compare desktop and phone screenshots.
- [x] Review the diff and changes, record fresh evidence and physical/AT limitations. Keep the copied branch ready for user review without publishing or merging.

## Execution record

- Branch created from `a7f965abc467c2a3e67d6e5063ae871bdcaddbc6` before product changes.
- Baseline: 135/135 logic tests passed in the preceding review.
- Ruling: use a copied branch in the current directory as explicitly requested; no additional checkout or worktree is needed.
- Ruling: perform implementation inline and retain changes for review; avoid repeated approval requests because execution is explicitly authorized.
- Task 1 complete: new behavior observed failing before implementation; 137/137 logic tests passed afterwards.
- Task 2 complete: data tests observed failing before implementation; 139/139 logic tests passed afterwards.
- Final review: independent reviewer found rainfall background semantics and two stale Spanish test locators. Rainfall regression observed RED, corrected to neutral/chart background, full logic suite GREEN at 139/139. Spanish locators corrected.
- Browser findings: axe identified visible-label/accessibility-name mismatches. Language names now include EN/ES; musician controls derive their name from visible text. The 24-state flow audit subsequently passed with zero automatic violations.
- QA ruling: the legacy full-audit script raced the self-removing intro Skip button. Awaiting the intended preferences dialog fixes the test lifecycle race without changing product behavior.
- Task 3 complete: 139/139 final logic tests, 24 flow-state audits and 66 whole-application state audits with zero automatic violations, 8 native keyboard scenarios and unchanged existing geometry at 390/1366 px. Physical hardware and actual assistive-technology trials remain explicitly pending.
- Integration ruling: retain the copied branch locally as requested; do not merge into the source branch or publish.
