import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getEstimateById, updateEstimate, deleteEstimate } from '@/services/estimateService';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const estimate = await getEstimateById(params.id);
  if (!estimate) {
    return NextResponse.json({ error: 'Devis introuvable' }, { status: 404 });
  }

  return NextResponse.json(estimate);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const body = await request.json();
  const estimate = await updateEstimate(params.id, body);
  return NextResponse.json(estimate);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  await deleteEstimate(params.id);
  return NextResponse.json({ success: true });
}
