# Barrows & Banshees Character Generator

A static website that rolls level-1 characters for *Barrows and Banshees* (v0.17) and prints them on a one-page sheet. Everything runs in the browser; there is no backend.

- Roll a random character, or pick a class.
- Re-roll any section on its own (class, name, background, characteristic, trait, attributes, kit, bond, spells).
- Edit any text by hand, swap any two attributes, and fill in languages and the bond's other character.
- Print a sheet laid out like the playtest Character Sheet 1.2, with a "Capacity" line on the inventory.
- Switch between light and dark themes with the "Dark mode" button; the site remembers your choice.

The rules it implements, and the decisions behind them, are in [SPEC.md](SPEC.md).

## Requirements

- Node 26 (pinned in `.nvmrc`; with nvm, run `nvm use`)

## Commands

```bash
npm install        # install dependencies
npm run dev        # local dev server at http://localhost:5173/
npm test           # unit tests with coverage (100% of src/rules/ lines required)
npm run typecheck  # TypeScript check only
npm run build      # type-check, then build the static site into dist/
npm run preview    # serve dist/ locally
```

## Project layout

```
index.html          the single page
src/data/           rules data only: classes, gear and kits, spells, bonds (with rulebook page citations)
src/rules/          pure functions: dice, character generation, derived values (fully unit-tested)
src/ui/             DOM rendering: the on-screen sheet, controls, and the print-only sheet
src/styles/         main.css (screen), print.css (print)
tests/              Vitest unit tests
```

Rules logic never touches the DOM or `Math.random()` directly: randomness is injected, so tests use a seeded generator.

## Deploying

`npm run build` produces a self-contained `dist/` folder with relative asset paths, so it works from any static host, at the domain root or in a sub-folder.

### GitHub Pages

The site is published at https://gilles-leblanc.github.io/barrowlings/.

`.github/workflows/deploy.yml` runs on every push to `main`: it installs dependencies, runs the tests, builds, and deploys `dist/` to GitHub Pages. A failing test stops the deploy. To publish a change, commit and push to `main`; you can also re-run it by hand from the repository's **Actions** tab.

### Netlify or Cloudflare Pages

Connect the repository and set:

- Build command: `npm run build`
- Publish / output directory: `dist`
- Node version: 26 (Netlify reads `.nvmrc`; on Cloudflare Pages set `NODE_VERSION=26`)

You can also drag and drop the `dist/` folder into Netlify's deploy page.

## Notes

- Fonts (Archivo Black, Source Serif 4) load from Google Fonts. Without a connection, the page falls back to system fonts.
- The rulebook PDFs are not committed (`*.pdf` is in `.gitignore`); the cover art is licensed and not part of this site.
