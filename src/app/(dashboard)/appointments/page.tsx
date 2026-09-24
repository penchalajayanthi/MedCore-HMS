"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Filter,
  HeartPulse,
  RefreshCw,
  Search,
  Stethoscope,
  UserRound,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type AppointmentStatus =
  | "PENDING"
  |  "CONFIRMED"
  |  "IN_PROGRESS"
  |  "COMPLETED"
  |  "CANCELLED"
  |  "NO_SHOW";

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

const APPOINTMENTS_STORAGE_KEY = "medcore_appointments";
const APPOINTMENTS_UPDATED_EVENT = "medcore-appointments-updated";

const getTodayDate = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

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
    reason: "Regular cardiac consultation",
    emergency: false,
    status: "CONFIRMED",
  },
  {
    id: "APT-1002",
    patientId: "PT-1002",
    patientName: "Rahul Kumar",
    doctorId: "DOC-002",
    doctorName: "Dr. Arjun Rao",
    department: "General Medicine",
    date: getTodayDate(),
    time: "09:30 AM",
    type: "FOLLOW_UP",
    reason: "Follow-up consultation",
    emergency: false,
    status: "PENDING",
  },
  {
    id: "APT-1003",
    patientId: "PT-1003",
    patientName: "Sneha Patel",
    doctorId: "DOC-003",
    doctorName: "Dr. Meera Nair",
    department: "Dermatology",
    date: getTodayDate(),
    time: "10:30 AM",
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
    time: "11:00 AM",
    type: "FOLLOW_UP",
    reason: "Orthopedic follow-up",
    emergency: false,
    status: "COMPLETED",
  },
];

const statusOptions: {
  value: AppointmentStatus;
  label: string;
}[] = [
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "NO_SHOW", label: "No Show" },
];

const statusStyles: Record<AppointmentStatus, string> = {
  PENDING:
    "border-amber-200 bg-amber-50 text-amber-700",
  CONFIRMED:
    "border-blue-200 bg-blue-50 text-blue-700",
  IN_PROGRESS:
    "border-cyan-200 bg-cyan-50 text-cyan-700",
  COMPLETED:
    "border-emerald-200 bg-emerald-50 text-emerald-700",
  CANCELLED:
    "border-rose-200 bg-rose-50 text-rose-700",
  NO_SHOW:
    "border-slate-200 bg-slate-100 text-slate-600",
};

const statusDotStyles: Record<AppointmentStatus, string> = {
  PENDING: "bg-amber-500",
  CONFIRMED: "bg-blue-500",
  IN_PROGRESS: "bg-cyan-500",
  COMPLETED: "bg-emerald-500",
  CANCELLED: "bg-rose-500",
  NO_SHOW: "bg-slate-500",
};

