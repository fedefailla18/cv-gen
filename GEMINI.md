# CV Generator (Vite + React + TypeScript + Tailwind)

A modern, interactive CV generator that allows users to edit their resume data in real-time using a JSON editor, select from multiple themes, reorder sections via drag-and-drop, and export the final result to a professional PDF.

## Project Overview

- **Environment:** Node.js (v22.22.2). A `.nvmrc` file is provided to manage the version.
- **Core Technologies:** React 18, TypeScript, Vite, Tailwind CSS.
- **State Management:** React Context API (`src/context/ResumeContext.tsx`) manages resume data, theme selection, and section ordering.
- **Key Libraries:**
  - `html2pdf.js`: Handles high-quality PDF generation from HTML elements.
  - `react-to-print`: Provides print preview functionality.
  - `react-json-editor-ajrm`: Integrated JSON editor for real-time resume updates.
  - `@hello-pangea/dnd`: Enables drag-and-drop reordering of CV sections.
- **Architecture:**
  - **Themes:** Extensible theme system located in `src/themes/`. Themes are functional components that receive resume data and render specific sections.
  - **Components:** Modular UI components in `src/components/` for editing, previewing, and managing CV sections.
  - **Data Source:** Initial resume data is loaded from `src/resume.json`, which follows a standard resume schema.

## Building and Running

### Development
```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```
The application will be available at `http://localhost:5173`.

### Production
```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

### Quality Assurance
```bash
# Lint the codebase
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code using Prettier
npm run format
```

## Development Conventions

- **Type Safety:** Use TypeScript for all components and utilities. Define clear interfaces in `src/types.d.ts` for resume data structures.
- **Styling:** Use Tailwind CSS utility classes for styling. Follow existing patterns for spacing and typography to maintain consistency across themes.
- **State Management:** Access and update resume state through the `useResumeContext` hook. Avoid local state for data that needs to persist across mode switches (Edit/Preview).
- **Theme Development:**
  - When creating a new theme, add it to `src/themes/` and register it in `src/themes/index.tsx`.
  - Themes should be responsive and handle varying amounts of content gracefully.
  - Use the `.page-break-before`, `.page-break-after`, and `.page-break-avoid` classes (or similar logic in `pdfExport.tsx`) to control PDF pagination.
- **Linting & Formatting:** Adhere to the ESLint v9 flat configuration (`eslint.config.js`) and Prettier settings defined in `.prettier.json`.
- **Component Patterns:** Prefer functional components and hooks. Use modular components for UI elements to keep `App.tsx` and main theme files clean.

## Interviewer Feedback (Custom Skill)

This project includes a specialized **Senior Backend Engineering Interviewer** skill for generating structured interview feedback.

- **Skill Definition:** Located in `.gemini/skills/senior-interviewer/SKILL.md`.
- **Interviews Folder:** Use the `interviews/` directory to store candidate notes and generated reports.
- **Activation:** The skill is automatically suggested when interview-related notes or prompts are provided. It evaluates candidates based on production maturity, architectural reasoning, and technical depth (JVM, Distributed Systems, Concurrency, etc.).
- **Workflow:**
    1. Save interview notes in `interviews/<candidate-name>/notes.md`.
    2. Prompt the AI: "Generate feedback for the notes in `interviews/<candidate-name>/notes.md`."
    3. The AI will act as the defined Senior Interviewer role to provide a technical, concise, and calibrated evaluation.

## Interviews Dashboard (Web UI)

The application includes an **Interviews Dashboard** that provides a visual interface for managing hiring pipelines and candidate technical evaluations.

- **Compact UI Design:** To handle high-volume candidate lists, the dashboard uses a horizontal "Compact Card" layout that summarizes core metadata (Name, Date, Status) and a Mini-Scorecard.
- **Dynamic Reveal Pattern:** To minimize cognitive load, the dashboard follows a "Progressive Disclosure" pattern. Technical feedback and raw notes are hidden by default and revealed only on-demand.
- **Notes Editor:** A built-in Markdown editor allows interviewers to refine raw candidate notes directly in the web app. Changes are synchronized to the local application state.
- **Smooth Navigation:** Upon revealing feedback or opening the editor, the UI automatically smooth-scrolls to the target section.

### Integration Roadmap

- **Model Context Protocol (MCP):** Future support for connecting Gemini directly to Jira backlogs and Google Sheets via MCP servers, allowing for automated data ingestion.
- **Automation Scripts:** Planned Node.js scripts to synchronize evaluation reports with team spreadsheets and project management tools.

### BDD Scenarios (Behavior-Driven Development)

**Feature: Interviewee Feedback & Notes Management**
*As an Interviewer, I want to manage interviewee data and technical evaluations on a single page, so that I can maintain a high-quality hiring pipeline without losing context.*

**Scenario: On-Demand Dynamic Reveal (Feedback)**
- **Given** I am on the Interviews Dashboard
- **And** I have selected a specific job opening
- **When** I click the "View Feedback" button for a candidate
- **Then** the AI-calibrated technical evaluation should be dynamically injected below the candidate row
- **And** the page should smoothly scroll to the beginning of the feedback section.

**Scenario: On-Demand Dynamic Reveal (Notes Editor)**
- **Given** I am on the Interviews Dashboard
- **When** I click the "Edit Notes" (pencil) icon for a candidate
- **Then** a Markdown editor should be dynamically injected below the candidate row
- **And** the page should smoothly scroll to the editor.
- **And** clicking "Save" should persist the changes to the local session.
