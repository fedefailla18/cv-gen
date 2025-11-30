# CV Generator (Vite + React + TypeScript + Tailwind)

## Setup

1. Install dependencies

```bash
npm install
```

2. Run dev server

```bash
npm run dev
```

3. Open http://localhost:5173

4. Edit `src/resume.json` to update your CV. The app will read that file and render the CV.

5. Click **Export to PDF** to print or save a PDF version.

## Notes
- This scaffold uses Tailwind for quick styling — change classes in `src/components/CV.tsx` to customize.
- If you prefer `jspdf` or `html2pdf` for heavier PDF control (page breaks, headers), I can add it.

## Linting & Formatting

This project uses ESLint v9 with the new flat config (`eslint.config.js`) and Prettier.

- Run lint:
```bash 
  npm run lint
```

- Auto-fix lint issues:
```bash 
  npm run lint:fix  
``` 

- Format all source files:
```bash
  npm run format
```

If you add or change lint rules, edit `eslint.config.js`. The legacy `.eslintrc.*` format is not used with ESLint v9.

