"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
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
  UserRound,
  Mail,
  Building2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import MedCoreLoader from "@/components/shared/MedCoreLoader";

// --------------------------------------------------
// Validation Schema
// --------------------------------------------------

const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters"),

    email: z
      .string()
      .min(1, "Email address is required")
      .email("Please enter a valid email address"),

    hospitalName: z
      .string()
      .min(2, "Hospital name is required"),

    role: z
      .string()
      .min(1, "Please select your role"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),

    terms: z.boolean().refine((value) => value === true, {
      message:
        "You must accept the terms and privacy policy",
    }),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

type RegisterFormData = z.infer<typeof registerSchema>;

// --------------------------------------------------
// Register Page
// --------------------------------------------------

export default function RegisterPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      fullName: "",
      email: "",
      hospitalName: "",
      role: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const password = watch("password", "");

  // --------------------------------------------------
  // Password Strength
  // --------------------------------------------------

  const getPasswordStrength = () => {
    if (!password) return 0;

    if (password.length < 6) {
      return 1;
    }

    if (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password)
    ) {
      return 3;
    }

    return 2;
  };

  const passwordStrength = getPasswordStrength();

  // --------------------------------------------------
  // Check Existing Email
  // --------------------------------------------------

  const checkEmailExists = () => {
    const email = watch("email")
      .trim()
      .toLowerCase();

    if (!email) {
      setEmailExists(false);
      return;
    }

    setCheckingEmail(true);

    try {
      const storedAccount = localStorage.getItem(
        "medcore_account"
      );

      if (!storedAccount) {
        setEmailExists(false);
        return;
      }

      const account = JSON.parse(storedAccount);

      const exists =
        typeof account.email === "string" &&
        account.email.toLowerCase() === email;

      setEmailExists(exists);
    } catch (error) {
      console.error("Email check error:", error);

      setEmailExists(false);
    } finally {
      setCheckingEmail(false);
    }
  };

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      // ----------------------------------------------
      // Check if account already exists
      // ----------------------------------------------

      const storedAccount = localStorage.getItem(
        "medcore_account"
      );

      if (storedAccount) {
        const existingAccount =
          JSON.parse(storedAccount);

        if (
          typeof existingAccount.email === "string" &&
          existingAccount.email.toLowerCase() ===
            data.email.trim().toLowerCase()
        ) {
          toast.error("Account already exists", {
            description:
              "An account is already registered with this email address.",
          });

          setEmailExists(true);
          setIsLoading(false);

          return;
        }
      }

      // ----------------------------------------------
      // Create Account
      // ----------------------------------------------

      const account = {
        fullName: data.fullName.trim(),

        email: data.email.trim().toLowerCase(),

        hospitalName: data.hospitalName.trim(),

        role: data.role,

        password: data.password,

        emailVerified: false,
      };

      // ----------------------------------------------
      // Save Account
      // ----------------------------------------------

      localStorage.setItem(
        "medcore_account",
        JSON.stringify(account)
      );

      // ----------------------------------------------
      // Success
      // ----------------------------------------------

      toast.success("Account created successfully!", {
        description:
          "Please verify your email to continue.",
      });

      // ----------------------------------------------
      // Small delay for toast
      // ----------------------------------------------

      await new Promise((resolve) =>
        setTimeout(resolve, 800)
      );

      // ----------------------------------------------
      // Go to verification
      // ----------------------------------------------

      router.push("/verify-email");
    } catch (error) {
      console.error("Registration error:", error);

      toast.error("Registration failed", {
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
    <main className="relative min-h-screen overflow-hidden bg-slate-950">

      {/* ================================================= */}
      {/* MEDCORE LOADER */}
      {/* ================================================= */}

      {isLoading && <MedCoreLoader />}

      {/* ================================================= */}
      {/* BACKGROUND */}
      {/* ================================================= */}

      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=2200&q=85')",
        }}
      />

      {/* Dark Overlay */}

      <div className="absolute inset-0 bg-slate-950/80" />

      {/* Medical Gradient */}

      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/90 via-cyan-950/60 to-slate-950/95" />

      {/* Decorative Glow */}

      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="absolute -bottom-40 -right-20 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" />

      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

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

                Join the MedCore Healthcare Network

              </div>

              <h2 className="text-4xl font-bold leading-tight text-white xl:text-5xl">

                Build a smarter,

                <span className="block text-cyan-300">
                  connected healthcare experience.
                </span>

              </h2>

              <p className="mt-6 max-w-lg text-base leading-7 text-slate-200">
                Create your MedCore account and manage
                patients, appointments, medical records,
                departments, and hospital operations from
                one secure platform.
              </p>

            </div>

            {/* Features */}

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">

                <Stethoscope className="mb-3 h-6 w-6 text-cyan-300" />

                <p className="text-sm font-semibold text-white">
                  Clinical Care
                </p>

                <p className="mt-1 text-xs text-slate-300">
                  Better patient workflows
                </p>

              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">

                <Users className="mb-3 h-6 w-6 text-cyan-300" />

                <p className="text-sm font-semibold text-white">
                  Team Access
                </p>

                <p className="mt-1 text-xs text-slate-300">
                  Connected healthcare teams
                </p>

              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">

                <ShieldCheck className="mb-3 h-6 w-6 text-cyan-300" />

                <p className="text-sm font-semibold text-white">
                  Secure
                </p>

                <p className="mt-1 text-xs text-slate-300">
                  Protected information
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

          <section className="flex items-center justify-center px-5 py-8 sm:px-8 lg:px-10">

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.15,
              }}
              className="w-full max-w-lg"
            >

              <Card className="border-white/20 bg-white/95 shadow-2xl shadow-black/30 backdrop-blur-xl dark:bg-slate-950/95">

                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <CardHeader className="space-y-4 pb-5">

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

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 ring-8 ring-cyan-50/60 dark:bg-cyan-950 dark:ring-cyan-950/50">

                      <UserRound className="h-7 w-7 text-cyan-600 dark:text-cyan-400" />

                    </div>

                  </div>

                  <div className="text-center">

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Create your account
                    </h2>

                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      Set up your MedCore HMS workspace
                    </p>

                  </div>

                </CardHeader>

                {/* ================================================= */}
                {/* FORM */}
                {/* ================================================= */}

                <CardContent>

                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                  >

                    {/* ================================================= */}
                    {/* FULL NAME */}
                    {/* ================================================= */}

                    <div className="space-y-2">

                      <Label htmlFor="fullName">
                        Full name
                      </Label>

                      <div className="relative">

                        <UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <Input
                          id="fullName"
                          type="text"
                          placeholder="Dr. John Smith"
                          autoComplete="name"
                          disabled={isLoading}
                          className={`h-11 pl-10 ${
                            errors.fullName
                              ? "border-red-500 focus-visible:ring-red-500"
                              : ""
                          }`}
                          {...register("fullName")}
                        />

                      </div>

                      {errors.fullName && (
                        <p className="text-sm text-red-500">
                          {errors.fullName.message}
                        </p>
                      )}

                    </div>

                    {/* ================================================= */}
                    {/* EMAIL */}
                    {/* ================================================= */}

                    <div className="space-y-2">

                      <Label htmlFor="email">
                        Email address
                      </Label>

                      <div className="relative">

                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <Input
                          id="email"
                          type="email"
                          placeholder="doctor@hospital.com"
                          autoComplete="email"
                          disabled={isLoading}
                          className={`h-11 pl-10 ${
                            errors.email || emailExists
                              ? "border-red-500 focus-visible:ring-red-500"
                              : ""
                          }`}
                          {...register("email", {
                            onBlur: checkEmailExists,
                            onChange: () => {
                              setEmailExists(false);
                            },
                          })}
                        />

                      </div>

                      {/* Checking */}

                      {checkingEmail && (
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Checking email...
                        </p>
                      )}

                      {/* Validation Error */}

                      {errors.email && (
                        <p className="text-sm text-red-500">
                          {errors.email.message}
                        </p>
                      )}

                      {/* Account Exists */}

                      {emailExists && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-900/50 dark:bg-red-950/30">

                          <div className="flex items-start justify-between gap-3">

                            <div>

                              <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                                Account already exists
                              </p>

                              <p className="mt-1 text-xs leading-5 text-red-500 dark:text-red-400">
                                An account is already registered
                                with this email address.
                              </p>

                            </div>

                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              router.push("/login")
                            }
                            className="mt-2 text-sm font-semibold text-cyan-600 hover:underline dark:text-cyan-400"
                          >
                            Sign in to your account →
                          </button>

                        </div>
                      )}

                    </div>

                    {/* ================================================= */}
                    {/* HOSPITAL */}
                    {/* ================================================= */}

                    <div className="space-y-2">

                      <Label htmlFor="hospitalName">
                        Hospital / Organization
                      </Label>

                      <div className="relative">

                        <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <Input
                          id="hospitalName"
                          type="text"
                          placeholder="CityCare Hospital"
                          disabled={isLoading}
                          className={`h-11 pl-10 ${
                            errors.hospitalName
                              ? "border-red-500 focus-visible:ring-red-500"
                              : ""
                          }`}
                          {...register("hospitalName")}
                        />

                      </div>

                      {errors.hospitalName && (
                        <p className="text-sm text-red-500">
                          {errors.hospitalName.message}
                        </p>
                      )}

                    </div>

                    {/* ================================================= */}
                    {/* ROLE */}
                    {/* ================================================= */}

                    <div className="space-y-2">

                      <Label htmlFor="role">
                        Your role
                      </Label>

                      <select
                        id="role"
                        disabled={isLoading}
                        {...register("role")}
                        className={`h-11 w-full rounded-md border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-cyan-500 ${
                          errors.role
                            ? "border-red-500"
                            : "border-input"
                        }`}
                      >

                        <option value="">
                          Select your role
                        </option>

                        <option value="hospital-admin">
                          Hospital Admin
                        </option>

                        <option value="doctor">
                          Doctor
                        </option>

                        <option value="nurse">
                          Nurse
                        </option>

                        <option value="receptionist">
                          Receptionist
                        </option>

                        <option value="patient">
                          Patient
                        </option>

                      </select>

                      {errors.role && (
                        <p className="text-sm text-red-500">
                          {errors.role.message}
                        </p>
                      )}

                    </div>

                    {/* ================================================= */}
                    {/* PASSWORD */}
                    {/* ================================================= */}

                    <div className="space-y-2">

                      <Label htmlFor="password">
                        Password
                      </Label>

                      <div className="relative">

                        <Input
                          id="password"
                          type={
                            showPassword
                              ? "text"
                              : "password"
                          }
                          placeholder="Create a strong password"
                          autoComplete="new-password"
                          disabled={isLoading}
                          className={`h-11 pr-11 ${
                            errors.password
                              ? "border-red-500 focus-visible:ring-red-500"
                              : ""
                          }`}
                          {...register("password")}
                        />

                        <button
                          type="button"
                          disabled={isLoading}
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
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-slate-400 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:text-slate-200"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>

                      </div>

                      {/* Password Strength */}

                      {password && (
                        <div className="space-y-1">

                          <div className="flex gap-1">

                            {[1, 2, 3].map(
                              (level) => (
                                <div
                                  key={level}
                                  className={`h-1.5 flex-1 rounded-full ${
                                    passwordStrength >=
                                    level
                                      ? "bg-cyan-500"
                                      : "bg-slate-200 dark:bg-slate-700"
                                  }`}
                                />
                              )
                            )}

                          </div>

                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {passwordStrength === 1
                              ? "Weak password"
                              : passwordStrength === 2
                              ? "Good password"
                              : "Strong password"}
                          </p>

                        </div>
                      )}

                      {errors.password && (
                        <p className="text-sm text-red-500">
                          {errors.password.message}
                        </p>
                      )}

                    </div>

                    {/* ================================================= */}
                    {/* CONFIRM PASSWORD */}
                    {/* ================================================= */}

                    <div className="space-y-2">

                      <Label htmlFor="confirmPassword">
                        Confirm password
                      </Label>

                      <div className="relative">

                        <Input
                          id="confirmPassword"
                          type={
                            showConfirmPassword
                              ? "text"
                              : "password"
                          }
                          placeholder="Re-enter your password"
                          autoComplete="new-password"
                          disabled={isLoading}
                          className={`h-11 pr-11 ${
                            errors.confirmPassword
                              ? "border-red-500 focus-visible:ring-red-500"
                              : ""
                          }`}
                          {...register(
                            "confirmPassword"
                          )}
                        />

                        <button
                          type="button"
                          disabled={isLoading}
                          aria-label={
                            showConfirmPassword
                              ? "Hide password"
                              : "Show password"
                          }
                          onClick={() =>
                            setShowConfirmPassword(
                              (value) => !value
                            )
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

                      {errors.confirmPassword && (
                        <p className="text-sm text-red-500">
                          {
                            errors.confirmPassword
                              .message
                          }
                        </p>
                      )}

                    </div>

                    {/* ================================================= */}
                    {/* TERMS */}
                    {/* ================================================= */}

                    <div className="flex items-start gap-3 pt-1">

                      <input
                        id="terms"
                        type="checkbox"
                        disabled={isLoading}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                        {...register("terms")}
                      />

                      <Label
                        htmlFor="terms"
                        className="cursor-pointer text-xs font-normal leading-5 text-slate-600 dark:text-slate-400"
                      >
                        I agree to the{" "}

                        <span className="font-medium text-cyan-600 dark:text-cyan-400">
                          Terms of Service
                        </span>{" "}

                        and{" "}

                        <span className="font-medium text-cyan-600 dark:text-cyan-400">
                          Privacy Policy
                        </span>
                      </Label>

                    </div>

                    {errors.terms && (
                      <p className="text-sm text-red-500">
                        {errors.terms.message}
                      </p>
                    )}

                    {/* ================================================= */}
                    {/* SUBMIT */}
                    {/* ================================================= */}

                    <Button
                      type="submit"
                      disabled={isLoading || emailExists}
                      className="h-11 w-full bg-cyan-600 text-white shadow-lg shadow-cyan-600/20 hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {emailExists ? (
                        "Account already exists"
                      ) : (
                        <>
                          Create MedCore Account

                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>

                    {/* ================================================= */}
                    {/* SECURITY */}
                    {/* ================================================= */}

                    <div className="flex items-center justify-center gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">

                      <LockKeyhole className="h-3.5 w-3.5" />

                      Your healthcare workspace is protected

                    </div>

                  </form>

                  {/* ================================================= */}
                  {/* LOGIN */}
                  {/* ================================================= */}

                  <div className="mt-5 border-t pt-5 text-center dark:border-slate-800">

                    <p className="text-sm text-slate-500 dark:text-slate-400">

                      Already have an account?{" "}

                      <Link
                        href="/login"
                        className="font-semibold text-cyan-600 hover:underline dark:text-cyan-400"
                      >
                        Sign in
                      </Link>

                    </p>

                  </div>

                </CardContent>

              </Card>

              {/* Mobile Footer */}

              <p className="mt-4 text-center text-xs text-white/60 lg:hidden">
                © 2026 MedCore HMS · Secure Healthcare
                Management
              </p>

            </motion.div>

          </section>

        </div>

      </div>

    </main>
  );
}