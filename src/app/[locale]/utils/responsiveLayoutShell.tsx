'use client';

import Icon from '@/lib/components/icon/icon';
import { Sidebar } from '@/lib/components/sidebar/sidebar';
import type { Theme } from '@/lib/enums/themes';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import styles from './responsiveLayoutShell.module.scss';
import { ThemeSelectorLayout } from './themeSelectorLayout';

type Item = {
  name: string;
  path: string;
  children?: Item[];
};

/**
 * Responsive layout shell component wrapping the application content.
 *
 * Provides a sidebar navigation, theme selector, and mobile-friendly menu toggle.
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - The main content to render.
 * @param {Theme} props.theme - Current theme selected.
 * @param {Item[]} props.tree - Navigation tree items for sidebar.
 * @returns {JSX.Element} The rendered layout with sidebar and main content.
 */
function BaseResponsiveLayoutShell({
  children,
  theme,
  tree,
}: {
  children: React.ReactNode;
  theme: Theme;
  tree: Item[];
}): JSX.Element {
  const [open, setOpen] = useState(false);
  const t = useTranslations('layout');

  return (
    <div className='sidebar-container flex flex-col lg:flex-row min-h-screen relative'>
      {/* Sticky Hamburger Button */}
      <button
        onClick={() => setOpen(!open)}
        className='lg:hidden fixed top-4 right-4 z-50 bg-background border p-2 rounded shadow-md'
        aria-label={t('toggleSidebar')}>
        <Icon
          type='hamburguer'
          className={`${styles.hamburguer} ${
            open ? styles.isOpen : ''
          } w-6 h-6`}
          aria-hidden='true'
        />
      </button>

      {/* Sticky Mobile Title Bar */}
      <div className='solid lg:hidden fixed top-0 left-0 w-full h-[72px] z-40 flex items-center px-4 border-b bg-background shadow-sm'>
        <Link
          href='/'
          className='py-8 px-6 text-base font-semibold leading-tight'>
          {t('libraryTitle')}
        </Link>
      </div>

      {/* Sidebar */}
      <aside
        className={`${styles.mobileMenu} ${
          open ? styles.isOpen : ''
        } lg:translate-x-0 lg:block w-full lg:w-80 p-6 border-r fixed lg:sticky top-0 h-screen overflow-y-auto solid bg-background z-30`}>
        <div className='flex flex-col gap-4'>
          <Link
            href='/'
            className={`text-lg font-semibold hidden lg:block ${styles.title}`}>
            <div className='flex flex-row gap-4'>
              <img src='/logo.png' alt={t('libraryTitle')} className='logo' />
              <h1 className={`text-xl ${styles.title}`}>
                <span className='text-sm'>{t('libraryTitleSmall')}</span>
                <br />
                {t('libraryTitleLarge')}
              </h1>
            </div>
          </Link>
          <ThemeSelectorLayout defaultTheme={theme} />
          <Sidebar
            onNavigate={() => setOpen(false)}
            items={tree}
            collapseSiblings={true}
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className='flex-1 p-6 sm:p-10 mt-12 lg:mt-0'>{children}</main>
    </div>
  );
}

export default BaseResponsiveLayoutShell;
