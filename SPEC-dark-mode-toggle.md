# Spec Delta: Dark Mode Toggle

Status: implemented

## Objective

Let players switch between light and dark themes on the site itself, without changing their system or browser settings. Requested by the author after V1 shipped (2026-11-14).

## Current Behavior

See SPEC.md › Requirements: visual design. The theme follows the operating system or browser setting only (`prefers-color-scheme` in `src/styles/main.css`). There is no control on the page.

## New Behavior

- A **theme toggle button** in the header, next to Print.
  - A fixed label, "Dark mode", with its on/off state exposed to screen readers (`aria-pressed`) and shown visually (filled when on). This follows the WAI-ARIA toggle-button pattern. *(Changed during Task 2: the original wording, a label that switches between "Dark mode" and "Light mode" plus `aria-pressed`, would have been announced contradictorily, e.g. "Light mode, pressed".)*
  - It is the same height as the other header buttons (≥ 44px) and keyboard operable.
- **Starting theme:** follows the system setting, as today, until the player uses the toggle.
- **Remembered choice:** after the player toggles, the choice is saved in the browser (`localStorage`) and used on later visits. If storage is unavailable (private window, blocked), the toggle still works for the current visit.
- **No flash:** a remembered dark choice is applied before the page first paints, so returning players don't see a light flash.
- **Print is unchanged:** always black on white, whatever the theme.
- The light and dark colours themselves are unchanged from V1.

## Success Criteria

- [x] Clicking the toggle switches the whole page between the V1 light and dark colours, and its `aria-pressed` state and filled look update.
- [x] With no saved choice, the page follows the system setting (same as V1).
- [x] A saved choice overrides the system setting on reload; the dark choice shows no light flash.
- [x] If `localStorage` throws, the toggle still switches the theme for the visit, with no console errors.
- [x] Printing is black on white in both themes.
- [x] The theme logic (saved choice vs system setting → theme) is unit-tested; all existing tests still pass and `src/rules/` keeps 100% line coverage.
- [x] Keyboard operable, visible focus, works at 360px.
- [x] Deployed to GitHub Pages via the existing workflow.

## Boundaries

Inherits SPEC.md › Boundaries. Deltas:

- **Always:** keep `localStorage` access wrapped so failures never break the page.
- **Never:** add a dependency for this; store anything other than the theme choice.

## Out of Scope (Deferred)

- A third "follow system" option on the toggle. Once a player picks a theme it sticks; clearing site data returns to following the system. Can be added later if wanted.
