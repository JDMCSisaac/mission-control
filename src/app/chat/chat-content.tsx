"use client";
import { useCallback, useState, useRef, useEffect } from "react";
import { useAutoRefresh } from "@/hooks/use-auto-refresh";
import { useSearchParams } from "next/navigation";
import { PageTransition } from "@/components/motion-wrapper";
import { TabBar } from "@/components/tab-bar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoadingCards } from "@/components/loading-cards";
import { EmptyState } from "@/components/empty-state";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, Send, Mic, MicOff, Terminal, Hash, User, Bot
} from "lucide-react";

const tabs = [
  { id: "chat", label: "Chat", icon: <MessageSquare className="h-3 w-3" /> },
  { id: "command", label: "Command", icon: <Terminal className="h-3 w-3" /> },
];

const CHANNEL_COLORS: Record<string, string> = {
  telegram: "bg-blue-500/15 text-blue-400",
  discord: "bg-indigo-500/15 text-indigo-400",
  system: "bg-white/[0.06] text-white/40",
};

async function fetchChat() {
  const res = await fetch("/api/chat-history");
  return res.json();
}

function formatTime(ts: string) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(ts: string) {
  const d = new Date(ts);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return "Today";
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

export function ChatContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "chat";
  const fetcher = useCallback(() => fetchChat(), []);
  const { data, loading } = useAutoRefresh(fetcher, 10000);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [cmdInput, setCmdInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<Array<{ input: string; output: string }>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sessions = data?.sessions || [];
  const currentSession = sessions.find((s: any) => s.id === (activeSession || sessions[0]?.id));
  const messages_list = currentSession?.messages || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages_list.length]);

  const handleSend = async () => {
    if (!message.trim()) return;
    setSending(true);
    try {
      await fetch("/api/chat-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim(), session: activeSession }),
      });
      setMessage("");
    } finally {
      setSending(false);
    }
  };

  const handleVoice = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (isListening) { setIsListening(false); return; }
    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setMessage(prev => prev + (prev ? " " : "") + transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
    setIsListening(true);
  };

  const handleCmd = async () => {
    if (!cmdInput.trim()) return;
    setCmdHistory(prev => [...prev, { input: cmdInput, output: "Command queued: " + cmdInput }]);
    setCmdInput("");
  };

  if (loading || !data) return <div className="pt-8"><LoadingCards count={4} /></div>;

  // Group messages by date
  let lastDate = "";
  const messageElements: React.ReactNode[] = [];
  messages_list.forEach((msg: any, i: number) => {
    const date = msg.timestamp ? formatDate(msg.timestamp) : "";
    if (date && date !== lastDate) {
      lastDate = date;
      messageElements.push(
        <div key={`date-${i}`} className="flex items-center gap-3 py-3">
          <div className="flex-1 h-px bg-white/[0.06]" />
          <span className="text-[10px] text-white/25 font-medium">{date}</span>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>
      );
    }
    const isUser = msg.role === "user";
    messageElements.push(
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.02 }}
        className={`flex gap-2 ${isUser ? "justify-end" : "justify-start"}`}
      >
        {!isUser && <div className="h-6 w-6 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0 mt-1"><Bot className="h-3 w-3 text-blue-400" /></div>}
        <div className={`max-w-[75%] rounded-2xl px-3.5 py-2 ${isUser ? "bg-blue-500/15 border border-blue-500/10" : "bg-white/[0.04] border border-white/[0.06]"}`}>
          <p className="text-xs text-white/70 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
          <div className="flex items-center gap-2 mt-1">
            {msg.channel && <Badge className={`text-[8px] px-1 py-0 ${CHANNEL_COLORS[msg.channel] || ""}`}>{msg.channel}</Badge>}
            {msg.timestamp && <span className="text-[9px] text-white/20">{formatTime(msg.timestamp)}</span>}
          </div>
        </div>
        {isUser && <div className="h-6 w-6 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0 mt-1"><User className="h-3 w-3 text-white/40" /></div>}
      </motion.div>
    );
  });

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-white/90">Chat</h1>
          <p className="text-xs text-white/30 mt-0.5">{sessions.length} sessions</p>
        </div>
        <TabBar tabs={tabs} layoutId="chat-tab" />
      </div>

      {activeTab === "chat" && (
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-4 h-[calc(100vh-180px)]">
          <Card className="p-2 overflow-y-auto">
            <div className="space-y-1">
              {sessions.map((s: any) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSession(s.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl transition-colors ${
                    (activeSession || sessions[0]?.id) === s.id
                      ? "bg-white/[0.06] border border-white/[0.08]"
                      : "hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    <Hash className="h-3 w-3 text-white/20" />
                    <span className="text-xs font-medium text-white/70 truncate">{s.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge className={`text-[8px] ${CHANNEL_COLORS[s.channel] || ""}`}>{s.channel}</Badge>
                    <span className="text-[10px] text-white/20">{s.messageCount} msgs</span>
                  </div>
                </button>
              ))}
              {sessions.length === 0 && <EmptyState icon={<MessageSquare className="h-6 w-6" />} title="No sessions" />}
            </div>
          </Card>

          <Card className="flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages_list.length === 0 ? (
                <EmptyState icon={<MessageSquare className="h-8 w-8" />} title="No messages" description="Select a session to view messages" />
              ) : messageElements}
              <div ref={messagesEndRef} />
            </div>
            <div className="border-t border-white/[0.06] p-3 flex gap-2">
              <Button size="icon" variant={isListening ? "primary" : "ghost"} onClick={handleVoice} className="shrink-0">
                {isListening ? <Mic className="h-3.5 w-3.5 text-red-400 animate-pulse" /> : <MicOff className="h-3.5 w-3.5" />}
              </Button>
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button size="icon" variant="primary" onClick={handleSend} disabled={sending || !message.trim()} className="shrink-0">
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "command" && (
        <Card className="h-[calc(100vh-180px)] flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-2">
            {cmdHistory.length === 0 && (
              <EmptyState icon={<Terminal className="h-8 w-8" />} title="Command terminal" description="Send commands to your agent" />
            )}
            {cmdHistory.map((cmd, i) => (
              <div key={i}>
                <div className="flex items-center gap-2 text-blue-400">
                  <span className="text-white/20">$</span>
                  <span>{cmd.input}</span>
                </div>
                <div className="text-white/50 pl-4 mt-1">{cmd.output}</div>
              </div>
            ))}
          </div>
          <div className="border-t border-white/[0.06] p-3 flex gap-2">
            <span className="text-blue-400 font-mono text-xs flex items-center">$</span>
            <Input
              value={cmdInput}
              onChange={(e) => setCmdInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCmd()}
              placeholder="Enter command..."
              className="flex-1 font-mono"
            />
            <Button size="icon" variant="primary" onClick={handleCmd} className="shrink-0">
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </Card>
      )}
    </PageTransition>
  );
}
