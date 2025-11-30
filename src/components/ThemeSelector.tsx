import React from 'react';

import { useResumeContext } from '../context/ResumeContext';
import { ThemeName, THEMES } from '../themes';

const prettyThemeLabels: Record<ThemeName, string> = {
  modern: 'Modern',
  minimal: 'Minimal',
  compact: 'Compact',
  twocolumn: 'Two Column',
};

const ThemeSelector = () => {
  const { theme, setTheme } = useResumeContext();

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value as ThemeName);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-2">Theme</h2>
      <select className="w-full p-2 border rounded" value={theme} onChange={handleThemeChange}>
        {Object.keys(THEMES).map((key) => {
          const name = key as ThemeName;
          return (
            <option key={key} value={key}>
              {prettyThemeLabels[name] ?? name}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default ThemeSelector;