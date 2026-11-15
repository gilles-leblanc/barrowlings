# Spec: Barrows & Banshees Character Generator — V1

Source of truth for rules: *Barrows and Banshees v0.17* (A5 PDF), pp. 30–81. Sheet layout reference: *Character Sheet 1.2* (playtest draft, not binding).

## Objective

A small static website that builds a level-1 Barrows & Banshees character and shows it as a printable character sheet. Everything runs in the browser, with no backend.

**Users:** players at the table (or the GM) who need a character quickly, including a replacement character mid-session.

**User stories**
- As a player, I click one button and get a complete, playable level-1 character.
- As a player, I can re-roll any single part (background, kit, name…) without losing the rest.
- As a player, I can override any rolled value by hand, including rearranging attributes however I like.
- As a player, I can print the character on one page and play from it.

### Requirements: character creation rules

| Step | Rule | Source |
|---|---|---|
| Class | One of Cleric, Paladin, Ranger, Thief, Warrior, Witch, Wizard | p.31–59 |
| Background | d6 from the class table, or free text | per class |
| Gear | Class fixed gear + one d4 kit from the class table | per class |
| Common gear | Clothes, rations, waterskin, **4d4 coins** | p.31 |
| Physical characteristic | One. d8 from the class table, any other class's table, or free text | p.30 |
| Trait / quirk | One. d8 from the class table, any other class's table, or free text | p.30 |
| Name | Random from the class's sample names (10 each), or free text | per class |
| Attributes | Assign **14, 13, 10, 8, 7** to STR, DEX, CON, AWA, PRE. The roll follows the class attribute matrix; the player can then rearrange freely | p.60 + author |
| HP | `floor(CON / 2) + class HP per level` | p.62 |
| Languages | Optional free-text field, empty by default, no suggestions. Always printed; prints blank when empty | p.62 |
| Bond | d17 from the bond list, or free text, plus a blank field for the other character's name | p.63–64 |
| Spells | Cleric/Witch/Wizard: 2 level-1 spells from their class list (4 options each) | p.81 |
| Level / Deeds | Level 1, Deeds 0 | p.30, 66 |

### Requirements: class reference data

| Class | HP/lvl | Armour | Weapons | Fixed gear |
|---|---|---|---|---|
| Cleric | 2 | Light, Medium, Shields | Simple, Standard | Holy symbol |
| Paladin | 3 | Light, Medium, Heavy, Shields | Simple, Standard, Martial | Shield |
| Ranger | 3 | Light, Medium, Shields | Simple, Standard, Martial | Hunting bow, quiver, arrows |
| Thief | 2 | Light | Simple, Standard | Lock picks |
| Warrior | 3 | All | All | — |
| Witch | 1 | None | Simple | — |
| Wizard | 1 | None | Simple | Optional: spellbook |

### Requirements: class attribute matrix (roll guidance only, not a rule)

The game has no primary stats. This matrix only makes the default roll useful for the class, so players rarely need to rearrange.

| Class | Main (gets 14) | Secondary (gets 13) |
|---|---|---|
| Cleric | PRE | STR, CON |
| Paladin | STR | PRE, CON |
| Ranger | DEX or STR | DEX, STR, AWA (not the one chosen as main) |
| Thief | DEX | AWA, PRE |
| Warrior | STR | CON |
| Witch | PRE | DEX, CON, AWA |
| Wizard | PRE | DEX, CON, AWA |

- **Roll:** pick a main attribute from the allowed list and give it 14. Pick a secondary from the allowed list and give it 13. Shuffle 10, 8 and 7 across the other three.
- **Swap:** the user can swap any two attribute values, with no restrictions.

### Requirements: derived values

