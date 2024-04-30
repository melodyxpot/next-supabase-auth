import React, { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { AuthState } from "../page";
import { verifyOtp } from "@/utils/auth";
import { Button, Input } from "@supabase/ui";

interface Props {
  state: AuthState;
  setState: Dispatch<SetStateAction<AuthState>>;
  setPendingStatus: Dispatch<SetStateAction<boolean>>;
}

export default function OtpForm({ state, setState, setPendingStatus }: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [otpError, setOtpError] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state.otp === "") {
      return setOtpError("Please enter the code");
    }
    setLoading(true);

    const errorMsg = await verifyOtp(state.email, state.otp);

    if (errorMsg) {
      setOtpError(JSON.parse(errorMsg));
      return;
    }

    setLoading(false);
  };

  return (
    <form
      className="animate-in flex w-full justify-center items-center gap-2 text-foreground"
      onSubmit={handleSubmit}
    >
      <Input
        name="otp"
        placeholder="Digital Code"
        onChange={(e) => setState({ ...state, otp: e.currentTarget.value })}
        value={state.otp}
        error={otpError}
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
  );
}
