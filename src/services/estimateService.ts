import { prisma } from '@/lib/prisma';

export async function getAllEstimates(userId: string) {
  return prisma.estimate.findMany({
    where: { userId },
    include: { lines: { orderBy: { order: 'asc' } } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getEstimateById(id: string) {
  return prisma.estimate.findUnique({
    where: { id },
    include: { lines: { orderBy: { order: 'asc' } } },
  });
}

export async function generateReference(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `DEV-${year}-`;

  const lastEstimate = await prisma.estimate.findFirst({
    where: { reference: { startsWith: prefix } },
    orderBy: { reference: 'desc' },
  });

  if (!lastEstimate) {
    return `${prefix}0001`;
  }

  const lastNumber = parseInt(lastEstimate.reference.replace(prefix, ''), 10);
  const nextNumber = (lastNumber + 1).toString().padStart(4, '0');
  return `${prefix}${nextNumber}`;
}

function calculateTotals(lines: { quantity: number; unitPrice: number }[], tvaRate: number) {
  const totalHT = lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);
  const totalTVA = totalHT * (tvaRate / 100);
  const totalTTC = totalHT + totalTVA;
  return {
    totalHT: Math.round(totalHT * 100) / 100,
    totalTVA: Math.round(totalTVA * 100) / 100,
    totalTTC: Math.round(totalTTC * 100) / 100,
  };
}

export async function createEstimate(data: {
  userId: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  clientAddress?: string;
  clientCity?: string;
  clientZipCode?: string;
  date?: string;
  validityDate?: string;
  tvaRate?: number;
  notes?: string;
  lines: {
    designation: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    materialId?: string;
    order: number;
  }[];
}) {
  const reference = await generateReference();
  const tvaRate = data.tvaRate ?? 20;
  const totals = calculateTotals(data.lines, tvaRate);

  return prisma.estimate.create({
    data: {
      reference,
      userId: data.userId,
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientPhone: data.clientPhone,
      clientAddress: data.clientAddress,
      clientCity: data.clientCity,
      clientZipCode: data.clientZipCode,
      date: data.date ? new Date(data.date) : new Date(),
      validityDate: data.validityDate ? new Date(data.validityDate) : null,
      tvaRate,
      notes: data.notes,
      ...totals,
      lines: {
        create: data.lines.map((line) => ({
          designation: line.designation,
          quantity: line.quantity,
          unit: line.unit,
          unitPrice: line.unitPrice,
          totalHT: Math.round(line.quantity * line.unitPrice * 100) / 100,
          materialId: line.materialId,
          order: line.order,
        })),
      },
    },
    include: { lines: { orderBy: { order: 'asc' } } },
  });
}

export async function updateEstimate(
  id: string,
  data: {
    clientName?: string;
    clientEmail?: string;
    clientPhone?: string;
    clientAddress?: string;
    clientCity?: string;
    clientZipCode?: string;
    date?: string;
    validityDate?: string;
    tvaRate?: number;
    notes?: string;
    status?: string;
    lines?: {
      designation: string;
      quantity: number;
      unit: string;
      unitPrice: number;
      materialId?: string;
      order: number;
    }[];
  }
) {
  const existing = await prisma.estimate.findUnique({ where: { id } });
  if (!existing) throw new Error('Devis introuvable');

  const tvaRate = data.tvaRate ?? existing.tvaRate;

  let totals = { totalHT: existing.totalHT, totalTVA: existing.totalTVA, totalTTC: existing.totalTTC };
  if (data.lines) {
    totals = calculateTotals(data.lines, tvaRate);
    // Supprimer les anciennes lignes et recréer
    await prisma.estimateLine.deleteMany({ where: { estimateId: id } });
  }

  return prisma.estimate.update({
    where: { id },
    data: {
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientPhone: data.clientPhone,
      clientAddress: data.clientAddress,
      clientCity: data.clientCity,
      clientZipCode: data.clientZipCode,
      date: data.date ? new Date(data.date) : undefined,
      validityDate: data.validityDate ? new Date(data.validityDate) : undefined,
      tvaRate,
      notes: data.notes,
      status: data.status,
      ...totals,
      ...(data.lines
        ? {
            lines: {
              create: data.lines.map((line) => ({
                designation: line.designation,
                quantity: line.quantity,
                unit: line.unit,
                unitPrice: line.unitPrice,
                totalHT: Math.round(line.quantity * line.unitPrice * 100) / 100,
                materialId: line.materialId,
                order: line.order,
              })),
            },
          }
        : {}),
    },
    include: { lines: { orderBy: { order: 'asc' } } },
  });
}

export async function deleteEstimate(id: string) {
  return prisma.estimate.delete({ where: { id } });
}

export async function duplicateEstimate(id: string, userId: string) {
  const original = await getEstimateById(id);
  if (!original) throw new Error('Devis introuvable');

  const reference = await generateReference();

  return prisma.estimate.create({
    data: {
      reference,
      userId,
      clientName: original.clientName,
      clientEmail: original.clientEmail,
      clientPhone: original.clientPhone,
      clientAddress: original.clientAddress,
      clientCity: original.clientCity,
      clientZipCode: original.clientZipCode,
      date: new Date(),
      tvaRate: original.tvaRate,
      notes: original.notes,
      totalHT: original.totalHT,
      totalTVA: original.totalTVA,
      totalTTC: original.totalTTC,
      status: 'DRAFT',
      lines: {
        create: original.lines.map((line) => ({
          designation: line.designation,
          quantity: line.quantity,
          unit: line.unit,
          unitPrice: line.unitPrice,
          totalHT: line.totalHT,
          materialId: line.materialId,
          order: line.order,
        })),
      },
    },
    include: { lines: { orderBy: { order: 'asc' } } },
  });
}
