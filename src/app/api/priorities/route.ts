import { NextResponse } from 'next/server';
import { readTextFile } from '@/lib/workspace';

export async function GET() {
  const text = await readTextFile('shared-context/priorities.md', '');
  const priorities = text
    ? text.split('\n').filter((l) => l.trim().startsWith('- ') || l.trim().match(/^[0-9]+\./)).map((l) => l.trim().replace(/^[-0-9.]+\s*/, ''))
    : [
        'Ship mission control dashboard',
        'Stabilize agent memory system',
        'Onboard 2 new clients this month',
        'Improve response latency <2s',
        'Build automated testing pipeline',
      ];
  return NextResponse.json({ priorities });
}
