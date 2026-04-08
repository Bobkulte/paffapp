import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getEstimateById } from '@/services/estimateService';
import { getCompanyInfo } from '@/services/companyService';
import { renderToBuffer } from '@react-pdf/renderer';
import EstimatePDF from '@/components/estimates/EstimatePDF';
import { Estimate, CompanyInfo } from '@/models/types';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const [estimate, company] = await Promise.all([
    getEstimateById(params.id),
    getCompanyInfo(),
  ]);

  if (!estimate) {
    return NextResponse.json({ error: 'Devis introuvable' }, { status: 404 });
  }

  if (!company) {
    return NextResponse.json({ error: 'Infos entreprise non configurées' }, { status: 400 });
  }

  const buffer = await renderToBuffer(
    EstimatePDF({
      estimate: estimate as unknown as Estimate,
      company: company as CompanyInfo,
    })
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${estimate.reference}.pdf"`,
    },
  });
}
