'use client';
import { LayoutGrid } from 'lucide-react';
import { AvatarBadge } from '@/components/AvatarBadge';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <>
      <nav className="flex justify-between px-6 py-6 ">
        <div className="text-xl font-extrabold tracking-tight flex items-center gap-3">
          <LayoutGrid size={32} />
          Figuritas Coleccionables
        </div>
        <div className="ml-10">
          {user && (
            <Link href="/profile">
              <AvatarBadge name={user?.name} avatar_url={user?.avatar_url} />
            </Link>
          )}
        </div>
      </nav>
      <main className="flex flex-col items-center justify-center flex-1 gap-6 py-12">
        <h2 className="text-2xl font-bold">¿Listo para abrir un sobre?</h2>
        <Link
          href="/pack"
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-8 rounded-full text-lg transition-all"
        >
          🎴 Ir al Pack Opening
        </Link>
        <Link
          href="/profile"
          className="text-muted-foreground underline underline-offset-4 text-sm"
        >
          Ver mi colección
        </Link>
      </main>
    </>
  );
}
