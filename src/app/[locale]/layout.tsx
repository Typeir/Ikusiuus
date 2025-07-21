import { routing } from '@/i18n/routing';
import { PersistentData } from '@/lib/enums/persistentData';
import { Theme } from '@/lib/enums/themes';
import { getContentFolder } from '@/lib/utils/getContentFolder';
import { walk } from '@/lib/utils/walk';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { cookies } from 'next/headers';
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
  const theme =
    (await cookies()).get(PersistentData.Theme)?.value || Theme.Dark;

  const contentDir = path.join(getContentFolder(locale));
  const tree = walk(contentDir);

  // Ensure that the incoming `locale` is valid
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      {/*  @ts-ignore */}
      <body theme={theme}>
        <NextIntlClientProvider locale={locale}>
          {/*  @ts-ignore */}
          <ResponsiveLayoutShell theme={theme} tree={tree}>
            {children}
          </ResponsiveLayoutShell>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};
export default RootLayout;

export const dynamic = 'force-static';
