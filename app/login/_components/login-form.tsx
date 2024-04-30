import React, { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { AuthState } from "../page";
import { Button, Input } from "@supabase/ui";
import { signInOtp } from "@/utils/auth";

interface Props {
  state: AuthState;
  setState: Dispatch<SetStateAction<AuthState>>;
  setPendingStatus: Dispatch<SetStateAction<boolean>>;
}
export default function LoginForm({
  state,
  setState,
  setPendingStatus
}: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state.email === "") {
      return setEmailError("Email is required");
    }
    setLoading(true);

    const responseData = await signInOtp(state.email);
    const { data, error } = JSON.parse(responseData);

    if (error) {
      setEmailError(error);
      return;
    }
    console.log("--- SignOtp ---", data);

    setPendingStatus(true);
    setLoading(false);
  };

  return (
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
        error={emailError}
        onChange={(e) => setState({ ...state, email: e.currentTarget.value })}
        value={state.email}
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
  );
}
