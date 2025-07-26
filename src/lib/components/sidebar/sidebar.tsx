'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Icon from '../icon/icon';
import styles from './sidebar.module.scss';
import { default as SidebarActivePathStore } from './store/sidebarActivePath';

/**
 * Represents a single sidebar navigation item.
 *
 * @typedef {Object} Item
 * @property {string} name - The display name of the item.
 * @property {string} path - The routing path for the item.
 * @property {Item[]=} children - Optional nested child items.
 */
export type Item = {
  name: string;
  path: string;
  children?: Item[];
};

export type LayoutItem = Item & {
  expandedHeight: number;
  children?: LayoutItem[] | Item[];
};

const BASE_HEIGHT = 52; // height per sidebar item in px

/**
 * Recursively calculates collapsed and expanded heights for each sidebar item.
 *
 * @param {Item[]} items - The sidebar items.
 * @returns {Array<LayoutItem | undefined>} Sidebar items with height metadata.
 */
const calculateHeights = (items: Item[]): Array<LayoutItem> => {
  // Sort: items without children come first
  const sorted = [...items].sort((a, b) => {
    const aIsFolder = a.children && a.children.length > 0;
    const bIsFolder = b.children && b.children.length > 0;
    return Number(aIsFolder) - Number(bIsFolder); // false < true
  });

  return sorted.map((item) => {
    if (!item.children || item.children.length === 0) {
      return {
        ...item,
        expandedHeight: BASE_HEIGHT,
      };
    }

    const children = calculateHeights(item.children);
    const totalChildrenHeight = children.reduce(
      (sum, child) => sum + child.expandedHeight,
      0
    );

    return {
      ...item,
      children,
      expandedHeight: BASE_HEIGHT + totalChildrenHeight,
    };
  });
};

/**
 * Props for the Sidebar component.
 *
 * @typedef {Object} SidebarProps
 * @property {Item[]} items - The root navigation items.
 * @property {() => void=} onNavigate - Optional callback for when a link is clicked.
 * @property {boolean=} collapseSiblings - If true, opening one collapses siblings.
 */
interface SidebarProps {
  items: Item[];
  onNavigate?: () => void;
  collapseSiblings?: boolean;
}

/**
 * Renders a recursive sidebar menu with optional sibling-collapsing behavior.
 *
 * @param {SidebarProps} props - Component props.
 * @returns {JSX.Element} The sidebar navigation tree.
 */
export const Sidebar = ({
  items,
  onNavigate,
  collapseSiblings = false,
}: SidebarProps): JSX.Element => {
  const shouldCollapse = items.length > 1;
  const [localPathStore] = useState(new SidebarActivePathStore());
  const [layoutItems] = useState(calculateHeights(items));

  return (
    <ul className='space-y-1 text-sm'>
      {layoutItems.map((item) => (
        <SidebarItem
          key={item.path}
          item={item}
          onNavigate={onNavigate}
          collapseSiblings={shouldCollapse && collapseSiblings}
          pathStore={localPathStore}
        />
      ))}
    </ul>
  );
};

/**
 * Props for a single SidebarItem component.
 *
 * @typedef {Object} SidebarItemProps
 * @property {LayoutItem} item - The item to render.
 * @property {() => void=} onNavigate - Optional navigation callback.
 * @property {boolean} collapseSiblings - Whether to collapse other items.
 * @property {SidebarActivePathStore} pathStore - the open/closed path store.
 */
interface SidebarItemProps {
  item: LayoutItem;
  onNavigate?: () => void;
  collapseSiblings: boolean;
  pathStore: SidebarActivePathStore;
}

/**
 * Recursive SidebarItem that renders a link or a collapsible folder.
 *
 * @param {SidebarItemProps} props - Component props.
 * @param {Item} props.item - The item to render.
 * @param {() => void=} props.onNavigate - Optional navigation callback.
 * @param {boolean} props.collapseSiblings - Whether to collapse other items.
 * @param {SidebarActivePathStore} props.pathStore - the open/closed path store.
 * @returns {JSX.Element | null} Sidebar entry element or null if no valid data.
 */
const SidebarItem = ({
  item,
  onNavigate,
  collapseSiblings,
  pathStore,
}: SidebarItemProps): JSX.Element | null => {
  const [open, setOpen] = useState<boolean>(false);
  const params = useParams();
  const locale = params?.locale as string;
  const index = item?.children?.findIndex(
    (child) => child.name.toLowerCase() === 'main'
  );

  useEffect(() => {
    return pathStore.subscribe((path: any) => {
      if (collapseSiblings && path !== item.path) {
        setOpen(false);
      }
    });
  }, [collapseSiblings, item.path, pathStore]);

  const toggle = (e?: React.MouseEvent): void => {
    const nextState = !open;
    setOpen(nextState);
    e?.preventDefault();
    if (collapseSiblings && nextState) {
      pathStore.set(item.path);
    }
  };

  // if the foler has an index, move it to the top
  if (index !== undefined && index !== -1) {
    const children = [...(item.children as LayoutItem[])];
    const indexedItem = children?.splice(index, 1)[0];

    return (
      <li
        className={`ml-2 ${styles.accordion}`}
        style={{
          ...(open ? { maxHeight: `${item.expandedHeight}px` } : {}),
          transition: 'max-height 0.5s var(--springy-bezier)',
          overflow: 'hidden',
        }}>
        <Link
          href={`/${locale}/library/${indexedItem.path}`}
          onClick={() => open && onNavigate && onNavigate()}
          className={`text-accent hover:underline block ${styles['link-item']}`}>
          <div
            className={`text-lg ${styles.label} cursor-pointer font-bold ${
              open ? styles.open : ''
            }`}
            onClick={() => !open && toggle()}>
            <p>{item.name}</p>
            <Icon
              onClick={toggle}
              type='arrow'
              className={`${styles.arrow} ${open ? styles.open : ''}`}
            />
          </div>
        </Link>
        <div
          className={`${styles.content} ${open ? styles.expanded : ''}`}
          style={{
            ...(open ? { maxHeight: `${item.expandedHeight}px` } : {}),
            transition: 'max-height 0.5s var(--springy-bezier)',
            overflow: 'hidden',
          }}>
          <Sidebar
            items={children as LayoutItem[]}
            onNavigate={onNavigate}
            collapseSiblings={collapseSiblings}
          />
        </div>
      </li>
    );
  }

  // if the foler has no children, don't render it
  if (item.children?.length === 0) {
    return null;
    // if the foler has no index, render it as a folder
  } else if (item.children) {
    return (
      <li
        className={`ml-2 ${styles.accordion}`}
        style={{
          ...(open ? { maxHeight: `${item.expandedHeight}px` } : {}),
          transition: 'max-height 0.5s var(--springy-bezier)',
          overflow: 'hidden',
        }}>
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
        <div
          className={`${styles.content} ${open ? styles.expanded : ''}`}
          style={{
            ...(open ? { maxHeight: `${item.expandedHeight}px` } : {}),
            transition: 'max-height 0.5s var(--springy-bezier)',
            overflow: 'hidden',
          }}>
          <Sidebar
            items={item.children}
            onNavigate={onNavigate}
            collapseSiblings={collapseSiblings}
          />
        </div>
      </li>
    );
  }

  // if the item is not a folder, render it as a link
  return (
    <li className='ml-4'>
      <Link
        href={`/${locale}/library/${item.path}`}
        onClick={onNavigate}
        className={`text-accent hover:underline block ${styles['link-item']}`}>
        {item.name}
      </Link>
    </li>
  );
};
