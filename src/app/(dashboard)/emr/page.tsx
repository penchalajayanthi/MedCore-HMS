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
  Edit3,
  Eye,
  FileText,
  HeartPulse,
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

type EMRRecord = {
  id: string;

  patientId: string;
  patientName: string;
  age: string;
  gender: string;
  bloodGroup: string;
  phone: string;
  email: string;
  address: string;

  department: string;
  allergies: string;

  doctorId: string;
  doctorName: string;

  visitDate: string;
  diagnosis: string;
  clinicalNotes: string;

  medications: string;

  createdAt?: string;
  updatedAt?: string;
};

type PatientRecord = {
  id: string;
  name: string;
  age: string;
  gender: string;
  bloodGroup: string;
  phone: string;
  email: string;
  address: string;
  department: string;
  allergies: string;
};

type DoctorRecord = {
  id: string;
  name: string;
  specialization: string;
  department: string;

  phone?: string;
  email?: string;
  experience?: string;
  consultationFee?: string;
  qualification?: string;
  status?: string;
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

  department: string;
  allergies: string;

  doctorId: string;
  doctorName: string;

  visitDate: string;
  diagnosis: string;
  clinicalNotes: string;

  medications: string;
};

/* -------------------------------------------------------------------------- */
/*                                STORAGE                                     */
/* -------------------------------------------------------------------------- */

const PATIENTS_STORAGE_KEY = "medcore_patients";
const DOCTORS_STORAGE_KEY = "medcore_doctors";
const EMR_STORAGE_KEY = "medcore_emr";

const PATIENTS_UPDATED_EVENT =
  "medcore-patients-updated";

const DOCTORS_UPDATED_EVENT =
  "medcore-doctors-updated";

const EMR_UPDATED_EVENT =
  "medcore-emr-updated";

/* -------------------------------------------------------------------------- */
/*                              FALLBACK DATA                                 */
/* -------------------------------------------------------------------------- */

