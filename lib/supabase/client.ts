import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  // Create a supabase client on the browser with project's credentials
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
  // dentro de createClient, antes de crear el cliente
  console.log('🔑 SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log(
    '🔑 SUPABASE_PUBLISHABLE_KEY:',
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}
