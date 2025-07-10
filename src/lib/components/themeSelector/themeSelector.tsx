'use client';

import { useEffect, useState } from 'react';
import { circularClamp } from '../../utils/circularClamp';

enum Theme {
  Light = 'light',
  Dark = 'dark',
  Damocles = 'damocles',
}

const THEMES: Theme[] = [Theme.Light, Theme.Dark, Theme.Damocles];

type ThemeSelectorProps = {
  onThemeChange?: (newTheme: string) => void;
};

export const ThemeSelector = ({
  onThemeChange = () => {},
}: ThemeSelectorProps) => {
  const [themeIndex, setThemeIndex] = useState(1);

  useEffect(() => {
    const currentTheme = THEMES[themeIndex % THEMES.length];
    document.body.setAttribute('theme', currentTheme);
  }, [themeIndex]);

  return (
    <div className='flex flex-col items-start gap-2 mb-4'>
      <h1 className='text-3xl font-bold'>Library of Ikuisuus</h1>
      <button
        onClick={() => {
          const newTheme = circularClamp(themeIndex + 1, 0, THEMES.length - 1);
          console.log(newTheme);
          setThemeIndex(newTheme);
          onThemeChange(THEMES[newTheme]);
        }}
        className='px-6 py-3 rounded border text-lg font-medium transition-all duration-700 border-zinc-600 bg-zinc-800 text-zinc-200 hover:bg-zinc-700'>
        Theme: {THEMES[themeIndex % THEMES.length]}
      </button>
    </div>
  );
};
