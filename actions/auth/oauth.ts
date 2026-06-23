// actions/auth/oauth.ts
'use server';

import { createClient } from '@/lib/supabase/server';

export async function signInWithOAuth(provider: 'google' | 'github') {
  const supabase = await createClient();

  const origin =
    typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/api/auth/callback`,
      // GitHub no soporta prompt, pero podemos intentar
      // agregar parámetros personalizados si es necesario
    },
  });

  if (error) {
    console.error('Error signing in with OAuth:', error);
    throw new Error(error.message);
  }

  return { url: data.url };
}

// Función adicional para forzar logout completo
export async function signOutCompletely() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  // Retornar una URL especial que el frontend pueda usar
  return {
    githubLogoutUrl: 'https://github.com/logout',
    redirectUrl: '/',
  };
}
