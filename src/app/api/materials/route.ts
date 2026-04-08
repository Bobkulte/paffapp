import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getAllMaterials, createMaterial, searchMaterials } from '@/services/materialService';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const query = request.nextUrl.searchParams.get('q');
  const materials = query ? await searchMaterials(query) : await getAllMaterials();
  return NextResponse.json(materials);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const body = await request.json();
  const { name, category, unit, unitPrice, description } = body;

  if (!name || !category || !unit || unitPrice === undefined) {
    return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
  }

  const material = await createMaterial({
    name,
    category,
    unit,
    unitPrice: Number(unitPrice),
    description,
  });
  return NextResponse.json(material, { status: 201 });
}
