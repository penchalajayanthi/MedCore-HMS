"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Edit3,
  Eye,
  Filter,
  HeartPulse,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  ShieldAlert,
  Stethoscope,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

/* ============================================================
   STORAGE CONSTANTS
============================================================ */

const PATIENTS_STORAGE_KEY = "medcore_patients";
const DOCTORS_STORAGE_KEY = "medcore_doctors";

const PATIENTS_UPDATED_EVENT =
  "medcore-patients-updated";

const DOCTORS_UPDATED_EVENT =
  "medcore-doctors-updated";

/* ============================================================
   PATIENT TYPE
============================================================ */

type Patient = {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone: string;
  bloodGroup: string;
  department: string;
  status: "Active" | "Critical" | "Inactive";
  registered: string;
  avatar: string;

  email?: string;
  dateOfBirth?: string;
  address?: string;

  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;

  medicalHistory?: string;
  allergies?: string;
  currentMedications?: string;

  symptoms?: string;
  diagnosis?: string;
  doctor?: string;
};

/* ============================================================
   DOCTOR TYPE
   Matches Doctors Module localStorage structure
============================================================ */

type DoctorStatus =
  | "Available"
  | "Busy"
  | "On Leave";

type Doctor = {
  id: number | string;
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

/* ============================================================
   ADD PATIENT VALIDATION
============================================================ */

const addPatientSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name is required"),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required"),

  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required"),

  gender: z.enum(
    ["Male", "Female", "Other"],
    {
      message: "Please select gender",
    }
  ),

  phone: z
    .string()
    .regex(
      /^\d{10}$/,
      "Mobile number must be exactly 10 digits"
    ),

  email: z
    .string()
    .email("Enter a valid email address")
    .or(z.literal("")),

  bloodGroup: z
    .string()
    .min(1, "Please select blood group"),

  department: z
    .string()
    .min(1, "Please select department"),

  address: z
    .string()
    .trim()
    .min(5, "Address is required"),

  emergencyContactName: z
    .string()
    .trim()
    .min(
      2,
      "Emergency contact name is required"
    ),

  emergencyContactPhone: z
    .string()
    .regex(
      /^\d{10}$/,
      "Emergency mobile number must be exactly 10 digits"
    ),

  emergencyContactRelation: z
    .string()
    .min(
      1,
      "Please select relationship"
    ),

  medicalHistory: z
    .string()
    .optional(),

  allergies: z
    .string()
    .optional(),

  currentMedications: z
    .string()
    .optional(),

  symptoms: z
    .string()
    .optional(),

  diagnosis: z
    .string()
    .optional(),

  doctor: z
    .string()
    .optional(),
});

type AddPatientForm =
  z.infer<typeof addPatientSchema>;

/* ============================================================
   DEFAULT PATIENTS
============================================================ */

const defaultPatients: Patient[] = [
  {
    id: "PT-1001",
    name: "Rahul Kumar",
    age: 34,
    gender: "Male",
    phone: "+91 98765 43210",
    bloodGroup: "B+",
    department: "Cardiology",
    status: "Active",
    registered: "Aug 28, 2026",
    avatar: "RK",
  },
  {
    id: "PT-1002",
    name: "Ananya Reddy",
    age: 29,
    gender: "Female",
    phone: "+91 91234 56789",
    bloodGroup: "O+",
    department: "Neurology",
    status: "Active",
    registered: "Aug 27, 2026",
    avatar: "AR",
  },
  {
    id: "PT-1003",
    name: "Suresh Babu",
    age: 56,
    gender: "Male",
    phone: "+91 99887 66554",
    bloodGroup: "A+",
    department: "Orthopedics",
    status: "Critical",
    registered: "Aug 26, 2026",
    avatar: "SB",
  },
  {
    id: "PT-1004",
    name: "Kavya Reddy",
    age: 24,
    gender: "Female",
    phone: "+91 90123 45678",
    bloodGroup: "AB+",
    department: "Pediatrics",
    status: "Active",
    registered: "Aug 25, 2026",
    avatar: "KR",
  },
  {
    id: "PT-1005",
    name: "Vikram Rao",
    age: 47,
    gender: "Male",
    phone: "+91 93456 78901",
    bloodGroup: "O-",
    department: "General Medicine",
    status: "Inactive",
    registered: "Aug 22, 2026",
    avatar: "VR",
  },
  {
    id: "PT-1006",
    name: "Sneha Patel",
    age: 31,
    gender: "Female",
    phone: "+91 95678 12345",
    bloodGroup: "A-",
    department: "Dermatology",
    status: "Active",
    registered: "Aug 20, 2026",
    avatar: "SP",
  },
  {
    id: "PT-1007",
    name: "Arjun Sharma",
    age: 41,
    gender: "Male",
    phone: "+91 97865 43210",
    bloodGroup: "B+",
    department: "Cardiology",
    status: "Critical",
    registered: "Aug 18, 2026",
    avatar: "AS",
  },
  {
    id: "PT-1008",
    name: "Meera Singh",
    age: 38,
    gender: "Female",
    phone: "+91 98712 34567",
    bloodGroup: "O+",
    department: "General Medicine",
    status: "Active",
    registered: "Aug 16, 2026",
    avatar: "MS",
  },
];

/* ============================================================
   FALLBACK DOCTORS
   Same doctors as Doctors Module
============================================================ */

