import { prisma } from '@/lib/prisma';

export async function getAllMaterials() {
  return prisma.material.findMany({
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
  });
}

export async function getMaterialById(id: string) {
  return prisma.material.findUnique({ where: { id } });
}

export async function createMaterial(data: {
  name: string;
  category: string;
  unit: string;
  unitPrice: number;
  description?: string;
}) {
  return prisma.material.create({ data });
}

export async function updateMaterial(
  id: string,
  data: {
    name?: string;
    category?: string;
    unit?: string;
    unitPrice?: number;
    description?: string;
  }
) {
  return prisma.material.update({ where: { id }, data });
}

export async function deleteMaterial(id: string) {
  return prisma.material.delete({ where: { id } });
}

export async function getMaterialsByCategory(category: string) {
  return prisma.material.findMany({
    where: { category },
    orderBy: { name: 'asc' },
  });
}

export async function searchMaterials(query: string) {
  return prisma.material.findMany({
    where: {
      OR: [
        { name: { contains: query } },
        { category: { contains: query } },
      ],
    },
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
  });
}
