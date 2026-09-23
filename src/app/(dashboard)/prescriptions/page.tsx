"use client";

import {
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
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
  HeartPulse,
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
  X,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type PrescriptionStatus =
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED"
  | "EXPIRED";

type Medicine = {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  route: string;
  instructions: string;
};

type Prescription = {
  id: string;

  patientId: string;
  patientName: string;
  patientAge: string;
  patientGender: string;

  doctorId: string;
  doctorName: string;
  department: string;

  prescriptionDate: string;
  diagnosis: string;
  medicines: Medicine[];

  notes: string;
  status: PrescriptionStatus;
};

type PrescriptionForm = {
  patientId: string;
  doctorId: string;
  prescriptionDate: string;
  diagnosis: string;
  notes: string;
  medicines: Medicine[];
};

type FormErrors = Partial<
  Record<
    "patientId" | "doctorId" | "prescriptionDate" | "diagnosis",
    string
  >
>;

/* =========================================================
   DEMO DATA
========================================================= */

const patients = [
  {
    id: "PT-1024",
    name: "Ananya Reddy",
    age: "29",
    gender: "Female",
    phone: "+91 98765 43210",
    email: "ananya@example.com",
  },
  {
    id: "PT-1025",
    name: "Rahul Kumar",
    age: "42",
    gender: "Male",
    phone: "+91 98765 12345",
    email: "rahul@example.com",
  },
  {
    id: "PT-1026",
    name: "Sneha Patel",
    age: "34",
    gender: "Female",
    phone: "+91 99887 66554",
    email: "sneha@example.com",
  },
  {
    id: "PT-1027",
    name: "Vikram Singh",
    age: "51",
    gender: "Male",
    phone: "+91 91234 56789",
    email: "vikram@example.com",
  },
  {
    id: "PT-1028",
    name: "Meena Devi",
    age: "38",
    gender: "Female",
    phone: "+91 98765 77889",
    email: "meena@example.com",
  },
];

const doctors = [
  {
    id: "DOC-001",
    name: "Dr. Priya Sharma",
    department: "Cardiology",
  },
  {
    id: "DOC-002",
    name: "Dr. Arjun Rao",
    department: "General Medicine",
  },
  {
    id: "DOC-003",
    name: "Dr. Meera Nair",
    department: "Dermatology",
  },
  {
    id: "DOC-004",
    name: "Dr. Karthik Reddy",
    department: "Orthopedics",
  },
  {
    id: "DOC-005",
    name: "Dr. Ananya Reddy",
    department: "Neurology",
  },
  {
    id: "DOC-006",
    name: "Dr. Sneha Kapoor",
    department: "Gynecology",
  },
];

/* =========================================================
   DATE
========================================================= */

function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* =========================================================
   EMPTY MEDICINE
========================================================= */

function createEmptyMedicine(): Medicine {
  return {
    id: `MED-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 7)}`,
    name: "",
    dosage: "",
    frequency: "",
    duration: "",
    route: "",
    instructions: "",
  };
}

/* =========================================================
   EMPTY FORM
========================================================= */

function createEmptyForm(): PrescriptionForm {
  return {
    patientId: "",
    doctorId: "",
    prescriptionDate: getTodayDate(),
    diagnosis: "",
    notes: "",
    medicines: [createEmptyMedicine()],
  };
}

/* =========================================================
   DEMO PRESCRIPTIONS
========================================================= */

const demoPrescriptions: Prescription[] = [
  {
    id: "RX-1001",
    patientId: "PT-1024",
    patientName: "Ananya Reddy",
    patientAge: "29",
    patientGender: "Female",
    doctorId: "DOC-001",
    doctorName: "Dr. Priya Sharma",
    department: "Cardiology",
    prescriptionDate: getTodayDate(),
    diagnosis: "Hypertension",
    medicines: [
      {
        id: "MED-1001",
        name: "Amlodipine",
        dosage: "5 mg",
        frequency: "Once daily",
        duration: "30 days",
        route: "Oral",
        instructions: "Take after breakfast.",
      },
      {
        id: "MED-1002",
        name: "Atorvastatin",
        dosage: "10 mg",
        frequency: "Once daily",
        duration: "30 days",
        route: "Oral",
        instructions: "Take after dinner.",
      },
    ],
    notes: "Monitor blood pressure regularly.",
    status: "ACTIVE",
  },
  {
    id: "RX-1002",
    patientId: "PT-1025",
    patientName: "Rahul Kumar",
    patientAge: "42",
    patientGender: "Male",
    doctorId: "DOC-002",
    doctorName: "Dr. Arjun Rao",
    department: "General Medicine",
    prescriptionDate: getTodayDate(),
    diagnosis: "Acute fever",
    medicines: [
      {
        id: "MED-1003",
        name: "Paracetamol",
        dosage: "500 mg",
        frequency: "Twice daily",
        duration: "5 days",
        route: "Oral",
        instructions: "Take after food.",
      },
    ],
    notes: "Maintain adequate hydration.",
    status: "ACTIVE",
  },
  {
    id: "RX-1003",
    patientId: "PT-1026",
    patientName: "Sneha Patel",
    patientAge: "34",
    patientGender: "Female",
    doctorId: "DOC-003",
    doctorName: "Dr. Meera Nair",
    department: "Dermatology",
    prescriptionDate: getTodayDate(),
    diagnosis: "Allergic dermatitis",
    medicines: [
      {
        id: "MED-1004",
        name: "Cetirizine",
        dosage: "10 mg",
        frequency: "Once daily",
        duration: "7 days",
        route: "Oral",
        instructions: "Take at night.",
      },
    ],
    notes: "Avoid identified skin irritants.",
    status: "COMPLETED",
  },
];

/* =========================================================
   STATUS HELPERS
========================================================= */

function getStatusClasses(status: PrescriptionStatus) {
  switch (status) {
    case "ACTIVE":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "COMPLETED":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "CANCELLED":
      return "border-red-200 bg-red-50 text-red-700";

    case "EXPIRED":
      return "border-amber-200 bg-amber-50 text-amber-700";

    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
}

function getStatusIcon(status: PrescriptionStatus) {
  switch (status) {
    case "ACTIVE":
      return <CheckCircle2 className="h-3.5 w-3.5" />;

    case "COMPLETED":
      return <Check className="h-3.5 w-3.5" />;

    case "CANCELLED":
      return <X className="h-3.5 w-3.5" />;

    case "EXPIRED":
      return <Clock3 className="h-3.5 w-3.5" />;

    default:
      return null;
  }
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({
  status,
}: {
  status: PrescriptionStatus;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] font-semibold ${getStatusClasses(
        status
      )}`}
    >
      {getStatusIcon(status)}

      {status}
    </span>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: number;
  icon: ReactNode;
  accent: string;
}) {
  return (
    <div
      className={`rounded-2xl border bg-white p-4 shadow-sm ${accent}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
          {icon}
        </div>

        <Pill className="h-4 w-4 text-slate-200" />
      </div>

      <p className="mt-4 text-2xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs font-medium text-slate-500">
        {label}
      </p>
    </div>
  );
}

/* =========================================================
   SECTION
========================================================= */

function FormSection({
  icon,
  title,
  description,
  children,
  color = "cyan",
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  children: ReactNode;
  color?: "cyan" | "blue" | "emerald" | "violet" | "amber";
}) {
  const colors = {
    cyan: {
      border: "border-l-cyan-500",
      icon: "bg-cyan-50 text-cyan-600",
      title: "text-cyan-950",
    },
    blue: {
      border: "border-l-blue-500",
      icon: "bg-blue-50 text-blue-600",
      title: "text-blue-950",
    },
    emerald: {
      border: "border-l-emerald-500",
      icon: "bg-emerald-50 text-emerald-600",
      title: "text-emerald-950",
    },
    violet: {
      border: "border-l-violet-500",
      icon: "bg-violet-50 text-violet-600",
      title: "text-violet-950",
    },
    amber: {
      border: "border-l-amber-500",
      icon: "bg-amber-50 text-amber-600",
      title: "text-amber-950",
    },
  };

  const theme = colors[color];

  return (
    <section
      className={`rounded-2xl border border-slate-200 border-l-4 ${theme.border} bg-white p-4 shadow-sm sm:p-5 lg:p-6`}
    >
      <div className="mb-5 flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${theme.icon}`}
        >
          {icon}
        </div>

        <div>
          <h2 className={`font-semibold ${theme.title}`}>
            {title}
          </h2>

          {description && (
            <p className="mt-1 text-xs leading-5 text-slate-500">
              {description}
            </p>
          )}
        </div>
      </div>

      {children}
    </section>
  );
}

/* =========================================================
   INPUT
========================================================= */

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}

        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className={`h-11 w-full rounded-xl border bg-slate-50 px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 ${
          error
            ? "border-red-300 focus:border-red-400 focus:ring-red-100"
            : "border-slate-200 focus:border-cyan-400 focus:ring-cyan-100"
        }`}
      />

      {error && (
        <p className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   SELECT
========================================================= */

function SelectField({
  label,
  value,
  onChange,
  options,
  required,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: {
    value: string;
    label: string;
  }[];
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}

        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className={`h-11 w-full appearance-none rounded-xl border bg-slate-50 px-4 pr-10 text-sm text-slate-700 outline-none transition focus:bg-white focus:ring-2 ${
            error
              ? "border-red-300 focus:border-red-400 focus:ring-red-100"
              : "border-slate-200 focus:border-cyan-400 focus:ring-cyan-100"
          }`}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   TEXTAREA
========================================================= */

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <textarea
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        rows={4}
        placeholder={placeholder}
        className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-100"
      />
    </div>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] =
    useState<Prescription[]>(() => {
      if (typeof window === "undefined") {
        return demoPrescriptions;
      }

      try {
        const stored = localStorage.getItem(
          "medcore_prescriptions"
        );

        if (!stored) {
          localStorage.setItem(
            "medcore_prescriptions",
            JSON.stringify(demoPrescriptions)
          );

          return demoPrescriptions;
        }

        const parsed = JSON.parse(stored);

        return Array.isArray(parsed)
          ? parsed
          : demoPrescriptions;
      } catch {
        return demoPrescriptions;
      }
    });

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<"ALL" | PrescriptionStatus>(
      "ALL"
    );

  const [editorOpen, setEditorOpen] =
    useState(false);

  const [editingPrescription, setEditingPrescription] =
    useState<Prescription | null>(null);

  const [viewPrescription, setViewPrescription] =
    useState<Prescription | null>(null);

  const [deletePrescription, setDeletePrescription] =
    useState<Prescription | null>(null);

  const [form, setForm] =
    useState<PrescriptionForm>(
      createEmptyForm()
    );

  const [errors, setErrors] =
    useState<FormErrors>({});

  const [isSaving, setIsSaving] =
    useState(false);

  const savingRef = useRef(false);

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredPrescriptions =
    useMemo(() => {
      const query = search
        .trim()
        .toLowerCase();

      return prescriptions.filter(
        (prescription) => {
          const matchesSearch =
            !query ||
            prescription.id
              .toLowerCase()
              .includes(query) ||
            prescription.patientName
              .toLowerCase()
              .includes(query) ||
            prescription.doctorName
              .toLowerCase()
              .includes(query) ||
            prescription.diagnosis
              .toLowerCase()
              .includes(query);

          const matchesStatus =
            statusFilter === "ALL" ||
            prescription.status ===
              statusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      prescriptions,
      search,
      statusFilter,
    ]);

  /* =======================================================
     STATS
  ======================================================= */

  const stats = useMemo(() => {
    return {
      total: prescriptions.length,

      active: prescriptions.filter(
        (item) =>
          item.status === "ACTIVE"
      ).length,

      completed: prescriptions.filter(
        (item) =>
          item.status === "COMPLETED"
      ).length,

      cancelled: prescriptions.filter(
        (item) =>
          item.status === "CANCELLED"
      ).length,
    };
  }, [prescriptions]);

  /* =======================================================
     SELECTED PATIENT / DOCTOR
  ======================================================= */

  const selectedPatient = useMemo(
    () =>
      patients.find(
        (patient) =>
          patient.id === form.patientId
      ),
    [form.patientId]
  );

  const selectedDoctor = useMemo(
    () =>
      doctors.find(
        (doctor) =>
          doctor.id === form.doctorId
      ),
    [form.doctorId]
  );

  /* =======================================================
     FORM COMPLETE
  ======================================================= */

  const isFormComplete = useMemo(() => {
    const medicineComplete =
      form.medicines.length > 0 &&
      form.medicines.every(
        (medicine) =>
          medicine.name.trim() &&
          medicine.dosage.trim() &&
          medicine.frequency.trim() &&
          medicine.duration.trim() &&
          medicine.route.trim()
      );

    return Boolean(
      form.patientId &&
        form.doctorId &&
        form.prescriptionDate &&
        form.diagnosis.trim() &&
        medicineComplete
    );
  }, [form]);

  /* =======================================================
     UPDATE FORM
  ======================================================= */

  function updateForm(
    field: keyof PrescriptionForm,
    value: string | Medicine[]
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]:
        undefined,
    }));
  }

  /* =======================================================
     OPEN CREATE
  ======================================================= */

  function openCreate() {
    setEditingPrescription(null);
    setForm(createEmptyForm());
    setErrors({});
    setEditorOpen(true);
  }

  /* =======================================================
     OPEN EDIT
  ======================================================= */

  function openEdit(
    prescription: Prescription
  ) {
    setEditingPrescription(
      prescription
    );

    setForm({
      patientId:
        prescription.patientId,
      doctorId:
        prescription.doctorId,
      prescriptionDate:
        prescription.prescriptionDate,
      diagnosis:
        prescription.diagnosis,
      notes:
        prescription.notes,
      medicines:
        prescription.medicines.map(
          (medicine) => ({
            ...medicine,
          })
        ),
    });

    setErrors({});
    setViewPrescription(null);
    setEditorOpen(true);
  }

  /* =======================================================
     CLOSE EDITOR
  ======================================================= */

  function closeEditor() {
    if (isSaving) return;

    setEditorOpen(false);
    setEditingPrescription(null);
    setErrors({});
  }

  /* =======================================================
     MEDICINE UPDATE
  ======================================================= */

  function updateMedicine(
    medicineId: string,
    field: keyof Medicine,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      medicines:
        previous.medicines.map(
          (medicine) =>
            medicine.id === medicineId
              ? {
                  ...medicine,
                  [field]: value,
                }
              : medicine
        ),
    }));
  }

  /* =======================================================
     ADD MEDICINE
  ======================================================= */

  function addMedicine() {
    setForm((previous) => ({
      ...previous,
      medicines: [
        ...previous.medicines,
        createEmptyMedicine(),
      ],
    }));
  }

  /* =======================================================
     REMOVE MEDICINE
  ======================================================= */

  function removeMedicine(
    medicineId: string
  ) {
    if (form.medicines.length === 1) {
      toast.error(
        "At least one medicine is required"
      );
      return;
    }

    setForm((previous) => ({
      ...previous,
      medicines:
        previous.medicines.filter(
          (medicine) =>
            medicine.id !== medicineId
        ),
    }));
  }

  /* =======================================================
     VALIDATE
  ======================================================= */

  function validateForm() {
    const nextErrors: FormErrors = {};

    if (!form.patientId) {
      nextErrors.patientId =
        "Please select a patient.";
    }

    if (!form.doctorId) {
      nextErrors.doctorId =
        "Please select a doctor.";
    }

    if (!form.prescriptionDate) {
      nextErrors.prescriptionDate =
        "Please select a date.";
    }

    if (!form.diagnosis.trim()) {
      nextErrors.diagnosis =
        "Diagnosis is required.";
    }

    return nextErrors;
  }

  /* =======================================================
     SAVE
  ======================================================= */

  function handleSave() {
    if (savingRef.current) return;

    const validationErrors =
      validateForm();

    if (
      Object.keys(validationErrors)
        .length > 0
    ) {
      setErrors(validationErrors);

      toast.error(
        "Please complete the required information."
      );

      return;
    }

    const incompleteMedicine =
      form.medicines.some(
        (medicine) =>
          !medicine.name.trim() ||
          !medicine.dosage.trim() ||
          !medicine.frequency.trim() ||
          !medicine.duration.trim() ||
          !medicine.route.trim()
      );

    if (incompleteMedicine) {
      toast.error(
        "Please complete all required medicine details."
      );

      return;
    }

    savingRef.current = true;
    setIsSaving(true);

    const patient = patients.find(
      (item) =>
        item.id === form.patientId
    );

    const doctor = doctors.find(
      (item) =>
        item.id === form.doctorId
    );

    if (!patient || !doctor) {
      savingRef.current = false;
      setIsSaving(false);

      toast.error(
        "Patient or doctor could not be found."
      );

      return;
    }

    const prescription: Prescription =
      {
        id:
          editingPrescription?.id ||
          `RX-${Date.now()}`,

        patientId:
          patient.id,

        patientName:
          patient.name,

        patientAge:
          patient.age,

        patientGender:
          patient.gender,

        doctorId:
          doctor.id,

        doctorName:
          doctor.name,

        department:
          doctor.department,

        prescriptionDate:
          form.prescriptionDate,

        diagnosis:
          form.diagnosis.trim(),

        medicines:
          form.medicines,

        notes:
          form.notes.trim(),

        status:
          editingPrescription?.status ||
          "ACTIVE",
      };

    let updated: Prescription[];

    if (editingPrescription) {
      updated =
        prescriptions.map(
          (item) =>
            item.id ===
            editingPrescription.id
              ? prescription
              : item
        );

      toast.success(
        "Prescription updated successfully"
      );
    } else {
      updated = [
        prescription,
        ...prescriptions,
      ];

      toast.success(
        "Prescription created successfully"
      );
    }

    setPrescriptions(updated);

    localStorage.setItem(
      "medcore_prescriptions",
      JSON.stringify(updated)
    );

    setEditorOpen(false);
    setEditingPrescription(null);
    setForm(createEmptyForm());
    setErrors({});

    savingRef.current = false;
    setIsSaving(false);
  }

  /* =======================================================
     DELETE
  ======================================================= */

  function confirmDelete() {
    if (!deletePrescription) return;

    const updated =
      prescriptions.filter(
        (item) =>
          item.id !==
          deletePrescription.id
      );

    setPrescriptions(updated);

    localStorage.setItem(
      "medcore_prescriptions",
      JSON.stringify(updated)
    );

    toast.success(
      "Prescription deleted successfully"
    );

    setDeletePrescription(null);
  }

  /* =======================================================
     RESET FILTERS
  ======================================================= */

  function resetFilters() {
    setSearch("");
    setStatusFilter("ALL");
  }

  const hasActiveFilters =
    search.trim() !== "" ||
    statusFilter !== "ALL";

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: -15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="overflow-hidden rounded-3xl border border-cyan-200 bg-gradient-to-r from-cyan-700 via-cyan-600 to-blue-600 shadow-lg shadow-cyan-500/10"
        >
          <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between lg:p-7">
            <div className="flex items-start gap-4 text-white">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-sm backdrop-blur">
                <Pill className="h-6 w-6" />
              </div>

              <div>
                <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-cyan-100">
                  <HeartPulse className="h-4 w-4" />
                  Hospital Management
                  <span>/</span>
                  Prescriptions
                </div>

                <h1 className="text-2xl font-bold sm:text-3xl">
                  Prescriptions
                </h1>

                <p className="mt-1 max-w-2xl text-sm text-cyan-50">
                  Create, manage and review patient
                  medication prescriptions.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={openCreate}
              className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/20 bg-white px-5 text-sm font-semibold text-cyan-700 shadow-lg transition hover:bg-cyan-50 active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              New Prescription
            </button>
          </div>
        </motion.div>

        {/* =================================================
            STATS
        ================================================= */}

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Total Prescriptions"
            value={stats.total}
            icon={
              <FileText className="h-5 w-5" />
            }
            accent="border-l-4 border-l-cyan-500"
          />

          <StatCard
            label="Active"
            value={stats.active}
            icon={
              <Activity className="h-5 w-5" />
            }
            accent="border-l-4 border-l-emerald-500"
          />

          <StatCard
            label="Completed"
            value={stats.completed}
            icon={
              <CheckCircle2 className="h-5 w-5" />
            }
            accent="border-l-4 border-l-blue-500"
          />

          <StatCard
            label="Cancelled"
            value={stats.cancelled}
            icon={
              <AlertCircle className="h-5 w-5" />
            }
            accent="border-l-4 border-l-red-500"
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
          className="rounded-2xl border border-blue-100 border-l-4 border-l-blue-500 bg-white p-4 shadow-sm sm:p-5"
        >
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px_auto]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search prescription, patient, doctor or diagnosis..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-100"
              />
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target
                      .value as
                      | "ALL"
                      | PrescriptionStatus
                  )
                }
                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 pr-10 text-sm text-slate-700 outline-none focus:border-cyan-400 focus:bg-white"
              >
                <option value="ALL">
                  All Statuses
                </option>

                <option value="ACTIVE">
                  Active
                </option>

                <option value="COMPLETED">
                  Completed
                </option>

                <option value="CANCELLED">
                  Cancelled
                </option>

                <option value="EXPIRED">
                  Expired
                </option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>

            <button
              type="button"
              onClick={resetFilters}
              disabled={!hasActiveFilters}
              className={`h-11 rounded-xl border px-4 text-sm font-semibold transition ${
                hasActiveFilters
                  ? "cursor-pointer border-slate-200 bg-white text-slate-600 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                  : "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
              }`}
            >
              Reset Filters
            </button>
          </div>
        </motion.section>

        {/* =================================================
            LIST
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
          className="overflow-hidden rounded-2xl border border-slate-200 border-l-4 border-l-cyan-500 bg-white shadow-sm"
        >
          <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Prescription Records
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {filteredPrescriptions.length}{" "}
                  prescription
                  {filteredPrescriptions.length !==
                  1
                    ? "s"
                    : ""}{" "}
                  displayed
                </p>
              </div>

              <div className="hidden items-center gap-2 rounded-xl bg-cyan-50 px-3 py-2 sm:flex">
                <Pill className="h-4 w-4 text-cyan-600" />

                <span className="text-xs font-semibold text-cyan-700">
                  Medication Management
                </span>
              </div>
            </div>
          </div>

          {filteredPrescriptions.length ===
          0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50">
                <Pill className="h-8 w-8 text-cyan-500" />
              </div>

              <h3 className="mt-4 font-semibold text-slate-800">
                No prescriptions found
              </h3>

              <p className="mt-1 max-w-md text-sm text-slate-500">
                No prescription records match the
                current filters.
              </p>

              <button
                type="button"
                onClick={openCreate}
                className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700 active:scale-[0.98]"
              >
                <Plus className="h-4 w-4" />
                Create New Prescription
              </button>
            </div>
          ) : (
            <>
              {/* DESKTOP */}

              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70 text-left">
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Prescription
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Patient
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Doctor
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Medicines
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Status
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredPrescriptions.map(
                      (prescription) => (
                        <tr
                          key={prescription.id}
                          className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                                <Pill className="h-5 w-5" />
                              </div>

                              <div>
                                <p className="text-sm font-semibold text-slate-800">
                                  {prescription.id}
                                </p>

                                <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                                  <CalendarDays className="h-3 w-3" />
                                  {
                                    prescription.prescriptionDate
                                  }
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <UserRound className="h-4 w-4 text-slate-400" />

                              <div>
                                <p className="text-sm font-medium text-slate-700">
                                  {
                                    prescription.patientName
                                  }
                                </p>

                                <p className="text-xs text-slate-400">
                                  {
                                    prescription.patientId
                                  }
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <Stethoscope className="h-4 w-4 text-slate-400" />

                              <div>
                                <p className="text-sm font-medium text-slate-700">
                                  {
                                    prescription.doctorName
                                  }
                                </p>

                                <p className="text-xs text-slate-400">
                                  {
                                    prescription.department
                                  }
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <div>
                              <p className="text-sm font-semibold text-slate-700">
                                {
                                  prescription
                                    .medicines
                                    .length
                                }{" "}
                                medicine
                                {prescription
                                  .medicines
                                  .length !==
                                1
                                  ? "s"
                                  : ""}
                              </p>

                              <p className="mt-1 max-w-[220px] truncate text-xs text-slate-400">
                                {prescription.medicines
                                  .map(
                                    (medicine) =>
                                      medicine.name
                                  )
                                  .join(", ")}
                              </p>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <StatusBadge
                              status={
                                prescription.status
                              }
                            />
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setViewPrescription(
                                    prescription
                                  )
                                }
                                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-600"
                                title="View"
                              >
                                <Eye className="h-4 w-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  openEdit(
                                    prescription
                                  )
                                }
                                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                                title="Edit"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  setDeletePrescription(
                                    prescription
                                  )
                                }
                                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* MOBILE / TABLET */}

              <div className="divide-y divide-slate-100 lg:hidden">
                {filteredPrescriptions.map(
                  (prescription) => (
                    <div
                      key={prescription.id}
                      className="p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                            <Pill className="h-5 w-5" />
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-800">
                              {prescription.id}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {
                                prescription.prescriptionDate
                              }
                            </p>
                          </div>
                        </div>

                        <StatusBadge
                          status={
                            prescription.status
                          }
                        />
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <InfoItem
                          icon={
                            <UserRound className="h-4 w-4" />
                          }
                          label="Patient"
                          value={`${prescription.patientName} (${prescription.patientId})`}
                        />

                        <InfoItem
                          icon={
                            <Stethoscope className="h-4 w-4" />
                          }
                          label="Doctor"
                          value={`${prescription.doctorName} • ${prescription.department}`}
                        />

                        <InfoItem
                          icon={
                            <FileText className="h-4 w-4" />
                          }
                          label="Diagnosis"
                          value={
                            prescription.diagnosis
                          }
                        />

                        <InfoItem
                          icon={
                            <Pill className="h-4 w-4" />
                          }
                          label="Medicines"
                          value={`${prescription.medicines.length} medicine${
                            prescription.medicines.length !==
                            1
                              ? "s"
                              : ""
                          }`}
                        />
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setViewPrescription(
                              prescription
                            )
                          }
                          className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            openEdit(
                              prescription
                            )
                          }
                          className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                        >
                          <Edit3 className="h-4 w-4" />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setDeletePrescription(
                              prescription
                            )
                          }
                          className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            </>
          )}
        </motion.section>
      </div>

      {/* ===================================================
          CREATE / EDIT EDITOR
      =================================================== */}

      <AnimatePresence>
        {editorOpen && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="fixed inset-0 z-50 flex flex-col bg-slate-50"
          >
            {/* HEADER */}

            <div className="shrink-0 border-b border-cyan-700/30 bg-gradient-to-r from-cyan-700 via-cyan-600 to-blue-600 text-white shadow-md">
              <div className="flex min-h-[76px] items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
                <button
                  type="button"
                  onClick={closeEditor}
                  disabled={isSaving}
                  className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>

                <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 sm:flex">
                  <FileHeart className="h-6 w-6" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-lg font-bold sm:text-xl">
                      {editingPrescription
                        ? "Edit Prescription"
                        : "Create New Prescription"}
                    </h1>

                    <span className="rounded-full border border-white/20 bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide">
                      {editingPrescription
                        ? "Edit Mode"
                        : "New Prescription"}
                    </span>
                  </div>

                  <p className="mt-0.5 text-xs text-cyan-50">
                    Complete the prescription information
                    and medication details.
                  </p>
                </div>
              </div>
            </div>

            {/* BODY */}

            <div className="min-h-0 flex-1 overflow-y-auto bg-gradient-to-b from-slate-50 to-white">
              <div className="mx-auto w-full max-w-[1500px] p-3 sm:p-5 md:p-6 lg:p-8">
                <div className="grid gap-5 lg:grid-cols-[270px_minmax(0,1fr)] lg:gap-6">

                  {/* LEFT PREVIEW */}

                  <aside className="h-fit lg:sticky lg:top-6">
                    <div className="rounded-2xl border border-cyan-200 border-t-4 border-t-cyan-500 bg-white p-4 shadow-sm sm:p-5">
                      <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                          <Pill className="h-5 w-5" />
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Prescription
                          </p>

                          <p className="text-sm font-bold text-slate-800">
                            Live Preview
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-lg font-bold text-white">
                          {selectedPatient?.name
                            ?.charAt(0)
                            .toUpperCase() || "P"}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {selectedPatient?.name ||
                              "Patient Name"}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            {selectedPatient
                              ? `${selectedPatient.id} • ${selectedPatient.age} yrs`
                              : "Patient ID"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 space-y-3">
                        <PreviewItem
                          icon={
                            <Stethoscope className="h-4 w-4" />
                          }
                          label="Doctor"
                          value={
                            selectedDoctor?.name ||
                            "Not selected"
                          }
                        />

                        <PreviewItem
                          icon={
                            <MapPin className="h-4 w-4" />
                          }
                          label="Department"
                          value={
                            selectedDoctor?.department ||
                            "Not selected"
                          }
                        />

                        <PreviewItem
                          icon={
                            <CalendarDays className="h-4 w-4" />
                          }
                          label="Date"
                          value={
                            form.prescriptionDate ||
                            "Not selected"
                          }
                        />

                        <PreviewItem
                          icon={
                            <Pill className="h-4 w-4" />
                          }
                          label="Medicines"
                          value={`${form.medicines.length} medicine${
                            form.medicines.length !==
                            1
                              ? "s"
                              : ""
                          }`}
                        />
                      </div>

                      <div className="mt-5 rounded-xl bg-cyan-50 p-3">
                        <div className="flex items-center gap-2 text-cyan-700">
                          <ShieldIcon />
                          <span className="text-xs font-semibold">
                            Prescription Safety
                          </span>
                        </div>

                        <p className="mt-1.5 text-[11px] leading-5 text-cyan-700/80">
                          Required patient, doctor and
                          medicine information must be
                          completed before creation.
                        </p>
                      </div>
                    </div>
                  </aside>

                  {/* RIGHT FORM */}

                  <div className="space-y-5">

                    {/* PATIENT & DOCTOR */}

                    <FormSection
                      icon={
                        <Users className="h-5 w-5" />
                      }
                      title="Patient & Doctor"
                      description="Select the patient and doctor responsible for this prescription."
                      color="cyan"
                    >
                      <div className="grid gap-4 md:grid-cols-2">
                        <SelectField
                          label="Patient"
                          value={form.patientId}
                          onChange={(value) =>
                            updateForm(
                              "patientId",
                              value
                            )
                          }
                          required
                          error={
                            errors.patientId
                          }
                          options={[
                            {
                              value: "",
                              label:
                                "Select Patient",
                            },
                            ...patients.map(
                              (patient) => ({
                                value:
                                  patient.id,
                                label: `${patient.name} — ${patient.id}`,
                              })
                            ),
                          ]}
                        />

                        <SelectField
                          label="Doctor"
                          value={form.doctorId}
                          onChange={(value) =>
                            updateForm(
                              "doctorId",
                              value
                            )
                          }
                          required
                          error={
                            errors.doctorId
                          }
                          options={[
                            {
                              value: "",
                              label:
                                "Select Doctor",
                            },
                            ...doctors.map(
                              (doctor) => ({
                                value:
                                  doctor.id,
                                label: `${doctor.name} — ${doctor.department}`,
                              })
                            ),
                          ]}
                        />
                      </div>

                      {selectedPatient && (
                        <div className="mt-4 rounded-xl border border-cyan-100 bg-cyan-50/60 p-3">
                          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-cyan-800">
                            <span className="font-semibold">
                              {selectedPatient.name}
                            </span>

                            <span>
                              {selectedPatient.id}
                            </span>

                            <span>
                              {selectedPatient.age} years
                            </span>

                            <span>
                              {selectedPatient.gender}
                            </span>

                            <span>
                              {selectedPatient.phone}
                            </span>
                          </div>
                        </div>
                      )}
                    </FormSection>

                    {/* PRESCRIPTION DETAILS */}

                    <FormSection
                      icon={
                        <CalendarDays className="h-5 w-5" />
                      }
                      title="Prescription Details"
                      description="Add the clinical reason and prescription date."
                      color="blue"
                    >
                      <div className="grid gap-4 md:grid-cols-2">
                        <InputField
                          label="Prescription Date"
                          type="date"
                          value={
                            form.prescriptionDate
                          }
                          onChange={(value) =>
                            updateForm(
                              "prescriptionDate",
                              value
                            )
                          }
                          required
                          error={
                            errors.prescriptionDate
                          }
                        />

                        <InputField
                          label="Diagnosis"
                          value={
                            form.diagnosis
                          }
                          onChange={(value) =>
                            updateForm(
                              "diagnosis",
                              value
                            )
                          }
                          placeholder="e.g. Hypertension"
                          required
                          error={
                            errors.diagnosis
                          }
                        />
                      </div>
                    </FormSection>

                    {/* MEDICINES */}

                    <FormSection
                      icon={
                        <Pill className="h-5 w-5" />
                      }
                      title="Medication Plan"
                      description="Add the medicines, dosage, frequency, duration and instructions."
                      color="emerald"
                    >
                      <div className="space-y-4">
                        {form.medicines.map(
                          (
                            medicine,
                            index
                          ) => (
                            <motion.div
                              key={
                                medicine.id
                              }
                              initial={{
                                opacity: 0,
                                y: 8,
                              }}
                              animate={{
                                opacity: 1,
                                y: 0,
                              }}
                              className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-4 sm:p-5"
                            >
                              <div className="mb-4 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-xs font-bold text-emerald-700">
                                    {index +
                                      1}
                                  </div>

                                  <div>
                                    <p className="text-sm font-semibold text-slate-800">
                                      Medicine{" "}
                                      {index +
                                        1}
                                    </p>

                                    <p className="text-[10px] text-slate-400">
                                      Medication
                                      details
                                    </p>
                                  </div>
                                </div>

                                {form.medicines
                                  .length >
                                  1 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeMedicine(
                                        medicine.id
                                      )
                                    }
                                    className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-xl border border-red-200 bg-white px-3 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Remove
                                  </button>
                                )}
                              </div>

                              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                <InputField
                                  label="Medicine Name"
                                  value={
                                    medicine.name
                                  }
                                  onChange={(
                                    value
                                  ) =>
                                    updateMedicine(
                                      medicine.id,
                                      "name",
                                      value
                                    )
                                  }
                                  placeholder="e.g. Amlodipine"
                                  required
                                />

                                <InputField
                                  label="Dosage"
                                  value={
                                    medicine.dosage
                                  }
                                  onChange={(
                                    value
                                  ) =>
                                    updateMedicine(
                                      medicine.id,
                                      "dosage",
                                      value
                                    )
                                  }
                                  placeholder="e.g. 5 mg"
                                  required
                                />

                                <SelectField
                                  label="Frequency"
                                  value={
                                    medicine.frequency
                                  }
                                  onChange={(
                                    value
                                  ) =>
                                    updateMedicine(
                                      medicine.id,
                                      "frequency",
                                      value
                                    )
                                  }
                                  required
                                  options={[
                                    {
                                      value:
                                        "",
                                      label:
                                        "Select Frequency",
                                    },
                                    {
                                      value:
                                        "Once daily",
                                      label:
                                        "Once daily",
                                    },
                                    {
                                      value:
                                        "Twice daily",
                                      label:
                                        "Twice daily",
                                    },
                                    {
                                      value:
                                        "Three times daily",
                                      label:
                                        "Three times daily",
                                    },
                                    {
                                      value:
                                        "Every 6 hours",
                                      label:
                                        "Every 6 hours",
                                    },
                                    {
                                      value:
                                        "Every 8 hours",
                                      label:
                                        "Every 8 hours",
                                    },
                                    {
                                      value:
                                        "As needed",
                                      label:
                                        "As needed",
                                    },
                                  ]}
                                />

                                <InputField
                                  label="Duration"
                                  value={
                                    medicine.duration
                                  }
                                  onChange={(
                                    value
                                  ) =>
                                    updateMedicine(
                                      medicine.id,
                                      "duration",
                                      value
                                    )
                                  }
                                  placeholder="e.g. 7 days"
                                  required
                                />

                                <SelectField
                                  label="Route"
                                  value={
                                    medicine.route
                                  }
                                  onChange={(
                                    value
                                  ) =>
                                    updateMedicine(
                                      medicine.id,
                                      "route",
                                      value
                                    )
                                  }
                                  required
                                  options={[
                                    {
                                      value:
                                        "",
                                      label:
                                        "Select Route",
                                    },
                                    {
                                      value:
                                        "Oral",
                                      label:
                                        "Oral",
                                    },
                                    {
                                      value:
                                        "Topical",
                                      label:
                                        "Topical",
                                    },
                                    {
                                      value:
                                        "Injection",
                                      label:
                                        "Injection",
                                    },
                                    {
                                      value:
                                        "Inhalation",
                                      label:
                                        "Inhalation",
                                    },
                                    {
                                      value:
                                        "Ophthalmic",
                                      label:
                                        "Ophthalmic",
                                    },
                                    {
                                      value:
                                        "Other",
                                      label:
                                        "Other",
                                    },
                                  ]}
                                />

                                <InputField
                                  label="Instructions"
                                  value={
                                    medicine.instructions
                                  }
                                  onChange={(
                                    value
                                  ) =>
                                    updateMedicine(
                                      medicine.id,
                                      "instructions",
                                      value
                                    )
                                  }
                                  placeholder="e.g. Take after food"
                                />
                              </div>
                            </motion.div>
                          )
                        )}

                        <button
                          type="button"
                          onClick={addMedicine}
                          className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/50 px-4 text-sm font-semibold text-emerald-700 transition hover:border-emerald-400 hover:bg-emerald-50 sm:w-auto"
                        >
                          <Plus className="h-4 w-4" />
                          Add Another Medicine
                        </button>
                      </div>
                    </FormSection>

                    {/* NOTES */}

                    <FormSection
                      icon={
                        <ClipboardList className="h-5 w-5" />
                      }
                      title="Clinical Notes"
                      description="Add additional instructions or clinical notes for this prescription."
                      color="violet"
                    >
                      <TextAreaField
                        label="Notes / Instructions"
                        value={form.notes}
                        onChange={(value) =>
                          updateForm(
                            "notes",
                            value
                          )
                        }
                        placeholder="Enter additional instructions, precautions or follow-up notes..."
                      />
                    </FormSection>

                    {/* SUMMARY */}

                    <FormSection
                      icon={
                        <FileHeart className="h-5 w-5" />
                      }
                      title="Prescription Summary"
                      description="Review the information before creating the prescription."
                      color="amber"
                    >
                      <div className="grid gap-3 sm:grid-cols-2">
                        <SummaryItem
                          label="Patient"
                          value={
                            selectedPatient?.name ||
                            "Not selected"
                          }
                        />

                        <SummaryItem
                          label="Doctor"
                          value={
                            selectedDoctor?.name ||
                            "Not selected"
                          }
                        />

                        <SummaryItem
                          label="Department"
                          value={
                            selectedDoctor?.department ||
                            "Not selected"
                          }
                        />

                        <SummaryItem
                          label="Diagnosis"
                          value={
                            form.diagnosis ||
                            "Not entered"
                          }
                        />

                        <SummaryItem
                          label="Medicine Count"
                          value={`${form.medicines.length} medicine${
                            form.medicines.length !==
                            1
                              ? "s"
                              : ""
                          }`}
                        />

                        <SummaryItem
                          label="Status"
                          value={
                            editingPrescription?.status ||
                            "ACTIVE"
                          }
                        />
                      </div>
                    </FormSection>
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER */}

            <div className="shrink-0 border-t border-slate-200 bg-white px-3 py-3 shadow-[0_-4px_20px_rgba(15,23,42,0.05)] sm:px-6">
              <div className="mx-auto flex w-full max-w-[1500px] flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
                  <Pill className="h-4 w-4 text-cyan-500" />

                  <span>
                    {editingPrescription
                      ? "Review the prescription before saving"
                      : "Complete the required information to create"}
                  </span>
                </div>

                <div className="flex w-full gap-2 sm:w-auto">
                  <button
                    type="button"
                    onClick={closeEditor}
                    disabled={isSaving}
                    className="h-11 flex-1 cursor-pointer rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={
                      !isFormComplete ||
                      isSaving
                    }
                    className={`inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold text-white shadow-lg transition sm:flex-none ${
                      !isFormComplete ||
                      isSaving
                        ? "cursor-not-allowed bg-slate-300 shadow-none"
                        : "cursor-pointer bg-gradient-to-r from-cyan-700 via-cyan-600 to-blue-600 shadow-cyan-500/20 hover:from-cyan-800 hover:via-cyan-700 hover:to-blue-700 active:scale-[0.98]"
                    }`}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />

                        {editingPrescription
                          ? "Save Changes"
                          : "Create Prescription"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================================================
          VIEW MODAL
      =================================================== */}

      <AnimatePresence>
        {viewPrescription && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-3 backdrop-blur-sm sm:p-5"
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.97,
                y: 10,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.97,
                y: 10,
              }}
              className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
              {/* MODAL HEADER */}

              <div className="shrink-0 bg-gradient-to-r from-cyan-700 via-cyan-600 to-blue-600 px-5 py-5 text-white sm:px-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                      <Pill className="h-6 w-6" />
                    </div>

                    <div>
                      <p className="text-xs text-cyan-100">
                        Prescription
                      </p>

                      <h2 className="text-lg font-bold">
                        {
                          viewPrescription.id
                        }
                      </h2>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setViewPrescription(
                        null
                      )
                    }
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-white/20 bg-white/10 transition hover:bg-white/20"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* MODAL CONTENT */}

              <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6">
                <div className="space-y-4">

                  {/* PATIENT */}

                  <div className="rounded-2xl border border-cyan-100 border-l-4 border-l-cyan-500 bg-white p-4 shadow-sm sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
                          <UserRound className="h-6 w-6" />
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Patient
                          </p>

                          <p className="text-base font-bold text-slate-800">
                            {
                              viewPrescription.patientName
                            }
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {
                              viewPrescription.patientId
                            }{" "}
                            •{" "}
                            {
                              viewPrescription.patientAge
                            }{" "}
                            yrs •{" "}
                            {
                              viewPrescription.patientGender
                            }
                          </p>
                        </div>
                      </div>

                      <StatusBadge
                        status={
                          viewPrescription.status
                        }
                      />
                    </div>
                  </div>

                  {/* DOCTOR / DETAILS */}

                  <div className="grid gap-4 md:grid-cols-2">
                    <DetailCard
                      icon={
                        <Stethoscope className="h-5 w-5" />
                      }
                      label="Prescribed By"
                      value={
                        viewPrescription.doctorName
                      }
                      secondary={
                        viewPrescription.department
                      }
                      color="blue"
                    />

                    <DetailCard
                      icon={
                        <CalendarDays className="h-5 w-5" />
                      }
                      label="Prescription Date"
                      value={
                        viewPrescription.prescriptionDate
                      }
                      secondary={
                        viewPrescription.diagnosis
                      }
                      color="violet"
                    />
                  </div>

                  {/* MEDICINES */}

                  <div className="rounded-2xl border border-emerald-100 border-l-4 border-l-emerald-500 bg-white p-4 shadow-sm sm:p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                        <Pill className="h-5 w-5" />
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-800">
                          Medicines
                        </h3>

                        <p className="text-xs text-slate-400">
                          {
                            viewPrescription
                              .medicines
                              .length
                          }{" "}
                          prescribed item
                          {viewPrescription
                            .medicines
                            .length !==
                          1
                            ? "s"
                            : ""}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {viewPrescription.medicines.map(
                        (medicine, index) => (
                          <div
                            key={
                              medicine.id
                            }
                            className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-xs font-bold text-emerald-700">
                                {index +
                                  1}
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                  <h4 className="font-semibold text-slate-800">
                                    {
                                      medicine.name
                                    }
                                  </h4>

                                  <span className="text-xs font-semibold text-emerald-700">
                                    {
                                      medicine.dosage
                                    }
                                  </span>
                                </div>

                                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                                  <SmallDetail
                                    label="Frequency"
                                    value={
                                      medicine.frequency
                                    }
                                  />

                                  <SmallDetail
                                    label="Duration"
                                    value={
                                      medicine.duration
                                    }
                                  />

                                  <SmallDetail
                                    label="Route"
                                    value={
                                      medicine.route
                                    }
                                  />
                                </div>

                                {medicine.instructions.trim() && (
                                  <div className="mt-3 rounded-xl border border-emerald-100 bg-white p-3">
                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                      Instructions
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-slate-600">
                                      {
                                        medicine.instructions
                                      }
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* NOTES */}

                  {viewPrescription.notes.trim() && (
                    <div className="rounded-2xl border border-violet-100 border-l-4 border-l-violet-500 bg-white p-4 shadow-sm sm:p-5">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                          <ClipboardList className="h-5 w-5" />
                        </div>

                        <div>
                          <h3 className="font-semibold text-slate-800">
                            Clinical Notes
                          </h3>

                          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
                            {
                              viewPrescription.notes
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* MODAL FOOTER */}

              <div className="shrink-0 border-t border-slate-200 bg-white p-3 sm:p-4">
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      setViewPrescription(
                        null
                      )
                    }
                    className="h-11 cursor-pointer rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    Close
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      openEdit(
                        viewPrescription
                      )
                    }
                    className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-700 via-cyan-600 to-blue-600 px-6 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:from-cyan-800 hover:via-cyan-700 hover:to-blue-700"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit Prescription
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================================================
          DELETE CONFIRMATION
      =================================================== */}

      <AnimatePresence>
        {deletePrescription && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.96,
              }}
              className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <Trash2 className="h-6 w-6" />
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-900">
                Delete Prescription?
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Are you sure you want to delete{" "}
                <strong className="text-slate-700">
                  {deletePrescription.id}
                </strong>{" "}
                for{" "}
                <strong className="text-slate-700">
                  {
                    deletePrescription.patientName
                  }
                </strong>
                ?
              </p>

              <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setDeletePrescription(
                      null
                    )
                  }
                  className="h-11 cursor-pointer rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={confirmDelete}
                  className="h-11 cursor-pointer rounded-xl bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  Delete Prescription
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* =========================================================
   PREVIEW ITEM
========================================================= */

function PreviewItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5 text-slate-400">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-0.5 truncate text-xs font-medium text-slate-700">
          {value}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   SUMMARY ITEM
========================================================= */

function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-700">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   DETAIL CARD
========================================================= */

function DetailCard({
  icon,
  label,
  value,
  secondary,
  color,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  secondary?: string;
  color: "blue" | "violet";
}) {
  const theme =
    color === "blue"
      ? "border-blue-100 border-l-blue-500 bg-blue-50/20 text-blue-600"
      : "border-violet-100 border-l-violet-500 bg-violet-50/20 text-violet-600";

  return (
    <div
      className={`rounded-2xl border border-l-4 bg-white p-4 shadow-sm ${theme}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-800">
            {value}
          </p>

          {secondary && (
            <p className="mt-1 text-xs text-slate-400">
              {secondary}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SMALL DETAIL
========================================================= */

function SmallDetail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-2.5">
      <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-xs font-semibold text-slate-700">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   INFO ITEM
========================================================= */

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
    <div className="rounded-xl bg-slate-50 p-3">
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

/* =========================================================
   SHIELD ICON
========================================================= */

function ShieldIcon() {
  return (
    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white">
      <CheckCircle2 className="h-4 w-4" />
    </div>
  );
}