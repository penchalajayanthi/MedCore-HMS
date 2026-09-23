"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
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
  Loader2,
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
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
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

type Doctor = {
  id: string;
  name: string;
  department: string;
};

/* -------------------------------------------------------------------------- */
/* CONSTANTS                                                                  */
/* -------------------------------------------------------------------------- */

const doctors: Doctor[] = [
  {
    id: "DOC001",
    name: "Dr. Ananya Reddy",
    department: "Cardiology",
  },
  {
    id: "DOC002",
    name: "Dr. Rahul Verma",
    department: "Neurology",
  },
  {
    id: "DOC003",
    name: "Dr. Priya Sharma",
    department: "General Medicine",
  },
  {
    id: "DOC004",
    name: "Dr. Arjun Reddy",
    department: "Orthopedics",
  },
  {
    id: "DOC005",
    name: "Dr. Meera Nair",
    department: "Dermatology",
  },
  {
    id: "DOC006",
    name: "Dr. Karthik Rao",
    department: "Pediatrics",
  },
  {
    id: "DOC007",
    name: "Dr. Sneha Kapoor",
    department: "Gynecology",
  },
  {
    id: "DOC008",
    name: "Dr. Vikram Singh",
    department: "ENT",
  },
];

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

const today = new Date().toISOString().split("T")[0];

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
  visitDate: today,
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
/* SAMPLE DATA                                                                */
/* -------------------------------------------------------------------------- */

const initialRecords: EMRRecord[] = [
  {
    id: 1,
    patientId: "PAT001",
    patientName: "Rahul Kumar",
    age: "42",
    gender: "Male",
    bloodGroup: "O+",
    phone: "+91 98765 43210",
    email: "rahul.kumar@example.com",
    address: "Nellore, Andhra Pradesh",

    doctor: "Dr. Ananya Reddy",
    department: "Cardiology",
    visitDate: today,
    nextVisit: "2026-10-10",

    diagnosis: "Hypertension",
    symptoms: "Headache, mild dizziness",
    allergies: "No known allergies",
    medicalHistory: "Hypertension for 3 years",

    bloodPressure: "142/92",
    heartRate: "82 bpm",
    temperature: "98.4 °F",
    oxygenLevel: "98%",
    weight: "74 kg",

    medications: "Amlodipine 5mg once daily",
    labResults: "CBC normal. Lipid profile slightly elevated.",
    clinicalNotes:
      "Patient advised to monitor blood pressure regularly and maintain a low-sodium diet.",

    status: "Follow-up",
  },
  {
    id: 2,
    patientId: "PAT002",
    patientName: "Priya Sharma",
    age: "35",
    gender: "Female",
    bloodGroup: "A+",
    phone: "+91 99887 66554",
    email: "priya.sharma@example.com",
    address: "Chennai, Tamil Nadu",

    doctor: "Dr. Rahul Verma",
    department: "Neurology",
    visitDate: today,
    nextVisit: "2026-10-05",

    diagnosis: "Migraine",
    symptoms: "Severe headache, nausea",
    allergies: "Penicillin",
    medicalHistory: "Recurring migraine episodes",

    bloodPressure: "118/76",
    heartRate: "76 bpm",
    temperature: "98.1 °F",
    oxygenLevel: "99%",
    weight: "61 kg",

    medications: "Sumatriptan 50mg as needed",
    labResults: "MRI brain: No acute abnormality.",
    clinicalNotes:
      "Avoid known migraine triggers. Maintain regular sleep and hydration.",

    status: "Stable",
  },
  {
    id: 3,
    patientId: "PAT003",
    patientName: "Arjun Reddy",
    age: "29",
    gender: "Male",
    bloodGroup: "B+",
    phone: "+91 91234 56789",
    email: "arjun.reddy@example.com",
    address: "Vijayawada, Andhra Pradesh",

    doctor: "Dr. Arjun Reddy",
    department: "Orthopedics",
    visitDate: today,
    nextVisit: "2026-09-30",

    diagnosis: "Knee ligament injury",
    symptoms: "Knee pain and swelling",
    allergies: "",
    medicalHistory: "Previous sports injury",

    bloodPressure: "120/80",
    heartRate: "72 bpm",
    temperature: "98.6 °F",
    oxygenLevel: "98%",
    weight: "79 kg",

    medications: "Ibuprofen 400mg after meals",
    labResults: "X-ray: No fracture detected.",
    clinicalNotes:
      "Recommended physiotherapy and limited weight-bearing activity.",

    status: "Follow-up",
  },
  {
    id: 4,
    patientId: "PAT004",
    patientName: "Meena Devi",
    age: "58",
    gender: "Female",
    bloodGroup: "AB+",
    phone: "+91 93456 78901",
    email: "meena.devi@example.com",
    address: "Tirupati, Andhra Pradesh",

    doctor: "Dr. Priya Sharma",
    department: "General Medicine",
    visitDate: today,
    nextVisit: "",

    diagnosis: "Type 2 Diabetes",
    symptoms: "Fatigue, increased thirst",
    allergies: "No known allergies",
    medicalHistory: "Diabetes for 8 years",

    bloodPressure: "136/84",
    heartRate: "79 bpm",
    temperature: "98.2 °F",
    oxygenLevel: "97%",
    weight: "68 kg",

    medications: "Metformin 500mg twice daily",
    labResults: "HbA1c: 7.8%",
    clinicalNotes:
      "Dietary counseling provided. Continue glucose monitoring.",

    status: "Critical",
  },
  {
    id: 5,
    patientId: "PAT005",
    patientName: "Vikram Singh",
    age: "47",
    gender: "Male",
    bloodGroup: "O-",
    phone: "+91 90123 45678",
    email: "vikram.singh@example.com",
    address: "Hyderabad, Telangana",

    doctor: "Dr. Meera Nair",
    department: "Dermatology",
    visitDate: "2026-09-20",
    nextVisit: "2026-10-20",

    diagnosis: "Atopic dermatitis",
    symptoms: "Skin irritation and itching",
    allergies: "",
    medicalHistory: "Seasonal skin allergies",

    bloodPressure: "122/80",
    heartRate: "74 bpm",
    temperature: "98.5 °F",
    oxygenLevel: "99%",
    weight: "72 kg",

    medications: "Topical corticosteroid cream",
    labResults: "",
    clinicalNotes:
      "Continue topical treatment and avoid identified irritants.",

    status: "Stable",
  },
];

