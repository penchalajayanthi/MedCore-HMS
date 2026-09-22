"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Clock3,
  Edit3,
  Eye,
  FileHeart,
  FileText,
  Filter,
  HeartPulse,
  History,
  Mail,
  MapPin,
  Pill,
  Plus,
  Search,
  Stethoscope,
  Trash2,
  UserRound,
  Users,
  Weight,
  X,
  Phone
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type RecordStatus = "Stable" | "Critical" | "Follow-up";

type EMRRecord = {
  id: number;
  patientId: string;
  patientName: string;
  age: string;
  gender: string;
  bloodGroup: string;
  phone: string;
  email: string;
  address: string;

  doctor: string;
  department: string;
  visitDate: string;
  nextVisit: string;

  diagnosis: string;
  symptoms: string;
  allergies: string;
  medicalHistory: string;

  bloodPressure: string;
  heartRate: string;
  temperature: string;
  oxygenLevel: string;
  weight: string;

  medications: string;
  labResults: string;
  clinicalNotes: string;

  status: RecordStatus;
};

type EMRFormData = {
  patientName: string;
  age: string;
  gender: string;
  bloodGroup: string;
  phone: string;
  email: string;
  address: string;

  doctor: string;
  department: string;
  visitDate: string;
  nextVisit: string;

  diagnosis: string;
  symptoms: string;
  allergies: string;
  medicalHistory: string;

  bloodPressure: string;
  heartRate: string;
  temperature: string;
  oxygenLevel: string;
  weight: string;

  medications: string;
  labResults: string;
  clinicalNotes: string;

  status: RecordStatus;
};

type FormErrors = Partial<Record<keyof EMRFormData, string>>;

/* -------------------------------------------------------------------------- */
/* Sample Data                                                                */
/* -------------------------------------------------------------------------- */

const initialRecords: EMRRecord[] = [
  {
    id: 1,
    patientId: "PT-1001",
    patientName: "Rahul Kumar",
    age: "42",
    gender: "Male",
    bloodGroup: "O+",
    phone: "9876543210",
    email: "rahul.kumar@email.com",
    address: "Nellore, Andhra Pradesh",

    doctor: "Dr. Ananya Reddy",
    department: "Cardiology",
    visitDate: "2026-09-22",
    nextVisit: "2026-10-06",

    diagnosis: "Hypertension",
    symptoms: "Chest discomfort, mild fatigue",
    allergies: "No known allergies",
    medicalHistory: "Hypertension for 3 years",

    bloodPressure: "138/88",
    heartRate: "78",
    temperature: "98.4",
    oxygenLevel: "98",
    weight: "72",

    medications: "Amlodipine 5mg - Once daily",
    labResults: "CBC normal. Lipid profile slightly elevated.",
    clinicalNotes:
      "Patient advised to maintain a low-sodium diet and monitor blood pressure regularly.",

    status: "Stable",
  },

  {
    id: 2,
    patientId: "PT-1002",
    patientName: "Priya Sharma",
    age: "29",
    gender: "Female",
    bloodGroup: "A+",
    phone: "9988776655",
    email: "priya.sharma@email.com",
    address: "Chennai, Tamil Nadu",

    doctor: "Dr. Rahul Sharma",
    department: "Neurology",
    visitDate: "2026-09-22",
    nextVisit: "2026-09-29",

    diagnosis: "Migraine",
    symptoms: "Severe headache, nausea",
    allergies: "Penicillin",
    medicalHistory: "Recurring migraine episodes",

    bloodPressure: "120/80",
    heartRate: "82",
    temperature: "98.1",
    oxygenLevel: "99",
    weight: "61",

    medications: "Sumatriptan 50mg - As needed",
    labResults: "Neurological examination normal.",
    clinicalNotes:
      "Patient advised to maintain regular sleep and hydration. Follow-up scheduled.",

    status: "Follow-up",
  },

  {
    id: 3,
    patientId: "PT-1003",
    patientName: "Arjun Reddy",
    age: "56",
    gender: "Male",
    bloodGroup: "B+",
    phone: "9123456789",
    email: "arjun.reddy@email.com",
    address: "Hyderabad, Telangana",

    doctor: "Dr. Karthik Rao",
    department: "Orthopedics",
    visitDate: "2026-09-21",
    nextVisit: "2026-10-12",

    diagnosis: "Knee Osteoarthritis",
    symptoms: "Knee pain, stiffness while walking",
    allergies: "No known allergies",
    medicalHistory: "Type 2 diabetes",

    bloodPressure: "130/84",
    heartRate: "76",
    temperature: "98.6",
    oxygenLevel: "97",
    weight: "81",

    medications: "Paracetamol 650mg - Twice daily",
    labResults: "X-ray shows moderate joint degeneration.",
    clinicalNotes:
      "Physiotherapy recommended. Patient advised to avoid excessive strain.",

    status: "Stable",
  },

  {
    id: 4,
    patientId: "PT-1004",
    patientName: "Meena Devi",
    age: "67",
    gender: "Female",
    bloodGroup: "AB+",
    phone: "9345678901",
    email: "meena.devi@email.com",
    address: "Bengaluru, Karnataka",

    doctor: "Dr. Sneha Kapoor",
    department: "Dermatology",
    visitDate: "2026-09-20",
    nextVisit: "2026-09-27",

    diagnosis: "Severe Skin Infection",
    symptoms: "Redness, swelling, skin irritation",
    allergies: "Sulfa drugs",
    medicalHistory: "Diabetes and hypertension",

    bloodPressure: "150/94",
    heartRate: "96",
    temperature: "100.2",
    oxygenLevel: "95",
    weight: "68",

    medications: "Antibiotic course prescribed",
    labResults: "Infection markers elevated.",
    clinicalNotes:
      "Close monitoring required. Patient instructed to return immediately if symptoms worsen.",

    status: "Critical",
  },

  {
    id: 5,
    patientId: "PT-1005",
    patientName: "Vikram Singh",
    age: "35",
    gender: "Male",
    bloodGroup: "O-",
    phone: "9456789012",
    email: "vikram.singh@email.com",
    address: "Vijayawada, Andhra Pradesh",

    doctor: "Dr. Arjun Verma",
    department: "General Medicine",
    visitDate: "2026-09-19",
    nextVisit: "2026-10-03",

    diagnosis: "Viral Fever",
    symptoms: "Fever, body pain, fatigue",
    allergies: "No known allergies",
    medicalHistory: "No significant history",

    bloodPressure: "118/78",
    heartRate: "88",
    temperature: "100.1",
    oxygenLevel: "98",
    weight: "74",

    medications: "Paracetamol 650mg - As needed",
    labResults: "CBC within normal limits.",
    clinicalNotes:
      "Rest and adequate hydration recommended. Review after one week.",

    status: "Follow-up",
  },
];

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const departments = [
  "All Departments",
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Dermatology",
  "General Medicine",
  "Pediatrics",
  "Gynecology",
  "ENT",
];

