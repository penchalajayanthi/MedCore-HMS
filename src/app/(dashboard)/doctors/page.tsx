"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  Activity,
  BriefcaseMedical,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Edit3,
  Eye,
  HeartPulse,
  Mail,
  Phone,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Stethoscope,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

const DOCTORS_STORAGE_KEY = "medcore_doctors";
const DOCTORS_UPDATED_EVENT = "medcore-doctors-updated";

type DoctorStatus = "Available" | "Busy" | "On Leave";

type Doctor = {
  id: number;
  name: string;
  specialization: string;
  department: string;
  qualification: string;
  experience: string;
  fee: string;
  email: string;
  phone: string;
  room: string;
  workingHours: string;
  status: DoctorStatus;
};

type DoctorFormData = Omit<Doctor, "id">;

type FormErrors = Partial<Record<keyof DoctorFormData, string>>;

const initialDoctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. Ananya Reddy",
    specialization: "Cardiologist",
    department: "Cardiology",
    qualification: "MBBS, MD, DM",
    experience: "12",
    fee: "1200",
    email: "ananya.reddy@medcore.com",
    phone: "9876543210",
    room: "204",
    workingHours: "09:00 AM - 02:00 PM",
    status: "Available",
  },
  {
    id: 2,
    name: "Dr. Rahul Sharma",
    specialization: "Neurologist",
    department: "Neurology",
    qualification: "MBBS, MD, DM",
    experience: "10",
    fee: "1500",
    email: "rahul.sharma@medcore.com",
    phone: "9876501234",
    room: "301",
    workingHours: "10:00 AM - 04:00 PM",
    status: "Busy",
  },
  {
    id: 3,
    name: "Dr. Priya Nair",
    specialization: "Pediatrician",
    department: "Pediatrics",
    qualification: "MBBS, MD",
    experience: "8",
    fee: "900",
    email: "priya.nair@medcore.com",
    phone: "9988776655",
    room: "112",
    workingHours: "08:00 AM - 01:00 PM",
    status: "Available",
  },
  {
    id: 4,
    name: "Dr. Karthik Rao",
    specialization: "Orthopedic Surgeon",
    department: "Orthopedics",
    qualification: "MBBS, MS",
    experience: "14",
    fee: "1300",
    email: "karthik.rao@medcore.com",
    phone: "9123456789",
    room: "405",
    workingHours: "11:00 AM - 05:00 PM",
    status: "On Leave",
  },
  {
    id: 5,
    name: "Dr. Sneha Kapoor",
    specialization: "Dermatologist",
    department: "Dermatology",
    qualification: "MBBS, MD",
    experience: "7",
    fee: "1000",
    email: "sneha.kapoor@medcore.com",
    phone: "9012345678",
    room: "208",
    workingHours: "09:30 AM - 03:30 PM",
    status: "Available",
  },
  {
    id: 6,
    name: "Dr. Arjun Verma",
    specialization: "General Physician",
    department: "General Medicine",
    qualification: "MBBS, MD",
    experience: "9",
    fee: "800",
    email: "arjun.verma@medcore.com",
    phone: "9345678901",
    room: "105",
    workingHours: "08:30 AM - 02:30 PM",
    status: "Busy",
  },
  {
    id: 7,
    name: "Dr. Meera Iyer",
    specialization: "Gynecologist",
    department: "Gynecology",
    qualification: "MBBS, MS",
    experience: "11",
    fee: "1100",
    email: "meera.iyer@medcore.com",
    phone: "9456789012",
    room: "309",
    workingHours: "10:00 AM - 04:00 PM",
    status: "Available",
  },
  {
    id: 8,
    name: "Dr. Vikram Singh",
    specialization: "ENT Specialist",
    department: "ENT",
    qualification: "MBBS, MS",
    experience: "6",
    fee: "950",
    email: "vikram.singh@medcore.com",
    phone: "9567890123",
    room: "216",
    workingHours: "09:00 AM - 01:00 PM",
    status: "Available",
  },
];

const departments = [
  "All Departments",
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "Dermatology",
  "General Medicine",
  "Gynecology",
  "ENT",
];

