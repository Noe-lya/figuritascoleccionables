'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
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

export default function PackPage() {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [opened, setOpened] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  async function openPack() {
    setLoading(true);
    setOpened(false);

    const res = await fetch('/api/open-pack', { method: 'POST' });
    if (res.status === 401) {
      router.push('/');
      return;
    }

    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Data:', data);
    setCards(data.cards || []); // ← || [] evita el crash
    setOpened(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <Link
        href="/dashboard"
        className="text-sm text-muted-foreground underline underline-offset-4 mb-4"
      >
        ← Volver al inicio
      </Link>
      <h1 className="text-4xl font-extrabold mb-2">🚗 Pack Opening</h1>
      <p className="text-muted-foreground mb-8">
        Abrí un sobre y conseguí 5 autos
      </p>

      <button
        onClick={openPack}
        disabled={loading}
        className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-8 rounded-full text-lg transition-all mb-10 disabled:opacity-50"
      >
        {loading ? 'Abriendo...' : '🎴 Abrir sobre'}
      </button>

      {opened && (
        <div className="flex flex-wrap gap-4 justify-center">
          {cards.map((card, i) => (
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
          ))}
        </div>
      )}
    </div>
  );
}