const emptyForm: EMRFormData = {
  patientName: "",
  age: "",
  gender: "",
  bloodGroup: "",
  phone: "",
  email: "",
  address: "",

  doctor: "",
  department: "",
  visitDate: new Date().toISOString().split("T")[0],
  nextVisit: "",

  diagnosis: "",
  symptoms: "",
  allergies: "",
  medicalHistory: "",

  bloodPressure: "",
  heartRate: "",
  temperature: "",
  oxygenLevel: "",
  weight: "",

  medications: "",
  labResults: "",
  clinicalNotes: "",

  status: "Stable",
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function getInitials(name: string) {
  return name
    .replace(/^Dr\.\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatDate(date: string) {
  if (!date) return "—";

  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: RecordStatus }) {
  const styles = {
    Stable: "border-emerald-200 bg-emerald-50 text-emerald-700",
    Critical: "border-rose-200 bg-rose-50 text-rose-700",
    "Follow-up": "border-amber-200 bg-amber-50 text-amber-700",
  };

  const icons = {
    Stable: CheckCircle2,
    Critical: AlertCircle,
    "Follow-up": Clock3,
  };

  const Icon = icons[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {status}
    </span>
  );
}

function PatientAvatar({ name }: { name: string }) {
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-sm font-bold text-cyan-700 ring-1 ring-cyan-100">
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
  icon: typeof Users;
  iconClass: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value.toLocaleString()}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconClass}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}

function FormSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof UserRound;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
            <Icon className="h-4.5 w-4.5" />
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900">{title}</h3>
            <p className="mt-0.5 text-xs text-slate-500">{description}</p>
          </div>
        </div>
      </div>

      <div className="p-5">{children}</div>
    </section>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  required,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  required?: boolean;
  maxLength?: number;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </label>

      <input
        type={type}
        value={value}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
          error
            ? "border-rose-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
            : "border-slate-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
        }`}
      />

      {error && (
        <p className="mt-1.5 text-xs font-medium text-rose-600">{error}</p>
      )}
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 pr-10 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
        >
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </label>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
      />
    </div>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <Icon className="h-3.5 w-3.5 text-cyan-600" />
        {label}
      </div>

      <p className="mt-1.5 break-words text-sm font-semibold text-slate-800">
        {value || "—"}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function EMRPage() {
  const [records, setRecords] = useState<EMRRecord[]>(initialRecords);

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [status, setStatus] = useState<"All" | RecordStatus>("All");

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState<number | null>(null);

  const [selectedRecord, setSelectedRecord] =
    useState<EMRRecord | null>(null);

  const [recordToDelete, setRecordToDelete] =
    useState<EMRRecord | null>(null);

  const [form, setForm] = useState<EMRFormData>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});

  /* ------------------------------------------------------------------------ */
  /* Filters                                                                  */
  /* ------------------------------------------------------------------------ */

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !query ||
        record.patientName.toLowerCase().includes(query) ||
        record.patientId.toLowerCase().includes(query) ||
        record.doctor.toLowerCase().includes(query) ||
        record.diagnosis.toLowerCase().includes(query);

      const matchesDepartment =
        department === "All Departments" ||
        record.department === department;

      const matchesStatus =
        status === "All" || record.status === status;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [records, search, department, status]);

  const totalRecords = records.length;

  const todayRecords = records.filter(
    (record) => record.visitDate === new Date().toISOString().split("T")[0],
  ).length;

  const criticalRecords = records.filter(
    (record) => record.status === "Critical",
  ).length;

  const followUpRecords = records.filter(
    (record) => record.status === "Follow-up",
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

  /* ------------------------------------------------------------------------ */
  /* Form Helpers                                                             */
  /* ------------------------------------------------------------------------ */

  function updateField<K extends keyof EMRFormData>(
    field: K,
    value: EMRFormData[K],
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((previous) => ({
        ...previous,
        [field]: undefined,
      }));
    }
  }

  function handlePatientNameChange(value: string) {
    updateField("patientName", value);
  }

  function handlePhoneChange(value: string) {
    const cleaned = value.replace(/\D/g, "").slice(0, 10);
    updateField("phone", cleaned);
  }

  function handleAgeChange(value: string) {
    const cleaned = value.replace(/\D/g, "").slice(0, 3);
    updateField("age", cleaned);
  }

  function handleVitalsChange(
    field:
      | "heartRate"
      | "temperature"
      | "oxygenLevel"
      | "weight",
    value: string,
  ) {
    const cleaned = value.replace(/[^0-9.]/g, "");
    updateField(field, cleaned);
  }

  function openAddRecord() {
    setEditingRecordId(null);

    setForm({
      ...emptyForm,
      visitDate: new Date().toISOString().split("T")[0],
    });

    setErrors({});
    setIsEditorOpen(true);
  }

  function openEditRecord(record: EMRRecord) {
    setEditingRecordId(record.id);

    setForm({
      patientName: record.patientName,
      age: record.age,
      gender: record.gender,
      bloodGroup: record.bloodGroup,
      phone: record.phone,
      email: record.email,
      address: record.address,

      doctor: record.doctor,
      department: record.department,
      visitDate: record.visitDate,
      nextVisit: record.nextVisit,

      diagnosis: record.diagnosis,
      symptoms: record.symptoms,
      allergies: record.allergies,
      medicalHistory: record.medicalHistory,

      bloodPressure: record.bloodPressure,
      heartRate: record.heartRate,
      temperature: record.temperature,
      oxygenLevel: record.oxygenLevel,
      weight: record.weight,

      medications: record.medications,
      labResults: record.labResults,
      clinicalNotes: record.clinicalNotes,

      status: record.status,
    });

    setErrors({});
    setSelectedRecord(null);
    setIsEditorOpen(true);
  }

  function closeEditor() {
    setIsEditorOpen(false);
    setEditingRecordId(null);
    setErrors({});
  }

  /* ------------------------------------------------------------------------ */
  /* Validation                                                               */
  /* ------------------------------------------------------------------------ */

  function validateForm() {
    const nextErrors: FormErrors = {};

    if (!form.patientName.trim()) {
      nextErrors.patientName = "Patient name is required.";
    }

    if (!form.age.trim()) {
      nextErrors.age = "Age is required.";
    }

    if (!form.phone.trim()) {
      nextErrors.phone = "Phone number is required.";
    } else if (form.phone.length !== 10) {
      nextErrors.phone = "Enter exactly 10 digits.";
    }

    if (form.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(form.email)) {
        nextErrors.email = "Enter a valid email address.";
      }
    }

    if (!form.doctor.trim()) {
      nextErrors.doctor = "Doctor name is required.";
    }

    if (!form.diagnosis.trim()) {
      nextErrors.diagnosis = "Diagnosis is required.";
    }

    if (!form.visitDate) {
      nextErrors.visitDate = "Visit date is required.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  /* ------------------------------------------------------------------------ */
  /* Submit                                                                   */
  /* ------------------------------------------------------------------------ */

  function handleSubmit() {
    if (!validateForm()) {
      toast.error("Please correct the highlighted fields.");
      return;
    }

    if (editingRecordId !== null) {
      setRecords((previous) =>
        previous.map((record) =>
          record.id === editingRecordId
            ? {
                ...record,
                ...form,
                patientName: form.patientName.trim(),
                doctor: form.doctor.trim(),
              }
            : record,
        ),
      );

      toast.success("EMR record updated successfully.");
    } else {
      const newRecord: EMRRecord = {
        id: Date.now(),
        patientId: `PT-${1000 + records.length + 1}`,

        ...form,

        patientName: form.patientName.trim(),
        doctor: form.doctor.trim(),
      };

      setRecords((previous) => [newRecord, ...previous]);

      toast.success("New EMR record created successfully.");
    }

    closeEditor();
  }

  /* ------------------------------------------------------------------------ */
  /* Delete                                                                   */
  /* ------------------------------------------------------------------------ */

  function handleDeleteRecord() {
    if (!recordToDelete) return;

    setRecords((previous) =>
      previous.filter((record) => record.id !== recordToDelete.id),
    );

    if (selectedRecord?.id === recordToDelete.id) {
      setSelectedRecord(null);
    }

    toast.success("EMR record deleted successfully.");

    setRecordToDelete(null);
  }

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <main className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-600 text-white shadow-sm">
                <FileHeart className="h-5 w-5" />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Electronic Medical Records
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Manage patient medical history, clinical records and visits.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={openAddRecord}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700 active:scale-[0.98]"
          >
            <Plus className="h-4.5 w-4.5" />
            New EMR Record
          </button>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Records"
            value={totalRecords}
            icon={FileText}
            iconClass="bg-cyan-50 text-cyan-700"
          />

          <StatCard
            title="Today's Visits"
            value={todayRecords}
            icon={CalendarDays}
            iconClass="bg-blue-50 text-blue-700"
          />

          <StatCard
            title="Critical Cases"
            value={criticalRecords}
            icon={AlertCircle}
            iconClass="bg-rose-50 text-rose-700"
          />

          <StatCard
            title="Follow-ups"
            value={followUpRecords}
            icon={History}
            iconClass="bg-amber-50 text-amber-700"
          />
        </div>

        {/* Search / Filters */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(280px,1fr)_220px_180px_auto]">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search patient, doctor, diagnosis..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              />
            </div>

            {/* Department */}
            <div className="relative">
              <Filter className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <select
                value={department}
                onChange={(event) => setDepartment(event.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-9 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              >
                {departments.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>

            {/* Status */}
            <div className="relative">
              <Activity className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as "All" | RecordStatus)
                }
                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-9 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              >
                <option value="All">All Status</option>
                <option value="Stable">Stable</option>
                <option value="Critical">Critical</option>
                <option value="Follow-up">Follow-up</option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>

            {/* Reset */}
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

          {/* Active filters */}
          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
              <span className="text-xs font-semibold text-slate-400">
                Active filters:
              </span>

              {search && (
                <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
                  Search: {search}
                </span>
              )}

              {department !== "All Departments" && (
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  {department}
                </span>
              )}

              {status !== "All" && (
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                  {status}
                </span>
              )}
            </div>
          )}
        </section>

        {/* Results */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Medical Records
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Showing {filteredRecords.length} of {records.length} records
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <ClipboardList className="h-4 w-4 text-cyan-600" />
              Patient clinical records
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden xl:block">
            {filteredRecords.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px]">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70 text-left">
                      <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Patient
                      </th>

                      <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Doctor / Department
                      </th>

                      <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Visit Date
                      </th>

                     
                      <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Status
                      </th>

                      <th className="px-5 py-3 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredRecords.map((record) => (
                      <motion.tr
                        key={record.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="transition hover:bg-slate-50/70"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <PatientAvatar name={record.patientName} />

                            <div>
                              <p className="font-semibold text-slate-900">
                                {record.patientName}
                              </p>

                              <p className="mt-0.5 text-xs text-slate-500">
                                {record.patientId} • {record.age} yrs •{" "}
                                {record.gender}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold text-slate-800">
                            {record.doctor}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {record.department}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-slate-700">
                            {formatDate(record.visitDate)}
                          </p>
                        </td>

                      


                        <td className="px-5 py-4">
                          <StatusBadge status={record.status} />
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedRecord(record)}
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                              title="View EMR"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => openEditRecord(record)}
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                              title="Edit EMR"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setRecordToDelete(record)}
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                              title="Delete EMR"
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
            ) : (
              <div className="p-12 text-center">
                <FileText className="mx-auto h-10 w-10 text-slate-300" />
                <h3 className="mt-4 font-bold text-slate-800">
                  No medical records found
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Try changing your search or filters.
                </p>
              </div>
            )}
          </div>

          {/* Mobile / Tablet Cards */}
          <div className="grid grid-cols-1 gap-4 p-4 xl:hidden">
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <PatientAvatar name={record.patientName} />

                      <div className="min-w-0">
                        <p className="truncate font-bold text-slate-900">
                          {record.patientName}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {record.patientId} • {record.age} yrs •{" "}
                          {record.gender}
                        </p>
                      </div>
                    </div>

                    <StatusBadge status={record.status} />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <DetailItem
                      icon={Stethoscope}
                      label="Doctor"
                      value={record.doctor}
                    />

                    <DetailItem
                      icon={Activity}
                      label="Department"
                      value={record.department}
                    />

                    <DetailItem
                      icon={CalendarDays}
                      label="Visit"
                      value={formatDate(record.visitDate)}
                    />

                    <DetailItem
                      icon={FileHeart}
                      label="Diagnosis"
                      value={record.diagnosis}
                    />

                    <DetailItem
                      icon={HeartPulse}
                      label="Blood Pressure"
                      value={record.bloodPressure}
                    />

                    <DetailItem
                      icon={Activity}
                      label="Heart Rate"
                      value={`${record.heartRate} bpm`}
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                    <button
                      type="button"
                      onClick={() => setSelectedRecord(record)}
                      className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() => openEditRecord(record)}
                      className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => setRecordToDelete(record)}
                      className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-8 text-center">
                <FileText className="mx-auto h-10 w-10 text-slate-300" />

                <h3 className="mt-4 font-bold text-slate-800">
                  No medical records found
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Try changing your search or filters.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ================================================================== */}
      {/* EMR EDITOR                                                         */}
      {/* ================================================================== */}

      <AnimatePresence>
        {isEditorOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-[100] overflow-y-auto bg-slate-50"
          >
            {/* Editor Header */}
            <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
              <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={closeEditor}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                  >
                    <ArrowLeft className="h-4.5 w-4.5" />
                  </button>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                      {editingRecordId ? "Edit EMR Record" : "New EMR Record"}
                    </h2>

                    <p className="text-xs text-slate-500">
                      Enter patient clinical and medical information
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeEditor}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Editor Body */}
            <div className="mx-auto grid max-w-[1600px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[290px_minmax(0,1fr)] lg:px-8">
              {/* Preview */}
              <aside className="lg:sticky lg:top-24 lg:h-fit">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-cyan-50 text-xl font-bold text-cyan-700 ring-8 ring-cyan-50/70">
                      {form.patientName
                        ? getInitials(form.patientName)
                        : "PT"}
                    </div>

                    <h3 className="mt-5 text-lg font-bold text-slate-900">
                      {form.patientName || "Patient Name"}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {form.age
                        ? `${form.age} years`
                        : "Age"}{" "}
                      • {form.gender}
                    </p>

                    <div className="mt-4">
                      <StatusBadge status={form.status} />
                    </div>
                  </div>

                  <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
                    <DetailItem
                      icon={Stethoscope}
                      label="Doctor"
                      value={form.doctor}
                    />

                    <DetailItem
                      icon={Activity}
                      label="Department"
                      value={form.department}
                    />

                    <DetailItem
                      icon={CalendarDays}
                      label="Visit Date"
                      value={formatDate(form.visitDate)}
                    />

                    <DetailItem
                      icon={FileHeart}
                      label="Diagnosis"
                      value={form.diagnosis}
                    />
                  </div>
                </div>
              </aside>

              {/* Form */}
              <div className="space-y-6 pb-28">
                {/* Patient Information */}
                <FormSection
                  icon={UserRound}
                  title="Patient Information"
                  description="Basic patient identity and contact details."
                >
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    <InputField
                      label="Patient Name"
                      value={form.patientName}
                      onChange={handlePatientNameChange}
                      placeholder="Enter patient name"
                      error={errors.patientName}
                      required
                    />

                    <InputField
                      label="Age"
                      value={form.age}
                      onChange={handleAgeChange}
                      placeholder="42"
                      error={errors.age}
                      required
                      maxLength={3}
                    />

                    <SelectField
                      label="Gender"
                      value={form.gender}
                      onChange={(value) => updateField("gender", value)}
                      options={["Male", "Female", "Other"]}
                      required
                    />

                    <SelectField
                      label="Blood Group"
                      value={form.bloodGroup}
                      onChange={(value) =>
                        updateField("bloodGroup", value)
                      }
                      options={[
                        "A+",
                        "A-",
                        "B+",
                        "B-",
                        "AB+",
                        "AB-",
                        "O+",
                        "O-",
                      ]}
                    />

                    <InputField
                      label="Phone"
                      value={form.phone}
                      onChange={handlePhoneChange}
                      placeholder="9876543210"
                      error={errors.phone}
                      required
                      maxLength={10}
                    />

                    <InputField
                      label="Email"
                      value={form.email}
                      onChange={(value) => updateField("email", value)}
                      placeholder="patient@email.com"
                      type="email"
                      error={errors.email}
                    />

                    <div className="md:col-span-2 xl:col-span-3">
                      <TextAreaField
                        label="Address"
                        value={form.address}
                        onChange={(value) =>
                          updateField("address", value)
                        }
                        placeholder="Enter complete patient address"
                        rows={3}
                      />
                    </div>
                  </div>
                </FormSection>

                {/* Visit Information */}
                <FormSection
                  icon={CalendarDays}
                  title="Visit Information"
                  description="Doctor, department and appointment details."
                >
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                    <InputField
                      label="Doctor"
                      value={form.doctor}
                      onChange={(value) => updateField("doctor", value)}
                      placeholder="Dr. Ananya Reddy"
                      error={errors.doctor}
                      required
                    />

                    <SelectField
                      label="Department"
                      value={form.department}
                      onChange={(value) =>
                        updateField("department", value)
                      }
                      options={departments.filter(
                        (item) => item !== "All Departments",
                      )}
                      required
                    />

                    <InputField
                      label="Visit Date"
                      value={form.visitDate}
                      onChange={(value) =>
                        updateField("visitDate", value)
                      }
                      type="date"
                      error={errors.visitDate}
                      required
                    />

                    <InputField
                      label="Next Visit"
                      value={form.nextVisit}
                      onChange={(value) =>
                        updateField("nextVisit", value)
                      }
                      type="date"
                    />
                  </div>
                </FormSection>

                {/* Clinical Information */}
                <FormSection
                  icon={Stethoscope}
                  title="Clinical Information"
                  description="Symptoms, diagnosis, allergies and medical history."
                >
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <TextAreaField
                      label="Symptoms / Chief Complaint"
                      value={form.symptoms}
                      onChange={(value) =>
                        updateField("symptoms", value)
                      }
                      placeholder="Describe patient's symptoms..."
                      required
                    />

                    <TextAreaField
                      label="Diagnosis"
                      value={form.diagnosis}
                      onChange={(value) =>
                        updateField("diagnosis", value)
                      }
                      placeholder="Enter diagnosis..."
                      required
                    />

                    <TextAreaField
                      label="Allergies"
                      value={form.allergies}
                      onChange={(value) =>
                        updateField("allergies", value)
                      }
                      placeholder="List allergies..."
                    />

                    <TextAreaField
                      label="Medical History"
                      value={form.medicalHistory}
                      onChange={(value) =>
                        updateField("medicalHistory", value)
                      }
                      placeholder="Previous conditions, surgeries, etc..."
                    />
                  </div>
                </FormSection>

                {/* Vitals */}
                <FormSection
                  icon={HeartPulse}
                  title="Vital Signs"
                  description="Record patient's vital measurements."
                >
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
                    <InputField
                      label="Blood Pressure"
                      value={form.bloodPressure}
                      onChange={(value) =>
                        updateField("bloodPressure", value)
                      }
                      placeholder="120/80"
                    />

                    <InputField
                      label="Heart Rate"
                      value={form.heartRate}
                      onChange={(value) =>
                        handleVitalsChange("heartRate", value)
                      }
                      placeholder="78"
                    />

                    <InputField
                      label="Temperature"
                      value={form.temperature}
                      onChange={(value) =>
                        handleVitalsChange("temperature", value)
                      }
                      placeholder="98.6"
                    />

                    <InputField
                      label="Oxygen Level"
                      value={form.oxygenLevel}
                      onChange={(value) =>
                        handleVitalsChange("oxygenLevel", value)
                      }
                      placeholder="98"
                    />

                    <InputField
                      label="Weight"
                      value={form.weight}
                      onChange={(value) =>
                        handleVitalsChange("weight", value)
                      }
                      placeholder="72"
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700">
                      <HeartPulse className="h-3.5 w-3.5" />
                      Blood Pressure
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700">
                      <Activity className="h-3.5 w-3.5" />
                      Heart Rate
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                      <Weight className="h-3.5 w-3.5" />
                      Weight
                    </span>
                  </div>
                </FormSection>

                {/* Treatment */}
                <FormSection
                  icon={Pill}
                  title="Treatment & Medication"
                  description="Prescriptions, lab results and clinical notes."
                >
                  <div className="grid grid-cols-1 gap-5">
                    <TextAreaField
                      label="Current Medications"
                      value={form.medications}
                      onChange={(value) =>
                        updateField("medications", value)
                      }
                      placeholder="Medicine name, dosage and frequency..."
                      rows={4}
                    />

                    <TextAreaField
                      label="Lab Results"
                      value={form.labResults}
                      onChange={(value) =>
                        updateField("labResults", value)
                      }
                      placeholder="Enter laboratory investigation results..."
                      rows={4}
                    />

                    <TextAreaField
                      label="Clinical Notes"
                      value={form.clinicalNotes}
                      onChange={(value) =>
                        updateField("clinicalNotes", value)
                      }
                      placeholder="Doctor's clinical observations and instructions..."
                      rows={5}
                    />
                  </div>
                </FormSection>

                {/* Status */}
                <FormSection
                  icon={ClipboardList}
                  title="Record Status"
                  description="Set the current clinical status of this record."
                >
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <SelectField
                      label="Status"
                      value={form.status}
                      onChange={(value) =>
                        updateField(
                          "status",
                          value as RecordStatus,
                        )
                      }
                      options={[
                        "Stable",
                        "Critical",
                        "Follow-up",
                      ]}
                    />

                    <div className="flex items-end">
                      <div className="rounded-xl border border-cyan-100 bg-cyan-50 p-3 text-xs leading-5 text-cyan-800">
                        <strong>EMR Tip:</strong> Keep diagnosis,
                        medications and clinical notes updated after every
                        patient visit.
                      </div>
                    </div>
                  </div>
                </FormSection>
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur">
              <div className="mx-auto flex max-w-[1600px] items-center justify-end gap-3 px-4 py-4 sm:px-6 lg:px-8">
                <button
                  type="button"
                  onClick={closeEditor}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 active:scale-[0.98]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-cyan-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700 active:scale-[0.98]"
                >
                  <Check className="h-4.5 w-4.5" />

                  {editingRecordId
                    ? "Save Changes"
                    : "Create EMR Record"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================================================================== */}
      {/* VIEW EMR                                                            */}
      {/* ================================================================== */}

      <AnimatePresence>
        {selectedRecord && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setSelectedRecord(null);
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl"
            >
              {/* View Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
                    <FileHeart className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      Medical Record
                    </h2>

                    <p className="text-xs text-slate-500">
                      {selectedRecord.patientId}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedRecord(null)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6 p-5 sm:p-6">
                {/* Patient profile */}
                <div className="rounded-2xl border border-cyan-100 bg-cyan-50/60 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <PatientAvatar name={selectedRecord.patientName} />

                      <div>
                        <h3 className="text-xl font-bold text-slate-900">
                          {selectedRecord.patientName}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {selectedRecord.age} years •{" "}
                          {selectedRecord.gender} • Blood Group{" "}
                          {selectedRecord.bloodGroup}
                        </p>
                      </div>
                    </div>

                    <StatusBadge status={selectedRecord.status} />
                  </div>
                </div>

                {/* Basic details */}
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
                    <UserRound className="h-4 w-4 text-cyan-600" />
                    Patient Details
                  </h3>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <DetailItem
                      icon={Phone}
                      label="Phone"
                      value={selectedRecord.phone}
                    />

                    <DetailItem
                      icon={Mail}
                      label="Email"
                      value={selectedRecord.email}
                    />

                    <DetailItem
                      icon={MapPin}
                      label="Address"
                      value={selectedRecord.address}
                    />

                    <DetailItem
                      icon={CalendarDays}
                      label="Visit Date"
                      value={formatDate(selectedRecord.visitDate)}
                    />
                  </div>
                </div>

                {/* Vitals */}
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
                    <HeartPulse className="h-4 w-4 text-cyan-600" />
                    Vital Signs
                  </h3>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    <div className="rounded-xl border border-rose-100 bg-rose-50 p-4">
                      <p className="text-xs font-medium text-rose-600">
                        Blood Pressure
                      </p>
                      <p className="mt-1 text-lg font-bold text-rose-800">
                        {selectedRecord.bloodPressure}
                      </p>
                    </div>

                    <div className="rounded-xl border border-cyan-100 bg-cyan-50 p-4">
                      <p className="text-xs font-medium text-cyan-600">
                        Heart Rate
                      </p>
                      <p className="mt-1 text-lg font-bold text-cyan-800">
                        {selectedRecord.heartRate} bpm
                      </p>
                    </div>

                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                      <p className="text-xs font-medium text-blue-600">
                        Temperature
                      </p>
                      <p className="mt-1 text-lg font-bold text-blue-800">
                        {selectedRecord.temperature}°F
                      </p>
                    </div>

                    <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                      <p className="text-xs font-medium text-emerald-600">
                        Oxygen
                      </p>
                      <p className="mt-1 text-lg font-bold text-emerald-800">
                        {selectedRecord.oxygenLevel}%
                      </p>
                    </div>

                    <div className="rounded-xl border border-violet-100 bg-violet-50 p-4">
                      <p className="text-xs font-medium text-violet-600">
                        Weight
                      </p>
                      <p className="mt-1 text-lg font-bold text-violet-800">
                        {selectedRecord.weight} kg
                      </p>
                    </div>
                  </div>
                </div>

                {/* Clinical information */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 p-5">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                      <Stethoscope className="h-4 w-4 text-cyan-600" />
                      Diagnosis & Symptoms
                    </h3>

                    <div className="mt-4 space-y-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Diagnosis
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          {selectedRecord.diagnosis}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Symptoms
                        </p>

                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          {selectedRecord.symptoms || "No symptoms recorded."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-5">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                      <AlertCircle className="h-4 w-4 text-cyan-600" />
                      Allergies & Medical History
                    </h3>

                    <div className="mt-4 space-y-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Allergies
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          {selectedRecord.allergies || "None recorded."}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Medical History
                        </p>

                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          {selectedRecord.medicalHistory ||
                            "No medical history recorded."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medication */}
                <div className="rounded-2xl border border-slate-200 p-5">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    <Pill className="h-4 w-4 text-cyan-600" />
                    Current Medications
                  </h3>

                  <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                    {selectedRecord.medications ||
                      "No medications recorded."}
                  </p>
                </div>

                {/* Lab */}
                <div className="rounded-2xl border border-slate-200 p-5">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    <ClipboardList className="h-4 w-4 text-cyan-600" />
                    Laboratory Results
                  </h3>

                  <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                    {selectedRecord.labResults ||
                      "No laboratory results recorded."}
                  </p>
                </div>

                {/* Notes */}
                <div className="rounded-2xl border border-slate-200 p-5">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    <FileText className="h-4 w-4 text-cyan-600" />
                    Clinical Notes
                  </h3>

                  <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                    {selectedRecord.clinicalNotes ||
                      "No clinical notes recorded."}
                  </p>
                </div>

                {/* Footer actions */}
                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedRecord(null)}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 active:scale-[0.98]"
                  >
                    Close
                  </button>

                  <button
                    type="button"
                    onClick={() => openEditRecord(selectedRecord)}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700 active:scale-[0.98]"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit Medical Record
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================================================================== */}
      {/* DELETE CONFIRMATION                                                 */}
      {/* ================================================================== */}

      <AnimatePresence>
        {recordToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                <Trash2 className="h-5 w-5" />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Delete medical record?
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                This will remove the EMR record for{" "}
                <span className="font-semibold text-slate-700">
                  {recordToDelete.patientName}
                </span>
                . This action cannot be undone.
              </p>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setRecordToDelete(null)}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 active:scale-[0.98]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDeleteRecord}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 active:scale-[0.98]"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Record
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
} 