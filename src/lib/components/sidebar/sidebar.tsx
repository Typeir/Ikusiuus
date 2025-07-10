'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './sidebar.module.scss';

type Item = {
  name: string;
  path: string;
  children?: Item[];
};

/**
 * Recursive sidebar menu with collapsible folders.
 * Supports nested items and smooth animation via CSS modules.
 *
 * @param items - Tree of files and folders
 */
export const Sidebar = ({ items }: { items: Item[] }) => {
  return (
    <ul className='space-y-1 text-sm'>
      {items.map((item) => (
        <SidebarItem key={item.path} item={item} />
      ))}
    </ul>
  );
};

const SidebarItem = ({ item }: { item: Item }) => {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((prev) => !prev);

  if (item.children) {
    return (
      <li className={`ml-2 ${styles.accordion}`}>
        <div
          className={`text-lg ${styles.label} cursor-pointer font-black ${
            open ? styles.open : ''
          }`}
          onClick={toggle}>
          <p>{item.name}</p>
          <img
            src='/icons/arrow.png'
            alt='Toggle'
            className={`${styles.arrow} ${open ? styles.open : ''}`}
          />
        </div>
        <div className={`${styles.content} ${open ? styles.expanded : ''}`}>
          <Sidebar items={item.children} />
        </div>
      </li>
    );
  }

  return (
    <li className='ml-4'>
      <Link
        href={`/library/${item.path}`}
        className={`text-accent hover:underline block ${styles['link-item']}`}>
        {item.name}
      </Link>
    </li>
  );
};
