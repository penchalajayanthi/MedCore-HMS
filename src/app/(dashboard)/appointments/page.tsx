"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  HeartPulse,
  Plus,
  Search,
  Stethoscope,
  UserRound,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

type Appointment = {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  type: string;
  reason?: string;
  emergency: boolean;
  status: AppointmentStatus;
};

/* =======================================================
   GET TODAY'S DATE
   Format: YYYY-MM-DD
======================================================= */

function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();

  const month = String(today.getMonth() + 1).padStart(
    2,
    "0"
  );

  const day = String(today.getDate()).padStart(
    2,
    "0"
  );

  return `${year}-${month}-${day}`;
}

/* =======================================================
   DEMO APPOINTMENTS
======================================================= */

const demoAppointments: Appointment[] = [
  {
    id: "APT-1001",
    patientId: "PT-1001",
    patientName: "Ananya Reddy",
    doctorId: "DOC-001",
    doctorName: "Dr. Priya Sharma",
    department: "Cardiology",
    date: getTodayDate(),
    time: "09:00 AM",
    type: "CONSULTATION",
    reason: "Regular consultation",
    emergency: false,
    status: "PENDING",
  },

  {
    id: "APT-1002",
    patientId: "PT-1002",
    patientName: "Rahul Kumar",
    doctorId: "DOC-002",
    doctorName: "Dr. Arjun Rao",
    department: "General Medicine",
    date: getTodayDate(),
    time: "10:00 AM",
    type: "FOLLOW_UP",
    reason: "Follow-up consultation",
    emergency: false,
    status: "CONFIRMED",
  },

  {
    id: "APT-1003",
    patientId: "PT-1003",
    patientName: "Sneha Patel",
    doctorId: "DOC-003",
    doctorName: "Dr. Meera Nair",
    department: "Dermatology",
    date: getTodayDate(),
    time: "11:30 AM",
    type: "CONSULTATION",
    reason: "Skin consultation",
    emergency: false,
    status: "IN_PROGRESS",
  },

  {
    id: "APT-1004",
    patientId: "PT-1004",
    patientName: "Vikram Singh",
    doctorId: "DOC-004",
    doctorName: "Dr. Karthik Reddy",
    department: "Orthopedics",
    date: getTodayDate(),
    time: "02:00 PM",
    type: "CONSULTATION",
    reason: "Orthopedic consultation",
    emergency: false,
    status: "COMPLETED",
  },
];

/* =======================================================
   STATUS OPTIONS
======================================================= */

const statusOptions: AppointmentStatus[] = [
  "PENDING",
  "CONFIRMED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
];

/* =======================================================
   STATUS COLORS
======================================================= */

