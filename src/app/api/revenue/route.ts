import { NextResponse } from 'next/server';
import { readJsonFile } from '@/lib/workspace';

export async function GET() {
  const data = await readJsonFile('state/revenue.json', {
    currentMonth: { revenue: 4250, burn: 1890, net: 2360 },
    lastMonth: { revenue: 3800, burn: 1750, net: 2050 },
    ytd: { revenue: 28400, burn: 12600, net: 15800 },
    clients: 6,
    mrr: 4250,
  });
  return NextResponse.json(data);
}
