# Implementation Plan: Barrows & Banshees Character Generator — V1

Source spec: SPEC.md

## Overview

A static Vite + TypeScript site that rolls a level-1 character following *Barrows and Banshees v0.17*, lets the player re-roll or edit each part, and prints a one-page sheet. All rules are pure functions over typed data with an injected RNG, so they can be tested deterministically. The UI is plain DOM.

Tasks are tracked in `tasks/todo.md` (full acceptance criteria and verification for each task).

## Architecture Decisions

- **Pure rules core, thin UI.** `src/rules/` never touches the DOM or `Math.random()`. The UI holds one `Character` state object; every user action produces a new state through a rules function, and the sheet re-renders from that state. This makes re-roll and swap trivially testable.
- **Seedable RNG (mulberry32, ~10 lines) instead of a library.** No dependency, and deterministic tests.
- **Data as typed constants.** One module per concern (`classes`, `gear`, `spells`, `bonds`), each entry citing its rulebook page. Gear items carry a tag (`normal | encumbering | stack | tiny | worn`) plus optional `weapon` / `armour` / `shield` properties; derived values are computed from tags, never stored.
- **Character stores choices, not derived values.** HP, slots, AV, shield and weapon damage are computed by `derive.ts` at render time, so swapping attributes or changing kit can't leave stale numbers.
- **One page, two stylesheets.** The screen and print layouts share the same markup; `print.css` turns it into the playtest-sheet layout.
- **Relative asset paths (`base: './'`)** so `dist/` works on any static host or sub-path (GitHub Pages).
- **Toolchain:** Node 26 via nvm (`.nvmrc`), Vite 7, Vitest 5, TypeScript 5. Agent shells are non-interactive and don't read `~/.zshrc`, so npm commands run as `source ~/.nvm/nvm.sh && npm …`.

## Dependency Graph

```
dice.ts (RNG)
   │
classes.ts ──► attributes + HP + slots ──► generateCharacter ──► sheet render (slice 1)
   │                                            │
gear.ts ──► AV / shield / weapons / slot use ───┤
spells.ts, bonds.ts, abilities ─────────────────┤
                                                ▼
                                   re-roll & class cascade ──► manual edits & swaps
                                                                     │
                                                       screen styles ─┴─ print styles
```

## Task List

### Phase 1: Foundation and first slice
- [x] Task 1: Project scaffold and toolchain
- [x] Task 2: Seedable dice and RNG helpers
- [x] Task 3: Class data, attribute roll, HP and slot count
- [x] Task 4: First slice: Roll button shows a basic character

### Checkpoint 1: Foundation
- [x] `npm test` and `npm run build` pass
- [x] Clicking Roll in `npm run dev` shows class, name, background, characteristic, trait, attributes, HP
- [x] Human review

### Phase 2: Complete character
- [x] Task 5: Gear catalogue, class kits and data integrity tests
- [ ] Task 6: Derived gear values and inventory on the sheet
- [ ] Task 7: Spells, bonds and class abilities

### Checkpoint 2: Complete character
- [ ] Every field in the spec's requirements tables renders
- [ ] **Human reviews the gear classification in `src/data/gear.ts`**
- [ ] Tests and build pass

### Phase 3: Interaction
- [ ] Task 8: Per-section re-roll and class change cascade
- [ ] Task 9: Manual edits and attribute swaps

### Checkpoint 3: Interaction
- [ ] All user stories work in the browser
- [ ] Tests and build pass

### Phase 4: Presentation and release
- [ ] Task 10: Screen visual design and accessibility
- [ ] Task 11: Print stylesheet
- [ ] Task 12: Final verification against Success Criteria and deploy notes

### Checkpoint 4: Complete
- [ ] Every Success Criteria item in SPEC.md is checked
- [ ] Ready for review

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Gear data entry errors (≈30 kit lines, ~150 items) | High | Data integrity test over every class × kit; human review at Checkpoint 2 |
| Gear tags for items not in the equipment list are judgement calls | Med | Rules stated in the spec; full list in one file for the author to review |
| Page 1 overflows when printing (long kits, long bond text) | Med | Fixed slot grid like the playtest sheet; truncate-free small type for bond; spells/abilities on page 2; test the longest kit |
| A4 vs US Letter differences | Low | Size to the smaller printable area of both; check both in print preview |
| nvm not loaded in non-interactive agent shells | Low | Source `~/.nvm/nvm.sh` in every npm command; `.nvmrc` pins the version |
## Decisions (approved 2026-11-14)

1. `*.pdf` is in `.gitignore`: the rulebook PDFs and their licensed cover art are never committed.
2. `@vitest/coverage-v8` is an approved dev dependency for the 100% coverage target on `src/rules/` (version must match Vitest).
3. Vitest 5.1.0 instead of 3.x: Vitest 3 had 2 critical and 1 moderate audit advisories (approved during Task 1).

## Open Questions

None.
