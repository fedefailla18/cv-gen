export function parseEvaluationCsv(rawText) {
    // Normalize line endings and split
    const lines = rawText.split(/\r?\n/);
    const scores = {};
    const notes = [];
    // Determine delimiter: prefer Tab if present, otherwise Comma
    const hasTabs = rawText.includes('\t');
    const delimiter = hasTabs ? '\t' : ',';
    lines.forEach((line) => {
        if (!line.trim())
            return;
        // Split line by delimiter. 
        // If it's CSV, handle basic quotes, but for TSV (Google Sheets copy), it's straightforward.
        let parts = [];
        if (delimiter === '\t') {
            parts = line.split('\t');
        }
        else {
            // Basic CSV split (doesn't handle complex escaped commas, but sufficient for this sheet)
            parts = line.split(',').map(p => p.replace(/^"|"$/g, '').trim());
        }
        if (parts.length < 2)
            return;
        const rawSkill = parts[0].trim().replace(/^"|"$/g, '').trim();
        const rawScore = parts[1]?.trim();
        const rawComment = parts[parts.length - 1]?.trim(); // Usually the last column
        // Helper to clean up skill names
        const cleanSkill = (skill) => {
            return skill
                .replace(/Experience in development processes \(.*?\)/i, 'Agile/Process')
                .replace(/Level of English.*/i, 'English Level')
                .replace(/What is JVM, JRE, JDK.*/i, 'JVM/Memory')
                .replace(/How is memory organized.*/i, 'Memory Organization')
                .replace(/AI role in his daily basis.*/i, 'AI/Workflow')
                .replace(/Walk me through your current project.*/i, 'System Walkthrough')
                .split('\n')[0]
                .substring(0, 40)
                .trim();
        };
        // Try to find the score. Sometimes it's in part[1] or part[2] depending on empty columns
        let score = parseFloat(rawScore);
        if (isNaN(score) && parts[2]) {
            score = parseFloat(parts[2].trim());
        }
        if (!isNaN(score) && rawSkill.length > 5 && !rawSkill.toLowerCase().includes('score')) {
            const skillName = cleanSkill(rawSkill);
            scores[skillName] = score;
            // If there's a comment and it's not a percentage or empty
            if (rawComment && rawComment.length > 2 && !rawComment.includes('%') && rawComment !== rawScore) {
                notes.push(`- **${skillName}:** ${rawComment}`);
            }
        }
        else if (rawSkill.length > 5 && rawComment && rawComment.length > 10 && !rawComment.includes('%')) {
            // Even if no score, if there's a significant comment, capture it as a note
            notes.push(`- **${cleanSkill(rawSkill)}:** ${rawComment}`);
        }
    });
    return { scores, notes };
}
