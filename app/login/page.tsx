"use client";
import BackButton from "@/components/BackButton";
import { ChangeEvent, FormEvent, useState } from "react";
import { signInOtp, verifyOtp } from "@/utils/auth";
import { Button, Input } from "@supabase/ui";

interface AuthState {
  email: string;
  otp: string;
}

const initialAuth: AuthState = {
  email: "",
  otp: ""
};

export default function Login() {
  const [pendingStatus, setPendingStatus] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [authState, setAuthState] = useState<AuthState>(initialAuth);
  const [authError, setAuthError] = useState<AuthState>(initialAuth);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    if (authState.email === "") {
      return setAuthError({ email: "Email is required", otp: "" });
    }

    const responseData = await signInOtp(authState.email);
    const { data, error } = JSON.parse(responseData);

    if (error) {
      setAuthError({ email: error, otp: "" });
      return;
    }
    console.log("--- SignOtp ---", data);

    setPendingStatus(true);
    setLoading(false);
  };

  const handleOtpSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    if (authState.otp === "") {
      return setAuthError({ email: "", otp: "Please enter the code" });
    }

    const errorMsg = await verifyOtp(authState.email, authState.otp);

    if (errorMsg) {
      setAuthError({ email: "", otp: JSON.parse(errorMsg) });
      return;
    }

    setLoading(false);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) =>
    setAuthState({
      ...authState,
      [e.currentTarget.name]: e.currentTarget.value
    });

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <BackButton />
      {pendingStatus ? (
        <form
          className="animate-in flex w-full justify-center items-center gap-2 text-foreground"
          onSubmit={handleOtpSubmit}
        >
          <Input
            name="otp"
            placeholder="Digital Code"
            className=""
            onChange={handleInputChange}
            value={authState.otp}
            error={authError.otp}
          />
          <Button
            type="primary"
            placeholder={"Sign In"}
            disabled={loading}
            loading={loading}
            size="medium"
            htmlType="submit"
          >
            Verify
          </Button>
        </form>
      ) : (
        <form
          className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
          onSubmit={handleSubmit}
        >
          <label className="text-md" htmlFor="email">
            Email
          </label>
          <Input
            name="email"
            placeholder="you@example.com"
            error={authError.email}
            onChange={handleInputChange}
            value={authState.email}
          />
          <Button
            type="primary"
            placeholder={"Sign In"}
            disabled={loading}
            loading={loading}
            size="medium"
            block
            htmlType="submit"
          >
            Sign In
          </Button>
        </form>
      )}
    </div>
  );
}
