'use client';

import Link from 'next/link';
import { useState } from 'react';
import Icon from '../icon/icon';
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
export const Sidebar = ({
  items,
  onNavigate,
}: {
  items: Item[];
  onNavigate?: () => void;
}) => {
  return (
    <ul className='space-y-1 text-sm'>
      {items.map((item) => (
        <SidebarItem key={item.path} item={item} onNavigate={onNavigate} />
      ))}
    </ul>
  );
};

const SidebarItem = ({
  item,
  onNavigate,
}: {
  item: Item;
  onNavigate?: () => void;
}) => {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((prev) => !prev);

  if (item.children) {
    return (
      <li className={`ml-2 ${styles.accordion}`}>
        <div
          className={`text-lg ${styles.label} cursor-pointer font-bold ${
            open ? styles.open : ''
          }`}
          onClick={toggle}>
          <p>{item.name}</p>
          <Icon
            type='arrow'
            className={`${styles.arrow} ${open ? styles.open : ''}`}
          />
        </div>
        <div className={`${styles.content} ${open ? styles.expanded : ''}`}>
          <Sidebar items={item.children} onNavigate={onNavigate} />
        </div>
      </li>
    );
  }

  return (
    <li className='ml-4'>
      <Link
        href={`/library/${item.path}`}
        onClick={onNavigate}
        className={`text-accent hover:underline block ${styles['link-item']}`}>
        {item.name}
      </Link>
    </li>
  );
};
