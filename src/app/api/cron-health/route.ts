import { NextResponse } from 'next/server';
import { readJsonFile } from '@/lib/workspace';

export async function GET() {
  const data = await readJsonFile('state/crons.json', {
    jobs: [
      { name: 'heartbeat', schedule: '*/30 * * * *', lastRun: new Date().toISOString(), lastStatus: 'ok', consecutiveErrors: 0 },
      { name: 'email-check', schedule: '0 */2 * * *', lastRun: new Date().toISOString(), lastStatus: 'ok', consecutiveErrors: 0 },
      { name: 'memory-sync', schedule: '0 6 * * *', lastRun: new Date().toISOString(), lastStatus: 'ok', consecutiveErrors: 0 },
      { name: 'backup', schedule: '0 3 * * *', lastRun: new Date().toISOString(), lastStatus: 'error', consecutiveErrors: 2 },
    ],
  });
  return NextResponse.json(data);
}
