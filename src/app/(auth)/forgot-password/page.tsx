"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  HeartPulse,
  Mail,
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

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      toast.error("Email address is required");
      return;
    }

    setIsLoading(true);

    const storedAccount = localStorage.getItem("medcore_account");

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!storedAccount) {
      setIsLoading(false);

      toast.error("Account not found", {
        description: "No MedCore account has been registered yet.",
      });

      return;
    }

    const account = JSON.parse(storedAccount);

    if (
      account.email.toLowerCase() !== email.trim().toLowerCase()
    ) {
      setIsLoading(false);

      toast.error("Account not found", {
        description:
          "No account exists with this email address.",
      });

      return;
    }

    /*
     * Frontend-only reset flow.
     * We store the email temporarily so the reset page
     * knows which account is being reset.
     */
    localStorage.setItem(
      "medcore_reset_email",
      email.trim().toLowerCase()
    );

    setIsLoading(false);

    toast.success("Account verified", {
      description: "You can now create a new password.",
    });

    router.push("/reset-password");
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-5">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-cyan-950 to-slate-950" />

      {/* Decorative circles */}
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="absolute -bottom-40 -right-20 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="border-white/20 bg-white/95 shadow-2xl shadow-black/30 backdrop-blur-xl dark:bg-slate-950/95">
          <CardHeader className="space-y-5 text-center">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 ring-8 ring-cyan-50/50 dark:bg-cyan-950 dark:ring-cyan-950/50">
                <HeartPulse className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
              </div>
            </div>

            {/* Brand */}
            <div>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                MedCore
              </p>

              <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-400">
                Hospital Management System
              </p>
            </div>

            <div>
              <CardTitle className="text-2xl font-bold">
                Forgot your password?
              </CardTitle>

              <CardDescription className="mt-2 leading-6">
                Enter the email address associated with your
                MedCore account.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email address
                </Label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="doctor@hospital.com"
                    autoComplete="email"
                    className="h-11 pl-10"
                  />
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="h-11 w-full bg-cyan-600 text-white shadow-lg shadow-cyan-600/20 hover:bg-cyan-700"
              >
                {isLoading ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Checking account...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              {/* Security */}
              <div className="flex items-center justify-center gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
                <ShieldCheck className="h-4 w-4 text-cyan-600" />
                Secure MedCore account recovery
              </div>
            </form>

            {/* Back */}
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