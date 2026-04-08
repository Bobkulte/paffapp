import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getMaterialById, updateMaterial, deleteMaterial } from '@/services/materialService';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const material = await getMaterialById(params.id);
  if (!material) {
    return NextResponse.json({ error: 'Matériau introuvable' }, { status: 404 });
  }

  return NextResponse.json(material);
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
  const material = await updateMaterial(params.id, body);
  return NextResponse.json(material);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  await deleteMaterial(params.id);
  return NextResponse.json({ success: true });
}
