import { auth } from '../src/lib/auth';

async function main() {
  // Create admin user via Better Auth API (uses correct password hashing)
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@makemyestimate.fr';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  try {
    const result = await auth.api.signUpEmail({
      body: {
        email: adminEmail,
        password: adminPassword,
        name: 'Administrateur',
      },
    });
    console.log('✅ Admin créé via Better Auth:', result.user.email);
  } catch (e: unknown) {
    const error = e as Error;
    if (error.message?.includes('already exists') || error.message?.includes('UNIQUE')) {
      console.log('ℹ️  Admin existe déjà, skip.');
    } else {
      console.error('❌ Erreur:', error.message);
    }
  }

  process.exit(0);
}

main();
