import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async (fullRequest) => {
  // Typically corresponds to the `[locale]` segment

  const { requestLocale: requested } = await fullRequest;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}/index.json`)).default,
  };
});
