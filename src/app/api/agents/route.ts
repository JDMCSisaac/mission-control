import { NextResponse } from 'next/server';
import { readJsonFile, readTextFile } from '@/lib/workspace';

export async function GET() {
  const registry = await readJsonFile('agents/registry.json', {
    agents: [
      { id: 'main', name: 'Atlas', role: 'Primary Agent', model: 'claude-opus-4', level: 'L4', status: 'active', workspace: '.' },
      { id: 'researcher', name: 'Scout', role: 'Research Agent', model: 'claude-sonnet-4', level: 'L2', status: 'idle', workspace: 'agents/researcher' },
      { id: 'coder', name: 'Forge', role: 'Code Agent', model: 'claude-sonnet-4', level: 'L3', status: 'active', workspace: 'agents/coder' },
    ],
  });

  const agents = await Promise.all(
    (registry.agents || []).map(async (agent) => {
      const soul = await readTextFile(agent.workspace + '/SOUL.md', '');
      const rules = await readTextFile(agent.workspace + '/RULES.md', '');
      return { ...agent, soul: soul.slice(0, 500), rules: rules.slice(0, 500) };
    })
  );

  const active = agents.filter((a) => a.status === 'active').length;
  return NextResponse.json({ agents, stats: { total: agents.length, active, healthy: active, unhealthy: agents.length - active } });
}
