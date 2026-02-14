import { NextResponse } from 'next/server';
import { readTextFile } from '@/lib/workspace';

export async function GET() {
  const content = await readTextFile('content/queue.md', '');
  const stages: Record<string, number> = { draft: 0, review: 0, approved: 0, published: 0 };
  const items: { title: string; stage: string }[] = [];

  if (content) {
    let currentStage = 'draft';
    for (const line of content.split('\n')) {
      const sl = line.toLowerCase().trim();
      if (sl.includes('## draft')) currentStage = 'draft';
      else if (sl.includes('## review')) currentStage = 'review';
      else if (sl.includes('## approved')) currentStage = 'approved';
      else if (sl.includes('## published')) currentStage = 'published';
      else if (line.trim().startsWith('- ')) {
        stages[currentStage]++;
        items.push({ title: line.trim().slice(2), stage: currentStage });
      }
    }
  } else {
    Object.assign(stages, { draft: 3, review: 2, approved: 1, published: 5 });
    items.push(
      { title: 'AI Agent Best Practices Guide', stage: 'draft' },
      { title: 'OpenClaw Setup Tutorial', stage: 'draft' },
      { title: 'Memory Systems Deep Dive', stage: 'draft' },
      { title: 'Telegram Bot Integration', stage: 'review' },
      { title: 'Multi-Agent Architecture', stage: 'review' },
      { title: 'Getting Started with OpenClaw', stage: 'approved' },
    );
  }

  return NextResponse.json({ stages, items });
}
