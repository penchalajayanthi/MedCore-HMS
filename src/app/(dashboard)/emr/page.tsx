"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
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

type FormErrors = Partial<Record<keyof EMRFormData, string>>;

type Doctor = {
  id: string;
  name: string;
  department: string;
};

type Patient = {
  id: string;
  name: string;
  age: string;
  gender: string;
  bloodGroup: string;
  phone: string;
  email: string;
  address: string;
  department?: string;
};

const PATIENTS_STORAGE_KEY = "medcore_patients";
const EMR_STORAGE_KEY = "medcore_emr";

const PATIENTS_UPDATED_EVENT = "medcore-patients-updated";
const EMR_UPDATED_EVENT = "medcore-emr-updated";

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

function getTodayDate() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const today = getTodayDate();

const emptyForm: EMRFormData = {
  patientId: "",
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

const initialRecords: EMRRecord[] = [
  {
    id: 1,
    patientId: "PAT001",
    patientName: "Rahul Kumar",
    age: "45",
    gender: "Male",
    bloodGroup: "O+",
    phone: "+91 9876543210",
    email: "rahul@example.com",
    address: "Nellore, Andhra Pradesh",
    doctor: "Dr. Ananya Reddy",
    department: "Cardiology",
    visitDate: today,
    nextVisit: today,
    diagnosis: "Hypertension",
    symptoms: "Headache and mild dizziness",
    allergies: "",
    medicalHistory: "Hypertension for 3 years",
    bloodPressure: "138/88",
    heartRate: "78",
    temperature: "98.4",
    oxygenLevel: "98",
    weight: "72",
    medications: "Amlodipine 5mg",
    labResults: "Normal CBC",
    clinicalNotes: "Continue medication and monitor BP.",
    status: "Stable",
  },
  {
    id: 2,
    patientId: "PAT002",
    patientName: "Priya Sharma",
    age: "32",
    gender: "Female",
    bloodGroup: "B+",
    phone: "+91 9123456780",
    email: "priya@example.com",
    address: "Nellore, Andhra Pradesh",
    doctor: "Dr. Rahul Verma",
    department: "Neurology",
    visitDate: today,
    nextVisit: "",
    diagnosis: "Migraine",
    symptoms: "Recurring headache and nausea",
    allergies: "",
    medicalHistory: "Migraine history",
    bloodPressure: "120/80",
    heartRate: "74",
    temperature: "98.2",
    oxygenLevel: "99",
    weight: "60",
    medications: "Sumatriptan",
    labResults: "MRI normal",
    clinicalNotes: "Follow migraine management plan.",
    status: "Follow-up",
  },
  {
    id: 3,
    patientId: "PAT003",
    patientName: "Arjun Reddy",
    age: "28",
    gender: "Male",
    bloodGroup: "A+",
    phone: "+91 9988776655",
    email: "arjun@example.com",
    address: "Nellore, Andhra Pradesh",
    doctor: "Dr. Arjun Reddy",
    department: "Orthopedics",
    visitDate: today,
    nextVisit: "",
    diagnosis: "Knee ligament injury",
    symptoms: "Knee pain and swelling",
    allergies: "",
    medicalHistory: "Sports injury",
    bloodPressure: "118/78",
    heartRate: "80",
    temperature: "98.6",
    oxygenLevel: "98",
    weight: "76",
    medications: "Pain relief medication",
    labResults: "X-Ray completed",
    clinicalNotes: "Physiotherapy recommended.",
    status: "Critical",
  },
  {
    id: 4,
    patientId: "PAT004",
    patientName: "Meena Devi",
    age: "51",
    gender: "Female",
    bloodGroup: "AB+",
    phone: "+91 9000011111",
    email: "meena@example.com",
    address: "Nellore, Andhra Pradesh",
    doctor: "Dr. Priya Sharma",
    department: "General Medicine",
    visitDate: today,
    nextVisit: "",
    diagnosis: "Type 2 Diabetes",
    symptoms: "Fatigue and increased thirst",
    allergies: "",
    medicalHistory: "Diabetes for 5 years",
    bloodPressure: "130/82",
    heartRate: "76",
    temperature: "98.3",
    oxygenLevel: "97",
    weight: "68",
    medications: "Metformin 500mg",
    labResults: "HbA1c 7.1%",
    clinicalNotes: "Continue diabetic monitoring.",
    status: "Stable",
  },
  {
    id: 5,
    patientId: "PAT005",
    patientName: "Vikram Singh",
    age: "24",
    gender: "Male",
    bloodGroup: "O-",
    phone: "+91 9111122222",
    email: "vikram@example.com",
    address: "Nellore, Andhra Pradesh",
    doctor: "Dr. Meera Nair",
    department: "Dermatology",
    visitDate: "2026-09-20",
    nextVisit: "",
    diagnosis: "Atopic dermatitis",
    symptoms: "Skin irritation and itching",
    allergies: "",
    medicalHistory: "",
    bloodPressure: "",
    heartRate: "",
    temperature: "",
    oxygenLevel: "",
    weight: "70",
    medications: "Topical cream",
    labResults: "",
    clinicalNotes: "Avoid known skin irritants.",
    status: "Follow-up",
  },
];

function normalizePatient(raw: unknown): Patient | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const item = raw as Record<string, unknown>;

  const id =
    typeof item.id === "string"
      ? item.id
      : typeof item.patientId === "string"
        ? item.patientId
        : "";

  const name =
    typeof item.name === "string"
      ? item.name
      : typeof item.fullName === "string"
        ? item.fullName
        : typeof item.patientName === "string"
          ? item.patientName
          : "";

  if (!id || !name) {
    return null;
  }

  const age =
    typeof item.age === "number"
      ? String(item.age)
      : typeof item.age === "string"
        ? item.age
        : "";

  const gender =
    typeof item.gender === "string" ? item.gender : "";

  const bloodGroup =
    typeof item.bloodGroup === "string"
      ? item.bloodGroup
      : typeof item.bloodType === "string"
        ? item.bloodType
        : "";

  const phone =
    typeof item.phone === "string"
      ? item.phone
      : typeof item.mobile === "string"
        ? item.mobile
        : typeof item.mobileNumber === "string"
          ? item.mobileNumber
          : "";

  const email =
    typeof item.email === "string" ? item.email : "";

  const address =
    typeof item.address === "string"
      ? item.address
      : typeof item.location === "string"
        ? item.location
        : "";

  const department =
    typeof item.department === "string"
      ? item.department
      : "";

  return {
    id,
    name,
    age,
    gender,
    bloodGroup,
    phone,
    email,
    address,
    department,
  };
}