/* -------------------------------------------------------------------------- */
/* SMALL COMPONENTS                                                           */
/* -------------------------------------------------------------------------- */

function StatusBadge({ status }: { status: RecordStatus }) {
  const styles: Record<RecordStatus, string> = {
    Stable: "border-emerald-200 bg-emerald-50 text-emerald-700",
    Critical: "border-rose-200 bg-rose-50 text-rose-700",
    "Follow-up": "border-amber-200 bg-amber-50 text-amber-700",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function PatientAvatar({
  name,
  large = false,
}: {
  name: string;
  large?: boolean;
}) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-2xl bg-cyan-50 font-bold text-cyan-700 ${
        large ? "h-20 w-20 text-xl" : "h-11 w-11 text-sm"
      }`}
    >
      {initials}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  iconClass,
}: {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-500 sm:text-sm">
            {title}
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function FormSection({
  title,
  description,
  icon,
  children,
  accent,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
  accent:
    | "cyan"
    | "blue"
    | "violet"
    | "emerald"
    | "amber"
    | "rose";
}) {
  const accentStyles = {
    cyan: {
      wrapper: "border-cyan-200",
      top: "bg-cyan-500",
      icon: "bg-cyan-50 text-cyan-700",
    },
    blue: {
      wrapper: "border-blue-200",
      top: "bg-blue-500",
      icon: "bg-blue-50 text-blue-700",
    },
    violet: {
      wrapper: "border-violet-200",
      top: "bg-violet-500",
      icon: "bg-violet-50 text-violet-700",
    },
    emerald: {
      wrapper: "border-emerald-200",
      top: "bg-emerald-500",
      icon: "bg-emerald-50 text-emerald-700",
    },
    amber: {
      wrapper: "border-amber-200",
      top: "bg-amber-500",
      icon: "bg-amber-50 text-amber-700",
    },
    rose: {
      wrapper: "border-rose-200",
      top: "bg-rose-500",
      icon: "bg-rose-50 text-rose-700",
    },
  }[accent];

  return (
    <section
      className={`relative overflow-hidden rounded-2xl border bg-white p-4 shadow-sm sm:p-5 lg:p-6 ${accentStyles.wrapper}`}
    >
      <div
        className={`absolute left-0 top-0 h-1 w-full ${accentStyles.top}`}
      />

      <div className="mb-5 flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accentStyles.icon}`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <h2 className="text-base font-bold text-slate-900 sm:text-lg">
            {title}
          </h2>
          <p className="mt-0.5 text-xs leading-5 text-slate-500 sm:text-sm">
            {description}
          </p>
        </div>
      </div>

      {children}
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
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
          error
            ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
            : "border-slate-200 focus:border-cyan-500 focus:ring-cyan-100"
        }`}
      />

      {error && (
        <p className="flex items-center gap-1 text-xs font-medium text-rose-600">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  error,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  error?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`h-11 w-full appearance-none rounded-xl border bg-white px-3.5 pr-10 text-sm text-slate-800 outline-none transition focus:ring-4 ${
            error
              ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
              : "border-slate-200 focus:border-cyan-500 focus:ring-cyan-100"
          }`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>

      {error && (
        <p className="flex items-center gap-1 text-xs font-medium text-rose-600">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`w-full resize-y rounded-xl border bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
          error
            ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
            : "border-slate-200 focus:border-cyan-500 focus:ring-cyan-100"
        }`}
      />

      {error && (
        <p className="flex items-center gap-1 text-xs font-medium text-rose-600">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon?: ReactNode;
  label: string;
  value?: string;
}) {
  if (!value?.trim()) return null;

  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {icon}
        {label}
      </div>
      <p className="mt-1.5 break-words text-sm font-medium leading-5 text-slate-800">
        {value}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* MAIN PAGE                                                                  */
/* -------------------------------------------------------------------------- */

export default function EMRPage() {
  const [records, setRecords] = useState<EMRRecord[]>(initialRecords);

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [status, setStatus] = useState<"All" | RecordStatus>("All");

  const [editorOpen, setEditorOpen] = useState(false);
  const [viewRecord, setViewRecord] = useState<EMRRecord | null>(null);
  const [deleteRecord, setDeleteRecord] = useState<EMRRecord | null>(null);
  const [editingRecord, setEditingRecord] = useState<EMRRecord | null>(null);

  const [form, setForm] = useState<EMRFormData>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  const savingRef = useRef(false);

  /* ------------------------------------------------------------------------ */
  /* FILTERS                                                                  */
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
  /* STATS                                                                     */
  /* ------------------------------------------------------------------------ */

  const totalRecords = records.length;

  const todayVisits = records.filter(
    (record) => record.visitDate === today,
  ).length;

  const criticalCases = records.filter(
    (record) => record.status === "Critical",
  ).length;

  const followUps = records.filter(
    (record) => record.status === "Follow-up",
  ).length;

  /* ------------------------------------------------------------------------ */
  /* FORM                                                                      */
  /* ------------------------------------------------------------------------ */

  function updateField<K extends keyof EMRFormData>(
    field: K,
    value: EMRFormData[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => {
      if (!current[field]) return current;

      const updated = { ...current };
      delete updated[field];
      return updated;
    });
  }

  function handleDoctorChange(doctorName: string) {
    updateField("doctor", doctorName);

    const selectedDoctor = doctors.find(
      (doctor) => doctor.name === doctorName,
    );

    if (selectedDoctor) {
      updateField("department", selectedDoctor.department);
    } else {
      updateField("department", "");
    }
  }

  function openCreateEMR() {
    if (savingRef.current) return;

    setEditingRecord(null);
    setForm({
      ...emptyForm,
      visitDate: new Date().toISOString().split("T")[0],
    });
    setErrors({});
    setEditorOpen(true);
  }

  function openEditEMR(record: EMRRecord) {
    setEditingRecord(record);

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
    setEditorOpen(true);
  }

  function closeEditor() {
    if (savingRef.current) return;

    setEditorOpen(false);
    setEditingRecord(null);
    setErrors({});
  }

  /* ------------------------------------------------------------------------ */
  /* REQUIRED FIELD STATUS                                                     */
  /* ------------------------------------------------------------------------ */

  const requiredFieldsComplete = useMemo(() => {
    const phoneDigits = form.phone.replace(/\D/g, "");

    const validPhone =
      phoneDigits.length === 10 ||
      (phoneDigits.length === 12 && phoneDigits.startsWith("91"));

    const validAge =
      form.age.trim() !== "" &&
      Number(form.age) > 0 &&
      Number(form.age) <= 120;

    return Boolean(
      form.patientName.trim() &&
        validAge &&
        validPhone &&
        form.doctor.trim() &&
        form.department.trim() &&
        form.visitDate.trim() &&
        form.diagnosis.trim(),
    );
  }, [form]);

  /* ------------------------------------------------------------------------ */
  /* VALIDATION                                                                */
  /* ------------------------------------------------------------------------ */

  function validateForm(values: EMRFormData): FormErrors {
    const nextErrors: FormErrors = {};

    if (!values.patientName.trim()) {
      nextErrors.patientName = "Patient name is required.";
    }

    if (!values.age.trim()) {
      nextErrors.age = "Age is required.";
    } else if (
      Number.isNaN(Number(values.age)) ||
      Number(values.age) <= 0 ||
      Number(values.age) > 120
    ) {
      nextErrors.age = "Enter a valid age.";
    }

    const phoneDigits = values.phone.replace(/\D/g, "");

    if (!values.phone.trim()) {
      nextErrors.phone = "Phone number is required.";
    } else if (
      phoneDigits.length !== 10 &&
      !(phoneDigits.length === 12 && phoneDigits.startsWith("91"))
    ) {
      nextErrors.phone = "Enter a valid 10-digit mobile number.";
    }

    if (values.email.trim()) {
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        values.email.trim(),
      );

      if (!emailValid) {
        nextErrors.email = "Enter a valid email address.";
      }
    }

    if (!values.doctor.trim()) {
      nextErrors.doctor = "Please select a doctor.";
    }

    if (!values.department.trim()) {
      nextErrors.department = "Department is required.";
    }

    if (!values.visitDate.trim()) {
      nextErrors.visitDate = "Visit date is required.";
    }

    if (!values.diagnosis.trim()) {
      nextErrors.diagnosis = "Diagnosis is required.";
    }

    return nextErrors;
  }

  /* ------------------------------------------------------------------------ */
  /* SAVE                                                                      */
  /* ------------------------------------------------------------------------ */

  function handleSubmit() {
    if (savingRef.current) return;

    const validationErrors = validateForm(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      toast.error("Please complete the required fields.");

      return;
    }

    savingRef.current = true;
    setIsSaving(true);

    const nextId = editingRecord
      ? editingRecord.id
      : records.length > 0
        ? Math.max(...records.map((record) => record.id)) + 1
        : 1;

    const patientId = editingRecord?.patientId ?? `PAT${String(nextId).padStart(3, "0")}`;

    const newRecord: EMRRecord = {
      id: nextId,
      patientId,

      patientName: form.patientName.trim(),
      age: form.age.trim(),
      gender: form.gender.trim(),
      bloodGroup: form.bloodGroup.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),

      doctor: form.doctor.trim(),
      department: form.department.trim(),
      visitDate: form.visitDate,
      nextVisit: form.nextVisit,

      diagnosis: form.diagnosis.trim(),
      symptoms: form.symptoms.trim(),
      allergies: form.allergies.trim(),
      medicalHistory: form.medicalHistory.trim(),

      bloodPressure: form.bloodPressure.trim(),
      heartRate: form.heartRate.trim(),
      temperature: form.temperature.trim(),
      oxygenLevel: form.oxygenLevel.trim(),
      weight: form.weight.trim(),

      medications: form.medications.trim(),
      labResults: form.labResults.trim(),
      clinicalNotes: form.clinicalNotes.trim(),

      status: form.status,
    };

    if (editingRecord) {
      setRecords((current) =>
        current.map((record) =>
          record.id === editingRecord.id ? newRecord : record,
        ),
      );

      toast.success("EMR updated successfully.");
    } else {
      setRecords((current) => [newRecord, ...current]);

      toast.success("EMR created successfully.");
    }

    setEditorOpen(false);
    setEditingRecord(null);
    setForm(emptyForm);
    setErrors({});

    savingRef.current = false;
    setIsSaving(false);
  }

  /* ------------------------------------------------------------------------ */
  /* DELETE                                                                    */
  /* ------------------------------------------------------------------------ */

  function confirmDelete() {
    if (!deleteRecord) return;

    setRecords((current) =>
      current.filter((record) => record.id !== deleteRecord.id),
    );

    toast.success("EMR record deleted successfully.");

    if (viewRecord?.id === deleteRecord.id) {
      setViewRecord(null);
    }

    setDeleteRecord(null);
  }

  /* ------------------------------------------------------------------------ */
  /* EDITOR                                                                    */
  /* ------------------------------------------------------------------------ */

  if (editorOpen) {
    const submitDisabled = !requiredFieldsComplete || isSaving;

    return (
      <div className="fixed inset-0 z-50 flex min-h-screen flex-col bg-white">
        {/* HEADER */}
        <header className="shrink-0 border-b border-cyan-700/30 bg-gradient-to-r from-cyan-700 via-cyan-600 to-sky-600 text-white shadow-lg">
          <div className="mx-auto flex min-h-[76px] w-full max-w-[1500px] items-center gap-3 px-3 sm:px-5 lg:px-8">
            <button
              type="button"
              onClick={closeEditor}
              disabled={isSaving}
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-white/20 bg-white/10 transition hover:bg-white/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 sm:flex">
              <FileHeart className="h-6 w-6" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-lg font-bold sm:text-xl">
                  {editingRecord ? "Edit Medical Record" : "Create New EMR"}
                </h1>

                <span className="rounded-full border border-white/20 bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide sm:text-xs">
                  {editingRecord ? "Edit Mode" : "New Record"}
                </span>
              </div>

              <p className="mt-0.5 text-xs text-cyan-50 sm:text-sm">
                {editingRecord
                  ? "Update the patient's electronic medical record."
                  : "Create a complete electronic medical record for the patient."}
              </p>
            </div>

            <div className="hidden items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-medium sm:flex">
              <HeartPulse className="h-4 w-4" />
              MedCore HMS
            </div>
          </div>
        </header>

        {/* BODY */}
        <div className="min-h-0 flex-1 overflow-y-auto bg-gradient-to-b from-slate-50 to-white">
          <div className="mx-auto grid w-full max-w-[1500px] gap-4 p-3 sm:gap-5 sm:p-5 md:p-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-6 lg:p-8">
            {/* LEFT PREVIEW */}
            <aside className="h-fit w-full lg:sticky lg:top-6">
              <div className="rounded-2xl border border-cyan-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-cyan-700">
                  <Eye className="h-4 w-4" />
                  Live Preview
                </div>

                <div className="mt-4 flex items-center gap-4 text-left sm:flex-col sm:text-center">
                  <PatientAvatar
                    name={form.patientName || "New Patient"}
                    large
                  />

                  <div className="min-w-0">
                    <h2 className="break-words text-base font-bold text-slate-900 sm:text-lg">
                      {form.patientName || "New Patient"}
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      {form.patientName
                        ? `${form.age || "—"} years`
                        : "Patient details"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-2.5">
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5">
                    <span className="text-xs text-slate-500">
                      Patient ID
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      {editingRecord?.patientId || "Auto Generated"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5">
                    <span className="text-xs text-slate-500">
                      Department
                    </span>
                    <span className="max-w-[150px] truncate text-right text-xs font-bold text-slate-700">
                      {form.department || "Not selected"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5">
                    <span className="text-xs text-slate-500">
                      Doctor
                    </span>
                    <span className="max-w-[150px] truncate text-right text-xs font-bold text-slate-700">
                      {form.doctor || "Not selected"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5">
                    <span className="text-xs text-slate-500">
                      Visit Date
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      {form.visitDate || "Not selected"}
                    </span>
                  </div>
                </div>

                <div className="mt-5 rounded-xl border border-cyan-100 bg-cyan-50 p-3">
                  <p className="text-xs font-semibold text-cyan-800">
                    Required information
                  </p>

                  <p className="mt-1 text-xs leading-5 text-cyan-700">
                    Patient name, age, mobile number, doctor, department,
                    visit date and diagnosis are required.
                  </p>
                </div>
              </div>
            </aside>

            {/* FORM */}
            <main className="min-w-0 space-y-4 sm:space-y-5">
              {/* PATIENT INFORMATION */}
              <FormSection
                title="Patient Information"
                description="Basic demographic and contact information."
                icon={<UserRound className="h-5 w-5" />}
                accent="cyan"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <InputField
                    label="Patient Name"
                    value={form.patientName}
                    onChange={(value) =>
                      updateField("patientName", value)
                    }
                    placeholder="Enter patient name"
                    error={errors.patientName}
                    required
                  />

                  <InputField
                    label="Age"
                    type="number"
                    value={form.age}
                    onChange={(value) =>
                      updateField(
                        "age",
                        value.replace(/\D/g, "").slice(0, 3),
                      )
                    }
                    placeholder="Enter age"
                    error={errors.age}
                    required
                  />

                  <SelectField
                    label="Gender"
                    value={form.gender}
                    onChange={(value) =>
                      updateField("gender", value)
                    }
                    options={[
                      {
                        value: "",
                        label: "Select Gender",
                      },
                      {
                        value: "Male",
                        label: "Male",
                      },
                      {
                        value: "Female",
                        label: "Female",
                      },
                      {
                        value: "Other",
                        label: "Other",
                      },
                    ]}
                  />

                  <SelectField
                    label="Blood Group"
                    value={form.bloodGroup}
                    onChange={(value) =>
                      updateField("bloodGroup", value)
                    }
                    options={[
                      {
                        value: "",
                        label: "Select Blood Group",
                      },
                      {
                        value: "A+",
                        label: "A+",
                      },
                      {
                        value: "A-",
                        label: "A-",
                      },
                      {
                        value: "B+",
                        label: "B+",
                      },
                      {
                        value: "B-",
                        label: "B-",
                      },
                      {
                        value: "AB+",
                        label: "AB+",
                      },
                      {
                        value: "AB-",
                        label: "AB-",
                      },
                      {
                        value: "O+",
                        label: "O+",
                      },
                      {
                        value: "O-",
                        label: "O-",
                      },
                    ]}
                  />

                  <InputField
                    label="Mobile Number"
                    value={form.phone}
                    onChange={(value) =>
                      updateField(
                        "phone",
                        value
                          .replace(/[^\d+\s()-]/g, "")
                          .slice(0, 17),
                      )
                    }
                    placeholder="+91 98765 43210"
                    error={errors.phone}
                    required
                  />

                  <InputField
                    label="Email Address"
                    type="email"
                    value={form.email}
                    onChange={(value) =>
                      updateField("email", value)
                    }
                    placeholder="patient@example.com"
                    error={errors.email}
                  />

                  <div className="md:col-span-2">
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

              {/* VISIT INFORMATION */}
              <FormSection
                title="Visit Information"
                description="Assign the doctor and record the visit details."
                icon={<CalendarDays className="h-5 w-5" />}
                accent="blue"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <SelectField
                    label="Doctor"
                    value={form.doctor}
                    onChange={handleDoctorChange}
                    options={[
                      {
                        value: "",
                        label: "Select Doctor",
                      },
                      ...doctors.map((doctor) => ({
                        value: doctor.name,
                        label: `${doctor.name} — ${doctor.department}`,
                      })),
                    ]}
                    error={errors.doctor}
                    required
                  />

                  <SelectField
                    label="Department"
                    value={form.department}
                    onChange={(value) =>
                      updateField("department", value)
                    }
                    options={[
                      {
                        value: "",
                        label: "Select Department",
                      },
                      ...departments
                        .filter(
                          (item) => item !== "All Departments",
                        )
                        .map((item) => ({
                          value: item,
                          label: item,
                        })),
                    ]}
                    error={errors.department}
                    required
                  />

                  <InputField
                    label="Visit Date"
                    type="date"
                    value={form.visitDate}
                    onChange={(value) =>
                      updateField("visitDate", value)
                    }
                    error={errors.visitDate}
                    required
                  />

                  <InputField
                    label="Next Visit"
                    type="date"
                    value={form.nextVisit}
                    onChange={(value) =>
                      updateField("nextVisit", value)
                    }
                  />
                </div>
              </FormSection>

              {/* CLINICAL */}
              <FormSection
                title="Clinical Information"
                description="Record diagnosis, symptoms and relevant medical history."
                icon={<Stethoscope className="h-5 w-5" />}
                accent="violet"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <InputField
                    label="Diagnosis"
                    value={form.diagnosis}
                    onChange={(value) =>
                      updateField("diagnosis", value)
                    }
                    placeholder="Enter primary diagnosis"
                    error={errors.diagnosis}
                    required
                  />

                  <InputField
                    label="Symptoms / Complaints"
                    value={form.symptoms}
                    onChange={(value) =>
                      updateField("symptoms", value)
                    }
                    placeholder="e.g. headache, fever, pain"
                  />

                  <TextAreaField
                    label="Allergies"
                    value={form.allergies}
                    onChange={(value) =>
                      updateField("allergies", value)
                    }
                    placeholder="Enter known allergies"
                    rows={3}
                  />

                  <TextAreaField
                    label="Medical History"
                    value={form.medicalHistory}
                    onChange={(value) =>
                      updateField("medicalHistory", value)
                    }
                    placeholder="Previous conditions, surgeries, etc."
                    rows={3}
                  />
                </div>
              </FormSection>

              {/* VITALS */}
              <FormSection
                title="Vital Signs"
                description="Record the patient's current clinical measurements."
                icon={<Activity className="h-5 w-5" />}
                accent="emerald"
              >
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 sm:gap-4">
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
                      updateField("heartRate", value)
                    }
                    placeholder="72 bpm"
                  />

                  <InputField
                    label="Temperature"
                    value={form.temperature}
                    onChange={(value) =>
                      updateField("temperature", value)
                    }
                    placeholder="98.6 °F"
                  />

                  <InputField
                    label="Oxygen"
                    value={form.oxygenLevel}
                    onChange={(value) =>
                      updateField("oxygenLevel", value)
                    }
                    placeholder="98%"
                  />

                  <InputField
                    label="Weight"
                    value={form.weight}
                    onChange={(value) =>
                      updateField("weight", value)
                    }
                    placeholder="70 kg"
                  />
                </div>
              </FormSection>

              {/* TREATMENT */}
              <FormSection
                title="Treatment & Medication"
                description="Document medication, investigations and clinical notes."
                icon={<Pill className="h-5 w-5" />}
                accent="amber"
              >
                <div className="space-y-4">
                  <TextAreaField
                    label="Medications / Prescription"
                    value={form.medications}
                    onChange={(value) =>
                      updateField("medications", value)
                    }
                    placeholder="Enter prescribed medicines and dosage"
                    rows={4}
                  />

                  <TextAreaField
                    label="Lab Results"
                    value={form.labResults}
                    onChange={(value) =>
                      updateField("labResults", value)
                    }
                    placeholder="Enter relevant laboratory or imaging results"
                    rows={4}
                  />

                  <TextAreaField
                    label="Clinical Notes"
                    value={form.clinicalNotes}
                    onChange={(value) =>
                      updateField("clinicalNotes", value)
                    }
                    placeholder="Enter doctor's clinical observations and recommendations"
                    rows={5}
                  />
                </div>
              </FormSection>

              {/* STATUS */}
              <FormSection
                title="Record Status"
                description="Set the current status of this medical record."
                icon={<ClipboardList className="h-5 w-5" />}
                accent="rose"
              >
                <div className="grid gap-3 sm:grid-cols-3">
                  {(["Stable", "Critical", "Follow-up"] as RecordStatus[]).map(
                    (item) => {
                      const active = form.status === item;

                      const statusStyles: Record<
                        RecordStatus,
                        string
                      > = {
                        Stable:
                          "border-emerald-300 bg-emerald-50 text-emerald-700",
                        Critical:
                          "border-rose-300 bg-rose-50 text-rose-700",
                        "Follow-up":
                          "border-amber-300 bg-amber-50 text-amber-700",
                      };

                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() =>
                            updateField("status", item)
                          }
                          className={`flex min-h-12 cursor-pointer items-center justify-between rounded-xl border px-4 text-sm font-semibold transition ${
                            active
                              ? statusStyles[item]
                              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          {item}

                          {active && (
                            <CheckCircle2 className="h-4 w-4" />
                          )}
                        </button>
                      );
                    },
                  )}
                </div>
              </FormSection>

              <div className="h-4 lg:h-8" />
            </main>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="shrink-0 border-t border-slate-200 bg-white px-3 py-3 shadow-[0_-4px_20px_rgba(15,23,42,0.08)] sm:px-6">
          <div className="mx-auto flex w-full max-w-[1500px] flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
              <FileHeart className="h-4 w-4 text-cyan-500" />

              <span>
                {requiredFieldsComplete
                  ? "All required information is complete."
                  : "Complete all required fields to enable saving."}
              </span>
            </div>

            <div className="flex w-full gap-2 sm:w-auto">
              <button
                type="button"
                onClick={closeEditor}
                disabled={isSaving}
                className="h-11 flex-1 cursor-pointer rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitDisabled}
                className={`inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl px-6 text-sm font-bold text-white shadow-md transition active:scale-[0.98] sm:flex-none ${
                  submitDisabled
                    ? "cursor-not-allowed bg-slate-300 shadow-none"
                    : "cursor-pointer bg-gradient-to-r from-cyan-700 via-cyan-600 to-sky-600 shadow-cyan-200 hover:from-cyan-800 hover:via-cyan-700 hover:to-sky-700"
                }`}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {editingRecord ? "Saving..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    {editingRecord ? "Save Changes" : "Create EMR"}
                  </>
                )}
              </button>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* MAIN LIST PAGE                                                            */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="min-h-full bg-slate-50">
      {/* PAGE HEADER */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
                <FileHeart className="h-6 w-6" />
              </div>

              <div className="min-w-0">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  Electronic Medical Records
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Manage patient medical records, diagnoses, treatments and
                  clinical history.
                </p>
              </div>
            </div>

            {/* ADD EMR */}
            <button
              type="button"
              onClick={openCreateEMR}
              className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-700 via-cyan-600 to-sky-600 px-5 text-sm font-bold text-white shadow-md shadow-cyan-200 transition hover:from-cyan-800 hover:via-cyan-700 hover:to-sky-700 active:scale-[0.98] sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              Add EMR
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-[1600px] space-y-5 p-4 sm:p-6 lg:p-8">
        {/* STATS */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            title="Total Records"
            value={totalRecords.toLocaleString()}
            icon={<FileHeart className="h-5 w-5" />}
            iconClass="bg-cyan-50 text-cyan-700"
          />

          <StatCard
            title="Today's Visits"
            value={todayVisits}
            icon={<CalendarDays className="h-5 w-5" />}
            iconClass="bg-blue-50 text-blue-700"
          />

          <StatCard
            title="Critical Cases"
            value={criticalCases}
            icon={<AlertCircle className="h-5 w-5" />}
            iconClass="bg-rose-50 text-rose-700"
          />

          <StatCard
            title="Follow-ups"
            value={followUps}
            icon={<History className="h-5 w-5" />}
            iconClass="bg-amber-50 text-amber-700"
          />
        </div>

        {/* FILTER CARD */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_180px_auto]">
            {/* SEARCH */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search patient, ID, doctor or diagnosis..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />
            </div>

            {/* DEPARTMENT */}
            <div className="relative">
              <Filter className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <select
                value={department}
                onChange={(event) =>
                  setDepartment(event.target.value)
                }
                className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-9 text-sm text-slate-700 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              >
                {departments.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>

            {/* STATUS */}
            <div className="relative">
              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value as "All" | RecordStatus,
                  )
                }
                className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-9 text-sm text-slate-700 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              >
                <option value="All">All Statuses</option>
                <option value="Stable">Stable</option>
                <option value="Critical">Critical</option>
                <option value="Follow-up">Follow-up</option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>

            {/* RESET */}
            <button
              type="button"
              onClick={resetFilters}
              disabled={!hasActiveFilters}
              className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition active:scale-[0.98] ${
                hasActiveFilters
                  ? "cursor-pointer border-slate-200 bg-white text-slate-600 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                  : "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
              }`}
            >
              <X className="h-4 w-4" />
              Reset Filters
            </button>
          </div>

          {hasActiveFilters && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">
                Active filters:
              </span>

              {search.trim() && (
                <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-700">
                  Search: {search}
                </span>
              )}

              {department !== "All Departments" && (
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                  {department}
                </span>
              )}

              {status !== "All" && (
                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                  {status}
                </span>
              )}
            </div>
          )}
        </div>

        {/* RECORDS */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 sm:px-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Medical Records
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Showing {filteredRecords.length} of {records.length} records
              </p>
            </div>

            <div className="hidden items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500 sm:flex">
              <Users className="h-3.5 w-3.5" />
              {filteredRecords.length} records
            </div>
          </div>

          {filteredRecords.length === 0 ? (
            /* EMPTY */
            <div className="flex min-h-[380px] flex-col items-center justify-center px-6 py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
                <FileHeart className="h-8 w-8" />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                No EMR records found
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                {hasActiveFilters
                  ? "Try changing your search or filters to find a medical record."
                  : "Create your first electronic medical record to get started."}
              </p>

              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-5 inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  <X className="h-4 w-4" />
                  Clear Filters
                </button>
              ) : (
                <button
                  type="button"
                  onClick={openCreateEMR}
                  className="mt-5 inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-700 via-cyan-600 to-sky-600 px-5 text-sm font-bold text-white shadow-md shadow-cyan-200 transition hover:from-cyan-800 hover:via-cyan-700 hover:to-sky-700 active:scale-[0.98]"
                >
                  <Plus className="h-4 w-4" />
                  Create New EMR
                </button>
              )}
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[1050px]">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/70">
                      <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Patient
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Doctor
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Department
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Diagnosis
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Visit Date
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Status
                      </th>
                      <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    <AnimatePresence initial={false}>
                      {filteredRecords.map((record) => (
                        <motion.tr
                          key={record.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="transition hover:bg-slate-50/70"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <PatientAvatar
                                name={record.patientName}
                              />

                              <div className="min-w-0">
                                <p className="font-semibold text-slate-900">
                                  {record.patientName}
                                </p>

                                <p className="mt-0.5 text-xs text-slate-500">
                                  {record.patientId} · {record.age} yrs
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4 text-sm font-medium text-slate-700">
                            {record.doctor}
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-600">
                            {record.department}
                          </td>

                          <td className="max-w-[190px] px-5 py-4">
                            <p className="truncate text-sm font-medium text-slate-700">
                              {record.diagnosis}
                            </p>
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-600">
                            {record.visitDate}
                          </td>

                          <td className="px-5 py-4">
                            <StatusBadge status={record.status} />
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() =>
                                  setViewRecord(record)
                                }
                                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition hover:bg-cyan-50 hover:text-cyan-700"
                                title="View EMR"
                              >
                                <Eye className="h-4 w-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  openEditEMR(record)
                                }
                                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition hover:bg-blue-50 hover:text-blue-700"
                                title="Edit EMR"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  setDeleteRecord(record)
                                }
                                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition hover:bg-rose-50 hover:text-rose-700"
                                title="Delete EMR"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {/* MOBILE / TABLET CARDS */}
              <div className="grid gap-3 p-3 lg:hidden sm:p-4">
                <AnimatePresence initial={false}>
                  {filteredRecords.map((record) => (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <PatientAvatar
                          name={record.patientName}
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <h3 className="font-bold text-slate-900">
                                {record.patientName}
                              </h3>

                              <p className="mt-0.5 text-xs text-slate-500">
                                {record.patientId} · {record.age} years
                              </p>
                            </div>

                            <StatusBadge
                              status={record.status}
                            />
                          </div>

                          <div className="mt-4 grid gap-2 sm:grid-cols-2">
                            <div className="rounded-xl bg-slate-50 p-3">
                              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                Doctor
                              </p>
                              <p className="mt-1 text-sm font-semibold text-slate-700">
                                {record.doctor}
                              </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-3">
                              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                Department
                              </p>
                              <p className="mt-1 text-sm font-semibold text-slate-700">
                                {record.department}
                              </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-3">
                              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                Diagnosis
                              </p>
                              <p className="mt-1 text-sm font-semibold text-slate-700">
                                {record.diagnosis}
                              </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-3">
                              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                Visit Date
                              </p>
                              <p className="mt-1 text-sm font-semibold text-slate-700">
                                {record.visitDate}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
                            <button
                              type="button"
                              onClick={() =>
                                setViewRecord(record)
                              }
                              className="inline-flex h-9 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              View
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                openEditEMR(record)
                              }
                              className="inline-flex h-9 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-blue-100 bg-blue-50 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                setDeleteRecord(record)
                              }
                              className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-rose-100 bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </main>

      {/* VIEW MODAL */}
      <AnimatePresence>
        {viewRecord && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-3 backdrop-blur-sm sm:p-5"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setViewRecord(null);
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 12 }}
              className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
            >
              {/* MODAL HEADER */}
              <div className="shrink-0 border-b border-cyan-700/30 bg-gradient-to-r from-cyan-700 via-cyan-600 to-sky-600 px-4 py-4 text-white sm:px-6">
                <div className="flex items-center gap-3">
                  <PatientAvatar
                    name={viewRecord.patientName}
                  />

                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-lg font-bold sm:text-xl">
                      {viewRecord.patientName}
                    </h2>

                    <p className="mt-0.5 text-xs text-cyan-50 sm:text-sm">
                      {viewRecord.patientId} · {viewRecord.department}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setViewRecord(null)}
                    className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-white/20 bg-white/10 transition hover:bg-white/20"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* MODAL CONTENT */}
              <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50 p-3 sm:p-5">
                <div className="space-y-4">
                  {/* SUMMARY */}
                  <div className="rounded-2xl border border-cyan-200 bg-white p-4 shadow-sm sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-cyan-600">
                          Medical Record
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Visit date:{" "}
                          <span className="font-semibold text-slate-700">
                            {viewRecord.visitDate}
                          </span>
                        </p>
                      </div>

                      <StatusBadge
                        status={viewRecord.status}
                      />
                    </div>
                  </div>

                  {/* PATIENT */}
                  <div className="rounded-2xl border border-cyan-200 bg-white p-4 shadow-sm sm:p-5">
                    <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900">
                      <UserRound className="h-5 w-5 text-cyan-600" />
                      Patient Information
                    </h3>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      <DetailItem
                        icon={<UserRound className="h-3.5 w-3.5" />}
                        label="Gender"
                        value={viewRecord.gender}
                      />

                      <DetailItem
                        icon={<HeartPulse className="h-3.5 w-3.5" />}
                        label="Blood Group"
                        value={viewRecord.bloodGroup}
                      />

                      <DetailItem
                        icon={<Activity className="h-3.5 w-3.5" />}
                        label="Age"
                        value={
                          viewRecord.age
                            ? `${viewRecord.age} years`
                            : ""
                        }
                      />

                      <DetailItem
                        icon={<MapPin className="h-3.5 w-3.5" />}
                        label="Address"
                        value={viewRecord.address}
                      />

                      <DetailItem
                        icon={<Mail className="h-3.5 w-3.5" />}
                        label="Email"
                        value={viewRecord.email}
                      />

                      <DetailItem
                        icon={<Clock3 className="h-3.5 w-3.5" />}
                        label="Phone"
                        value={viewRecord.phone}
                      />
                    </div>
                  </div>

                  {/* VISIT */}
                  <div className="rounded-2xl border border-blue-200 bg-white p-4 shadow-sm sm:p-5">
                    <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900">
                      <CalendarDays className="h-5 w-5 text-blue-600" />
                      Visit Information
                    </h3>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <DetailItem
                        label="Doctor"
                        value={viewRecord.doctor}
                      />

                      <DetailItem
                        label="Department"
                        value={viewRecord.department}
                      />

                      <DetailItem
                        label="Visit Date"
                        value={viewRecord.visitDate}
                      />

                      <DetailItem
                        label="Next Visit"
                        value={viewRecord.nextVisit}
                      />
                    </div>
                  </div>

                  {/* CLINICAL */}
                  {(viewRecord.diagnosis ||
                    viewRecord.symptoms ||
                    viewRecord.allergies ||
                    viewRecord.medicalHistory) && (
                    <div className="rounded-2xl border border-violet-200 bg-white p-4 shadow-sm sm:p-5">
                      <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900">
                        <Stethoscope className="h-5 w-5 text-violet-600" />
                        Clinical Information
                      </h3>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <DetailItem
                          label="Diagnosis"
                          value={viewRecord.diagnosis}
                        />

                        <DetailItem
                          label="Symptoms / Complaints"
                          value={viewRecord.symptoms}
                        />

                        <DetailItem
                          label="Allergies"
                          value={viewRecord.allergies}
                        />

                        <DetailItem
                          label="Medical History"
                          value={viewRecord.medicalHistory}
                        />
                      </div>
                    </div>
                  )}

                  {/* VITALS */}
                  {(viewRecord.bloodPressure ||
                    viewRecord.heartRate ||
                    viewRecord.temperature ||
                    viewRecord.oxygenLevel ||
                    viewRecord.weight) && (
                    <div className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm sm:p-5">
                      <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900">
                        <Activity className="h-5 w-5 text-emerald-600" />
                        Vital Signs
                      </h3>

                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                        <DetailItem
                          label="Blood Pressure"
                          value={viewRecord.bloodPressure}
                        />

                        <DetailItem
                          label="Heart Rate"
                          value={viewRecord.heartRate}
                        />

                        <DetailItem
                          label="Temperature"
                          value={viewRecord.temperature}
                        />

                        <DetailItem
                          label="Oxygen Level"
                          value={viewRecord.oxygenLevel}
                        />

                        <DetailItem
                          icon={<Weight className="h-3.5 w-3.5" />}
                          label="Weight"
                          value={viewRecord.weight}
                        />
                      </div>
                    </div>
                  )}

                  {/* TREATMENT */}
                  {(viewRecord.medications ||
                    viewRecord.labResults ||
                    viewRecord.clinicalNotes) && (
                    <div className="rounded-2xl border border-amber-200 bg-white p-4 shadow-sm sm:p-5">
                      <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900">
                        <Pill className="h-5 w-5 text-amber-600" />
                        Treatment & Medication
                      </h3>

                      <div className="space-y-3">
                        <DetailItem
                          label="Medications / Prescription"
                          value={viewRecord.medications}
                        />

                        <DetailItem
                          label="Lab Results"
                          value={viewRecord.labResults}
                        />

                        <DetailItem
                          icon={<FileText className="h-3.5 w-3.5" />}
                          label="Clinical Notes"
                          value={viewRecord.clinicalNotes}
                        />
                      </div>
                    </div>
                  )}

                  {/* EMPTY DETAILS */}
                  {!viewRecord.diagnosis &&
                    !viewRecord.symptoms &&
                    !viewRecord.allergies &&
                    !viewRecord.medicalHistory &&
                    !viewRecord.bloodPressure &&
                    !viewRecord.heartRate &&
                    !viewRecord.temperature &&
                    !viewRecord.oxygenLevel &&
                    !viewRecord.weight &&
                    !viewRecord.medications &&
                    !viewRecord.labResults &&
                    !viewRecord.clinicalNotes && (
                      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
                        <FileText className="mx-auto h-8 w-8 text-slate-300" />

                        <p className="mt-3 text-sm font-semibold text-slate-700">
                          No additional clinical details
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Additional medical information has not been
                          recorded yet.
                        </p>
                      </div>
                    )}
                </div>
              </div>

              {/* MODAL FOOTER */}
              <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-3 sm:px-5">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const record = viewRecord;
                      setViewRecord(null);
                      openEditEMR(record);
                    }}
                    className="inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-700 via-cyan-600 to-sky-600 px-4 text-sm font-bold text-white shadow-sm transition hover:from-cyan-800 hover:via-cyan-700 hover:to-sky-700 sm:flex-none"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit EMR
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewRecord(null)}
                    className="inline-flex h-10 flex-1 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 sm:flex-none"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION */}
      <AnimatePresence>
        {deleteRecord && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                <Trash2 className="h-6 w-6" />
              </div>

              <h2 className="mt-4 text-lg font-bold text-slate-900">
                Delete EMR record?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Are you sure you want to delete the medical record for{" "}
                <span className="font-semibold text-slate-700">
                  {deleteRecord.patientName}
                </span>
                ? This action cannot be undone.
              </p>

              <div className="mt-6 flex gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteRecord(null)}
                  className="h-11 flex-1 cursor-pointer rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={confirmDelete}
                  className="h-11 flex-1 cursor-pointer rounded-xl bg-rose-600 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-rose-700 active:scale-[0.98]"
                >
                  Delete Record
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}