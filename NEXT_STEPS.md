# Project State & Integration Roadmap

## Current State: Interview Feedback System
The `feature/interview-feedback-system` branch is fully operational and documented. The project has evolved from a simple CV Generator into a **Technical Calibration Workspace**.

### 1. Core Capabilities
- **Expert AI Calibration:** A specialized skill (`.gemini/skills/senior-interviewer/`) that evaluates candidates against high-level production standards (JVM, Distributed Systems, Concurrency).
- **Standardized Storage:** A file-based database in `interviews/` with YAML frontmatter, ensuring all data is machine-readable and ready for future integration.
- **Modern Dashboard:** A React-based UI in the "Interviews" tab featuring:
    - **Compact Mode:** High-density list for browsing many candidates.
    - **Notes Editor:** Real-time Markdown editing of raw interview data.
    - **Progressive Disclosure:** On-demand reveal of technical feedback with smooth-scrolling.

### 2. Documentation
- **`GEMINI.md`**: Updated with technical architecture, BDD scenarios, and usage workflows.
- **`interviews/README.md`**: Detailed guide on how to add candidates and jobs manually.

---

## Roadmap: What's Next?

### Phase 1: External Integration (The "Connector" Phase)
The goal is to eliminate manual copy-pasting between Google Sheets, Jira, and this app.

1.  **Model Context Protocol (MCP) Integration:**
    - **Google Sheets MCP:** Connect Gemini to your "Java Evaluation Form" spreadsheet.
    - **Jira MCP:** Connect Gemini to your team's Jira project to pull job descriptions and push feedback reports as comments.
2.  **Automation Scripts:**
    - Create `scripts/sync-sheets.ts` to pull new interview rows and automatically generate `interviews/candidates/<name>/notes.md`.
    - Create `scripts/push-to-jira.ts` to upload the final `feedback.md` to specific Jira tickets.

### Phase 2: UI & UX Enhancements
1.  **Advanced Filtering:** Filter candidates by Job ID, Status, or Average Score.
2.  **Markdown Preview:** Add a toggle in the Notes Editor to see a rendered preview of the Markdown while editing.
3.  **Export Dashboard:** Capability to export the entire "Candidate Card" (Scores + Feedback) as a single PDF for sharing with clients.

### Phase 3: Dynamic Data Layer
- Transition from the mock `interviewData.ts` to a dynamic data loader that reads the `interviews/` folder directly (using Vite's `import.meta.glob`).

---

## Next Steps for the User
1.  **Review `GEMINI.md`**: Ensure the BDD scenarios match your expectations.
2.  **Test the Dashboard**: Verify that the "Notes Editor" and "Feedback Reveal" work smoothly with your latest candidates (Ruben, Dardo, Greti).
3.  **Integration Prep**: If you want to start Phase 1 (MCP), let me know which tool (Jira or Google Sheets) is the priority.
