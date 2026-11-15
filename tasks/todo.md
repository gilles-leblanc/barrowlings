# Tasks: Dark Mode Toggle

Source spec: SPEC-dark-mode-toggle.md · Plan: tasks/plan.md

Every task must also meet the standing Definition of Done: acceptance criteria met, tests that fail without the change, no regressions, `npm test` and `npm run build` pass, scoped to the task.

npm commands in agent shells: `source ~/.nvm/nvm.sh && npm …`

---

## Phase 1: Toggle

### - [ ] Task 1: Theme logic and safe storage

**Description:** Pure functions in `src/rules/theme.ts`: decide the theme from a saved choice and the system preference, flip it, and read/write the saved choice through a storage object without ever throwing.

**Acceptance criteria:**
- [ ] `resolveTheme(saved, systemPrefersDark)`: a valid saved `'light'`/`'dark'` wins; anything else (null, garbage) falls back to the system preference
- [ ] `toggleTheme(theme)` returns the other theme
- [ ] `readSavedTheme(storage)` and `saveTheme(storage, theme)` work with a normal storage and return/ignore safely when storage is missing or throws

**Verification:**
- [ ] Tests pass: `npm test -- tests/theme.test.ts` (and full suite, 100% lines on `src/rules/`)
- [ ] Build succeeds: `npm run build`

**Dependencies:** None

**Files likely touched:** `src/rules/theme.ts`, `tests/theme.test.ts`

**Estimated scope:** S

---

### - [ ] Task 2: Toggle button, theme CSS and no-flash start

**Description:** Add the header toggle, drive the colours from `data-theme` on `<html>`, and set a saved theme before first paint.

**Acceptance criteria:**
- [ ] Header button next to Print, ≥ 44px, labelled with the theme it switches to ("Dark mode" / "Light mode"), with `aria-pressed` reflecting dark mode; clicking switches the page and saves the choice
- [ ] CSS: dark tokens apply for `data-theme="dark"`, or with no `data-theme` when the system prefers dark; light tokens otherwise; V1 colours unchanged
- [ ] Inline `<head>` script applies a saved choice before first paint; print stays black on white in both themes

**Verification:**
- [ ] Tests pass: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] Manual check (Chrome): toggle both ways; reload keeps the choice; with `localStorage` made to throw, the toggle still works and the console is clean; 360px layout; forced print view is black on white with dark mode on

**Dependencies:** Task 1

**Files likely touched:** `index.html`, `src/styles/main.css`, `src/main.ts`, `src/ui/theme-toggle.ts`

**Estimated scope:** M

---

### Checkpoint: Toggle works locally
- [ ] All tests pass, build succeeds
- [ ] All Task 2 manual checks pass

---

## Phase 2: Release

### - [ ] Task 3: Update SPEC.md and README, mark the delta implemented, push to deploy

**Description:** Fold the change into the main spec so it describes the current site, mark the delta spec implemented, and publish via the existing GitHub Pages workflow.

**Acceptance criteria:**
- [ ] SPEC.md › Requirements: visual design describes the toggle and remembered choice; README feature list mentions it
- [ ] `SPEC-dark-mode-toggle.md` has `Status: implemented` and its Success Criteria are ticked
- [ ] Pushed to `main`; the deploy workflow succeeds

**Verification:**
- [ ] Tests pass and build succeeds (also in the workflow)
- [ ] Manual check: the toggle works on https://gilles-leblanc.github.io/barrowlings/ (switch, reload)

**Dependencies:** Task 2

**Files likely touched:** `SPEC.md`, `SPEC-dark-mode-toggle.md`, `README.md`

**Estimated scope:** S

---

### Checkpoint: Live
- [ ] Toggle works on the live site
- [ ] Ready for review
