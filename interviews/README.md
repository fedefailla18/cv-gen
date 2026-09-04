# Interview Feedback Workflow

This folder tracks the interviews **you conduct as an interviewer** — candidates you evaluate for open roles — not your own job search. `interviews/jobs/` holds the job descriptions of the positions you're hiring for; `interviews/candidates/` holds the people you interviewed against those positions.

To maintain high standards and enable future dynamic integration into the web app, use the following standardized structure.

## Directory Structure

```text
interviews/
├── jobs/               # Open positions you're hiring for (the JD candidates are evaluated against)
│   └── senior-java-developer.md
├── candidates/         # Candidates you interviewed for those positions
│   └── greti/
│       ├── notes.md    # Standardized notes (with YAML frontmatter)
│       └── feedback.md # Generated outcome
└── templates/          # Templates for reuse
    ├── job-description.md
    └── interview-notes.md
```

## Step-by-Step Guide

1.  **Define the Job:** If you're hiring for a new role, create a file in `interviews/jobs/` describing that open position.
2.  **Add Candidate Notes:** 
    - Create `interviews/candidates/<name>/notes.md`.
    - Use YAML frontmatter for metadata (date, interviewer, status).
    - Use the structured assessment format.
3.  **Generate Feedback:**
    - Ask Gemini: *"Using the senior-interviewer skill, generate feedback for interviews/candidates/greti/notes.md based on the JD in interviews/jobs/senior-java-developer.md"*
4.  **Save Outcome:** Save the response as `interviews/candidates/<name>/feedback.md`.

## Data for Web Integration
The YAML frontmatter and structured headers allow future automated tools to parse this folder and display candidates in the "CV Generator" dashboard.
