# RaidCalculate

**RaidCalculate** is a web application built with **React** and **TypeScript**. It provides several utilities for the online game _Lost Ark_, including a weekly raid gold calculator, jewel matching tools and a bracelet option simulator. A lightweight **Node.js/Express** backend bridges the official game APIs and handles Firestore updates.

## Features

- **Weekly Raid Calculator** – manage multiple characters in tabbed views, track gold rewards and materials, and persist state in `localStorage` using React context.
- **Jewel Friend Matching** – compare gem setups between characters to find optimal trades.
- **Bracelet Simulator** – generate bracelet options via a probability based algorithm (`GachaGenerator.ts`).
- **Package / Craft Calculators** – fetch real-time market prices through the Node server for profit analysis.
- **Scheduling Tools** – (WIP) Firebase Firestore integration for raid event coordination.

## Tech Highlights

- **React + TypeScript** front‑end with `styled-components` for themeable and responsive UI.
- **Node.js/Express** server (`api/server.js`) that proxies Lost Ark APIs, calculates crafting profit and updates Firestore.
- Weighted random option generation in [`src/utils/GachaGenerator.ts`](src/utils/GachaGenerator.ts) for accurate bracelet odds.
- Global layout and tab data managed via custom React Context providers (`LayoutProvider`, `GoldCalcContext`).
- Extensive responsive styling and animations (e.g. sliding menu panels and accordions) for smooth mobile and desktop experience.

## Development

```bash
npm install
npm start
```

The dev server runs on `localhost:3000` and proxies API requests to `localhost:5000`.

Tests can be executed with:

```bash
npm test
```

(Dependencies must be installed beforehand.)

## Deployment

The project is configured for static deployment. Running `npm run build` creates a production build in the `build/` folder.

---

This repository demonstrates React state management, API integration and UI optimization techniques for an interactive game utility.
