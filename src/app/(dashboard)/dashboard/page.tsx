"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  BedDouble,
  CalendarCheck,
  CalendarDays,
  ChevronRight,
  Clock3,
  FlaskConical,
  HeartPulse,
  MoreHorizontal,
  Pill,
  Plus,
  Stethoscope,
  UserPlus,
  Users,
  WalletCards,
} from "lucide-react";

/* ============================================================
   TYPES
============================================================ */

type SessionUser = {
  fullName?: string;
  email?: string;
  hospitalName?: string;
  role?: string;
  emailVerified?: boolean;
};

type SessionData = {
  user?: SessionUser;
  isAuthenticated?: boolean;
  remember?: boolean;
};

/* ============================================================
   APPOINTMENTS
============================================================ */

const appointments = [
  {
    time: "09:00 AM",
    patient: "Rahul Kumar",
    doctor: "Dr. Priya Sharma",
    department: "Cardiology",
    status: "Confirmed",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
    avatar: "RK",
  },
  {
    time: "10:30 AM",
    patient: "Anita Reddy",
    doctor: "Dr. Arjun Rao",
    department: "Neurology",
    status: "In Progress",
    color:
      "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400",
    avatar: "AR",
  },
  {
    time: "12:00 PM",
    patient: "Suresh Babu",
    doctor: "Dr. Neha Singh",
    department: "Orthopedics",
    status: "Pending",
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
    avatar: "SB",
  },
  {
    time: "02:30 PM",
    patient: "Kavya Reddy",
    doctor: "Dr. Vikram Rao",
    department: "Pediatrics",
    status: "Confirmed",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
    avatar: "KR",
  },
];

/* ============================================================
   ACTIVITIES
============================================================ */

const activities = [
  {
    title: "New patient registered",
    description: "Rahul Kumar was added to the system",
    time: "5 min ago",
    icon: UserPlus,
    color:
      "bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
  },
  {
    title: "Lab report completed",
    description: "Blood test results are ready",
    time: "18 min ago",
    icon: FlaskConical,
    color:
      "bg-purple-100 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400",
  },
  {
    title: "Prescription issued",
    description: "Dr. Priya issued a new prescription",
    time: "32 min ago",
    icon: Pill,
    color:
      "bg-pink-100 text-pink-600 dark:bg-pink-950/50 dark:text-pink-400",
  },
];

/* ============================================================
   DASHBOARD
============================================================ */

