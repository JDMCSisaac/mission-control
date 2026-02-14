"use client";
import { useCallback, useState } from "react";
import { useAutoRefresh } from "@/hooks/use-auto-refresh";
import { PageTransition, StaggerGrid, StaggerItem } from "@/components/motion-wrapper";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingCards } from "@/components/loading-cards";
import { EmptyState } from "@/components/empty-state";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2, GitBranch, GitCommit, FileWarning, ChevronDown, ChevronUp, FolderGit2
} from "lucide-react";

async function fetchRepos() {
  return fetch("/api/repos").then(r => r.json());
}

export default function CodePage() {
  const fetcher = useCallback(() => fetchRepos(), []);
  const { data, loading } = useAutoRefresh(fetcher);
  const [expanded, setExpanded] = useState<string | null>(null);

  if (loading || !data) return <div className="pt-8"><LoadingCards count={4} /></div>;

  const repos = data.repos || [];

  return (
    <PageTransition>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-white/90">Code</h1>
        <p className="text-xs text-white/30 mt-0.5">{repos.length} repositories</p>
      </div>

      {repos.length === 0 ? (
        <EmptyState icon={<Code2 className="h-8 w-8" />} title="No repositories found" description="Git repositories in your workspace will appear here" />
      ) : (
        <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {repos.map((repo: any) => (
            <StaggerItem key={repo.name}>
              <Card
                className="p-4 cursor-pointer hover:border-white/[0.1] transition-colors"
                onClick={() => setExpanded(expanded === repo.name ? null : repo.name)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FolderGit2 className="h-4 w-4 text-blue-400" />
                    <h3 className="text-sm font-medium text-white/80">{repo.name}</h3>
                  </div>
                  {repo.dirtyFiles > 0 ? (
                    <Badge variant="warning">{repo.dirtyFiles} dirty</Badge>
                  ) : (
                    <Badge variant="success">clean</Badge>
                  )}
                </div>

                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-1 text-xs text-white/40">
                    <GitBranch className="h-3 w-3" />
                    <span className="font-mono">{repo.branch}</span>
                  </div>
                  <span className="text-[10px] text-white/20">{repo.lastCommitTime}</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-white/30">
                  <GitCommit className="h-3 w-3" />
                  <span className="truncate">{repo.lastCommitMessage}</span>
                </div>

                <AnimatePresence>
                  {expanded === repo.name && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 mt-3 border-t border-white/[0.06] space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white/30">Path</span>
                          <span className="text-white/50 font-mono text-[10px]">{repo.path}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white/30">Branch</span>
                          <span className="text-white/50 font-mono">{repo.branch}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white/30">Modified files</span>
                          <span className={`font-mono ${repo.dirtyFiles > 0 ? "text-amber-400" : "text-emerald-400"}`}>{repo.dirtyFiles}</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-white/30">Last commit</span>
                          <p className="text-white/50 mt-0.5">{repo.lastCommitMessage}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex justify-end mt-2">
                  {expanded === repo.name ? <ChevronUp className="h-3 w-3 text-white/20" /> : <ChevronDown className="h-3 w-3 text-white/20" />}
                </div>
              </Card>
            </StaggerItem>
          ))}
        </StaggerGrid>
      )}
    </PageTransition>
  );
}
