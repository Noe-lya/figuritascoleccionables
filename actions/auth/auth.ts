'use server';
import { createClient } from '@/lib/supabase/server';

export async function login(formData: { email: string; password: string }) {
  const supabase = await createClient();

  const { error, data } = await supabase.auth.signInWithPassword(formData);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: 'Usuario autenticado exitosamente',
    data,
  };
}

export async function signup(formData: {
  name: string;
  email: string;
  password: string;
}) {
  console.log('🔴 [SERVER] signup llamado con:', {
    email: formData.email,
    name: formData.name,
    passwordLength: formData.password.length,
  });

  try {
    const supabase = await createClient();
    console.log('🔵 [SERVER] Cliente Supabase creado');

    const { error, data } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          name: formData.name,
        },
      },
    });

    console.log('🟡 [SERVER] Respuesta de Supabase:', {
      hasError: !!error,
      hasData: !!data,
      error: error?.message,
      userId: data?.user?.id,
    });

    if (error) {
      console.error('❌ [SERVER] Error de Supabase:', error);
      return {
        success: false,
        message: error.message,
      };
    }

    console.log('✅ [SERVER] Usuario creado exitosamente');
    return {
      success: true,
      message: 'Usuario autenticado exitosamente',
      data,
    };
  } catch (err) {
    console.error('💥 [SERVER] Error catastrófico:', err);
    throw err;
  }
}

export async function signin(credentials: { email: string; password: string }) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    throw new Error(error.message);
  }
  // Verifica que el usuario se haya creado
  if (!data.user) {
    return { success: false, error: 'No se pudo crear el usuario' };
  }

  return { success: true, user: data.user };
}

export async function sendRecoveryEmail(formData: { email: string }) {
  const supabase = await createClient();
  const { error, data } = await supabase.auth.resetPasswordForEmail(
    formData.email
  );

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }
  return {
    success: true,
    message:
      'Correo de recuperación enviado exitosamente. Revisa tu bandeja de entrada.',
    data,
  };
}
export async function updatePassword(formData: { password: string }) {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: formData.password,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: 'Contraseña actualizada exitosamente' };
}
