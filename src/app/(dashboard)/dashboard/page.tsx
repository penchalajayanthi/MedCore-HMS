"use client";

import { useEffect, useMemo, useState, type ElementType } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FlaskConical,
  HeartPulse,
  Pill,
  Search,
  Stethoscope,
  Users,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type AppointmentStatus =
  | "Confirmed"
  | "Pending"
  | "Completed"
  | "Cancelled";

type Appointment = {
  id: string | number;
  date: string;
  time: string;
  patient: string;
  doctor: string;
  department: string;
  status: AppointmentStatus;
  avatar: string;
};

type LabApproval = {
  id: string | number;
  patient: string;
  test: string;
  orderedBy: string;
  time: string;
  priority: "High" | "Normal";
};

type PrescriptionItem = {
  id: string | number;
  patient: string;
  medicine: string;
  doctor: string;
  date: string;
  status: string;
};

type FollowUpItem = {
  id: string | number;
  patient: string;
  date: string;
  doctor: string;
  reason: string;
};

type DashboardUser = {
  fullName?: string;
  email?: string;
  hospitalName?: string;
  role?: string;
};

type RawRecord = Record<string, unknown>;

/* =========================================================
   STORAGE KEYS
========================================================= */

const APPOINTMENTS_KEY = "medcore_appointments";
const PATIENTS_KEY = "medcore_patients";
const DOCTORS_KEY = "medcore_doctors";
const EMR_KEY = "medcore_emr";
const PRESCRIPTIONS_KEY = "medcore_prescriptions";
const LAB_KEY = "medcore_lab_orders";

/* =========================================================
   UPDATE EVENTS
========================================================= */

const UPDATE_EVENTS = [
  "medcore-appointments-updated",
  "medcore-patients-updated",
  "medcore-doctors-updated",
  "medcore-emr-updated",
  "medcore-prescriptions-updated",
  "medcore-lab-updated",
  "medcore-lab-orders-updated",
];

/* =========================================================
   HELPERS
========================================================= */

function getRecordId(
  record: RawRecord,
  fallback: string | number,
): string | number {
  const value =
    record.id ??
    record._id ??
    record.appointmentId ??
    record.patientId ??
    record.doctorId ??
    record.labId ??
    record.prescriptionId ??
    record.emrId;

  if (
    typeof value === "string" ||
    typeof value === "number"
  ) {
    return value;
  }

  return fallback;
}

function getString(
  record: RawRecord,
  ...keys: string[]
): string {
  for (const key of keys) {
    const value = record[key];

    if (
      typeof value === "string" &&
      value.trim()
    ) {
      return value.trim();
    }

    if (typeof value === "number") {
      return String(value);
    }
  }

  return "";
}

function getArray(value: unknown): RawRecord[] {
  if (Array.isArray(value)) {
    return value.filter(
      (item): item is RawRecord =>
        typeof item === "object" &&
        item !== null &&
        !Array.isArray(item),
    );
  }

  if (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  ) {
    const object = value as RawRecord;

    const possibleKeys = [
      "data",
      "items",
      "records",
      "appointments",
      "patients",
      "doctors",
      "orders",
      "labOrders",
      "prescriptions",
      "emr",
    ];

    for (const key of possibleKeys) {
      if (Array.isArray(object[key])) {
        return getArray(object[key]);
      }
    }
  }

  return [];
}

function readStorage(key: string): {
  exists: boolean;
  data: RawRecord[];
} {
  if (typeof window === "undefined") {
    return {
      exists: false,
      data: [],
    };
  }

  try {
    const raw = localStorage.getItem(key);

    if (raw === null) {
      return {
        exists: false,
        data: [],
      };
    }

    return {
      exists: true,
      data: getArray(JSON.parse(raw)),
    };
  } catch {
    return {
      exists: true,
      data: [],
    };
  }
}

function getPatientName(record: RawRecord): string {
  return (
    getString(
      record,
      "patientName",
      "patient",
      "patientFullName",
      "fullName",
      "name",
    ) || "Unknown Patient"
  );
}

function getDoctorName(record: RawRecord): string {
  return (
    getString(
      record,
      "doctorName",
      "doctor",
      "doctorFullName",
      "physician",
      "orderedBy",
    ) || "Doctor"
  );
}

function getDate(record: RawRecord): string {
  return getString(
    record,
    "date",
    "appointmentDate",
    "scheduledDate",
    "visitDate",
    "createdAt",
    "updatedAt",
  );
}