function StatusBadge({
  status,
}: {
  status: AppointmentStatus;
}) {
  const label =
    statusOptions.find((item) => item.value === status)?.label ??
    status;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${statusStyles[status]}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${statusDotStyles[status]}`}
      />
      {label}
    </span>
  );
}

function StatusSelect({
  appointment,
  onChange,
}: {
  appointment: Appointment;
  onChange: (
    appointment: Appointment,
    nextStatus: AppointmentStatus,
  ) => void;
}) {
  const availableStatuses: AppointmentStatus[] = [];

  if (appointment.status === "PENDING") {
    availableStatuses.push(
      "PENDING",
      "CONFIRMED",
      "CANCELLED",
      "NO_SHOW",
    );
  } else if (appointment.status === "CONFIRMED") {
    availableStatuses.push(
      "CONFIRMED",
      "IN_PROGRESS",
      "CANCELLED",
      "NO_SHOW",
    );
  } else if (appointment.status === "IN_PROGRESS") {
    availableStatuses.push(
      "IN_PROGRESS",
      "COMPLETED",
    );
  } else {
    availableStatuses.push(appointment.status);
  }

  return (
    <div className="relative min-w-[150px]">
      <select
        value={appointment.status}
        onChange={(event) =>
          onChange(
            appointment,
            event.target.value as AppointmentStatus,
          )
        }
        className={`w-full cursor-pointer appearance-none rounded-xl border px-3 py-2 pr-9 text-xs font-semibold outline-none transition focus:ring-2 focus:ring-cyan-200 ${statusStyles[appointment.status]}`}
      >
        {availableStatuses.map((status) => (
          <option key={status} value={status}>
            {
              statusOptions.find(
                (item) => item.value === status,
              )?.label
            }
          </option>
        ))}
      </select>

      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2" />
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  description,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
          {icon}
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="truncate text-sm font-semibold text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function AppointmentsPage() {
  const router = useRouter();

  const [appointments, setAppointments] =
    useState<Appointment[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"ALL" | AppointmentStatus>("ALL");
  const [dateFilter, setDateFilter] =
    useState(getTodayDate());

  const [isLoading, setIsLoading] = useState(true);

  const loadAppointments = () => {
    try {
      const stored = localStorage.getItem(
        APPOINTMENTS_STORAGE_KEY,
      );

      if (!stored) {
        setAppointments(demoAppointments);

        localStorage.setItem(
          APPOINTMENTS_STORAGE_KEY,
          JSON.stringify(demoAppointments),
        );

        return;
      }

      const parsed = JSON.parse(stored);

      if (Array.isArray(parsed)) {
        setAppointments(parsed);
      } else {
        setAppointments(demoAppointments);
      }
    } catch {
      setAppointments(demoAppointments);
    }
  };

  useEffect(() => {
    setIsLoading(true);

    loadAppointments();

    const handleAppointmentsUpdated = () => {
      loadAppointments();
    };

    window.addEventListener(
      APPOINTMENTS_UPDATED_EVENT,
      handleAppointmentsUpdated,
    );

    const handleStorage = (event: StorageEvent) => {
      if (
        event.key === APPOINTMENTS_STORAGE_KEY
      ) {
        loadAppointments();
      }
    };

    window.addEventListener(
      "storage",
      handleStorage,
    );

    setIsLoading(false);

    return () => {
      window.removeEventListener(
        APPOINTMENTS_UPDATED_EVENT,
        handleAppointmentsUpdated,
      );

      window.removeEventListener(
        "storage",
        handleStorage,
      );
    };
  }, []);

  const filteredAppointments = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return appointments.filter((appointment) => {
      const matchesSearch =
        !query ||
        appointment.id
          .toLowerCase()
          .includes(query) ||
        appointment.patientName
          .toLowerCase()
          .includes(query) ||
        appointment.patientId
          .toLowerCase()
          .includes(query) ||
        appointment.doctorName
          .toLowerCase()
          .includes(query) ||
        appointment.doctorId
          .toLowerCase()
          .includes(query);

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

  const selectedDateAppointments = useMemo(() => {
    return appointments.filter(
      (appointment) =>
        appointment.date === dateFilter,
    );
  }, [appointments, dateFilter]);

  const totalCount =
    selectedDateAppointments.length;

  const pendingCount =
    selectedDateAppointments.filter(
      (appointment) =>
        appointment.status === "PENDING",
    ).length;

  const confirmedCount =
    selectedDateAppointments.filter(
      (appointment) =>
        appointment.status === "CONFIRMED",
    ).length;

  const inProgressCount =
    selectedDateAppointments.filter(
      (appointment) =>
        appointment.status === "IN_PROGRESS",
    ).length;

  const completedCount =
    selectedDateAppointments.filter(
      (appointment) =>
        appointment.status === "COMPLETED",
    ).length;

  const updateStatus = (
    appointment: Appointment,
    nextStatus: AppointmentStatus,
  ) => {
    if (appointment.status === nextStatus) {
      return;
    }

    const updatedAppointments =
      appointments.map((item) =>
        item.id === appointment.id
          ? {
              ...item,
              status: nextStatus,
            }
          : item,
      );

    setAppointments(updatedAppointments);

    localStorage.setItem(
      APPOINTMENTS_STORAGE_KEY,
      JSON.stringify(updatedAppointments),
    );

    window.dispatchEvent(
      new Event(APPOINTMENTS_UPDATED_EVENT),
    );

    toast.success(
      `Appointment ${appointment.id} updated to ${
        statusOptions.find(
          (item) => item.value === nextStatus,
        )?.label
      }.`,
    );
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setDateFilter(getTodayDate());
  };

  const handleToday = () => {
    setDateFilter(getTodayDate());
  };

  const formatSelectedDate = () => {
    if (!dateFilter) {
      return "All Dates";
    }

    const date = new Date(
      `${dateFilter}T00:00:00`,
    );

    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-5 lg:p-6">
      <div className="mx-auto max-w-[1600px] space-y-5">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl border border-cyan-100 bg-gradient-to-br from-cyan-50 via-white to-blue-50 shadow-sm"
        >
          <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-cyan-600 shadow-sm ring-1 ring-cyan-100">
                <CalendarDays className="h-6 w-6" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                    Appointments
                  </h1>

                  <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[11px] font-bold text-cyan-700">
                    HMS Schedule
                  </span>
                </div>

                <p className="mt-1 max-w-2xl text-sm text-slate-500">
                  Manage patient appointments,
                  doctor schedules, status and daily
                  clinical visits.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={loadAppointments}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-cyan-200 hover:bg-cyan-50"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>

              <button
                type="button"
                onClick={() =>
                  router.push("/appointments/new")
                }
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700"
              >
                <CalendarDays className="h-4 w-4" />
                New Appointment
              </button>
            </div>
          </div>
        </motion.div>

        {/* Date banner */}
        <div className="flex flex-col gap-3 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CalendarDays className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Selected Date
              </p>

              <p className="text-sm font-bold text-slate-900">
                {formatSelectedDate()}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToday}
            className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
          >
            Today
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            title="Total"
            value={totalCount}
            description="Appointments for selected date"
            icon={
              <CalendarDays className="h-5 w-5" />
            }
          />

          <StatCard
            title="Pending"
            value={pendingCount}
            description="Awaiting confirmation"
            icon={
              <Clock3 className="h-5 w-5" />
            }
          />

          <StatCard
            title="Confirmed"
            value={confirmedCount}
            description="Scheduled visits"
            icon={
              <CheckCircle2 className="h-5 w-5" />
            }
          />

          <StatCard
            title="In Progress"
            value={inProgressCount}
            description="Currently being attended"
            icon={
              <HeartPulse className="h-5 w-5" />
            }
          />

          <StatCard
            title="Completed"
            value={completedCount}
            description="Finished visits"
            icon={
              <CheckCircle2 className="h-5 w-5" />
            }
          />
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-cyan-600" />

              <h2 className="text-sm font-bold text-slate-900">
                Search & Filters
              </h2>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
            >
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search patient, doctor or ID..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-100"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as
                    | "ALL"
                    | AppointmentStatus,
                )
              }
              className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-100"
            >
              <option value="ALL">
                All Statuses
              </option>

              {statusOptions.map((status) => (
                <option
                  key={status.value}
                  value={status.value}
                >
                  {status.label}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={dateFilter}
              onChange={(event) =>
                setDateFilter(event.target.value)
              }
              className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-100"
            />
          </div>
        </div>

        {/* Results */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Appointment Schedule
              </h2>

              <p className="text-xs text-slate-500">
                Showing {filteredAppointments.length}{" "}
                appointment
                {filteredAppointments.length === 1
                  ? ""
                  : "s"}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="h-2 w-2 rounded-full bg-cyan-500" />
              Live local schedule
            </div>
          </div>

          {isLoading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                <RefreshCw className="h-4 w-4 animate-spin text-cyan-600" />
                Loading appointments...
              </div>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <CalendarDays className="h-7 w-7" />
              </div>

              <h3 className="mt-4 text-base font-bold text-slate-800">
                No appointments found
              </h3>

              <p className="mt-1 max-w-md text-sm text-slate-500">
                Try changing the date, search
                keyword or status filter.
              </p>

              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 cursor-pointer rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[1100px]">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80 text-left">
                      <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Appointment
                      </th>

                      <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Patient
                      </th>

                      <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Doctor
                      </th>

                      <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Date & Time
                      </th>

                      <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Type
                      </th>

                      <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredAppointments.map(
                      (appointment) => (
                        <tr
                          key={appointment.id}
                          className="border-b border-slate-100 transition hover:bg-cyan-50/30"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                                <CalendarDays className="h-5 w-5" />
                              </div>

                              <div>
                                <p className="text-sm font-bold text-slate-900">
                                  {appointment.id}
                                </p>

                                <p className="mt-0.5 text-xs text-slate-500">
                                  {appointment.department}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <InfoItem
                              icon={
                                <UserRound className="h-4 w-4" />
                              }
                              label={
                                appointment.patientId
                              }
                              value={
                                appointment.patientName
                              }
                            />
                          </td>

                          <td className="px-5 py-4">
                            <InfoItem
                              icon={
                                <Stethoscope className="h-4 w-4" />
                              }
                              label={
                                appointment.doctorId
                              }
                              value={
                                appointment.doctorName
                              }
                            />
                          </td>

                          <td className="px-5 py-4">
                            <div className="space-y-1">
                              <p className="text-sm font-semibold text-slate-800">
                                {new Date(
                                  `${appointment.date}T00:00:00`,
                                ).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                              </p>

                              <p className="flex items-center gap-1.5 text-xs text-slate-500">
                                <Clock3 className="h-3.5 w-3.5" />
                                {appointment.time}
                              </p>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                              {appointment.type}
                            </span>

                            {appointment.emergency && (
                              <span className="ml-2 rounded-full bg-rose-50 px-2.5 py-1.5 text-[10px] font-bold text-rose-600">
                                EMERGENCY
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <StatusSelect
                              appointment={appointment}
                              onChange={
                                updateStatus
                              }
                            />
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile / Tablet */}
              <div className="grid grid-cols-1 gap-3 p-3 lg:hidden">
                {filteredAppointments.map(
                  (appointment) => (
                    <motion.div
                      key={appointment.id}
                      initial={{
                        opacity: 0,
                        y: 8,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-cyan-200 hover:shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                            <CalendarDays className="h-5 w-5" />
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-900">
                              {appointment.id}
                            </p>

                            <p className="truncate text-xs text-slate-500">
                              {appointment.department}
                            </p>
                          </div>
                        </div>

                        <StatusBadge
                          status={
                            appointment.status
                          }
                        />
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <InfoItem
                          icon={
                            <UserRound className="h-4 w-4" />
                          }
                          label={
                            appointment.patientId
                          }
                          value={
                            appointment.patientName
                          }
                        />

                        <InfoItem
                          icon={
                            <Stethoscope className="h-4 w-4" />
                          }
                          label={
                            appointment.doctorId
                          }
                          value={
                            appointment.doctorName
                          }
                        />

                        <InfoItem
                          icon={
                            <CalendarDays className="h-4 w-4" />
                          }
                          label="Date"
                          value={new Date(
                            `${appointment.date}T00:00:00`,
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
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

                      {appointment.reason && (
                        <div className="mt-4 rounded-xl bg-slate-50 p-3">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                            Reason
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-600">
                            {appointment.reason}
                          </p>
                        </div>
                      )}

                      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                            {appointment.type}
                          </span>

                          {appointment.emergency && (
                            <span className="rounded-full bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600">
                              Emergency
                            </span>
                          )}
                        </div>

                        <StatusSelect
                          appointment={appointment}
                          onChange={
                            updateStatus
                          }
                        />
                      </div>
                    </motion.div>
                  ),
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}