const fallbackPatients: PatientRecord[] = [
  {
    id: "PT-1001",
    name: "Ananya Reddy",
    age: "29",
    gender: "",
    bloodGroup: "",
    phone: "+91 98765 43210",
    email: "ananya@example.com",
    address: "",
    department: "",
    allergies: "",
  },
  {
    id: "PT-1002",
    name: "Rahul Kumar",
    age: "42",
    gender: "",
    bloodGroup: "",
    phone: "+91 98765 12345",
    email: "rahul@example.com",
    address: "",
    department: "",
    allergies: "",
  },
  {
    id: "PT-1003",
    name: "Sneha Patel",
    age: "34",
    gender: "",
    bloodGroup: "",
    phone: "+91 99887 66554",
    email: "sneha@example.com",
    address: "",
    department: "",
    allergies: "",
  },
  {
    id: "PT-1004",
    name: "Vikram Singh",
    age: "51",
    gender: "",
    bloodGroup: "",
    phone: "+91 91234 56789",
    email: "vikram@example.com",
    address: "",
    department: "",
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

/* -------------------------------------------------------------------------- */
/*                               HELPERS                                      */
/* -------------------------------------------------------------------------- */

function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(
    today.getMonth() + 1
  ).padStart(2, "0");
  const day = String(
    today.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function normalizeId(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");
}

function normalizeName(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatDate(date: string) {
  if (!date) {
    return "—";
  }

  const parsed = new Date(
    `${date}T00:00:00`
  );

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

function createEmptyForm(): EMRFormData {
  return {
    patientId: "",

    patientName: "",
    age: "",
    gender: "",
    bloodGroup: "",
    phone: "",
    email: "",
    address: "",

    department: "",
    allergies: "",

    doctorId: "",
    doctorName: "",

    visitDate: getTodayDate(),
    diagnosis: "",
    clinicalNotes: "",

    medications: "",
  };
}

/* -------------------------------------------------------------------------- */
/*                         PATIENT NORMALIZATION                              */
/* -------------------------------------------------------------------------- */

function normalizePatient(
  raw: any
): PatientRecord | null {
  if (!raw) {
    return null;
  }

  const id = String(
    raw.id ??
      raw.patientId ??
      raw.patientID ??
      raw.patient_id ??
      ""
  ).trim();

  if (!id) {
    return null;
  }

  const name = String(
    raw.name ??
      raw.fullName ??
      raw.patientName ??
      ""
  ).trim();

  return {
    id,
    name,

    age: String(
      raw.age ?? ""
    ).trim(),

    gender: String(
      raw.gender ?? ""
    ).trim(),

    bloodGroup: String(
      raw.bloodGroup ??
        raw.bloodType ??
        ""
    ).trim(),

    phone: String(
      raw.phone ??
        raw.mobile ??
        raw.mobileNumber ??
        raw.phoneNumber ??
        ""
    ).trim(),

    email: String(
      raw.email ?? ""
    ).trim(),

    address: String(
      raw.address ??
        raw.location ??
        ""
    ).trim(),

    department: String(
      raw.department ??
        raw.departmentName ??
        ""
    ).trim(),

    allergies: String(
      raw.allergies ?? ""
    ).trim(),
  };
}

/* -------------------------------------------------------------------------- */
/*                           LOAD PATIENTS                                    */
/* -------------------------------------------------------------------------- */

function loadPatients(): PatientRecord[] {
  try {
    const stored =
      localStorage.getItem(
        PATIENTS_STORAGE_KEY
      );

    if (!stored) {
      return fallbackPatients;
    }

    const parsed = JSON.parse(stored);

    let rawPatients: any[] = [];

    if (Array.isArray(parsed)) {
      rawPatients = parsed;
    } else if (
      Array.isArray(parsed?.patients)
    ) {
      rawPatients = parsed.patients;
    } else if (
      Array.isArray(parsed?.records)
    ) {
      rawPatients = parsed.records;
    } else if (
      Array.isArray(parsed?.data)
    ) {
      rawPatients = parsed.data;
    }

    const normalized = rawPatients
      .map(normalizePatient)
      .filter(
        (
          patient
        ): patient is PatientRecord =>
          patient !== null
      );

    return normalized.length > 0
      ? normalized
      : fallbackPatients;
  } catch (error) {
    console.error(
      "Failed to load patients:",
      error
    );

    return fallbackPatients;
  }
}

/* -------------------------------------------------------------------------- */
/*                           DOCTOR NORMALIZATION                             */
/* -------------------------------------------------------------------------- */

function normalizeDoctorId(
  value: unknown
) {
  const id = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");

  if (!id) {
    return "";
  }

  /*
   * Supports:
   * 1
   * 001
   * DOC001
   * DOC-001
   * doc001
   * doc-001
   */

  if (/^\d+$/.test(id)) {
    return `doc-${id.padStart(3, "0")}`;
  }

  if (/^doc\d+$/.test(id)) {
    const numberPart =
      id.replace(/^doc/, "");

    return `doc-${numberPart.padStart(
      3,
      "0"
    )}`;
  }

  if (/^doc-\d+$/.test(id)) {
    const numberPart =
      id.replace(/^doc-/, "");

    return `doc-${numberPart.padStart(
      3,
      "0"
    )}`;
  }

  return id;
}

function normalizeDoctor(
  raw: any
): DoctorRecord | null {
  if (!raw) {
    return null;
  }

  const id = normalizeDoctorId(
    raw.id ??
      raw.doctorId ??
      raw.doctorID ??
      raw.doctor_id
  );

  if (!id) {
    return null;
  }

  let name = String(
    raw.name ??
      raw.fullName ??
      raw.doctorName ??
      raw.doctor_name ??
      ""
  ).trim();

  /*
   * Some versions of the Doctors page may
   * save firstName and lastName separately.
   */
  if (!name) {
    const firstName = String(
      raw.firstName ??
        raw.first_name ??
        ""
    ).trim();

    const lastName = String(
      raw.lastName ??
        raw.last_name ??
        ""
    ).trim();

    name = `${firstName} ${lastName}`.trim();
  }

  /*
   * Make sure the doctor title is visible.
   */
  if (
    name &&
    !/^dr\.?\s/i.test(name)
  ) {
    name = `Dr. ${name}`;
  }

  return {
    id,
    name,

    specialization: String(
      raw.specialization ??
        raw.speciality ??
        raw.specialty ??
        ""
    ).trim(),

    department: String(
      raw.department ??
        raw.departmentName ??
        ""
    ).trim(),

    phone: String(
      raw.phone ??
        raw.mobile ??
        raw.mobileNumber ??
        ""
    ).trim(),

    email: String(
      raw.email ?? ""
    ).trim(),

    experience: String(
      raw.experience ?? ""
    ).trim(),

    consultationFee: String(
      raw.consultationFee ??
        raw.fee ??
        ""
    ).trim(),

    qualification: String(
      raw.qualification ??
        raw.degree ??
        ""
    ).trim(),

    status: String(
      raw.status ??
        "Active"
    ).trim(),
  };
}

/* -------------------------------------------------------------------------- */
/*                           LOAD ALL DOCTORS                                 */
/* -------------------------------------------------------------------------- */

function loadDoctors(): DoctorRecord[] {
  try {
    const stored =
      localStorage.getItem(
        DOCTORS_STORAGE_KEY
      );

    /*
     * No doctors have been created yet.
     * Use the original fallback list.
     */
    if (!stored) {
      return fallbackDoctors;
    }

    const parsed = JSON.parse(stored);

    let rawDoctors: any[] = [];

    /*
     * Support all storage structures.
     */
    if (Array.isArray(parsed)) {
      rawDoctors = parsed;
    } else if (
      Array.isArray(parsed?.doctors)
    ) {
      rawDoctors = parsed.doctors;
    } else if (
      Array.isArray(parsed?.records)
    ) {
      rawDoctors = parsed.records;
    } else if (
      Array.isArray(parsed?.data)
    ) {
      rawDoctors = parsed.data;
    }

    const normalizedDoctors =
      rawDoctors
        .map(normalizeDoctor)
        .filter(
          (
            doctor
          ): doctor is DoctorRecord =>
            doctor !== null
        );

    /*
     * Remove duplicate doctor IDs.
     */
    const uniqueDoctors =
      normalizedDoctors.filter(
        (doctor, index, array) =>
          array.findIndex(
            (item) =>
              normalizeDoctorId(
                item.id
              ) ===
              normalizeDoctorId(
                doctor.id
              )
          ) === index
      );

    /*
     * IMPORTANT:
     *
     * Return the actual stored doctors.
     *
     * Do NOT replace them with the
     * original 8 fallback doctors.
     */
    if (uniqueDoctors.length > 0) {
      return uniqueDoctors;
    }

    return fallbackDoctors;
  } catch (error) {
    console.error(
      "Failed to load doctors:",
      error
    );

    return fallbackDoctors;
  }
}

/* -------------------------------------------------------------------------- */
/*                              LOAD EMR                                      */
/* -------------------------------------------------------------------------- */

function loadEMRRecords(): EMRRecord[] {
  try {
    const stored =
      localStorage.getItem(
        EMR_STORAGE_KEY
      );

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    if (Array.isArray(parsed)) {
      return parsed;
    }

    if (
      Array.isArray(parsed?.records)
    ) {
      return parsed.records;
    }

    if (
      Array.isArray(parsed?.emrRecords)
    ) {
      return parsed.emrRecords;
    }

    if (
      Array.isArray(parsed?.emr)
    ) {
      return parsed.emr;
    }

    if (
      Array.isArray(parsed?.data)
    ) {
      return parsed.data;
    }

    return [];
  } catch (error) {
    console.error(
      "Failed to load EMR:",
      error
    );

    return [];
  }
}

/* -------------------------------------------------------------------------- */
/*                              SAVE EMR                                      */
/* -------------------------------------------------------------------------- */

function saveEMRRecords(
  records: EMRRecord[]
) {
  localStorage.setItem(
    EMR_STORAGE_KEY,
    JSON.stringify(records)
  );

  window.dispatchEvent(
    new Event(EMR_UPDATED_EVENT)
  );
}

/* -------------------------------------------------------------------------- */
/*                              STAT CARD                                     */
/* -------------------------------------------------------------------------- */

function StatCard({
  label,
  value,
  description,
  icon,
}: {
  label: string;
  value: number;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
          {icon}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              MAIN PAGE                                     */
/* -------------------------------------------------------------------------- */

export default function EMRPage() {
  const [records, setRecords] =
    useState<EMRRecord[]>([]);

  const [patients, setPatients] =
    useState<PatientRecord[]>([]);

  const [doctors, setDoctors] =
    useState<DoctorRecord[]>([]);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [isEditorOpen, setIsEditorOpen] =
    useState(false);

  const [isViewOpen, setIsViewOpen] =
    useState(false);

  const [isDeleteOpen, setIsDeleteOpen] =
    useState(false);

  const [editingRecord, setEditingRecord] =
    useState<EMRRecord | null>(null);

  const [selectedRecord, setSelectedRecord] =
    useState<EMRRecord | null>(null);

  const [deleteTarget, setDeleteTarget] =
    useState<EMRRecord | null>(null);

  const [form, setForm] =
    useState<EMRFormData>(
      createEmptyForm()
    );

  const [isSaving, setIsSaving] =
    useState(false);

  /* ------------------------------------------------------------------------ */
  /*                              LOAD DATA                                   */
  /* ------------------------------------------------------------------------ */

  const refreshData = () => {
    setRecords(loadEMRRecords());
    setPatients(loadPatients());

    /*
     * IMPORTANT:
     * Every time data refreshes, doctors are
     * loaded again from medcore_doctors.
     */
    setDoctors(loadDoctors());
  };

  useEffect(() => {
    refreshData();

    const handleDataUpdate = () => {
      refreshData();
    };

    /*
     * Doctors page updates this event after
     * creating/editing/deleting a doctor.
     */
    window.addEventListener(
      DOCTORS_UPDATED_EVENT,
      handleDataUpdate
    );

    window.addEventListener(
      PATIENTS_UPDATED_EVENT,
      handleDataUpdate
    );

    window.addEventListener(
      EMR_UPDATED_EVENT,
      handleDataUpdate
    );

    /*
     * Also support localStorage updates from
     * another browser tab.
     */
    const handleStorage = (
      event: StorageEvent
    ) => {
      if (
        event.key ===
          DOCTORS_STORAGE_KEY ||
        event.key ===
          PATIENTS_STORAGE_KEY ||
        event.key ===
          EMR_STORAGE_KEY
      ) {
        refreshData();
      }
    };

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        DOCTORS_UPDATED_EVENT,
        handleDataUpdate
      );

      window.removeEventListener(
        PATIENTS_UPDATED_EVENT,
        handleDataUpdate
      );

      window.removeEventListener(
        EMR_UPDATED_EVENT,
        handleDataUpdate
      );

      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, []);

  /* ------------------------------------------------------------------------ */
  /*                            FILTERING                                     */
  /* ------------------------------------------------------------------------ */

  const filteredRecords = useMemo(() => {
    const query =
      searchQuery
        .trim()
        .toLowerCase();

    if (!query) {
      return records;
    }

    return records.filter(
      (record) =>
        record.id
          .toLowerCase()
          .includes(query) ||
        record.patientName
          .toLowerCase()
          .includes(query) ||
        record.patientId
          .toLowerCase()
          .includes(query) ||
        record.doctorName
          .toLowerCase()
          .includes(query) ||
        record.diagnosis
          .toLowerCase()
          .includes(query) ||
        record.department
          .toLowerCase()
          .includes(query)
    );
  }, [
    records,
    searchQuery,
  ]);

  const totalRecords =
    records.length;

  const todayRecords =
    records.filter(
      (record) =>
        record.visitDate ===
        getTodayDate()
    ).length;

  const uniquePatients =
    new Set(
      records.map(
        (record) =>
          normalizeId(
            record.patientId
          )
      )
    ).size;

  const uniqueDoctors =
    new Set(
      records.map(
        (record) =>
          normalizeId(
            record.doctorId
          )
      )
    ).size;

  /* ------------------------------------------------------------------------ */
  /*                         SELECTED PATIENT                                 */
  /* ------------------------------------------------------------------------ */

  const selectedPatient = useMemo(() => {
    return patients.find(
      (patient) =>
        normalizeId(
          patient.id
        ) ===
        normalizeId(
          form.patientId
        )
    );
  }, [
    patients,
    form.patientId,
  ]);

  /* ------------------------------------------------------------------------ */
  /*                          SELECTED DOCTOR                                 */
  /* ------------------------------------------------------------------------ */

  const selectedDoctor = useMemo(() => {
    return doctors.find(
      (doctor) =>
        normalizeDoctorId(
          doctor.id
        ) ===
        normalizeDoctorId(
          form.doctorId
        )
    );
  }, [
    doctors,
    form.doctorId,
  ]);

  /* ------------------------------------------------------------------------ */
  /*                         PATIENT SELECTION                                */
  /* ------------------------------------------------------------------------ */

  const handlePatientChange = (
    patientId: string
  ) => {
    const patient =
      patients.find(
        (item) =>
          normalizeId(
            item.id
          ) ===
          normalizeId(
            patientId
          )
      );

    if (!patient) {
      setForm(
        (previous) => ({
          ...previous,
          patientId,
          patientName: "",
          age: "",
          gender: "",
          bloodGroup: "",
          phone: "",
          email: "",
          address: "",
          department: "",
          allergies: "",
        })
      );

      return;
    }

    /*
     * Patient information is automatically
     * brought from the Patients section.
     */
    setForm(
      (previous) => ({
        ...previous,

        patientId:
          patient.id,

        patientName:
          patient.name,

        age:
          patient.age,

        gender:
          patient.gender,

        bloodGroup:
          patient.bloodGroup,

        phone:
          patient.phone,

        email:
          patient.email,

        address:
          patient.address,

        department:
          patient.department,

        allergies:
          patient.allergies,
      })
    );
  };

  /* ------------------------------------------------------------------------ */
  /*                          DOCTOR SELECTION                                */
  /* ------------------------------------------------------------------------ */

  const handleDoctorChange = (
    doctorId: string
  ) => {
    const doctor =
      doctors.find(
        (item) =>
          normalizeDoctorId(
            item.id
          ) ===
          normalizeDoctorId(
            doctorId
          )
      );

    if (!doctor) {
      setForm(
        (previous) => ({
          ...previous,
          doctorId,
          doctorName: "",
        })
      );

      return;
    }

    setForm(
      (previous) => ({
        ...previous,

        doctorId:
          doctor.id,

        doctorName:
          doctor.name,

        /*
         * Only update department from
         * doctor if the doctor has one.
         */
        department:
          doctor.department ||
          previous.department,
      })
    );
  };

  /* ------------------------------------------------------------------------ */
  /*                              FORM UPDATE                                 */
  /* ------------------------------------------------------------------------ */

  const updateForm = <
    K extends keyof EMRFormData
  >(
    field: K,
    value: EMRFormData[K]
  ) => {
    setForm(
      (previous) => ({
        ...previous,
        [field]: value,
      })
    );
  };

  /* ------------------------------------------------------------------------ */
  /*                          OPEN ADD MODAL                                  */
  /* ------------------------------------------------------------------------ */

  const openAddEditor = () => {
    setEditingRecord(null);
    setForm(createEmptyForm());

    /*
     * Refresh doctors immediately when opening
     * the form. This guarantees newly added
     * doctors appear in the dropdown.
     */
    setDoctors(loadDoctors());
    setPatients(loadPatients());

    setIsEditorOpen(true);
  };

  /* ------------------------------------------------------------------------ */
  /*                          OPEN EDIT MODAL                                 */
  /* ------------------------------------------------------------------------ */

  const openEditEditor = (
    record: EMRRecord
  ) => {
    setEditingRecord(record);

    setDoctors(loadDoctors());
    setPatients(loadPatients());

    setForm({
      patientId:
        record.patientId,

      patientName:
        record.patientName,

      age:
        record.age,

      gender:
        record.gender,

      bloodGroup:
        record.bloodGroup,

      phone:
        record.phone,

      email:
        record.email,

      address:
        record.address,

      department:
        record.department,

      allergies:
        record.allergies,

      doctorId:
        record.doctorId,

      doctorName:
        record.doctorName,

      visitDate:
        record.visitDate,

      diagnosis:
        record.diagnosis,

      clinicalNotes:
        record.clinicalNotes,

      medications:
        record.medications,
    });

    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    if (isSaving) {
      return;
    }

    setIsEditorOpen(false);
    setEditingRecord(null);
    setForm(createEmptyForm());
  };

  /* ------------------------------------------------------------------------ */
  /*                              VALIDATION                                  */
  /* ------------------------------------------------------------------------ */

  const validateForm = () => {
    if (!form.patientId) {
      toast.error(
        "Please select a patient."
      );
      return false;
    }

    if (!form.patientName.trim()) {
      toast.error(
        "Patient name is required."
      );
      return false;
    }

    if (!form.age.trim()) {
      toast.error(
        "Patient age is required."
      );
      return false;
    }

    if (!form.phone.trim()) {
      toast.error(
        "Patient mobile number is required."
      );
      return false;
    }

    const phoneDigits =
      form.phone.replace(
        /\D/g,
        ""
      );

    if (phoneDigits.length < 10) {
      toast.error(
        "Please enter a valid mobile number."
      );
      return false;
    }

    if (!form.doctorId) {
      toast.error(
        "Please select a doctor."
      );
      return false;
    }

    if (!form.doctorName.trim()) {
      toast.error(
        "Doctor name is required."
      );
      return false;
    }

    if (!form.department.trim()) {
      toast.error(
        "Please select or enter department."
      );
      return false;
    }

    if (!form.visitDate) {
      toast.error(
        "Please select visit date."
      );
      return false;
    }

    if (!form.diagnosis.trim()) {
      toast.error(
        "Please enter diagnosis."
      );
      return false;
    }

    return true;
  };

  /* ------------------------------------------------------------------------ */
  /*                               SAVE                                       */
  /* ------------------------------------------------------------------------ */

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      const currentRecords =
        loadEMRRecords();

      const now =
        new Date().toISOString();

      const record: EMRRecord = {
        id:
          editingRecord?.id ??
          `EMR-${Date.now()}`,

        patientId:
          form.patientId.trim(),

        patientName:
          form.patientName.trim(),

        age:
          form.age.trim(),

        gender:
          form.gender.trim(),

        bloodGroup:
          form.bloodGroup.trim(),

        phone:
          form.phone.trim(),

        email:
          form.email.trim(),

        address:
          form.address.trim(),

        department:
          form.department.trim(),

        allergies:
          form.allergies.trim(),

        doctorId:
          form.doctorId.trim(),

        doctorName:
          form.doctorName.trim(),

        visitDate:
          form.visitDate,

        diagnosis:
          form.diagnosis.trim(),

        clinicalNotes:
          form.clinicalNotes.trim(),

        medications:
          form.medications.trim(),

        createdAt:
          editingRecord?.createdAt ??
          now,

        updatedAt:
          now,
      };

      let updatedRecords: EMRRecord[];

      if (editingRecord) {
        updatedRecords =
          currentRecords.map(
            (item) =>
              item.id ===
              editingRecord.id
                ? record
                : item
          );

        toast.success(
          "EMR record updated successfully."
        );
      } else {
        updatedRecords = [
          record,
          ...currentRecords,
        ];

        toast.success(
          "EMR record created successfully."
        );
      }

      saveEMRRecords(
        updatedRecords
      );

      setRecords(
        updatedRecords
      );

      closeEditor();
    } catch (error) {
      console.error(
        "Failed to save EMR:",
        error
      );

      toast.error(
        "Failed to save EMR record."
      );
    } finally {
      setIsSaving(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /*                              VIEW                                        */
  /* ------------------------------------------------------------------------ */

  const openViewModal = (
    record: EMRRecord
  ) => {
    setSelectedRecord(record);
    setIsViewOpen(true);
  };

  const closeViewModal = () => {
    setSelectedRecord(null);
    setIsViewOpen(false);
  };

  /* ------------------------------------------------------------------------ */
  /*                              DELETE                                      */
  /* ------------------------------------------------------------------------ */

  const openDeleteModal = (
    record: EMRRecord
  ) => {
    setDeleteTarget(record);
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
      records.filter(
        (item) =>
          item.id !==
          deleteTarget.id
      );

    saveEMRRecords(
      updatedRecords
    );

    setRecords(
      updatedRecords
    );

    toast.success(
      "EMR record deleted successfully."
    );

    closeDeleteModal();
  };

  /* ------------------------------------------------------------------------ */
  /*                                  JSX                                     */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-5 lg:p-7">
      <div className="mx-auto max-w-[1600px] space-y-5">

        {/* ---------------------------------------------------------------- */}
        {/* HEADER                                                           */}
        {/* ---------------------------------------------------------------- */}

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
                  <FileText className="h-6 w-6" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">
                    Clinical Records
                  </p>

                  <h1 className="text-2xl font-bold sm:text-3xl">
                    Electronic Medical Records
                  </h1>
                </div>
              </div>

              <p className="max-w-2xl text-sm leading-6 text-cyan-50">
                Manage patient clinical records,
                diagnoses, doctors, departments,
                allergies and treatment information
                in one connected EMR.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddEditor}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-cyan-700 shadow-md transition hover:bg-cyan-50 active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              Add EMR Record
            </button>
          </div>
        </motion.div>

        {/* ---------------------------------------------------------------- */}
        {/* STATS                                                            */}
        {/* ---------------------------------------------------------------- */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Records"
            value={totalRecords}
            description="All EMR records"
            icon={
              <FileText className="h-5 w-5" />
            }
          />

          <StatCard
            label="Today's Visits"
            value={todayRecords}
            description="Records created for today"
            icon={
              <CalendarDays className="h-5 w-5" />
            }
          />

          <StatCard
            label="Patients"
            value={uniquePatients}
            description="Patients with EMR records"
            icon={
              <UserRound className="h-5 w-5" />
            }
          />

          <StatCard
            label="Doctors"
            value={uniqueDoctors}
            description="Doctors linked to EMR"
            icon={
              <Stethoscope className="h-5 w-5" />
            }
          />
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* SEARCH                                                            */}
        {/* ---------------------------------------------------------------- */}

        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(
                  event.target.value
                )
              }
              placeholder="Search patient, EMR ID, doctor, diagnosis or department..."
              className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
            />
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* DESKTOP TABLE                                                    */}
        {/* ---------------------------------------------------------------- */}

        <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    EMR Record
                  </th>

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
                    Diagnosis
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Visit Date
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-16 text-center"
                    >
                      <div className="mx-auto max-w-md">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
                          <FileText className="h-7 w-7" />
                        </div>

                        <h3 className="mt-4 font-bold text-slate-900">
                          No EMR records found
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Create an EMR record or
                          change your search.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map(
                    (record) => (
                      <tr
                        key={record.id}
                        className="border-b border-slate-100 transition hover:bg-cyan-50/30"
                      >
                        <td className="px-5 py-4">
                          <p className="font-bold text-slate-900">
                            {record.id}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Clinical Record
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-900">
                            {record.patientName}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {record.patientId}
                            {" • "}
                            {record.age} yrs
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-900">
                            {record.doctorName ||
                              "—"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-full border border-cyan-100 bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-700">
                            {record.department ||
                              "—"}
                          </span>
                        </td>

                        <td className="max-w-[220px] px-5 py-4">
                          <p className="truncate font-medium text-slate-700">
                            {record.diagnosis}
                          </p>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                          {formatDate(
                            record.visitDate
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                openViewModal(
                                  record
                                )
                              }
                              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2 text-xs font-bold text-cyan-700 transition hover:bg-cyan-100"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                openEditEditor(
                                  record
                                )
                              }
                              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                openDeleteModal(
                                  record
                                )
                              }
                              className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
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

        {/* ---------------------------------------------------------------- */}
        {/* MOBILE CARDS                                                     */}
        {/* ---------------------------------------------------------------- */}

        <div className="grid gap-4 md:hidden">
          {filteredRecords.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white px-5 py-14 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
                <FileText className="h-7 w-7" />
              </div>

              <h3 className="mt-4 font-bold text-slate-900">
                No EMR records found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your search.
              </p>
            </div>
          ) : (
            filteredRecords.map(
              (record) => (
                <div
                  key={record.id}
                  className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-900">
                        {record.id}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {formatDate(
                          record.visitDate
                        )}
                      </p>
                    </div>

                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                      <CheckCircle2 className="h-3 w-3" />
                      ACTIVE
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Patient
                      </p>

                      <p className="mt-1 font-bold text-slate-900">
                        {record.patientName}
                      </p>

                      <p className="text-xs text-slate-500">
                        {record.patientId}
                        {" • "}
                        {record.age} yrs
                      </p>
                    </div>

                    <div className="rounded-2xl bg-cyan-50/60 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-cyan-600">
                        Doctor
                      </p>

                      <p className="mt-1 font-bold text-slate-900">
                        {record.doctorName ||
                          "—"}
                      </p>

                      <p className="text-xs text-cyan-700">
                        {record.department ||
                          "Department not set"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Diagnosis
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {record.diagnosis}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        openViewModal(
                          record
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
                          record
                        )
                      }
                      className="inline-flex cursor-pointer items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white px-2 py-2.5 text-xs font-bold text-slate-700"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        openDeleteModal(
                          record
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
      {/*                         ADD / EDIT MODAL                           */}
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
                  {/* HEADER */}
                  <div className="sticky top-0 z-20 border-b border-cyan-100 bg-white/95 px-4 py-4 backdrop-blur sm:px-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={
                            closeEditor
                          }
                          className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700"
                        >
                          <ArrowLeft className="h-5 w-5" />
                        </button>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-600">
                            Clinical Records
                          </p>

                          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                            {editingRecord
                              ? "Edit EMR Record"
                              : "Create EMR Record"}
                          </h2>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={
                          closeEditor
                        }
                        className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-5 p-4 sm:p-6">
                    {/* ---------------------------------------------------- */}
                    {/* PATIENT & DOCTOR                                     */}
                    {/* ---------------------------------------------------- */}

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
                            Connect this clinical record to
                            the appropriate patient and doctor.
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
                              value={
                                form.patientId
                              }
                              onChange={(
                                event
                              ) =>
                                handlePatientChange(
                                  event.target
                                    .value
                                )
                              }
                              className="h-12 w-full cursor-pointer appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 pr-10 text-sm font-medium text-slate-800 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                            >
                              <option value="">
                                Select patient
                              </option>

                              {patients.map(
                                (
                                  patient
                                ) => (
                                  <option
                                    key={
                                      patient.id
                                    }
                                    value={
                                      patient.id
                                    }
                                  >
                                    {
                                      patient.name
                                    }{" "}
                                    —{" "}
                                    {
                                      patient.id
                                    }
                                  </option>
                                )
                              )}
                            </select>

                            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          </div>
                        </div>

                        {/* DOCTOR */}
                        <div>
                          <div className="mb-2 flex items-center justify-between gap-2">
                            <label className="block text-sm font-semibold text-slate-700">
                              Doctor
                            </label>

                            <span className="rounded-full border border-cyan-100 bg-cyan-50 px-2.5 py-1 text-[10px] font-bold text-cyan-700">
                              {doctors.length}{" "}
                              doctors available
                            </span>
                          </div>

                          <div className="relative">
                            <select
                              value={
                                form.doctorId
                              }
                              onChange={(
                                event
                              ) =>
                                handleDoctorChange(
                                  event.target
                                    .value
                                )
                              }
                              className="h-12 w-full cursor-pointer appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 pr-10 text-sm font-medium text-slate-800 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                            >
                              <option value="">
                                Select doctor
                              </option>

                              {doctors.map(
                                (
                                  doctor
                                ) => (
                                  <option
                                    key={
                                      doctor.id
                                    }
                                    value={
                                      doctor.id
                                    }
                                  >
                                    {
                                      doctor.name
                                    }
                                    {doctor.department
                                      ? ` — ${doctor.department}`
                                      : ""}
                                  </option>
                                )
                              )}
                            </select>

                            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          </div>

                          {selectedDoctor && (
                            <div className="mt-3 rounded-2xl border border-cyan-100 bg-cyan-50 p-3">
                              <div className="flex items-center gap-2">
                                <Stethoscope className="h-4 w-4 text-cyan-600" />

                                <p className="text-sm font-bold text-slate-900">
                                  {
                                    selectedDoctor.name
                                  }
                                </p>
                              </div>

                              {selectedDoctor.specialization && (
                                <p className="mt-1 text-xs text-slate-500">
                                  {
                                    selectedDoctor.specialization
                                  }
                                </p>
                              )}

                              {selectedDoctor.department && (
                                <p className="mt-1 text-xs font-semibold text-cyan-700">
                                  {
                                    selectedDoctor.department
                                  }
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </section>

                    {/* ---------------------------------------------------- */}
                    {/* PATIENT DETAILS                                      */}
                    {/* ---------------------------------------------------- */}

                    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                      <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                          <HeartPulse className="h-5 w-5" />
                        </div>

                        <div>
                          <h3 className="font-bold text-slate-900">
                            Patient Information
                          </h3>

                          <p className="text-xs text-slate-500">
                            Patient details are populated from
                            the Patients module.
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {/* NAME */}
                        <div className="sm:col-span-2">
                          <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Patient Name
                          </label>

                          <input
                            value={
                              form.patientName
                            }
                            readOnly
                            placeholder="Select patient"
                            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm font-medium text-slate-700 outline-none"
                          />
                        </div>

                        {/* AGE */}
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Age
                          </label>

                          <input
                            value={
                              form.age
                            }
                            readOnly
                            placeholder="—"
                            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm font-medium text-slate-700 outline-none"
                          />
                        </div>

                        {/* GENDER */}
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Gender
                          </label>

                          <input
                            value={
                              form.gender
                            }
                            readOnly
                            placeholder="—"
                            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm font-medium text-slate-700 outline-none"
                          />
                        </div>

                        {/* BLOOD GROUP */}
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Blood Group
                          </label>

                          <input
                            value={
                              form.bloodGroup
                            }
                            readOnly
                            placeholder="—"
                            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm font-medium text-slate-700 outline-none"
                          />
                        </div>

                        {/* PHONE */}
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Mobile
                          </label>

                          <input
                            value={
                              form.phone
                            }
                            readOnly
                            placeholder="—"
                            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm font-medium text-slate-700 outline-none"
                          />
                        </div>

                        {/* EMAIL */}
                        <div className="sm:col-span-2">
                          <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Email
                          </label>

                          <input
                            value={
                              form.email
                            }
                            readOnly
                            placeholder="—"
                            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm font-medium text-slate-700 outline-none"
                          />
                        </div>

                        {/* ADDRESS */}
                        <div className="sm:col-span-2">
                          <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Address
                          </label>

                          <input
                            value={
                              form.address
                            }
                            readOnly
                            placeholder="—"
                            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm font-medium text-slate-700 outline-none"
                          />
                        </div>
                      </div>
                    </section>

                    {/* ---------------------------------------------------- */}
                    {/* CLINICAL DETAILS                                     */}
                    {/* ---------------------------------------------------- */}

                    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                      <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                          <Activity className="h-5 w-5" />
                        </div>

                        <div>
                          <h3 className="font-bold text-slate-900">
                            Clinical Information
                          </h3>

                          <p className="text-xs text-slate-500">
                            Enter the clinical information for
                            this visit.
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        {/* VISIT DATE */}
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Visit Date
                          </label>

                          <div className="relative">
                            <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-600" />

                            <input
                              type="date"
                              value={
                                form.visitDate
                              }
                              onChange={(
                                event
                              ) =>
                                updateForm(
                                  "visitDate",
                                  event.target
                                    .value
                                )
                              }
                              className="h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                            />
                          </div>
                        </div>

                        {/* DEPARTMENT */}
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Department
                          </label>

                          <input
                            value={
                              form.department
                            }
                            onChange={(
                              event
                            ) =>
                              updateForm(
                                "department",
                                event.target
                                  .value
                              )
                            }
                            placeholder="Enter department"
                            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                          />
                        </div>

                        {/* ALLERGIES */}
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Allergies
                          </label>

                          <input
                            value={
                              form.allergies
                            }
                            onChange={(
                              event
                            ) =>
                              updateForm(
                                "allergies",
                                event.target
                                  .value
                              )
                            }
                            placeholder="Enter allergies if known"
                            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                          />
                        </div>

                        {/* DIAGNOSIS */}
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Diagnosis
                          </label>

                          <input
                            value={
                              form.diagnosis
                            }
                            onChange={(
                              event
                            ) =>
                              updateForm(
                                "diagnosis",
                                event.target
                                  .value
                              )
                            }
                            placeholder="Enter diagnosis"
                            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                          />
                        </div>

                        {/* CLINICAL NOTES */}
                        <div className="sm:col-span-2">
                          <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Clinical Notes
                          </label>

                          <textarea
                            value={
                              form.clinicalNotes
                            }
                            onChange={(
                              event
                            ) =>
                              updateForm(
                                "clinicalNotes",
                                event.target
                                  .value
                              )
                            }
                            rows={4}
                            placeholder="Enter symptoms, examination findings, observations and treatment notes..."
                            className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                          />
                        </div>

                        {/* MEDICATIONS */}
                        <div className="sm:col-span-2">
                          <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Medications
                          </label>

                          <textarea
                            value={
                              form.medications
                            }
                            onChange={(
                              event
                            ) =>
                              updateForm(
                                "medications",
                                event.target
                                  .value
                              )
                            }
                            rows={3}
                            placeholder="Enter medications prescribed for this visit..."
                            className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                          />
                        </div>
                      </div>
                    </section>

                    {/* ---------------------------------------------------- */}
                    {/* FORM ACTIONS                                         */}
                    {/* ---------------------------------------------------- */}

                    <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                      <button
                        type="button"
                        onClick={
                          closeEditor
                        }
                        disabled={
                          isSaving
                        }
                        className="inline-flex cursor-pointer items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={
                          handleSave
                        }
                        disabled={
                          isSaving
                        }
                        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-cyan-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isSaving ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            {editingRecord
                              ? "Update EMR"
                              : "Create EMR"}
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
      {/*                              VIEW MODAL                            */}
      {/* ================================================================== */}

      <AnimatePresence>
        {isViewOpen &&
          selectedRecord && (
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
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.97,
                  y: 15,
                }}
                className="max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-cyan-100 px-5 py-4 sm:px-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-cyan-600">
                      EMR Details
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-slate-900">
                      {selectedRecord.patientName}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={
                      closeViewModal
                    }
                    className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="max-h-[calc(92vh-80px)] overflow-y-auto p-5 sm:p-6">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        EMR ID
                      </p>

                      <p className="mt-1 font-bold text-slate-900">
                        {selectedRecord.id}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-cyan-50 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-cyan-600">
                        Patient ID
                      </p>

                      <p className="mt-1 font-bold text-slate-900">
                        {
                          selectedRecord.patientId
                        }
                      </p>
                    </div>

                    <div className="rounded-2xl bg-blue-50 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-blue-600">
                        Visit Date
                      </p>

                      <p className="mt-1 font-bold text-slate-900">
                        {formatDate(
                          selectedRecord.visitDate
                        )}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 p-4 sm:col-span-2 lg:col-span-1">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Patient
                      </p>

                      <p className="mt-1 font-bold text-slate-900">
                        {
                          selectedRecord.patientName
                        }
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {
                          selectedRecord.age
                        }{" "}
                        years
                        {selectedRecord.gender
                          ? ` • ${selectedRecord.gender}`
                          : ""}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Doctor
                      </p>

                      <p className="mt-1 font-bold text-slate-900">
                        {
                          selectedRecord.doctorName
                        }
                      </p>

                      <p className="mt-1 text-xs text-cyan-700">
                        {
                          selectedRecord.department
                        }
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Blood Group
                      </p>

                      <p className="mt-1 font-bold text-slate-900">
                        {selectedRecord.bloodGroup ||
                          "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4">
                    <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-cyan-600">
                        Diagnosis
                      </p>

                      <p className="mt-2 text-sm font-semibold leading-6 text-slate-900">
                        {
                          selectedRecord.diagnosis
                        }
                      </p>
                    </div>

                    <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-amber-600">
                        Allergies
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-800">
                        {selectedRecord.allergies ||
                          "No information provided"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        Clinical Notes
                      </p>

                      <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                        {selectedRecord.clinicalNotes ||
                          "No clinical notes provided."}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        Medications
                      </p>

                      <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                        {selectedRecord.medications ||
                          "No medications recorded."}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex justify-end">
                    <button
                      type="button"
                      onClick={
                        closeViewModal
                      }
                      className="inline-flex cursor-pointer items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
      </AnimatePresence>

      {/* ================================================================== */}
      {/*                           DELETE MODAL                             */}
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
                className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                  <Trash2 className="h-6 w-6" />
                </div>

                <h2 className="mt-4 text-xl font-bold text-slate-900">
                  Delete EMR Record?
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Are you sure you want to delete
                  the EMR record for{" "}
                  <span className="font-bold text-slate-700">
                    {
                      deleteTarget.patientName
                    }
                  </span>
                  ? This action cannot be undone.
                </p>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={
                      closeDeleteModal
                    }
                    className="inline-flex cursor-pointer items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleDelete
                    }
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
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