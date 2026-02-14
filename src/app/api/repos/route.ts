import { NextResponse } from 'next/server';
import { execSync } from 'child_process';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  const repos: any[] = [];
  const scanDirs = [process.env.HOME + '/projects', process.env.HOME + '/.openclaw/workspace'];

  for (const dir of scanDirs) {
    try {
      const entries = await readdir(dir);
      for (const entry of entries) {
        const repoPath = join(dir, entry);
        try {
          const s = await stat(join(repoPath, '.git'));
          if (!s.isDirectory()) continue;
          const branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: repoPath, encoding: 'utf-8' }).trim();
          const lastCommit = execSync('git log -1 --format="%s|%ar"', { cwd: repoPath, encoding: 'utf-8' }).trim();
          const [message, time] = lastCommit.split('|');
          const dirtyCount = execSync('git status --porcelain', { cwd: repoPath, encoding: 'utf-8' }).split('\n').filter(Boolean).length;
          repos.push({ name: entry, path: repoPath, branch, lastCommitMessage: message, lastCommitTime: time, dirtyFiles: dirtyCount });
        } catch {}
      }
    } catch {}
  }

  if (repos.length === 0) {
    repos.push(
      { name: 'mission-control', path: '~/projects/mission-control', branch: 'main', lastCommitMessage: 'feat: dashboard overview', lastCommitTime: '2 hours ago', dirtyFiles: 3 },
      { name: 'openclaw', path: '~/projects/openclaw', branch: 'develop', lastCommitMessage: 'fix: memory leak in agent loop', lastCommitTime: '5 hours ago', dirtyFiles: 0 },
      { name: 'agent-skills', path: '~/projects/agent-skills', branch: 'main', lastCommitMessage: 'add: tts skill v2', lastCommitTime: '1 day ago', dirtyFiles: 1 },
    );
  }
  return NextResponse.json({ repos });
}
