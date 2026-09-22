"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileText,
  FlaskConical,
  HeartPulse,
  Pill,
  Search,
  Stethoscope,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

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

type AppointmentStatus =
  | "Confirmed"
  | "In Progress"
  | "Pending"
  | "Completed";

type Appointment = {
  id: number;
  time: string;
  patient: string;
  doctor: string;
  department: string;
  status: AppointmentStatus;
  avatar: string;
};

/* ============================================================
   DEMO APPOINTMENT DATA
============================================================ */

const appointments: Appointment[] = [
  {
    id: 1,
    time: "09:00 AM",
    patient: "Rahul Kumar",
    doctor: "Dr. Priya Sharma",
    department: "Cardiology",
    status: "Completed",
    avatar: "RK",
  },
  {
    id: 2,
    time: "10:30 AM",
    patient: "Anita Reddy",
    doctor: "Dr. Arjun Rao",
    department: "Neurology",
    status: "In Progress",
    avatar: "AR",
  },
  {
    id: 3,
    time: "12:00 PM",
    patient: "Suresh Babu",
    doctor: "Dr. Neha Singh",
    department: "Orthopedics",
    status: "Confirmed",
    avatar: "SB",
  },
  {
    id: 4,
    time: "02:30 PM",
    patient: "Kavya Reddy",
    doctor: "Dr. Vikram Rao",
    department: "Pediatrics",
    status: "Pending",
    avatar: "KR",
  },
  {
    id: 5,
    time: "04:00 PM",
    patient: "Meena Devi",
    doctor: "Dr. Priya Sharma",
    department: "Cardiology",
    status: "Confirmed",
    avatar: "MD",
  },
];

/* ============================================================
   LAB APPROVAL DATA
============================================================ */

const labApprovals = [
  {
    id: 1,
    patient: "Anita Reddy",
    test: "Complete Blood Count",
    orderedBy: "Dr. Arjun Rao",
    time: "18 min ago",
    priority: "High",
  },
  {
    id: 2,
    patient: "Rahul Kumar",
    test: "Lipid Profile",
    orderedBy: "Dr. Priya Sharma",
    time: "42 min ago",
    priority: "Normal",
  },
  {
    id: 3,
    patient: "Kavya Reddy",
    test: "Thyroid Function Test",
    orderedBy: "Dr. Meera Singh",
    time: "1 hr ago",
    priority: "Normal",
  },
];

/* ============================================================
   PRESCRIPTION DATA
============================================================ */

const prescriptions = [
  {
    patient: "Rahul Kumar",
    medicine: "Atorvastatin 20mg",
    dosage: "1 tablet · Once daily",
    date: "Today",
    avatar: "RK",
  },
  {
    patient: "Anita Reddy",
    medicine: "Pregabalin 75mg",
    dosage: "1 capsule · Twice daily",
    date: "Today",
    avatar: "AR",
  },
  {
    patient: "Suresh Babu",
    medicine: "Paracetamol 500mg",
    dosage: "1 tablet · SOS",
    date: "Yesterday",
    avatar: "SB",
  },
];

/* ============================================================
   FOLLOW UPS
============================================================ */

const followUps = [
  {
    date: 30,
    month: "AUG",
    patient: "Rahul Kumar",
    type: "Cardiology follow-up",
  },
  {
    date: 2,
    month: "SEP",
    patient: "Anita Reddy",
    type: "Neurology review",
  },
  {
    date: 5,
    month: "SEP",
    patient: "Kavya Reddy",
    type: "Pediatrics follow-up",
  },
];

/* ============================================================
   DASHBOARD
============================================================ */

