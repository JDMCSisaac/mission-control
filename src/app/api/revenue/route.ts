import { NextResponse } from 'next/server';
import { getStats } from '@/lib/credit-repair-data';

export async function GET() {
  const stats = getStats();
  return NextResponse.json({
    currentMonth: { revenue: stats.totalRevenue, burn: 2400, net: stats.totalRevenue - 2400 },
    lastMonth: { revenue: 38500, burn: 2200, net: 36300 },
    ytd: { revenue: stats.totalRevenue + 38500, burn: 4600, net: stats.totalRevenue + 38500 - 4600 },
    clients: stats.activeClients,
    mrr: stats.totalRevenue,
    l1: stats.l1,
    l2: stats.l2,
  });
}
