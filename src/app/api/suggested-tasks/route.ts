import { NextResponse } from 'next/server';
import { CREDIT_REPAIR_TASKS } from '@/lib/credit-repair-data';

export async function GET() {
  return NextResponse.json({ tasks: CREDIT_REPAIR_TASKS });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ ok: true, id: body.id, status: body.status });
}
