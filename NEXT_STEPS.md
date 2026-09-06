# Project State & Integration Roadmap

## Current State: Technical Calibration Hub + CV Design System
The project has transitioned from a simple CV Generator into a full-featured **Interview Management System** with local disk persistence, and now also has a dedicated **CV Design System** (content spec + rendering skill + reference theme).

### 1. Core Capabilities
- **Expert AI Calibration:** Specialized persona for high-standard backend engineering evaluation.
- **Full Data Persistence:** Every change (CVs, Notes, Jobs) is saved directly to the file system via the Vite Dev Server API.
- **Automated Workflow:**
    - **Creation Hub:** Add candidates and jobs directly from the UI.
    - **Smart CSV Importer:** Copy rows from the Google Sheet Evaluation form and paste them into the app to instantly populate technical scores.
- **Modern Dashboard:** Compact, high-density UI with progressive disclosure and smooth navigation.
- **Engineering (Senior) Theme:** Reference CV theme built from `upgrade.md` (content spec) + the `master-fe-requirement-cv-template-translator` skill (rendering spec) — shared components in `src/themes/shared/`, flexible `technologies`/`domains` handling in `cvRenderHelpers.ts`.

### 2. Documentation
- **`CLAUDE.md`**: Architecture, conventions, and commands for Claude Code.
- **`GEMINI.md`**: Technical architecture, BDD scenarios, and feature overview (same context, tailored for Gemini).
- **`upgrade.md`**: CV content-writing spec (tone, prioritization, seniority signal).
- **`interviews/README.md`**: Guide for candidate and job data management — clarifies that `interviews/jobs/` are the roles *you* are hiring for, not your own job search.

### 3. Known Pending Work
- **Legacy theme refactor:** Modern/Minimal/Compact/Two-Column still duplicate markup instead of using the shared components Engineering introduced — migrate incrementally.
- **`tsconfig.json` has `noEmit: true`** — do not remove it. A bare `tsc` run once emitted compiled `.js` files into `src/` alongside the real sources, which silently shadowed them in both dev and prod (Vite resolves `.js` before `.tsx`/`.ts` for extensionless imports). Never commit a `.js` file under `src/` with a `.ts`/`.tsx` twin.

---

## Roadmap: What's Next?

### Phase 1: External Automation (MCP)
1.  **Google Sheets MCP:** Connect Gemini to the "Java Evaluation Form" spreadsheet to automate the initial data ingestion.
2.  **Jira MCP:** Pull requirements directly from tickets and post calibration reports as comments.

### Phase 2: Advanced Dashboard
1.  **Search & Filter:** Real-time search by name and filtering by score thresholds or status.
2.  **Multi-Candidate Comparison:** A "Compare" mode to see technical scores of 2-3 candidates side-by-side.
3.  **Client-Ready Export:** Export the entire calibration summary as a professional PDF for sharing with hiring managers.

---

## Next Steps for the User
1.  **Try the CSV Importer:** Open the "Add Candidate" form, copy some rows from your Google Sheet, and use the ⚡ button to see it in action.
2.  **Verify Disk Persistence:** Edit a note, refresh the page, and check the file in your `interviews/` folder.
3.  **Select Integration Priority:** Are we focusing on **Jira** or **Google Sheets** for the next automation step?
