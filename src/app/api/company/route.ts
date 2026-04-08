import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getCompanyInfo, updateCompanyInfo } from '@/services/companyService';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const company = await getCompanyInfo();
  return NextResponse.json(company);
}

export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const body = await request.json();
  const company = await updateCompanyInfo(body);
  return NextResponse.json(company);
}
