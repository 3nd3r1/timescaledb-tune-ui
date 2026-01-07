# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TimescaleDB Tuner UI is a web-based interface for the [timescaledb-tune](https://github.com/timescale/timescaledb-tune) CLI tool. It provides a user-friendly way to optimize TimescaleDB configuration based on system resources, similar to PGTune but specifically for TimescaleDB.

## Development Commands

```bash
# Development
npm run dev                 # Start Next.js development server
npm run docker:dev          # Start with Docker Compose

# Testing
npm run test               # Run all tests
npm run test:watch         # Run tests in watch mode
npm run coverage           # Run tests with coverage

# Code Quality
npm run lint               # Run ESLint and check Prettier formatting
npm run lint:fix           # Auto-fix ESLint issues only
npm run format             # Format code with Prettier
npm run type-check         # TypeScript type checking

# Production
npm run build              # Build for production
npm run start              # Start production server

# Docker
npm run docker:build       # Build Docker image
npm run docker:down        # Stop Docker containers
```

## Architecture

### Technology Stack

- **Next.js 15** with App Router and React 19
- **TypeScript** for type safety
- **Tailwind CSS** + **shadcn/ui** + **Radix UI** for styling and components
- **React Hook Form** + **Zod** for form handling and validation
- **Vitest** + **Testing Library** for testing
- **Framer Motion** for animations

### Project Structure

```
src/
├── app/                    # Next.js App Router pages and layouts
├── components/             # React components (to be organized as):
│   ├── ui/                # shadcn/ui base components
│   ├── forms/             # Form-specific components
│   ├── display/           # Result display components
│   └── layout/            # Layout components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and helpers
├── validators/            # Zod validation schemas
└── middleware.ts          # Next.js middleware
```

### Key Integration Points

**TimescaleDB CLI Integration**: The core functionality involves calling the `timescaledb-tune` CLI tool via Node.js child processes in API routes. The CLI accepts parameters like:

- `--memory`: System memory allocation
- `--cpus`: Number of CPU cores
- `--profile`: Tuning profile (default, promscale)
- `--dry-run`: Preview mode without applying changes

**Form Validation Flow**:

1. User inputs system specifications via React Hook Form
2. Zod schemas validate inputs client-side
3. API routes process inputs and call timescaledb-tune CLI
4. Results are parsed and displayed with explanations

### Environment Setup

This project uses Nix for reproducible development environments:

```bash
# With direnv (automatic)
cd timescaledb-tuner-ui

# Or manually
nix-shell
```

### Component Development

**shadcn/ui Integration**: Use `components.json` for shadcn/ui configuration. Components are configured with:

- Tailwind CSS variables for theming
- RSC (React Server Components) enabled
- TypeScript support
- Path aliases: `@/components` and `@/lib/utils`

**Form Components**: Build around React Hook Form + Zod pattern. Expected form components include:

- System resource inputs (memory, CPU, disk)
- Configuration file upload/download
- Tuning profile selection
- Real-time validation feedback

### Testing Strategy

- **Vitest** configured with jsdom environment
- **Testing Library** for component testing
- Test setup in `src/test/setup.ts`
- Coverage reporting available via `npm run coverage`

### Deployment

**Docker**: Multi-stage Alpine-based Dockerfile for production builds. Docker Compose provided for local development with hot reload.

**Coolify**: Designed for self-hosted deployment on Coolify platform with environment variable configuration.

### Code Style

- **ESLint** + **Prettier** configured for consistent formatting
- TypeScript strict mode enabled
- Tailwind CSS for styling with CSS variables for theming
- No trailing semicolons, single quotes, 2-space indentation
