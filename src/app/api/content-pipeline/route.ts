import { NextResponse } from 'next/server';
import { CONTENT_ITEMS } from '@/lib/credit-repair-data';

export async function GET() {
  return NextResponse.json({ items: CONTENT_ITEMS });
}
