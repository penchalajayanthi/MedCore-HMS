"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
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
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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

type DateFilter = "TODAY" | "UPCOMING" | "ALL";

const APPOINTMENTS_STORAGE_KEY = "medcore_appointments";
const APPOINTMENTS_UPDATED_EVENT =
  "medcore-appointments-updated";

function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(date: string) {
  if (!date) return "—";

  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getAppointmentDateTime(appointment: Appointment) {
  if (!appointment.date) {
    return Number.MAX_SAFE_INTEGER;
  }

  if (appointment.time === "EMERGENCY") {
    return new Date(
      `${appointment.date}T00:00:00`
    ).getTime();
  }

  const match = appointment.time.match(
    /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i
  );

  if (!match) {
    return new Date(
      `${appointment.date}T00:00:00`
    ).getTime();
  }

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3].toUpperCase();

  if (period === "AM" && hours === 12) {
    hours = 0;
  }

  if (period === "PM" && hours !== 12) {
    hours += 12;
  }

  return new Date(
    `${appointment.date}T${String(hours).padStart(
      2,
      "0"
    )}:${String(minutes).padStart(2, "0")}:00`
  ).getTime();
}

const statusOptions: AppointmentStatus[] = [
  "PENDING",
  "CONFIRMED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
];

const statusStyles: Record<AppointmentStatus, string> = {
  PENDING:
    "border-amber-200 bg-amber-50 text-amber-700",
  CONFIRMED:
    "border-emerald-200 bg-emerald-50 text-emerald-700",
  IN_PROGRESS:
    "border-blue-200 bg-blue-50 text-blue-700",
  COMPLETED:
    "border-cyan-200 bg-cyan-50 text-cyan-700",
  CANCELLED:
    "border-red-200 bg-red-50 text-red-700",
  NO_SHOW:
    "border-slate-200 bg-slate-100 text-slate-600",
};

const statusDotStyles: Record<AppointmentStatus, string> = {
  PENDING: "bg-amber-500",
  CONFIRMED: "bg-emerald-500",
  IN_PROGRESS: "bg-blue-500",
  COMPLETED: "bg-cyan-500",
  CANCELLED: "bg-red-500",
  NO_SHOW: "bg-slate-500",
};

