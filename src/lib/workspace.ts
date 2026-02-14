import { readFile, readdir, stat } from "fs/promises";
import { join } from "path";

const WORKSPACE = process.env.WORKSPACE_PATH || `${process.env.HOME}/.openclaw/workspace`;

export function workspacePath(...segments: string[]): string {
  return join(WORKSPACE, ...segments);
}

export async function readJsonFile<T>(path: string, fallback: T): Promise<T> {
  try {
    const content = await readFile(workspacePath(path), "utf-8");
    return JSON.parse(content) as T;
  } catch {
    return fallback;
  }
}

export async function readTextFile(path: string, fallback = ""): Promise<string> {
  try {
    return await readFile(workspacePath(path), "utf-8");
  } catch {
    return fallback;
  }
}

export async function writeJsonFile(path: string, data: unknown): Promise<void> {
  const { writeFile, mkdir } = await import("fs/promises");
  const { dirname } = await import("path");
  const fullPath = workspacePath(path);
  await mkdir(dirname(fullPath), { recursive: true });
  await writeFile(fullPath, JSON.stringify(data, null, 2));
}

export async function listDir(path: string): Promise<string[]> {
  try {
    return await readdir(workspacePath(path));
  } catch {
    return [];
  }
}

export async function fileExists(path: string): Promise<boolean> {
  try {
    await stat(workspacePath(path));
    return true;
  } catch {
    return false;
  }
}
