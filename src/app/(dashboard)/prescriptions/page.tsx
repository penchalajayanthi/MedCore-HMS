"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Copy,
  Eye,
  FileText,
  HeartPulse,
  Loader2,
  Pill,
  Plus,
  Search,
  Stethoscope,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

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

type PatientRecord = {
  id: string;
  name: string;
  age: string;
  gender: string;
  phone: string;
  email: string;
  department: string;
  bloodGroup: string;
  allergies: string;
};

type DoctorRecord = {
  id: string;
  name: string;
  specialization: string;
  department: string;
};

type EMRRecord = {
  id?: string | number;
  patientId?: string | number;
  patientID?: string | number;
  patient_id?: string | number;

  patientName?: string;
  fullName?: string;
  name?: string;

  age?: string | number;
  gender?: string;
  bloodGroup?: string;
  bloodType?: string;
  department?: string;
  allergies?: string;

  doctor?: string;
  doctorName?: string;

  diagnosis?: string;
  visitDate?: string;

  clinicalNotes?: string;
  notes?: string;

  medications?: unknown;
};

/* -------------------------------------------------------------------------- */
/*                                STORAGE                                     */
/* -------------------------------------------------------------------------- */

const PRESCRIPTIONS_STORAGE_KEY = "medcore_prescriptions";
const PATIENTS_STORAGE_KEY = "medcore_patients";
const DOCTORS_STORAGE_KEY = "medcore_doctors";
const EMR_STORAGE_KEY = "medcore_emr";

const PRESCRIPTIONS_UPDATED_EVENT =
  "medcore-prescriptions-updated";

const PATIENTS_UPDATED_EVENT =
  "medcore-patients-updated";

const DOCTORS_UPDATED_EVENT =
  "medcore-doctors-updated";

const EMR_UPDATED_EVENT =
  "medcore-emr-updated";

/* -------------------------------------------------------------------------- */
/*                               DEMO DATA                                    */
/* -------------------------------------------------------------------------- */

const fallbackPatients: PatientRecord[] = [
  {
    id: "PT-1001",
    name: "Ananya Reddy",
    age: "29",
    gender: "Female",
    phone: "+91 98765 43210",
    email: "ananya@example.com",
    department: "Cardiology",
    bloodGroup: "O+",
    allergies: "",
  },
  {
    id: "PT-1002",
    name: "Rahul Kumar",
    age: "42",
    gender: "Male",
    phone: "+91 98765 12345",
    email: "rahul@example.com",
    department: "General Medicine",
    bloodGroup: "",
    allergies: "",
  },
  {
    id: "PT-1003",
    name: "Sneha Patel",
    age: "34",
    gender: "Female",
    phone: "+91 99887 66554",
    email: "sneha@example.com",
    department: "Dermatology",
    bloodGroup: "",
    allergies: "",
  },
  {
    id: "PT-1004",
    name: "Vikram Singh",
    age: "51",
    gender: "Male",
    phone: "+91 91234 56789",
    email: "vikram@example.com",
    department: "Orthopedics",
    bloodGroup: "",
    allergies: "",
  },
];

const fallbackDoctors: DoctorRecord[] = [
  {
    id: "DOC-001",
    name: "Dr. Ananya Reddy",
    specialization: "Cardiologist",
    department: "Cardiology",
  },
  {
    id: "DOC-002",
    name: "Dr. Rahul Sharma",
    specialization: "Neurologist",
    department: "Neurology",
  },
  {
    id: "DOC-003",
    name: "Dr. Priya Nair",
    specialization: "Pediatrician",
    department: "Pediatrics",
  },
  {
    id: "DOC-004",
    name: "Dr. Karthik Rao",
    specialization: "Orthopedic Surgeon",
    department: "Orthopedics",
  },
  {
    id: "DOC-005",
    name: "Dr. Sneha Kapoor",
    specialization: "Dermatologist",
    department: "Dermatology",
  },
  {
    id: "DOC-006",
    name: "Dr. Arjun Verma",
    specialization: "General Physician",
    department: "General Medicine",
  },
  {
    id: "DOC-007",
    name: "Dr. Meera Iyer",
    specialization: "Gynecologist",
    department: "Gynecology",
  },
  {
    id: "DOC-008",
    name: "Dr. Vikram Singh",
    specialization: "ENT Specialist",
    department: "ENT",
  },
];

const initialPrescriptions: Prescription[] = [
  {
    id: "RX-1001",
    patientId: "PT-1001",
    patientName: "Ananya Reddy",
    patientAge: "29",
    patientGender: "Female",
    doctorId: "DOC-001",
    doctorName: "Dr. Ananya Reddy",
    department: "Cardiology",
    prescriptionDate: "2026-09-20",
    diagnosis: "Hypertension",
    medicines: [
      {
        id: "MED-1001",
        name: "Amlodipine",
        dosage: "5 mg",
        frequency: "Once daily",
        duration: "30 days",
        route: "Oral",
        instructions: "Take after breakfast",
      },
      {
        id: "MED-1002",
        name: "Atorvastatin",
        dosage: "10 mg",
        frequency: "Once daily",
        duration: "30 days",
        route: "Oral",
        instructions: "Take after dinner",
      },
    ],
    notes: "Monitor blood pressure regularly.",
    status: "ACTIVE",
  },
  {
    id: "RX-1002",
    patientId: "PT-1002",
    patientName: "Rahul Kumar",
    patientAge: "42",
    patientGender: "Male",
    doctorId: "DOC-006",
    doctorName: "Dr. Arjun Verma",
    department: "General Medicine",
    prescriptionDate: "2026-09-19",
    diagnosis: "Acute fever",
    medicines: [
      {
        id: "MED-1003",
        name: "Paracetamol",
        dosage: "500 mg",
        frequency: "Twice daily",
        duration: "5 days",
        route: "Oral",
        instructions: "Take after food",
      },
    ],
    notes: "Maintain hydration.",
    status: "ACTIVE",
  },
  {
    id: "RX-1003",
    patientId: "PT-1003",
    patientName: "Sneha Patel",
    patientAge: "34",
    patientGender: "Female",
    doctorId: "DOC-005",
    doctorName: "Dr. Sneha Kapoor",
    department: "Dermatology",
    prescriptionDate: "2026-09-15",
    diagnosis: "Allergic dermatitis",
    medicines: [
      {
        id: "MED-1004",
        name: "Cetirizine",
        dosage: "10 mg",
        frequency: "Once daily",
        duration: "10 days",
        route: "Oral",
        instructions: "Take at night",
      },
    ],
    notes: "Avoid known allergens.",
    status: "COMPLETED",
  },
];

