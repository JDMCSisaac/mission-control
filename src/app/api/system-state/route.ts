import { NextResponse } from 'next/server';
import { readJsonFile } from '@/lib/workspace';

export async function GET() {
  const servers = await readJsonFile('state/servers.json', {
    services: [
      { name: 'Gateway', port: 3100, status: 'up', lastCheck: new Date().toISOString() },
      { name: 'Convex', port: 3210, status: 'up', lastCheck: new Date().toISOString() },
      { name: 'Dashboard', port: 3000, status: 'up', lastCheck: new Date().toISOString() },
      { name: 'Telegram Bot', port: null, status: 'up', lastCheck: new Date().toISOString() },
    ],
  });
  const branches = await readJsonFile('state/branch-check.json', { branches: [] });
  return NextResponse.json({ ...servers, branches: branches.branches || [] });
}
