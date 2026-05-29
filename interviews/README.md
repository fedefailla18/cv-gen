# Interview Feedback Workflow

To maintain high standards and enable future dynamic integration into the web app, use the following standardized structure.

## Directory Structure

```text
interviews/
├── jobs/               # Job Descriptions
│   └── senior-java-developer.md
├── candidates/         # Candidate Data
│   └── greti/
│       ├── notes.md    # Standardized notes (with YAML frontmatter)
│       └── feedback.md # Generated outcome
└── templates/          # Templates for reuse
    ├── job-description.md
    └── interview-notes.md
```

## Step-by-Step Guide

1.  **Define the Job:** If it's a new role, create a file in `interviews/jobs/`.
2.  **Add Candidate Notes:** 
    - Create `interviews/candidates/<name>/notes.md`.
    - Use YAML frontmatter for metadata (date, interviewer, status).
    - Use the structured assessment format.
3.  **Generate Feedback:**
    - Ask Gemini: *"Using the senior-interviewer skill, generate feedback for interviews/candidates/greti/notes.md based on the JD in interviews/jobs/senior-java-developer.md"*
4.  **Save Outcome:** Save the response as `interviews/candidates/<name>/feedback.md`.

## Data for Web Integration
The YAML frontmatter and structured headers allow future automated tools to parse this folder and display candidates in the "CV Generator" dashboard.
