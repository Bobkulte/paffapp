import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getAllEstimates, createEstimate } from '@/services/estimateService';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const estimates = await getAllEstimates(session.user.id);
  return NextResponse.json(estimates);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const body = await request.json();

  if (!body.clientName) {
    return NextResponse.json({ error: 'Le nom du client est requis' }, { status: 400 });
  }

  if (!body.lines || body.lines.length === 0) {
    return NextResponse.json({ error: 'Au moins une ligne est requise' }, { status: 400 });
  }

  const estimate = await createEstimate({ ...body, userId: session.user.id });
  return NextResponse.json(estimate, { status: 201 });
}
