import { NextResponse } from 'next/server';
import { listDir, readTextFile } from '@/lib/workspace';

export async function GET() {
  const files = await listDir('clients');
  const clients: any[] = [];

  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    const content = await readTextFile('clients/' + file, '');
    const name = file.replace('.md', '').replace(/-/g, ' ').replace(/w/g, (c) => c.toUpperCase());
    const stage = content.includes('Active') ? 'active' : content.includes('Proposal') ? 'proposal' : 'prospect';
    clients.push({ id: file, name, stage, content: content.slice(0, 300) });
  }

  if (clients.length === 0) {
    clients.push(
      { id: '1', name: 'Acme Corp', stage: 'active', content: 'Enterprise AI integration' },
      { id: '2', name: 'TechStart Inc', stage: 'proposal', content: 'Chatbot development' },
      { id: '3', name: 'DataFlow', stage: 'meeting', content: 'Data pipeline automation' },
      { id: '4', name: 'CloudNine', stage: 'prospect', content: 'Infrastructure consulting' },
      { id: '5', name: 'NextGen Labs', stage: 'contacted', content: 'Research automation' },
    );
  }
  return NextResponse.json({ clients });
}
