'use client';

import { useState } from 'react';
import { Theme } from '../../enums/themes';
import { circularClamp } from '../../utils/circularClamp';
import styles from './themeSelector.module.scss';

const THEMES: Theme[] = Object.values(Theme);

/**
 * Props for the ThemeSelector component.
 *
 * @typedef {Object} ThemeSelectorProps
 * @property {(newTheme: Theme) => void} [onThemeChange] - Optional callback triggered when the theme changes.
 * @property {Theme} defaultTheme - default theme value
 */
export type ThemeSelectorProps = {
  onThemeChange?: (newTheme: Theme) => void;
  defaultTheme?: Theme;
};

/**
 * A React client component that allows users to cycle through a list of predefined themes.
 *
 * Displays the current theme and provides a button to switch to the next one.
 * When clicked, the theme index is incremented in a circular fashion and applied to `document.body`.
 *
 * @param {ThemeSelectorProps} props - The component props.
 * @property {Theme} props.onThemeChange - callback for when theme changes
 * @property {string} props.defaultTheme - default theme value
 * @returns {JSX.Element} A themed UI selector button and heading.
 */
export const ThemeSelector = ({
  defaultTheme,
  onThemeChange = () => {},
}: ThemeSelectorProps): JSX.Element => {
  const [themeIndex, setThemeIndex] = useState(
    circularClamp(THEMES.indexOf(defaultTheme as any), 0, THEMES.length - 1)
  );

  const currentTheme = THEMES[themeIndex % THEMES.length];

  return (
    <div className='flex flex-col items-start gap-2 mb-4'>
      <button
        onClick={() => {
          const newTheme = circularClamp(themeIndex + 1, 0, THEMES.length - 1);
          setThemeIndex(newTheme);
          onThemeChange(THEMES[newTheme]);
        }}
        className={`${styles['theme-toggle']} px-6 py-3 rounded border text-lg font-medium`}
        data-theme={currentTheme}>
        Theme:
      </button>
    </div>
  );
};
