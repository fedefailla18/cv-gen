/**
 * Utility to parse the specific CSV format from the Google Sheets Evaluation Form.
 */
export interface ParsedCsvData {
  scores: Record<string, number>;
  comments: string;
}

export function parseEvaluationCsv(csvText: string): ParsedCsvData {
  const lines = csvText.split('\n');
  const scores: Record<string, number> = {};
  let comments = '';

  lines.forEach((line) => {
    // Basic regex to handle quoted CSV fields
    // This matches: "Skill Name",Score,Percentage,Comments
    const match = line.match(/^"?(.*?)"?,\s*([\d.]+),/);
    
    if (match) {
      const skill = match[1].trim();
      const score = parseFloat(match[2]);
      
      // Ignore section headers like "Professional Experience" or "Java" 
      // which usually don't have a numeric score in the second column in the raw sheet
      // but the user's CSV shows 3, 100% etc.
      
      if (!isNaN(score) && skill.length > 3) {
        // Clean up common long skill names
        const cleanSkill = skill
          .replace(/Experience in development processes \(.*?\)/i, 'Agile/Process')
          .replace(/Level of English.*/i, 'English Level')
          .replace(/What is JVM, JRE, JDK.*/i, 'JVM/Memory')
          .split('\n')[0] // Take only the first line if multi-line
          .substring(0, 30); // Cap length
          
        scores[cleanSkill] = score;
      }
    }
  });

  return { scores, comments };
}
