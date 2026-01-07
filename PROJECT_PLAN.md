# TimescaleDB Tuner UI - Project Plan

## 🎯 Project Overview

Create a web-based UI for the existing [timescaledb-tune](https://github.com/timescale/timescaledb-tune) CLI tool, similar to [PGTune](https://pgtune.leopard.in.ua/) but specifically for TimescaleDB optimization.

**Based on datakolo project structure and quality standards.**

## 🛠️ Technology Stack (Matching Datakolo)

### Frontend
- **Next.js** (Latest App Router) - Full-stack React framework
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Radix UI** + **shadcn/ui** - High-quality, accessible React components
- **React Hook Form** - Performant form handling with validation
- **Zod** - TypeScript-first schema validation
- **Framer Motion** - Animations and transitions

### Development Tools (Matching Datakolo)
- **ESLint** + **Prettier** - Code formatting and linting
- **Vitest** - Unit testing framework
- **Testing Library** - Component testing utilities
- **PostCSS** - CSS processing

### Backend/Integration
- **Node.js** API routes (built into Next.js)
- **Child process** execution for timescaledb-tune CLI integration
- **File system** handling for configuration file management

### Deployment & DevOps (Coolify Compatible)
- **Docker** containerization (Alpine-based like datakolo)
- **Docker Compose** for local development
- **Makefile** for development commands
- **Self-hosted** on Coolify platform

## 📊 Core Features

### 1. System Configuration Input
- **Memory allocation**: Slider with manual input (GB/MB)
- **CPU cores**: Number selector
- **Database profile**: Dropdown (default, promscale)
- **Background workers**: Number input
- **WAL disk size**: Size input with units
- **Config file path**: File browser/upload option

### 2. Tuning Recommendations
- **Side-by-side comparison**: Current vs Recommended settings
- **Setting explanations**: Tooltip descriptions for each parameter
- **Impact indicators**: Visual indicators showing expected performance impact
- **Category grouping**: Memory, CPU, I/O, etc.

### 3. Configuration Management
- **Preview mode**: Show recommendations before applying
- **Export options**: Download as .conf file or copy to clipboard
- **Backup creation**: Automatic backup before applying changes
- **Validation**: Check for conflicts or invalid values

### 4. User Experience
- **Responsive design**: Mobile and desktop friendly
- **Progress indicators**: Show tuning process steps
- **Error handling**: Clear error messages and recovery options
- **Performance tips**: Educational content about each setting

## 🏗️ Project Structure (Matching Datakolo)

```
timescaledb-tuner-ui/
├── src/
│   ├── app/                 # Next.js app router pages and layouts
│   ├── components/          # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities and helpers
│   ├── validators/         # Zod validation schemas
│   └── middleware.ts       # Next.js middleware
├── public/                 # Static assets
├── docker-compose.yml      # Development environment
├── Dockerfile              # Production container
├── Makefile               # Development commands
├── package.json           # Dependencies and scripts
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
├── vitest.config.ts       # Testing configuration
└── .eslintrc.json         # ESLint configuration
```

### Component Organization (shadcn/ui + Radix UI)
```
src/components/
├── ui/                    # shadcn/ui base components
│   ├── button.tsx
│   ├── form.tsx
│   ├── input.tsx
│   └── ...
├── forms/                 # Form-specific components
│   ├── tuner-form.tsx
│   └── system-detection.tsx
├── display/              # Result display components
│   ├── recommendation-panel.tsx
│   └── config-preview.tsx
└── layout/               # Layout components
    ├── header.tsx
    └── footer.tsx
```

## 🎨 UI Design Approach

### Layout
- **Single-page application** with tabbed sections
- **Left sidebar**: Configuration inputs
- **Right panel**: Recommendations and preview
- **Bottom section**: Actions (apply, export, reset)

### Design System
- **Clean, professional** aesthetic similar to PGTune
- **Accessible** color scheme with proper contrast
- **Consistent spacing** using Tailwind's scale
- **Interactive elements** with hover and focus states

### Components
- `TunerForm` - Main configuration form
- `RecommendationDisplay` - Results panel
- `ConfigPreview` - Side-by-side comparison
- `SystemDetection` - Auto-detect system resources
- `FileManager` - Config file handling

## 🔧 Implementation Phases

### Phase 1: Foundation & Setup
- [ ] Initialize Next.js project with latest dependencies matching datakolo structure
- [ ] Configure Tailwind CSS, PostCSS, and TypeScript
- [ ] Set up shadcn/ui components and Radix UI
- [ ] Create Docker setup (Dockerfile + docker-compose.yml)
- [ ] Configure Makefile for development commands
- [ ] Set up ESLint, Prettier, and Vitest testing

### Phase 2: Core Application Structure
- [ ] Create base component structure matching datakolo
- [ ] Implement form validation with Zod schemas
- [ ] Set up React Hook Form integration
- [ ] Create system detection hooks
- [ ] Build basic layout and routing

### Phase 3: TimescaleDB Integration
- [ ] Create API routes for timescaledb-tune CLI integration
- [ ] Implement configuration parsing and generation
- [ ] Add file upload/download functionality
- [ ] Error handling and validation
- [ ] System resource detection

### Phase 4: UI Polish & Testing
- [ ] Implement Framer Motion animations
- [ ] Responsive design implementation
- [ ] Add comprehensive test coverage with Vitest
- [ ] Performance optimizations
- [ ] Documentation and deployment guides

## 🔌 Integration Strategy

### TimescaleDB-Tune CLI Integration
```javascript
// API route: /api/tune
const { spawn } = require('child_process');

function runTuner(options) {
  const args = [
    '--dry-run',
    '--memory', options.memory,
    '--cpus', options.cpus,
    // ... other options
  ];
  
  return spawn('timescaledb-tune', args);
}
```

### Configuration Flow
1. User inputs system specifications
2. Frontend validates inputs with Zod schemas
3. API calls timescaledb-tune with formatted parameters
4. Parse CLI output and format for UI display
5. Present recommendations with explanations

## 📝 Key Considerations

### Security
- Input sanitization for all form data
- File upload restrictions and validation
- Sandboxed execution of CLI commands

### Performance
- Client-side validation to reduce API calls
- Debounced inputs for real-time updates
- Optimized bundle size with tree shaking

### User Experience
- Progressive disclosure for advanced options
- Helpful tooltips and documentation links
- Keyboard navigation support
- Loading states and progress indicators

### Extensibility
- Plugin architecture for custom tuning profiles
- API endpoints for programmatic access
- Configuration templates for common setups

## 🎯 Success Metrics

- **Usability**: Easy configuration in <5 minutes
- **Accuracy**: Matches CLI tool output exactly
- **Performance**: Page loads in <2 seconds
- **Accessibility**: WCAG 2.1 AA compliance
- **Mobile**: Fully functional on mobile devices

## 🚀 Development Commands (Datakolo Style)

### Makefile Commands
```makefile
dev:
	docker compose up frontend

build:
	docker compose build frontend

down:
	docker compose down

test:
	docker compose exec frontend npm run test

lint:
	docker compose exec frontend npm run lint
```

### Package.json Scripts (Matching Datakolo)
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint && npx prettier --check .",
    "lint:fix": "next lint --fix && npx prettier --write .",
    "test": "vitest run",
    "test:watch": "vitest",
    "coverage": "vitest run --coverage",
    "type-check": "tsc --noEmit"
  }
}
```

## 🐳 Docker Setup (Coolify Compatible)

### Dockerfile (Alpine-based like datakolo)
```dockerfile
FROM node:alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:alpine AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
USER nextjs
EXPOSE 3000
CMD ["npm", "start"]
```

### Docker Compose (Development)
```yaml
services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules
    command: npm run dev
```

## 🚀 Deployment Strategy (Coolify)

- **Development**: `make dev` - Docker Compose with hot reload
- **Production**: Coolify deployment with Docker container
- **CI/CD**: Automated builds on git push
- **Environment**: Environment variables via Coolify dashboard
- **Monitoring**: Built-in Coolify logging and metrics

This plan exactly matches your datakolo project structure and quality standards, ensuring consistency across your projects while targeting Coolify for deployment.