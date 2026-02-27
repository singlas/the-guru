# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**The Guru** is an interactive React card game that combines Bhagavad Gita wisdom with modern life dilemmas. Players (3-8) take turns as "Seekers" presenting scenarios while others respond as "Wise Gurus" using wisdom cards.

## Commands

```bash
npm install      # Install dependencies
npm run dev      # Start dev server (Vite)
npm run build    # Production build
npm run preview  # Preview production build
```

## Architecture

```
src/
├── data/
│   ├── scenarios.js    # 136 scenario cards with categories and difficulty
│   ├── wisdom.js       # 80 Bhagavad Gita verses
│   └── categories.js   # Category config (colors, icons, patterns)
├── components/
│   ├── Patterns.jsx    # SVG patterns (GeometricPattern, WisdomPattern, Mandala)
│   ├── Button.jsx      # Reusable button component
│   └── Rules.jsx       # 4-page onboarding flow
├── utils/
│   └── helpers.js      # Shuffle, draw, storage utilities
├── App.jsx             # Main app with game state and screens
├── main.jsx            # Entry point
└── index.css           # Tailwind setup
```

### Game Phases (state machine)
`roundStart` → `passing` → `guruTurn` → `reflect` → `seekerPick` → `scoreUpdate`

### Storage
- `localStorage["guru_history"]`: Last 20 game results
- `localStorage["guru_rules_seen"]`: Boolean for first-run detection

## Tech Stack
- React 18 with Vite
- Tailwind CSS
- Inline SVG graphics
- Vercel deployment

## Remote
`git@github.com:singlas/the-guru.git`
