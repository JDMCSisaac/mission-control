import { NextResponse } from 'next/server';
import { readTextFile, readJsonFile } from '@/lib/workspace';

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = await readTextFile('memory/ecosystem/' + slug + '.md', '');
  const meta = await readJsonFile('memory/ecosystem/' + slug + '.json', {});
  return NextResponse.json({ slug, content: content || '# ' + slug + '\n\nNo data available yet.', meta });
}
