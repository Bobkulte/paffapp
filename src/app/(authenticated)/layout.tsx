import Sidebar from '@/components/layout/Sidebar';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-iron-50">
        {children}
      </main>
    </div>
  );
}
