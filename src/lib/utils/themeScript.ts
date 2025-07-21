// lib/theme-script.ts

import { PersistentData } from '../enums/persistentData';
import { Theme } from '../enums/themes';

export const getThemeInitScript = () => {
  return `
    (function() {
      try {
        var theme = localStorage.getItem('${PersistentData.Theme}');
        var root = document.body;
        if (theme === '${Theme.Dark}' || theme === '${Theme.Light}' || theme === '${Theme.Sepia}') {
          root.classList.add(theme);
          root.setAttribute('${PersistentData.Theme}', theme);
        }
      } catch (e) {}
    })();
  `;
};
