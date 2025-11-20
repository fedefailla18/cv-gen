import React from 'react';

interface ThemeSelectorProps {
  theme: string;
  setTheme: (theme: string) => void;
}

export default function ThemeSelector({ theme, setTheme }: ThemeSelectorProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-2">Theme</h2>
      <select
        className="w-full p-2 border rounded"
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
      >
        <option value="modern">Modern</option>
        <option value="minimal">Minimal</option>
        <option value="compact">Compact</option>
        <option value="twocolumn">Two Column</option>
      </select>
    </div>
  );
}