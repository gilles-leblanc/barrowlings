# Tasks: Barrows & Banshees Character Generator — V1

Source spec: SPEC.md · Plan: tasks/plan.md

Every task must also meet the standing Definition of Done: acceptance criteria met, tests that fail without the change, no regressions, `npm test` and `npm run build` pass, no dead code or debug output, scoped to the task.

npm commands in agent shells: `source ~/.nvm/nvm.sh && npm …`

---

## Phase 1: Foundation and first slice

### - [x] Task 1: Project scaffold and toolchain

**Description:** Set up Vite + TypeScript (strict) + Vitest with the scripts listed in SPEC.md › Commands, a placeholder page, and git hygiene, so later tasks have a working test and build loop.

**Acceptance criteria:**
- [x] `package.json` has `dev`, `test`, `test:watch`, `typecheck`, `build`, `preview` scripts matching the spec; `engines.node` set; Vite 7, Vitest 5, TypeScript 5 pinned
- [x] `tsconfig.json` has `"strict": true`; `vite.config.ts` sets `base: './'`
- [x] `.nvmrc` pins Node 26; `.gitignore` covers `node_modules/`, `dist/`, `coverage/` and `*.pdf`

**Verification:**
- [x] Tests pass: `npm test` (config test: relative base path)
- [x] Build succeeds: `npm run build` produces `dist/index.html` with relative asset paths
- [x] Manual check: `npm run dev` serves the placeholder page

**Dependencies:** None

