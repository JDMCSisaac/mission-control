import { NextResponse } from 'next/server';
import { readJsonFile, writeJsonFile } from '@/lib/workspace';

const DEFAULT_TASKS = {
  tasks: [
    { id: '1', category: 'Infrastructure', title: 'Set up automated backups', reasoning: 'Critical data protection', nextAction: 'Configure cron job for daily workspace backup', priority: 'high', effort: 'medium', status: 'pending' },
    { id: '2', category: 'Content', title: 'Write weekly newsletter', reasoning: 'Audience engagement', nextAction: 'Draft outline for this weeks topics', priority: 'medium', effort: 'low', status: 'pending' },
    { id: '3', category: 'Agent', title: 'Train sub-agent for code review', reasoning: 'Reduce manual review load', nextAction: 'Create SOUL.md for code review agent', priority: 'high', effort: 'high', status: 'pending' },
    { id: '4', category: 'Revenue', title: 'Follow up with client leads', reasoning: '3 warm leads from last week', nextAction: 'Send personalized follow-up emails', priority: 'high', effort: 'low', status: 'approved' },
  ],
};

export async function GET() {
  const data = await readJsonFile('state/suggested-tasks.json', DEFAULT_TASKS);
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const data = await readJsonFile('state/suggested-tasks.json', DEFAULT_TASKS);
  const idx = data.tasks.findIndex((t: any) => t.id === body.id);
  if (idx >= 0) data.tasks[idx] = { ...data.tasks[idx], ...body };
  await writeJsonFile('state/suggested-tasks.json', data);
  return NextResponse.json({ ok: true });
}