function getStatusClasses(status: AppointmentStatus) {
  switch (status) {
    case "PENDING":
      return "border-amber-200 bg-amber-50 text-amber-700";

    case "CONFIRMED":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "IN_PROGRESS":
      return "border-cyan-200 bg-cyan-50 text-cyan-700";

    case "COMPLETED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "CANCELLED":
      return "border-red-200 bg-red-50 text-red-700";

    case "NO_SHOW":
      return "border-slate-200 bg-slate-100 text-slate-600";

    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
}

/* =======================================================
   STATUS ICON
======================================================= */

function getStatusIcon(status: AppointmentStatus) {
  switch (status) {
    case "PENDING":
      return <Clock3 className="h-3.5 w-3.5" />;

    case "CONFIRMED":
      return <CheckCircle2 className="h-3.5 w-3.5" />;

    case "IN_PROGRESS":
      return <HeartPulse className="h-3.5 w-3.5" />;

    case "COMPLETED":
      return <CheckCircle2 className="h-3.5 w-3.5" />;

    case "CANCELLED":
      return <XCircle className="h-3.5 w-3.5" />;

    case "NO_SHOW":
      return <AlertCircle className="h-3.5 w-3.5" />;

    default:
      return null;
  }
}

/* =======================================================
   FORMAT STATUS
======================================================= */

function formatStatus(status: AppointmentStatus) {
  return status.replace("_", " ");
}

/* =======================================================
   MAIN PAGE
======================================================= */

export default function AppointmentsPage() {
  const router = useRouter();

  /* -------------------------------------------------------
     APPOINTMENTS
  ------------------------------------------------------- */

  const [appointments, setAppointments] = useState<
    Appointment[]
  >([]);

  /* -------------------------------------------------------
     SEARCH
  ------------------------------------------------------- */

  const [searchQuery, setSearchQuery] = useState("");

  /* -------------------------------------------------------
     STATUS FILTER
  ------------------------------------------------------- */

  const [statusFilter, setStatusFilter] = useState<
    "ALL" | AppointmentStatus
  >("ALL");

  /* -------------------------------------------------------
     DATE FILTER
     Default = TODAY
  ------------------------------------------------------- */

  const [dateFilter, setDateFilter] = useState(
    getTodayDate()
  );

  /* -------------------------------------------------------
     LOADING
  ------------------------------------------------------- */

  const [isLoading, setIsLoading] = useState(true);

  /* =======================================================
     LOAD APPOINTMENTS
  ======================================================= */

  useEffect(() => {
    try {
      const stored = localStorage.getItem(
        "medcore_appointments"
      );

      if (stored) {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          setAppointments(parsed);
        } else {
          setAppointments(demoAppointments);
        }
      } else {
        setAppointments(demoAppointments);
      }
    } catch {
      setAppointments(demoAppointments);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* =======================================================
     FILTER APPOINTMENTS
  ======================================================= */

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const search = searchQuery
        .toLowerCase()
        .trim();

      const matchesSearch =
        !search ||
        appointment.patientName
          .toLowerCase()
          .includes(search) ||
        appointment.doctorName
          .toLowerCase()
          .includes(search) ||
        appointment.id
          .toLowerCase()
          .includes(search);

      const matchesStatus =
        statusFilter === "ALL" ||
        appointment.status === statusFilter;

      const matchesDate =
        !dateFilter ||
        appointment.date === dateFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDate
      );
    });
  }, [
    appointments,
    searchQuery,
    statusFilter,
    dateFilter,
  ]);

  /* =======================================================
     STATISTICS
  ======================================================= */

  const counts = useMemo(() => {
    const dateAppointments = appointments.filter(
      (appointment) =>
        appointment.date === dateFilter
    );

    return {
      total: dateAppointments.length,

      pending: dateAppointments.filter(
        (item) => item.status === "PENDING"
      ).length,

      confirmed: dateAppointments.filter(
        (item) => item.status === "CONFIRMED"
      ).length,

      inProgress: dateAppointments.filter(
        (item) => item.status === "IN_PROGRESS"
      ).length,

      completed: dateAppointments.filter(
        (item) => item.status === "COMPLETED"
      ).length,
    };
  }, [appointments, dateFilter]);

  /* =======================================================
     UPDATE STATUS
  ======================================================= */

  const updateStatus = (
    appointmentId: string,
    newStatus: AppointmentStatus
  ) => {
    const updated = appointments.map(
      (appointment) =>
        appointment.id === appointmentId
          ? {
              ...appointment,
              status: newStatus,
            }
          : appointment
    );

    setAppointments(updated);

    localStorage.setItem(
      "medcore_appointments",
      JSON.stringify(updated)
    );
  };

  /* =======================================================
     STATUS LIFECYCLE
  ======================================================= */

  const canMoveToStatus = (
    current: AppointmentStatus,
    next: AppointmentStatus
  ) => {
    if (current === "PENDING") {
      return [
        "CONFIRMED",
        "CANCELLED",
        "NO_SHOW",
      ].includes(next);
    }

    if (current === "CONFIRMED") {
      return [
        "IN_PROGRESS",
        "CANCELLED",
        "NO_SHOW",
      ].includes(next);
    }

    if (current === "IN_PROGRESS") {
      return ["COMPLETED"].includes(next);
    }

    return false;
  };

  /* =======================================================
     TODAY BUTTON
  ======================================================= */

  const handleToday = () => {
    setDateFilter(getTodayDate());
  };

  /* =======================================================
     OPEN NEW APPOINTMENT
  ======================================================= */

  const openNewAppointment = () => {
    router.push("/appointments/new");
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-50/70 p-3 sm:p-5 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-5 sm:space-y-6">

        {/* =================================================
            HIGHLIGHTED PAGE HEADER
        ================================================= */}

        <motion.section
          initial={{
            opacity: 0,
            y: -18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="relative overflow-hidden rounded-3xl border border-cyan-200 bg-gradient-to-br from-cyan-700 via-cyan-600 to-blue-700 p-5 shadow-xl shadow-cyan-900/10 sm:p-7 lg:p-8"
        >
          {/* Decorative background */}

          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10 blur-2xl" />

          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-blue-300/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            {/* LEFT */}

            <div className="max-w-2xl text-white">

              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                <CalendarDays className="h-3.5 w-3.5" />

                Hospital Management

                <span className="text-white/50">
                  /
                </span>

                Appointment Management
              </div>

              <div className="flex items-start gap-4">

                <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-lg backdrop-blur-sm sm:flex">
                  <CalendarDays className="h-7 w-7 text-white" />
                </div>

                <div>
                  <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                    Appointments
                  </h1>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-cyan-50 sm:text-base">
                    Schedule, monitor and manage
                    patient appointments with a
                    clear clinical status lifecycle.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">

                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                  {counts.total} appointments
                </span>

                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                  {counts.confirmed} confirmed
                </span>

                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                  {counts.inProgress} in progress
                </span>
              </div>
            </div>

            {/* BOOK APPOINTMENT */}

            <div className="shrink-0">
              <button
                type="button"
                onClick={openNewAppointment}
                className="group inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/30 bg-white px-5 text-sm font-bold text-cyan-700 shadow-xl shadow-cyan-950/20 transition duration-200 hover:-translate-y-0.5 hover:bg-cyan-50 active:translate-y-0 sm:w-auto sm:px-6"
              >
                <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />

                Book Appointment
              </button>

              <p className="mt-2 text-center text-[11px] text-cyan-100">
                Create a new patient appointment
              </p>
            </div>
          </div>
        </motion.section>

        {/* =================================================
            SELECTED DATE
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="rounded-2xl border border-blue-200 bg-blue-50/60 p-3 shadow-sm sm:p-4"
        >
          <div className="flex flex-wrap items-center gap-2">

            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white px-3 py-1.5 text-xs font-semibold text-cyan-700 shadow-sm">
              <CalendarDays className="h-3.5 w-3.5" />

              Showing appointments for
            </span>

            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
              {dateFilter}
            </span>

            {dateFilter === getTodayDate() && (
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                Today
              </span>
            )}
          </div>
        </motion.div>

        {/* =================================================
            STATS
        ================================================= */}

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">

          <StatCard
            label="Total"
            value={counts.total}
            icon={
              <CalendarDays className="h-5 w-5" />
            }
            borderClass="border-cyan-200"
            iconClass="bg-cyan-50 text-cyan-600"
          />

          <StatCard
            label="Pending"
            value={counts.pending}
            icon={
              <Clock3 className="h-5 w-5" />
            }
            borderClass="border-amber-200"
            iconClass="bg-amber-50 text-amber-600"
          />

          <StatCard
            label="Confirmed"
            value={counts.confirmed}
            icon={
              <CheckCircle2 className="h-5 w-5" />
            }
            borderClass="border-blue-200"
            iconClass="bg-blue-50 text-blue-600"
          />

          <StatCard
            label="In Progress"
            value={counts.inProgress}
            icon={
              <HeartPulse className="h-5 w-5" />
            }
            borderClass="border-violet-200"
            iconClass="bg-violet-50 text-violet-600"
          />

          <StatCard
            label="Completed"
            value={counts.completed}
            icon={
              <CheckCircle2 className="h-5 w-5" />
            }
            borderClass="border-emerald-200"
            iconClass="bg-emerald-50 text-emerald-600"
          />
        </div>

        {/* =================================================
            FILTERS
        ================================================= */}

        <motion.section
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="rounded-2xl border border-violet-200 bg-white p-4 shadow-sm sm:p-5"
        >
          {/* Filter heading */}

          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Search className="h-4 w-4" />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Find Appointments
                </h2>

                <p className="text-xs text-slate-500">
                  Search and filter the appointment
                  schedule
                </p>
              </div>
            </div>

            <span className="w-fit rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-violet-700">
              Filters
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-3">

            {/* SEARCH */}

            <div className="relative">

              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(
                    event.target.value
                  )
                }
                placeholder="Search patient, doctor or ID..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
              />
            </div>

            {/* STATUS */}

            <div className="relative">

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as
                      | "ALL"
                      | AppointmentStatus
                  )
                }
                className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 pr-10 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
              >
                <option value="ALL">
                  All Statuses
                </option>

                {statusOptions.map(
                  (status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {formatStatus(status)}
                    </option>
                  )
                )}
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>

            {/* DATE */}

            <div className="relative">

              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="date"
                value={dateFilter}
                onChange={(event) =>
                  setDateFilter(
                    event.target.value
                  )
                }
                className="h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-16 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
              />

              <button
                type="button"
                onClick={handleToday}
                className="absolute right-2 top-1/2 cursor-pointer -translate-y-1/2 rounded-lg bg-cyan-50 px-2.5 py-1.5 text-[10px] font-bold text-cyan-700 transition hover:bg-cyan-100 active:scale-95"
              >
                Today
              </button>
            </div>
          </div>
        </motion.section>

        {/* =================================================
            APPOINTMENT SCHEDULE
        ================================================= */}

        <motion.section
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
          className="overflow-hidden rounded-2xl border border-cyan-200 bg-white shadow-sm"
        >

          {/* TABLE HEADER */}

          <div className="border-b border-cyan-100 bg-gradient-to-r from-cyan-50/80 via-white to-blue-50/70 px-4 py-4 sm:px-5">

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
                  <CalendarDays className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Appointment Schedule
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    {filteredAppointments.length}{" "}
                    appointment
                    {filteredAppointments.length !==
                    1
                      ? "s"
                      : ""}{" "}
                    displayed
                  </p>
                </div>
              </div>

              <div className="flex w-fit items-center gap-2 rounded-xl border border-blue-100 bg-white px-3 py-2 shadow-sm">

                <CalendarDays className="h-4 w-4 text-blue-600" />

                <span className="text-xs font-semibold text-slate-600">
                  {dateFilter}
                </span>
              </div>
            </div>
          </div>

          {/* =================================================
              LOADING
          ================================================= */}

          {isLoading ? (
            <div className="flex min-h-[300px] items-center justify-center">

              <div className="flex items-center gap-3 text-sm text-slate-500">

                <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-cyan-600" />

                Loading appointments...
              </div>
            </div>
          ) : filteredAppointments.length ===
            0 ? (

            /* =================================================
               EMPTY STATE
            ================================================= */

            <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-200 bg-cyan-50">
                <CalendarDays className="h-8 w-8 text-cyan-500" />
              </div>

              <h3 className="mt-5 text-base font-bold text-slate-800">
                No appointments found
              </h3>

              <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
                There are no appointments for
                the selected date and filters.
              </p>

              <button
                type="button"
                onClick={openNewAppointment}
                className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:from-cyan-700 hover:to-blue-700 active:translate-y-0"
              >
                <Plus className="h-4 w-4" />

                Create Appointment
              </button>
            </div>
          ) : (
            <>
              {/* =================================================
                  DESKTOP TABLE
              ================================================= */}

              <div className="hidden overflow-x-auto lg:block">

                <table className="w-full">

                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70 text-left">

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Appointment
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Patient
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Doctor
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Date & Time
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Status
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Update
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredAppointments.map(
                      (appointment) => (
                        <tr
                          key={appointment.id}
                          className="border-b border-slate-100 transition last:border-0 hover:bg-cyan-50/30"
                        >

                          {/* APPOINTMENT */}

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">

                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-200 bg-cyan-50 text-cyan-600">
                                <CalendarDays className="h-4 w-4" />
                              </div>

                              <div>
                                <p className="text-sm font-semibold text-slate-800">
                                  {appointment.id}
                                </p>

                                <p className="text-xs text-slate-400">
                                  {appointment.type.replace(
                                    "_",
                                    " "
                                  )}
                                </p>
                              </div>

                              {appointment.emergency && (
                                <span className="rounded-full border border-red-200 bg-red-50 px-2 py-1 text-[10px] font-semibold text-red-600">
                                  EMERGENCY
                                </span>
                              )}
                            </div>
                          </td>

                          {/* PATIENT */}

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">

                              <UserRound className="h-4 w-4 text-slate-400" />

                              <div>
                                <p className="text-sm font-medium text-slate-700">
                                  {appointment.patientName}
                                </p>

                                <p className="text-xs text-slate-400">
                                  {appointment.patientId}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* DOCTOR */}

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">

                              <Stethoscope className="h-4 w-4 text-slate-400" />

                              <div>
                                <p className="text-sm font-medium text-slate-700">
                                  {appointment.doctorName}
                                </p>

                                <p className="text-xs text-slate-400">
                                  {appointment.department}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* DATE */}

                          <td className="px-5 py-4">
                            <p className="text-sm font-medium text-slate-700">
                              {appointment.date}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {appointment.time}
                            </p>
                          </td>

                          {/* STATUS */}

                          <td className="px-5 py-4">
                            <StatusBadge
                              status={
                                appointment.status
                              }
                            />
                          </td>

                          {/* UPDATE */}

                          <td className="px-5 py-4">
                            <StatusSelect
                              appointment={
                                appointment
                              }
                              onChange={
                                updateStatus
                              }
                              canMoveToStatus={
                                canMoveToStatus
                              }
                            />
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* =================================================
                  MOBILE / TABLET
              ================================================= */}

              <div className="divide-y divide-slate-100 lg:hidden">

                {filteredAppointments.map(
                  (appointment) => (
                    <div
                      key={appointment.id}
                      className="p-4 sm:p-5"
                    >

                      <div className="flex items-start justify-between gap-4">

                        <div className="flex min-w-0 gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-200 bg-cyan-50 text-cyan-600">
                            <CalendarDays className="h-5 w-5" />
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-800">
                              {appointment.id}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {appointment.type.replace(
                                "_",
                                " "
                              )}
                            </p>
                          </div>
                        </div>

                        <StatusBadge
                          status={
                            appointment.status
                          }
                        />
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">

                        <InfoItem
                          icon={
                            <UserRound className="h-4 w-4" />
                          }
                          label="Patient"
                          value={`${appointment.patientName} (${appointment.patientId})`}
                        />

                        <InfoItem
                          icon={
                            <Stethoscope className="h-4 w-4" />
                          }
                          label="Doctor"
                          value={`${appointment.doctorName} • ${appointment.department}`}
                        />

                        <InfoItem
                          icon={
                            <CalendarDays className="h-4 w-4" />
                          }
                          label="Date"
                          value={
                            appointment.date
                          }
                        />

                        <InfoItem
                          icon={
                            <Clock3 className="h-4 w-4" />
                          }
                          label="Time"
                          value={
                            appointment.time
                          }
                        />
                      </div>

                      <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/40 p-3">

                        <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-blue-600">
                          Appointment Status
                        </p>

                        <StatusSelect
                          appointment={
                            appointment
                          }
                          onChange={
                            updateStatus
                          }
                          canMoveToStatus={
                            canMoveToStatus
                          }
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            </>
          )}
        </motion.section>
      </div>
    </div>
  );
}

