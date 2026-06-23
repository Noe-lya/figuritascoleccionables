import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { data: cards } = await supabase.from('cards').select('*');
  if (!cards || cards.length === 0)
    return NextResponse.json({ error: 'No hay cartas' }, { status: 500 });

  // Elegir 5 cartas por probabilidad
  const selected = [];
  for (let i = 0; i < 5; i++) {
    const rand = Math.random();
    let cumulative = 0;
    for (const card of cards) {
      cumulative += card.probability;
      if (rand <= cumulative) {
        selected.push(card);
        break;
      }
    }
  }

  // Guardar en user_cards
  await supabase
    .from('user_cards')
    .insert(selected.map((card) => ({ user_id: user.id, card_id: card.id })));

  return NextResponse.json({ cards: selected });
}
