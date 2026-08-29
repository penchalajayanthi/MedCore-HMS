"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  HeartPulse,
  LockKeyhole,
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

export default function ResetPasswordPage() {
  const router = useRouter();

  // --------------------------------------------------
  // State
  // --------------------------------------------------

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    // --------------------------------------------------
    // Password validation
    // --------------------------------------------------

    if (!password.trim()) {
      toast.error("Password is required", {
        description:
          "Please enter your new password.",
      });

      return;
    }

    if (password.length < 6) {
      toast.error("Password is too short", {
        description:
          "Password must contain at least 6 characters.",
      });

      return;
    }

    // --------------------------------------------------
    // Confirm password validation
    // --------------------------------------------------

    if (!confirmPassword.trim()) {
      toast.error("Please confirm your password", {
        description:
          "Enter the new password again.",
      });

      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", {
        description:
          "Please make sure both passwords are identical.",
      });

      return;
    }

    // --------------------------------------------------
    // Get reset email
    // --------------------------------------------------

    const resetEmail = localStorage.getItem(
      "medcore_reset_email"
    );

    // --------------------------------------------------
    // Get stored account
    // --------------------------------------------------

    const storedAccount = localStorage.getItem(
      "medcore_account"
    );

    // --------------------------------------------------
    // Validate reset session
    // --------------------------------------------------

    if (!resetEmail || !storedAccount) {
      toast.error("Reset session expired", {
        description:
          "Please start the password recovery process again.",
      });

      router.push("/forgot-password");

      return;
    }

    setIsLoading(true);

    try {
      // Simulate reset processing
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );

      const account = JSON.parse(storedAccount);

      // --------------------------------------------------
      // Validate account email
      // --------------------------------------------------

      if (
        typeof account.email !== "string" ||
        account.email.toLowerCase() !==
          resetEmail.toLowerCase()
      ) {
        toast.error("Invalid reset request", {
          description:
            "Please start the password recovery process again.",
        });

        localStorage.removeItem(
          "medcore_reset_email"
        );

        setIsLoading(false);

        router.push("/forgot-password");

        return;
      }

      // --------------------------------------------------
      // PREVIOUS PASSWORD CHECK
      // --------------------------------------------------

      if (
        typeof account.password === "string" &&
        account.password === password
      ) {
        toast.error(
          "You cannot use your previous password",
          {
            description:
              "Please choose a different password for your MedCore account.",
          }
        );

        setIsLoading(false);

        // Clear entered passwords
        setPassword("");
        setConfirmPassword("");

        return;
      }

      // --------------------------------------------------
      // Update Password
      // --------------------------------------------------

      account.password = password;

      localStorage.setItem(
        "medcore_account",
        JSON.stringify(account)
      );

      // --------------------------------------------------
      // Clear Reset Session
      // --------------------------------------------------

      localStorage.removeItem(
        "medcore_reset_email"
      );

      // --------------------------------------------------
      // Success
      // --------------------------------------------------

      toast.success(
        "Password reset successful!",
        {
          description:
            "Your password has been updated. Please sign in with your new password.",
        }
      );

      // Allow toast to appear
      await new Promise((resolve) =>
        setTimeout(resolve, 800)
      );

      router.push("/login");
    } catch (error) {
      console.error(
        "Password reset error:",
        error
      );

      toast.error("Password reset failed", {
        description:
          "Something went wrong. Please try again.",
      });

      setIsLoading(false);
    }
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-5">

      {/* ================================================= */}
      {/* MEDCORE LOADER */}
      {/* ================================================= */}

      {isLoading && <MedCoreLoader />}

      {/* ================================================= */}
      {/* BACKGROUND */}
      {/* ================================================= */}

      <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-cyan-950 to-slate-950" />

      {/* Decorative Glow */}

      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="absolute -bottom-40 -right-20 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" />

      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="border-white/20 bg-white/95 shadow-2xl shadow-black/30 backdrop-blur-xl dark:bg-slate-950/95">

          {/* ================================================= */}
          {/* HEADER */}
          {/* ================================================= */}

          <CardHeader className="space-y-5 text-center">

            {/* Logo Icon */}

            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 ring-8 ring-cyan-50/50 dark:bg-cyan-950 dark:ring-cyan-950/50">

                <LockKeyhole className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />

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
                Create new password
              </CardTitle>

              <CardDescription className="mt-2 text-slate-500 dark:text-slate-400">
                Enter a new password for your
                MedCore account.
              </CardDescription>
            </div>

          </CardHeader>

          {/* ================================================= */}
          {/* FORM */}
          {/* ================================================= */}

          <CardContent>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* ================================================= */}
              {/* NEW PASSWORD */}
              {/* ================================================= */}

              <div className="space-y-2">

                <Label htmlFor="password">
                  New password
                </Label>

                <div className="relative">

                  <Input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    disabled={isLoading}
                    className="h-11 pr-11"
                  />

                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() =>
                      setShowPassword(
                        (value) => !value
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-slate-400 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:text-slate-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>

                </div>

                {/* Password hint */}

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Use at least 6 characters and choose a
                  password you have not used before.
                </p>

              </div>

              {/* ================================================= */}
              {/* CONFIRM PASSWORD */}
              {/* ================================================= */}

              <div className="space-y-2">

                <Label htmlFor="confirmPassword">
                  Confirm new password
                </Label>

                <div className="relative">

                  <Input
                    id="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(
                        event.target.value
                      )
                    }
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                    disabled={isLoading}
                    className="h-11 pr-11"
                  />

                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() =>
                      setShowConfirmPassword(
                        (value) => !value
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-slate-400 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:text-slate-200"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>

                </div>

              </div>

              {/* ================================================= */}
              {/* RESET PASSWORD BUTTON */}
              {/* ================================================= */}

              <Button
                type="submit"
                disabled={isLoading}
                className="h-11 w-full bg-cyan-600 text-white shadow-lg shadow-cyan-600/20 hover:bg-cyan-700"
              >
                {isLoading ? (
                  "Updating password..."
                ) : (
                  "Reset Password"
                )}
              </Button>

              {/* ================================================= */}
              {/* SECURITY */}
              {/* ================================================= */}

              <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">

                <ShieldCheck className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />

                Keep your MedCore password private

              </div>

            </form>

            {/* ================================================= */}
            {/* BACK TO LOGIN */}
            {/* ================================================= */}

            <div className="mt-6 border-t pt-6 text-center dark:border-slate-800">

              <Link
                href="/login"
                className="inline-flex items-center text-sm font-semibold text-cyan-600 hover:underline dark:text-cyan-400"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />

                Back to login
              </Link>

            </div>

          </CardContent>

        </Card>
      </motion.div>

    </main>
  );
}