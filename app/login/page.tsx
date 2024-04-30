"use client";
import BackButton from "@/components/BackButton";
import { ChangeEvent, FormEvent, useState } from "react";
import { signInOtp, verifyOtp } from "@/utils/auth";
import { Button, Input } from "@supabase/ui";
import LoginForm from "./_components/login-form";
import OtpForm from "./_components/otp-form";

export interface AuthState {
  email: string;
  otp: string;
}

const initialAuth: AuthState = {
  email: "",
  otp: ""
};

export default function Login() {
  const [pendingStatus, setPendingStatus] = useState<boolean>(false);
  const [authState, setAuthState] = useState<AuthState>(initialAuth);

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <BackButton />
      {pendingStatus ? (
        <OtpForm
          state={authState}
          setState={setAuthState}
          setPendingStatus={setPendingStatus}
        />
      ) : (
        <LoginForm
          state={authState}
          setState={setAuthState}
          setPendingStatus={setPendingStatus}
        />
      )}
    </div>
  );
}