**Files likely touched:** `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `src/main.ts`, `.gitignore`, `.nvmrc`, `tests/smoke.test.ts` (config-only files; still one concern)

**Estimated scope:** M

---

### - [x] Task 2: Seedable dice and RNG helpers

**Description:** Pure randomness helpers that every generator uses: a seedable RNG, die rolls, picking from a list, and shuffling.

**Acceptance criteria:**
- [x] `createRng(seed)` returns a deterministic `Rng` (same seed → same sequence); `defaultRng` wraps `Math.random`
- [x] `roll(rng, sides)` returns 1…sides; `rollMany(rng, count, sides)` sums (e.g. 4d4 → 4…16); `pick(rng, list)` and `shuffle(rng, list)` (non-mutating)
- [x] Over 10,000 seeded rolls, every face of a d6 / d8 appears and nothing falls outside the range

**Verification:**
- [x] Tests pass: `npm test -- tests/dice.test.ts`
- [x] Build succeeds: `npm run build`

**Dependencies:** Task 1

**Files likely touched:** `src/rules/dice.ts`, `tests/dice.test.ts`

**Estimated scope:** S

---

### - [x] Task 3: Class data, attribute roll, HP and slot count

**Description:** Encode the seven classes (HP per level, armour and weapon proficiencies, fixed gear, attribute matrix) and implement the attribute roll plus the HP and slot formulas. This is the highest-risk rules logic, so it comes first.

**Acceptance criteria:**
- [x] `CLASSES` matches SPEC.md › class reference data and attribute matrix, with page citations
- [x] `rollAttributes(rng, classId)`: result is a permutation of 14/13/10/8/7; 14 is on an allowed main and 13 on an allowed secondary (Ranger never puts both on the same attribute). Checked over 1,000 seeded rolls per class
- [x] `startingHp` = `floor(CON / 2) + hpPerLevel`; `slotCapacity` = `max(10, STR)` (tested at boundaries, e.g. STR 7 → 10, STR 14 → 14)

**Verification:**
- [x] Tests pass: `npm test -- tests/generate.test.ts tests/derive.test.ts`
- [x] Build succeeds: `npm run build`

**Dependencies:** Task 2

**Files likely touched:** `src/data/classes.ts`, `src/rules/generate.ts`, `src/rules/derive.ts`, `tests/generate.test.ts`, `tests/derive.test.ts`

**Estimated scope:** M

---

### - [x] Task 4: First slice: Roll button shows a basic character

**Description:** First end-to-end slice. Add backgrounds, characteristics, traits and sample names to the class data; implement `generateCharacter(rng, classId?)`; render a basic sheet with a Roll button and class picker (Random by default).

**Acceptance criteria:**
- [x] Each class has 6 backgrounds, 8 characteristics, 8 traits, 10 names (tested by length)
- [x] `generateCharacter` returns class, name, background, one characteristic, one trait, attributes, level 1, deeds 0; a chosen class is respected; Random picks any class
- [x] Clicking **Roll a Character** renders those fields plus HP and slot capacity (code in place; click-through pending the Checkpoint 1 manual check)

**Verification:**
- [x] Tests pass: `npm test`
- [x] Build succeeds: `npm run build`
- [ ] Manual check: in `npm run dev`, roll 10 times with Random and with each class; fields always populated. **Not done by the agent: Chrome extension was not connected. Dev server served the page and all modules (HTTP 200). Left for the human at Checkpoint 1.**

**Dependencies:** Task 3

**Files likely touched:** `src/data/classes.ts`, `src/rules/generate.ts`, `src/ui/sheet.ts`, `src/main.ts`, `tests/generate.test.ts`

**Estimated scope:** M

---

### Checkpoint 1: Foundation
- [ ] All tests pass
- [ ] Build succeeds
- [ ] Roll flow works end-to-end in the browser
- [ ] Review with human before proceeding

---

## Phase 2: Complete character

### - [ ] Task 5: Gear catalogue, class kits and data integrity tests

**Description:** Encode every item that appears in class fixed gear, the four kits per class, and the common gear (clothes, rations, waterskin). Each item gets a tag following SPEC.md › derived values; weapons get a category, armour an AV, shields a flag. Gear generation picks a kit (d4) and adds 4d4 coins.

**Acceptance criteria:**
- [ ] Every kit item from pp. 34–58 exists in the catalogue with a tag and, where relevant, weapon category / armour / shield; equipment-list tags (p.76–77) used where they exist
- [ ] Data integrity test: every class × kit (with fixed and common gear) uses ≤ 10 slots; every class has exactly 4 kits
- [ ] `rollGear(rng, classId)` returns fixed gear + one kit + common gear + coins in 4…16

**Verification:**
- [ ] Tests pass: `npm test -- tests/gear.test.ts`
- [ ] Build succeeds: `npm run build`

**Dependencies:** Task 2, Task 3

**Files likely touched:** `src/data/gear.ts`, `src/rules/generate.ts`, `tests/gear.test.ts`

**Estimated scope:** M

---

### - [ ] Task 6: Derived gear values and inventory on the sheet

**Description:** Compute armour value, shield, weapons with damage dice (including the proficiency downgrade, p.18) and slot usage from the gear, and render them: weapons list, AV, shield checkbox, inventory slots, tiny items, worn items, coins.

**Acceptance criteria:**
- [ ] `armourValue`, `hasShield`, `weaponsWithDamage` (downgrade tested with a non-proficient weapon, e.g. a Wizard with a long sword → d4), `slotsUsed` all derived from gear
- [ ] Gambeson kits give AV 1; no other kit item gives AV; shield kits tick Shield
- [ ] The sheet shows weapons with dice, AV, shield, slot items (stacks with 4 check boxes), tiny items, worn items and coins

**Verification:**
- [ ] Tests pass: `npm test -- tests/derive.test.ts`
- [ ] Build succeeds: `npm run build`
- [ ] Manual check: roll a Warrior until kit 1 (gambeson, AV 1) and kit 2 (shield); values shown correctly

**Dependencies:** Task 4, Task 5

**Files likely touched:** `src/rules/derive.ts`, `src/ui/sheet.ts`, `tests/derive.test.ts`

**Estimated scope:** M

---

### - [ ] Task 7: Spells, bonds and class abilities

**Description:** Add level-1 spell lists (Cleric, Witch, Wizard), the 17 bonds, and short class ability summaries. Casters roll 2 distinct level-1 spells; everyone rolls a bond. Render a Bond line with a blank other-character field, a Spells box (casters only) and an Abilities list.

**Acceptance criteria:**
- [ ] Spell lists match pp. 82, 87, 93 (4 level-1 spells each); casters get 2 distinct spells from their own list; non-casters get none
- [ ] 17 bonds match pp. 63–64; one is rolled; the other-character name starts empty
- [ ] Abilities for all seven classes render; Spells box only for casters

**Verification:**
- [ ] Tests pass: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] Manual check: roll a Witch, a Warrior and a Wizard; check spells, bond and abilities

**Dependencies:** Task 4

**Files likely touched:** `src/data/spells.ts`, `src/data/bonds.ts`, `src/data/classes.ts`, `src/rules/generate.ts`, `src/ui/sheet.ts`

**Estimated scope:** M

---

### Checkpoint 2: Complete character
- [ ] Every field in SPEC.md › requirements renders after one click
- [ ] **Human reviews the gear classification in `src/data/gear.ts`**
- [ ] All tests pass, build succeeds

---

## Phase 3: Interaction

### - [ ] Task 8: Per-section re-roll and class change cascade

**Description:** Add a re-roll control to each rolled section (class, background, kit, characteristic, trait, name, attributes, bond, spells). Re-rolling one section leaves the others alone; changing class re-rolls background, kit, name, spells and attributes.

**Acceptance criteria:**
- [ ] `rerollSection(rng, character, section)` changes only that section (tested for every section)
- [ ] Changing class re-rolls exactly its dependents and keeps languages, bond and the bond's other-character name
- [ ] Each section has a visible, keyboard-reachable re-roll button with an accessible label

**Verification:**
- [ ] Tests pass: `npm test -- tests/generate.test.ts`
- [ ] Build succeeds: `npm run build`
- [ ] Manual check: re-roll each section in the browser; nothing else changes

**Dependencies:** Task 6, Task 7

**Files likely touched:** `src/rules/generate.ts`, `src/ui/controls.ts`, `src/ui/sheet.ts`, `src/main.ts`, `tests/generate.test.ts`

**Estimated scope:** M

---

### - [ ] Task 9: Manual edits and attribute swaps

**Description:** Let the player edit text fields (name, background, characteristic, trait, bond text, bond's other character, languages), choose a characteristic or trait from any class's table, and swap any two attribute values with HP and slots updating.

**Acceptance criteria:**
- [ ] `swapAttributes(character, a, b)` swaps any two values with no restriction; the result stays a permutation of 14/13/10/8/7 (tested for all pairs)
- [ ] Characteristic and trait pickers list every class's table plus free text
- [ ] Languages is an empty free-text field by default; edits survive re-rolls of other sections

**Verification:**
- [ ] Tests pass: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] Manual check: swap CON with another value; HP updates. Swap STR to 14; slot capacity updates

**Dependencies:** Task 8

**Files likely touched:** `src/rules/generate.ts`, `src/ui/controls.ts`, `src/ui/sheet.ts`, `tests/generate.test.ts`

**Estimated scope:** M

---

### Checkpoint 3: Interaction
- [ ] All four user stories in SPEC.md work in the browser
- [ ] All tests pass, build succeeds
- [ ] Review with human before proceeding

---

## Phase 4: Presentation and release

### - [ ] Task 10: Screen visual design and accessibility

**Description:** Apply the spec's visual design: near-black on off-white, one accent colour, bold display headings, dark mode, phone-friendly layout, WCAG AA.

**Acceptance criteria:**
- [ ] Colour tokens on `:root` with a dark-mode override; one accent colour only; all text pairs meet AA contrast
- [ ] Layout works at 360px with no horizontal scroll; touch targets ≥ 44px
- [ ] Visible focus styles; all controls keyboard-operable; semantic headings and labels

**Verification:**
- [ ] Build succeeds: `npm run build`
- [ ] Manual check: Chrome devtools at 360px, light and dark mode; tab through every control; contrast checked in devtools

**Dependencies:** Task 9

**Files likely touched:** `src/styles/main.css`, `index.html`, `src/ui/sheet.ts`

**Estimated scope:** S

---

### - [ ] Task 11: Print stylesheet

**Description:** Print the character on one page using the playtest-sheet layout in pure black and white, with spells and abilities on page 2 only if they don't fit.

**Acceptance criteria:**
- [ ] Page 1 has Name/Class/Level, Background/Deeds, Bond, attributes column, Languages, Characteristics/Traits, HP/Current, AV/Shield, Weapons, 18 inventory slots with 4 check boxes, Tiny items, Coins, Worn. Controls are hidden
- [ ] Black and white only; empty Languages and bond name print as blank lines
- [ ] The longest kit fits page 1 on both A4 and US Letter

**Verification:**
- [ ] Build succeeds: `npm run build`
- [ ] Manual check: print preview in Chrome and Firefox, A4 and Letter, for a Wizard (spells) and the Paladin kit with the most items

**Dependencies:** Task 10

**Files likely touched:** `src/styles/print.css`, `index.html`, `src/ui/sheet.ts`

**Estimated scope:** S

---

### - [ ] Task 12: Final verification against Success Criteria and deploy notes

**Description:** Walk through every Success Criteria item in SPEC.md, add coverage reporting, fix gaps, and add a short README covering running, testing and deploying.

**Acceptance criteria:**
- [ ] `npm test` reports 100% line coverage on `src/rules/` (via `@vitest/coverage-v8`, approved)
- [ ] `dist/` works when served from a sub-path (`npm run preview`, and a static server pointed at a nested folder)
- [ ] README has run / test / build steps and GitHub Pages + Netlify deploy notes; every Success Criteria box in SPEC.md is checked

**Verification:**
- [ ] Tests pass: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] Manual check: full roll → re-roll → edit → swap → print run in the built site

**Dependencies:** Task 11

**Files likely touched:** `package.json`, `vite.config.ts`, `README.md`, `SPEC.md`

**Estimated scope:** S

---

### Checkpoint 4: Complete
- [ ] All Success Criteria in SPEC.md met
- [ ] Ready for review
