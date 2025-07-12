import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q');
  if (!q) return NextResponse.json({ items: [] });

  const apiKey = process.env.GOOGLE_API_KEY!;
  const cx = process.env.GOOGLE_CX!;
  const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
    q
  )}&key=${apiKey}&cx=${cx}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Google API error: ${res.status} ${res.statusText}`);
      return NextResponse.json({ items: [] }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data.items || []);
  } catch (err) {
    console.error('External search failed', err);
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}
