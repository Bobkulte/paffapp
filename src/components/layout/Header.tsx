'use client';

import { authClient } from '@/lib/auth-client';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const { data: session } = authClient.useSession();

  return (
    <header className="flex h-16 items-center justify-between border-b border-iron-200 bg-white px-6">
      <h1 className="text-xl font-semibold text-iron-900">{title}</h1>
      {session?.user && (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-forge-100 text-sm font-medium text-forge-700">
            {session.user.name?.charAt(0).toUpperCase() ?? '?'}
          </div>
          <span className="text-sm text-iron-600">{session.user.name}</span>
        </div>
      )}
    </header>
  );
}
