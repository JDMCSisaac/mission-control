import { NextResponse } from 'next/server';
import { SAMPLE_CLIENTS } from '@/lib/credit-repair-data';

export async function GET() {
  return NextResponse.json({ clients: SAMPLE_CLIENTS });
}
