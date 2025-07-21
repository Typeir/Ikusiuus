import { routing } from '@/i18n/routing';
import { getContentFolder } from '@/lib/utils/getContentFolder';
import { walk } from '@/lib/utils/walk';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import path from 'path';
import './globals.scss';
import ResponsiveLayoutShell from './utils/responsiveLayoutShell';

const RootLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) => {
  const { locale } = await params;
  const contentDir = path.join(getContentFolder(locale));
  const tree = walk(contentDir);

  // Ensure that the incoming `locale` is valid
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      {/*  @ts-ignore */}
      <body suppressHydrationWarning>
        <NextIntlClientProvider locale={locale}>
          {/*  @ts-ignore */}
          <ResponsiveLayoutShell tree={tree}>{children}</ResponsiveLayoutShell>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};
export default RootLayout;

export const dynamic = 'force-static';
