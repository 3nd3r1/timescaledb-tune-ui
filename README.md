# TimescaleDB Tuner UI

<div align="center">
  <img src="public/logo-nobg-dark.svg" alt="TimescaleDB Tuner UI" width="200" height="auto">
</div>

Web interface for [timescaledb-tune](https://github.com/timescale/timescaledb-tune). Input your system specs, get optimized TimescaleDB config.

## Features

- Web UI for timescaledb-tune CLI
- Shows config recommendations with explanations
- Docker support
- Works on mobile

## Setup

Docker (recommended):
```bash
git clone https://github.com/your-username/timescaledb-tuner-ui.git
cd timescaledb-tuner-ui
npm run docker:dev
```

Local:
```bash
npm install
npm run dev
```

Open http://localhost:3000

## Tech

- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui

## Thanks

Built using [timescaledb-tune](https://github.com/timescale/timescaledb-tune) by the Timescale team.

## License

Apache-2.0