function getPatientsFromStorage(): Patient[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(PATIENTS_STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed: unknown = JSON.parse(stored);

    let source: unknown[] = [];

    if (Array.isArray(parsed)) {
      source = parsed;
    } else if (
      parsed &&
      typeof parsed === "object" &&
      "patients" in parsed &&
      Array.isArray((parsed as { patients?: unknown[] }).patients)
    ) {
      source = (parsed as { patients: unknown[] }).patients;
    }

    return source
      .map(normalizePatient)
      .filter((patient): patient is Patient => patient !== null);
  } catch {
    return [];
  }
}

function createFallbackPatients(): Patient[] {
  return initialRecords.map((record) => ({
    id: record.patientId,
    name: record.patientName,
    age: record.age,
    gender: record.gender,
    bloodGroup: record.bloodGroup,
    phone: record.phone,
    email: record.email,
    address: record.address,
  }));
}

function getEMRFromStorage(): EMRRecord[] | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = localStorage.getItem(EMR_STORAGE_KEY);

    if (!stored) {
      return null;
    }

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return null;
    }

    return parsed as EMRRecord[];
  } catch {
    return null;
  }
}

function saveEMRRecords(records: EMRRecord[]) {
  localStorage.setItem(
    EMR_STORAGE_KEY,
    JSON.stringify(records),
  );

  window.dispatchEvent(
    new Event(EMR_UPDATED_EVENT),
  );
}