const defaultDoctors: Doctor[] = [
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

/* ============================================================
   HELPERS
============================================================ */

function formatIndianPhone(phone: string) {
  const digits = phone
    .replace(/\D/g, "")
    .slice(0, 10);

  if (digits.length <= 5) {
    return `+91 ${digits}`;
  }

  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}

function getPhoneDigits(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (
    digits.length === 12 &&
    digits.startsWith("91")
  ) {
    return digits.slice(2);
  }

  return digits.slice(-10);
}

/* ============================================================
   NORMALIZE DOCTORS
============================================================ */

function normalizeDoctors(
  value: unknown
): Doctor[] {
  let source: unknown = value;

  if (
    source &&
    typeof source === "object" &&
    !Array.isArray(source) &&
    "doctors" in source
  ) {
    source = (
      source as {
        doctors?: unknown;
      }
    ).doctors;
  }

  if (!Array.isArray(source)) {
    return [];
  }

  return source
    .map((item): Doctor | null => {
      if (
        !item ||
        typeof item !== "object"
      ) {
        return null;
      }

      const record =
        item as Record<string, unknown>;

      const rawId = record.id;

      if (
        rawId === undefined ||
        rawId === null
      ) {
        return null;
      }

      const name =
        typeof record.name === "string"
          ? record.name
          : "";

      if (!name.trim()) {
        return null;
      }

      return {
        id:
          typeof rawId === "number" ||
          typeof rawId === "string"
            ? rawId
            : String(rawId),

        name: name.trim(),

        specialization:
          typeof record.specialization ===
          "string"
            ? record.specialization
            : "",

        department:
          typeof record.department ===
          "string"
            ? record.department
            : "",

        qualification:
          typeof record.qualification ===
          "string"
            ? record.qualification
            : "",

        experience:
          typeof record.experience ===
          "string"
            ? record.experience
            : String(
                record.experience ?? ""
              ),

        fee:
          typeof record.fee === "string"
            ? record.fee
            : String(record.fee ?? ""),

        email:
          typeof record.email === "string"
            ? record.email
            : "",

        phone:
          typeof record.phone === "string"
            ? record.phone
            : "",

        room:
          typeof record.room === "string"
            ? record.room
            : String(
                record.room ?? ""
              ),

        workingHours:
          typeof record.workingHours ===
          "string"
            ? record.workingHours
            : "",

        status:
          record.status === "Busy" ||
          record.status === "On Leave"
            ? record.status
            : "Available",
      };
    })
    .filter(
      (
        doctor
      ): doctor is Doctor =>
        doctor !== null
    );
}

/* ============================================================
   MAIN PAGE
============================================================ */

export default function PatientsPage() {
  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [showFilters, setShowFilters] =
    useState(false);

  const [patients, setPatients] =
    useState<Patient[]>(
      defaultPatients
    );

  const [doctors, setDoctors] =
    useState<Doctor[]>(defaultDoctors);

  const [showAddPatient, setShowAddPatient] =
    useState(false);

  const [patientAdded, setPatientAdded] =
    useState(false);

  const [selectedPatient, setSelectedPatient] =
    useState<Patient | null>(null);

  const [editingPatient, setEditingPatient] =
    useState<Patient | null>(null);

  const [deletePatient, setDeletePatient] =
    useState<Patient | null>(null);

  /* ==========================================================
     LOAD PATIENTS + DOCTORS
  ========================================================== */

  useEffect(() => {
    const loadPatients = () => {
      try {
        const savedPatients =
          localStorage.getItem(
            PATIENTS_STORAGE_KEY
          );

        if (savedPatients) {
          const parsedPatients =
            JSON.parse(savedPatients);

          if (
            Array.isArray(
              parsedPatients
            )
          ) {
            setPatients(
              parsedPatients
            );
          }
        } else {
          localStorage.setItem(
            PATIENTS_STORAGE_KEY,
            JSON.stringify(
              defaultPatients
            )
          );
        }
      } catch (error) {
        console.error(
          "Failed to load saved patients:",
          error
        );
      }
    };

    const loadDoctors = () => {
      try {
        const savedDoctors =
          localStorage.getItem(
            DOCTORS_STORAGE_KEY
          );

        if (savedDoctors) {
          const parsedDoctors =
            JSON.parse(savedDoctors);

          const normalized =
            normalizeDoctors(
              parsedDoctors
            );

          if (
            normalized.length > 0
          ) {
            setDoctors(normalized);
            return;
          }
        }

        /*
         * If the Doctors page has not been opened yet,
         * initialize the same doctor data here.
         */
        localStorage.setItem(
          DOCTORS_STORAGE_KEY,
          JSON.stringify(
            defaultDoctors
          )
        );

        setDoctors(
          defaultDoctors
        );
      } catch (error) {
        console.error(
          "Failed to load doctors:",
          error
        );

        setDoctors(
          defaultDoctors
        );
      }
    };

    loadPatients();
    loadDoctors();

    const handlePatientsUpdated =
      () => {
        loadPatients();
      };

    const handleDoctorsUpdated =
      () => {
        loadDoctors();
      };

    const handleStorage = (
      event: StorageEvent
    ) => {
      if (
        event.key ===
        PATIENTS_STORAGE_KEY
      ) {
        loadPatients();
      }

      if (
        event.key ===
        DOCTORS_STORAGE_KEY
      ) {
        loadDoctors();
      }
    };

    window.addEventListener(
      PATIENTS_UPDATED_EVENT,
      handlePatientsUpdated
    );

    window.addEventListener(
      DOCTORS_UPDATED_EVENT,
      handleDoctorsUpdated
    );

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        PATIENTS_UPDATED_EVENT,
        handlePatientsUpdated
      );

      window.removeEventListener(
        DOCTORS_UPDATED_EVENT,
        handleDoctorsUpdated
      );

      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, []);

  /* ==========================================================
     FILTER PATIENTS
  ========================================================== */

  const filteredPatients = useMemo(() => {
    return patients.filter(
      (patient) => {
        const searchValue =
          search
            .toLowerCase()
            .trim();

        const matchesSearch =
          patient.name
            .toLowerCase()
            .includes(
              searchValue
            ) ||
          patient.id
            .toLowerCase()
            .includes(
              searchValue
            ) ||
          patient.phone
            .toLowerCase()
            .includes(
              searchValue
            ) ||
          patient.department
            .toLowerCase()
            .includes(
              searchValue
            );

        const matchesStatus =
          statusFilter === "All" ||
          patient.status ===
            statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );
  }, [
    patients,
    search,
    statusFilter,
  ]);

  const activePatients =
    patients.filter(
      (patient) =>
        patient.status ===
        "Active"
    ).length;

  const criticalPatients =
    patients.filter(
      (patient) =>
        patient.status ===
        "Critical"
    ).length;

  /* ==========================================================
     SAVE PATIENTS
  ========================================================== */

  const savePatients = (
    updatedPatients: Patient[]
  ) => {
    setPatients(
      updatedPatients
    );

    try {
      localStorage.setItem(
        PATIENTS_STORAGE_KEY,
        JSON.stringify(
          updatedPatients
        )
      );

      window.dispatchEvent(
        new Event(
          PATIENTS_UPDATED_EVENT
        )
      );
    } catch (error) {
      console.error(
        "Failed to save patients:",
        error
      );
    }
  };

  /* ==========================================================
     GENERATE PATIENT ID
  ========================================================== */

  const generatePatientId = (
    existingPatients: Patient[]
  ) => {
    const highestId =
      existingPatients.reduce(
        (
          highest,
          patient
        ) => {
          const number =
            Number(
              patient.id.replace(
                /\D/g,
                ""
              )
            );

          return Number.isFinite(
            number
          )
            ? Math.max(
                highest,
                number
              )
            : highest;
        },
        1000
      );

    return `PT-${highestId + 1}`;
  };

  /* ==========================================================
     ADD PATIENT
  ========================================================== */

  const handleAddPatient =
    async (
      data: AddPatientForm
    ) => {
      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            1200
          )
      );

      const fullName =
        `${data.firstName} ${data.lastName}`.trim();

      const birthDate =
        new Date(
          data.dateOfBirth
        );

      const today =
        new Date();

      let age =
        today.getFullYear() -
        birthDate.getFullYear();

      const monthDifference =
        today.getMonth() -
        birthDate.getMonth();

      if (
        monthDifference < 0 ||
        (monthDifference === 0 &&
          today.getDate() <
            birthDate.getDate())
      ) {
        age--;
      }

      const initials =
        `${data.firstName.charAt(
          0
        )}${data.lastName.charAt(
          0
        )}`.toUpperCase();

      const newPatient: Patient =
        {
          id: generatePatientId(
            patients
          ),

          name: fullName,

          age,

          gender: data.gender,

          phone:
            formatIndianPhone(
              data.phone
            ),

          bloodGroup:
            data.bloodGroup,

          department:
            data.department,

          status: "Active",

          registered:
            new Date().toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "2-digit",
                year: "numeric",
              }
            ),

          avatar: initials,

          email: data.email,

          dateOfBirth:
            data.dateOfBirth,

          address:
            data.address,

          emergencyContactName:
            data.emergencyContactName,

          emergencyContactPhone:
            formatIndianPhone(
              data.emergencyContactPhone
            ),

          emergencyContactRelation:
            data.emergencyContactRelation,

          medicalHistory:
            data.medicalHistory,

          allergies:
            data.allergies,

          currentMedications:
            data.currentMedications,

          symptoms:
            data.symptoms,

          diagnosis:
            data.diagnosis,

          doctor:
            data.doctor,
        };

      const updatedPatients =
        [
          newPatient,
          ...patients,
        ];

      savePatients(
        updatedPatients
      );

      setShowAddPatient(
        false
      );

      setPatientAdded(
        true
      );

      setTimeout(() => {
        setPatientAdded(
          false
        );
      }, 3000);
    };

  /* ==========================================================
     DELETE PATIENT
  ========================================================== */

  const handleDeletePatient = (
    patient: Patient
  ) => {
    const updatedPatients =
      patients.filter(
        (item) =>
          item.id !==
          patient.id
      );

    savePatients(
      updatedPatients
    );

    setDeletePatient(null);

    setSelectedPatient(
      null
    );
  };

  /* ==========================================================
     EDIT PATIENT
  ========================================================== */

  const handleEditPatient = (
    updatedPatient: Patient
  ) => {
    const updatedPatients =
      patients.map(
        (patient) =>
          patient.id ===
          updatedPatient.id
            ? updatedPatient
            : patient
      );

    savePatients(
      updatedPatients
    );

    setEditingPatient(
      null
    );

    setSelectedPatient(
      null
    );

    setPatientAdded(
      true
    );

    setTimeout(() => {
      setPatientAdded(
        false
      );
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/20 to-blue-50/30 p-4 sm:p-6 lg:p-8 dark:from-slate-950 dark:via-slate-950 dark:to-cyan-950/10">
      <div className="mx-auto max-w-[1600px] space-y-6">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-cyan-600 dark:text-cyan-400">
              <Users className="h-4 w-4" />
              Clinical Management
            </div>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              Patients
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage patient records, information and clinical details.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setShowAddPatient(
                true
              )
            }
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:shadow-xl sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Add Patient
          </button>
        </motion.div>

        {/* =====================================================
            SUCCESS MESSAGE
        ===================================================== */}

        <AnimatePresence>
          {patientAdded && (
            <motion.div
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
              className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400"
            >
              <CheckCircle2 className="h-5 w-5" />
              Patient information updated successfully.
            </motion.div>
          )}
        </AnimatePresence>

        {/* =====================================================
            STATISTICS
        ===================================================== */}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <PatientStat
            title="Total Patients"
            value={patients.length.toString()}
            subtitle="Registered patients"
            icon={Users}
            gradient="from-cyan-500 to-blue-600"
          />

          <PatientStat
            title="Active Patients"
            value={activePatients.toString()}
            subtitle="Currently under care"
            icon={Activity}
            gradient="from-emerald-500 to-teal-600"
          />

          <PatientStat
            title="New Patients"
            value="186"
            subtitle="This month"
            icon={UserPlus}
            gradient="from-violet-500 to-purple-600"
            positive
          />

          <PatientStat
            title="Critical Patients"
            value={criticalPatients.toString()}
            subtitle="Require attention"
            icon={Activity}
            gradient="from-orange-500 to-red-600"
          />
        </div>

        {/* =====================================================
            SEARCH + FILTERS
        ===================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
          }}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search by patient name, ID, phone or department..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                setShowFilters(
                  (value) =>
                    !value
                )
              }
              className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:border-cyan-300 hover:bg-cyan-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Filter className="h-4 w-4" />

              Filters

              <ChevronDown
                className={`h-4 w-4 transition ${
                  showFilters
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            <div className="hidden items-center gap-2 lg:flex">
              {[
                "All",
                "Active",
                "Critical",
                "Inactive",
              ].map(
                (status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() =>
                      setStatusFilter(
                        status
                      )
                    }
                    className={`cursor-pointer rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
                      statusFilter ===
                      status
                        ? "bg-cyan-600 text-white shadow-md shadow-cyan-500/20"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                    }`}
                  >
                    {status}
                  </button>
                )
              )}
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4 sm:grid-cols-4 lg:hidden dark:border-slate-800">
              {[
                "All",
                "Active",
                "Critical",
                "Inactive",
              ].map(
                (status) => (
                  <button
                    key={`mobile-${status}`}
                    type="button"
                    onClick={() => {
                      setStatusFilter(
                        status
                      );

                      setShowFilters(
                        false
                      );
                    }}
                    className={`cursor-pointer rounded-xl px-3 py-2.5 text-xs font-semibold ${
                      statusFilter ===
                      status
                        ? "bg-cyan-600 text-white"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {status}
                  </button>
                )
              )}
            </div>
          )}
        </motion.div>

        {/* =====================================================
            PATIENT DIRECTORY
        ===================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.2,
          }}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex flex-col gap-2 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">
                Patient Directory
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {filteredPatients.length} patients displayed
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-600 dark:text-cyan-400">
              <CalendarDays className="h-4 w-4" />
              Recently registered
            </div>
          </div>

          {/* DESKTOP TABLE */}

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-left dark:border-slate-800 dark:bg-slate-800/40">
                  {[
                    "Patient",
                    "ID",
                    "Age / Gender",
                    "Phone",
                    "Blood Group",
                    "Department",
                    "Status",
                    "Actions",
                  ].map(
                    (heading) => (
                      <th
                        key={
                          heading
                        }
                        className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 first:px-5"
                      >
                        {heading}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredPatients.map(
                  (patient) => (
                    <PatientTableRow
                      key={
                        patient.id
                      }
                      patient={
                        patient
                      }
                      onView={() =>
                        setSelectedPatient(
                          patient
                        )
                      }
                      onEdit={() =>
                        setEditingPatient(
                          patient
                        )
                      }
                      onDelete={() =>
                        setDeletePatient(
                          patient
                        )
                      }
                    />
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* MOBILE */}

          <div className="divide-y divide-slate-100 md:hidden dark:divide-slate-800">
            {filteredPatients.map(
              (patient) => (
                <PatientMobileCard
                  key={`mobile-${patient.id}`}
                  patient={
                    patient
                  }
                  onView={() =>
                    setSelectedPatient(
                      patient
                    )
                  }
                  onEdit={() =>
                    setEditingPatient(
                      patient
                    )
                  }
                  onDelete={() =>
                    setDeletePatient(
                      patient
                    )
                  }
                />
              )
            )}
          </div>

          {filteredPatients.length ===
            0 && (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                <Users className="h-6 w-6 text-slate-400" />
              </div>

              <h3 className="mt-4 font-semibold text-slate-800 dark:text-white">
                No patients found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or filter.
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* ADD PATIENT */}

      <AnimatePresence>
        {showAddPatient && (
          <AddPatientModal
            doctors={doctors}
            onClose={() =>
              setShowAddPatient(
                false
              )
            }
            onSubmit={
              handleAddPatient
            }
          />
        )}
      </AnimatePresence>

      {/* VIEW PATIENT */}

      <AnimatePresence>
        {selectedPatient && (
          <PatientDetailsModal
            patient={
              selectedPatient
            }
            onClose={() =>
              setSelectedPatient(
                null
              )
            }
            onEdit={() => {
              setEditingPatient(
                selectedPatient
              );

              setSelectedPatient(
                null
              );
            }}
            onDelete={() => {
              setDeletePatient(
                selectedPatient
              );

              setSelectedPatient(
                null
              );
            }}
          />
        )}
      </AnimatePresence>

      {/* EDIT PATIENT */}

      <AnimatePresence>
        {editingPatient && (
          <EditPatientModal
            patient={
              editingPatient
            }
            doctors={doctors}
            onClose={() =>
              setEditingPatient(
                null
              )
            }
            onSave={
              handleEditPatient
            }
          />
        )}
      </AnimatePresence>

      {/* DELETE */}

      <AnimatePresence>
        {deletePatient && (
          <DeletePatientModal
            patient={
              deletePatient
            }
            onCancel={() =>
              setDeletePatient(
                null
              )
            }
            onConfirm={() =>
              handleDeletePatient(
                deletePatient
              )
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================================================
   ADD PATIENT MODAL
============================================================ */

function AddPatientModal({
  doctors,
  onClose,
  onSubmit,
}: {
  doctors: Doctor[];
  onClose: () => void;
  onSubmit: (
    data: AddPatientForm
  ) => Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: {
      errors,
      isSubmitting,
    },
  } =
    useForm<AddPatientForm>({
      resolver:
        zodResolver(
          addPatientSchema
        ),

      defaultValues: {
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        phone: "",
        email: "",
        gender: undefined,
        bloodGroup: "",
        department: "",
        address: "",
        emergencyContactName:
          "",
        emergencyContactPhone:
          "",
        emergencyContactRelation:
          "",
        medicalHistory: "",
        allergies: "",
        currentMedications:
          "",
        symptoms: "",
        diagnosis: "",
        doctor: "",
      },
    });

  const handlePhoneChange = (
    value: string
  ) => {
    const digits =
      value
        .replace(/\D/g, "")
        .slice(0, 10);

    setValue(
      "phone",
      digits,
      {
        shouldValidate:
          true,
        shouldDirty:
          true,
        shouldTouch:
          true,
      }
    );
  };

  const handleEmergencyPhoneChange =
    (
      value: string
    ) => {
      const digits =
        value
          .replace(
            /\D/g,
            ""
          )
          .slice(0, 10);

      setValue(
        "emergencyContactPhone",
        digits,
        {
          shouldValidate:
            true,
          shouldDirty:
            true,
          shouldTouch:
            true,
        }
      );
    };

  return (
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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onMouseDown={(
        event
      ) => {
        if (
          !isSubmitting &&
          event.target ===
            event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.96,
          y: 20,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.96,
          y: 20,
        }}
        transition={{
          duration: 0.2,
        }}
        className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg">
              <UserPlus className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Add New Patient
              </h2>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Register a new patient in MedCore HMS
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={
              isSubmitting
            }
            onClick={onClose}
            className="cursor-pointer rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(
            onSubmit
          )}
          className="overflow-y-auto"
        >
          <div className="space-y-7 p-5 sm:p-6">

            <FormSection
              icon={Users}
              title="Patient Information"
              description="Basic demographic and contact details"
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                <FormField
                  label="First Name"
                  required
                  error={
                    errors
                      .firstName
                      ?.message
                  }
                >
                  <input
                    {...register(
                      "firstName"
                    )}
                    disabled={
                      isSubmitting
                    }
                    placeholder="Enter first name"
                    className={inputClass(
                      !!errors.firstName
                    )}
                  />
                </FormField>

                <FormField
                  label="Last Name"
                  required
                  error={
                    errors
                      .lastName
                      ?.message
                  }
                >
                  <input
                    {...register(
                      "lastName"
                    )}
                    disabled={
                      isSubmitting
                    }
                    placeholder="Enter last name"
                    className={inputClass(
                      !!errors.lastName
                    )}
                  />
                </FormField>

                <FormField
                  label="Date of Birth"
                  required
                  error={
                    errors
                      .dateOfBirth
                      ?.message
                  }
                >
                  <input
                    type="date"
                    {...register(
                      "dateOfBirth"
                    )}
                    disabled={
                      isSubmitting
                    }
                    className={inputClass(
                      !!errors.dateOfBirth
                    )}
                  />
                </FormField>

                <FormField
                  label="Gender"
                  required
                  error={
                    errors
                      .gender
                      ?.message
                  }
                >
                  <select
                    {...register(
                      "gender"
                    )}
                    disabled={
                      isSubmitting
                    }
                    className={inputClass(
                      !!errors.gender
                    )}
                  >
                    <option value="">
                      Select gender
                    </option>

                    <option value="Male">
                      Male
                    </option>

                    <option value="Female">
                      Female
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                </FormField>

                <FormField
                  label="Phone"
                  required
                  error={
                    errors
                      .phone
                      ?.message
                  }
                >
                  <div
                    className={`flex h-10 w-full overflow-hidden rounded-xl border bg-slate-50 transition dark:bg-slate-800 ${
                      errors.phone
                        ? "border-red-400"
                        : "border-slate-200 focus-within:border-cyan-500 dark:border-slate-700"
                    }`}
                  >
                    <div className="flex shrink-0 items-center border-r border-slate-200 bg-slate-100 px-3 text-sm font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      +91
                    </div>

                    <input
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      maxLength={10}
                      disabled={
                        isSubmitting
                      }
                      placeholder="10 digit number"
                      {...register(
                        "phone",
                        {
                          onChange: (
                            event
                          ) =>
                            handlePhoneChange(
                              event
                                .target
                                .value
                            ),
                        }
                      )}
                      className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60 dark:text-white"
                    />
                  </div>
                </FormField>

                <FormField
                  label="Email"
                  error={
                    errors
                      .email
                      ?.message
                  }
                >
                  <input
                    type="email"
                    {...register(
                      "email"
                    )}
                    disabled={
                      isSubmitting
                    }
                    placeholder="patient@email.com"
                    className={inputClass(
                      !!errors.email
                    )}
                  />
                </FormField>

                <FormField
                  label="Blood Group"
                  required
                  error={
                    errors
                      .bloodGroup
                      ?.message
                  }
                >
                  <select
                    {...register(
                      "bloodGroup"
                    )}
                    disabled={
                      isSubmitting
                    }
                    className={inputClass(
                      !!errors.bloodGroup
                    )}
                  >
                    <option value="">
                      Select blood group
                    </option>

                    {[
                      "A+",
                      "A-",
                      "B+",
                      "B-",
                      "AB+",
                      "AB-",
                      "O+",
                      "O-",
                    ].map(
                      (group) => (
                        <option
                          key={
                            group
                          }
                          value={
                            group
                          }
                        >
                          {group}
                        </option>
                      )
                    )}
                  </select>
                </FormField>

                <FormField
                  label="Department"
                  required
                  error={
                    errors
                      .department
                      ?.message
                  }
                >
                  <select
                    {...register(
                      "department"
                    )}
                    disabled={
                      isSubmitting
                    }
                    className={inputClass(
                      !!errors.department
                    )}
                  >
                    <option value="">
                      Select department
                    </option>

                    <option>
                      General Medicine
                    </option>

                    <option>
                      Cardiology
                    </option>

                    <option>
                      Neurology
                    </option>

                    <option>
                      Orthopedics
                    </option>

                    <option>
                      Pediatrics
                    </option>

                    <option>
                      Dermatology
                    </option>

                    <option>
                      Gynecology
                    </option>

                    <option>
                      ENT
                    </option>

                    <option>
                      Ophthalmology
                    </option>
                  </select>
                </FormField>

                <div className="sm:col-span-2 lg:col-span-2">
                  <FormField
                    label="Address"
                    required
                    error={
                      errors
                        .address
                        ?.message
                    }
                  >
                    <textarea
                      {...register(
                        "address"
                      )}
                      disabled={
                        isSubmitting
                      }
                      rows={2}
                      placeholder="Enter complete address"
                      className={`${inputClass(
                        !!errors.address
                      )} resize-none`}
                    />
                  </FormField>
                </div>
              </div>
            </FormSection>

            <FormSection
              icon={HeartPulse}
              title="Emergency Contact"
              description="Person to contact in case of an emergency"
            >
              <div className="grid gap-4 sm:grid-cols-3">

                <FormField
                  label="Contact Name"
                  required
                  error={
                    errors
                      .emergencyContactName
                      ?.message
                  }
                >
                  <input
                    {...register(
                      "emergencyContactName"
                    )}
                    disabled={
                      isSubmitting
                    }
                    placeholder="Full name"
                    className={inputClass(
                      !!errors.emergencyContactName
                    )}
                  />
                </FormField>

                <FormField
                  label="Phone Number"
                  required
                  error={
                    errors
                      .emergencyContactPhone
                      ?.message
                  }
                >
                  <div
                    className={`flex h-10 w-full overflow-hidden rounded-xl border bg-slate-50 transition dark:bg-slate-800 ${
                      errors.emergencyContactPhone
                        ? "border-red-400"
                        : "border-slate-200 focus-within:border-cyan-500 dark:border-slate-700"
                    }`}
                  >
                    <div className="flex shrink-0 items-center border-r border-slate-200 bg-slate-100 px-3 text-sm font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      +91
                    </div>

                    <input
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      maxLength={10}
                      disabled={
                        isSubmitting
                      }
                      placeholder="10 digit number"
                      {...register(
                        "emergencyContactPhone",
                        {
                          onChange: (
                            event
                          ) =>
                            handleEmergencyPhoneChange(
                              event
                                .target
                                .value
                            ),
                        }
                      )}
                      className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60 dark:text-white"
                    />
                  </div>
                </FormField>

                <FormField
                  label="Relationship"
                  required
                  error={
                    errors
                      .emergencyContactRelation
                      ?.message
                  }
                >
                  <select
                    {...register(
                      "emergencyContactRelation"
                    )}
                    disabled={
                      isSubmitting
                    }
                    className={inputClass(
                      !!errors.emergencyContactRelation
                    )}
                  >
                    <option value="">
                      Select relationship
                    </option>

                    <option>
                      Father
                    </option>

                    <option>
                      Mother
                    </option>

                    <option>
                      Spouse
                    </option>

                    <option>
                      Son
                    </option>

                    <option>
                      Daughter
                    </option>

                    <option>
                      Sibling
                    </option>

                    <option>
                      Guardian
                    </option>

                    <option>
                      Other
                    </option>
                  </select>
                </FormField>
              </div>
            </FormSection>

            <FormSection
              icon={Activity}
              title="Medical History"
              description="Previous medical conditions and medications"
            >
              <div className="grid gap-4 lg:grid-cols-2">

                <FormField
                  label="Medical History"
                  error={
                    errors
                      .medicalHistory
                      ?.message
                  }
                >
                  <textarea
                    {...register(
                      "medicalHistory"
                    )}
                    disabled={
                      isSubmitting
                    }
                    rows={3}
                    placeholder="Previous illnesses, surgeries, chronic conditions..."
                    className={`${inputClass(
                      !!errors.medicalHistory
                    )} resize-none`}
                  />
                </FormField>

                <FormField
                  label="Allergies"
                  error={
                    errors
                      .allergies
                      ?.message
                  }
                >
                  <textarea
                    {...register(
                      "allergies"
                    )}
                    disabled={
                      isSubmitting
                    }
                    rows={3}
                    placeholder="Drug, food or environmental allergies..."
                    className={`${inputClass(
                      !!errors.allergies
                    )} resize-none`}
                  />
                </FormField>

                <FormField
                  label="Current Medications"
                  error={
                    errors
                      .currentMedications
                      ?.message
                  }
                >
                  <textarea
                    {...register(
                      "currentMedications"
                    )}
                    disabled={
                      isSubmitting
                    }
                    rows={3}
                    placeholder="Current medications and dosage..."
                    className={`${inputClass(
                      !!errors.currentMedications
                    )} resize-none`}
                  />
                </FormField>

                <FormField
                  label="Current Symptoms"
                  error={
                    errors
                      .symptoms
                      ?.message
                  }
                >
                  <textarea
                    {...register(
                      "symptoms"
                    )}
                    disabled={
                      isSubmitting
                    }
                    rows={3}
                    placeholder="Describe current symptoms..."
                    className={`${inputClass(
                      !!errors.symptoms
                    )} resize-none`}
                  />
                </FormField>
              </div>
            </FormSection>

            <FormSection
              icon={Stethoscope}
              title="Clinical Information"
              description="Initial clinical assessment"
            >
              <div className="grid gap-4 sm:grid-cols-2">

                <FormField
                  label="Diagnosis"
                  error={
                    errors
                      .diagnosis
                      ?.message
                  }
                >
                  <input
                    {...register(
                      "diagnosis"
                    )}
                    disabled={
                      isSubmitting
                    }
                    placeholder="Initial diagnosis if available"
                    className={inputClass(
                      !!errors.diagnosis
                    )}
                  />
                </FormField>

                <FormField
                  label="Assigned Doctor"
                  error={
                    errors
                      .doctor
                      ?.message
                  }
                >
                  <select
                    {...register(
                      "doctor"
                    )}
                    disabled={
                      isSubmitting
                    }
                    className={inputClass(
                      !!errors.doctor
                    )}
                  >
                    <option value="">
                      Select doctor
                    </option>

                    {doctors.length >
                    0 ? (
                      doctors.map(
                        (
                          doctor
                        ) => (
                          <option
                            key={String(
                              doctor.id
                            )}
                            value={
                              doctor.name
                            }
                          >
                            {
                              doctor.name
                            }
                            {" • "}
                            {
                              doctor.department
                            }
                          </option>
                        )
                      )
                    ) : (
                      <option
                        value=""
                        disabled
                      >
                        No doctors available
                      </option>
                    )}
                  </select>

                  {doctors.length >
                    0 && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-[10px] font-medium text-cyan-600 dark:text-cyan-400">
                      <Stethoscope className="h-3 w-3" />
                      {doctors.length} doctors available from Doctors module
                    </p>
                  )}
                </FormField>
              </div>
            </FormSection>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end dark:border-slate-800 dark:bg-slate-900/80">
            <button
              type="button"
              onClick={onClose}
              disabled={
                isSubmitting
              }
              className="cursor-pointer rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-white disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                isSubmitting
              }
              className={`flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 ${
                isSubmitting
                  ? "cursor-wait opacity-80"
                  : "cursor-pointer hover:-translate-y-0.5"
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Registering...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Register Patient
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ============================================================
   PATIENT DETAILS MODAL
============================================================ */

function PatientDetailsModal({
  patient,
  onClose,
  onEdit,
  onDelete,
}: {
  patient: Patient;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const statusStyles = {
    Active:
      "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-900",

    Critical:
      "bg-red-50 text-red-700 ring-red-200 dark:bg-red-950/40 dark:text-red-400 dark:ring-red-900",

    Inactive:
      "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700",
  };

  return (
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
      className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/65 p-3 backdrop-blur-sm sm:p-5"
      onMouseDown={(
        event
      ) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.96,
          y: 20,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.96,
          y: 20,
        }}
        transition={{
          duration: 0.2,
        }}
        className="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900"
      >

        <div className="relative shrink-0 overflow-hidden bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10" />

          <div className="pointer-events-none absolute -bottom-32 right-32 h-56 w-56 rounded-full bg-white/5" />

          <div className="relative px-5 pb-5 pt-5 sm:px-7 sm:pb-6 sm:pt-6">
            <div className="flex items-start justify-between gap-4">

              <div className="flex min-w-0 items-center gap-4">

                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/30 bg-white/20 text-xl font-bold text-white shadow-lg backdrop-blur-md sm:h-20 sm:w-20 sm:text-2xl">
                  {patient.avatar}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">

                    <h2 className="truncate text-xl font-bold text-white sm:text-2xl">
                      {patient.name}
                    </h2>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ring-1 ${statusStyles[patient.status]}`}
                    >
                      {patient.status}
                    </span>
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-blue-100">
                    <span className="font-semibold">
                      {patient.id}
                    </span>

                    <span className="hidden sm:inline">
                      •
                    </span>

                    <span>
                      {patient.department}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close patient details"
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <PatientQuickStat
                label="Age"
                value={`${patient.age} years`}
              />

              <PatientQuickStat
                label="Gender"
                value={
                  patient.gender
                }
              />

              <PatientQuickStat
                label="Blood Group"
                value={
                  patient.bloodGroup
                }
              />

              <PatientQuickStat
                label="Registered"
                value={
                  patient.registered
                }
              />
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50/70 p-4 sm:p-6 dark:bg-slate-950/40">
          <div className="space-y-5">

            <PatientDetailSection
              icon={Users}
              title="Contact Information"
              subtitle="Patient contact and personal details"
            >
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <PatientInfoCard
                  icon={Phone}
                  label="Mobile Number"
                  value={
                    patient.phone
                  }
                />

                <PatientInfoCard
                  icon={Mail}
                  label="Email Address"
                  value={
                    patient.email ||
                    "Not provided"
                  }
                />

                <PatientInfoCard
                  icon={
                    CalendarDays
                  }
                  label="Date of Birth"
                  value={
                    patient.dateOfBirth ||
                    "Not provided"
                  }
                />

                <PatientInfoCard
                  icon={MapPin}
                  label="Address"
                  value={
                    patient.address ||
                    "Not provided"
                  }
                  wide
                />
              </div>
            </PatientDetailSection>

            <PatientDetailSection
              icon={
                ShieldAlert
              }
              title="Emergency Contact"
              subtitle="Emergency contact information"
              highlighted
            >
              <div className="grid gap-3 sm:grid-cols-3">
                <PatientInfoCard
                  icon={Users}
                  label="Contact Name"
                  value={
                    patient.emergencyContactName ||
                    "Not provided"
                  }
                  highlighted
                />

                <PatientInfoCard
                  icon={Phone}
                  label="Phone Number"
                  value={
                    patient.emergencyContactPhone ||
                    "Not provided"
                  }
                  highlighted
                />

                <PatientInfoCard
                  icon={
                    HeartPulse
                  }
                  label="Relationship"
                  value={
                    patient.emergencyContactRelation ||
                    "Not provided"
                  }
                  highlighted
                />
              </div>
            </PatientDetailSection>

            <PatientDetailSection
              icon={
                Stethoscope
              }
              title="Clinical Information"
              subtitle="Current clinical assessment and care"
            >
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

                <PatientInfoCard
                  icon={
                    HeartPulse
                  }
                  label="Department"
                  value={
                    patient.department
                  }
                />

                <PatientInfoCard
                  icon={Activity}
                  label="Blood Group"
                  value={
                    patient.bloodGroup
                  }
                />

                <PatientInfoCard
                  icon={Users}
                  label="Assigned Doctor"
                  value={
                    patient.doctor ||
                    "Not assigned"
                  }
                />

                <PatientTextCard
                  label="Current Symptoms"
                  value={
                    patient.symptoms ||
                    "No symptoms provided."
                  }
                  wide
                />

                <PatientTextCard
                  label="Diagnosis"
                  value={
                    patient.diagnosis ||
                    "No diagnosis provided."
                  }
                  wide
                />
              </div>
            </PatientDetailSection>

            <PatientDetailSection
              icon={Activity}
              title="Medical History"
              subtitle="Medical background and current medications"
            >
              <div className="grid gap-3 lg:grid-cols-3">

                <PatientTextCard
                  label="Medical History"
                  value={
                    patient.medicalHistory ||
                    "No medical history provided."
                  }
                />

                <PatientTextCard
                  label="Allergies"
                  value={
                    patient.allergies ||
                    "No allergies provided."
                  }
                />

                <PatientTextCard
                  label="Current Medications"
                  value={
                    patient.currentMedications ||
                    "No current medications provided."
                  }
                />
              </div>
            </PatientDetailSection>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-3 border-t border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-slate-800 dark:bg-slate-900">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Patient Record
            </p>

            <p className="mt-0.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
              {patient.id}
            </p>
          </div>

          <div className="flex w-full gap-2 sm:w-auto">

            <button
              type="button"
              onClick={
                onDelete
              }
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 sm:flex-none dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>

            <button
              type="button"
              onClick={
                onClose
              }
              className="flex flex-1 cursor-pointer items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:flex-none dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Close
            </button>

            <button
              type="button"
              onClick={
                onEdit
              }
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:from-cyan-700 hover:to-blue-700 sm:flex-none"
            >
              <Edit3 className="h-4 w-4" />
              Edit Patient
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ============================================================
   PATIENT QUICK STAT
============================================================ */

function PatientQuickStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/10 px-3 py-2.5 backdrop-blur-sm">
      <p className="text-[10px] font-medium uppercase tracking-wider text-blue-100">
        {label}
      </p>

      <p className="mt-0.5 truncate text-sm font-bold text-white">
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   PATIENT DETAIL SECTION
============================================================ */

function PatientDetailSection({
  icon: Icon,
  title,
  subtitle,
  children,
  highlighted = false,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  highlighted?: boolean;
}) {
  return (
    <section
      className={`rounded-2xl border p-4 sm:p-5 ${
        highlighted
          ? "border-amber-200/70 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-950/10"
          : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
      }`}
    >
      <div className="mb-4 flex items-center gap-3">

        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
            highlighted
              ? "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400"
              : "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400"
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>

        <div className="min-w-0">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">
            {title}
          </h3>

          <p className="mt-0.5 text-[11px] text-slate-400">
            {subtitle}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}

/* ============================================================
   PATIENT INFO CARD
============================================================ */

function PatientInfoCard({
  icon: Icon,
  label,
  value,
  wide = false,
  highlighted = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  wide?: boolean;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-3.5 ${
        wide
          ? "sm:col-span-2 lg:col-span-3"
          : ""
      } ${
        highlighted
          ? "border-amber-200 bg-white dark:border-amber-900/50 dark:bg-slate-900"
          : "border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-800/40"
      }`}
    >
      <div className="mb-2 flex items-center gap-2">

        <div
          className={`flex h-7 w-7 items-center justify-center rounded-lg ${
            highlighted
              ? "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400"
              : "bg-white text-cyan-600 shadow-sm dark:bg-slate-800 dark:text-cyan-400"
          }`}
        >
          <Icon className="h-3.5 w-3.5" />
        </div>

        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </p>
      </div>

      <p className="break-words text-sm font-semibold text-slate-700 dark:text-slate-200">
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   PATIENT TEXT CARD
============================================================ */

function PatientTextCard({
  label,
  value,
  wide = false,
}: {
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40 ${
        wide
          ? "sm:col-span-2 lg:col-span-3"
          : ""
      }`}
    >
      <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700 dark:text-slate-200">
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   EDIT PATIENT MODAL
============================================================ */

function EditPatientModal({
  patient,
  doctors,
  onClose,
  onSave,
}: {
  patient: Patient;
  doctors: Doctor[];
  onClose: () => void;
  onSave: (
    patient: Patient
  ) => void;
}) {
  const [name, setName] =
    useState(patient.name);

  const [phone, setPhone] =
    useState(
      getPhoneDigits(
        patient.phone
      )
    );

  const [department, setDepartment] =
    useState(
      patient.department
    );

  const [bloodGroup, setBloodGroup] =
    useState(
      patient.bloodGroup
    );

  const [status, setStatus] =
    useState(
      patient.status
    );

  const [doctor, setDoctor] =
    useState(
      patient.doctor || ""
    );

  const [saving, setSaving] =
    useState(false);

  const handleSave =
    async () => {
      if (!name.trim())
        return;

      if (
        phone.length !==
        10
      )
        return;

      setSaving(true);

      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            800
          )
      );

      onSave({
        ...patient,

        name:
          name.trim(),

        phone:
          formatIndianPhone(
            phone
          ),

        department,

        bloodGroup,

        status,

        doctor,

        avatar:
          name
            .trim()
            .split(" ")
            .filter(Boolean)
            .map(
              (
                part
              ) =>
                part.charAt(
                  0
                )
            )
            .join("")
            .slice(
              0,
              2
            )
            .toUpperCase(),
      });

      setSaving(false);
    };

  return (
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
      className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
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
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900"
      >
        <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white">
              Edit Patient
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Update patient information
            </p>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            disabled={
              saving
            }
            className="cursor-pointer rounded-lg p-2 text-slate-400 hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-5">

          <FormField label="Patient Name">
            <input
              value={name}
              onChange={(
                event
              ) =>
                setName(
                  event
                    .target
                    .value
                )
              }
              disabled={
                saving
              }
              className={inputClass()}
            />
          </FormField>

          <FormField label="Phone Number">
            <div className="flex h-10 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">

              <div className="flex items-center border-r border-slate-200 bg-slate-100 px-3 text-sm font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                +91
              </div>

              <input
                value={phone}
                onChange={(
                  event
                ) =>
                  setPhone(
                    event.target.value
                      .replace(
                        /\D/g,
                        ""
                      )
                      .slice(
                        0,
                        10
                      )
                  )
                }
                inputMode="numeric"
                maxLength={
                  10
                }
                disabled={
                  saving
                }
                className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none dark:text-white"
              />
            </div>

            {phone.length >
              0 &&
              phone.length <
                10 && (
                <p className="mt-1 text-[11px] text-red-500">
                  Mobile number must be 10 digits.
                </p>
              )}
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">

            <FormField label="Blood Group">
              <select
                value={
                  bloodGroup
                }
                onChange={(
                  event
                ) =>
                  setBloodGroup(
                    event
                      .target
                      .value
                  )
                }
                disabled={
                  saving
                }
                className={inputClass()}
              >
                {[
                  "A+",
                  "A-",
                  "B+",
                  "B-",
                  "AB+",
                  "AB-",
                  "O+",
                  "O-",
                ].map(
                  (
                    group
                  ) => (
                    <option
                      key={
                        group
                      }
                      value={
                        group
                      }
                    >
                      {group}
                    </option>
                  )
                )}
              </select>
            </FormField>

            <FormField label="Department">
              <select
                value={
                  department
                }
                onChange={(
                  event
                ) =>
                  setDepartment(
                    event
                      .target
                      .value
                  )
                }
                disabled={
                  saving
                }
                className={inputClass()}
              >
                {[
                  "General Medicine",
                  "Cardiology",
                  "Neurology",
                  "Orthopedics",
                  "Pediatrics",
                  "Dermatology",
                  "Gynecology",
                  "ENT",
                  "Ophthalmology",
                ].map(
                  (
                    item
                  ) => (
                    <option
                      key={
                        item
                      }
                      value={
                        item
                      }
                    >
                      {item}
                    </option>
                  )
                )}
              </select>
            </FormField>
          </div>

          <FormField label="Status">
            <select
              value={
                status
              }
              onChange={(
                event
              ) =>
                setStatus(
                  event
                    .target
                    .value as Patient["status"]
                )
              }
              disabled={
                saving
              }
              className={inputClass()}
            >
              <option value="Active">
                Active
              </option>

              <option value="Critical">
                Critical
              </option>

              <option value="Inactive">
                Inactive
              </option>
            </select>
          </FormField>

          <FormField label="Assigned Doctor">
            <select
              value={
                doctor
              }
              onChange={(
                event
              ) =>
                setDoctor(
                  event
                    .target
                    .value
                )
              }
              disabled={
                saving
              }
              className={inputClass()}
            >
              <option value="">
                Not assigned
              </option>

              {doctors.length >
              0 ? (
                doctors.map(
                  (
                    item
                  ) => (
                    <option
                      key={String(
                        item.id
                      )}
                      value={
                        item.name
                      }
                    >
                      {item.name}
                      {" • "}
                      {
                        item.department
                      }
                    </option>
                  )
                )
              ) : (
                <option
                  value=""
                  disabled
                >
                  No doctors available
                </option>
              )}
            </select>

            {doctors.length >
              0 && (
              <p className="mt-1.5 flex items-center gap-1.5 text-[10px] font-medium text-cyan-600 dark:text-cyan-400">
                <Stethoscope className="h-3 w-3" />
                {doctors.length} doctors available from Doctors module
              </p>
            )}
          </FormField>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">

          <button
            type="button"
            onClick={
              onClose
            }
            disabled={
              saving
            }
            className="cursor-pointer rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={
              handleSave
            }
            disabled={
              saving ||
              phone.length !==
                10 ||
              !name.trim()
            }
            className={`flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white ${
              saving
                ? "cursor-wait opacity-80"
                : "cursor-pointer"
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {saving ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ============================================================
   DELETE MODAL
============================================================ */

function DeletePatientModal({
  patient,
  onCancel,
  onConfirm,
}: {
  patient: Patient;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const [deleting, setDeleting] =
    useState(false);

  const handleDelete =
    async () => {
      setDeleting(true);

      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            700
          )
      );

      onConfirm();

      setDeleting(false);
    };

  return (
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
      className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
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
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
          <Trash2 className="h-5 w-5" />
        </div>

        <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
          Delete Patient?
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {patient.name}
          </span>
          ? This patient will be removed from the patient directory.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={
              onCancel
            }
            disabled={
              deleting
            }
            className="cursor-pointer rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={
              handleDelete
            }
            disabled={
              deleting
            }
            className={`flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white ${
              deleting
                ? "cursor-wait opacity-80"
                : "cursor-pointer hover:bg-red-700"
            }`}
          >
            {deleting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete Patient
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ============================================================
   TABLE ROW
============================================================ */

function PatientTableRow({
  patient,
  onView,
  onEdit,
  onDelete,
}: {
  patient: Patient;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [showActions, setShowActions] =
    useState(false);

  return (
    <tr className="group transition hover:bg-slate-50/70 dark:hover:bg-slate-800/40">

      <td className="px-5 py-4">
        <div className="flex items-center gap-3">

          <PatientAvatar
            initials={
              patient.avatar
            }
          />

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800 dark:text-white">
              {patient.name}
            </p>

            <p className="text-xs text-slate-400">
              Registered{" "}
              {
                patient.registered
              }
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-4 text-xs font-semibold text-slate-500">
        {patient.id}
      </td>

      <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
        {patient.age} /{" "}
        {patient.gender}
      </td>

      <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
        {patient.phone}
      </td>

      <td className="px-4 py-4">
        <span className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600 dark:bg-red-950/30 dark:text-red-400">
          {patient.bloodGroup}
        </span>
      </td>

      <td className="px-4 py-4">
        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {patient.department}
        </span>
      </td>

      <td className="px-4 py-4">
        <StatusBadge
          status={
            patient.status
          }
        />
      </td>

      <td className="relative px-4 py-4">
        <div className="flex items-center gap-1">

          <button
            type="button"
            title="View Patient"
            onClick={
              onView
            }
            className="cursor-pointer rounded-lg p-2 text-slate-400 transition hover:bg-cyan-50 hover:text-cyan-600 dark:hover:bg-cyan-950/40"
          >
            <Eye className="h-4 w-4" />
          </button>

          <button
            type="button"
            title="Edit Patient"
            onClick={
              onEdit
            }
            className="cursor-pointer rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/40"
          >
            <Edit3 className="h-4 w-4" />
          </button>

          <button
            type="button"
            title="More actions"
            onClick={() =>
              setShowActions(
                (value) =>
                  !value
              )
            }
            className="cursor-pointer rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
                y: -5,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: -5,
              }}
              className="absolute right-4 top-12 z-30 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-700 dark:bg-slate-900"
            >
              <button
                type="button"
                onClick={() => {
                  setShowActions(
                    false
                  );
                  onView();
                }}
                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Eye className="h-3.5 w-3.5" />
                View Patient
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowActions(
                    false
                  );
                  onEdit();
                }}
                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Edit3 className="h-3.5 w-3.5" />
                Edit Patient
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowActions(
                    false
                  );
                  onDelete();
                }}
                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete Patient
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </td>
    </tr>
  );
}

/* ============================================================
   MOBILE PATIENT CARD
============================================================ */

function PatientMobileCard({
  patient,
  onView,
  onEdit,
  onDelete,
}: {
  patient: Patient;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="p-4">

      <div className="flex items-start justify-between gap-3">

        <div className="flex min-w-0 items-center gap-3">

          <PatientAvatar
            initials={
              patient.avatar
            }
          />

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-800 dark:text-white">
              {patient.name}
            </p>

            <p className="text-xs text-slate-400">
              {patient.id}
            </p>
          </div>
        </div>

        <StatusBadge
          status={
            patient.status
          }
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">

        <InfoItem
          label="Age / Gender"
          value={`${patient.age} / ${patient.gender}`}
        />

        <InfoItem
          label="Blood Group"
          value={
            patient.bloodGroup
          }
        />

        <InfoItem
          label="Department"
          value={
            patient.department
          }
        />

        <InfoItem
          label="Phone"
          value={
            patient.phone
          }
        />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">

        <button
          type="button"
          onClick={
            onView
          }
          className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-cyan-50 py-2.5 text-xs font-semibold text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-400"
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </button>

        <button
          type="button"
          onClick={
            onEdit
          }
          className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-blue-50 py-2.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
        >
          <Edit3 className="h-3.5 w-3.5" />
          Edit
        </button>

        <button
          type="button"
          onClick={
            onDelete
          }
          className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-red-50 py-2.5 text-xs font-semibold text-red-600 dark:bg-red-950/40 dark:text-red-400"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   FORM SECTION
============================================================ */

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
    <section>
      <div className="mb-4 flex items-start gap-3">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400">
          <Icon className="h-4 w-4" />
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">
            {title}
          </h3>

          <p className="mt-0.5 text-xs text-slate-400">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}

/* ============================================================
   FORM FIELD
============================================================ */

function FormField({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      {children}

      {error && (
        <p className="mt-1 text-[11px] font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

/* ============================================================
   INPUT CLASS
============================================================ */

function inputClass(
  hasError = false
) {
  return `
    h-10 w-full rounded-xl border
    ${
      hasError
        ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
        : "border-slate-200 focus:border-cyan-500 focus:ring-cyan-500/20"
    }
    bg-slate-50 px-3 text-sm
    text-slate-800 outline-none
    transition
    focus:ring-2
    disabled:cursor-not-allowed
    disabled:opacity-60
    dark:border-slate-700
    dark:bg-slate-800
    dark:text-white
    dark:placeholder:text-slate-500
  `;
}

/* ============================================================
   STAT CARD
============================================================ */

function PatientStat({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient,
  positive,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  gradient: string;
  positive?: boolean;
}) {
  return (
    <motion.div
      whileHover={{
        y: -3,
      }}
      className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div
        className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${gradient} opacity-10 blur-xl`}
      />

      <div className="relative flex items-start justify-between">

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg`}
        >
          <Icon className="h-5 w-5" />
        </div>

        {positive && (
          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-500">
            <ArrowUpRight className="h-3 w-3" />
            Growth
          </span>
        )}
      </div>

      <p className="mt-5 text-sm font-medium text-slate-500 dark:text-slate-400">
        {title}
      </p>

      <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {subtitle}
      </p>
    </motion.div>
  );
}

/* ============================================================
   AVATAR
============================================================ */

function PatientAvatar({
  initials,
}: {
  initials: string;
}) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-xs font-bold text-white shadow-sm">
      {initials}
    </div>
  );
}

/* ============================================================
   STATUS
============================================================ */

function StatusBadge({
  status,
}: {
  status: Patient["status"];
}) {
  const styles = {
    Active:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",

    Critical:
      "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400",

    Inactive:
      "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

/* ============================================================
   INFO ITEM
============================================================ */

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">

      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-xs font-semibold text-slate-700 dark:text-slate-200">
        {value}
      </p>
    </div>
  );
}