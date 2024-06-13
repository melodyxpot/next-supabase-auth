'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function signInOtp(email: string) {
  const supabase = createClient()

  const { error, data } = await supabase.auth.signInWithOtp({ email })

  if (error) {
    redirect('/error')
  }

  return JSON.stringify({ error, data });
}

export const verifyOtp = async (email: string, token: string) => {
  const supabase = createClient();

  const {
    data: { session },
    error
  } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email"
  });

  if (error) {
    return JSON.stringify(error);
  }

  redirect("/private");
};

export async function signup(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}