- **Inventory slots:** `max(10, STR)`. Each gear item is tagged `normal` (1 slot), `encumbering` (2), `stack` (1, with 4 check boxes), `tiny` (0) or `worn` (0).
  - Tagging: equipment-list tags (p.76–77) where they exist; clothing, headwear, cloaks, masks and jewellery (including the holy symbol) are `worn`; small items that are clearly fist-sized trinkets (coin, bell, whistle, tinder box, dice, ring, locket) are `tiny`; everything else, including borderline items such as the compass, mirrors, pipe, lock picks and scrolls, is `normal`. The full classification lives in `src/data/gear.ts`.
  - **Over-limit items:** gear is counted in order (fixed, kit, common). Any item whose slots go past the character's capacity is marked as over the limit on screen (accent colour plus an "Over limit" label). In print, a heavy rule labelled "Capacity" crosses the inventory grid after the last allowed slot, and the slots below it are lightly shaded. Known case: Ranger kit 2 needs 11 slots, so a Ranger with STR 10 or less is one slot over.
- **Armour Value:** only the gambeson counts as armour (Light, AV 1). The leather jerkin, miner's helmet, metal pauldron and fur shoulder wrap are worn flavour items. Otherwise AV 0.
- **Shield:** checkbox ticked if the gear includes a shield.
- **Weapons:** every weapon in the gear with its damage die (Simple d4, Standard d6, Martial d8, Two-handed d10). If the class isn't proficient, the weapon drops to the next weaker category it is proficient with (p.18).
- **Class abilities:** names and short summaries.

### Requirements: user flow

1. Landing page with a big **Roll a Character** button and an optional class picker (defaults to Random).
2. The character sheet appears. Each rolled section (class, background, kit, characteristic, trait, name, attributes, bond, spells) has a **re-roll** control and can be edited by hand. Languages is a plain optional text field.
   - Changing class re-rolls everything that depends on class (background, kit, name, spells, attributes) and recalculates derived values.
3. **Print** button → a print stylesheet modelled on the playtest sheet: Name/Class/Level, Background/Deeds, Bond, attributes column, Languages, Characteristics/Traits, HP/Current, AV/Shield, Weapons, 18 inventory slots with 4 check boxes, Tiny items, Coins, Worn. Spells (casters) and Abilities (all classes) go on page 2 if they don't fit.

### Requirements: visual design

