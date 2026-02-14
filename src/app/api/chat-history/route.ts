import { NextResponse } from 'next/server';
import { listDir, readTextFile } from '@/lib/workspace';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const channel = searchParams.get('channel') || '';
  const session = searchParams.get('session') || '';
  const limit = parseInt(searchParams.get('limit') || '50');

  const transcriptDirs = ['transcripts', 'chat', 'sessions'];
  const sessions: any[] = [];

  for (const dir of transcriptDirs) {
    const files = await listDir(dir);
    for (const file of files) {
      if (!file.endsWith('.jsonl') && !file.endsWith('.json')) continue;
      if (channel && !file.includes(channel)) continue;
      const content = await readTextFile(dir + '/' + file, '');
      const messages = content.split('\n').filter(Boolean).map((line) => { try { return JSON.parse(line); } catch { return null; } }).filter(Boolean);
      sessions.push({
        id: file.replace(/.(jsonl|json)$/, ''),
        file, channel: file.includes('telegram') ? 'telegram' : file.includes('discord') ? 'discord' : 'system',
        messageCount: messages.length,
        lastMessage: messages[messages.length - 1]?.timestamp || null,
        messages: session === file.replace(/.(jsonl|json)$/, '') ? messages.slice(-limit) : undefined,
      });
    }
  }

  if (sessions.length === 0) {
    const demoMessages = [
      { role: 'user', content: 'Hey, can you check the server status?', timestamp: new Date(Date.now() - 3600000).toISOString(), channel: 'telegram' },
      { role: 'assistant', content: 'All systems operational. Gateway up on port 3100, Convex on 3210. No errors in the last hour.', timestamp: new Date(Date.now() - 3500000).toISOString(), channel: 'telegram' },
      { role: 'user', content: 'Great. What about the cron jobs?', timestamp: new Date(Date.now() - 3400000).toISOString(), channel: 'telegram' },
      { role: 'assistant', content: 'Backup cron failed twice. Recommend checking disk space. All other jobs green.', timestamp: new Date(Date.now() - 3300000).toISOString(), channel: 'telegram' },
      { role: 'user', content: 'Fix the backup job please', timestamp: new Date(Date.now() - 1800000).toISOString(), channel: 'telegram' },
      { role: 'assistant', content: 'On it. Investigating root cause now.', timestamp: new Date(Date.now() - 1700000).toISOString(), channel: 'telegram' },
    ];
    sessions.push(
      { id: 'telegram-main', file: 'telegram-main.jsonl', channel: 'telegram', messageCount: 6, lastMessage: demoMessages[5].timestamp, messages: demoMessages },
      { id: 'discord-general', file: 'discord-general.jsonl', channel: 'discord', messageCount: 24, lastMessage: new Date(Date.now() - 7200000).toISOString() },
      { id: 'system-logs', file: 'system-logs.jsonl', channel: 'system', messageCount: 142, lastMessage: new Date(Date.now() - 300000).toISOString() },
    );
  }
  return NextResponse.json({ sessions });
}
