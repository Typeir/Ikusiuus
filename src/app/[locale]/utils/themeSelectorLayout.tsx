'use client';

import {
  ThemeSelector,
  ThemeSelectorProps,
} from '@/lib/components/themeSelector/themeSelector';
import { PersistentData } from '@/lib/enums/persistentData';
import { Theme } from '@/lib/enums/themes';
import { storePersistentData } from '@/lib/utils/storePersistentData';
import { useEffect } from 'react';
import { fetchPersistentData } from '../../../lib/utils/fetchPersistentData';

const forceTheme = (newTheme: Theme) => {
  const b = document.querySelector('body') as HTMLBodyElement | null;
  b?.setAttribute(PersistentData.Theme, newTheme);
};

/**
 * A layout wrapper around the {@link ThemeSelector} component.
 *
 * This component connects the theme selector to persistent storage and applies the selected
 * theme directly to the `<body>` element in the DOM. It ensures that user preferences
 * are saved across sessions using {@link storePersistentData}.
 *
 * @param {ThemeSelectorProps} props - The props for the layout.
 * @param {Theme} props.defaultTheme - The initial theme to use.
 * @returns {JSX.Element} A JSX element rendering the ThemeSelector with persistence logic.
 */
export const ThemeSelectorLayout = ({}: ThemeSelectorProps): JSX.Element => {
  const currentTheme = fetchPersistentData(PersistentData.Theme);
  useEffect(() => {
    forceTheme(currentTheme as Theme);
  }, [currentTheme]);
  return (
    <ThemeSelector
      /**
       * Called when the theme changes. Stores the theme persistently
       * and updates the DOM's <body> element attribute.
       *
       * @param {Theme} newTheme - The newly selected theme.
       */
      onThemeChange={(newTheme) => {
        storePersistentData(PersistentData.Theme, newTheme);
        // this is very illegal but it's better than react
        forceTheme(newTheme);
      }}
    />
  );
};
