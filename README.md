# TheBoardgameApp — Frontend

A React 19 + TypeScript application for boardgame collection management, trading, and community.

## Tech Stack

- **Framework:** React 19, React Router 7
- **Build tool:** Vite 6
- **Language:** TypeScript 5 (strict mode)
- **UI:** Material UI 7, Bootstrap 5, Reactstrap
- **Forms:** Formik + Yup
- **Real-time:** Socket.io-client
- **Animations:** GSAP, in-view
- **Calendar:** react-big-calendar

## Getting Started

### Prerequisites

- Node.js 18+ (or 20 LTS recommended)
- pnpm (preferred) or npm

### Install dependencies

```bash
pnpm install
```

### Environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

See `.env.example` for all required variables.

### Run development server

```bash
pnpm run start
```

Runs on [http://localhost:5173](http://localhost:5173) by default.

### Build for production

```bash
pnpm run build
```

Output goes to the `dist/` folder.

### Type checking

```bash
pnpm run type-check
```

### Run tests

```bash
pnpm test
```

### Deploy to GitHub Pages

```bash
pnpm run deploy
```

## MSRP Prices

Prices are obtained from the [BoardGameAtlas API](https://www.boardgameatlas.com/api/docs).