/* -------------------------------------------------------------------------- */
/*                              HELPER FUNCTIONS                              */
/* -------------------------------------------------------------------------- */

function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function normalizeId(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function normalizeName(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
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

function createEmptyMedicine(): Medicine {
  return {
    id: `MED-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 7)}`,
    name: "",
    dosage: "",
    frequency: "",
    duration: "",
    route: "Oral",
    instructions: "",
  };
}

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

/* -------------------------------------------------------------------------- */
/*                          PATIENT NORMALIZATION                             */
/* -------------------------------------------------------------------------- */

function normalizePatient(raw: any): PatientRecord | null {
  const id = String(
    raw?.id ??
      raw?.patientId ??
      raw?.patientID ??
      ""
  ).trim();

  if (!id) {
    return null;
  }

  const name = String(
    raw?.name ??
      raw?.fullName ??
      raw?.patientName ??
      ""
  ).trim();

  return {
    id,
    name,
    age: String(raw?.age ?? ""),
    gender: String(raw?.gender ?? ""),
    phone: String(
      raw?.phone ??
        raw?.mobile ??
        raw?.mobileNumber ??
        ""
    ),
    email: String(raw?.email ?? ""),
    department: String(raw?.department ?? ""),
    bloodGroup: String(
      raw?.bloodGroup ??
        raw?.bloodType ??
        ""
    ),
    allergies: String(raw?.allergies ?? ""),
  };
}

function loadPatients(): PatientRecord[] {
  try {
    const stored = localStorage.getItem(
      PATIENTS_STORAGE_KEY
    );

    if (!stored) {
      return fallbackPatients;
    }

    const parsed = JSON.parse(stored);

    const rawPatients = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed?.patients)
        ? parsed.patients
        : Array.isArray(parsed?.records)
          ? parsed.records
          : [];

    const normalized = rawPatients
      .map(normalizePatient)
      .filter(Boolean) as PatientRecord[];

    return normalized.length > 0
      ? normalized
      : fallbackPatients;
  } catch (error) {
    console.error("Failed to load patients:", error);

    return fallbackPatients;
  }
}

/* -------------------------------------------------------------------------- */
/*                           DOCTOR NORMALIZATION                             */
/* -------------------------------------------------------------------------- */

function convertDoctorId(id: unknown) {
  const value = String(id ?? "").trim();

  if (!value) {
    return "";
  }

  if (/^\d+$/.test(value)) {
    return `DOC-${value.padStart(3, "0")}`;
  }

  return value.toUpperCase();
}

function normalizeDoctor(raw: any): DoctorRecord | null {
  const id = convertDoctorId(
    raw?.id ??
      raw?.doctorId ??
      raw?.doctorID
  );

  if (!id) {
    return null;
  }

  return {
    id,
    name: String(
      raw?.name ??
        raw?.fullName ??
        raw?.doctorName ??
        ""
    ).trim(),
    specialization: String(
      raw?.specialization ??
        raw?.speciality ??
        raw?.specialty ??
        ""
    ).trim(),
    department: String(
      raw?.department ?? ""
    ).trim(),
  };
}

function loadDoctors(): DoctorRecord[] {
  try {
    const stored = localStorage.getItem(
      DOCTORS_STORAGE_KEY
    );

    if (!stored) {
      return fallbackDoctors;
    }

    const parsed = JSON.parse(stored);

    const rawDoctors = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed?.doctors)
        ? parsed.doctors
        : Array.isArray(parsed?.records)
          ? parsed.records
          : [];

    const normalized = rawDoctors
      .map(normalizeDoctor)
      .filter(Boolean) as DoctorRecord[];

    return normalized.length > 0
      ? normalized
      : fallbackDoctors;
  } catch (error) {
    console.error("Failed to load doctors:", error);

    return fallbackDoctors;
  }
}

/* -------------------------------------------------------------------------- */
/*                             EMR NORMALIZATION                              */
/* -------------------------------------------------------------------------- */

function getEMRPatientId(record: EMRRecord) {
  return normalizeId(
    record.patientId ??
      record.patientID ??
      record.patient_id
  );
}

function getEMRPatientName(record: EMRRecord) {
  return normalizeName(
    record.patientName ??
      record.fullName ??
      record.name
  );
}

function loadEMRRecords(): EMRRecord[] {
  try {
    const stored = localStorage.getItem(
      EMR_STORAGE_KEY
    );

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    if (Array.isArray(parsed)) {
      return parsed;
    }

    if (Array.isArray(parsed?.records)) {
      return parsed.records;
    }

    if (Array.isArray(parsed?.emrRecords)) {
      return parsed.emrRecords;
    }

    if (Array.isArray(parsed?.emr)) {
      return parsed.emr;
    }

    return [];
  } catch (error) {
    console.error("Failed to load EMR:", error);

    return [];
  }
}

/* -------------------------------------------------------------------------- */
/*                         PRESCRIPTION NORMALIZATION                         */
/* -------------------------------------------------------------------------- */

function loadPrescriptions() {
  try {
    const stored = localStorage.getItem(
      PRESCRIPTIONS_STORAGE_KEY
    );

    if (!stored) {
      localStorage.setItem(
        PRESCRIPTIONS_STORAGE_KEY,
        JSON.stringify(initialPrescriptions)
      );

      return initialPrescriptions;
    }

    const parsed = JSON.parse(stored);

    if (Array.isArray(parsed)) {
      return parsed as Prescription[];
    }

    if (Array.isArray(parsed?.prescriptions)) {
      return parsed.prescriptions as Prescription[];
    }

    return initialPrescriptions;
  } catch (error) {
    console.error(
      "Failed to load prescriptions:",
      error
    );

    return initialPrescriptions;
  }
}

function savePrescriptions(
  records: Prescription[]
) {
  localStorage.setItem(
    PRESCRIPTIONS_STORAGE_KEY,
    JSON.stringify(records)
  );

  window.dispatchEvent(
    new Event(PRESCRIPTIONS_UPDATED_EVENT)
  );
}

/* -------------------------------------------------------------------------- */
/*                              UI COMPONENTS                                 */
/* -------------------------------------------------------------------------- */