function StatusBadge({
  status,
}: {
  status: AppointmentStatus;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${statusStyles[status]}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${statusDotStyles[status]}`}
      />

      {status.replace("_", " ")}
    </span>
  );
}

function StatusSelect({
  status,
  onChange,
}: {
  status: AppointmentStatus;
  onChange: (status: AppointmentStatus) => void;
}) {
  let allowedStatuses: AppointmentStatus[] = [
    status,
  ];

  if (status === "PENDING") {
    allowedStatuses = [
      "PENDING",
      "CONFIRMED",
      "CANCELLED",
      "NO_SHOW",
    ];
  }

  if (status === "CONFIRMED") {
    allowedStatuses = [
      "CONFIRMED",
      "IN_PROGRESS",
      "CANCELLED",
      "NO_SHOW",
    ];
  }

  if (status === "IN_PROGRESS") {
    allowedStatuses = [
      "IN_PROGRESS",
      "COMPLETED",
    ];
  }

  return (
    <div className="relative inline-block">
      <select
        value={status}
        onChange={(event) =>
          onChange(
            event.target.value as AppointmentStatus
          )
        }
        className={`appearance-none rounded-xl border py-2 pl-3 pr-8 text-xs font-bold outline-none transition focus:ring-4 focus:ring-cyan-500/10 ${statusStyles[status]}`}
      >
        {allowedStatuses.map((item) => (
          <option key={item} value={item}>
            {item.replace("_", " ")}
          </option>
        ))}
      </select>

      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 opacity-60" />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
          {icon}
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-600">
      <span className="text-slate-400">{icon}</span>
      <span>{children}</span>
    </div>
  );
}

export default function AppointmentsPage() {
  const router = useRouter();

  const [appointments, setAppointments] = useState<
    Appointment[]
  >([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<AppointmentStatus | "ALL">("ALL");

  const [dateFilter, setDateFilter] =
    useState<DateFilter>("TODAY");

  const [specificDate, setSpecificDate] =
    useState(getTodayDate());

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadAppointments = () => {
    try {
      const stored = localStorage.getItem(
        APPOINTMENTS_STORAGE_KEY
      );

      if (!stored) {
        setAppointments([]);
        return;
      }

      const parsed = JSON.parse(stored);

      if (Array.isArray(parsed)) {
        setAppointments(parsed);
      } else {
        setAppointments([]);
      }
    } catch {
      setAppointments([]);
    }
  };

  useEffect(() => {
    loadAppointments();
    setIsLoading(false);

    const handleAppointmentsUpdated = () => {
      loadAppointments();
    };

    const handleStorage = (event: StorageEvent) => {
      if (
        event.key === APPOINTMENTS_STORAGE_KEY
      ) {
        loadAppointments();
      }
    };

    window.addEventListener(
      APPOINTMENTS_UPDATED_EVENT,
      handleAppointmentsUpdated
    );

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        APPOINTMENTS_UPDATED_EVENT,
        handleAppointmentsUpdated
      );

      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, []);

  const filteredAppointments = useMemo(() => {
    const query = searchQuery
      .trim()
      .toLowerCase();

    const today = getTodayDate();

    let result = appointments.filter(
      (appointment) => {
        const matchesSearch =
          !query ||
          appointment.patientName
            ?.toLowerCase()
            .includes(query) ||
          appointment.doctorName
            ?.toLowerCase()
            .includes(query) ||
          appointment.department
            ?.toLowerCase()
            .includes(query) ||
          appointment.id
            ?.toLowerCase()
            .includes(query);

        const matchesStatus =
          statusFilter === "ALL" ||
          appointment.status === statusFilter;

        let matchesDate = true;

        if (dateFilter === "TODAY") {
          matchesDate =
            appointment.date === today;
        }

        if (dateFilter === "UPCOMING") {
          matchesDate =
            appointment.date > today;
        }

        if (dateFilter === "ALL") {
          matchesDate = true;
        }

        return (
          matchesSearch &&
          matchesStatus &&
          matchesDate
        );
      }
    );

    return result.sort(
      (a, b) =>
        getAppointmentDateTime(a) -
        getAppointmentDateTime(b)
    );
  }, [
    appointments,
    searchQuery,
    statusFilter,
    dateFilter,
  ]);

  const selectedDateAppointments = useMemo(() => {
    if (dateFilter === "TODAY") {
      const today = getTodayDate();

      return appointments.filter(
        (appointment) =>
          appointment.date === today
      );
    }

    if (dateFilter === "UPCOMING") {
      const today = getTodayDate();

      return appointments.filter(
        (appointment) =>
          appointment.date > today
      );
    }

    if (dateFilter === "ALL") {
      return appointments;
    }

    return appointments.filter(
      (appointment) =>
        appointment.date === specificDate
    );
  }, [
    appointments,
    dateFilter,
    specificDate,
  ]);

  const stats = useMemo(() => {
    return {
      total: selectedDateAppointments.length,

      pending:
        selectedDateAppointments.filter(
          (appointment) =>
            appointment.status === "PENDING"
        ).length,

      confirmed:
        selectedDateAppointments.filter(
          (appointment) =>
            appointment.status === "CONFIRMED"
        ).length,

      inProgress:
        selectedDateAppointments.filter(
          (appointment) =>
            appointment.status === "IN_PROGRESS"
        ).length,

      completed:
        selectedDateAppointments.filter(
          (appointment) =>
            appointment.status === "COMPLETED"
        ).length,
    };
  }, [selectedDateAppointments]);

  const upcomingCount = useMemo(() => {
    const today = getTodayDate();

    return appointments.filter(
      (appointment) =>
        appointment.date > today &&
        appointment.status !== "CANCELLED" &&
        appointment.status !== "NO_SHOW"
    ).length;
  }, [appointments]);

  const updateStatus = (
    appointmentId: string,
    newStatus: AppointmentStatus
  ) => {
    const updatedAppointments =
      appointments.map((appointment) =>
        appointment.id === appointmentId
          ? {
              ...appointment,
              status: newStatus,
            }
          : appointment
      );

    setAppointments(updatedAppointments);

    localStorage.setItem(
      APPOINTMENTS_STORAGE_KEY,
      JSON.stringify(updatedAppointments)
    );

    window.dispatchEvent(
      new Event(APPOINTMENTS_UPDATED_EVENT)
    );

    toast.success(
      `Appointment status updated to ${newStatus.replace(
        "_",
        " "
      )}.`
    );
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setDateFilter("TODAY");
    setSpecificDate(getTodayDate());
  };

  const handleRefresh = () => {
    setIsRefreshing(true);

    loadAppointments();

    window.setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Appointments refreshed.");
    }, 500);
  };

  const getHeaderTitle = () => {
    if (dateFilter === "TODAY") {
      return "Today's Appointments";
    }

    if (dateFilter === "UPCOMING") {
      return "Upcoming Appointments";
    }

    if (dateFilter === "ALL") {
      return "All Appointments";
    }

    return "Appointments";
  };

  const getResultsText = () => {
    if (filteredAppointments.length === 0) {
      if (appointments.length === 0) {
        return "No appointments have been created yet.";
      }

      return "No appointments match your current filters.";
    }

    return `Showing ${
      filteredAppointments.length
    } appointment${
      filteredAppointments.length === 1
        ? ""
        : "s"
    }`;
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-600 text-white shadow-lg shadow-cyan-600/20">
                <CalendarDays className="h-6 w-6" />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {getHeaderTitle()}
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Manage patient appointments, schedules,
                  and appointment status.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-cyan-300 hover:text-cyan-600"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  isRefreshing
                    ? "animate-spin"
                    : ""
                }`}
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/appointments/new"
                )
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-cyan-600/20 transition hover:bg-cyan-700"
            >
              <CalendarDays className="h-4 w-4" />
              New Appointment
            </button>
          </div>
        </div>

        {/* Upcoming Banner */}
        {upcomingCount > 0 && (
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-6 rounded-2xl border border-cyan-200 bg-cyan-50 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-cyan-600 shadow-sm">
                <Clock3 className="h-5 w-5" />
              </div>

              <div>
                <p className="font-semibold text-cyan-900">
                  {upcomingCount} upcoming appointment
                  {upcomingCount === 1
                    ? ""
                    : "s"}
                </p>

                <p className="text-sm text-cyan-700">
                  Future appointments are available from
                  the Upcoming filter.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Date Controls */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  setDateFilter("TODAY")
                }
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  dateFilter === "TODAY"
                    ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/20"
                    : "bg-slate-100 text-slate-600 hover:bg-cyan-50 hover:text-cyan-700"
                }`}
              >
                Today
              </button>

              <button
                type="button"
                onClick={() =>
                  setDateFilter("UPCOMING")
                }
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  dateFilter === "UPCOMING"
                    ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/20"
                    : "bg-slate-100 text-slate-600 hover:bg-cyan-50 hover:text-cyan-700"
                }`}
              >
                Upcoming
                {upcomingCount > 0 && (
                  <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                    {upcomingCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() =>
                  setDateFilter("ALL")
                }
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  dateFilter === "ALL"
                    ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/20"
                    : "bg-slate-100 text-slate-600 hover:bg-cyan-50 hover:text-cyan-700"
                }`}
              >
                All Dates
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-500">
                Specific date
              </span>

              <input
                type="date"
                value={specificDate}
                onChange={(event) => {
                  setSpecificDate(
                    event.target.value
                  );
                  setDateFilter("ALL");
                }}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            icon={
              <CalendarDays className="h-5 w-5" />
            }
            label="Total"
            value={stats.total}
          />

          <StatCard
            icon={
              <Clock3 className="h-5 w-5" />
            }
            label="Pending"
            value={stats.pending}
          />

          <StatCard
            icon={
              <CheckCircle2 className="h-5 w-5" />
            }
            label="Confirmed"
            value={stats.confirmed}
          />

          <StatCard
            icon={
              <HeartPulse className="h-5 w-5" />
            }
            label="In Progress"
            value={stats.inProgress}
          />

          <StatCard
            icon={
              <CheckCircle2 className="h-5 w-5" />
            }
            label="Completed"
            value={stats.completed}
          />
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1fr_220px_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(
                    event.target.value
                  )
                }
                placeholder="Search patient, doctor, department, or appointment ID..."
                className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
              />
            </div>

            <div className="relative">
              <Filter className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as
                      | AppointmentStatus
                      | "ALL"
                  )
                }
                className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-11 pr-10 text-sm font-semibold text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
              >
                <option value="ALL">
                  All Statuses
                </option>

                {statusOptions.map((status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status.replace("_", " ")}
                  </option>
                ))}
              </select>

              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-5 text-sm font-semibold text-slate-600 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold text-slate-900">
                Appointment List
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {getResultsText()}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500">
              {formatDate(getTodayDate())}
            </div>
          </div>

          {isLoading ? (
            <div className="flex min-h-[280px] items-center justify-center">
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-200 border-t-cyan-600" />
                Loading appointments...
              </div>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <CalendarDays className="h-8 w-8" />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-800">
                No appointments found
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                {appointments.length === 0
                  ? "There are no appointments yet. Create a new appointment to see it here."
                  : "Try changing the date, status, or search filters to find an appointment."}
              </p>

              <div className="mt-5 flex flex-wrap justify-center gap-3">
                {appointments.length > 0 && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-cyan-300 hover:text-cyan-700"
                  >
                    Reset Filters
                  </button>
                )}

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      "/appointments/new"
                    )
                  }
                  className="rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-cyan-600/20 transition hover:bg-cyan-700"
                >
                  Create Appointment
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[1050px]">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70 text-left">
                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-400">
                        Appointment
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-400">
                        Patient
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-400">
                        Doctor
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-400">
                        Date & Time
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-400">
                        Type
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-400">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredAppointments.map(
                      (appointment) => (
                        <tr
                          key={appointment.id}
                          className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50"
                        >
                          <td className="px-5 py-5">
                            <div>
                              <p className="font-bold text-slate-800">
                                {appointment.id}
                              </p>

                              {appointment.emergency && (
                                <span className="mt-1 inline-flex rounded-full bg-red-50 px-2 py-1 text-[10px] font-bold text-red-600">
                                  EMERGENCY
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="px-5 py-5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                                <UserRound className="h-4 w-4" />
                              </div>

                              <div>
                                <p className="font-semibold text-slate-800">
                                  {appointment.patientName}
                                </p>

                                <p className="text-xs text-slate-400">
                                  {appointment.patientId}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <Stethoscope className="h-4 w-4" />
                              </div>

                              <div>
                                <p className="font-semibold text-slate-800">
                                  {appointment.doctorName}
                                </p>

                                <p className="text-xs text-slate-400">
                                  {appointment.department}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-5">
                            <div>
                              <p className="font-semibold text-slate-800">
                                {formatDate(
                                  appointment.date
                                )}
                              </p>

                              <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                                <Clock3 className="h-3.5 w-3.5" />
                                {appointment.time}
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-5">
                            <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                              {appointment.type.replace(
                                "_",
                                " "
                              )}
                            </span>
                          </td>

                          <td className="px-5 py-5">
                            <StatusSelect
                              status={
                                appointment.status
                              }
                              onChange={(status) =>
                                updateStatus(
                                  appointment.id,
                                  status
                                )
                              }
                            />
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="divide-y divide-slate-100 lg:hidden">
                {filteredAppointments.map(
                  (appointment) => (
                    <div
                      key={appointment.id}
                      className="p-5"
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-slate-800">
                                {appointment.id}
                              </p>

                              {appointment.emergency && (
                                <span className="rounded-full bg-red-50 px-2 py-1 text-[10px] font-bold text-red-600">
                                  EMERGENCY
                                </span>
                              )}
                            </div>

                            <p className="mt-1 text-xs text-slate-400">
                              {formatDate(
                                appointment.date
                              )}
                            </p>
                          </div>

                          <StatusBadge
                            status={
                              appointment.status
                            }
                          />
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <InfoItem
                            icon={
                              <UserRound className="h-4 w-4" />
                            }
                          >
                            {appointment.patientName}
                          </InfoItem>

                          <InfoItem
                            icon={
                              <Stethoscope className="h-4 w-4" />
                            }
                          >
                            {appointment.doctorName}
                          </InfoItem>

                          <InfoItem
                            icon={
                              <Clock3 className="h-4 w-4" />
                            }
                          >
                            {appointment.time}
                          </InfoItem>

                          <InfoItem
                            icon={
                              <HeartPulse className="h-4 w-4" />
                            }
                          >
                            {appointment.department}
                          </InfoItem>
                        </div>

                        <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                          <span className="w-fit rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                            {appointment.type.replace(
                              "_",
                              " "
                            )}
                          </span>

                          <StatusSelect
                            status={
                              appointment.status
                            }
                            onChange={(status) =>
                              updateStatus(
                                appointment.id,
                                status
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}