/**
 * Persistence utility to save project files during development.
 * This interacts with the custom Vite middleware in vite.config.ts.
 */
export async function saveFile(filePath, content) {
    try {
        const response = await fetch('/api/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ filePath, content }),
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Failed to save file');
        }
        return { success: true };
    }
    catch (error) {
        console.error('Persistence error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}
