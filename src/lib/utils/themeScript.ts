// lib/theme-script.ts

import { PersistentData } from '../enums/persistentData';
import { Theme } from '../enums/themes';

export const getThemeInitScript = () => {
  const themeValues = Object.values(Theme)
    .map((t) => `'${t}'`)
    .join(', ');

  return `
    (function() {
      try {
        var theme = localStorage.getItem('${PersistentData.Theme}');
        var allowed = [${themeValues}];
        var root = document.body;
        if (allowed.includes(theme)) {
          root.classList.add(theme);
          root.setAttribute('${PersistentData.Theme}', theme);
        }
      } catch (e) {}
    })();
  `;
};
