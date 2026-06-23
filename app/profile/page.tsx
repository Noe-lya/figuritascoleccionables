'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { LayoutGrid } from 'lucide-react';
import Link from 'next/link';

const rarityColors: Record<string, string> = {
  common: '#aaaaaa',
  rare: '#4488ff',
  epic: '#aa44ff',
  legendary: '#ffaa00',
};

const rarityLabels: Record<string, string> = {
  common: 'COMÚN',
  rare: 'RARA',
  epic: 'ÉPICA',
  legendary: 'LEGENDARIA',
};

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const [userCards, setUserCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/');
  }

  useEffect(() => {
    async function loadCards() {
      if (!user) return;

      const { data, error } = await supabase
        .from('user_cards')
        .select('obtained_at, cards(*)')
        .order('obtained_at', { ascending: false });

      if (error) {
        console.error('Error cargando cartas:', error);
      } else {
        setUserCards(data || []);
      }
      setLoading(false);
    }

    loadCards();
  }, [user]);

  const countByRarity = userCards.reduce((acc: Record<string, number>, uc) => {
    const rarity = (uc.cards as any)?.rarity;
    if (rarity) acc[rarity] = (acc[rarity] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen px-6 py-6">
      {/* Nav */}
      <nav className="flex justify-between items-center mb-8">
        <div className="text-xl font-extrabold tracking-tight flex items-center gap-3">
          <LayoutGrid size={32} />
          Mi Colección
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground underline underline-offset-4"
          >
            ← Volver
          </Link>
          <button
            onClick={handleSignOut}
            className="text-sm text-muted-foreground underline underline-offset-4"
          >
            Cerrar sesión
          </button>
        </div>
      </nav>

      {/* Info usuario */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">{user?.name}</h2>
        <p className="text-muted-foreground text-sm">{user?.email}</p>
        <p className="text-sm mt-1">
          Total de cartas: <span className="font-bold">{userCards.length}</span>
        </p>

        {/* Conteo por rareza */}
        <div className="flex gap-4 mt-3 flex-wrap">
          {Object.entries(countByRarity).map(([rarity, count]) => (
            <span
              key={rarity}
              style={{ color: rarityColors[rarity] }}
              className="text-xs font-bold"
            >
              {rarityLabels[rarity] || rarity}: {count}
            </span>
          ))}
        </div>
      </div>

      {/* Cartas */}
      {loading ? (
        <p className="text-muted-foreground">Cargando cartas...</p>
      ) : userCards.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground mb-4">Todavía no tenés cartas.</p>
          <Link
            href="/pack"
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-8 rounded-full"
          >
            🎴 Abrir un sobre
          </Link>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {userCards.map((uc, i) => {
            const card = uc.cards as any;
            return (
              <div
                key={i}
                style={{ borderColor: rarityColors[card.rarity] }}
                className="border-2 rounded-2xl p-5 w-44 text-center flex flex-col items-center gap-2 bg-white/5"
              >
                <div className="text-4xl">🚗</div>
                <h3 className="font-bold text-sm leading-tight">{card.name}</h3>
                <span
                  style={{ color: rarityColors[card.rarity] }}
                  className="text-xs font-extrabold"
                >
                  {rarityLabels[card.rarity]}
                </span>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
