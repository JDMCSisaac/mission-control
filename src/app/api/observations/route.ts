import { NextResponse } from 'next/server';
import { readTextFile } from '@/lib/workspace';

export async function GET() {
  const text = await readTextFile('state/observations.md', '');
  const observations = text
    ? text.split('\n').filter((l) => l.trim().startsWith('- ')).map((l) => l.trim().slice(2))
    : [
        'Agent uptime: 99.7% over last 7 days',
        'Memory usage trending up - consider cleanup',
        '3 new Telegram conversations today',
        'Cron backup job failed twice - needs attention',
        'Sub-agent Scout completed 12 research tasks',
      ];
  return NextResponse.json({ observations });
}