const emptyForm: DoctorFormData = {
  name: "",
  specialization: "",
  department: "",
  qualification: "",
  experience: "",
  fee: "",
  email: "",
  phone: "",
  room: "",
  workingHours: "",
  status: "Available",
};

function doctorExternalId(id: number | string) {
  const value = String(id);

  if (value.startsWith("DOC-")) {
    return value;
  }

  const numeric = Number(value);

  if (!Number.isNaN(numeric)) {
    return `DOC-${String(numeric).padStart(3, "0")}`;
  }

  return value;
}

function getInitials(name: string) {
  const cleaned = name
    .replace(/^Dr\.?\s*/i, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return (
    cleaned
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "DR"
  );
}

function formatCurrency(value: string) {
  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return "₹0";
  }

  return `₹${amount.toLocaleString("en-IN")}`;
}

function StatusBadge({ status }: { status: DoctorStatus }) {
  const styles: Record<DoctorStatus, string> = {
    Available:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    Busy:
      "border-amber-200 bg-amber-50 text-amber-700",
    "On Leave":
      "border-rose-200 bg-rose-50 text-rose-700",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === "Available"
            ? "bg-emerald-500"
            : status === "Busy"
              ? "bg-amber-500"
              : "bg-rose-500"
        }`}
      />
      {status}
    </span>
  );
}

function DoctorAvatar({ name }: { name: string }) {
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-blue-100 text-sm font-bold text-cyan-700 shadow-sm">
      {getInitials(name)}
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
  value: string | number;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
          <p className="mt-1 text-xs text-slate-400">{description}</p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
          {icon}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
  error,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </label>

      {children}

      {error && (
        <p className="text-xs font-medium text-rose-500">{error}</p>
      )}
    </div>
  );
}

function FormSection({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
          {icon}
        </div>

        <div>
          <h3 className="font-bold text-slate-900">{title}</h3>
          <p className="mt-0.5 text-xs text-slate-500">{description}</p>
        </div>
      </div>

      {children}
    </section>
  );
}

function PreviewRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-3 last:border-b-0">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      <span className="text-right text-sm font-semibold text-slate-800">
        {value || "—"}
      </span>
    </div>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-400">{label}</p>
        <p className="mt-0.5 break-words text-sm font-semibold text-slate-800">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] =
    useState("All Departments");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [isLoading, setIsLoading] = useState(true);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] =
    useState<Doctor | null>(null);

  const [selectedDoctor, setSelectedDoctor] =
    useState<Doctor | null>(null);

  const [deleteTarget, setDeleteTarget] =
    useState<Doctor | null>(null);

  const [form, setForm] = useState<DoctorFormData>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});

  const persistDoctors = (nextDoctors: Doctor[]) => {
    setDoctors(nextDoctors);
    localStorage.setItem(
      DOCTORS_STORAGE_KEY,
      JSON.stringify(nextDoctors),
    );

    window.dispatchEvent(
      new Event(DOCTORS_UPDATED_EVENT),
    );
  };

  const loadDoctors = () => {
    try {
      const stored = localStorage.getItem(
        DOCTORS_STORAGE_KEY,
      );

      if (!stored) {
        localStorage.setItem(
          DOCTORS_STORAGE_KEY,
          JSON.stringify(initialDoctors),
        );

        setDoctors(initialDoctors);
        return;
      }

      const parsed: unknown = JSON.parse(stored);

      if (Array.isArray(parsed)) {
        setDoctors(parsed as Doctor[]);
        return;
      }

      if (
        parsed &&
        typeof parsed === "object" &&
        "doctors" in parsed &&
        Array.isArray(
          (parsed as { doctors?: unknown }).doctors,
        )
      ) {
        setDoctors(
          (parsed as { doctors: Doctor[] }).doctors,
        );
        return;
      }

      setDoctors(initialDoctors);
    } catch {
      setDoctors(initialDoctors);
    }
  };

  useEffect(() => {
    loadDoctors();
    setIsLoading(false);

    const handleUpdate = () => {
      loadDoctors();
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === DOCTORS_STORAGE_KEY) {
        loadDoctors();
      }
    };

    window.addEventListener(
      DOCTORS_UPDATED_EVENT,
      handleUpdate,
    );

    window.addEventListener(
      "storage",
      handleStorage,
    );

    return () => {
      window.removeEventListener(
        DOCTORS_UPDATED_EVENT,
        handleUpdate,
      );

      window.removeEventListener(
        "storage",
        handleStorage,
      );
    };
  }, []);

  const filteredDoctors = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return doctors.filter((doctor) => {
      const matchesSearch =
        !query ||
        doctor.name.toLowerCase().includes(query) ||
        doctor.specialization.toLowerCase().includes(query) ||
        doctor.department.toLowerCase().includes(query) ||
        doctor.email.toLowerCase().includes(query);

      const matchesDepartment =
        departmentFilter === "All Departments" ||
        doctor.department === departmentFilter;

      const matchesStatus =
        statusFilter === "All Status" ||
        doctor.status === statusFilter;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesStatus
      );
    });
  }, [
    doctors,
    searchQuery,
    departmentFilter,
    statusFilter,
  ]);

  const availableCount = doctors.filter(
    (doctor) => doctor.status === "Available",
  ).length;

  const busyCount = doctors.filter(
    (doctor) => doctor.status === "Busy",
  ).length;

  const onLeaveCount = doctors.filter(
    (doctor) => doctor.status === "On Leave",
  ).length;

  const resetFilters = () => {
    setSearchQuery("");
    setDepartmentFilter("All Departments");
    setStatusFilter("All Status");
  };

  const openAddDoctor = () => {
    setEditingDoctor(null);
    setForm(emptyForm);
    setErrors({});
    setEditorOpen(true);
  };

  const openEditDoctor = (doctor: Doctor) => {
    setEditingDoctor(doctor);

    setForm({
      name: doctor.name,
      specialization: doctor.specialization,
      department: doctor.department,
      qualification: doctor.qualification,
      experience: doctor.experience,
      fee: doctor.fee,
      email: doctor.email,
      phone: doctor.phone,
      room: doctor.room,
      workingHours: doctor.workingHours,
      status: doctor.status,
    });

    setErrors({});
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    setEditingDoctor(null);
    setErrors({});
  };

  const updateField = <K extends keyof DoctorFormData>(
    field: K,
    value: DoctorFormData[K],
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));
  };

  const handleNameChange = (
    value: string,
  ) => {
    const cleaned = value
      .replace(/^dr\.?\s*/i, "")
      .replace(/\s+/g, " ")
      .trimStart();

    updateField(
      "name",
      cleaned ? `Dr. ${cleaned}` : "",
    );
  };

  const handlePhoneChange = (
    value: string,
  ) => {
    updateField(
      "phone",
      value.replace(/\D/g, "").slice(0, 10),
    );
  };

  const handleExperienceChange = (
    value: string,
  ) => {
    updateField(
      "experience",
      value.replace(/\D/g, "").slice(0, 2),
    );
  };

  const handleFeeChange = (
    value: string,
  ) => {
    updateField(
      "fee",
      value.replace(/\D/g, "").slice(0, 6),
    );
  };

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Doctor name is required.";
    }

    if (!form.specialization.trim()) {
      nextErrors.specialization =
        "Specialization is required.";
    }

    if (!form.department) {
      nextErrors.department =
        "Department is required.";
    }

    if (!form.qualification.trim()) {
      nextErrors.qualification =
        "Qualification is required.";
    }

    if (!form.experience) {
      nextErrors.experience =
        "Experience is required.";
    } else if (Number(form.experience) > 60) {
      nextErrors.experience =
        "Experience must be 60 years or less.";
    }

    if (!form.fee) {
      nextErrors.fee =
        "Consultation fee is required.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email,
      )
    ) {
      nextErrors.email =
        "Enter a valid email address.";
    }

    if (!form.phone) {
      nextErrors.phone =
        "Mobile number is required.";
    } else if (form.phone.length !== 10) {
      nextErrors.phone =
        "Mobile number must contain exactly 10 digits.";
    }

    if (!form.room.trim()) {
      nextErrors.room = "Room number is required.";
    }

    if (!form.workingHours.trim()) {
      nextErrors.workingHours =
        "Working hours are required.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      toast.error(
        "Please correct the highlighted fields.",
      );
      return;
    }

    const normalizedName = form.name
      .replace(/^dr\.?\s*/i, "")
      .trim();

    const doctorData: DoctorFormData = {
      ...form,
      name: `Dr. ${normalizedName}`,
      phone: form.phone.replace(/\D/g, ""),
      fee: form.fee.replace(/\D/g, ""),
      experience: form.experience.replace(
        /\D/g,
        "",
      ),
    };

    if (editingDoctor) {
      const nextDoctors = doctors.map(
        (doctor) =>
          doctor.id === editingDoctor.id
            ? {
                ...doctor,
                ...doctorData,
              }
            : doctor,
      );

      persistDoctors(nextDoctors);

      toast.success(
        "Doctor details updated successfully.",
      );
    } else {
      const nextId =
        doctors.length > 0
          ? Math.max(
              ...doctors.map((doctor) =>
                Number(doctor.id),
              ),
            ) + 1
          : 1;

      const newDoctor: Doctor = {
        id: nextId,
        ...doctorData,
      };

      persistDoctors([
        ...doctors,
        newDoctor,
      ]);

      toast.success(
        "Doctor added successfully.",
      );
    }

    closeEditor();
  };

  const handleDeleteDoctor = () => {
    if (!deleteTarget) return;

    const nextDoctors = doctors.filter(
      (doctor) =>
        doctor.id !== deleteTarget.id,
    );

    persistDoctors(nextDoctors);

    if (
      selectedDoctor?.id ===
      deleteTarget.id
    ) {
      setSelectedDoctor(null);
    }

    toast.success(
      "Doctor removed successfully.",
    );

    setDeleteTarget(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8">
        {/* HEADER */}
        <div className="overflow-hidden rounded-[2rem] border border-cyan-100 bg-gradient-to-br from-white via-cyan-50/70 to-blue-50 shadow-sm">
          <div className="flex flex-col gap-5 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-100">
                <Stethoscope className="h-7 w-7" />
              </div>

              <div>
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-cyan-200 bg-white px-3 py-1 text-xs font-bold text-cyan-700">
                    CLINICAL
                  </span>

                  <span className="text-xs font-medium text-slate-400">
                    Doctor Management
                  </span>
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Doctors
                </h1>

                <p className="mt-1 max-w-2xl text-sm text-slate-500">
                  Manage doctors, specializations,
                  departments, consultation fees and
                  availability.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-cyan-200 hover:bg-cyan-50"
              >
                <RefreshCw className="h-4 w-4" />
                Reset Filters
              </button>

              <button
                type="button"
                onClick={openAddDoctor}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-100 transition hover:from-cyan-600 hover:to-blue-700"
              >
                <Plus className="h-4 w-4" />
                Add Doctor
              </button>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Doctors"
            value={doctors.length}
            icon={<Stethoscope className="h-5 w-5" />}
            description="Registered medical staff"
          />

          <StatCard
            title="Available"
            value={availableCount}
            icon={<CheckCircle2 className="h-5 w-5" />}
            description="Currently available"
          />

          <StatCard
            title="Busy"
            value={busyCount}
            icon={<Clock3 className="h-5 w-5" />}
            description="Currently occupied"
          />

          <StatCard
            title="On Leave"
            value={onLeaveCount}
            icon={<CalendarDays className="h-5 w-5" />}
            description="Temporarily unavailable"
          />
        </div>

        {/* FILTERS */}
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.5fr_1fr_1fr_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search doctors, departments, specialization..."
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-50"
              />
            </div>

            <div className="relative">
              <select
                value={departmentFilter}
                onChange={(event) =>
                  setDepartmentFilter(event.target.value)
                }
                className="h-12 w-full cursor-pointer appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 pr-10 text-sm font-semibold text-slate-700 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
              >
                {departments.map((department) => (
                  <option
                    key={department}
                    value={department}
                  >
                    {department}
                  </option>
                ))}
              </select>

              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="h-12 w-full cursor-pointer appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 pr-10 text-sm font-semibold text-slate-700 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
              >
                <option>All Status</option>
                <option>Available</option>
                <option>Busy</option>
                <option>On Leave</option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="h-12 cursor-pointer rounded-2xl border border-cyan-200 bg-cyan-50 px-5 text-sm font-bold text-cyan-700 transition hover:bg-cyan-100"
            >
              Clear
            </button>
          </div>
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Doctor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Department
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Experience
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Consultation
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Availability
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredDoctors.map((doctor) => (
                  <tr
                    key={doctor.id}
                    className="transition hover:bg-cyan-50/40"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <DoctorAvatar
                          name={doctor.name}
                        />

                        <div>
                          <p className="font-bold text-slate-900">
                            {doctor.name}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-500">
                            {doctorExternalId(
                              doctor.id,
                            )}{" "}
                            •{" "}
                            {doctor.specialization}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                        {doctor.department}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-sm font-semibold text-slate-700">
                      {doctor.experience} years
                    </td>

                    <td className="px-6 py-5 text-sm font-bold text-cyan-700">
                      {formatCurrency(doctor.fee)}
                    </td>

                    <td className="px-6 py-5">
                      <StatusBadge
                        status={doctor.status}
                      />
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedDoctor(
                              doctor,
                            )
                          }
                          className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2 text-xs font-bold text-cyan-700 transition hover:bg-cyan-100"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            openEditDoctor(
                              doctor,
                            )
                          }
                          className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setDeleteTarget(
                              doctor,
                            )
                          }
                          className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!isLoading &&
            filteredDoctors.length === 0 && (
              <div className="px-6 py-16 text-center">
                <Stethoscope className="mx-auto h-10 w-10 text-slate-300" />
                <h3 className="mt-4 font-bold text-slate-800">
                  No doctors found
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Try changing your search or
                  filters.
                </p>
              </div>
            )}
        </div>

        {/* MOBILE / TABLET CARDS */}
        <div className="grid grid-cols-1 gap-4 lg:hidden">
          {filteredDoctors.map((doctor) => (
            <motion.div
              key={doctor.id}
              layout
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <DoctorAvatar name={doctor.name} />

                  <div className="min-w-0">
                    <p className="truncate font-bold text-slate-900">
                      {doctor.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {doctorExternalId(
                        doctor.id,
                      )}{" "}
                      • {doctor.specialization}
                    </p>
                  </div>
                </div>

                <StatusBadge
                  status={doctor.status}
                />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-400">
                    Department
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {doctor.department}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-400">
                    Consultation
                  </p>
                  <p className="mt-1 text-sm font-bold text-cyan-700">
                    {formatCurrency(doctor.fee)}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-400">
                    Experience
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {doctor.experience} years
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-400">
                    Room
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {doctor.room}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedDoctor(
                      doctor,
                    )
                  }
                  className="cursor-pointer rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2 text-xs font-bold text-cyan-700"
                >
                  View
                </button>

                <button
                  type="button"
                  onClick={() =>
                    openEditDoctor(
                      doctor,
                    )
                  }
                  className="cursor-pointer rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setDeleteTarget(
                      doctor,
                    )
                  }
                  className="cursor-pointer rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}

          {!isLoading &&
            filteredDoctors.length === 0 && (
              <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center">
                <Stethoscope className="mx-auto h-10 w-10 text-slate-300" />
                <h3 className="mt-4 font-bold text-slate-800">
                  No doctors found
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Try changing your search or
                  filters.
                </p>
              </div>
            )}
        </div>
      </div>

      {/* ADD / EDIT DRAWER */}
      <AnimatePresence>
        {editorOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm"
          >
            <div className="absolute inset-y-0 right-0 flex w-full max-w-3xl flex-col bg-slate-50 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-7">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-cyan-600">
                    Doctor Management
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    {editingDoctor
                      ? "Edit Doctor"
                      : "Add Doctor"}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={closeEditor}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 sm:p-7">
                <div className="space-y-5">
                  <FormSection
                    title="Professional Information"
                    description="Basic medical and department details."
                    icon={
                      <Stethoscope className="h-5 w-5" />
                    }
                  >
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <Field
                        label="Doctor Name"
                        required
                        error={errors.name}
                      >
                        <input
                          value={form.name}
                          onChange={(event) =>
                            handleNameChange(
                              event.target.value,
                            )
                          }
                          placeholder="Dr. John Doe"
                          className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-50"
                        />
                      </Field>

                      <Field
                        label="Specialization"
                        required
                        error={
                          errors.specialization
                        }
                      >
                        <input
                          value={
                            form.specialization
                          }
                          onChange={(event) =>
                            updateField(
                              "specialization",
                              event.target.value,
                            )
                          }
                          placeholder="Cardiologist"
                          className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-50"
                        />
                      </Field>

                      <Field
                        label="Department"
                        required
                        error={
                          errors.department
                        }
                      >
                        <select
                          value={form.department}
                          onChange={(event) =>
                            updateField(
                              "department",
                              event.target.value,
                            )
                          }
                          className="h-12 w-full cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-50"
                        >
                          <option value="">
                            Select department
                          </option>

                          {departments
                            .filter(
                              (item) =>
                                item !==
                                "All Departments",
                            )
                            .map(
                              (
                                department,
                              ) => (
                                <option
                                  key={
                                    department
                                  }
                                  value={
                                    department
                                  }
                                >
                                  {
                                    department
                                  }
                                </option>
                              ),
                            )}
                        </select>
                      </Field>

                      <Field
                        label="Qualification"
                        required
                        error={
                          errors.qualification
                        }
                      >
                        <input
                          value={
                            form.qualification
                          }
                          onChange={(event) =>
                            updateField(
                              "qualification",
                              event.target.value,
                            )
                          }
                          placeholder="MBBS, MD"
                          className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-50"
                        />
                      </Field>

                      <Field
                        label="Experience (Years)"
                        required
                        error={
                          errors.experience
                        }
                      >
                        <input
                          inputMode="numeric"
                          value={form.experience}
                          onChange={(event) =>
                            handleExperienceChange(
                              event.target.value,
                            )
                          }
                          placeholder="10"
                          className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-50"
                        />
                      </Field>

                      <Field
                        label="Consultation Fee"
                        required
                        error={errors.fee}
                      >
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                            ₹
                          </span>

                          <input
                            inputMode="numeric"
                            value={form.fee}
                            onChange={(event) =>
                              handleFeeChange(
                                event.target
                                  .value,
                              )
                            }
                            placeholder="1200"
                            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm font-medium outline-none focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-50"
                          />
                        </div>
                      </Field>
                    </div>
                  </FormSection>

                  <FormSection
                    title="Contact & Schedule"
                    description="Contact information and clinic schedule."
                    icon={
                      <CalendarDays className="h-5 w-5" />
                    }
                  >
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <Field
                        label="Email"
                        required
                        error={errors.email}
                      >
                        <input
                          type="email"
                          value={form.email}
                          onChange={(event) =>
                            updateField(
                              "email",
                              event.target.value,
                            )
                          }
                          placeholder="doctor@medcore.com"
                          className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-50"
                        />
                      </Field>

                      <Field
                        label="Mobile Number"
                        required
                        error={errors.phone}
                      >
                        <div className="flex">
                          <div className="flex h-12 items-center rounded-l-2xl border border-r-0 border-slate-200 bg-slate-100 px-3 text-sm font-bold text-slate-600">
                            +91
                          </div>

                          <input
                            inputMode="numeric"
                            value={form.phone}
                            onChange={(event) =>
                              handlePhoneChange(
                                event.target
                                  .value,
                              )
                            }
                            placeholder="9876543210"
                            className="h-12 min-w-0 flex-1 rounded-r-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-50"
                          />
                        </div>
                      </Field>

                      <Field
                        label="Room Number"
                        required
                        error={errors.room}
                      >
                        <input
                          value={form.room}
                          onChange={(event) =>
                            updateField(
                              "room",
                              event.target.value,
                            )
                          }
                          placeholder="204"
                          className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-50"
                        />
                      </Field>

                      <Field
                        label="Working Hours"
                        required
                        error={
                          errors.workingHours
                        }
                      >
                        <input
                          value={
                            form.workingHours
                          }
                          onChange={(event) =>
                            updateField(
                              "workingHours",
                              event.target.value,
                            )
                          }
                          placeholder="09:00 AM - 02:00 PM"
                          className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-50"
                        />
                      </Field>

                      <Field label="Availability Status">
                        <select
                          value={form.status}
                          onChange={(event) =>
                            updateField(
                              "status",
                              event.target
                                .value as DoctorStatus,
                            )
                          }
                          className="h-12 w-full cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-50"
                        >
                          <option>
                            Available
                          </option>
                          <option>Busy</option>
                          <option>
                            On Leave
                          </option>
                        </select>
                      </Field>
                    </div>
                  </FormSection>

                  <div className="rounded-3xl border border-cyan-100 bg-gradient-to-r from-cyan-50 to-blue-50 p-5">
                    <div className="flex gap-3">
                      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-cyan-600" />

                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          Cross-module integration
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          This doctor will be available
                          to the Appointments,
                          Prescriptions and other
                          MedCore clinical modules
                          through shared local storage.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 bg-white p-4 sm:p-5">
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeEditor}
                    className="cursor-pointer rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="cursor-pointer rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-100 transition hover:from-cyan-600 hover:to-blue-700"
                  >
                    {editingDoctor
                      ? "Update Doctor"
                      : "Create Doctor"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VIEW MODAL */}
      <AnimatePresence>
        {selectedDoctor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
            onClick={() =>
              setSelectedDoctor(null)
            }
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              onClick={(event) =>
                event.stopPropagation()
              }
              className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] bg-white shadow-2xl"
            >
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-6 text-white sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-xl font-bold backdrop-blur">
                      {getInitials(
                        selectedDoctor.name,
                      )}
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-cyan-100">
                        {
                          selectedDoctorExternalId(
                            selectedDoctor.id,
                          )
                        }
                      </p>

                      <h2 className="mt-1 text-2xl font-bold">
                        {selectedDoctor.name}
                      </h2>

                      <p className="mt-1 text-sm text-cyan-50">
                        {
                          selectedDoctor.specialization
                        }{" "}
                        •{" "}
                        {
                          selectedDoctor.department
                        }
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedDoctor(null)
                    }
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-white/15 transition hover:bg-white/25"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-7">
                <DetailItem
                  icon={
                    <BriefcaseMedical className="h-4 w-4" />
                  }
                  label="Qualification"
                  value={
                    selectedDoctor.qualification
                  }
                />

                <DetailItem
                  icon={
                    <Activity className="h-4 w-4" />
                  }
                  label="Experience"
                  value={`${selectedDoctor.experience} years`}
                />

                <DetailItem
                  icon={
                    <HeartPulse className="h-4 w-4" />
                  }
                  label="Consultation Fee"
                  value={formatCurrency(
                    selectedDoctor.fee,
                  )}
                />

                <DetailItem
                  icon={
                    <Mail className="h-4 w-4" />
                  }
                  label="Email"
                  value={selectedDoctor.email}
                />

                <DetailItem
                  icon={
                    <Phone className="h-4 w-4" />
                  }
                  label="Mobile"
                  value={`+91 ${selectedDoctor.phone}`}
                />

                <DetailItem
                  icon={
                    <UserRound className="h-4 w-4" />
                  }
                  label="Room"
                  value={selectedDoctor.room}
                />

                <DetailItem
                  icon={
                    <Clock3 className="h-4 w-4" />
                  }
                  label="Working Hours"
                  value={
                    selectedDoctor.workingHours
                  }
                />

                <div>
                  <p className="mb-2 text-xs font-medium text-slate-400">
                    Current Status
                  </p>
                  <StatusBadge
                    status={
                      selectedDoctor.status
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end border-t border-slate-100 p-5">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedDoctor(null)
                  }
                  className="cursor-pointer rounded-2xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DELETE MODAL */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
            onClick={() =>
              setDeleteTarget(null)
            }
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              onClick={(event) =>
                event.stopPropagation()
              }
              className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                <Trash2 className="h-6 w-6" />
              </div>

              <h3 className="mt-5 text-center text-xl font-bold text-slate-900">
                Remove Doctor?
              </h3>

              <p className="mt-2 text-center text-sm leading-6 text-slate-500">
                Are you sure you want to remove{" "}
                <span className="font-bold text-slate-700">
                  {deleteTarget.name}
                </span>
                ? This will remove the doctor from
                the shared Doctors data.
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setDeleteTarget(null)
                  }
                  className="flex-1 cursor-pointer rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDeleteDoctor}
                  className="flex-1 cursor-pointer rounded-2xl bg-rose-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-rose-600"
                >
                  Remove Doctor
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function selectedDoctorExternalId(id: number) {
  return doctorExternalId(id);
}