function StatCard({
  label,
  value,
  icon,
  description,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {label}
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

function StatusBadge({
  status,
}: {
  status: PrescriptionStatus;
}) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold ${getStatusClasses(
        status
      )}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] =
    useState<Prescription[]>([]);

  const [patients, setPatients] = useState<
    PatientRecord[]
  >([]);

  const [doctors, setDoctors] = useState<
    DoctorRecord[]
  >([]);

  const [emrRecords, setEMRRecords] = useState<
    EMRRecord[]
  >([]);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<"ALL" | PrescriptionStatus>("ALL");

  const [isEditorOpen, setIsEditorOpen] =
    useState(false);

  const [isViewOpen, setIsViewOpen] =
    useState(false);

  const [isDeleteOpen, setIsDeleteOpen] =
    useState(false);

  const [editingPrescription, setEditingPrescription] =
    useState<Prescription | null>(null);

  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);

  const [deleteTarget, setDeleteTarget] =
    useState<Prescription | null>(null);

  const [form, setForm] =
    useState<PrescriptionForm>(
      createEmptyForm()
    );

  const [isSaving, setIsSaving] =
    useState(false);

  /* ------------------------------------------------------------------------ */
  /*                              DATA LOADING                                */
  /* ------------------------------------------------------------------------ */

  const refreshAllData = () => {
    setPrescriptions(loadPrescriptions());
    setPatients(loadPatients());
    setDoctors(loadDoctors());
    setEMRRecords(loadEMRRecords());
  };

  useEffect(() => {
    refreshAllData();

    const handleDataUpdate = () => {
      refreshAllData();
    };

    window.addEventListener(
      PRESCRIPTIONS_UPDATED_EVENT,
      handleDataUpdate
    );

    window.addEventListener(
      PATIENTS_UPDATED_EVENT,
      handleDataUpdate
    );

    window.addEventListener(
      DOCTORS_UPDATED_EVENT,
      handleDataUpdate
    );

    window.addEventListener(
      EMR_UPDATED_EVENT,
      handleDataUpdate
    );

    window.addEventListener(
      "storage",
      handleDataUpdate
    );

    return () => {
      window.removeEventListener(
        PRESCRIPTIONS_UPDATED_EVENT,
        handleDataUpdate
      );

      window.removeEventListener(
        PATIENTS_UPDATED_EVENT,
        handleDataUpdate
      );

      window.removeEventListener(
        DOCTORS_UPDATED_EVENT,
        handleDataUpdate
      );

      window.removeEventListener(
        EMR_UPDATED_EVENT,
        handleDataUpdate
      );

      window.removeEventListener(
        "storage",
        handleDataUpdate
      );
    };
  }, []);

  /* ------------------------------------------------------------------------ */
  /*                             FILTERING                                    */
  /* ------------------------------------------------------------------------ */

  const filteredPrescriptions = useMemo(() => {
    const query = searchQuery
      .trim()
      .toLowerCase();

    return prescriptions.filter((item) => {
      const matchesSearch =
        !query ||
        item.id.toLowerCase().includes(query) ||
        item.patientName
          .toLowerCase()
          .includes(query) ||
        item.doctorName
          .toLowerCase()
          .includes(query) ||
        item.diagnosis
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "ALL" ||
        item.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    prescriptions,
    searchQuery,
    statusFilter,
  ]);

  const totalCount = prescriptions.length;

  const activeCount = prescriptions.filter(
    (item) => item.status === "ACTIVE"
  ).length;

  const completedCount =
    prescriptions.filter(
      (item) => item.status === "COMPLETED"
    ).length;

  const cancelledCount =
    prescriptions.filter(
      (item) => item.status === "CANCELLED"
    ).length;

  /* ------------------------------------------------------------------------ */
  /*                         SELECTED PATIENT                                 */
  /* ------------------------------------------------------------------------ */

  const selectedPatient = useMemo(() => {
    return patients.find(
      (patient) =>
        normalizeId(patient.id) ===
        normalizeId(form.patientId)
    );
  }, [patients, form.patientId]);

  /* ------------------------------------------------------------------------ */
  /*                          SELECTED DOCTOR                                 */
  /* ------------------------------------------------------------------------ */

  const selectedDoctor = useMemo(() => {
    return doctors.find(
      (doctor) =>
        normalizeId(doctor.id) ===
        normalizeId(form.doctorId)
    );
  }, [doctors, form.doctorId]);

  /* ------------------------------------------------------------------------ */
  /*                          PATIENT EMR LOOKUP                              */
  /* ------------------------------------------------------------------------ */

  const selectedPatientEMR = useMemo(() => {
    if (!selectedPatient) {
      return [];
    }

    const patientId =
      normalizeId(selectedPatient.id);

    const patientName =
      normalizeName(selectedPatient.name);

    const matched = emrRecords.filter(
      (record) => {
        const emrPatientId =
          getEMRPatientId(record);

        const emrPatientName =
          getEMRPatientName(record);

        /*
         * IMPORTANT:
         * Patient ID is the primary match.
         * Patient name is used as a fallback.
         */

        if (
          patientId &&
          emrPatientId &&
          patientId === emrPatientId
        ) {
          return true;
        }

        if (
          patientName &&
          emrPatientName &&
          patientName === emrPatientName
        ) {
          return true;
        }

        return false;
      }
    );

    return [...matched].sort((a, b) => {
      const dateA = a.visitDate
        ? new Date(
            `${a.visitDate}T00:00:00`
          ).getTime()
        : 0;

      const dateB = b.visitDate
        ? new Date(
            `${b.visitDate}T00:00:00`
          ).getTime()
        : 0;

      return dateB - dateA;
    });
  }, [
    selectedPatient,
    emrRecords,
  ]);

  const latestEMR =
    selectedPatientEMR[0] ?? null;

  /* ------------------------------------------------------------------------ */
  /*                         OPEN ADD EDITOR                                  */
  /* ------------------------------------------------------------------------ */

  const openAddEditor = () => {
    setEditingPrescription(null);
    setForm(createEmptyForm());
    setIsEditorOpen(true);
  };

  const openEditEditor = (
    prescription: Prescription
  ) => {
    setEditingPrescription(prescription);

    setForm({
      patientId: prescription.patientId,
      doctorId: prescription.doctorId,
      prescriptionDate:
        prescription.prescriptionDate,
      diagnosis: prescription.diagnosis,
      notes: prescription.notes,
      medicines: prescription.medicines.map(
        (medicine) => ({
          ...medicine,
        })
      ),
    });

    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    if (isSaving) return;

    setIsEditorOpen(false);
    setEditingPrescription(null);
    setForm(createEmptyForm());
  };

  /* ------------------------------------------------------------------------ */
  /*                         FORM FUNCTIONS                                   */
  /* ------------------------------------------------------------------------ */

  const updateForm = <
    K extends keyof PrescriptionForm
  >(
    field: K,
    value: PrescriptionForm[K]
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const updateMedicine = (
    medicineId: string,
    field: keyof Medicine,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      medicines: previous.medicines.map(
        (medicine) =>
          medicine.id === medicineId
            ? {
                ...medicine,
                [field]: value,
              }
            : medicine
      ),
    }));
  };

  const addMedicine = () => {
    setForm((previous) => ({
      ...previous,
      medicines: [
        ...previous.medicines,
        createEmptyMedicine(),
      ],
    }));
  };

  const removeMedicine = (
    medicineId: string
  ) => {
    setForm((previous) => {
      if (previous.medicines.length === 1) {
        return previous;
      }

      return {
        ...previous,
        medicines:
          previous.medicines.filter(
            (medicine) =>
              medicine.id !== medicineId
          ),
      };
    });
  };

  /* ------------------------------------------------------------------------ */
  /*                        PATIENT SELECTION                                 */
  /* ------------------------------------------------------------------------ */

  const handlePatientChange = (
    patientId: string
  ) => {
    setForm((previous) => ({
      ...previous,
      patientId,
    }));
  };

  const copyDiagnosisFromEMR = () => {
    if (!latestEMR?.diagnosis) {
      toast.error(
        "No diagnosis is available in the EMR."
      );
      return;
    }

    setForm((previous) => ({
      ...previous,
      diagnosis:
        previous.diagnosis.trim().length > 0
          ? previous.diagnosis
          : String(latestEMR.diagnosis),
    }));

    toast.success(
      "Diagnosis copied from the latest EMR."
    );
  };

  /* ------------------------------------------------------------------------ */
  /*                              VALIDATION                                  */
  /* ------------------------------------------------------------------------ */

  const validateForm = () => {
    if (!form.patientId) {
      toast.error("Please select a patient.");
      return false;
    }

    if (!form.doctorId) {
      toast.error("Please select a doctor.");
      return false;
    }

    if (!form.prescriptionDate) {
      toast.error(
        "Please select prescription date."
      );
      return false;
    }

    if (!form.diagnosis.trim()) {
      toast.error("Please enter diagnosis.");
      return false;
    }

    if (
      form.medicines.length === 0
    ) {
      toast.error(
        "Please add at least one medicine."
      );
      return false;
    }

    for (
      let index = 0;
      index < form.medicines.length;
      index++
    ) {
      const medicine =
        form.medicines[index];

      if (!medicine.name.trim()) {
        toast.error(
          `Enter medicine name for medicine ${
            index + 1
          }.`
        );
        return false;
      }

      if (!medicine.dosage.trim()) {
        toast.error(
          `Enter dosage for medicine ${
            index + 1
          }.`
        );
        return false;
      }

      if (!medicine.frequency.trim()) {
        toast.error(
          `Enter frequency for medicine ${
            index + 1
          }.`
        );
        return false;
      }

      if (!medicine.duration.trim()) {
        toast.error(
          `Enter duration for medicine ${
            index + 1
          }.`
        );
        return false;
      }

      if (!medicine.route.trim()) {
        toast.error(
          `Select route for medicine ${
            index + 1
          }.`
        );
        return false;
      }

      if (!medicine.instructions.trim()) {
        toast.error(
          `Enter instructions for medicine ${
            index + 1
          }.`
        );
        return false;
      }
    }

    return true;
  };

  /* ------------------------------------------------------------------------ */
  /*                              SAVE                                        */
  /* ------------------------------------------------------------------------ */

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    if (!selectedPatient) {
      toast.error(
        "Selected patient could not be found."
      );
      return;
    }

    if (!selectedDoctor) {
      toast.error(
        "Selected doctor could not be found."
      );
      return;
    }

    setIsSaving(true);

    try {
      const currentRecords =
        loadPrescriptions();

      const prescription: Prescription = {
        id:
          editingPrescription?.id ??
          `RX-${Date.now()}`,

        patientId:
          selectedPatient.id,

        patientName:
          selectedPatient.name,

        patientAge:
          selectedPatient.age,

        patientGender:
          selectedPatient.gender,

        doctorId:
          selectedDoctor.id,

        doctorName:
          selectedDoctor.name,

        department:
          selectedDoctor.department,

        prescriptionDate:
          form.prescriptionDate,

        diagnosis:
          form.diagnosis.trim(),

        medicines:
          form.medicines.map(
            (medicine) => ({
              ...medicine,
              name: medicine.name.trim(),
              dosage:
                medicine.dosage.trim(),
              frequency:
                medicine.frequency.trim(),
              duration:
                medicine.duration.trim(),
              route:
                medicine.route.trim(),
              instructions:
                medicine.instructions.trim(),
            })
          ),

        notes:
          form.notes.trim(),

        status:
          editingPrescription?.status ??
          "ACTIVE",
      };

      let updatedRecords: Prescription[];

      if (editingPrescription) {
        updatedRecords =
          currentRecords.map(
            (item) =>
              item.id ===
              editingPrescription.id
                ? prescription
                : item
          );

        toast.success(
          "Prescription updated successfully."
        );
      } else {
        updatedRecords = [
          prescription,
          ...currentRecords,
        ];

        toast.success(
          "Prescription created successfully."
        );
      }

      savePrescriptions(
        updatedRecords
      );

      setPrescriptions(
        updatedRecords
      );

      closeEditor();
    } catch (error) {
      console.error(
        "Failed to save prescription:",
        error
      );

      toast.error(
        "Failed to save prescription."
      );
    } finally {
      setIsSaving(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /*                              DELETE                                      */
  /* ------------------------------------------------------------------------ */

  const openDeleteModal = (
    prescription: Prescription
  ) => {
    setDeleteTarget(prescription);
    setIsDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteTarget(null);
    setIsDeleteOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) {
      return;
    }

    const updatedRecords =
      prescriptions.filter(
        (item) =>
          item.id !== deleteTarget.id
      );

    savePrescriptions(
      updatedRecords
    );

    setPrescriptions(
      updatedRecords
    );

    toast.success(
      "Prescription deleted successfully."
    );

    closeDeleteModal();
  };

  /* ------------------------------------------------------------------------ */
  /*                               VIEW                                       */
  /* ------------------------------------------------------------------------ */

  const openViewModal = (
    prescription: Prescription
  ) => {
    setSelectedPrescription(
      prescription
    );

    setIsViewOpen(true);
  };

  const closeViewModal = () => {
    setSelectedPrescription(null);
    setIsViewOpen(false);
  };

  /* ------------------------------------------------------------------------ */
  /*                               RESET                                      */
  /* ------------------------------------------------------------------------ */

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
  };

  /* ------------------------------------------------------------------------ */
  /*                                  JSX                                     */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-5 lg:p-7">
      <div className="mx-auto max-w-[1600px] space-y-5">
        {/* HEADER */}
        <motion.div
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="overflow-hidden rounded-3xl border border-cyan-100 bg-gradient-to-br from-cyan-600 via-sky-600 to-blue-700 p-5 text-white shadow-lg sm:p-7"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                  <Pill className="h-6 w-6" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">
                    Clinical Management
                  </p>

                  <h1 className="text-2xl font-bold sm:text-3xl">
                    Prescriptions
                  </h1>
                </div>
              </div>

              <p className="max-w-2xl text-sm leading-6 text-cyan-50">
                Create and manage patient prescriptions
                using connected patient, doctor and EMR
                information.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddEditor}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-cyan-700 shadow-md transition hover:bg-cyan-50 active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              Add Prescription
            </button>
          </div>
        </motion.div>

        {/* STATS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Prescriptions"
            value={totalCount}
            icon={
              <ClipboardList className="h-5 w-5" />
            }
            description="All prescription records"
          />

          <StatCard
            label="Active"
            value={activeCount}
            icon={
              <Activity className="h-5 w-5" />
            }
            description="Currently active"
          />

          <StatCard
            label="Completed"
            value={completedCount}
            icon={
              <CheckCircle2 className="h-5 w-5" />
            }
            description="Completed treatment plans"
          />

          <StatCard
            label="Cancelled"
            value={cancelledCount}
            icon={
              <AlertCircle className="h-5 w-5" />
            }
            description="Cancelled prescriptions"
          />
        </div>

        {/* FILTERS */}
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_220px_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(
                    event.target.value
                  )
                }
                placeholder="Search prescription, patient, doctor or diagnosis..."
                className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
              />
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as
                      | "ALL"
                      | PrescriptionStatus
                  )
                }
                className="h-11 w-full cursor-pointer appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 pr-10 text-sm font-medium text-slate-700 outline-none focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
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

              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex h-11 cursor-pointer items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Prescription
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Patient
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Doctor
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Diagnosis
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Medicines
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Date
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
                {filteredPrescriptions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-5 py-16 text-center"
                    >
                      <div className="mx-auto flex max-w-md flex-col items-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
                          <Pill className="h-7 w-7" />
                        </div>

                        <h3 className="mt-4 font-bold text-slate-900">
                          No prescriptions found
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Try changing your filters or
                          create a new prescription.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPrescriptions.map(
                    (prescription) => (
                      <tr
                        key={prescription.id}
                        className="border-b border-slate-100 transition hover:bg-cyan-50/30"
                      >
                        <td className="px-5 py-4">
                          <p className="font-bold text-slate-900">
                            {prescription.id}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {prescription.medicines.length}{" "}
                            medicine
                            {prescription.medicines.length !==
                            1
                              ? "s"
                              : ""}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-900">
                            {prescription.patientName}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {prescription.patientId}
                            {" • "}
                            {prescription.patientAge} yrs
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-900">
                            {prescription.doctorName}
                          </p>

                          <p className="mt-1 text-xs text-cyan-600">
                            {prescription.department}
                          </p>
                        </td>

                        <td className="max-w-[220px] px-5 py-4">
                          <p className="truncate font-medium text-slate-700">
                            {prescription.diagnosis}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-1.5">
                            {prescription.medicines
                              .slice(0, 2)
                              .map(
                                (medicine) => (
                                  <span
                                    key={
                                      medicine.id
                                    }
                                    className="rounded-full border border-cyan-100 bg-cyan-50 px-2.5 py-1 text-[11px] font-semibold text-cyan-700"
                                  >
                                    {
                                      medicine.name
                                    }
                                  </span>
                                )
                              )}

                            {prescription.medicines
                              .length > 2 && (
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                                +
                                {prescription.medicines.length -
                                  2}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                          {formatDate(
                            prescription.prescriptionDate
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge
                            status={
                              prescription.status
                            }
                          />
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                openViewModal(
                                  prescription
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
                                openEditEditor(
                                  prescription
                                )
                              }
                              className="inline-flex cursor-pointer items-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                openDeleteModal(
                                  prescription
                                )
                              }
                              className="inline-flex cursor-pointer items-center rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MOBILE / TABLET CARDS */}
        <div className="grid gap-4 md:hidden">
          {filteredPrescriptions.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white px-5 py-14 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
                <Pill className="h-7 w-7" />
              </div>

              <h3 className="mt-4 font-bold text-slate-900">
                No prescriptions found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your filters.
              </p>
            </div>
          ) : (
            filteredPrescriptions.map(
              (prescription) => (
                <div
                  key={prescription.id}
                  className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {prescription.id}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {formatDate(
                          prescription.prescriptionDate
                        )}
                      </p>
                    </div>

                    <StatusBadge
                      status={
                        prescription.status
                      }
                    />
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <div className="flex items-center gap-2">
                        <UserRound className="h-4 w-4 text-cyan-600" />

                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Patient
                        </p>
                      </div>

                      <p className="mt-1 font-bold text-slate-900">
                        {prescription.patientName}
                      </p>

                      <p className="text-xs text-slate-500">
                        {prescription.patientId}
                        {" • "}
                        {prescription.patientAge} yrs
                      </p>
                    </div>

                    <div className="rounded-2xl bg-cyan-50/60 p-3">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-cyan-600" />

                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Doctor
                        </p>
                      </div>

                      <p className="mt-1 font-bold text-slate-900">
                        {prescription.doctorName}
                      </p>

                      <p className="text-xs text-cyan-700">
                        {prescription.department}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Diagnosis
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {prescription.diagnosis}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Medicines
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {prescription.medicines.map(
                          (medicine) => (
                            <span
                              key={medicine.id}
                              className="rounded-full border border-cyan-100 bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-700"
                            >
                              {medicine.name}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        openViewModal(
                          prescription
                        )
                      }
                      className="inline-flex cursor-pointer items-center justify-center gap-1 rounded-xl border border-cyan-200 bg-cyan-50 px-2 py-2.5 text-xs font-bold text-cyan-700"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        openEditEditor(
                          prescription
                        )
                      }
                      className="cursor-pointer rounded-xl border border-slate-200 bg-white px-2 py-2.5 text-xs font-bold text-slate-700"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        openDeleteModal(
                          prescription
                        )
                      }
                      className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-red-200 bg-red-50 px-2 py-2.5 text-xs font-bold text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )
            )
          )}
        </div>
      </div>

      {/* ================================================================== */}
      {/*                         EDITOR MODAL                               */}
      {/* ================================================================== */}

      <AnimatePresence>
        {isEditorOpen && (
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
            className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm"
          >
            <div className="absolute inset-0 overflow-y-auto">
              <div className="min-h-full p-3 sm:p-5 lg:p-8">
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: 20,
                  }}
                  className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-2xl"
                >
                  {/* EDITOR HEADER */}
                  <div className="sticky top-0 z-20 border-b border-cyan-100 bg-white/95 px-4 py-4 backdrop-blur sm:px-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={closeEditor}
                          className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700"
                        >
                          <ArrowLeft className="h-5 w-5" />
                        </button>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-600">
                            Prescription Management
                          </p>

                          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                            {editingPrescription
                              ? "Edit Prescription"
                              : "Create Prescription"}
                          </h2>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={closeEditor}
                        className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-5 p-4 sm:p-6">
                    {/* PATIENT / DOCTOR */}
                    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                      <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                          <UserRound className="h-5 w-5" />
                        </div>

                        <div>
                          <h3 className="font-bold text-slate-900">
                            Patient & Doctor
                          </h3>

                          <p className="text-xs text-slate-500">
                            Select connected records from the HMS.
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-4 lg:grid-cols-2">
                        {/* PATIENT */}
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Patient
                          </label>

                          <div className="relative">
                            <select
                              value={form.patientId}
                              onChange={(event) =>
                                handlePatientChange(
                                  event.target.value
                                )
                              }
                              className="h-12 w-full cursor-pointer appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 pr-10 text-sm font-medium text-slate-800 outline-none focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                            >
                              <option value="">
                                Select patient
                              </option>

                              {patients.map(
                                (patient) => (
                                  <option
                                    key={
                                      patient.id
                                    }
                                    value={
                                      patient.id
                                    }
                                  >
                                    {patient.name} —{" "}
                                    {patient.id}
                                  </option>
                                )
                              )}
                            </select>

                            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          </div>

                          {selectedPatient && (
                            <div className="mt-3 grid grid-cols-2 gap-2">
                              <div className="rounded-xl bg-slate-50 p-3">
                                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                  Age
                                </p>
                                <p className="mt-1 text-sm font-bold text-slate-800">
                                  {selectedPatient.age ||
                                    "—"}
                                </p>
                              </div>

                              <div className="rounded-xl bg-slate-50 p-3">
                                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                  Gender
                                </p>
                                <p className="mt-1 text-sm font-bold text-slate-800">
                                  {selectedPatient.gender ||
                                    "—"}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* DOCTOR */}
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Doctor
                          </label>

                          <div className="relative">
                            <select
                              value={form.doctorId}
                              onChange={(event) =>
                                updateForm(
                                  "doctorId",
                                  event.target.value
                                )
                              }
                              className="h-12 w-full cursor-pointer appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 pr-10 text-sm font-medium text-slate-800 outline-none focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                            >
                              <option value="">
                                Select doctor
                              </option>

                              {doctors.map(
                                (doctor) => (
                                  <option
                                    key={
                                      doctor.id
                                    }
                                    value={
                                      doctor.id
                                    }
                                  >
                                    {doctor.name} —{" "}
                                    {
                                      doctor.department
                                    }
                                  </option>
                                )
                              )}
                            </select>

                            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          </div>

                          {selectedDoctor && (
                            <div className="mt-3 rounded-xl border border-cyan-100 bg-cyan-50 p-3">
                              <p className="text-[10px] font-bold uppercase tracking-wide text-cyan-600">
                                Department
                              </p>

                              <p className="mt-1 text-sm font-bold text-slate-900">
                                {
                                  selectedDoctor.department
                                }
                              </p>

                              {selectedDoctor.specialization && (
                                <p className="mt-1 text-xs text-slate-500">
                                  {
                                    selectedDoctor.specialization
                                  }
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </section>

                    {/* EMR CLINICAL CONTEXT */}
                    {selectedPatient && (
                      <section className="rounded-3xl border border-cyan-200 bg-gradient-to-br from-cyan-50 to-sky-50 p-4 shadow-sm sm:p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-cyan-600 shadow-sm">
                              <FileText className="h-5 w-5" />
                            </div>

                            <div>
                              <h3 className="font-bold text-slate-900">
                                Clinical Information from EMR
                              </h3>

                              <p className="mt-1 text-xs text-slate-500">
                                Connected EMR records for{" "}
                                <span className="font-semibold text-cyan-700">
                                  {
                                    selectedPatient.name
                                  }
                                </span>
                              </p>
                            </div>
                          </div>

                          {latestEMR?.diagnosis && (
                            <button
                              type="button"
                              onClick={
                                copyDiagnosisFromEMR
                              }
                              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-cyan-200 bg-white px-3 py-2 text-xs font-bold text-cyan-700 transition hover:bg-cyan-100"
                            >
                              <Copy className="h-3.5 w-3.5" />
                              Copy Diagnosis
                            </button>
                          )}
                        </div>

                        {selectedPatientEMR.length ===
                        0 ? (
                          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                            <div className="flex gap-3">
                              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                              <div>
                                <p className="font-bold text-amber-900">
                                  This patient has no EMR
                                  records
                                </p>

                                <p className="mt-1 text-sm leading-6 text-amber-700">
                                  No EMR record could be matched
                                  using this patient's ID or
                                  name. Create an EMR record
                                  for this patient first.
                                </p>

                                <p className="mt-2 text-xs text-amber-600">
                                  Patient ID:{" "}
                                  <span className="font-bold">
                                    {
                                      selectedPatient.id
                                    }
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-4 space-y-3">
                            <div className="rounded-2xl border border-white bg-white p-4 shadow-sm">
                              <div className="mb-3 flex items-center justify-between gap-3">
                                <div>
                                  <p className="text-xs font-bold uppercase tracking-wide text-cyan-600">
                                    Latest EMR
                                  </p>

                                  <p className="mt-1 text-sm font-bold text-slate-900">
                                    {latestEMR?.visitDate
                                      ? formatDate(
                                          String(
                                            latestEMR.visitDate
                                          )
                                        )
                                      : "Visit date not available"}
                                  </p>
                                </div>

                                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                                  RECORD FOUND
                                </span>
                              </div>

                              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="rounded-xl bg-slate-50 p-3">
                                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                    Diagnosis
                                  </p>

                                  <p className="mt-1 text-sm font-bold text-slate-800">
                                    {String(
                                      latestEMR?.diagnosis ??
                                        "Not available"
                                    )}
                                  </p>
                                </div>

                                <div className="rounded-xl bg-slate-50 p-3">
                                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                    Department
                                  </p>

                                  <p className="mt-1 text-sm font-bold text-slate-800">
                                    {String(
                                      latestEMR?.department ??
                                        "Not available"
                                    )}
                                  </p>
                                </div>

                                <div className="rounded-xl bg-slate-50 p-3">
                                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                    Blood Group
                                  </p>

                                  <p className="mt-1 text-sm font-bold text-slate-800">
                                    {String(
                                      latestEMR?.bloodGroup ??
                                        latestEMR?.bloodType ??
                                        "Not available"
                                    )}
                                  </p>
                                </div>

                                <div className="rounded-xl bg-slate-50 p-3">
                                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                    Allergies
                                  </p>

                                  <p className="mt-1 text-sm font-bold text-slate-800">
                                    {String(
                                      latestEMR?.allergies ??
                                        "Not available"
                                    )}
                                  </p>
                                </div>
                              </div>

                              {(latestEMR?.clinicalNotes ||
                                latestEMR?.notes) && (
                                <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                    Clinical Notes
                                  </p>

                                  <p className="mt-1 text-sm leading-6 text-slate-700">
                                    {String(
                                      latestEMR?.clinicalNotes ??
                                        latestEMR?.notes ??
                                        ""
                                    )}
                                  </p>
                                </div>
                              )}
                            </div>

                            {selectedPatientEMR.length >
                              1 && (
                              <p className="text-xs text-slate-500">
                                {
                                  selectedPatientEMR.length
                                }{" "}
                                EMR records found for this
                                patient. The latest record is
                                shown above.
                              </p>
                            )}
                          </div>
                        )}
                      </section>
                    )}

                    {/* PRESCRIPTION DETAILS */}
                    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                      <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                          <CalendarDays className="h-5 w-5" />
                        </div>

                        <div>
                          <h3 className="font-bold text-slate-900">
                            Prescription Details
                          </h3>

                          <p className="text-xs text-slate-500">
                            Record diagnosis and prescription date.
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-4 lg:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Prescription Date
                          </label>

                          <input
                            type="date"
                            value={
                              form.prescriptionDate
                            }
                            onChange={(event) =>
                              updateForm(
                                "prescriptionDate",
                                event.target.value
                              )
                            }
                            className="h-12 w-full cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Diagnosis
                          </label>

                          <input
                            value={form.diagnosis}
                            onChange={(event) =>
                              updateForm(
                                "diagnosis",
                                event.target.value
                              )
                            }
                            placeholder="Enter diagnosis"
                            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                          />
                        </div>
                      </div>
                    </section>

                    {/* MEDICINES */}
                    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                            <Pill className="h-5 w-5" />
                          </div>

                          <div>
                            <h3 className="font-bold text-slate-900">
                              Medicine Plan
                            </h3>

                            <p className="text-xs text-slate-500">
                              Add one or more medicines.
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={addMedicine}
                          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-2.5 text-xs font-bold text-cyan-700 transition hover:bg-cyan-100"
                        >
                          <Plus className="h-4 w-4" />
                          Add Medicine
                        </button>
                      </div>

                      <div className="space-y-4">
                        {form.medicines.map(
                          (
                            medicine,
                            index
                          ) => (
                            <div
                              key={medicine.id}
                              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                            >
                              <div className="mb-4 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-100 text-xs font-bold text-cyan-700">
                                    {index + 1}
                                  </span>

                                  <p className="text-sm font-bold text-slate-800">
                                    Medicine{" "}
                                    {index + 1}
                                  </p>
                                </div>

                                {form.medicines
                                  .length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeMedicine(
                                        medicine.id
                                      )
                                    }
                                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Remove
                                  </button>
                                )}
                              </div>

                              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                <div className="lg:col-span-2">
                                  <label className="mb-2 block text-xs font-bold text-slate-600">
                                    Medicine Name
                                  </label>

                                  <input
                                    value={
                                      medicine.name
                                    }
                                    onChange={(
                                      event
                                    ) =>
                                      updateMedicine(
                                        medicine.id,
                                        "name",
                                        event.target
                                          .value
                                      )
                                    }
                                    placeholder="e.g. Paracetamol"
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                                  />
                                </div>

                                <div>
                                  <label className="mb-2 block text-xs font-bold text-slate-600">
                                    Dosage
                                  </label>

                                  <input
                                    value={
                                      medicine.dosage
                                    }
                                    onChange={(
                                      event
                                    ) =>
                                      updateMedicine(
                                        medicine.id,
                                        "dosage",
                                        event.target
                                          .value
                                      )
                                    }
                                    placeholder="e.g. 500 mg"
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                                  />
                                </div>

                                <div>
                                  <label className="mb-2 block text-xs font-bold text-slate-600">
                                    Frequency
                                  </label>

                                  <input
                                    value={
                                      medicine.frequency
                                    }
                                    onChange={(
                                      event
                                    ) =>
                                      updateMedicine(
                                        medicine.id,
                                        "frequency",
                                        event.target
                                          .value
                                      )
                                    }
                                    placeholder="e.g. Twice daily"
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                                  />
                                </div>

                                <div>
                                  <label className="mb-2 block text-xs font-bold text-slate-600">
                                    Duration
                                  </label>

                                  <input
                                    value={
                                      medicine.duration
                                    }
                                    onChange={(
                                      event
                                    ) =>
                                      updateMedicine(
                                        medicine.id,
                                        "duration",
                                        event.target
                                          .value
                                      )
                                    }
                                    placeholder="e.g. 5 days"
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                                  />
                                </div>

                                <div>
                                  <label className="mb-2 block text-xs font-bold text-slate-600">
                                    Route
                                  </label>

                                  <div className="relative">
                                    <select
                                      value={
                                        medicine.route
                                      }
                                      onChange={(
                                        event
                                      ) =>
                                        updateMedicine(
                                          medicine.id,
                                          "route",
                                          event.target
                                            .value
                                        )
                                      }
                                      className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-9 text-sm outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                                    >
                                      <option value="Oral">
                                        Oral
                                      </option>
                                      <option value="Topical">
                                        Topical
                                      </option>
                                      <option value="Injection">
                                        Injection
                                      </option>
                                      <option value="Inhalation">
                                        Inhalation
                                      </option>
                                      <option value="Sublingual">
                                        Sublingual
                                      </option>
                                      <option value="Rectal">
                                        Rectal
                                      </option>
                                    </select>

                                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                  </div>
                                </div>

                                <div className="md:col-span-2 lg:col-span-3">
                                  <label className="mb-2 block text-xs font-bold text-slate-600">
                                    Instructions
                                  </label>

                                  <input
                                    value={
                                      medicine.instructions
                                    }
                                    onChange={(
                                      event
                                    ) =>
                                      updateMedicine(
                                        medicine.id,
                                        "instructions",
                                        event.target
                                          .value
                                      )
                                    }
                                    placeholder="e.g. Take after food"
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                                  />
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </section>

                    {/* NOTES */}
                    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                          <FileText className="h-5 w-5" />
                        </div>

                        <div>
                          <h3 className="font-bold text-slate-900">
                            Notes
                          </h3>

                          <p className="text-xs text-slate-500">
                            Add additional instructions or clinical notes.
                          </p>
                        </div>
                      </div>

                      <textarea
                        value={form.notes}
                        onChange={(event) =>
                          updateForm(
                            "notes",
                            event.target.value
                          )
                        }
                        rows={4}
                        placeholder="Enter additional notes..."
                        className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                      />
                    </section>

                    {/* SUMMARY */}
                    <section className="rounded-3xl border border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50 p-4 sm:p-5">
                      <div className="flex items-start gap-3">
                        <HeartPulse className="mt-0.5 h-5 w-5 shrink-0 text-cyan-600" />

                        <div className="min-w-0">
                          <h3 className="font-bold text-slate-900">
                            Prescription Summary
                          </h3>

                          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                Patient
                              </p>

                              <p className="mt-1 truncate text-sm font-bold text-slate-800">
                                {selectedPatient?.name ||
                                  "Not selected"}
                              </p>
                            </div>

                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                Doctor
                              </p>

                              <p className="mt-1 truncate text-sm font-bold text-slate-800">
                                {selectedDoctor?.name ||
                                  "Not selected"}
                              </p>
                            </div>

                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                Department
                              </p>

                              <p className="mt-1 truncate text-sm font-bold text-slate-800">
                                {selectedDoctor?.department ||
                                  "—"}
                              </p>
                            </div>

                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                Medicines
                              </p>

                              <p className="mt-1 text-sm font-bold text-slate-800">
                                {
                                  form.medicines.length
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>

                  {/* ACTION FOOTER */}
                  <div className="sticky bottom-0 z-20 border-t border-slate-200 bg-white/95 p-4 backdrop-blur sm:p-5">
                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                      <button
                        type="button"
                        onClick={closeEditor}
                        disabled={isSaving}
                        className="inline-flex cursor-pointer items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:from-cyan-700 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            {editingPrescription
                              ? "Update Prescription"
                              : "Create Prescription"}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================================================================== */}
      {/*                           VIEW MODAL                               */}
      {/* ================================================================== */}

      <AnimatePresence>
        {isViewOpen &&
          selectedPrescription && (
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
              className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/45 p-3 backdrop-blur-sm sm:p-5"
              onMouseDown={(event) => {
                if (
                  event.target ===
                  event.currentTarget
                ) {
                  closeViewModal();
                }
              }}
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
                className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl"
              >
                <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 p-4 backdrop-blur sm:p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-cyan-600">
                        Prescription Details
                      </p>

                      <h2 className="mt-1 text-xl font-bold text-slate-900">
                        {
                          selectedPrescription.id
                        }
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={closeViewModal}
                      className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-100"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-5 p-4 sm:p-6">
                  {/* PATIENT */}
                  <div className="rounded-2xl border border-cyan-100 bg-cyan-50/60 p-4">
                    <div className="flex items-center gap-3">
                      <UserRound className="h-5 w-5 text-cyan-600" />

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-cyan-600">
                          Patient
                        </p>

                        <p className="font-bold text-slate-900">
                          {
                            selectedPrescription.patientName
                          }
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Patient ID
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          {
                            selectedPrescription.patientId
                          }
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Age
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          {
                            selectedPrescription.patientAge
                          }
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Gender
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          {
                            selectedPrescription.patientGender ||
                              "—"
                          }
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Date
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          {formatDate(
                            selectedPrescription.prescriptionDate
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* DOCTOR */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center gap-3">
                      <Stethoscope className="h-5 w-5 text-blue-600" />

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                          Prescribed By
                        </p>

                        <p className="font-bold text-slate-900">
                          {
                            selectedPrescription.doctorName
                          }
                        </p>

                        <p className="text-xs text-slate-500">
                          {
                            selectedPrescription.department
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* DIAGNOSIS */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Diagnosis
                    </p>

                    <p className="mt-2 rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-800">
                      {
                        selectedPrescription.diagnosis
                      }
                    </p>
                  </div>

                  {/* MEDICINES */}
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <Pill className="h-5 w-5 text-emerald-600" />

                      <h3 className="font-bold text-slate-900">
                        Medicines
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {selectedPrescription.medicines.map(
                        (
                          medicine,
                          index
                        ) => (
                          <div
                            key={
                              medicine.id
                            }
                            className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-xs font-bold text-emerald-700">
                                {index + 1}
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="font-bold text-slate-900">
                                  {
                                    medicine.name
                                  }
                                </p>

                                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                  <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                      Dosage
                                    </p>

                                    <p className="mt-1 text-xs font-semibold text-slate-700">
                                      {
                                        medicine.dosage
                                      }
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                      Frequency
                                    </p>

                                    <p className="mt-1 text-xs font-semibold text-slate-700">
                                      {
                                        medicine.frequency
                                      }
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                      Duration
                                    </p>

                                    <p className="mt-1 text-xs font-semibold text-slate-700">
                                      {
                                        medicine.duration
                                      }
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                      Route
                                    </p>

                                    <p className="mt-1 text-xs font-semibold text-slate-700">
                                      {
                                        medicine.route
                                      }
                                    </p>
                                  </div>
                                </div>

                                <div className="mt-3 rounded-xl bg-white p-3">
                                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                    Instructions
                                  </p>

                                  <p className="mt-1 text-xs leading-5 text-slate-700">
                                    {
                                      medicine.instructions
                                    }
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* NOTES */}
                  {selectedPrescription.notes && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        Notes
                      </p>

                      <p className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                        {
                          selectedPrescription.notes
                        }
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <span className="text-sm font-semibold text-slate-600">
                      Status
                    </span>

                    <StatusBadge
                      status={
                        selectedPrescription.status
                      }
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
      </AnimatePresence>

      {/* ================================================================== */}
      {/*                         DELETE MODAL                               */}
      {/* ================================================================== */}

      <AnimatePresence>
        {isDeleteOpen &&
          deleteTarget && (
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
              className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
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
                className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                  <Trash2 className="h-6 w-6" />
                </div>

                <h2 className="mt-4 text-lg font-bold text-slate-900">
                  Delete Prescription?
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Are you sure you want to delete{" "}
                  <span className="font-bold text-slate-700">
                    {deleteTarget.id}
                  </span>
                  ? This action cannot be undone.
                </p>

                <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeDeleteModal}
                    className="cursor-pointer rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleDelete}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
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