export default function DashboardPage() {
  const router = useRouter();

  /* ==========================================================
     USER
  ========================================================== */

  const [userName, setUserName] =
    useState("Doctor");

  const [hospitalName, setHospitalName] =
    useState("MedCore");

  /* ==========================================================
     SEARCH
  ========================================================== */

  const [search, setSearch] = useState("");

  /* ==========================================================
     CURRENT DATE
  ========================================================== */

  const [currentDate, setCurrentDate] =
    useState<Date | null>(null);

  /* ==========================================================
     LOAD USER
  ========================================================== */

  useEffect(() => {
    setCurrentDate(new Date());

    try {
      const session =
        localStorage.getItem("medcore_session");

      if (session) {
        const parsed: SessionData =
          JSON.parse(session);

        const user = parsed?.user;

        if (user?.fullName) {
          setUserName(user.fullName);
        }

        if (user?.hospitalName) {
          setHospitalName(user.hospitalName);
        }
      }
    } catch (error) {
      console.error(
        "Unable to load dashboard user:",
        error
      );
    }
  }, []);

  /* ==========================================================
     GREETING
  ========================================================== */

  const greeting = useMemo(() => {
    if (!currentDate) {
      return "Welcome";
    }

    const hour = currentDate.getHours();

    if (hour < 12) {
      return "Good morning";
    }

    if (hour < 17) {
      return "Good afternoon";
    }

    if (hour < 21) {
      return "Good evening";
    }

    return "Good night";
  }, [currentDate]);

  /* ==========================================================
     DATE FORMAT
  ========================================================== */

  const formattedDate = useMemo(() => {
    if (!currentDate) {
      return "";
    }

    return currentDate.toLocaleDateString(
      "en-IN",
      {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  }, [currentDate]);

  /* ==========================================================
     FILTER APPOINTMENTS
  ========================================================== */

  const filteredAppointments =
    appointments.filter((appointment) => {
      const query = search
        .trim()
        .toLowerCase();

      if (!query) {
        return true;
      }

      return (
        appointment.patient
          .toLowerCase()
          .includes(query) ||
        appointment.doctor
          .toLowerCase()
          .includes(query) ||
        appointment.department
          .toLowerCase()
          .includes(query)
      );
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50/30 p-3 sm:p-5 lg:p-7 dark:from-slate-950 dark:via-slate-950 dark:to-cyan-950/10">

      <div className="mx-auto w-full max-w-[1600px] space-y-5 sm:space-y-6">

        {/* ==================================================
            HERO
        ================================================== */}

   <motion.section
  initial={{
    opacity: 0,
    y: 20,
  }}
  animate={{
    opacity: 1,
    y: 0,
  }}
  className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600 p-4 shadow-xl shadow-blue-500/10 sm:rounded-3xl sm:p-6 lg:p-7"
>
  {/* Decorative circles */}

  <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

  <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl" />

  <div className="relative grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">

    {/* ============================================================
        HERO CONTENT
    ============================================================ */}

    <div className="min-w-0">

      {/* Hospital / Portal */}

      <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold text-cyan-100 sm:text-xs">

        <HeartPulse className="h-3.5 w-3.5 shrink-0" />

        <span className="truncate">
          {hospitalName} · Doctor Portal
        </span>

      </div>

      {/* Greeting */}

      <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">

        {greeting},{" "}

        <span className="break-words">
          {userName}
        </span>

        <span className="ml-1">
          👋
        </span>

      </h1>

      {/* Description */}

      <p className="mt-1.5 max-w-2xl text-xs leading-5 text-blue-100 sm:text-sm">

        Manage today's appointments, review patient
        information and stay on top of clinical tasks
        from one place.

      </p>

    </div>

    {/* ============================================================
        DATE
    ============================================================ */}

    <div className="flex w-full sm:w-auto">

      <div className="flex w-full items-center gap-2.5 rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 backdrop-blur-md sm:min-w-[190px]">

        {/* Calendar Icon */}

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15">

          <CalendarDays className="h-4 w-4 text-white" />

        </div>

        {/* Date Text */}

        <div>

          <p className="text-[9px] font-semibold uppercase tracking-wider text-blue-100">
            Today
          </p>

          <p className="text-xs font-bold text-white">
            {formattedDate}
          </p>

        </div>

      </div>

    </div>

  </div>
</motion.section>
        {/* ==================================================
            QUICK STATS
        ================================================== */}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">

          <DoctorStat
            title="Today's Appointments"
            value="5"
            subtitle="2 remaining"
            icon={CalendarDays}
            gradient="from-cyan-500 to-blue-600"
          />

          <DoctorStat
            title="My Patients"
            value="128"
            subtitle="12 new this month"
            icon={Users}
            gradient="from-violet-500 to-purple-600"
          />

          <DoctorStat
            title="Pending Labs"
            value="3"
            subtitle="Require review"
            icon={FlaskConical}
            gradient="from-orange-500 to-pink-600"
          />

          <DoctorStat
            title="Follow-ups"
            value="8"
            subtitle="This week"
            icon={HeartPulse}
            gradient="from-emerald-500 to-teal-600"
          />

        </div>

        {/* ==================================================
            PATIENT SEARCH
        ================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
          }}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-800 dark:bg-slate-900"
        >

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

            <div className="flex shrink-0 items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 dark:bg-cyan-950/40">

                <UserRound className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />

              </div>

              <div>

                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Quick Patient Lookup
                </h2>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Search patients before an encounter
                </p>

              </div>

            </div>

            <div className="relative w-full">

              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search patient, doctor or department..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

            </div>

          </div>

        </motion.div>

        {/* ==================================================
            MAIN TWO COLUMN
        ================================================== */}

        <div className="grid min-w-0 gap-5 xl:grid-cols-3">

          {/* ==================================================
              TODAY'S APPOINTMENTS
          ================================================== */}

          <motion.section
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.15,
            }}
            className="min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2 dark:border-slate-800 dark:bg-slate-900"
          >

            <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-4 sm:p-5 dark:border-slate-800">

              <div className="min-w-0">

                <div className="flex items-center gap-2">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-50 dark:bg-cyan-950/40">

                    <CalendarDays className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />

                  </div>

                  <h2 className="truncate text-base font-bold text-slate-900 dark:text-white">
                    Today's Appointments
                  </h2>

                </div>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Your clinical schedule for today
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  router.push("/appointments")
                }
                className="flex shrink-0 items-center gap-1 text-xs font-semibold text-cyan-600 hover:text-cyan-700 dark:text-cyan-400"
              >
                <span className="hidden sm:inline">
                  View all
                </span>

                <ArrowRight className="h-4 w-4" />
              </button>

            </div>

            {/* Desktop / Tablet appointment list */}

            <div className="divide-y divide-slate-100 dark:divide-slate-800">

              {filteredAppointments.length === 0 ? (

                <div className="p-8 text-center">

                  <Search className="mx-auto h-8 w-8 text-slate-300" />

                  <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                    No appointments found
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Try another patient name
                  </p>

                </div>

              ) : (

                filteredAppointments.map(
                  (
                    appointment,
                    index
                  ) => (

                    <AppointmentRow
                      key={appointment.id}
                      appointment={appointment}
                      index={index}
                    />

                  )
                )

              )}

            </div>

          </motion.section>

          {/* ==================================================
              PENDING LAB APPROVALS
          ================================================== */}

          <motion.section
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.2,
            }}
            className="min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >

            <div className="flex items-center justify-between border-b border-slate-100 p-4 sm:p-5 dark:border-slate-800">

              <div>

                <div className="flex items-center gap-2">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/40">

                    <FlaskConical className="h-4 w-4 text-purple-600 dark:text-purple-400" />

                  </div>

                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Pending Lab Results
                  </h2>

                </div>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Reports waiting for your review
                </p>

              </div>

              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-red-100 px-2 text-[10px] font-bold text-red-600 dark:bg-red-950/40 dark:text-red-400">
                {labApprovals.length}
              </span>

            </div>

            <div className="space-y-3 p-4 sm:p-5">

              {labApprovals.map((lab) => (

                <div
                  key={lab.id}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-3 transition hover:border-purple-200 hover:bg-purple-50/40 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-purple-900"
                >

                  <div className="flex gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 text-xs font-bold text-white">
                      {lab.patient
                        .split(" ")
                        .map(
                          (part) =>
                            part[0]
                        )
                        .join("")
                        .slice(0, 2)}
                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex items-start justify-between gap-2">

                        <div className="min-w-0">

                          <p className="truncate text-sm font-semibold text-slate-800 dark:text-white">
                            {lab.patient}
                          </p>

                          <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                            {lab.test}
                          </p>

                        </div>

                        <span
                          className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-bold ${
                            lab.priority === "High"
                              ? "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                              : "bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                          }`}
                        >
                          {lab.priority}
                        </span>

                      </div>

                      <div className="mt-2 flex items-center justify-between gap-2">

                        <span className="text-[10px] text-slate-400">
                          {lab.time}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              "/laboratory"
                            )
                          }
                          className="text-[10px] font-bold text-purple-600 hover:text-purple-700 dark:text-purple-400"
                        >
                          Review
                        </button>

                      </div>

                    </div>

                  </div>

                </div>

              ))}

              <button
                type="button"
                onClick={() =>
                  router.push("/laboratory")
                }
                className="flex w-full items-center justify-center gap-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-purple-300 hover:text-purple-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-purple-800 dark:hover:text-purple-400"
              >
                View all lab results
                <ArrowRight className="h-3.5 w-3.5" />
              </button>

            </div>

          </motion.section>

        </div>

        {/* ==================================================
            SECOND ROW
        ================================================== */}

        <div className="grid min-w-0 gap-5 lg:grid-cols-2">

          {/* ==================================================
              FOLLOW UPS
          ================================================== */}

          <motion.section
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.25,
            }}
            className="min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >

            <div className="flex items-center justify-between border-b border-slate-100 p-4 sm:p-5 dark:border-slate-800">

              <div>

                <div className="flex items-center gap-2">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/40">

                    <HeartPulse className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />

                  </div>

                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Upcoming Follow-ups
                  </h2>

                </div>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Patients scheduled for review
                </p>

              </div>

              <div className="flex gap-1">

                <button
                  type="button"
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

              </div>

            </div>

            {/* Mini calendar */}

            <div className="p-4 sm:p-5">

              <div className="grid grid-cols-7 gap-1 text-center">

             {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
  <span
    key={`${day}-${index}`}
    className="py-2 text-[10px] font-bold text-slate-400"
  >
    {day}
  </span>
))}
                {Array.from(
                  { length: 31 },
                  (_, index) =>
                    index + 1
                ).map((day) => {

                  const selected =
                    [30].includes(day);

                  const hasFollowUp =
                    followUps.some(
                      (item) =>
                        item.date === day
                    );

                  return (
                    <div
                      key={day}
                      className={`
                        relative flex h-8
                        items-center justify-center
                        rounded-lg text-xs
                        ${
                          selected
                            ? "bg-cyan-600 font-bold text-white"
                            : hasFollowUp
                            ? "bg-emerald-50 font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                            : "text-slate-600 dark:text-slate-400"
                        }
                      `}
                    >
                      {day}

                      {hasFollowUp &&
                        !selected && (
                          <span className="absolute bottom-1 h-1 w-1 rounded-full bg-emerald-500" />
                        )}
                    </div>
                  );
                })}

              </div>

              {/* Follow-up list */}

              <div className="mt-5 space-y-2">

                {followUps.map(
                  (followUp) => (

                    <div
                      key={`${followUp.patient}-${followUp.date}`}
                      className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50"
                    >

                      <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-white shadow-sm dark:bg-slate-900">

                        <span className="text-[8px] font-bold text-cyan-600">
                          {followUp.month}
                        </span>

                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {followUp.date}
                        </span>

                      </div>

                      <div className="min-w-0">

                        <p className="truncate text-xs font-semibold text-slate-800 dark:text-white">
                          {followUp.patient}
                        </p>

                        <p className="truncate text-[10px] text-slate-400">
                          {followUp.type}
                        </p>

                      </div>

                    </div>

                  )
                )}

              </div>

            </div>

          </motion.section>

          {/* ==================================================
              RECENT PRESCRIPTIONS
          ================================================== */}

          <motion.section
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.3,
            }}
            className="min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >

            <div className="flex items-center justify-between border-b border-slate-100 p-4 sm:p-5 dark:border-slate-800">

              <div>

                <div className="flex items-center gap-2">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-50 dark:bg-pink-950/40">

                    <Pill className="h-4 w-4 text-pink-600 dark:text-pink-400" />

                  </div>

                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Recent Prescriptions
                  </h2>

                </div>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Recently issued medications
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/prescriptions"
                  )
                }
                className="text-xs font-semibold text-cyan-600 dark:text-cyan-400"
              >
                View all
              </button>

            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">

              {prescriptions.map(
                (prescription) => (

                  <div
                    key={`${prescription.patient}-${prescription.medicine}`}
                    className="flex items-center gap-3 p-4 transition hover:bg-slate-50 sm:p-5 dark:hover:bg-slate-800/40"
                  >

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 text-[10px] font-bold text-white shadow-sm">
                      {prescription.avatar}
                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="truncate text-sm font-semibold text-slate-800 dark:text-white">
                        {prescription.patient}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                        {prescription.medicine}
                      </p>

                      <p className="mt-1 truncate text-[10px] text-slate-400">
                        {prescription.dosage}
                      </p>

                    </div>

                    <span className="shrink-0 text-[10px] text-slate-400">
                      {prescription.date}
                    </span>

                  </div>

                )
              )}

            </div>

            <div className="p-4">

              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/prescriptions"
                  )
                }
                className="flex w-full items-center justify-center gap-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-pink-300 hover:text-pink-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-pink-800 dark:hover:text-pink-400"
              >
                Manage prescriptions
                <ArrowRight className="h-3.5 w-3.5" />
              </button>

            </div>

          </motion.section>

        </div>

        {/* ==================================================
            CLINICAL SHORTCUTS
        ================================================== */}

        <motion.section
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.35,
          }}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-800 dark:bg-slate-900"
        >

          <div className="mb-4">

            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Clinical Shortcuts
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Frequently used doctor workflows
            </p>

          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

            <Shortcut
              icon={Users}
              title="Patients"
              description="View patients"
              gradient="from-cyan-500 to-blue-600"
              onClick={() =>
                router.push("/patients")
              }
            />

            <Shortcut
              icon={CalendarDays}
              title="Appointments"
              description="Manage schedule"
              gradient="from-violet-500 to-purple-600"
              onClick={() =>
                router.push("/appointments")
              }
            />

            <Shortcut
              icon={FileText}
              title="Medical Records"
              description="Open EMR"
              gradient="from-orange-500 to-pink-600"
              onClick={() =>
                router.push("/emr")
              }
            />

            <Shortcut
              icon={Stethoscope}
              title="Doctors"
              description="Doctor directory"
              gradient="from-emerald-500 to-teal-600"
              onClick={() =>
                router.push("/doctors")
              }
            />

          </div>

        </motion.section>

      </div>
    </div>
  );
}

/* ============================================================
   DOCTOR STAT
============================================================ */

function DoctorStat({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  gradient: string;
}) {
  return (
    <motion.div
      whileHover={{
        y: -3,
      }}
      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-lg sm:p-5 dark:border-slate-800 dark:bg-slate-900"
    >

      <div
        className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${gradient} opacity-10 blur-2xl`}
      />

      <div className="relative">

        <div className="flex items-center justify-between gap-2">

          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-md`}
          >
            <Icon className="h-4 w-4" />
          </div>

          <Activity className="h-4 w-4 text-emerald-500" />

        </div>

        <p className="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">
          {title}
        </p>

        <p className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
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
   APPOINTMENT ROW
============================================================ */

function AppointmentRow({
  appointment,
  index,
}: {
  appointment: Appointment;
  index: number;
}) {
  const statusConfig = {
    Confirmed: {
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      text: "text-emerald-700 dark:text-emerald-400",
      dot: "bg-emerald-500",
    },
    "In Progress": {
      bg: "bg-blue-50 dark:bg-blue-950/30",
      text: "text-blue-700 dark:text-blue-400",
      dot: "bg-blue-500",
    },
    Pending: {
      bg: "bg-amber-50 dark:bg-amber-950/30",
      text: "text-amber-700 dark:text-amber-400",
      dot: "bg-amber-500",
    },
    Completed: {
      bg: "bg-slate-100 dark:bg-slate-800",
      text: "text-slate-600 dark:text-slate-400",
      dot: "bg-slate-400",
    },
  };

  const status =
    statusConfig[appointment.status];

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: -10,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      transition={{
        delay: index * 0.05,
      }}
      className="group flex flex-col gap-3 p-4 transition hover:bg-slate-50 sm:grid sm:grid-cols-[90px_1.5fr_1.2fr_1fr_auto] sm:items-center sm:gap-4 sm:p-5 dark:hover:bg-slate-800/40"
    >

      {/* Time */}

      <div className="flex items-center justify-between sm:block">

        <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">

          <Clock3 className="h-4 w-4 text-cyan-500" />

          {appointment.time}

        </div>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold sm:hidden ${status.bg} ${status.text}`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
          />

          {appointment.status}
        </span>

      </div>

      {/* Patient */}

      <div className="flex min-w-0 items-center gap-3">

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-[10px] font-bold text-white shadow-sm">
          {appointment.avatar}
        </div>

        <div className="min-w-0">

          <p className="truncate text-sm font-semibold text-slate-800 dark:text-white">
            {appointment.patient}
          </p>

          <p className="mt-0.5 text-[10px] text-slate-400">
            Patient
          </p>

        </div>

      </div>

      {/* Doctor */}

      <div className="hidden min-w-0 sm:block">

        <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-300">
          {appointment.doctor}
        </p>

      </div>

      {/* Department */}

      <div className="hidden sm:block">

        <span className="inline-flex max-w-full truncate rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
          {appointment.department}
        </span>

      </div>

      {/* Status */}

      <div className="hidden sm:block">

        <span
          className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 text-[10px] font-bold ${status.bg} ${status.text}`}
        >

          <span
            className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
          />

          {appointment.status}

        </span>

      </div>

      {/* Mobile department */}

      <div className="flex items-center justify-between sm:hidden">

        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
          {appointment.department}
        </span>

        <span className="text-[10px] text-slate-400">
          {appointment.doctor}
        </span>

      </div>

    </motion.div>
  );
}

/* ============================================================
   SHORTCUT
============================================================ */

function Shortcut({
  icon: Icon,
  title,
  description,
  gradient,
  onClick,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-w-0 items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 text-left transition-all hover:-translate-y-0.5 hover:border-transparent hover:bg-white hover:shadow-lg sm:gap-3 sm:p-4 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:bg-slate-800"
    >

      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-md sm:h-10 sm:w-10`}
      >
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">

        <p className="truncate text-xs font-semibold text-slate-800 sm:text-sm dark:text-white">
          {title}
        </p>

        <p className="mt-0.5 truncate text-[9px] text-slate-400 sm:text-[10px]">
          {description}
        </p>

      </div>

      <ArrowRight className="hidden h-3.5 w-3.5 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-cyan-500 sm:block" />

    </button>
  );
}