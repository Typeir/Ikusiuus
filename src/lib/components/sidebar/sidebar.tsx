import Link from 'next/link';

export const Sidebar = ({ items }: { items: any[] }) => (
  <ul className='space-y-1 text-sm'>
    {items.map((item) => (
      <li key={item.path}>
        {item.children ? (
          <details className='ml-2'>
            <summary className='cursor-pointer font-bold'>{item.name}</summary>
            <Sidebar items={item.children} />
          </details>
        ) : (
          <Link
            href={`/library/${item.path}`}
            className='block ml-4 text-blue-300 hover:underline'>
            {item.name}
          </Link>
        )}
      </li>
    ))}
  </ul>
);