/* =======================================================
   STAT CARD
======================================================= */

function StatCard({
  label,
  value,
  icon,
  borderClass,
  iconClass,
}: {
  label: string;
  value: number;
  icon: ReactNode;
  borderClass: string;
  iconClass: string;
}) {
  return (
    <motion.div
      whileHover={{
        y: -2,
      }}
      className={`rounded-2xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5 ${borderClass}`}
    >
      <div className="flex items-center justify-between">

        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-4 text-2xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs font-medium text-slate-500">
        {label}
      </p>
    </motion.div>
  );
}

/* =======================================================
   STATUS BADGE
======================================================= */

function StatusBadge({
  status,
}: {
  status: AppointmentStatus;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] font-semibold ${getStatusClasses(
        status
      )}`}
    >
      {getStatusIcon(status)}

      {formatStatus(status)}
    </span>
  );
}

/* =======================================================
   STATUS SELECT
======================================================= */

function StatusSelect({
  appointment,
  onChange,
  canMoveToStatus,
}: {
  appointment: Appointment;

  onChange: (
    appointmentId: string,
    status: AppointmentStatus
  ) => void;

  canMoveToStatus: (
    current: AppointmentStatus,
    next: AppointmentStatus
  ) => boolean;
}) {
  const allowedStatuses =
    statusOptions.filter(
      (status) =>
        status === appointment.status ||
        canMoveToStatus(
          appointment.status,
          status
        )
    );

  return (
    <div className="relative min-w-[165px]">

      <select
        value={appointment.status}
        onChange={(event) =>
          onChange(
            appointment.id,
            event.target.value as AppointmentStatus
          )
        }
        className="h-10 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-9 text-xs font-medium text-slate-700 outline-none transition hover:border-cyan-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
      >
        {allowedStatuses.map(
          (status) => (
            <option
              key={status}
              value={status}
            >
              {formatStatus(status)}
            </option>
          )
        )}
      </select>

      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}

/* =======================================================
   INFO ITEM
======================================================= */

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">

      <div className="flex items-center gap-2 text-slate-400">
        {icon}

        <span className="text-[10px] font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>

      <p className="mt-1 text-xs font-medium text-slate-700">
        {value}
      </p>
    </div>
  );
}