function StatusBadge({ status }: { status: RecordStatus }) {
  const styles: Record<RecordStatus, string> = {
    Stable:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    Critical:
      "border-rose-200 bg-rose-50 text-rose-700",
    "Follow-up":
      "border-amber-200 bg-amber-50 text-amber-700",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function PatientAvatar({
  name,
  size = "md",
}: {
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const initials = name
    .split(" ")
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const sizeClasses = {
    sm: "h-9 w-9 text-xs",
    md: "h-11 w-11 text-sm",
    lg: "h-14 w-14 text-base",
  };

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-100 to-blue-100 font-bold text-blue-700 ${sizeClasses[size]}`}
    >
      {initials}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  description,
  iconClass,
}: {
  title: string;
  value: number;
  icon: ReactNode;
  description: string;
  iconClass: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value.toLocaleString()}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {description}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </motion.div>
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
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-5 flex items-start gap-3 border-b border-slate-100 pb-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
          {icon}
        </div>

        <div>
          <h3 className="font-bold text-slate-900">
            {title}
          </h3>

          <p className="mt-0.5 text-xs text-slate-500">
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
  required,
  readOnly = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  required?: boolean;
  readOnly?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
        {required && (
          <span className="ml-1 text-rose-500">*</span>
        )}
      </label>

      <input
        type={type}
        value={value}
        readOnly={readOnly}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition ${
          readOnly
            ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-600"
            : "border-slate-200 bg-white text-slate-800 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
        } ${
          error
            ? "border-rose-300 focus:border-rose-400 focus:ring-rose-50"
            : ""
        }`}
      />

      {error && (
        <p className="mt-1 text-xs font-medium text-rose-500">
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
  placeholder,
  error,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
        {required && (
          <span className="ml-1 text-rose-500">*</span>
        )}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`w-full cursor-pointer appearance-none rounded-xl border bg-white px-3.5 py-2.5 pr-10 text-sm text-slate-800 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50 ${
            error ? "border-rose-300" : "border-slate-200"
          }`}
        >
          {placeholder && (
            <option value="">{placeholder}</option>
          )}

          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>

      {error && (
        <p className="mt-1 text-xs font-medium text-rose-500">
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
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
      />
    </div>
  );
}

function DetailItem({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {icon}
        {label}
      </div>

      <p className="text-sm font-medium text-slate-800">
        {value || "Not provided"}
      </p>
    </div>
  );
}

export default function EMRPage() {
  const [records, setRecords] =
    useState<EMRRecord[]>(initialRecords);

  const [patients, setPatients] = useState<Patient[]>(
    createFallbackPatients(),
  );

  const [search, setSearch] = useState("");
  const [department, setDepartment] =
    useState("All Departments");

  const [status, setStatus] =
    useState<"All" | RecordStatus>("All");

  const [editorOpen, setEditorOpen] =
    useState(false);

  const [viewRecord, setViewRecord] =
    useState<EMRRecord | null>(null);

  const [deleteRecord, setDeleteRecord] =
    useState<EMRRecord | null>(null);

  const [editingRecord, setEditingRecord] =
    useState<EMRRecord | null>(null);

  const [form, setForm] =
    useState<EMRFormData>(emptyForm);

  const [errors, setErrors] =
    useState<FormErrors>({});

  const [isSaving, setIsSaving] =
    useState(false);

  const savingRef = useRef(false);

  useEffect(() => {
    const storedRecords = getEMRFromStorage();

    if (storedRecords) {
      setRecords(storedRecords);
    } else {
      saveEMRRecords(initialRecords);
      setRecords(initialRecords);
    }

    const storedPatients =
      getPatientsFromStorage();

    setPatients(
      storedPatients.length > 0
        ? storedPatients
        : createFallbackPatients(),
    );

    const handlePatientsUpdate = () => {
      const updatedPatients =
        getPatientsFromStorage();

      setPatients(
        updatedPatients.length > 0
          ? updatedPatients
          : createFallbackPatients(),
      );
    };

    const handleEMRUpdate = () => {
      const updatedRecords =
        getEMRFromStorage();

      if (updatedRecords) {
        setRecords(updatedRecords);
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === PATIENTS_STORAGE_KEY) {
        handlePatientsUpdate();
      }

      if (event.key === EMR_STORAGE_KEY) {
        handleEMRUpdate();
      }
    };

    window.addEventListener(
      PATIENTS_UPDATED_EVENT,
      handlePatientsUpdate,
    );

    window.addEventListener(
      EMR_UPDATED_EVENT,
      handleEMRUpdate,
    );

    window.addEventListener(
      "storage",
      handleStorage,
    );

    return () => {
      window.removeEventListener(
        PATIENTS_UPDATED_EVENT,
        handlePatientsUpdate,
      );

      window.removeEventListener(
        EMR_UPDATED_EVENT,
        handleEMRUpdate,
      );

      window.removeEventListener(
        "storage",
        handleStorage,
      );
    };
  }, []);

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !query ||
        record.patientName
          .toLowerCase()
          .includes(query) ||
        record.patientId
          .toLowerCase()
          .includes(query) ||
        record.doctor
          .toLowerCase()
          .includes(query) ||
        record.diagnosis
          .toLowerCase()
          .includes(query);

      const matchesDepartment =
        department === "All Departments" ||
        record.department === department;

      const matchesStatus =
        status === "All" ||
        record.status === status;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesStatus
      );
    });
  }, [
    records,
    search,
    department,
    status,
  ]);

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

  const updateField = <K extends keyof EMRFormData>(
    field: K,
    value: EMRFormData[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  };

  const handlePatientChange = (
    patientId: string,
  ) => {
    const patient = patients.find(
      (item) => item.id === patientId,
    );

    if (!patient) {
      setForm((current) => ({
        ...current,
        patientId: "",
        patientName: "",
        age: "",
        gender: "",
        bloodGroup: "",
        phone: "",
        email: "",
        address: "",
      }));

      return;
    }

    setForm((current) => ({
      ...current,
      patientId: patient.id,
      patientName: patient.name,
      age: patient.age || "",
      gender: patient.gender || "",
      bloodGroup: patient.bloodGroup || "",
      phone: patient.phone || "",
      email: patient.email || "",
      address: patient.address || "",
    }));

    setErrors((current) => ({
      ...current,
      patientId: undefined,
      patientName: undefined,
      age: undefined,
      phone: undefined,
      email: undefined,
    }));
  };

  const handleDoctorChange = (
    doctorName: string,
  ) => {
    const doctor = doctors.find(
      (item) => item.name === doctorName,
    );

    setForm((current) => ({
      ...current,
      doctor: doctorName,
      department: doctor?.department ?? "",
    }));

    setErrors((current) => ({
      ...current,
      doctor: undefined,
      department: undefined,
    }));
  };

  const openCreateEMR = () => {
    setEditingRecord(null);

    setForm({
      ...emptyForm,
      visitDate: getTodayDate(),
    });

    setErrors({});
    setEditorOpen(true);
  };

  const openEditEMR = (
    record: EMRRecord,
  ) => {
    setEditingRecord(record);

    setForm({
      patientId: record.patientId,
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
    setViewRecord(null);
    setEditorOpen(true);
  };

  const closeEditor = () => {
    if (savingRef.current) {
      return;
    }

    setEditorOpen(false);
    setEditingRecord(null);
    setErrors({});
  };

  const validateForm = () => {
    const nextErrors: FormErrors = {};

    if (!form.patientId.trim()) {
      nextErrors.patientId =
        "Please select a patient.";
    }

    if (!form.patientName.trim()) {
      nextErrors.patientName =
        "Patient name is required.";
    }

    if (!form.age.trim()) {
      nextErrors.age =
        "Age is required.";
    } else {
      const age = Number(form.age);

      if (
        !Number.isInteger(age) ||
        age < 1 ||
        age > 120
      ) {
        nextErrors.age =
          "Enter a valid age between 1 and 120.";
      }
    }

    const phoneDigits =
      form.phone.replace(/\D/g, "");

    if (!phoneDigits) {
      nextErrors.phone =
        "Phone number is required.";
    } else if (
      phoneDigits.length !== 10 &&
      !(
        phoneDigits.length === 12 &&
        phoneDigits.startsWith("91")
      )
    ) {
      nextErrors.phone =
        "Enter a valid 10-digit phone number.";
    }

    if (
      form.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email.trim(),
      )
    ) {
      nextErrors.email =
        "Enter a valid email address.";
    }

    if (!form.doctor.trim()) {
      nextErrors.doctor =
        "Doctor is required.";
    }

    if (!form.department.trim()) {
      nextErrors.department =
        "Department is required.";
    }

    if (!form.visitDate.trim()) {
      nextErrors.visitDate =
        "Visit date is required.";
    }

    if (!form.diagnosis.trim()) {
      nextErrors.diagnosis =
        "Diagnosis is required.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (savingRef.current) {
      return;
    }

    if (!validateForm()) {
      toast.error(
        "Please correct the highlighted fields.",
      );
      return;
    }

    savingRef.current = true;
    setIsSaving(true);

    try {
      const nextId =
        records.length > 0
          ? Math.max(
              ...records.map((record) => record.id),
            ) + 1
          : 1;

      const selectedPatient =
        patients.find(
          (patient) =>
            patient.id === form.patientId,
        );

      const record: EMRRecord = {
        id: editingRecord?.id ?? nextId,
        patientId: form.patientId,
        patientName:
          selectedPatient?.name ||
          form.patientName.trim(),
        age: form.age.trim(),
        gender: form.gender.trim(),
        bloodGroup:
          form.bloodGroup.trim(),
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
        medicalHistory:
          form.medicalHistory.trim(),
        bloodPressure:
          form.bloodPressure.trim(),
        heartRate: form.heartRate.trim(),
        temperature:
          form.temperature.trim(),
        oxygenLevel:
          form.oxygenLevel.trim(),
        weight: form.weight.trim(),
        medications:
          form.medications.trim(),
        labResults:
          form.labResults.trim(),
        clinicalNotes:
          form.clinicalNotes.trim(),
        status: form.status,
      };

      const updatedRecords = editingRecord
        ? records.map((item) =>
            item.id === editingRecord.id
              ? record
              : item,
          )
        : [record, ...records];

      setRecords(updatedRecords);
      saveEMRRecords(updatedRecords);

      toast.success(
        editingRecord
          ? "EMR updated successfully."
          : "EMR created successfully.",
      );

      setEditorOpen(false);
      setEditingRecord(null);
      setForm({
        ...emptyForm,
        visitDate: getTodayDate(),
      });
      setErrors({});
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  };

  const confirmDelete = () => {
    if (!deleteRecord) {
      return;
    }

    const updatedRecords = records.filter(
      (record) =>
        record.id !== deleteRecord.id,
    );

    setRecords(updatedRecords);
    saveEMRRecords(updatedRecords);

    toast.success(
      "EMR record deleted successfully.",
    );

    setDeleteRecord(null);
  };

  const resetFilters = () => {
    setSearch("");
    setDepartment("All Departments");
    setStatus("All");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* PAGE HEADER */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-cyan-600">
                <FileHeart className="h-4 w-4" />
                Clinical Management
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Electronic Medical Records
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage patient medical history,
                clinical notes, diagnosis and treatment
                information.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateEMR}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-100 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              <Plus className="h-4 w-4" />
              Add EMR
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* STATS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Records"
            value={totalRecords}
            description="All medical records"
            icon={<FileHeart className="h-5 w-5" />}
            iconClass="bg-cyan-50 text-cyan-600"
          />

          <StatCard
            title="Today's Visits"
            value={todayVisits}
            description="Records created today"
            icon={<CalendarDays className="h-5 w-5" />}
            iconClass="bg-blue-50 text-blue-600"
          />

          <StatCard
            title="Critical Cases"
            value={criticalCases}
            description="Requires close monitoring"
            icon={<AlertCircle className="h-5 w-5" />}
            iconClass="bg-rose-50 text-rose-600"
          />

          <StatCard
            title="Follow-ups"
            value={followUps}
            description="Patients requiring review"
            icon={<History className="h-5 w-5" />}
            iconClass="bg-amber-50 text-amber-600"
          />
        </div>

        {/* FILTERS */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end">
            <div className="flex-1">
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Search Records
              </label>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search patient, ID, doctor or diagnosis..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
                />
              </div>
            </div>

            <div className="w-full xl:w-56">
              <SelectField
                label="Department"
                value={department}
                onChange={setDepartment}
                options={departments}
              />
            </div>

            <div className="w-full xl:w-48">
              <SelectField
                label="Status"
                value={status}
                onChange={(value) =>
                  setStatus(
                    value as
                      | "All"
                      | RecordStatus,
                  )
                }
                options={[
                  "All",
                  "Stable",
                  "Critical",
                  "Follow-up",
                ]}
              />
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex h-[42px] cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
            >
              <Filter className="h-4 w-4" />
              Reset Filters
            </button>
          </div>
        </div>

        {/* RESULT COUNT */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Medical Records
            </p>

            <p className="text-xs text-slate-500">
              Showing {filteredRecords.length} of{" "}
              {records.length} records
            </p>
          </div>

          <div className="hidden items-center gap-2 rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700 sm:flex">
            <Users className="h-3.5 w-3.5" />
            {patients.length} patients connected
          </div>
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Patient
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Doctor
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Department
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Visit Date
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Diagnosis
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map(
                  (record, index) => (
                    <motion.tr
                      key={record.id}
                      initial={{
                        opacity: 0,
                        y: 6,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: index * 0.03,
                      }}
                      className="transition hover:bg-cyan-50/30"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <PatientAvatar
                            name={
                              record.patientName
                            }
                            size="sm"
                          />

                          <div>
                            <p className="font-semibold text-slate-900">
                              {record.patientName}
                            </p>

                            <p className="text-xs text-slate-400">
                              {record.patientId}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm font-medium text-slate-700">
                        {record.doctor}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                          {record.department}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {record.visitDate}
                      </td>

                      <td className="max-w-[220px] px-5 py-4">
                        <p className="truncate text-sm font-medium text-slate-700">
                          {record.diagnosis}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge
                          status={record.status}
                        />
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setViewRecord(
                                record,
                              )
                            }
                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-2 text-xs font-semibold text-cyan-700 transition hover:bg-cyan-100"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              openEditEMR(
                                record,
                              )
                            }
                            className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-blue-200 bg-blue-50 p-2 text-blue-700 transition hover:bg-blue-100"
                            title="Edit"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setDeleteRecord(
                                record,
                              )
                            }
                            className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-rose-200 bg-rose-50 p-2 text-rose-600 transition hover:bg-rose-100"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ),
                )}
              </tbody>
            </table>
          </div>

          {filteredRecords.length === 0 && (
            <div className="px-6 py-16 text-center">
              <FileHeart className="mx-auto h-10 w-10 text-slate-300" />

              <p className="mt-3 font-semibold text-slate-700">
                No medical records found
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Try changing your search or filters.
              </p>
            </div>
          )}
        </div>

        {/* MOBILE / TABLET CARDS */}
        <div className="grid gap-4 lg:hidden">
          {filteredRecords.map(
            (record, index) => (
              <motion.div
                key={record.id}
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.04,
                }}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <PatientAvatar
                      name={record.patientName}
                    />

                    <div className="min-w-0">
                      <p className="truncate font-bold text-slate-900">
                        {record.patientName}
                      </p>

                      <p className="text-xs text-slate-400">
                        {record.patientId}
                      </p>
                    </div>
                  </div>

                  <StatusBadge
                    status={record.status}
                  />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <DetailItem
                    label="Doctor"
                    value={record.doctor}
                    icon={
                      <Stethoscope className="h-3 w-3" />
                    }
                  />

                  <DetailItem
                    label="Department"
                    value={record.department}
                  />

                  <DetailItem
                    label="Visit Date"
                    value={record.visitDate}
                    icon={
                      <CalendarDays className="h-3 w-3" />
                    }
                  />

                  <DetailItem
                    label="Diagnosis"
                    value={record.diagnosis}
                  />
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setViewRecord(record)
                    }
                    className="flex-1 cursor-pointer rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2.5 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-100"
                  >
                    <Eye className="mr-1.5 inline h-4 w-4" />
                    View
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      openEditEMR(record)
                    }
                    className="cursor-pointer rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-blue-700 transition hover:bg-blue-100"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setDeleteRecord(record)
                    }
                    className="cursor-pointer rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-rose-600 transition hover:bg-rose-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ),
          )}

          {filteredRecords.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
              <FileHeart className="mx-auto h-10 w-10 text-slate-300" />

              <p className="mt-3 font-semibold text-slate-700">
                No medical records found
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Try changing your search or filters.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* CREATE / EDIT EMR */}
      <AnimatePresence>
        {editorOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm"
          >
            <div className="min-h-full bg-slate-50">
              <div className="sticky top-0 z-20 border-b border-cyan-100 bg-white/95 shadow-sm backdrop-blur">
                <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                  <div className="flex min-w-0 items-center gap-3">
                    <button
                      type="button"
                      onClick={closeEditor}
                      className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <HeartPulse className="h-5 w-5 text-cyan-600" />

                        <h2 className="truncate text-lg font-bold text-slate-900 sm:text-xl">
                          {editingRecord
                            ? "Edit Medical Record"
                            : "Create Medical Record"}
                        </h2>
                      </div>

                      <p className="mt-0.5 hidden text-xs text-slate-500 sm:block">
                        Patient-linked electronic medical
                        record
                      </p>
                    </div>
                  </div>

                  <div className="hidden rounded-xl border border-cyan-100 bg-cyan-50 px-4 py-2 text-xs font-semibold text-cyan-700 sm:flex sm:items-center sm:gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Connected to Patients
                  </div>
                </div>
              </div>

              <div className="mx-auto max-w-[1500px] space-y-5 px-4 py-6 sm:px-6 lg:px-8">
                {/* PATIENT INFORMATION */}
                <FormSection
                  title="Patient Information"
                  description="Patient details are automatically loaded from the Patients module."
                  icon={
                    <UserRound className="h-5 w-5" />
                  }
                >
                  <div className="space-y-4">
                   

                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                        Patient
                        <span className="ml-1 text-rose-500">
                          *
                        </span>
                      </label>

                      <div className="relative">
                        <select
                          value={form.patientId}
                          onChange={(event) =>
                            handlePatientChange(
                              event.target.value,
                            )
                          }
                          className={`w-full cursor-pointer appearance-none rounded-xl border bg-white px-3.5 py-3 pr-10 text-sm font-medium text-slate-800 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50 ${
                            errors.patientId
                              ? "border-rose-300"
                              : "border-slate-200"
                          }`}
                        >
                          <option value="">
                            Select a patient
                          </option>

                          {patients.map(
                            (patient) => (
                              <option
                                key={patient.id}
                                value={patient.id}
                              >
                                {patient.name} —{" "}
                                {patient.id}
                              </option>
                            ),
                          )}
                        </select>

                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      </div>

                      {errors.patientId && (
                        <p className="mt-1 text-xs font-medium text-rose-500">
                          {errors.patientId}
                        </p>
                      )}

                      {patients.length === 0 && (
                        <p className="mt-2 text-xs font-medium text-amber-600">
                          No patients found. Please add a patient
                          from the Patients module first.
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <InputField
                        label="Patient Name"
                        value={form.patientName}
                        onChange={(value) =>
                          updateField(
                            "patientName",
                            value,
                          )
                        }
                        placeholder="Select a patient first"
                        error={errors.patientName}
                        required
                        readOnly
                      />

                      <InputField
                        label="Age"
                        value={form.age}
                        onChange={(value) =>
                          updateField(
                            "age",
                            value,
                          )
                        }
                        placeholder="From patient profile"
                        error={errors.age}
                        required
                        readOnly
                      />

                      <InputField
                        label="Gender"
                        value={form.gender}
                        onChange={(value) =>
                          updateField(
                            "gender",
                            value,
                          )
                        }
                        placeholder="Not provided"
                        readOnly
                      />

                      <InputField
                        label="Blood Group"
                        value={form.bloodGroup}
                        onChange={(value) =>
                          updateField(
                            "bloodGroup",
                            value,
                          )
                        }
                        placeholder="Not provided"
                        readOnly
                      />

                      <InputField
                        label="Phone"
                        value={form.phone}
                        onChange={(value) =>
                          updateField(
                            "phone",
                            value,
                          )
                        }
                        placeholder="From patient profile"
                        error={errors.phone}
                        required
                        readOnly
                      />

                      <InputField
                        label="Email"
                        value={form.email}
                        onChange={(value) =>
                          updateField(
                            "email",
                            value,
                          )
                        }
                        placeholder="Not provided"
                        error={errors.email}
                        readOnly
                      />
                    </div>

                    <InputField
                      label="Address"
                      value={form.address}
                      onChange={(value) =>
                        updateField(
                          "address",
                          value,
                        )
                      }
                      placeholder="Not provided"
                      readOnly
                    />
                  </div>
                </FormSection>

                {/* VISIT INFORMATION */}
                <FormSection
                  title="Visit Information"
                  description="Assign the doctor, department and visit dates."
                  icon={
                    <CalendarDays className="h-5 w-5" />
                  }
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <SelectField
                      label="Doctor"
                      value={form.doctor}
                      onChange={
                        handleDoctorChange
                      }
                      options={doctors.map(
                        (doctor) =>
                          doctor.name,
                      )}
                      placeholder="Select doctor"
                      error={errors.doctor}
                      required
                    />

                    <SelectField
                      label="Department"
                      value={form.department}
                      onChange={(value) =>
                        updateField(
                          "department",
                          value,
                        )
                      }
                      options={departments.filter(
                        (item) =>
                          item !==
                          "All Departments",
                      )}
                      placeholder="Select department"
                      error={
                        errors.department
                      }
                      required
                    />

                    <InputField
                      label="Visit Date"
                      value={form.visitDate}
                      onChange={(value) =>
                        updateField(
                          "visitDate",
                          value,
                        )
                      }
                      type="date"
                      error={
                        errors.visitDate
                      }
                      required
                    />

                    <InputField
                      label="Next Visit"
                      value={form.nextVisit}
                      onChange={(value) =>
                        updateField(
                          "nextVisit",
                          value,
                        )
                      }
                      type="date"
                    />
                  </div>
                </FormSection>

                {/* CLINICAL INFORMATION */}
                <FormSection
                  title="Clinical Information"
                  description="Record diagnosis, symptoms, allergies and medical history."
                  icon={
                    <ClipboardList className="h-5 w-5" />
                  }
                >
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <InputField
                      label="Diagnosis"
                      value={form.diagnosis}
                      onChange={(value) =>
                        updateField(
                          "diagnosis",
                          value,
                        )
                      }
                      placeholder="Enter primary diagnosis"
                      error={
                        errors.diagnosis
                      }
                      required
                    />

                    <InputField
                      label="Allergies"
                      value={form.allergies}
                      onChange={(value) =>
                        updateField(
                          "allergies",
                          value,
                        )
                      }
                      placeholder="Enter allergies if any"
                    />

                    <TextAreaField
                      label="Symptoms"
                      value={form.symptoms}
                      onChange={(value) =>
                        updateField(
                          "symptoms",
                          value,
                        )
                      }
                      placeholder="Describe patient's symptoms..."
                    />

                    <TextAreaField
                      label="Medical History"
                      value={
                        form.medicalHistory
                      }
                      onChange={(value) =>
                        updateField(
                          "medicalHistory",
                          value,
                        )
                      }
                      placeholder="Previous illnesses, surgeries, conditions..."
                    />
                  </div>
                </FormSection>

                {/* VITAL SIGNS */}
                <FormSection
                  title="Vital Signs"
                  description="Record the patient's current clinical measurements."
                  icon={
                    <Activity className="h-5 w-5" />
                  }
                >
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    <InputField
                      label="Blood Pressure"
                      value={
                        form.bloodPressure
                      }
                      onChange={(value) =>
                        updateField(
                          "bloodPressure",
                          value,
                        )
                      }
                      placeholder="120/80"
                    />

                    <InputField
                      label="Heart Rate"
                      value={form.heartRate}
                      onChange={(value) =>
                        updateField(
                          "heartRate",
                          value,
                        )
                      }
                      placeholder="72 bpm"
                    />

                    <InputField
                      label="Temperature"
                      value={
                        form.temperature
                      }
                      onChange={(value) =>
                        updateField(
                          "temperature",
                          value,
                        )
                      }
                      placeholder="98.6 °F"
                    />

                    <InputField
                      label="Oxygen Level"
                      value={
                        form.oxygenLevel
                      }
                      onChange={(value) =>
                        updateField(
                          "oxygenLevel",
                          value,
                        )
                      }
                      placeholder="98%"
                    />

                    <InputField
                      label="Weight"
                      value={form.weight}
                      onChange={(value) =>
                        updateField(
                          "weight",
                          value,
                        )
                      }
                      placeholder="70 kg"
                    />
                  </div>
                </FormSection>

                {/* TREATMENT */}
                <FormSection
                  title="Treatment & Medication"
                  description="Add prescribed medication, laboratory results and clinical notes."
                  icon={
                    <Pill className="h-5 w-5" />
                  }
                >
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <TextAreaField
                      label="Medications"
                      value={form.medications}
                      onChange={(value) =>
                        updateField(
                          "medications",
                          value,
                        )
                      }
                      placeholder="Enter medications and dosage..."
                    />

                    <TextAreaField
                      label="Lab Results"
                      value={form.labResults}
                      onChange={(value) =>
                        updateField(
                          "labResults",
                          value,
                        )
                      }
                      placeholder="Enter relevant laboratory results..."
                    />

                    <div className="lg:col-span-2">
                      <TextAreaField
                        label="Clinical Notes"
                        value={
                          form.clinicalNotes
                        }
                        onChange={(value) =>
                          updateField(
                            "clinicalNotes",
                            value,
                          )
                        }
                        placeholder="Add doctor's clinical notes, recommendations and observations..."
                        rows={4}
                      />
                    </div>
                  </div>
                </FormSection>

                {/* STATUS */}
                <FormSection
                  title="Record Status"
                  description="Set the current clinical status of this record."
                  icon={
                    <CheckCircle2 className="h-5 w-5" />
                  }
                >
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {(
                      [
                        "Stable",
                        "Follow-up",
                        "Critical",
                      ] as RecordStatus[]
                    ).map(
                      (item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() =>
                            updateField(
                              "status",
                              item,
                            )
                          }
                          className={`cursor-pointer rounded-xl border p-4 text-left transition ${
                            form.status ===
                            item
                              ? item ===
                                "Stable"
                                ? "border-emerald-300 bg-emerald-50"
                                : item ===
                                    "Critical"
                                  ? "border-rose-300 bg-rose-50"
                                  : "border-amber-300 bg-amber-50"
                              : "border-slate-200 bg-white hover:border-cyan-200 hover:bg-cyan-50/50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <StatusBadge
                              status={item}
                            />

                            {form.status ===
                              item && (
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm">
                                <Check className="h-4 w-4 text-cyan-600" />
                              </div>
                            )}
                          </div>
                        </button>
                      ),
                    )}
                  </div>
                </FormSection>

                {/* LIVE SUMMARY */}
                <div className="rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-blue-50 p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-cyan-600 shadow-sm">
                      <FileText className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-900">
                        Record Preview
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        Review the main details before saving.
                      </p>

                      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            Patient
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-800">
                            {form.patientName ||
                              "Not selected"}
                          </p>

                          <p className="text-xs text-slate-400">
                            {form.patientId ||
                              "No patient ID"}
                          </p>
                        </div>

                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            Doctor
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-800">
                            {form.doctor ||
                              "Not selected"}
                          </p>
                        </div>

                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            Diagnosis
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-800">
                            {form.diagnosis ||
                              "Not entered"}
                          </p>
                        </div>

                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            Status
                          </p>

                          <div className="mt-1">
                            <StatusBadge
                              status={
                                form.status
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* FOOTER */}
              <div className="sticky bottom-0 z-20 border-t border-slate-200 bg-white/95 shadow-[0_-8px_30px_rgba(15,23,42,0.06)] backdrop-blur">
                <div className="mx-auto flex max-w-[1500px] flex-col-reverse gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6 lg:px-8">
                  <button
                    type="button"
                    onClick={closeEditor}
                    disabled={isSaving}
                    className="w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSaving}
                    className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-100 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        {editingRecord
                          ? "Save Changes"
                          : "Create EMR"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VIEW MODAL */}
      <AnimatePresence>
        {viewRecord && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                setViewRecord(null);
              }
            }}
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 20,
                scale: 0.98,
              }}
              className="my-8 w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
            >
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-5 text-white sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-white/15 p-1">
                      <PatientAvatar
                        name={
                          viewRecord.patientName
                        }
                        size="lg"
                      />
                    </div>

                    <div>
                      <p className="text-xs font-medium text-white/75">
                        {viewRecord.patientId}
                      </p>

                      <h2 className="mt-1 text-xl font-bold sm:text-2xl">
                        {viewRecord.patientName}
                      </h2>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                          {viewRecord.department}
                        </span>

                        <StatusBadge
                          status={
                            viewRecord.status
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setViewRecord(null)
                    }
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="max-h-[70vh] overflow-y-auto p-5 sm:p-6">
                <div className="space-y-6">
                  {/* BASIC */}
                  <section>
                    <div className="mb-3 flex items-center gap-2">
                      <UserRound className="h-4 w-4 text-cyan-600" />

                      <h3 className="font-bold text-slate-900">
                        Patient Details
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <DetailItem
                        label="Age"
                        value={
                          viewRecord.age
                            ? `${viewRecord.age} years`
                            : ""
                        }
                      />

                      <DetailItem
                        label="Gender"
                        value={
                          viewRecord.gender
                        }
                      />

                      <DetailItem
                        label="Blood Group"
                        value={
                          viewRecord.bloodGroup
                        }
                      />

                      <DetailItem
                        label="Phone"
                        value={
                          viewRecord.phone
                        }
                      />

                      <DetailItem
                        label="Email"
                        value={
                          viewRecord.email
                        }
                        icon={
                          <Mail className="h-3 w-3" />
                        }
                      />

                      <DetailItem
                        label="Address"
                        value={
                          viewRecord.address
                        }
                        icon={
                          <MapPin className="h-3 w-3" />
                        }
                      />

                      <DetailItem
                        label="Doctor"
                        value={
                          viewRecord.doctor
                        }
                        icon={
                          <Stethoscope className="h-3 w-3" />
                        }
                      />

                      <DetailItem
                        label="Visit Date"
                        value={
                          viewRecord.visitDate
                        }
                        icon={
                          <CalendarDays className="h-3 w-3" />
                        }
                      />
                    </div>
                  </section>

                  {/* CLINICAL */}
                  <section>
                    <div className="mb-3 flex items-center gap-2">
                      <ClipboardList className="h-4 w-4 text-cyan-600" />

                      <h3 className="font-bold text-slate-900">
                        Clinical Information
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <DetailItem
                        label="Diagnosis"
                        value={
                          viewRecord.diagnosis
                        }
                      />

                      <DetailItem
                        label="Next Visit"
                        value={
                          viewRecord.nextVisit
                        }
                      />

                      <DetailItem
                        label="Symptoms"
                        value={
                          viewRecord.symptoms
                        }
                      />

                      <DetailItem
                        label="Allergies"
                        value={
                          viewRecord.allergies
                        }
                      />

                      <DetailItem
                        label="Medical History"
                        value={
                          viewRecord.medicalHistory
                        }
                      />

                      <DetailItem
                        label="Clinical Notes"
                        value={
                          viewRecord.clinicalNotes
                        }
                      />
                    </div>
                  </section>

                  {/* VITALS */}
                  <section>
                    <div className="mb-3 flex items-center gap-2">
                      <Activity className="h-4 w-4 text-cyan-600" />

                      <h3 className="font-bold text-slate-900">
                        Vital Signs
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                      <DetailItem
                        label="Blood Pressure"
                        value={
                          viewRecord.bloodPressure
                        }
                      />

                      <DetailItem
                        label="Heart Rate"
                        value={
                          viewRecord.heartRate
                        }
                      />

                      <DetailItem
                        label="Temperature"
                        value={
                          viewRecord.temperature
                        }
                      />

                      <DetailItem
                        label="Oxygen Level"
                        value={
                          viewRecord.oxygenLevel
                        }
                      />

                      <DetailItem
                        label="Weight"
                        value={
                          viewRecord.weight
                        }
                        icon={
                          <Weight className="h-3 w-3" />
                        }
                      />
                    </div>
                  </section>

                  {/* TREATMENT */}
                  <section>
                    <div className="mb-3 flex items-center gap-2">
                      <Pill className="h-4 w-4 text-cyan-600" />

                      <h3 className="font-bold text-slate-900">
                        Treatment & Medication
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <DetailItem
                        label="Medications"
                        value={
                          viewRecord.medications
                        }
                      />

                      <DetailItem
                        label="Lab Results"
                        value={
                          viewRecord.labResults
                        }
                      />
                    </div>
                  </section>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 p-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setViewRecord(null)
                  }
                  className="cursor-pointer rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() =>
                    openEditEMR(
                      viewRecord,
                    )
                  }
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:shadow-lg"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Record
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DELETE MODAL */}
      <AnimatePresence>
        {deleteRecord && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.96,
                y: 10,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.96,
                y: 10,
              }}
              className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                <Trash2 className="h-6 w-6" />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Delete Medical Record?
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Are you sure you want to delete the EMR
                for{" "}
                <span className="font-semibold text-slate-700">
                  {deleteRecord.patientName}
                </span>
                ? This action cannot be undone.
              </p>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setDeleteRecord(null)
                  }
                  className="cursor-pointer rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={confirmDelete}
                  className="cursor-pointer rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600"
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