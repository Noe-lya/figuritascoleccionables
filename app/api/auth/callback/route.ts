import { type EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const { searchParams } = requestUrl;

  // Parámetros para OAuth
  const code = searchParams.get('code');

  // Parámetros para OTP (email verification, recovery, etc.)
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;

  const next = searchParams.get('next') ?? '/dashboard';

  const supabase = await createClient();

  // ============ OAuth Callback (Google/GitHub) ============
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Redirigir al dashboard o página siguiente
      return NextResponse.redirect(`${requestUrl.origin}${next}`);
    }

    console.error('Error exchanging code for session:', error);
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=auth_failed`
    );
  }

  // ============ OTP Callback (Email verification, recovery, etc.) ============
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      // Redirigir según el tipo de verificación
      if (type === 'signup' || type === 'email') {
        return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
      }

      if (type === 'recovery') {
        return NextResponse.redirect(`${requestUrl.origin}/update-password`);
      }

      if (type === 'invite') {
        return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
      }

      // Para otros tipos, redirigir a la página siguiente o dashboard
      return NextResponse.redirect(`${requestUrl.origin}${next}`);
    }

    console.error('Error verifying OTP:', error);
  }

  // Si no hay código ni token_hash, o hubo un error, redirigir a error
  return NextResponse.redirect(
    `${requestUrl.origin}/login?error=invalid_callback`
  );
}
