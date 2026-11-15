# Implementation Plan: Dark Mode Toggle

Source spec: SPEC-dark-mode-toggle.md

## Overview

Add a header button that switches the site between the existing V1 light and dark themes, starting from the system setting and remembering the player's choice in `localStorage`. Print stays black on white. The V1 plan is archived in `tasks/archive/v1/`.

Tasks are tracked in `tasks/todo.md`.

## Architecture Decisions

- **One source of truth on the page: `<html data-theme="light|dark">`.** CSS keeps the V1 colour tokens; the dark tokens apply when `data-theme="dark"`, or when no theme is set and the system prefers dark (fallback if JavaScript doesn't run).
- **Pure theme logic in `src/rules/theme.ts`** (saved choice + system preference → theme; next theme; safe storage read/write that never throws). Fully unit-tested, so `src/rules/` keeps 100% line coverage.
- **No-flash inline script in `index.html`**: a few lines that read the saved choice and set `data-theme` before first paint. It duplicates the "read saved choice" rule in a tiny form because module scripts run after paint; noted in a comment pointing at `theme.ts`.
- **Print** already forces black on white in `print.css`; a check confirms dark tokens don't leak into print.
- No new dependencies.

## Task List

### Phase 1: Toggle
- [x] Task 1: Theme logic and safe storage
- [ ] Task 2: Toggle button, theme CSS and no-flash start

### Checkpoint: Toggle works locally
- [ ] Tests and build pass; toggle checked in Chrome (switch, reload, blocked storage, 360px, print)

### Phase 2: Release
- [ ] Task 3: Update SPEC.md and README, mark the delta implemented, push to deploy

### Checkpoint: Live
- [ ] Toggle works on https://gilles-leblanc.github.io/barrowlings/

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Light flash for players who chose dark | Low | Inline pre-paint script in `<head>` |
| `localStorage` blocked (private windows, strict settings) | Low | All access wrapped in try/catch; tested with a throwing storage |
| Dark tokens leaking into print | Low | Print styles set explicit black/white; checked with a forced print preview |
| Pushing to `main` deploys publicly | Med | Deploy is Task 3 only, after local checks; approved as part of this plan |

## Open Questions

None.
