import { prisma } from '@/lib/prisma';

export async function getCompanyInfo() {
  return prisma.companyInfo.findFirst();
}

export async function updateCompanyInfo(data: {
  name?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  siret?: string;
  tvaNumber?: string;
  logo?: string;
}) {
  const existing = await prisma.companyInfo.findFirst();

  if (existing) {
    return prisma.companyInfo.update({
      where: { id: existing.id },
      data,
    });
  }

  return prisma.companyInfo.create({
    data: {
      name: data.name || 'Mon entreprise',
      ...data,
    },
  });
}
