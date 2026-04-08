'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Matériaux', href: '/materials', icon: '🔩' },
  { name: 'Nouveau devis', href: '/estimates/new', icon: '➕' },
  { name: 'Paramètres', href: '/settings', icon: '⚙️' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/login');
        },
      },
    });
  }

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-iron-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-iron-200 px-6">
        <span className="text-2xl">🔨</span>
        <span className="text-lg font-bold text-iron-900">Make My Estimate</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-forge-100 text-forge-700'
                  : 'text-iron-600 hover:bg-iron-100 hover:text-iron-900'
              )}
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Déconnexion */}
      <div className="border-t border-iron-200 p-3">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-iron-600 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <span className="text-lg">🚪</span>
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