- High contrast: near-black on off-white, plus **one** accent colour (e.g. blood red) used sparingly. Dark mode inverts.
- Bold display font for headings (a heavy grotesque like the rulebook's chapter titles), readable body font.
- Large touch targets; works at phone width (360px).
- Print: pure black and white, no accent.
- Accessible: semantic HTML, keyboard operable, visible focus, WCAG AA contrast.

## Tech Stack

- Node 26 via nvm (pinned in `.nvmrc`), TypeScript 5.x, Vite 7.x, plain DOM, no UI framework.
- Vitest 5.x for unit tests (5.1.0; Vitest 3 had critical audit advisories).
- Fonts from Google Fonts or self-hosted.
- Output: a static `dist/` folder, deployable to GitHub Pages, Netlify or Cloudflare Pages.

## Commands

```
Install: npm install
Dev:     npm run dev
Test:    npm test            # vitest run
Watch:   npm run test:watch  # vitest
Types:   npm run typecheck   # tsc --noEmit
Build:   npm run build       # tsc --noEmit && vite build → dist/
Preview: npm run preview     # serve dist/ locally
```

## Project Structure

```
index.html              → Single page
src/main.ts             → Entry point: wires state to UI
src/data/               → Rules data only, no logic (classes.ts, gear.ts, spells.ts, bonds.ts)
src/rules/              → Pure functions: dice.ts, generate.ts, derive.ts
src/ui/                 → DOM rendering and event handling: sheet.ts, controls.ts
src/styles/             → main.css (screen), print.css (print)
tests/                  → Vitest unit tests mirroring src/rules/
```

## Code Style

- Rules logic is pure: no DOM, no `Math.random()` inside. Randomness comes from an injected `Rng` so tests can seed it.
- Rules data is plain typed constants, with the rulebook page cited in a comment.
- Names: `camelCase` functions and variables, `PascalCase` types, `SCREAMING_SNAKE` for constant tables.
- Strict TypeScript (`"strict": true`). No `any`.
- Formatting: 2-space indent, single quotes, no semicolons (as in the snippet below).

```ts
// src/rules/dice.ts
export type Rng = () => number // returns [0, 1)

export function roll(rng: Rng, sides: number): number {
  return Math.floor(rng() * sides) + 1
}

// src/rules/derive.ts
import type { Attributes, ClassId } from '../data/classes'
import { CLASSES } from '../data/classes'

/** p.62: half CON rounded down, plus class HP per level. */
export function startingHp(attrs: Attributes, classId: ClassId): number {
  return Math.floor(attrs.con / 2) + CLASSES[classId].hpPerLevel
}
```

## Testing Strategy

- **Framework:** Vitest. Tests in `tests/`, one file per `src/rules/` module.
- **Unit tests (seeded RNG)** for every rule in the requirements tables: HP formula; slot count; rolled attributes are a permutation of 14/13/10/8/7 that fits the class matrix; swapping keeps a valid permutation; kit → AV / shield / weapons; proficiency downgrade; coins in 4–16; spell count and eligibility.
- **Data integrity test:** iterate every class × every kit and check slot usage ≤ 10 (the minimum capacity, since STR 7 still gets 10 slots), except known over-capacity kits listed in the test (Ranger kit 2: 11). Also check every background, characteristic, trait, name and bond table has the expected length (6 / 8 / 8 / 10 / 17).
- **Coverage:** 100% of `src/rules/` lines. UI is not unit-tested.
- **Manual:** print preview in Chrome and Firefox, at both US Letter and A4; phone-width layout check.

## Boundaries

- **Always:** keep rules data separate from logic; cite the rulebook page in data comments; run `npm test` and `npm run build` before calling a task done.
- **Ask first:** adding a dependency beyond Vite / TypeScript / Vitest; changing a rule interpretation; adding persistence or accounts.
- **Never:** add a backend; add analytics or tracking; use the cover artwork (© Dean Spencer, not licensed for this).

## Success Criteria

- [ ] `npm run build` produces a static `dist/` that works when served from any static host (relative asset paths).
- [ ] One click on **Roll a Character** produces a character with every field in the requirements tables filled (except Languages and the bond's other-character name, which stay blank).
- [ ] For each class, 1,000 seeded rolls all give attributes that are a permutation of 14/13/10/8/7 with 14 and 13 on matrix-allowed attributes.
- [ ] HP, slots, AV, shield and weapon damage on the sheet match the derivation rules for every class × kit combination (tested).
- [ ] Every class × kit fits in 10 inventory slots, except the known Ranger kit 2 (11 slots) (tested).
- [ ] Items past the character's slot capacity are visibly marked on screen and in print (tested for which items are over).
- [ ] Each rolled section can be re-rolled on its own without changing other sections (except class, which re-rolls its dependents).
- [ ] Any two attributes can be swapped, and HP and slots update.
- [ ] Printing produces page 1 with the full playtest-sheet layout, in black and white, on both A4 and US Letter. Overflow (spells, abilities) goes to page 2 only.
- [ ] The page is usable at 360px wide, keyboard operable, and meets WCAG AA contrast.
- [ ] `npm test` passes with 100% line coverage on `src/rules/`.

## Out of Scope (Deferred)

- Levelling past 1, deeds tracking, live HP tracking — the sheet is filled in by hand during play.
- Party / bond web across several characters — needs multiple characters and shared state.
- Saving characters (JSON or URL export) — print-to-PDF covers V1.
- Buying gear with starting coins — needs a shop UI; kits already cover starting gear.

## Open Questions

None. (Resolved 2026-11-14: nvm with Node 26 installed in WSL; `git init` done.)

## Appendix: rulebook typos and gaps spotted (FYI, not blocking)

- p.73 "Sheperd's axe" vs p.34 "Shepherd's axe".
- p.78 "10 slots of gear with saddle bags or 20 slots with saddle bags" (one is probably "without").
- p.85 Holy Word covers levels 1–3, 5–6 and 7–10, but not level 4.
- p.91 "Tripple Bodied".
- p.44 Thief "Lock Picks" vs p.77 "Thieves' tools (lock pick)". The generator prints "Lock picks".
