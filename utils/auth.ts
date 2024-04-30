"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const signInOtp = async (email: string) => {
  const supabase = createClient();

  const { error, data } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true }
  });

  return JSON.stringify({ data, error });
};

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

  redirect("/protected");
};