export default function DashboardPage() {
  const [userName, setUserName] = useState("User");
  const [greeting, setGreeting] = useState("Good morning");
  const [today, setToday] = useState("");

  /* ============================================================
     LOAD USER FROM LOCAL STORAGE
  ============================================================ */

  useEffect(() => {
    try {
      /*
       * Primary source:
       * medcore_session
       */
      const session = localStorage.getItem("medcore_session");

      if (session) {
        const parsedSession: SessionData = JSON.parse(session);

        const fullName = parsedSession?.user?.fullName;

        if (fullName) {
          setUserName(fullName);
        }
      } else {
        /*
         * Fallback:
         * medcore_account
         */
        const account = localStorage.getItem("medcore_account");

        if (account) {
          const parsedAccount: SessionUser = JSON.parse(account);

          if (parsedAccount?.fullName) {
            setUserName(parsedAccount.fullName);
          }
        }
      }
    } catch (error) {
      console.error("Unable to load user information:", error);
    }

    /* ============================================================
       TIME BASED GREETING
    ============================================================ */

    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      setGreeting("Good morning");
    } else if (hour >= 12 && hour < 17) {
      setGreeting("Good afternoon");
    } else if (hour >= 17 && hour < 21) {
      setGreeting("Good evening");
    } else {
      setGreeting("Good night");
    }

    /* ============================================================
       CURRENT DATE
    ============================================================ */

    const formattedDate = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date());

    setToday(formattedDate);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50/40 p-3 sm:p-5 md:p-6 lg:p-8 dark:from-slate-950 dark:via-slate-950 dark:to-cyan-950/10">
      <div className="mx-auto max-w-[1600px] space-y-5 sm:space-y-6">

        {/* ======================================================
            HERO
        ====================================================== */}

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600 p-5 shadow-xl shadow-blue-500/10 sm:p-7 lg:p-8"
        >
          {/* Decorative circles */}

          <div className="absolute -right-20 -top-32 h-72 w-72 rounded-full bg-white/10 blur-2xl sm:h-80 sm:w-80" />

          <div className="absolute -bottom-40 left-1/3 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl sm:h-80 sm:w-80" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            {/* Hero text */}

            <div className="min-w-0">
              <div className="mb-3 flex items-center gap-2 text-xs font-medium text-cyan-100 sm:text-sm">
                <HeartPulse className="h-4 w-4 shrink-0" />

                <span className="truncate">
                  MedCore Hospital Management System
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
                {greeting}, {userName} 👋
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
                Here's what's happening across your hospital today.
                Manage patients, appointments and clinical operations
                from one place.
              </p>
            </div>

            {/* Hero buttons */}

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">

              <div className="flex items-center justify-center gap-2 rounded-xl bg-white/15 px-4 py-3 text-sm font-medium text-white backdrop-blur-md">
                <CalendarDays className="h-4 w-4 shrink-0" />

                <span>
                  {today || "Today"}
                </span>
              </div>

              <button className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-blue-700 shadow-lg transition hover:bg-blue-50">
                <Plus className="h-4 w-4" />
                New Patient
              </button>

            </div>
          </div>
        </motion.section>

        {/* ======================================================
            STAT CARDS
        ====================================================== */}

        <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="Total Patients"
            value="2,847"
            change="+12.5%"
            subtitle="vs. last month"
            icon={Users}
            gradient="from-cyan-500 to-blue-600"
            iconBg="bg-cyan-50 dark:bg-cyan-950/40"
          />

          <StatCard
            title="Today's Appointments"
            value="42"
            change="+8.2%"
            subtitle="vs. yesterday"
            icon={CalendarCheck}
            gradient="from-violet-500 to-purple-600"
            iconBg="bg-violet-50 dark:bg-violet-950/40"
          />

          <StatCard
            title="Active Doctors"
            value="18"
            change="+2"
            subtitle="available today"
            icon={Stethoscope}
            gradient="from-emerald-500 to-teal-600"
            iconBg="bg-emerald-50 dark:bg-emerald-950/40"
          />

          <StatCard
            title="Available Beds"
            value="24"
            change="68%"
            subtitle="occupancy rate"
            icon={BedDouble}
            gradient="from-orange-500 to-pink-600"
            iconBg="bg-orange-50 dark:bg-orange-950/40"
          />

        </div>

        {/* ======================================================
            APPOINTMENT OVERVIEW + QUICK ACTIONS
        ====================================================== */}

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3 xl:gap-6">

          {/* Appointment Overview */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6 xl:col-span-2 dark:border-slate-800 dark:bg-slate-900"
          >

            <div className="flex items-start justify-between gap-3">

              <div className="min-w-0">
                <div className="flex items-center gap-2">

                  <div className="shrink-0 rounded-lg bg-blue-50 p-2 dark:bg-blue-950/40">
                    <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>

                  <h2 className="truncate font-bold text-slate-900 dark:text-white">
                    Appointment Overview
                  </h2>

                </div>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                  Weekly appointment activity
                </p>
              </div>

              <button className="shrink-0 rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                <MoreHorizontal className="h-5 w-5" />
              </button>

            </div>

            {/* Chart */}

            <div className="mt-6 flex h-[180px] items-end gap-2 sm:mt-8 sm:h-[220px] sm:gap-4 md:gap-5">

              {[
                { day: "Mon", value: 55, height: "55%" },
                { day: "Tue", value: 72, height: "72%" },
                { day: "Wed", value: 48, height: "48%" },
                { day: "Thu", value: 85, height: "85%" },
                { day: "Fri", value: 68, height: "68%" },
                { day: "Sat", value: 40, height: "40%" },
                { day: "Sun", value: 28, height: "28%" },
              ].map((item, index) => (
                <div
                  key={item.day}
                  className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
                >

                  <span className="text-[10px] font-semibold text-slate-500 sm:text-xs dark:text-slate-400">
                    {item.value}
                  </span>

                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: item.height }}
                    transition={{
                      duration: 0.7,
                      delay: index * 0.08,
                    }}
                    className="w-full max-w-10 rounded-t-lg bg-gradient-to-t from-cyan-600 to-blue-400 shadow-lg shadow-cyan-500/10 sm:rounded-t-xl"
                  />

                  <span className="text-[10px] text-slate-400 sm:text-xs">
                    {item.day}
                  </span>

                </div>
              ))}

            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="h-2 w-2 rounded-full bg-cyan-500" />
              <span>Appointments</span>

              <span className="ml-auto font-medium text-emerald-500">
                +14.8% this week
              </span>
            </div>

          </motion.div>

          {/* ====================================================
              QUICK ACTIONS
          ==================================================== */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6 dark:border-slate-800 dark:bg-slate-900"
          >

            <div className="flex items-center justify-between gap-3">

              <div className="min-w-0">
                <h2 className="font-bold text-slate-900 dark:text-white">
                  Quick Actions
                </h2>

                <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Common operations
                </p>
              </div>

              <div className="shrink-0 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-2.5 text-white shadow-lg shadow-cyan-500/20">
                <Activity className="h-5 w-5" />
              </div>

            </div>

            <div className="mt-5 grid gap-3">

              <QuickAction
                icon={UserPlus}
                title="Register Patient"
                description="Add new patient"
                gradient="from-cyan-500 to-blue-600"
              />

              <QuickAction
                icon={CalendarDays}
                title="Book Appointment"
                description="Schedule consultation"
                gradient="from-violet-500 to-purple-600"
              />

              <QuickAction
                icon={Pill}
                title="New Prescription"
                description="Create prescription"
                gradient="from-pink-500 to-rose-600"
              />

              <QuickAction
                icon={FlaskConical}
                title="Lab Reports"
                description="Review test results"
                gradient="from-emerald-500 to-teal-600"
              />

            </div>

          </motion.div>

        </div>

        {/* ======================================================
            TODAY'S APPOINTMENTS + RECENT ACTIVITY
        ====================================================== */}

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3 xl:gap-6">

          {/* ====================================================
              TODAY'S APPOINTMENTS
          ==================================================== */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6 xl:col-span-2 dark:border-slate-800 dark:bg-slate-900"
          >

            <div className="flex items-center justify-between gap-3">

              <div className="min-w-0">
                <h2 className="font-bold text-slate-900 dark:text-white">
                  Today's Appointments
                </h2>

                <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Upcoming consultations
                </p>
              </div>

              <button className="flex shrink-0 items-center gap-1 text-xs font-semibold text-cyan-600 hover:text-cyan-700 sm:text-sm dark:text-cyan-400">
                <span className="hidden xs:inline">
                  View all
                </span>

                <ChevronRight className="h-4 w-4" />
              </button>

            </div>

            {/* ==================================================
                MOBILE APPOINTMENT CARDS
            ================================================== */}

            <div className="mt-5 space-y-3 md:hidden">

              {appointments.map((appointment) => (
                <div
                  key={appointment.time}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50"
                >

                  {/* Patient */}

                  <div className="flex items-start justify-between gap-3">

                    <div className="flex min-w-0 items-center gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-xs font-bold text-white">
                        {appointment.avatar}
                      </div>

                      <div className="min-w-0">

                        <p className="truncate text-sm font-semibold text-slate-800 dark:text-white">
                          {appointment.patient}
                        </p>

                        <p className="truncate text-xs text-slate-400">
                          {appointment.doctor}
                        </p>

                      </div>

                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold sm:text-xs ${appointment.color}`}
                    >
                      {appointment.status}
                    </span>

                  </div>

                  {/* Appointment info */}

                  <div className="mt-4 grid grid-cols-2 gap-3">

                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-slate-400">
                        Time
                      </p>

                      <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <Clock3 className="h-3.5 w-3.5 text-cyan-500" />
                        {appointment.time}
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-slate-400">
                        Department
                      </p>

                      <p className="mt-1 truncate text-xs font-medium text-slate-700 dark:text-slate-300">
                        {appointment.department}
                      </p>
                    </div>

                  </div>

                </div>
              ))}

            </div>

            {/* ==================================================
                TABLE - TABLET / DESKTOP
            ================================================== */}

            <div className="mt-6 hidden overflow-x-auto md:block">

              <div className="min-w-[680px]">

                {/* Table Header */}

                <div className="grid grid-cols-[95px_1.3fr_1.2fr_1fr_110px] gap-3 border-b border-slate-100 px-3 pb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 lg:gap-4 lg:text-xs dark:border-slate-800">
                  <span>Time</span>
                  <span>Patient</span>
                  <span>Doctor</span>
                  <span>Department</span>
                  <span>Status</span>
                </div>

                {/* Rows */}

                <div className="divide-y divide-slate-100 dark:divide-slate-800">

                  {appointments.map((appointment) => (
                    <div
                      key={appointment.time}
                      className="grid grid-cols-[95px_1.3fr_1.2fr_1fr_110px] items-center gap-3 px-3 py-4 transition hover:bg-slate-50 lg:gap-4 dark:hover:bg-slate-800/40"
                    >

                      {/* Time */}

                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 lg:text-sm dark:text-slate-300">
                        <Clock3 className="h-4 w-4 shrink-0 text-cyan-500" />
                        {appointment.time}
                      </div>

                      {/* Patient */}

                      <div className="flex min-w-0 items-center gap-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-[10px] font-bold text-white">
                          {appointment.avatar}
                        </div>

                        <div className="min-w-0">

                          <p className="truncate text-xs font-semibold text-slate-800 lg:text-sm dark:text-white">
                            {appointment.patient}
                          </p>

                          <p className="text-[10px] text-slate-400 lg:text-xs">
                            Patient
                          </p>

                        </div>

                      </div>

                      {/* Doctor */}

                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-slate-700 lg:text-sm dark:text-slate-300">
                          {appointment.doctor}
                        </p>
                      </div>

                      {/* Department */}

                      <div className="min-w-0">
                        <span className="inline-block max-w-full truncate rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600 lg:px-2.5 lg:py-1 lg:text-xs dark:bg-slate-800 dark:text-slate-400">
                          {appointment.department}
                        </span>
                      </div>

                      {/* Status */}

                      <div>
                        <span
                          className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1.5 text-[10px] font-semibold lg:px-3 lg:text-xs ${appointment.color}`}
                        >
                          {appointment.status}
                        </span>
                      </div>

                    </div>
                  ))}

                </div>
              </div>
            </div>

          </motion.div>

          {/* ====================================================
              RECENT ACTIVITY
          ==================================================== */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6 dark:border-slate-800 dark:bg-slate-900"
          >

            <div className="flex items-center justify-between gap-3">

              <div className="min-w-0">
                <h2 className="font-bold text-slate-900 dark:text-white">
                  Recent Activity
                </h2>

                <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Latest hospital updates
                </p>
              </div>

              <button className="shrink-0 rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                <MoreHorizontal className="h-5 w-5" />
              </button>

            </div>

            <div className="mt-6 space-y-5">

              {activities.map((activity) => {
                const Icon = activity.icon;

                return (
                  <div
                    key={activity.title}
                    className="flex gap-3"
                  >

                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${activity.color}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="truncate text-sm font-semibold text-slate-800 dark:text-white">
                        {activity.title}
                      </p>

                      <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                        {activity.description}
                      </p>

                      <p className="mt-1 text-[10px] font-medium text-slate-400">
                        {activity.time}
                      </p>

                    </div>

                  </div>
                );
              })}

            </div>

            <button className="mt-6 flex w-full items-center justify-center gap-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-cyan-300 hover:text-cyan-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-cyan-700 dark:hover:text-cyan-400">
              View activity
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>

          </motion.div>

        </div>

        {/* ======================================================
            HEALTH STATUS
        ====================================================== */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        >

          <HealthStatus
            icon={HeartPulse}
            title="Hospital Status"
            value="Operational"
            description="All systems running normally"
            color="from-emerald-500 to-teal-600"
          />

          <HealthStatus
            icon={WalletCards}
            title="Today's Revenue"
            value="₹84,250"
            description="+11.4% compared to yesterday"
            color="from-blue-500 to-indigo-600"
          />

          <HealthStatus
            icon={BedDouble}
            title="Bed Occupancy"
            value="68%"
            description="24 beds currently available"
            color="from-orange-500 to-pink-600"
          />

        </motion.div>

      </div>
    </div>
  );
}

/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
  title,
  value,
  change,
  subtitle,
  icon: Icon,
  gradient,
  iconBg,
}: {
  title: string;
  value: string;
  change: string;
  subtitle: string;
  icon: React.ElementType;
  gradient: string;
  iconBg: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-xl hover:shadow-slate-200/50 sm:p-5 dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-black/20"
    >

      <div
        className={`absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br ${gradient} opacity-10 blur-xl`}
      />

      <div className="relative">

        <div className="flex items-center justify-between gap-2">

          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${iconBg}`}
          >
            <Icon className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
          </div>

          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 sm:text-xs">
            <ArrowUpRight className="h-3 w-3" />
            {change}
          </span>

        </div>

        <p className="mt-4 text-xs font-medium text-slate-500 sm:mt-5 sm:text-sm dark:text-slate-400">
          {title}
        </p>

        <p className="mt-1 truncate text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          {value}
        </p>

        <p className="mt-1 truncate text-[10px] text-slate-400 sm:text-xs">
          {subtitle}
        </p>

      </div>
    </motion.div>
  );
}

/* ============================================================
   QUICK ACTION
============================================================ */

function QuickAction({
  icon: Icon,
  title,
  description,
  gradient,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <button className="group flex w-full min-w-0 items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3 text-left transition-all hover:-translate-y-0.5 hover:border-transparent hover:bg-white hover:shadow-lg dark:border-slate-800 dark:bg-slate-800/50 dark:hover:bg-slate-800">

      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-md`}
      >
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">

        <p className="truncate text-sm font-semibold text-slate-800 dark:text-white">
          {title}
        </p>

        <p className="mt-0.5 truncate text-xs text-slate-400">
          {description}
        </p>

      </div>

      <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-cyan-500" />

    </button>
  );
}

/* ============================================================
   HEALTH STATUS
============================================================ */

function HealthStatus({
  icon: Icon,
  title,
  value,
  description,
  color,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
  description: string;
  color: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-800 dark:bg-slate-900">

      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg sm:h-12 sm:w-12`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0">

        <p className="truncate text-xs font-medium text-slate-400">
          {title}
        </p>

        <p className="mt-0.5 truncate font-bold text-slate-900 dark:text-white">
          {value}
        </p>

        <p className="mt-0.5 truncate text-xs text-slate-400">
          {description}
        </p>

      </div>

    </div>
  );
}