import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  // Créer l'utilisateur admin par défaut (Better Auth schema)
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@makemyestimate.fr';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const userId = randomUUID();
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      id: userId,
      email: adminEmail,
      name: 'Administrateur',
      emailVerified: true,
    },
  });

  // Créer le compte credential lié à l'utilisateur
  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingUser) {
    const existingAccount = await prisma.account.findFirst({
      where: { userId: existingUser.id, providerId: 'credential' },
    });

    if (!existingAccount) {
      await prisma.account.create({
        data: {
          id: randomUUID(),
          userId: existingUser.id,
          accountId: existingUser.id,
          providerId: 'credential',
          password: hashedPassword,
        },
      });
    }
  }

  // Infos entreprise par défaut
  await prisma.companyInfo.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      name: 'Mon Entreprise de Ferronnerie',
      address: '12 Rue des Forges',
      city: 'Yenne',
      zipCode: '73170',
      phone: '04 79 00 00 00',
      email: 'contact@ferronnerie.fr',
      siret: '123 456 789 00012',
    },
  });

  // ==========================================================================
  // MATÉRIAUX DE FERRONNERIE — Liste complète enrichie
  // Sources : La Mine de Fer, Déco Fer Forgé, Metalideal, Rossi Fer,
  //           Maison du Fer, Bosi La Forge Artistique, Torbel/Bourguignon
  // Prix indicatifs HT — à ajuster selon vos fournisseurs
  // ==========================================================================

  const materials = [

    // =====================================================================
    // ACIER — Fers plats
    // =====================================================================
    { name: 'Fer plat 20x4mm', category: 'Acier', unit: 'ml', unitPrice: 1.80 },
    { name: 'Fer plat 25x5mm', category: 'Acier', unit: 'ml', unitPrice: 2.30 },
    { name: 'Fer plat 30x6mm', category: 'Acier', unit: 'ml', unitPrice: 3.00 },
    { name: 'Fer plat 35x6mm', category: 'Acier', unit: 'ml', unitPrice: 3.50 },
    { name: 'Fer plat 40x8mm', category: 'Acier', unit: 'ml', unitPrice: 4.50 },
    { name: 'Fer plat 50x8mm', category: 'Acier', unit: 'ml', unitPrice: 5.80 },
    { name: 'Fer plat 50x10mm', category: 'Acier', unit: 'ml', unitPrice: 6.80 },
    { name: 'Fer plat 60x8mm', category: 'Acier', unit: 'ml', unitPrice: 6.50 },
    { name: 'Fer plat 60x10mm', category: 'Acier', unit: 'ml', unitPrice: 8.20 },
    { name: 'Fer plat 70x10mm', category: 'Acier', unit: 'ml', unitPrice: 9.50 },
    { name: 'Fer plat 80x10mm', category: 'Acier', unit: 'ml', unitPrice: 11.00 },
    { name: 'Fer plat 100x10mm', category: 'Acier', unit: 'ml', unitPrice: 13.50 },

    // ACIER — Fers ronds pleins
    { name: 'Fer rond Ø6mm', category: 'Acier', unit: 'ml', unitPrice: 1.20 },
    { name: 'Fer rond Ø8mm', category: 'Acier', unit: 'ml', unitPrice: 1.80 },
    { name: 'Fer rond Ø10mm', category: 'Acier', unit: 'ml', unitPrice: 2.50 },
    { name: 'Fer rond Ø12mm', category: 'Acier', unit: 'ml', unitPrice: 3.20 },
    { name: 'Fer rond Ø14mm', category: 'Acier', unit: 'ml', unitPrice: 4.10 },
    { name: 'Fer rond Ø16mm', category: 'Acier', unit: 'ml', unitPrice: 5.10 },
    { name: 'Fer rond Ø18mm', category: 'Acier', unit: 'ml', unitPrice: 6.20 },
    { name: 'Fer rond Ø20mm', category: 'Acier', unit: 'ml', unitPrice: 7.50 },
    { name: 'Fer rond Ø25mm', category: 'Acier', unit: 'ml', unitPrice: 10.00 },
    { name: 'Fer rond Ø30mm', category: 'Acier', unit: 'ml', unitPrice: 14.00 },

    // ACIER — Fers carrés pleins
    { name: 'Fer carré 8x8mm', category: 'Acier', unit: 'ml', unitPrice: 2.00 },
    { name: 'Fer carré 10x10mm', category: 'Acier', unit: 'ml', unitPrice: 2.80 },
    { name: 'Fer carré 12x12mm', category: 'Acier', unit: 'ml', unitPrice: 4.00 },
    { name: 'Fer carré 14x14mm', category: 'Acier', unit: 'ml', unitPrice: 5.00 },
    { name: 'Fer carré 16x16mm', category: 'Acier', unit: 'ml', unitPrice: 5.50 },
    { name: 'Fer carré 20x20mm', category: 'Acier', unit: 'ml', unitPrice: 8.00 },
    { name: 'Fer carré 25x25mm', category: 'Acier', unit: 'ml', unitPrice: 11.50 },
    { name: 'Fer carré 30x30mm', category: 'Acier', unit: 'ml', unitPrice: 16.00 },

    // ACIER — Tubes carrés
    { name: 'Tube carré 20x20x2mm', category: 'Acier', unit: 'ml', unitPrice: 3.80 },
    { name: 'Tube carré 25x25x2mm', category: 'Acier', unit: 'ml', unitPrice: 4.50 },
    { name: 'Tube carré 30x30x2mm', category: 'Acier', unit: 'ml', unitPrice: 5.50 },
    { name: 'Tube carré 30x30x3mm', category: 'Acier', unit: 'ml', unitPrice: 7.00 },
    { name: 'Tube carré 35x35x2mm', category: 'Acier', unit: 'ml', unitPrice: 6.50 },
    { name: 'Tube carré 40x40x2mm', category: 'Acier', unit: 'ml', unitPrice: 8.50 },
    { name: 'Tube carré 40x40x3mm', category: 'Acier', unit: 'ml', unitPrice: 10.00 },
    { name: 'Tube carré 45x45x2mm', category: 'Acier', unit: 'ml', unitPrice: 9.00 },
    { name: 'Tube carré 50x50x2mm', category: 'Acier', unit: 'ml', unitPrice: 10.50 },
    { name: 'Tube carré 50x50x3mm', category: 'Acier', unit: 'ml', unitPrice: 12.00 },
    { name: 'Tube carré 60x60x2mm', category: 'Acier', unit: 'ml', unitPrice: 12.50 },
    { name: 'Tube carré 60x60x3mm', category: 'Acier', unit: 'ml', unitPrice: 15.00 },
    { name: 'Tube carré 80x80x3mm', category: 'Acier', unit: 'ml', unitPrice: 20.00 },

    // ACIER — Tubes rectangles
    { name: 'Tube rectangle 40x20x2mm', category: 'Acier', unit: 'ml', unitPrice: 5.50 },
    { name: 'Tube rectangle 50x30x2mm', category: 'Acier', unit: 'ml', unitPrice: 7.50 },
    { name: 'Tube rectangle 60x30x2mm', category: 'Acier', unit: 'ml', unitPrice: 8.50 },
    { name: 'Tube rectangle 60x40x2mm', category: 'Acier', unit: 'ml', unitPrice: 9.50 },
    { name: 'Tube rectangle 80x40x2mm', category: 'Acier', unit: 'ml', unitPrice: 11.00 },
    { name: 'Tube rectangle 100x50x3mm', category: 'Acier', unit: 'ml', unitPrice: 16.50 },

    // ACIER — Tubes ronds
    { name: 'Tube rond Ø21.3x2mm', category: 'Acier', unit: 'ml', unitPrice: 4.00 },
    { name: 'Tube rond Ø26.9x2mm', category: 'Acier', unit: 'ml', unitPrice: 5.00 },
    { name: 'Tube rond Ø33.7x2mm', category: 'Acier', unit: 'ml', unitPrice: 6.00 },
    { name: 'Tube rond Ø42.4x2mm', category: 'Acier', unit: 'ml', unitPrice: 7.80 },
    { name: 'Tube rond Ø42.4x2.5mm', category: 'Acier', unit: 'ml', unitPrice: 8.50 },
    { name: 'Tube rond Ø48.3x2.5mm', category: 'Acier', unit: 'ml', unitPrice: 10.00 },
    { name: 'Tube rond Ø60.3x2.5mm', category: 'Acier', unit: 'ml', unitPrice: 12.50 },

    // ACIER — Cornières
    { name: 'Cornière 20x20x3mm', category: 'Acier', unit: 'ml', unitPrice: 2.50 },
    { name: 'Cornière 25x25x3mm', category: 'Acier', unit: 'ml', unitPrice: 3.20 },
    { name: 'Cornière 30x30x3mm', category: 'Acier', unit: 'ml', unitPrice: 4.00 },
    { name: 'Cornière 35x35x4mm', category: 'Acier', unit: 'ml', unitPrice: 5.20 },
    { name: 'Cornière 40x40x4mm', category: 'Acier', unit: 'ml', unitPrice: 6.50 },
    { name: 'Cornière 50x50x5mm', category: 'Acier', unit: 'ml', unitPrice: 9.00 },
    { name: 'Cornière 60x60x6mm', category: 'Acier', unit: 'ml', unitPrice: 12.00 },

    // ACIER — Tés
    { name: 'Fer en T 25x25x4mm', category: 'Acier', unit: 'ml', unitPrice: 4.50 },
    { name: 'Fer en T 30x30x4mm', category: 'Acier', unit: 'ml', unitPrice: 5.50 },
    { name: 'Fer en T 40x40x5mm', category: 'Acier', unit: 'ml', unitPrice: 7.50 },

    // ACIER — U à congés / U pliés
    { name: 'U à congés 30x15mm', category: 'Acier', unit: 'ml', unitPrice: 5.00 },
    { name: 'U à congés 40x20mm', category: 'Acier', unit: 'ml', unitPrice: 6.50 },
    { name: 'U plié à froid 40x20x2mm', category: 'Acier', unit: 'ml', unitPrice: 5.50 },
    { name: 'U plié à froid 50x25x2mm', category: 'Acier', unit: 'ml', unitPrice: 7.00 },

    // ACIER — Poutrelles
    { name: 'IPN 80', category: 'Acier', unit: 'ml', unitPrice: 18.00 },
    { name: 'IPN 100', category: 'Acier', unit: 'ml', unitPrice: 24.00 },
    { name: 'IPE 80', category: 'Acier', unit: 'ml', unitPrice: 16.00 },
    { name: 'IPE 100', category: 'Acier', unit: 'ml', unitPrice: 22.00 },
    { name: 'UPN 80', category: 'Acier', unit: 'ml', unitPrice: 14.00 },
    { name: 'UPN 100', category: 'Acier', unit: 'ml', unitPrice: 18.50 },

    // ACIER — Main courante laminée
    { name: 'Main courante 40x12mm (profil mouluré)', category: 'Acier', unit: 'ml', unitPrice: 12.00 },
    { name: 'Main courante 50x12mm (profil mouluré)', category: 'Acier', unit: 'ml', unitPrice: 14.50 },
    { name: 'Main courante demi-rond 40mm', category: 'Acier', unit: 'ml', unitPrice: 11.00 },

    // ACIER — Tôles
    { name: 'Tôle acier 1.5mm', category: 'Acier', unit: 'm²', unitPrice: 18.00 },
    { name: 'Tôle acier 2mm', category: 'Acier', unit: 'm²', unitPrice: 25.00 },
    { name: 'Tôle acier 3mm', category: 'Acier', unit: 'm²', unitPrice: 35.00 },
    { name: 'Tôle acier 4mm', category: 'Acier', unit: 'm²', unitPrice: 45.00 },
    { name: 'Tôle acier 5mm', category: 'Acier', unit: 'm²', unitPrice: 55.00 },
    { name: 'Tôle acier 6mm', category: 'Acier', unit: 'm²', unitPrice: 65.00 },
    { name: 'Tôle acier 8mm', category: 'Acier', unit: 'm²', unitPrice: 85.00 },
    { name: 'Tôle acier 10mm', category: 'Acier', unit: 'm²', unitPrice: 105.00 },
    { name: 'Tôle larmée 3/5mm', category: 'Acier', unit: 'm²', unitPrice: 48.00 },
    { name: 'Caillebotis maille 30x30 plat 30x2', category: 'Acier', unit: 'm²', unitPrice: 55.00 },

    // ACIER — Barres à trous
    { name: 'Barre à trous plat 40x8 (Ø12, entraxe 120mm)', category: 'Acier', unit: 'ml', unitPrice: 14.00 },
    { name: 'Barre à trous carrée 40x40 (Ø12, entraxe 120mm)', category: 'Acier', unit: 'ml', unitPrice: 18.00 },
    { name: 'Traverse percée plat 40x10 (14x14, entraxe 110mm)', category: 'Acier', unit: 'ml', unitPrice: 16.00 },

    // =====================================================================
    // FER FORGÉ — Barreaux
    // =====================================================================
    { name: 'Barreau lisse rond Ø12 H.1000mm', category: 'Fer forgé', unit: 'pce', unitPrice: 5.50 },
    { name: 'Barreau lisse carré 12x12 H.1000mm', category: 'Fer forgé', unit: 'pce', unitPrice: 6.00 },
    { name: 'Barreau lisse carré 14x14 H.1000mm', category: 'Fer forgé', unit: 'pce', unitPrice: 7.00 },
    { name: 'Barreau torsadé rond Ø12 H.1000mm', category: 'Fer forgé', unit: 'pce', unitPrice: 8.50 },
    { name: 'Barreau torsadé carré 12x12 H.1000mm', category: 'Fer forgé', unit: 'pce', unitPrice: 9.00 },
    { name: 'Barreau torsadé carré 14x14 H.1000mm', category: 'Fer forgé', unit: 'pce', unitPrice: 10.50 },
    { name: 'Barreau martelé rond Ø12 H.1000mm', category: 'Fer forgé', unit: 'pce', unitPrice: 9.50 },
    { name: 'Barreau martelé carré 14x14 H.1000mm', category: 'Fer forgé', unit: 'pce', unitPrice: 11.00 },
    { name: 'Barreau avec motif central Ø12 H.1000mm', category: 'Fer forgé', unit: 'pce', unitPrice: 14.00 },
    { name: 'Barreau double motif Ø12 H.1000mm', category: 'Fer forgé', unit: 'pce', unitPrice: 18.00 },
    { name: 'Barreau losange central 14x14 H.1000mm', category: 'Fer forgé', unit: 'pce', unitPrice: 22.00 },
    { name: 'Barreau double torsade 14x14 H.900mm', category: 'Fer forgé', unit: 'pce', unitPrice: 20.00 },
    { name: 'Barreau avec boule 14x14 H.1200mm', category: 'Fer forgé', unit: 'pce', unitPrice: 16.00 },
    { name: 'Barreau appointé rond Ø12 H.1000mm', category: 'Fer forgé', unit: 'pce', unitPrice: 7.50 },
    { name: 'Barreau appointé carré 14x14 H.1000mm', category: 'Fer forgé', unit: 'pce', unitPrice: 8.50 },

    // =====================================================================
    // FER FORGÉ — Volutes
    // =====================================================================
    { name: 'Volute en S 300x100 rond Ø10', category: 'Fer forgé', unit: 'pce', unitPrice: 5.50 },
    { name: 'Volute en S 300x100 rond Ø12', category: 'Fer forgé', unit: 'pce', unitPrice: 6.50 },
    { name: 'Volute en S 320x100 plat 14x6', category: 'Fer forgé', unit: 'pce', unitPrice: 8.00 },
    { name: 'Volute en S 360x100 plat 14x6 à noyaux', category: 'Fer forgé', unit: 'pce', unitPrice: 10.00 },
    { name: 'Volute en S 360x125 plat 16x8', category: 'Fer forgé', unit: 'pce', unitPrice: 12.00 },
    { name: 'Volute en S 400x150 plat 16x8', category: 'Fer forgé', unit: 'pce', unitPrice: 14.00 },
    { name: 'Volute en C 100x65 plat 14x6', category: 'Fer forgé', unit: 'pce', unitPrice: 4.50 },
    { name: 'Volute en C 155x100 plat 14x6', category: 'Fer forgé', unit: 'pce', unitPrice: 6.00 },
    { name: 'Volute en C 200x125 plat 14x6 à noyau', category: 'Fer forgé', unit: 'pce', unitPrice: 7.50 },
    { name: 'Volute en C 250x150 plat 40x8', category: 'Fer forgé', unit: 'pce', unitPrice: 19.50 },
    { name: 'Volute décorative 860x350 à feuilles', category: 'Fer forgé', unit: 'pce', unitPrice: 45.00 },
    { name: 'Couronnement portail 900x195 rond Ø14', category: 'Fer forgé', unit: 'pce', unitPrice: 55.00 },
    { name: 'Couronnement portail 900x300 carré 14', category: 'Fer forgé', unit: 'pce', unitPrice: 65.00 },

    // =====================================================================
    // DÉCORATION — Rosaces
    // =====================================================================
    { name: 'Rosace décorative Ø100mm', category: 'Décoration', unit: 'pce', unitPrice: 8.00 },
    { name: 'Rosace décorative Ø130mm', category: 'Décoration', unit: 'pce', unitPrice: 10.00 },
    { name: 'Rosace décorative Ø200mm', category: 'Décoration', unit: 'pce', unitPrice: 14.00 },
    { name: 'Rosace décorative Ø250mm', category: 'Décoration', unit: 'pce', unitPrice: 18.00 },
    { name: 'Rosace Ø380mm plat martelé', category: 'Décoration', unit: 'pce', unitPrice: 28.00 },
    { name: 'Rosace Ø600mm plat martelé', category: 'Décoration', unit: 'pce', unitPrice: 45.00 },

    // DÉCORATION — Palmettes
    { name: 'Palmette 200x120mm', category: 'Décoration', unit: 'pce', unitPrice: 12.00 },
    { name: 'Palmette 300x150mm', category: 'Décoration', unit: 'pce', unitPrice: 18.00 },
    { name: 'Palmette 400x200mm', category: 'Décoration', unit: 'pce', unitPrice: 25.00 },

    // DÉCORATION — Feuillages et fleurs
    { name: 'Feuille d\'acanthe 160x70mm', category: 'Décoration', unit: 'pce', unitPrice: 15.00 },
    { name: 'Feuille d\'acanthe 200x100mm', category: 'Décoration', unit: 'pce', unitPrice: 18.00 },
    { name: 'Feuille de vigne 120x100mm', category: 'Décoration', unit: 'pce', unitPrice: 10.00 },
    { name: 'Grappe de raisin avec feuilles', category: 'Décoration', unit: 'pce', unitPrice: 22.00 },
    { name: 'Fleur décorative 110x40mm', category: 'Décoration', unit: 'pce', unitPrice: 8.50 },
    { name: 'Coupelle décorative Ø80mm', category: 'Décoration', unit: 'pce', unitPrice: 6.00 },

    // DÉCORATION — Pointes de lance
    { name: 'Pointe de lance conique H.100 Ø25', category: 'Décoration', unit: 'pce', unitPrice: 4.00 },
    { name: 'Pointe de lance conique H.130 Ø32', category: 'Décoration', unit: 'pce', unitPrice: 5.50 },
    { name: 'Pointe de lance conique H.180 Ø30', category: 'Décoration', unit: 'pce', unitPrice: 7.00 },
    { name: 'Pointe de lance flamme forgée H.150', category: 'Décoration', unit: 'pce', unitPrice: 8.50 },
    { name: 'Pointe de lance lys forgée H.180', category: 'Décoration', unit: 'pce', unitPrice: 12.00 },
    { name: 'Pointe forgée lisse carré 30 H.200', category: 'Décoration', unit: 'pce', unitPrice: 14.00 },

    // DÉCORATION — Boules
    { name: 'Boule creuse Ø30mm', category: 'Décoration', unit: 'pce', unitPrice: 2.50 },
    { name: 'Boule creuse Ø40mm', category: 'Décoration', unit: 'pce', unitPrice: 3.50 },
    { name: 'Boule creuse Ø60mm', category: 'Décoration', unit: 'pce', unitPrice: 5.00 },
    { name: 'Boule creuse Ø80mm', category: 'Décoration', unit: 'pce', unitPrice: 7.00 },
    { name: 'Boule creuse Ø100mm', category: 'Décoration', unit: 'pce', unitPrice: 9.50 },
    { name: 'Boule creuse Ø120mm', category: 'Décoration', unit: 'pce', unitPrice: 12.00 },
    { name: 'Boule creuse Ø150mm', category: 'Décoration', unit: 'pce', unitPrice: 16.00 },
    { name: 'Boule pleine martelée Ø25mm', category: 'Décoration', unit: 'pce', unitPrice: 2.00 },
    { name: 'Boule pleine martelée Ø30mm', category: 'Décoration', unit: 'pce', unitPrice: 3.00 },
    { name: 'Boule pleine martelée Ø40mm', category: 'Décoration', unit: 'pce', unitPrice: 4.50 },
    { name: 'Boule pleine martelée Ø50mm', category: 'Décoration', unit: 'pce', unitPrice: 6.50 },
    { name: 'Boule pleine martelée Ø60mm', category: 'Décoration', unit: 'pce', unitPrice: 9.00 },
    { name: 'Boule pleine martelée Ø70mm', category: 'Décoration', unit: 'pce', unitPrice: 12.00 },
    { name: 'Boule décolletée percée Ø20mm', category: 'Décoration', unit: 'pce', unitPrice: 1.80 },
    { name: 'Pigne de pin Ø60mm', category: 'Décoration', unit: 'pce', unitPrice: 8.00 },
    { name: 'Pigne de pin Ø80mm', category: 'Décoration', unit: 'pce', unitPrice: 11.00 },
    { name: 'Pigne de pin Ø100mm', category: 'Décoration', unit: 'pce', unitPrice: 15.00 },

    // DÉCORATION — Bagues et manchons
    { name: 'Bague simple trou carré 14 Ø40mm', category: 'Décoration', unit: 'pce', unitPrice: 2.50 },
    { name: 'Bague simple trou rond Ø12 Ø40mm', category: 'Décoration', unit: 'pce', unitPrice: 2.50 },
    { name: 'Bague double trou carré 14mm', category: 'Décoration', unit: 'pce', unitPrice: 3.50 },
    { name: 'Manchon décoratif carré 14 H.40mm', category: 'Décoration', unit: 'pce', unitPrice: 3.00 },
    { name: 'Manchon décoratif rond Ø12 H.40mm', category: 'Décoration', unit: 'pce', unitPrice: 3.00 },

    // DÉCORATION — Cercles / Ovales
    { name: 'Cercle Ø100mm plat 12x6', category: 'Décoration', unit: 'pce', unitPrice: 4.50 },
    { name: 'Cercle Ø150mm plat 12x6', category: 'Décoration', unit: 'pce', unitPrice: 6.00 },
    { name: 'Cercle Ø200mm plat 14x6', category: 'Décoration', unit: 'pce', unitPrice: 8.00 },
    { name: 'Élément ovale 155x100mm carré 14', category: 'Décoration', unit: 'pce', unitPrice: 12.00 },

    // DÉCORATION — Panneaux décoratifs
    { name: 'Panneau traditionnel 1000x740 carré 12', category: 'Décoration', unit: 'pce', unitPrice: 85.00 },
    { name: 'Panneau moderne 1000x580 plat 14x8', category: 'Décoration', unit: 'pce', unitPrice: 75.00 },
    { name: 'Panneau décoratif 1000x390 carré 14', category: 'Décoration', unit: 'pce', unitPrice: 55.00 },

    // DÉCORATION — Clés de tirant
    { name: 'Clé de tirant croix 530x90 carré 30', category: 'Décoration', unit: 'pce', unitPrice: 25.00 },
    { name: 'Clé de tirant croix 650x300 carré 30', category: 'Décoration', unit: 'pce', unitPrice: 40.00 },

    // DÉCORATION — Découpe laser
    { name: 'Losange découpe laser 135x135 ép.6mm', category: 'Décoration', unit: 'pce', unitPrice: 8.00 },
    { name: 'Découpe laser motif fleur 200x200mm', category: 'Décoration', unit: 'pce', unitPrice: 15.00 },
    { name: 'Découpe laser chiffre/lettre H.150mm', category: 'Décoration', unit: 'pce', unitPrice: 10.00 },

    // =====================================================================
    // FER FORGÉ — Mains courantes et accessoires rampe
    // =====================================================================
    { name: 'Support main courante mural', category: 'Fer forgé', unit: 'pce', unitPrice: 8.00 },
    { name: 'Support main courante à souder', category: 'Fer forgé', unit: 'pce', unitPrice: 6.50 },
    { name: 'Départ main courante forgé 40x12', category: 'Fer forgé', unit: 'pce', unitPrice: 18.00 },
    { name: 'Arrivée main courante forgé 40x12', category: 'Fer forgé', unit: 'pce', unitPrice: 18.00 },
    { name: 'Coude main courante 40x12', category: 'Fer forgé', unit: 'pce', unitPrice: 22.00 },
    { name: 'Barre cintrée (courbe) à façon', category: 'Fer forgé', unit: 'ml', unitPrice: 15.00 },
    { name: 'Poteau départ rampe carré 30 H.1200', category: 'Fer forgé', unit: 'pce', unitPrice: 35.00 },
    { name: 'Poteau départ rampe fonte H.900', category: 'Fer forgé', unit: 'pce', unitPrice: 65.00 },
    { name: 'Colonne décorative fonte H.1000', category: 'Fer forgé', unit: 'pce', unitPrice: 120.00 },
    { name: 'Pilastre carré 30 martelé H.1200', category: 'Fer forgé', unit: 'pce', unitPrice: 28.00 },
    { name: 'Pilastre carré 25 martelé H.1200', category: 'Fer forgé', unit: 'pce', unitPrice: 22.00 },

    // =====================================================================
    // FIXATION & SCELLEMENT
    // =====================================================================
    { name: 'Platine acier 80x80x6mm (4 trous)', category: 'Fixation', unit: 'pce', unitPrice: 4.50 },
    { name: 'Platine acier 100x100x6mm (4 trous)', category: 'Fixation', unit: 'pce', unitPrice: 6.00 },
    { name: 'Platine acier 120x120x8mm (4 trous)', category: 'Fixation', unit: 'pce', unitPrice: 8.50 },
    { name: 'Platine acier 140x140x10mm (4 trous)', category: 'Fixation', unit: 'pce', unitPrice: 12.00 },
    { name: 'Platine ronde Ø100 ép.6mm', category: 'Fixation', unit: 'pce', unitPrice: 5.50 },
    { name: 'Cache scellement rond Ø63mm', category: 'Fixation', unit: 'pce', unitPrice: 2.00 },
    { name: 'Cache scellement carré 80x80mm', category: 'Fixation', unit: 'pce', unitPrice: 2.50 },
    { name: 'Équerre de renfort 65x65x30mm', category: 'Fixation', unit: 'pce', unitPrice: 3.50 },
    { name: 'Équerre de renfort 65x65x50mm', category: 'Fixation', unit: 'pce', unitPrice: 4.50 },
    { name: 'Scellement chimique cartouche 300ml', category: 'Fixation', unit: 'pce', unitPrice: 15.00 },
    { name: 'Tamis d\'injection Ø16x130 (lot 10)', category: 'Fixation', unit: 'lot', unitPrice: 12.00 },
    { name: 'Tige filetée M10x130 inox', category: 'Fixation', unit: 'pce', unitPrice: 2.50 },
    { name: 'Tige filetée M12x160 inox', category: 'Fixation', unit: 'pce', unitPrice: 3.50 },
    { name: 'Tige filetée M16x200', category: 'Fixation', unit: 'pce', unitPrice: 5.00 },
    { name: 'Boulon d\'ancrage M10 (lot 10)', category: 'Fixation', unit: 'lot', unitPrice: 18.00 },
    { name: 'Boulon d\'ancrage M12 (lot 10)', category: 'Fixation', unit: 'lot', unitPrice: 24.00 },
    { name: 'Cheville mécanique M10 (lot 10)', category: 'Fixation', unit: 'lot', unitPrice: 12.00 },
    { name: 'Vis à béton 7.5x60 (lot 50)', category: 'Fixation', unit: 'lot', unitPrice: 18.00 },

    // =====================================================================
    // QUINCAILLERIE — Gonds et pivots
    // =====================================================================
    { name: 'Gond à sceller Ø14mm', category: 'Quincaillerie', unit: 'pce', unitPrice: 8.50 },
    { name: 'Gond à sceller Ø16mm', category: 'Quincaillerie', unit: 'pce', unitPrice: 12.00 },
    { name: 'Gond à sceller Ø20mm (portail lourd)', category: 'Quincaillerie', unit: 'pce', unitPrice: 18.00 },
    { name: 'Gond à visser Ø14mm', category: 'Quincaillerie', unit: 'pce', unitPrice: 7.00 },
    { name: 'Gond réglable Ø16mm', category: 'Quincaillerie', unit: 'pce', unitPrice: 22.00 },
    { name: 'Kit gonds articulation sphérique (pente)', category: 'Quincaillerie', unit: 'kit', unitPrice: 85.00 },
    { name: 'Pivot de sol pour portail', category: 'Quincaillerie', unit: 'pce', unitPrice: 35.00 },
    { name: 'Crapaudine de sol Ø16mm', category: 'Quincaillerie', unit: 'pce', unitPrice: 12.00 },
    { name: 'Paumelle soudable 80mm', category: 'Quincaillerie', unit: 'pce', unitPrice: 6.00 },
    { name: 'Paumelle soudable 100mm', category: 'Quincaillerie', unit: 'pce', unitPrice: 8.00 },
    { name: 'Paumelle soudable 120mm', category: 'Quincaillerie', unit: 'pce', unitPrice: 10.00 },

    // QUINCAILLERIE — Serrures, verrous, poignées
    { name: 'Serrure portail à encastrer', category: 'Quincaillerie', unit: 'pce', unitPrice: 45.00 },
    { name: 'Serrure portail à appliquer', category: 'Quincaillerie', unit: 'pce', unitPrice: 55.00 },
    { name: 'Serrure à crochet portail coulissant', category: 'Quincaillerie', unit: 'pce', unitPrice: 65.00 },
    { name: 'Poignée de porte forgée', category: 'Quincaillerie', unit: 'pce', unitPrice: 25.00 },
    { name: 'Béquille de porte double', category: 'Quincaillerie', unit: 'paire', unitPrice: 35.00 },
    { name: 'Verrou à targette', category: 'Quincaillerie', unit: 'pce', unitPrice: 15.00 },
    { name: 'Verrou baïonnette', category: 'Quincaillerie', unit: 'pce', unitPrice: 18.00 },
    { name: 'Heurtoir de porte forgé', category: 'Quincaillerie', unit: 'pce', unitPrice: 30.00 },
    { name: 'Olive de guidage portail', category: 'Quincaillerie', unit: 'pce', unitPrice: 8.00 },
    { name: 'Sabot d\'arrêt portail au sol', category: 'Quincaillerie', unit: 'pce', unitPrice: 12.00 },
    { name: 'Ferme-portail automatique', category: 'Quincaillerie', unit: 'pce', unitPrice: 85.00 },
    { name: 'Ferme-portillon à ressort', category: 'Quincaillerie', unit: 'pce', unitPrice: 45.00 },

    // QUINCAILLERIE — Pentures
    { name: 'Penture forgée droite 400mm plat 40x8', category: 'Quincaillerie', unit: 'pce', unitPrice: 18.00 },
    { name: 'Penture forgée droite 600mm plat 40x8', category: 'Quincaillerie', unit: 'pce', unitPrice: 25.00 },
    { name: 'Penture forgée 780mm plat 40x8 martelé', category: 'Quincaillerie', unit: 'pce', unitPrice: 32.00 },
    { name: 'Penture queue de carpe 500mm', category: 'Quincaillerie', unit: 'pce', unitPrice: 35.00 },
    { name: 'Charnière de portillon 100mm', category: 'Quincaillerie', unit: 'paire', unitPrice: 28.00 },

    // QUINCAILLERIE — Portail coulissant
    { name: 'Rail guidage sol 3m (coulissant)', category: 'Quincaillerie', unit: 'pce', unitPrice: 45.00 },
    { name: 'Roue portail coulissant Ø80mm', category: 'Quincaillerie', unit: 'pce', unitPrice: 22.00 },
    { name: 'Roue portail coulissant Ø120mm', category: 'Quincaillerie', unit: 'pce', unitPrice: 35.00 },
    { name: 'Guide roulettes hautes coulissant', category: 'Quincaillerie', unit: 'pce', unitPrice: 28.00 },
    { name: 'Butée fin de course coulissant', category: 'Quincaillerie', unit: 'pce', unitPrice: 15.00 },

    // =====================================================================
    // CONSOMMABLES SOUDURE & ATELIER
    // =====================================================================
    { name: 'Électrodes rutiles Ø2.0mm (1kg)', category: 'Consommables', unit: 'kg', unitPrice: 8.00 },
    { name: 'Électrodes rutiles Ø2.5mm (1kg)', category: 'Consommables', unit: 'kg', unitPrice: 7.50 },
    { name: 'Électrodes rutiles Ø3.2mm (1kg)', category: 'Consommables', unit: 'kg', unitPrice: 7.00 },
    { name: 'Fil MIG acier Ø0.8mm bobine 5kg', category: 'Consommables', unit: 'pce', unitPrice: 18.00 },
    { name: 'Fil MIG acier Ø1.0mm bobine 5kg', category: 'Consommables', unit: 'pce', unitPrice: 18.00 },
    { name: 'Fil MIG acier Ø1.0mm bobine 15kg', category: 'Consommables', unit: 'pce', unitPrice: 48.00 },
    { name: 'Baguette TIG acier Ø1.6mm (1kg)', category: 'Consommables', unit: 'kg', unitPrice: 12.00 },
    { name: 'Baguette TIG acier Ø2.0mm (1kg)', category: 'Consommables', unit: 'kg', unitPrice: 12.00 },
    { name: 'Baguette TIG inox 308L Ø2.0mm (1kg)', category: 'Consommables', unit: 'kg', unitPrice: 28.00 },
    { name: 'Gaz Argon/CO2 bouteille jetable 2.2L', category: 'Consommables', unit: 'pce', unitPrice: 35.00 },
    { name: 'Disque à tronçonner Ø125mm (lot 10)', category: 'Consommables', unit: 'lot', unitPrice: 12.00 },
    { name: 'Disque à tronçonner Ø230mm (lot 5)', category: 'Consommables', unit: 'lot', unitPrice: 15.00 },
    { name: 'Disque à ébarber Ø125mm (lot 5)', category: 'Consommables', unit: 'lot', unitPrice: 10.00 },
    { name: 'Disque à lamelles Ø125 grain 40 (lot 5)', category: 'Consommables', unit: 'lot', unitPrice: 14.00 },
    { name: 'Disque à lamelles Ø125 grain 60 (lot 5)', category: 'Consommables', unit: 'lot', unitPrice: 14.00 },
    { name: 'Disque à lamelles Ø125 grain 80 (lot 5)', category: 'Consommables', unit: 'lot', unitPrice: 14.00 },
    { name: 'Brosse métallique meuleuse Ø125mm', category: 'Consommables', unit: 'pce', unitPrice: 8.00 },
    { name: 'Charbon de forge (sac 25kg)', category: 'Consommables', unit: 'sac', unitPrice: 35.00 },

    // =====================================================================
    // TRAITEMENT & FINITION
    // =====================================================================
    { name: 'Peinture antirouille (pot 2.5L)', category: 'Finition', unit: 'pce', unitPrice: 35.00 },
    { name: 'Peinture finition noire forge (pot 2.5L)', category: 'Finition', unit: 'pce', unitPrice: 42.00 },
    { name: 'Peinture finition couleur RAL (pot 2.5L)', category: 'Finition', unit: 'pce', unitPrice: 48.00 },
    { name: 'Peinture forge noire martelée (pot 2.5L)', category: 'Finition', unit: 'pce', unitPrice: 45.00 },
    { name: 'Peinture fer micacé anticorrosion (pot 2.5L)', category: 'Finition', unit: 'pce', unitPrice: 55.00 },
    { name: 'Vernis métal satiné (pot 1L)', category: 'Finition', unit: 'pce', unitPrice: 18.00 },
    { name: 'Brunisseur à froid (flacon 500ml)', category: 'Finition', unit: 'pce', unitPrice: 22.00 },
    { name: 'Cire de protection patine (pot 500ml)', category: 'Finition', unit: 'pce', unitPrice: 15.00 },
    { name: 'Diluant pour peinture (bidon 2L)', category: 'Finition', unit: 'pce', unitPrice: 12.00 },
    { name: 'Galvanisation à chaud', category: 'Finition', unit: 'm²', unitPrice: 15.00 },
    { name: 'Thermolaquage', category: 'Finition', unit: 'm²', unitPrice: 25.00 },
    { name: 'Métallisation (projection zinc)', category: 'Finition', unit: 'm²', unitPrice: 30.00 },
    { name: 'Sablage / Grenaillage', category: 'Finition', unit: 'm²', unitPrice: 20.00 },
    { name: 'Dérochage / Décapage chimique', category: 'Finition', unit: 'm²', unitPrice: 12.00 },

    // =====================================================================
    // MAIN D'ŒUVRE
    // =====================================================================
    { name: "Main d'œuvre ferronnerie / forge", category: "Main d'œuvre", unit: 'h', unitPrice: 55.00 },
    { name: "Main d'œuvre soudure MIG/TIG", category: "Main d'œuvre", unit: 'h', unitPrice: 60.00 },
    { name: "Main d'œuvre pose / installation", category: "Main d'œuvre", unit: 'h', unitPrice: 50.00 },
    { name: "Main d'œuvre conception / dessin", category: "Main d'œuvre", unit: 'h', unitPrice: 45.00 },
    { name: "Main d'œuvre finition / peinture", category: "Main d'œuvre", unit: 'h', unitPrice: 42.00 },
    { name: "Main d'œuvre meulage / ajustage", category: "Main d'œuvre", unit: 'h', unitPrice: 48.00 },
    { name: "Main d'œuvre montage atelier", category: "Main d'œuvre", unit: 'h', unitPrice: 50.00 },
    { name: "Aide / manœuvre", category: "Main d'œuvre", unit: 'h', unitPrice: 35.00 },

    // =====================================================================
    // DIVERS
    // =====================================================================
    { name: 'Déplacement / Livraison', category: 'Divers', unit: 'forfait', unitPrice: 80.00 },
    { name: 'Déplacement (frais kilométriques)', category: 'Divers', unit: 'km', unitPrice: 0.65 },
    { name: 'Prise de cotes sur site', category: 'Divers', unit: 'forfait', unitPrice: 80.00 },
    { name: 'Étude et plans de fabrication', category: 'Divers', unit: 'forfait', unitPrice: 150.00 },
    { name: 'Location nacelle / échafaudage (jour)', category: 'Divers', unit: 'jour', unitPrice: 120.00 },
    { name: 'Évacuation gravats / déchets', category: 'Divers', unit: 'forfait', unitPrice: 60.00 },
  ];

  for (const mat of materials) {
    await prisma.material.create({ data: mat });
  }

  console.log(`✅ Seed terminé : ${materials.length} matériaux créés.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });