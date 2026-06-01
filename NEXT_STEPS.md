# Project State & Integration Roadmap

## Current State: Technical Calibration Hub
The project has successfully transitioned from a simple CV Generator into a full-featured **Interview Management System** with local disk persistence.

### 1. Core Capabilities
- **Expert AI Calibration:** Specialized persona for high-standard backend engineering evaluation.
- **Full Data Persistence:** Every change (CVs, Notes, Jobs) is saved directly to the file system via the Vite Dev Server API.
- **Automated Workflow:**
    - **Creation Hub:** Add candidates and jobs directly from the UI.
    - **Smart CSV Importer:** Copy rows from the Google Sheet Evaluation form and paste them into the app to instantly populate technical scores.
- **Modern Dashboard:** Compact, high-density UI with progressive disclosure and smooth navigation.

### 2. Documentation
- **`GEMINI.md`**: Technical architecture, BDD scenarios, and feature overview.
- **`interviews/README.md`**: Guide for candidate and job data management.

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
