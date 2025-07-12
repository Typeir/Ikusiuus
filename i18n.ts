// i18n.ts
export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'es', 'fi'],
} as const;

export type Locale = (typeof i18n)['locales'][number];
