import { NextResponse } from 'next/server';

export async function GET() {
  const agents = [
    { id: 'isaac', name: 'Isaac', role: 'Primary AI Agent', model: 'claude-opus-4', level: 'L4', status: 'active', workspace: '.', soul: 'Isaac is Jake\'s primary AI agent — managing the credit repair business command center, automating client pipeline operations, and coordinating between Kim and Victor\'s teams.' },
    { id: 'content-agent', name: 'Content Bot', role: 'IG Content Agent', model: 'claude-sonnet-4', level: 'L2', status: 'active', workspace: 'agents/content', soul: 'Creates and schedules Instagram content across @CreditKingsATL, @CreditFixPro, and @StackYourCredit.' },
    { id: 'followup-agent', name: 'Follow-Up Agent', role: 'Lead Follow-Up', model: 'claude-haiku-3.5', level: 'L1', status: 'idle', workspace: 'agents/followup', soul: 'Monitors new DMs and sends follow-up messages to leads who haven\'t responded.' },
  ];
  return NextResponse.json({ agents, stats: { total: 3, active: 2, healthy: 2, unhealthy: 1 } });
}
