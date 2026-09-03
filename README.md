# Interview Hub & CV Generator (Vite + React + TypeScript + Tailwind)

A dual-purpose tool for high-standard technical interviews and interactive resume generation.

## Features

### 1. Interview Management System
- **Technical Calibration Hub:** Manage your hiring pipeline with a dedicated dashboard.
- **AI-Generated Feedback:** Integrated with a specialized "Senior Backend Interviewer" persona for calibrated evaluation.
- **Smart CSV Importer:** Quickly ingest scores and notes from Google Sheets evaluation forms.
- **Local Persistence:** All data (candidates, jobs, notes) is saved directly to your local `interviews/` directory.

### 2. Interactive CV Generator
- **Real-time Preview:** Edit your `src/resume.json` or use the built-in editor to see changes instantly.
- **Theme Selection:** Choose from multiple professional themes (Modern, Minimal, Compact, Two-Column).
- **Drag-and-Drop:** Reorder CV sections with ease.
- **PDF Export:** High-quality PDF generation with proper pagination.

## Setup

1. Install dependencies

```bash
pnpm install
```

2. Run dev server

```bash
pnpm run dev
```

3. Open http://localhost:5173

- Use the **"Interviews"** tab for technical evaluations.
- Use the **"Edit Mode"** or **"Preview Only"** tabs for resume management.

## Workflow: Technical Interviews

1. **Add Candidate:** Use the Interviews Dashboard to create a new candidate record.
2. **Import Scores:** Copy rows from your evaluation spreadsheet and use the ⚡ button to instantly populate scores.
3. **Calibrate:** Use the specialized AI skill to generate a technical feedback report based on the candidate's notes.
4. **Refine:** Edit notes directly in the app to capture nuances from the interview.

## Linting & Formatting

This project uses ESLint v9 with the new flat config (`eslint.config.js`) and Prettier.

- Run lint:
```bash 
  pnpm run lint
```

- Auto-fix lint issues:
```bash 
  pnpm run lint:fix  
``` 

- Format all source files:
```bash
  pnpm run format
```

If you add or change lint rules, edit `eslint.config.js`. The legacy `.eslintrc.*` format is not used with ESLint v9.

## AI Assistant Documentation

This project ships instructions for both AI coding assistants used in this workspace:

- **`CLAUDE.md`** — architecture, conventions, and commands for Claude Code.
- **`GEMINI.md`** — the same context, tailored for Gemini.
- **Senior Interviewer skill** — a specialized "Senior Backend Engineering Interviewer" persona for calibrated candidate feedback, available to both assistants:
  - Claude Code: `.claude/skills/senior-interviewer/SKILL.md`
  - Gemini: `.gemini/skills/senior-interviewer/SKILL.md`

Save interview notes under `interviews/<candidate-name>/notes.md`, then ask either assistant to generate feedback from that file.

