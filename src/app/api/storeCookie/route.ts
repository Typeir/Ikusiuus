'use server';

import { cookies } from 'next/headers';

export async function POST(name: string, data: any) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: name,
    value: data,
    httpOnly: true,
    path: '/',
  });
}
