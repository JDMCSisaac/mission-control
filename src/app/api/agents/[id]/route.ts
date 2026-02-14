import { NextResponse } from 'next/server';
import { readJsonFile, readTextFile } from '@/lib/workspace';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const registry = await readJsonFile('agents/registry.json', { agents: [] as any[] });
  const agent = (registry.agents || []).find((a: any) => a.id === id);
  if (!agent) return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
  const soul = await readTextFile((agent as any).workspace + '/SOUL.md', 'No SOUL.md found');
  const rules = await readTextFile((agent as any).workspace + '/RULES.md', 'No RULES.md found');
  return NextResponse.json({ ...agent, soul, rules });
}
