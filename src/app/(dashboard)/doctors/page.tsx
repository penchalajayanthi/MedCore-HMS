"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  Activity,
  ArrowLeft,
  BriefcaseMedical,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Edit3,
  Eye,
  Filter,
  HeartPulse,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  Stethoscope,
  Trash2,
  UserRound,
  Users,
  X,
} from "lucide-react";

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

type DoctorFormData = {
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

function getInitials(name: string) {
  const cleaned = name.replace(/^dr\.?\s*/i, "").trim();

  if (!cleaned) return "DR";

  return cleaned
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function formatCurrency(value: string) {
  const number = Number(value);

  if (!Number.isFinite(number)) return "₹0";

  return `₹${number.toLocaleString("en-IN")}`;
}

function StatusBadge({ status }: { status: DoctorStatus }) {
  const styles = {
    Available: "border-emerald-200 bg-emerald-50 text-emerald-700",
    Busy: "border-amber-200 bg-amber-50 text-amber-700",
    "On Leave": "border-rose-200 bg-rose-50 text-rose-700",
  };

  const dots = {
    Available: "bg-emerald-500",
    Busy: "bg-amber-500",
    "On Leave": "bg-rose-500",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${styles[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dots[status]}`} />
      {status}
    </span>
  );
}

function DoctorAvatar({
  name,
  large = false,
}: {
  name: string;
  large?: boolean;
}) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-2xl border border-cyan-100 bg-cyan-50 font-bold text-cyan-700 ${
        large ? "h-20 w-20 text-xl" : "h-11 w-11 text-sm"
      }`}
    >
      {getInitials(name)}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  iconClass,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-500 sm:text-sm">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconClass}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  children,
  className = "",
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </label>

      {children}

      {error && (
        <p className="mt-1.5 text-xs font-medium text-rose-500">{error}</p>
      )}
    </div>
  );
}

function FormSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
      </div>

      {children}
    </section>
  );
}

function PreviewRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-slate-100 py-3 last:border-0">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-cyan-600" />

      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-medium text-slate-700">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-400">{label}</p>

        <p className="mt-1 break-words text-sm font-semibold text-slate-700">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Users className="h-7 w-7" />
      </div>

      <h3 className="mt-5 text-base font-bold text-slate-900">
        No doctors found
      </h3>

      <p className="mt-2 max-w-sm text-sm text-slate-500">
        Try changing your search or filters to find doctors.
      </p>
    </div>
  );
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [status, setStatus] = useState<"All" | DoctorStatus>("All");

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingDoctorId, setEditingDoctorId] = useState<number | null>(null);

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);

  const [form, setForm] = useState<DoctorFormData>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});

  const filteredDoctors = useMemo(() => {
    const query = search.trim().toLowerCase();

    return doctors.filter((doctor) => {
      const matchesSearch =
        !query ||
        doctor.name.toLowerCase().includes(query) ||
        doctor.specialization.toLowerCase().includes(query) ||
        doctor.department.toLowerCase().includes(query) ||
        doctor.email.toLowerCase().includes(query);

      const matchesDepartment =
        department === "All Departments" ||
        doctor.department === department;

      const matchesStatus =
        status === "All" || doctor.status === status;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [doctors, search, department, status]);

  const totalDoctors = doctors.length;

  const availableDoctors = doctors.filter(
    (doctor) => doctor.status === "Available"
  ).length;

  const busyDoctors = doctors.filter(
    (doctor) => doctor.status === "Busy"
  ).length;

  const onLeaveDoctors = doctors.filter(
    (doctor) => doctor.status === "On Leave"
  ).length;

  const hasActiveFilters =
    search.trim() !== "" ||
    department !== "All Departments" ||
    status !== "All";

  function resetFilters() {
    setSearch("");
    setDepartment("All Departments");
    setStatus("All");
  }

  function openAddDoctor() {
    setEditingDoctorId(null);
    setForm(emptyForm);
    setErrors({});
    setIsEditorOpen(true);
  }

  function openEditDoctor(doctor: Doctor) {
    setEditingDoctorId(doctor.id);

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
    setIsEditorOpen(true);
  }

  function closeEditor() {
    setIsEditorOpen(false);
    setEditingDoctorId(null);
    setErrors({});
  }

  function updateField<K extends keyof DoctorFormData>(
    field: K,
    value: DoctorFormData[K]
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));
  }

  function handleDoctorNameChange(value: string) {
    const cleaned = value.replace(/^dr\.?\s*/i, "");

    updateField(
      "name",
      cleaned.trim() ? `Dr. ${cleaned}` : ""
    );
  }

  function handlePhoneChange(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 10);

    updateField("phone", digits);
  }

  function handleExperienceChange(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 2);

    updateField("experience", digits);
  }

  function handleFeeChange(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 6);

    updateField("fee", digits);
  }

  function validateForm() {
    const nextErrors: FormErrors = {};

    if (!form.name.trim() || form.name.trim() === "Dr.") {
      nextErrors.name = "Doctor name is required";
    }

    if (!form.specialization.trim()) {
      nextErrors.specialization = "Specialization is required";
    }

    if (!form.department) {
      nextErrors.department = "Department is required";
    }

    if (!form.qualification.trim()) {
      nextErrors.qualification = "Qualification is required";
    }

    if (!form.experience.trim()) {
      nextErrors.experience = "Experience is required";
    } else if (Number(form.experience) > 60) {
      nextErrors.experience = "Please enter a valid experience";
    }

    if (!form.fee.trim()) {
      nextErrors.fee = "Consultation fee is required";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      nextErrors.email = "Enter a valid email address";
    }

    if (!form.phone.trim()) {
      nextErrors.phone = "Phone number is required";
    } else if (form.phone.length !== 10) {
      nextErrors.phone = "Enter exactly 10 digits";
    }

    if (!form.room.trim()) {
      nextErrors.room = "Room number is required";
    }

    if (!form.workingHours.trim()) {
      nextErrors.workingHours = "Working hours are required";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit() {
    if (!validateForm()) {
      toast.error("Please correct the highlighted fields");
      return;
    }

    const normalizedName = form.name.startsWith("Dr.")
      ? form.name
      : `Dr. ${form.name}`;

    if (editingDoctorId !== null) {
      setDoctors((previous) =>
        previous.map((doctor) =>
          doctor.id === editingDoctorId
            ? {
                ...doctor,
                ...form,
                name: normalizedName,
              }
            : doctor
        )
      );

      toast.success("Doctor updated successfully");
    } else {
      const newDoctor: Doctor = {
        id: Date.now(),
        ...form,
        name: normalizedName,
      };

      setDoctors((previous) => [newDoctor, ...previous]);

      toast.success("Doctor added successfully");
    }

    closeEditor();
  }

  function handleDeleteDoctor() {
    if (!doctorToDelete) return;

    setDoctors((previous) =>
      previous.filter((doctor) => doctor.id !== doctorToDelete.id)
    );

    toast.success("Doctor deleted successfully");

    setDoctorToDelete(null);

    if (selectedDoctor?.id === doctorToDelete.id) {
      setSelectedDoctor(null);
    }
  }

  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto w-full max-w-[1800px] space-y-5 p-4 sm:p-6 lg:p-7">
        {/* PAGE HEADER */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
                <Stethoscope className="h-5 w-5" />
              </div>

              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  Doctors
                </h1>

                <p className="text-sm text-slate-500">
                  Manage doctors, departments, schedules and availability.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={openAddDoctor}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Add New Doctor
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <StatCard
            title="Total Doctors"
            value={totalDoctors}
            icon={Users}
            iconClass="bg-cyan-50 text-cyan-600"
          />

          <StatCard
            title="Available Now"
            value={availableDoctors}
            icon={CheckCircle2}
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <StatCard
            title="Currently Busy"
            value={busyDoctors}
            icon={Activity}
            iconClass="bg-amber-50 text-amber-600"
          />

          <StatCard
            title="On Leave"
            value={onLeaveDoctors}
            icon={CalendarDays}
            iconClass="bg-rose-50 text-rose-600"
          />
        </div>

        {/* SEARCH + FILTERS */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            {/* SEARCH */}
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search doctors by name, specialization or email..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              />
            </div>

            {/* FILTERS */}
            <div className="flex flex-col gap-3 sm:flex-row">
              {/* DEPARTMENT */}
              <div className="relative min-w-[190px]">
                <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <select
                  value={department}
                  onChange={(event) =>
                    setDepartment(event.target.value)
                  }
                  className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-9 text-sm font-medium text-slate-700 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                >
                  {departments.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>

              {/* STATUS */}
              <div className="relative min-w-[150px]">
                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target.value as "All" | DoctorStatus
                    )
                  }
                  className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-9 text-sm font-medium text-slate-700 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                >
                  <option value="All">All Status</option>
                  <option value="Available">Available</option>
                  <option value="Busy">Busy</option>
                  <option value="On Leave">On Leave</option>
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>

              {/* RESET FILTERS */}
              <button
                type="button"
                onClick={resetFilters}
                disabled={!hasActiveFilters}
                className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition active:scale-[0.98] ${
                  hasActiveFilters
                    ? "border-slate-200 bg-white text-slate-600 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                    : "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
                }`}
              >
                <X className="h-4 w-4" />
                Reset Filters
              </button>
            </div>
          </div>

          {/* ACTIVE FILTER INFO */}
          {hasActiveFilters && (
            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
              <span className="text-xs font-medium text-slate-400">
                Active filters:
              </span>

              {search.trim() && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
                  Search: {search}
                </span>
              )}

              {department !== "All Departments" && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  {department}
                </span>
              )}

              {status !== "All" && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                  {status}
                </span>
              )}
            </div>
          )}
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Doctor
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Department
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Experience
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Fee
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Schedule
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredDoctors.map((doctor, index) => (
                  <motion.tr
                    key={doctor.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.2,
                      delay: index * 0.025,
                    }}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <DoctorAvatar name={doctor.name} />

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-900">
                            {doctor.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {doctor.specialization}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-slate-700">
                        {doctor.department}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Room {doctor.room}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-slate-700">
                        {doctor.experience} years
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-slate-800">
                        {formatCurrency(doctor.fee)}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-slate-700">
                        {doctor.workingHours}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={doctor.status} />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedDoctor(doctor)}
                          title="View doctor"
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-600"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => openEditDoctor(doctor)}
                          title="Edit doctor"
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDoctorToDelete(doctor)}
                          title="Delete doctor"
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredDoctors.length === 0 && <EmptyState />}
        </div>

        {/* MOBILE / TABLET CARDS */}
        <div className="grid gap-4 xl:hidden">
          {filteredDoctors.map((doctor, index) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.2,
                delay: index * 0.025,
              }}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <DoctorAvatar name={doctor.name} />

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {doctor.name}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-500">
                      {doctor.specialization}
                    </p>

                    <p className="mt-1 text-xs font-medium text-cyan-600">
                      {doctor.department}
                    </p>
                  </div>
                </div>

                <StatusBadge status={doctor.status} />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-4">
                <div>
                  <p className="text-[11px] font-medium text-slate-400">
                    Experience
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {doctor.experience} yrs
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-medium text-slate-400">
                    Fee
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {formatCurrency(doctor.fee)}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-medium text-slate-400">
                    Room
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {doctor.room}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-medium text-slate-400">
                    Schedule
                  </p>

                  <p className="mt-1 truncate text-sm font-semibold text-slate-700">
                    {doctor.workingHours}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedDoctor(doctor)}
                  className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-600"
                >
                  <Eye className="h-4 w-4" />
                  View
                </button>

                <button
                  type="button"
                  onClick={() => openEditDoctor(doctor)}
                  className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => setDoctorToDelete(doctor)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}

          {filteredDoctors.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <EmptyState />
            </div>
          )}
        </div>
      </div>

      {/* =========================================================
          ADD / EDIT DOCTOR SLIDE-OVER
      ========================================================== */}
      <AnimatePresence>
        {isEditorOpen && (
          <motion.div
            className="fixed inset-0 z-[100] bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 30,
              }}
              className="flex h-full w-full flex-col bg-slate-50"
            >
              {/* HEADER */}
              <header className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex min-w-0 items-center gap-3">
                  <button
                    type="button"
                    onClick={closeEditor}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-600"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>

                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-bold text-slate-900 sm:text-xl">
                      {editingDoctorId !== null
                        ? "Edit Doctor"
                        : "Add New Doctor"}
                    </h2>

                    <p className="hidden text-sm text-slate-500 sm:block">
                      {editingDoctorId !== null
                        ? "Update doctor information and schedule."
                        : "Create a complete doctor profile for MedCore HMS."}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeEditor}
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </header>

              {/* BODY */}
              <div className="min-h-0 flex-1 overflow-y-auto">
                <div className="mx-auto grid max-w-[1500px] gap-5 p-4 sm:p-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:p-8">
                  {/* PREVIEW */}
                  <aside className="lg:sticky lg:top-8 lg:h-fit">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Live Preview
                      </p>

                      <div className="mt-5 flex flex-col items-center text-center">
                        <DoctorAvatar
                          name={form.name || "Doctor"}
                          large
                        />

                        <h3 className="mt-4 break-words text-lg font-bold text-slate-900">
                          {form.name || "Dr. Doctor Name"}
                        </h3>

                        <p className="mt-1 text-sm font-medium text-cyan-600">
                          {form.specialization ||
                            "Medical Specialization"}
                        </p>

                        <div className="mt-3">
                          <StatusBadge status={form.status} />
                        </div>
                      </div>

                      <div className="mt-6 border-t border-slate-100">
                        <PreviewRow
                          icon={BriefcaseMedical}
                          label="Department"
                          value={form.department}
                        />

                        <PreviewRow
                          icon={CheckCircle2}
                          label="Qualification"
                          value={form.qualification}
                        />

                        <PreviewRow
                          icon={Activity}
                          label="Experience"
                          value={
                            form.experience
                              ? `${form.experience} years`
                              : ""
                          }
                        />

                        <PreviewRow
                          icon={Phone}
                          label="Phone"
                          value={
                            form.phone
                              ? `+91 ${form.phone}`
                              : ""
                          }
                        />

                        <PreviewRow
                          icon={MapPin}
                          label="Room"
                          value={form.room}
                        />

                        <PreviewRow
                          icon={Clock3}
                          label="Working Hours"
                          value={form.workingHours}
                        />
                      </div>
                    </div>
                  </aside>

                  {/* FORM */}
                  <main className="space-y-5">
                    {/* BASIC INFORMATION */}
                    <FormSection
                      icon={UserRound}
                      title="Basic Information"
                      description="Enter the doctor's identity and primary professional information."
                    >
                      <div className="grid gap-5 md:grid-cols-2">
                        <Field
                          label="Doctor Name"
                          required
                          error={errors.name}
                          className="md:col-span-2"
                        >
                          <div
                            className={`flex h-11 overflow-hidden rounded-xl border bg-white transition focus-within:ring-2 ${
                              errors.name
                                ? "border-rose-300 focus-within:border-rose-400 focus-within:ring-rose-100"
                                : "border-slate-200 focus-within:border-cyan-400 focus-within:ring-cyan-100"
                            }`}
                          >
                            <div className="flex items-center border-r border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-600">
                              Dr.
                            </div>

                            <input
                              value={form.name.replace(
                                /^dr\.?\s*/i,
                                ""
                              )}
                              onChange={(event) =>
                                handleDoctorNameChange(
                                  event.target.value
                                )
                              }
                              placeholder="Ananya Reddy"
                              className="min-w-0 flex-1 bg-transparent px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                            />
                          </div>
                        </Field>

                        <Field
                          label="Specialization"
                          required
                          error={errors.specialization}
                        >
                          <div className="relative">
                            <Stethoscope className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <input
                              value={form.specialization}
                              onChange={(event) =>
                                updateField(
                                  "specialization",
                                  event.target.value
                                )
                              }
                              placeholder="e.g. Cardiologist"
                              className={`h-11 w-full rounded-xl border bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                                errors.specialization
                                  ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
                                  : "border-slate-200 focus:border-cyan-400 focus:ring-cyan-100"
                              }`}
                            />
                          </div>
                        </Field>

                        <Field
                          label="Department"
                          required
                          error={errors.department}
                        >
                          <div className="relative">
                            <BriefcaseMedical className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <select
                              value={form.department}
                              onChange={(event) =>
                                updateField(
                                  "department",
                                  event.target.value
                                )
                              }
                              className={`h-11 w-full appearance-none rounded-xl border bg-white pl-10 pr-10 text-sm text-slate-900 outline-none transition focus:ring-2 ${
                                errors.department
                                  ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
                                  : "border-slate-200 focus:border-cyan-400 focus:ring-cyan-100"
                              }`}
                            >
                              <option value="">
                                Select department
                              </option>

                              {departments
                                .filter(
                                  (item) =>
                                    item !== "All Departments"
                                )
                                .map((item) => (
                                  <option key={item}>
                                    {item}
                                  </option>
                                ))}
                            </select>

                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          </div>
                        </Field>

                        <Field
                          label="Qualification"
                          required
                          error={errors.qualification}
                        >
                          <input
                            value={form.qualification}
                            onChange={(event) =>
                              updateField(
                                "qualification",
                                event.target.value
                              )
                            }
                            placeholder="e.g. MBBS, MD, DM"
                            className={`h-11 w-full rounded-xl border bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                              errors.qualification
                                ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
                                : "border-slate-200 focus:border-cyan-400 focus:ring-cyan-100"
                            }`}
                          />
                        </Field>

                        <Field
                          label="Experience"
                          required
                          error={errors.experience}
                        >
                          <div className="relative">
                            <input
                              value={form.experience}
                              onChange={(event) =>
                                handleExperienceChange(
                                  event.target.value
                                )
                              }
                              inputMode="numeric"
                              placeholder="e.g. 12"
                              className={`h-11 w-full rounded-xl border bg-white px-4 pr-16 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                                errors.experience
                                  ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
                                  : "border-slate-200 focus:border-cyan-400 focus:ring-cyan-100"
                              }`}
                            />

                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                              Years
                            </span>
                          </div>
                        </Field>
                      </div>
                    </FormSection>

                    {/* PROFESSIONAL DETAILS */}
                    <FormSection
                      icon={HeartPulse}
                      title="Professional Details"
                      description="Set consultation charges and current availability."
                    >
                      <div className="grid gap-5 md:grid-cols-2">
                        <Field
                          label="Consultation Fee"
                          required
                          error={errors.fee}
                        >
                          <div className="relative">
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
                              ₹
                            </span>

                            <input
                              value={form.fee}
                              onChange={(event) =>
                                handleFeeChange(
                                  event.target.value
                                )
                              }
                              inputMode="numeric"
                              placeholder="1200"
                              className={`h-11 w-full rounded-xl border bg-white pl-8 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                                errors.fee
                                  ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
                                  : "border-slate-200 focus:border-cyan-400 focus:ring-cyan-100"
                              }`}
                            />
                          </div>
                        </Field>

                        <Field
                          label="Current Status"
                          required
                        >
                          <div className="relative">
                            <select
                              value={form.status}
                              onChange={(event) =>
                                updateField(
                                  "status",
                                  event.target.value as DoctorStatus
                                )
                              }
                              className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                            >
                              <option value="Available">
                                Available
                              </option>

                              <option value="Busy">
                                Busy
                              </option>

                              <option value="On Leave">
                                On Leave
                              </option>
                            </select>

                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          </div>
                        </Field>
                      </div>
                    </FormSection>

                    {/* CONTACT & SCHEDULE */}
                    <FormSection
                      icon={CalendarDays}
                      title="Contact & Schedule"
                      description="Add contact details, room assignment and working hours."
                    >
                      <div className="grid gap-5 md:grid-cols-2">
                        <Field
                          label="Email Address"
                          required
                          error={errors.email}
                        >
                          <div className="relative">
                            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <input
                              type="email"
                              value={form.email}
                              onChange={(event) =>
                                updateField(
                                  "email",
                                  event.target.value
                                )
                              }
                              placeholder="doctor@medcore.com"
                              className={`h-11 w-full rounded-xl border bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                                errors.email
                                  ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
                                  : "border-slate-200 focus:border-cyan-400 focus:ring-cyan-100"
                              }`}
                            />
                          </div>
                        </Field>

                        <Field
                          label="Phone Number"
                          required
                          error={errors.phone}
                        >
                          <div
                            className={`flex h-11 overflow-hidden rounded-xl border bg-white transition focus-within:ring-2 ${
                              errors.phone
                                ? "border-rose-300 focus-within:border-rose-400 focus-within:ring-rose-100"
                                : "border-slate-200 focus-within:border-cyan-400 focus-within:ring-cyan-100"
                            }`}
                          >
                            <div className="flex items-center border-r border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-600">
                              +91
                            </div>

                            <input
                              value={form.phone}
                              onChange={(event) =>
                                handlePhoneChange(
                                  event.target.value
                                )
                              }
                              inputMode="numeric"
                              maxLength={10}
                              placeholder="9876543210"
                              className="min-w-0 flex-1 bg-transparent px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                            />
                          </div>
                        </Field>

                        <Field
                          label="Room Number"
                          required
                          error={errors.room}
                        >
                          <div className="relative">
                            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <input
                              value={form.room}
                              onChange={(event) =>
                                updateField(
                                  "room",
                                  event.target.value
                                )
                              }
                              placeholder="e.g. 204"
                              className={`h-11 w-full rounded-xl border bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                                errors.room
                                  ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
                                  : "border-slate-200 focus:border-cyan-400 focus:ring-cyan-100"
                              }`}
                            />
                          </div>
                        </Field>

                        <Field
                          label="Working Hours"
                          required
                          error={errors.workingHours}
                        >
                          <div className="relative">
                            <Clock3 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <input
                              value={form.workingHours}
                              onChange={(event) =>
                                updateField(
                                  "workingHours",
                                  event.target.value
                                )
                              }
                              placeholder="09:00 AM - 02:00 PM"
                              className={`h-11 w-full rounded-xl border bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                                errors.workingHours
                                  ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
                                  : "border-slate-200 focus:border-cyan-400 focus:ring-cyan-100"
                              }`}
                            />
                          </div>
                        </Field>
                      </div>
                    </FormSection>
                  </main>
                </div>
              </div>

              {/* FOOTER */}
              <footer className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
                <button
                  type="button"
                  onClick={closeEditor}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-cyan-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700 active:scale-[0.98]"
                >
                  <Check className="h-4 w-4" />

                  {editingDoctorId !== null
                    ? "Save Changes"
                    : "Create Doctor"}
                </button>
              </footer>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================
          VIEW DOCTOR
      ========================================================== */}
      <AnimatePresence>
        {selectedDoctor && (
          <motion.div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={() => setSelectedDoctor(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              onMouseDown={(event) => event.stopPropagation()}
              className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Doctor Profile
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Complete professional information
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedDoctor(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex flex-col items-center border-b border-slate-100 pb-6 text-center sm:flex-row sm:text-left">
                  <DoctorAvatar
                    name={selectedDoctor.name}
                    large
                  />

                  <div className="mt-4 sm:ml-5 sm:mt-0">
                    <h3 className="text-xl font-bold text-slate-900">
                      {selectedDoctor.name}
                    </h3>

                    <p className="mt-1 font-medium text-cyan-600">
                      {selectedDoctor.specialization}
                    </p>

                    <div className="mt-3">
                      <StatusBadge status={selectedDoctor.status} />
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <DetailItem
                    icon={BriefcaseMedical}
                    label="Department"
                    value={selectedDoctor.department}
                  />

                  <DetailItem
                    icon={CheckCircle2}
                    label="Qualification"
                    value={selectedDoctor.qualification}
                  />

                  <DetailItem
                    icon={Activity}
                    label="Experience"
                    value={`${selectedDoctor.experience} years`}
                  />

                  <DetailItem
                    icon={HeartPulse}
                    label="Consultation Fee"
                    value={formatCurrency(selectedDoctor.fee)}
                  />

                  <DetailItem
                    icon={Mail}
                    label="Email"
                    value={selectedDoctor.email}
                  />

                  <DetailItem
                    icon={Phone}
                    label="Phone"
                    value={`+91 ${selectedDoctor.phone}`}
                  />

                  <DetailItem
                    icon={MapPin}
                    label="Room"
                    value={selectedDoctor.room}
                  />

                  <DetailItem
                    icon={Clock3}
                    label="Working Hours"
                    value={selectedDoctor.workingHours}
                  />
                </div>

                <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedDoctor(null)}
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    Close
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      openEditDoctor(selectedDoctor);
                      setSelectedDoctor(null);
                    }}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 text-sm font-semibold text-white transition hover:bg-cyan-700"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit Doctor
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================
          DELETE CONFIRMATION
      ========================================================== */}
      <AnimatePresence>
        {doctorToDelete && (
          <motion.div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                <Trash2 className="h-5 w-5" />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Delete Doctor?
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Are you sure you want to remove{" "}
                <span className="font-semibold text-slate-700">
                  {doctorToDelete.name}
                </span>{" "}
                from the doctors list? This action cannot be undone.
              </p>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setDoctorToDelete(null)}
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDeleteDoctor}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 text-sm font-semibold text-white transition hover:bg-rose-700"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Doctor
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}