function getTime(record: RawRecord): string {
  return (
    getString(
      record,
      "time",
      "appointmentTime",
      "scheduledTime",
    ) || "Time not set"
  );
}

function getInitials(name: string): string {
  if (!name.trim()) return "NA";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(
      (part) =>
        part[0]?.toUpperCase() ?? "",
    )
    .join("");
}

function normalizeStatus(
  value: string,
): AppointmentStatus {
  const status = value.toLowerCase();

  if (status.includes("complete")) {
    return "Completed";
  }

  if (status.includes("cancel")) {
    return "Cancelled";
  }

  if (
    status.includes("confirm") ||
    status.includes("approved")
  ) {
    return "Confirmed";
  }

  return "Pending";
}

function formatDate(value: string): string {
  if (!value) return "Date not set";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function isToday(value: string): boolean {
  if (!value) return false;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const today = new Date();

  return (
    date.getFullYear() ===
      today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

function isWithinNextSevenDays(
  value: string,
): boolean {
  if (!value) return false;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const nextSevenDays = new Date(today);

  nextSevenDays.setDate(
    nextSevenDays.getDate() + 7,
  );

  return (
    date >= today &&
    date <= nextSevenDays
  );
}

/* =========================================================
   STATUS STYLES
========================================================= */

const statusClasses: Record<
  AppointmentStatus,
  string
> = {
  Confirmed:
    "border-emerald-200 bg-emerald-50 text-emerald-700",

  Pending:
    "border-amber-200 bg-amber-50 text-amber-700",

  Completed:
    "border-blue-200 bg-blue-50 text-blue-700",

  Cancelled:
    "border-red-200 bg-red-50 text-red-600",
};

/* =========================================================
   DASHBOARD PAGE
========================================================= */

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] =
    useState<DashboardUser>({});

  const [appointments, setAppointments] =
    useState<Appointment[]>([]);

  const [labApprovals, setLabApprovals] =
    useState<LabApproval[]>([]);

  const [prescriptions, setPrescriptions] =
    useState<PrescriptionItem[]>([]);

  const [followUps, setFollowUps] =
    useState<FollowUpItem[]>([]);

  const [patientCount, setPatientCount] =
    useState(0);

  const [doctorCount, setDoctorCount] =
    useState(0);

  const [search, setSearch] = useState("");

  /* =======================================================
     SESSION
  ======================================================= */

  const loadSession = () => {
    try {
      const raw =
        localStorage.getItem(
          "medcore_session",
        );

      if (!raw) {
        setUser({});
        return;
      }

      const session = JSON.parse(raw) as {
        user?: DashboardUser;
      };

      setUser(session.user ?? {});
    } catch {
      setUser({});
    }
  };

  /* =======================================================
     PATIENTS
  ======================================================= */

  const loadPatients = () => {
    const result =
      readStorage(PATIENTS_KEY);

    setPatientCount(
      result.exists
        ? result.data.length
        : 0,
    );
  };

  /* =======================================================
     DOCTORS
  ======================================================= */

  const loadDoctors = () => {
    const result =
      readStorage(DOCTORS_KEY);

    setDoctorCount(
      result.exists
        ? result.data.length
        : 0,
    );
  };

  /* =======================================================
     APPOINTMENTS
  ======================================================= */

  const loadAppointments = () => {
    const result =
      readStorage(APPOINTMENTS_KEY);

    if (!result.exists) {
      setAppointments([]);
      return;
    }

    const mapped: Appointment[] =
      result.data.map(
        (item, index) => {
          const patient =
            getPatientName(item);

          return {
            id: getRecordId(
              item,
              `APT-${index + 1}`,
            ),

            date: getDate(item),

            time: getTime(item),

            patient,

            doctor:
              getDoctorName(item),

            department:
              getString(
                item,
                "department",
                "departmentName",
                "specialization",
              ) ||
              "General Medicine",

            status: normalizeStatus(
              getString(
                item,
                "status",
                "appointmentStatus",
              ),
            ),

            avatar:
              getInitials(patient),
          };
        },
      );

    setAppointments(mapped);
  };

  /* =======================================================
     LABORATORY
  ======================================================= */

  const loadLabs = () => {
    const result =
      readStorage(LAB_KEY);

    if (!result.exists) {
      setLabApprovals([]);
      return;
    }

    const mapped: LabApproval[] =
      result.data
        .filter((item) => {
          const status =
            getString(
              item,
              "status",
              "labStatus",
              "orderStatus",
            ).toLowerCase();

          if (!status) return true;

          return (
            status.includes("pending") ||
            status.includes("review") ||
            status.includes("ordered") ||
            status.includes("await")
          );
        })
        .map((item, index) => {
          return {
            id: getRecordId(
              item,
              `LAB-${index + 1}`,
            ),

            patient:
              getPatientName(item),

            test:
              getString(
                item,
                "test",
                "testName",
                "labTest",
                "investigation",
                "name",
              ) ||
              "Laboratory Test",

            orderedBy:
              getDoctorName(item),

            time:
              getString(
                item,
                "time",
                "orderedAt",
                "createdAt",
              ) || "Recently",

            priority:
              getString(
                item,
                "priority",
                "urgency",
              )
                .toLowerCase()
                .includes("high")
                ? "High"
                : "Normal",
          };
        });

    setLabApprovals(mapped);
  };

  /* =======================================================
     PRESCRIPTIONS
  ======================================================= */

  const loadPrescriptions = () => {
    const result =
      readStorage(
        PRESCRIPTIONS_KEY,
      );

    if (!result.exists) {
      setPrescriptions([]);
      return;
    }

    const mapped: PrescriptionItem[] =
      result.data.map(
        (item, index) => {
          const date =
            getDate(item);

          return {
            id: getRecordId(
              item,
              `RX-${index + 1}`,
            ),

            patient:
              getPatientName(item),

            medicine:
              getString(
                item,
                "medicine",
                "medicineName",
                "drug",
                "drugName",
                "medication",
              ) || "Medicine",

            doctor:
              getDoctorName(item),

            date: date
              ? formatDate(date)
              : "Date not set",

            status:
              getString(
                item,
                "status",
                "prescriptionStatus",
              ) || "Active",
          };
        },
      );

    setPrescriptions(mapped);
  };

  /* =======================================================
     FOLLOW UPS
  ======================================================= */

  const loadFollowUps = () => {
    const generated: FollowUpItem[] =
      [];

    const appointmentResult =
      readStorage(
        APPOINTMENTS_KEY,
      );

    appointmentResult.data.forEach(
      (item, index) => {
        const date = getDate(item);

        if (!date) return;

        if (
          !isWithinNextSevenDays(
            date,
          )
        ) {
          return;
        }

        generated.push({
          id: getRecordId(
            item,
            `FU-${index + 1}`,
          ),

          patient:
            getPatientName(item),

          date: formatDate(date),

          doctor:
            getDoctorName(item),

          reason:
            getString(
              item,
              "reason",
              "purpose",
              "notes",
              "appointmentType",
            ) ||
            "Upcoming appointment",
        });
      },
    );

    const emrResult =
      readStorage(EMR_KEY);

    emrResult.data.forEach(
      (item, index) => {
        const date =
          getString(
            item,
            "followUpDate",
            "nextVisit",
            "nextAppointment",
          );

        if (!date) return;

        if (
          !isWithinNextSevenDays(
            date,
          )
        ) {
          return;
        }

        generated.push({
          id: getRecordId(
            item,
            `EMR-FU-${index + 1}`,
          ),

          patient:
            getPatientName(item),

          date: formatDate(date),

          doctor:
            getDoctorName(item),

          reason:
            getString(
              item,
              "followUpReason",
              "reason",
              "notes",
            ) || "EMR follow-up",
        });
      },
    );

    const unique =
      generated.filter(
        (item, index, array) =>
          index ===
          array.findIndex(
            (other) =>
              other.patient ===
                item.patient &&
              other.date ===
                item.date,
          ),
      );

    setFollowUps(unique);
  };

  /* =======================================================
     LOAD DASHBOARD
  ======================================================= */

  const loadDashboard = () => {
    loadSession();
    loadPatients();
    loadDoctors();
    loadAppointments();
    loadLabs();
    loadPrescriptions();
    loadFollowUps();
  };

  useEffect(() => {
    loadDashboard();

    const handleUpdate = () => {
      loadDashboard();
    };

    window.addEventListener(
      "storage",
      handleUpdate,
    );

    UPDATE_EVENTS.forEach(
      (eventName) => {
        window.addEventListener(
          eventName,
          handleUpdate,
        );
      },
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleUpdate,
      );

      UPDATE_EVENTS.forEach(
        (eventName) => {
          window.removeEventListener(
            eventName,
            handleUpdate,
          );
        },
      );
    };
  }, []);

  /* =======================================================
     TODAY'S APPOINTMENTS
  ======================================================= */

  const todayAppointments =
    useMemo(() => {
      return appointments.filter(
        (appointment) =>
          isToday(
            appointment.date,
          ),
      );
    }, [appointments]);

  const filteredAppointments =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      if (!query) {
        return todayAppointments;
      }

      return todayAppointments.filter(
        (appointment) =>
          [
            appointment.patient,
            appointment.doctor,
            appointment.department,
            appointment.status,
            appointment.time,
          ]
            .join(" ")
            .toLowerCase()
            .includes(query),
      );
    }, [
      todayAppointments,
      search,
    ]);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                <HeartPulse className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600">
                  Doctor Dashboard
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Welcome,{" "}
                  {user.fullName
                    ? user.fullName.split(
                        " ",
                      )[0]
                    : "Doctor"}
                </h1>
              </div>
            </div>

            <p className="text-sm text-slate-500">
              {user.hospitalName ||
                "MedCore Hospital"}{" "}
              • Here&apos;s your clinical
              overview.
            </p>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        {/* =================================================
            CLICKABLE STATS
        ================================================= */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardStat
            title="Today's Appointments"
            value={
              todayAppointments.length
            }
            subtitle={
              todayAppointments.length ===
              0
                ? "No appointments today"
                : "Scheduled today"
            }
            icon={CalendarCheck}
            iconClass="bg-blue-50 text-blue-600"
            onClick={() =>
              router.push(
                "/appointments",
              )
            }
          />

          <DashboardStat
            title="Patients"
            value={patientCount}
            subtitle="Registered patients"
            icon={Users}
            iconClass="bg-cyan-50 text-cyan-600"
            onClick={() =>
              router.push("/patients")
            }
          />

          <DashboardStat
            title="Pending Labs"
            value={
              labApprovals.length
            }
            subtitle={
              labApprovals.length ===
              0
                ? "No pending lab work"
                : "Require attention"
            }
            icon={FlaskConical}
            iconClass="bg-violet-50 text-violet-600"
            onClick={() =>
              router.push(
                "/laboratory",
              )
            }
          />

          <DashboardStat
            title="Active Doctors"
            value={doctorCount}
            subtitle="Doctors in MedCore"
            icon={Stethoscope}
            iconClass="bg-emerald-50 text-emerald-600"
            onClick={() =>
              router.push("/doctors")
            }
          />
        </div>

        {/* =================================================
            MAIN
        ================================================= */}

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          {/* LEFT */}

          <div className="space-y-6">
            {/* APPOINTMENTS */}

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-5 w-5 text-cyan-600" />

                      <h2 className="text-lg font-bold text-slate-900">
                        Today&apos;s
                        Appointments
                      </h2>
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      {todayAppointments.length ===
                      0
                        ? "No appointments scheduled for today."
                        : `${todayAppointments.length} appointment${
                            todayAppointments.length ===
                            1
                              ? ""
                              : "s"
                          } scheduled today.`}
                    </p>
                  </div>

                  {todayAppointments.length >
                    0 && (
                    <div className="relative w-full lg:w-64">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                      <input
                        value={search}
                        onChange={(event) =>
                          setSearch(
                            event.target
                              .value,
                          )
                        }
                        placeholder="Search today..."
                        className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                      />
                    </div>
                  )}
                </div>
              </div>

              {filteredAppointments.length ===
              0 ? (
                <EmptySection
                  icon={CalendarDays}
                  title="No appointments"
                  description="There are currently no appointments scheduled for today."
                />
              ) : (
                <>
                  {/* DESKTOP */}

                  <div className="hidden overflow-x-auto md:block">
                    <table className="w-full min-w-[760px]">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/70">
                          <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Time
                          </th>

                          <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Patient
                          </th>

                          <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Doctor
                          </th>

                          <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Department
                          </th>

                          <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Status
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredAppointments
                          .slice(0, 8)
                          .map(
                            (
                              appointment,
                            ) => (
                              <tr
                                key={
                                  appointment.id
                                }
                                className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                              >
                                <td className="px-5 py-4">
                                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                                    <Clock3 className="h-4 w-4 text-cyan-500" />
                                    {
                                      appointment.time
                                    }
                                  </div>
                                </td>

                                <td className="px-5 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-50 text-xs font-bold text-cyan-700">
                                      {
                                        appointment.avatar
                                      }
                                    </div>

                                    <span className="text-sm font-semibold text-slate-800">
                                      {
                                        appointment.patient
                                      }
                                    </span>
                                  </div>
                                </td>

                                <td className="px-5 py-4 text-sm text-slate-600">
                                  {
                                    appointment.doctor
                                  }
                                </td>

                                <td className="px-5 py-4 text-sm text-slate-600">
                                  {
                                    appointment.department
                                  }
                                </td>

                                <td className="px-5 py-4">
                                  <span
                                    className={`inline-flex rounded-lg border px-2.5 py-1 text-xs font-semibold ${
                                      statusClasses[
                                        appointment
                                          .status
                                      ]
                                    }`}
                                  >
                                    {
                                      appointment.status
                                    }
                                  </span>
                                </td>
                              </tr>
                            ),
                          )}
                      </tbody>
                    </table>
                  </div>

                  {/* MOBILE */}

                  <div className="space-y-3 p-4 md:hidden">
                    {filteredAppointments
                      .slice(0, 8)
                      .map(
                        (
                          appointment,
                        ) => (
                          <div
                            key={
                              appointment.id
                            }
                            className="rounded-xl border border-slate-200 p-4"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-50 text-xs font-bold text-cyan-700">
                                  {
                                    appointment.avatar
                                  }
                                </div>

                                <div>
                                  <p className="text-sm font-bold text-slate-900">
                                    {
                                      appointment.patient
                                    }
                                  </p>

                                  <p className="mt-1 text-xs text-slate-500">
                                    {
                                      appointment.department
                                    }
                                  </p>
                                </div>
                              </div>

                              <span
                                className={`rounded-lg border px-2 py-1 text-[11px] font-semibold ${
                                  statusClasses[
                                    appointment
                                      .status
                                  ]
                                }`}
                              >
                                {
                                  appointment.status
                                }
                              </span>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-3">
                              <InfoItem
                                label="Time"
                                value={
                                  appointment.time
                                }
                                icon={
                                  Clock3
                                }
                              />

                              <InfoItem
                                label="Doctor"
                                value={
                                  appointment.doctor
                                }
                                icon={
                                  Stethoscope
                                }
                              />
                            </div>
                          </div>
                        ),
                      )}
                  </div>
                </>
              )}
            </section>

            {/* LAB + PRESCRIPTIONS */}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* LAB */}

              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 p-5">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="h-5 w-5 text-violet-600" />

                    <h2 className="text-lg font-bold text-slate-900">
                      Pending Laboratory
                    </h2>
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    Laboratory items requiring
                    attention
                  </p>
                </div>

                {labApprovals.length ===
                0 ? (
                  <EmptySection
                    icon={CheckCircle2}
                    title="No pending laboratory work"
                    description="Everything is up to date."
                  />
                ) : (
                  <div className="divide-y divide-slate-100">
                    {labApprovals
                      .slice(0, 4)
                      .map((lab) => (
                        <div
                          key={lab.id}
                          className="p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-slate-900">
                                {
                                  lab.patient
                                }
                              </p>

                              <p className="mt-1 text-sm text-slate-600">
                                {lab.test}
                              </p>

                              <p className="mt-1 text-xs text-slate-400">
                                {
                                  lab.orderedBy
                                }{" "}
                                •{" "}
                                {
                                  lab.time
                                }
                              </p>
                            </div>

                            <span
                              className={`rounded-lg border px-2 py-1 text-[11px] font-semibold ${
                                lab.priority ===
                                "High"
                                  ? "border-red-200 bg-red-50 text-red-600"
                                  : "border-slate-200 bg-slate-50 text-slate-600"
                              }`}
                            >
                              {
                                lab.priority
                              }
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </section>

              {/* PRESCRIPTIONS */}

              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 p-5">
                  <div className="flex items-center gap-2">
                    <Pill className="h-5 w-5 text-emerald-600" />

                    <h2 className="text-lg font-bold text-slate-900">
                      Recent Prescriptions
                    </h2>
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    Latest prescription activity
                  </p>
                </div>

                {prescriptions.length ===
                0 ? (
                  <EmptySection
                    icon={Pill}
                    title="No prescriptions"
                    description="Prescription activity will appear here."
                  />
                ) : (
                  <div className="divide-y divide-slate-100">
                    {prescriptions
                      .slice(0, 4)
                      .map(
                        (
                          prescription,
                        ) => (
                          <div
                            key={
                              prescription.id
                            }
                            className="p-4"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                <Pill className="h-4 w-4" />
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <p className="text-sm font-bold text-slate-900">
                                      {
                                        prescription.patient
                                      }
                                    </p>

                                    <p className="mt-1 text-sm text-slate-600">
                                      {
                                        prescription.medicine
                                      }
                                    </p>
                                  </div>

                                  <span className="rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                                    {
                                      prescription.status
                                    }
                                  </span>
                                </div>

                                <p className="mt-1 text-xs text-slate-400">
                                  {
                                    prescription.doctor
                                  }{" "}
                                 
                                  
                                </p>
                              </div>
                            </div>
                          </div>
                        ),
                      )}
                  </div>
                )}
              </section>
            </div>
          </div>

          {/* RIGHT */}

          <div className="space-y-6">
            {/* PROFILE */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-lg font-bold text-cyan-700">
                  {getInitials(
                    user.fullName ||
                      "Doctor",
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-base font-bold text-slate-900">
                    {user.fullName ||
                      "Doctor"}
                  </p>

                  <p className="mt-1 truncate text-xs text-slate-500">
                    {user.email ||
                      "No email available"}
                  </p>

                  <span className="mt-2 inline-flex rounded-lg border border-cyan-200 bg-cyan-50 px-2 py-1 text-[11px] font-semibold capitalize text-cyan-700">
                    {user.role?.replace(
                      /-/g,
                      " ",
                    ) || "Doctor"}
                  </span>
                </div>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Hospital
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {user.hospitalName ||
                    "MedCore Hospital"}
                </p>
              </div>
            </section>

            {/* FOLLOW UPS */}

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-5">
                <div className="flex items-center gap-2">
                  <Clock3 className="h-5 w-5 text-amber-600" />

                  <h2 className="text-lg font-bold text-slate-900">
                    Upcoming Follow-ups
                  </h2>
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  Based on appointments and EMR
                  records
                </p>
              </div>

              {followUps.length ===
              0 ? (
                <EmptySection
                  icon={Clock3}
                  title="No upcoming follow-ups"
                  description="Follow-up dates from EMR and appointments will appear here."
                />
              ) : (
                <div className="divide-y divide-slate-100">
                  {followUps
                    .slice(0, 5)
                    .map((followUp) => (
                      <div
                        key={followUp.id}
                        className="p-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-50 text-xs font-bold text-amber-700">
                            {getInitials(
                              followUp.patient,
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-slate-900">
                              {
                                followUp.patient
                              }
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {
                                followUp.reason
                              }
                            </p>

                            <div className="mt-2 flex flex-wrap gap-2">
                              <span className="rounded-md bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-500">
                                {
                                  followUp.date
                                }
                              </span>

                              <span className="text-[11px] text-slate-400">
                                {
                                  followUp.doctor
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </section>

            {/* SNAPSHOT */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                  <Activity className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Hospital Snapshot
                  </h2>

                  <p className="text-xs text-slate-500">
                    Live local data
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <SnapshotItem
                  label="Doctors"
                  value={doctorCount}
                />

                <SnapshotItem
                  label="Patients"
                  value={patientCount}
                />

                <SnapshotItem
                  label="Today"
                  value={
                    todayAppointments.length
                  }
                />

                <SnapshotItem
                  label="Labs"
                  value={
                    labApprovals.length
                  }
                />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   CLICKABLE STAT CARD
========================================================= */

function DashboardStat({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClass,
  onClick,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: ElementType;
  iconClass: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      whileHover={{
        y: -3,
      }}
      whileTap={{
        scale: 0.98,
      }}
      onClick={onClick}
      className="group w-full cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-cyan-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-200"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {subtitle}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass} transition group-hover:scale-105`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

    </motion.button>
  );
}

/* =========================================================
   INFO ITEM
========================================================= */

function InfoItem({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: ElementType;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>

      <p className="mt-1 truncate text-xs font-semibold text-slate-700">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   EMPTY SECTION
========================================================= */

function EmptySection({
  icon: Icon,
  title,
  description,
}: {
  icon: ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
        <Icon className="h-5 w-5" />
      </div>

      <p className="mt-3 text-sm font-semibold text-slate-700">
        {title}
      </p>

      <p className="mt-1 max-w-xs text-xs leading-5 text-slate-400">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   SNAPSHOT ITEM
========================================================= */

function SnapshotItem({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <p className="text-[11px] font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-lg font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}