# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

A dual-purpose Vite + React + TypeScript + Tailwind app: an interactive CV/resume builder with PDF export, and an Interview Management System (Technical Calibration Hub) for running a hiring pipeline with local disk persistence.

## Commands

```bash
pnpm install       # Install dependencies
pnpm run dev       # Dev server at http://localhost:5173
pnpm run build     # Production build (Vite)
pnpm run preview   # Preview the production build
pnpm run lint      # ESLint (flat config, eslint.config.js)
pnpm run lint:fix  # Auto-fix lint issues
pnpm run format    # Prettier
```

Node version is pinned via `.nvmrc` (v22.22.2).

## Architecture

- **State Management:** React Context API (`src/context/ResumeContext.tsx`) holds resume data, theme selection, and section ordering.
- **Themes:** Extensible theme system in `src/themes/` — functional components that receive resume data and render specific sections. Register new themes in `src/themes/index.tsx`.
- **CV data:** Initial resume data loads from `src/resume.json`, typed via `src/types.d.ts`.
- **PDF export:** `html2pdf.js` + `react-to-print`; pagination controlled via `.page-break-before` / `.page-break-after` / `.page-break-avoid` classes and logic in `pdfExport.tsx`.
- **Interviews:** `InterviewsDashboard` component manages candidates and jobs; data persists directly to the local `interviews/` directory via the Vite dev server API (no backend/DB). Candidate CSV scores are ingested with a Smart CSV Importer that parses rows copied from a Google Sheets evaluation form.

## Senior Interviewer Skill

This project defines a specialized "Senior Backend Engineering Interviewer" persona for generating structured, calibrated interview feedback (production maturity, architectural reasoning, JVM/concurrency/distributed-systems depth, etc.), not generic HR-style feedback.

- Skill definition: `.claude/skills/senior-interviewer/SKILL.md` (mirrored for Gemini at `.gemini/skills/senior-interviewer/SKILL.md` — keep both in sync if the persona changes).
- Workflow: save interview notes at `interviews/<candidate-name>/notes.md`, then ask Claude to generate feedback from that file.

## Development Conventions

- TypeScript everywhere; define resume/interview data shapes in `src/types.d.ts`.
- Tailwind utility classes for styling; follow existing spacing/typography patterns across themes.
- Access resume state only through `useResumeContext` — don't hold resume data in local component state across Edit/Preview mode switches.
- ESLint v9 flat config only — do not add a legacy `.eslintrc.*`.
