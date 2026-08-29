"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowRight,
  HeartPulse,
  MailCheck,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import MedCoreLoader from "@/components/shared/MedCoreLoader";

export default function VerifyEmailPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [resending, setResending] = useState(false);

  // --------------------------------------------------
  // Get Registered Account
  // --------------------------------------------------

  useEffect(() => {
    const storedAccount =
      localStorage.getItem("medcore_account");

    if (!storedAccount) {
      router.replace("/register");
      return;
    }

    try {
      const account = JSON.parse(storedAccount);

      setEmail(account.email);
    } catch (error) {
      console.error("Account parsing error:", error);

      localStorage.removeItem("medcore_account");

      router.replace("/register");
    }
  }, [router]);

  // --------------------------------------------------
  // Verify Email
  // --------------------------------------------------

  const handleVerify = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (otp.length !== 6) {
      toast.error("Invalid verification code", {
        description:
          "Please enter the 6-digit verification code.",
      });

      return;
    }

    const storedAccount =
      localStorage.getItem("medcore_account");

    if (!storedAccount) {
      toast.error("Account not found", {
        description:
          "Please create a MedCore account first.",
      });

      router.push("/register");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate verification request
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );

      const account = JSON.parse(storedAccount);

      /*
       * Frontend-only demo:
       * Any 6-digit OTP is accepted.
       */
      account.emailVerified = true;

      localStorage.setItem(
        "medcore_account",
        JSON.stringify(account)
      );

      toast.success("Email verified successfully!", {
        description:
          "Your MedCore account is ready to use.",
      });

      // Give toast time to display
      await new Promise((resolve) =>
        setTimeout(resolve, 800)
      );

      router.push("/login");
    } catch (error) {
      console.error("Email verification error:", error);

      toast.error("Verification failed", {
        description:
          "Something went wrong. Please try again.",
      });

      setIsLoading(false);
    }
  };

  // --------------------------------------------------
  // Resend Verification Code
  // --------------------------------------------------

  const handleResend = async () => {
    setResending(true);

    try {
      await new Promise((resolve) =>
        setTimeout(resolve, 800)
      );

      toast.success("Verification code resent", {
        description:
          "For this frontend demo, enter any 6-digit code.",
      });
    } catch (error) {
      console.error("Resend error:", error);

      toast.error("Unable to resend code", {
        description:
          "Please try again.",
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-5">

      {/* ================================================= */}
      {/* MEDCORE LOADER */}
      {/* ================================================= */}

      {isLoading && <MedCoreLoader />}

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-cyan-950 to-slate-950" />

      {/* Decorative Glow */}
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="absolute -bottom-40 -right-20 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="border-white/20 bg-white/95 shadow-2xl shadow-black/30 backdrop-blur-xl dark:bg-slate-950/95">

          {/* Header */}
          <CardHeader className="space-y-5 text-center">

            {/* Icon */}
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 ring-8 ring-cyan-50/50 dark:bg-cyan-950 dark:ring-cyan-950/50">
                <MailCheck className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
              </div>
            </div>

            {/* Brand */}
            <div className="flex items-center justify-center gap-2">
              <HeartPulse className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />

              <span className="text-xl font-bold text-slate-900 dark:text-white">
                MedCore
              </span>
            </div>

            {/* Title */}
            <div>
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                Verify your email
              </CardTitle>

              <CardDescription className="mt-2 leading-6 text-slate-500 dark:text-slate-400">
                Enter the 6-digit verification code sent to
                your email address.
              </CardDescription>
            </div>
          </CardHeader>

          {/* Content */}
          <CardContent>
            <form
              onSubmit={handleVerify}
              className="space-y-5"
            >

              {/* Email */}
              <div className="rounded-xl bg-slate-50 p-4 text-center dark:bg-slate-900">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Verification email sent to
                </p>

                <p className="mt-1 break-all text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {email}
                </p>
              </div>

              {/* OTP */}
              <div className="space-y-2">
                <Label htmlFor="otp">
                  Verification code
                </Label>

                <Input
                  id="otp"
                  value={otp}
                  onChange={(event) =>
                    setOtp(
                      event.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6)
                    )
                  }
                  placeholder="000000"
                  inputMode="numeric"
                  maxLength={6}
                  autoComplete="one-time-code"
                  disabled={isLoading}
                  className="h-12 text-center text-xl font-semibold tracking-[0.5em]"
                />
              </div>

              {/* Verify */}
              <Button
                type="submit"
                disabled={isLoading}
                className="h-11 w-full bg-cyan-600 text-white shadow-lg shadow-cyan-600/20 hover:bg-cyan-700"
              >
                {isLoading ? (
                  "Verifying..."
                ) : (
                  <>
                    Verify Email
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              {/* Resend */}
              <Button
                type="button"
                variant="ghost"
                disabled={resending || isLoading}
                onClick={handleResend}
                className="w-full"
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${
                    resending
                      ? "animate-spin"
                      : ""
                  }`}
                />

                {resending
                  ? "Sending..."
                  : "Resend verification code"}
              </Button>

              {/* Security */}
              <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <ShieldCheck className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />

                Secure MedCore account verification
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}