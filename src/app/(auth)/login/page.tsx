"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowRight,
  Eye,
  EyeOff,
  HeartPulse,
  LockKeyhole,
  ShieldCheck,
  Stethoscope,
  Users,
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

// --------------------------------------------------
// Validation Schema
// --------------------------------------------------

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),

  remember: z.boolean().optional(),
});

// --------------------------------------------------
// Type
// --------------------------------------------------

type LoginFormData = z.infer<typeof loginSchema>;

// --------------------------------------------------
// Login Page
// --------------------------------------------------

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  // --------------------------------------------------
  // Submit Handler
  // --------------------------------------------------

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      // Get registered account from localStorage
      const storedAccount = localStorage.getItem("medcore_account");

      if (!storedAccount) {
        toast.error("Account not found", {
          description: "Please create a MedCore account first.",
        });

        setIsLoading(false);
        return;
      }

      // Parse stored account
      const account = JSON.parse(storedAccount);

      // Check email
      if (
        typeof account.email !== "string" ||
        account.email.toLowerCase() !== data.email.toLowerCase()
      ) {
        toast.error("Invalid email or password");
        setIsLoading(false);
        return;
      }

      // Check password
      if (
        typeof account.password !== "string" ||
        account.password !== data.password
      ) {
        toast.error("Invalid email or password");
        setIsLoading(false);
        return;
      }

      // Check email verification
      if (!account.emailVerified) {
        toast.error("Email not verified", {
          description:
            "Please verify your email before signing in.",
        });

        setIsLoading(false);
        return;
      }

      // --------------------------------------------------
      // Create Safe Session
      // --------------------------------------------------

      // Do not store the password in the session
      const { password: _password, ...safeUser } = account;

      localStorage.setItem(
        "medcore_session",
        JSON.stringify({
          user: safeUser,
          isAuthenticated: true,
          remember: data.remember ?? false,
        })
      );

      // Success message
      toast.success("Login successful!", {
        description: `Welcome back, ${account.fullName}.`,
      });

      // Small delay so loader/toast can be seen
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Navigate to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);

      toast.error("Something went wrong", {
        description: "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Loader */}
      {isLoading && <MedCoreLoader />}

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=2200&q=85')",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-slate-950/75" />

      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/90 via-cyan-950/65 to-slate-950/90" />

      {/* Decorative Elements */}
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="absolute -bottom-40 -right-20 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" />

      {/* Main */}
      <div className="relative z-10 min-h-screen">
        <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-2">

          {/* ================================================= */}
          {/* LEFT SIDE */}
          {/* ================================================= */}

          <motion.section
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="hidden flex-col justify-center px-8 py-12 lg:flex xl:px-16"
          >
            {/* Logo */}
            <div className="mb-10 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-lg">
                <HeartPulse className="h-7 w-7 text-cyan-600" />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  MedCore
                </h1>

                <p className="text-xs font-medium uppercase tracking-[0.25em] text-cyan-200">
                  Hospital Management System
                </p>
              </div>
            </div>

            {/* Heading */}
            <div className="max-w-xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-cyan-100 backdrop-blur-md">
                <Activity className="h-4 w-4" />
                Smart Healthcare Management
              </div>

              <h2 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
                Everything your hospital needs,
                <span className="block text-cyan-300">
                  in one connected system.
                </span>
              </h2>

              <p className="mt-6 max-w-lg text-base leading-7 text-slate-200">
                MedCore helps healthcare teams manage patients, doctors,
                appointments, medical records, departments, and hospital
                operations from one secure platform.
              </p>
            </div>

            {/* Features */}
            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                <Stethoscope className="mb-3 h-6 w-6 text-cyan-300" />

                <p className="text-sm font-semibold text-white">
                  Patient Care
                </p>

                <p className="mt-1 text-xs text-slate-300">
                  Connected records
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                <Users className="mb-3 h-6 w-6 text-cyan-300" />

                <p className="text-sm font-semibold text-white">
                  Staff Management
                </p>

                <p className="mt-1 text-xs text-slate-300">
                  Organized teams
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                <ShieldCheck className="mb-3 h-6 w-6 text-cyan-300" />

                <p className="text-sm font-semibold text-white">
                  Secure
                </p>

                <p className="mt-1 text-xs text-slate-300">
                  Protected access
                </p>
              </div>
            </div>

            {/* Security */}
            <div className="mt-10 flex items-center gap-2 text-sm text-slate-300">
              <ShieldCheck className="h-4 w-4 text-cyan-300" />
              Secure healthcare administration platform
            </div>
          </motion.section>

          {/* ================================================= */}
          {/* RIGHT SIDE */}
          {/* ================================================= */}

          <section className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="w-full max-w-md"
            >
              <Card className="border-white/20 bg-white/95 shadow-2xl shadow-black/30 backdrop-blur-xl dark:bg-slate-950/95">

                {/* Header */}
                <CardHeader className="space-y-5 pb-6">

                  {/* Mobile Logo */}
                  <div className="flex items-center gap-3 lg:hidden">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-600 text-white shadow-lg">
                      <HeartPulse className="h-6 w-6" />
                    </div>

                    <div>
                      <p className="text-xl font-bold text-slate-900 dark:text-white">
                        MedCore
                      </p>

                      <p className="text-[10px] font-medium uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
                        HMS
                      </p>
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 ring-8 ring-cyan-50/60 dark:bg-cyan-950 dark:ring-cyan-950/50">
                      <HeartPulse className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
                    </div>
                  </div>

                  <div className="text-center">
                    <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                      Welcome back
                    </CardTitle>

                    <CardDescription className="mt-2 text-slate-500 dark:text-slate-400">
                      Sign in to access your MedCore dashboard
                    </CardDescription>
                  </div>
                </CardHeader>

                {/* Form */}
                <CardContent>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                  >
                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email address
                      </Label>

                      <Input
                        id="email"
                        type="email"
                        placeholder="doctor@hospital.com"
                        autoComplete="email"
                        className={`h-11 ${
                          errors.email
                            ? "border-red-500 focus-visible:ring-red-500"
                            : ""
                        }`}
                        {...register("email")}
                      />

                      {errors.email && (
                        <p className="text-sm text-red-500">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">
                          Password
                        </Label>

                        <Link
                          href="/forgot-password"
                          className="text-sm font-medium text-cyan-600 hover:underline dark:text-cyan-400"
                        >
                          Forgot password?
                        </Link>
                      </div>

                      <div className="relative">
                        <Input
                          id="password"
                          type={
                            showPassword
                              ? "text"
                              : "password"
                          }
                          placeholder="Enter your password"
                          autoComplete="current-password"
                          className={`h-11 pr-11 ${
                            errors.password
                              ? "border-red-500 focus-visible:ring-red-500"
                              : ""
                          }`}
                          {...register("password")}
                        />

                        <button
                          type="button"
                          aria-label={
                            showPassword
                              ? "Hide password"
                              : "Show password"
                          }
                          onClick={() =>
                            setShowPassword(
                              (value) => !value
                            )
                          }
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      {errors.password && (
                        <p className="text-sm text-red-500">
                          {errors.password.message}
                        </p>
                      )}
                    </div>

                    {/* Remember */}
                    <div className="flex items-center gap-2">
                      <input
                        id="remember"
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                        {...register("remember")}
                      />

                      <Label
                        htmlFor="remember"
                        className="cursor-pointer text-sm font-normal text-slate-600 dark:text-slate-400"
                      >
                        Keep me signed in
                      </Label>
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
                          Signing in...
                        </>
                      ) : (
                        <>
                          Sign in to MedCore
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>

                    {/* Security */}
                    <div className="flex items-center justify-center gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
                      <LockKeyhole className="h-3.5 w-3.5" />
                      Secure access to your healthcare workspace
                    </div>
                  </form>

                  {/* Register */}
                  <div className="mt-6 border-t pt-6 text-center dark:border-slate-800">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Don't have an account?{" "}
                      <Link
                        href="/register"
                        className="font-semibold text-cyan-600 hover:underline dark:text-cyan-400"
                      >
                        Create an account
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>

              <p className="mt-5 text-center text-xs text-white/60 lg:hidden">
                © 2026 MedCore HMS · Secure Healthcare Management
              </p>
            </motion.div>
          </section>
        </div>
      </div>
    </main>
  );
}