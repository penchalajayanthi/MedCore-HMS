"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  Check,
  Clock3,
  ClipboardCheck,
  FileText,
  HeartPulse,
  ShieldCheck,
  Siren,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

type Doctor = {
  id: string;
  name: string;
  department: string;
};

type Patient = {
  id: string;
  name: string;
  phone: string;
};

type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

type Appointment = {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  type: string;
  reason?: string;
  emergency: boolean;
  status: AppointmentStatus;
};

type DaySchedule = {
  day: string;
  shortDay: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
  slotDuration: number;
};

type StoredDoctorAvailability = {
  doctorId: string;
  doctorName: string;
  schedule: DaySchedule[];
};

type AvailabilityStore = Record<string, StoredDoctorAvailability>;

const PATIENTS_STORAGE_KEY = "medcore_patients";
const APPOINTMENTS_STORAGE_KEY = "medcore_appointments";
const DOCTORS_STORAGE_KEY = "medcore_doctors";
const AVAILABILITY_STORAGE_KEY = "medcore_doctor_availability";

const PATIENTS_UPDATED_EVENT = "medcore-patients-updated";
const APPOINTMENTS_UPDATED_EVENT = "medcore-appointments-updated";
const DOCTORS_UPDATED_EVENT = "medcore-doctors-updated";
const AVAILABILITY_UPDATED_EVENT = "medcore-doctor-availability-updated";

const fallbackPatients: Patient[] = [
  {
    id: "PAT-001",
    name: "Ananya Reddy",
    phone: "+91 9876543210",
  },
  {
    id: "PAT-002",
    name: "Rahul Kumar",
    phone: "+91 9123456780",
  },
  {
    id: "PAT-003",
    name: "Sneha Rao",
    phone: "+91 9988776655",
  },
  {
    id: "PAT-004",
    name: "Vikram Singh",
    phone: "+91 9090909090",
  },
];

const appointmentTypes = [
  "CONSULTATION",
  "FOLLOW_UP",
  "CHECKUP",
  "PROCEDURE",
];

function getTodayDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function normalizePatient(raw: unknown, index: number): Patient | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const item = raw as Record<string, unknown>;

  const id = String(
    item.id ??
      item.patientId ??
      item._id ??
      item.employeeId ??
      `PAT-${String(index + 1).padStart(3, "0")}`,
  );

  const name = String(
    item.name ??
      item.fullName ??
      item.patientName ??
      item.displayName ??
      "",
  ).trim();

  const phone = String(
    item.phone ??
      item.mobile ??
      item.mobileNumber ??
      item.phoneNumber ??
      "",
  ).trim();

  if (!name) {
    return null;
  }

  return {
    id,
    name,
    phone,
  };
}

function normalizeDoctor(raw: unknown, index: number): Doctor | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const item = raw as Record<string, unknown>;

  const id = String(
    item.id ??
      item.doctorId ??
      item._id ??
      item.employeeId ??
      `DOC-${String(index + 1).padStart(3, "0")}`,
  );

  const name = String(
    item.name ??
      item.fullName ??
      item.doctorName ??
      item.displayName ??
      "",
  ).trim();

  const department = String(
    item.department ??
      item.departmentName ??
      item.specialization ??
      item.specialty ??
      "",
  ).trim();

  if (!name) {
    return null;
  }

  return {
    id,
    name: name.startsWith("Dr.") ? name : `Dr. ${name}`,
    department: department || "General Medicine",
  };
}

function getDoctorsFromStorage(): Doctor[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = localStorage.getItem(DOCTORS_STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    let source: unknown[] = [];

    if (Array.isArray(parsed)) {
      source = parsed;
    } else if (parsed && typeof parsed === "object") {
      const object = parsed as Record<string, unknown>;

      if (Array.isArray(object.doctors)) {
        source = object.doctors;
      } else if (Array.isArray(object.data)) {
        source = object.data;
      } else if (Array.isArray(object.items)) {
        source = object.items;
      }
    }

    return source
      .map((doctor, index) => normalizeDoctor(doctor, index))
      .filter((doctor): doctor is Doctor => Boolean(doctor));
  } catch {
    return [];
  }
}

function parseTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
}

function formatTime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;

  return `${displayHour}:${String(mins).padStart(2, "0")} ${period}`;
}

function generateSlots(
  startTime: string,
  endTime: string,
  duration: number,
) {
  const start = parseTime(startTime);
  const end = parseTime(endTime);

  const slots: string[] = [];

  if (
    Number.isNaN(start) ||
    Number.isNaN(end) ||
    !duration ||
    duration <= 0
  ) {
    return slots;
  }

  for (let time = start; time + duration <= end; time += duration) {
    slots.push(formatTime(time));
  }

  return slots;
}

function getWeekday(dateString: string) {
  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("en-US", {
    weekday: "long",
  });
}

function getDefaultAvailability(
  doctor: Doctor,
): StoredDoctorAvailability {
  return {
    doctorId: doctor.id,
    doctorName: doctor.name,
    schedule: [
      {
        day: "Monday",
        shortDay: "Mon",
        enabled: true,
        startTime: "09:00",
        endTime: "13:00",
        slotDuration: 30,
      },
      {
        day: "Tuesday",
        shortDay: "Tue",
        enabled: true,
        startTime: "09:00",
        endTime: "13:00",
        slotDuration: 30,
      },
      {
        day: "Wednesday",
        shortDay: "Wed",
        enabled: true,
        startTime: "09:00",
        endTime: "13:00",
        slotDuration: 30,
      },
      {
        day: "Thursday",
        shortDay: "Thu",
        enabled: true,
        startTime: "09:00",
        endTime: "13:00",
        slotDuration: 30,
      },
      {
        day: "Friday",
        shortDay: "Fri",
        enabled: true,
        startTime: "09:00",
        endTime: "13:00",
        slotDuration: 30,
      },
      {
        day: "Saturday",
        shortDay: "Sat",
        enabled: false,
        startTime: "09:00",
        endTime: "13:00",
        slotDuration: 30,
      },
      {
        day: "Sunday",
        shortDay: "Sun",
        enabled: false,
        startTime: "09:00",
        endTime: "13:00",
        slotDuration: 30,
      },
    ],
  };
}

export default function NewAppointmentPage() {
  const router = useRouter();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [availabilityStore, setAvailabilityStore] =
    useState<AvailabilityStore>({});

  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");

  const [appointmentDate, setAppointmentDate] =
    useState(getTodayDate());

  const [selectedTime, setSelectedTime] = useState("");

  const [appointmentType, setAppointmentType] =
    useState("CONSULTATION");

  // IMPORTANT:
  // Emergency is optional and OFF by default.
  const [isEmergency, setIsEmergency] = useState(false);

  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const selectedDoctor = useMemo(
    () => doctors.find((doctor) => doctor.id === doctorId),
    [doctors, doctorId],
  );

  const selectedPatient = useMemo(
    () => patients.find((patient) => patient.id === patientId),
    [patients, patientId],
  );

  useEffect(() => {
    const loadDoctors = () => {
      const storedDoctors = getDoctorsFromStorage();

      setDoctors(storedDoctors);

      setDoctorId((currentDoctorId) => {
        if (
          currentDoctorId &&
          storedDoctors.some(
            (doctor) => doctor.id === currentDoctorId,
          )
        ) {
          return currentDoctorId;
        }

        return storedDoctors[0]?.id ?? "";
      });
    };

    const loadPatients = () => {
      try {
        const raw = localStorage.getItem(PATIENTS_STORAGE_KEY);

        if (!raw) {
          setPatients(fallbackPatients);
          return;
        }

        const parsed = JSON.parse(raw);

        let source: unknown[] = [];

        if (Array.isArray(parsed)) {
          source = parsed;
        } else if (parsed && typeof parsed === "object") {
          const object = parsed as Record<string, unknown>;

          if (Array.isArray(object.patients)) {
            source = object.patients;
          } else if (Array.isArray(object.data)) {
            source = object.data;
          } else if (Array.isArray(object.items)) {
            source = object.items;
          }
        }

        const normalized = source
          .map((patient, index) =>
            normalizePatient(patient, index),
          )
          .filter(
            (patient): patient is Patient => Boolean(patient),
          );

        setPatients(
          normalized.length > 0 ? normalized : fallbackPatients,
        );
      } catch {
        setPatients(fallbackPatients);
      }
    };

    const loadAppointments = () => {
      try {
        const raw = localStorage.getItem(
          APPOINTMENTS_STORAGE_KEY,
        );

        if (!raw) {
          setAppointments([]);
          return;
        }

        const parsed = JSON.parse(raw);

        if (Array.isArray(parsed)) {
          setAppointments(parsed);
        } else {
          setAppointments([]);
        }
      } catch {
        setAppointments([]);
      }
    };

    const loadAvailability = () => {
      try {
        const raw = localStorage.getItem(
          AVAILABILITY_STORAGE_KEY,
        );

        if (!raw) {
          setAvailabilityStore({});
          return;
        }

        const parsed = JSON.parse(raw);

        if (parsed && typeof parsed === "object") {
          setAvailabilityStore(parsed);
        } else {
          setAvailabilityStore({});
        }
      } catch {
        setAvailabilityStore({});
      }
    };

    loadDoctors();
    loadPatients();
    loadAppointments();
    loadAvailability();

    setDataLoaded(true);

    const handleDoctorsUpdated = () => {
      loadDoctors();
    };

    const handlePatientsUpdated = () => {
      loadPatients();
    };

    const handleAppointmentsUpdated = () => {
      loadAppointments();
    };

    const handleAvailabilityUpdated = () => {
      loadAvailability();
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === DOCTORS_STORAGE_KEY) {
        loadDoctors();
      }

      if (event.key === PATIENTS_STORAGE_KEY) {
        loadPatients();
      }

      if (event.key === APPOINTMENTS_STORAGE_KEY) {
        loadAppointments();
      }

      if (event.key === AVAILABILITY_STORAGE_KEY) {
        loadAvailability();
      }
    };

    window.addEventListener(
      DOCTORS_UPDATED_EVENT,
      handleDoctorsUpdated,
    );

    window.addEventListener(
      PATIENTS_UPDATED_EVENT,
      handlePatientsUpdated,
    );

    window.addEventListener(
      APPOINTMENTS_UPDATED_EVENT,
      handleAppointmentsUpdated,
    );

    window.addEventListener(
      AVAILABILITY_UPDATED_EVENT,
      handleAvailabilityUpdated,
    );

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(
        DOCTORS_UPDATED_EVENT,
        handleDoctorsUpdated,
      );

      window.removeEventListener(
        PATIENTS_UPDATED_EVENT,
        handlePatientsUpdated,
      );

      window.removeEventListener(
        APPOINTMENTS_UPDATED_EVENT,
        handleAppointmentsUpdated,
      );

      window.removeEventListener(
        AVAILABILITY_UPDATED_EVENT,
        handleAvailabilityUpdated,
      );

      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const currentAvailability = useMemo(() => {
    if (!selectedDoctor) {
      return null;
    }

    return (
      availabilityStore[selectedDoctor.id] ??
      getDefaultAvailability(selectedDoctor)
    );
  }, [availabilityStore, selectedDoctor]);

  const selectedWeekday = useMemo(
    () => getWeekday(appointmentDate),
    [appointmentDate],
  );

  const selectedDaySchedule = useMemo(() => {
    if (!currentAvailability) {
      return null;
    }

    return currentAvailability.schedule.find(
      (day) => day.day === selectedWeekday,
    );
  }, [currentAvailability, selectedWeekday]);

  const timeSlots = useMemo(() => {
    if (!selectedDaySchedule || !selectedDaySchedule.enabled) {
      return [];
    }

    return generateSlots(
      selectedDaySchedule.startTime,
      selectedDaySchedule.endTime,
      selectedDaySchedule.slotDuration,
    );
  }, [selectedDaySchedule]);

  const activeAppointments = useMemo(
    () =>
      appointments.filter(
        (appointment) =>
          appointment.status !== "CANCELLED" &&
          appointment.status !== "NO_SHOW",
      ),
    [appointments],
  );

  const doctorConflictingTimes = useMemo(() => {
    if (!doctorId || !appointmentDate) {
      return new Set<string>();
    }

    return new Set(
      activeAppointments
        .filter(
          (appointment) =>
            appointment.doctorId === doctorId &&
            appointment.date === appointmentDate &&
            appointment.time !== "EMERGENCY",
        )
        .map((appointment) => appointment.time),
    );
  }, [activeAppointments, doctorId, appointmentDate]);

  const patientConflictingTimes = useMemo(() => {
    if (!patientId || !appointmentDate) {
      return new Set<string>();
    }

    return new Set(
      activeAppointments
        .filter(
          (appointment) =>
            appointment.patientId === patientId &&
            appointment.date === appointmentDate &&
            appointment.time !== "EMERGENCY",
        )
        .map((appointment) => appointment.time),
    );
  }, [activeAppointments, patientId, appointmentDate]);

  const availableTimeSlots = useMemo(
    () =>
      timeSlots.map((time) => ({
        time,
        disabled:
          doctorConflictingTimes.has(time) ||
          patientConflictingTimes.has(time),
      })),
    [timeSlots, doctorConflictingTimes, patientConflictingTimes],
  );

  const isFormReady =
  Boolean(patientId) &&
  Boolean(doctorId) &&
  Boolean(appointmentDate) &&
  Boolean(selectedTime);

  useEffect(() => {
    if (!isEmergency && selectedTime) {
      const stillValid = availableTimeSlots.some(
        (slot) => slot.time === selectedTime && !slot.disabled,
      );

      if (!stillValid) {
        setSelectedTime("");
      }
    }
  }, [availableTimeSlots, isEmergency, selectedTime]);

  const handleEmergencyChange = (enabled: boolean) => {
    setIsEmergency(enabled);

    if (enabled) {
      // Emergency appointments do not require a regular slot.
      setSelectedTime("");
    }
  };

  const handleSubmit = () => {
    if (!patientId) {
      toast.error("Please select a patient.");
      return;
    }

    if (!doctorId) {
      toast.error("Please select a doctor.");
      return;
    }

    if (!appointmentDate) {
      toast.error("Please select an appointment date.");
      return;
    }

    // Only require time for NON-EMERGENCY appointments.
    if (!isEmergency && !selectedTime) {
      toast.error("Please select an available time slot.");
      return;
    }

    if (!selectedDoctor || !selectedPatient) {
      toast.error("Please select a valid patient and doctor.");
      return;
    }

    setIsSubmitting(true);

    try {
      const newAppointment: Appointment = {
        id: `APT-${Date.now()}`,
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        department: selectedDoctor.department,
        date: appointmentDate,

        // Emergency can skip the regular time slot.
        time: isEmergency ? "EMERGENCY" : selectedTime,

        type: appointmentType,
        reason: reason.trim(),
        emergency: isEmergency,
        status: "PENDING",
      };

      const existingRaw = localStorage.getItem(
        APPOINTMENTS_STORAGE_KEY,
      );

      let existingAppointments: Appointment[] = [];

      try {
        const parsed = existingRaw
          ? JSON.parse(existingRaw)
          : [];

        if (Array.isArray(parsed)) {
          existingAppointments = parsed;
        }
      } catch {
        existingAppointments = [];
      }

      const updatedAppointments = [
        ...existingAppointments,
        newAppointment,
      ];

      localStorage.setItem(
        APPOINTMENTS_STORAGE_KEY,
        JSON.stringify(updatedAppointments),
      );

      window.dispatchEvent(
        new Event(APPOINTMENTS_UPDATED_EVENT),
      );

      toast.success(
        isEmergency
          ? "Emergency appointment created successfully."
          : "Appointment created successfully.",
      );

      router.push("/appointments");
    } catch {
      toast.error("Unable to create appointment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-28">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => router.push("/appointments")}
            className="mb-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Appointments
          </button>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">
                  <CalendarDays className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-600">
                    MedCore HMS
                  </p>

                  <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                    Create Appointment
                  </h1>
                </div>
              </div>

              <p className="max-w-2xl text-sm leading-6 text-slate-500">
                Schedule a patient appointment with the appropriate
                doctor and available time slot.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-sm text-cyan-800">
              <ShieldCheck className="h-5 w-5 shrink-0" />
              <span>Appointment scheduling</span>
            </div>
          </div>
        </div>

        {/* Emergency Information */}
        {isEmergency && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <Siren className="h-5 w-5" />
            </div>

            <div>
              <p className="font-semibold text-red-800">
                Emergency appointment
              </p>

              <p className="mt-1 text-sm leading-5 text-red-700">
                Regular time-slot selection is skipped because this
                appointment has been marked as an emergency.
              </p>
            </div>
          </motion.div>
        )}

        <div className="space-y-6">
          {/* Patient & Doctor */}
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <UserRound className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Patient & Doctor
                </h2>

                <p className="text-sm text-slate-500">
                  Select who this appointment is for.
                </p>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              {/* Patient */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Patient
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <select
                  value={patientId}
                  onChange={(event) =>
                    setPatientId(event.target.value)
                  }
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
                >
                  <option value="">Select patient</option>

                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name}
                      {patient.phone
                        ? ` — ${patient.phone}`
                        : ""}
                    </option>
                  ))}
                </select>

                {selectedPatient && (
                  <div className="mt-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-100 text-cyan-700">
                      <UserRound className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {selectedPatient.name}
                      </p>

                      {selectedPatient.phone && (
                        <p className="text-xs text-slate-500">
                          {selectedPatient.phone}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Doctor */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Doctor
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <select
                  value={doctorId}
                  onChange={(event) => {
                    setDoctorId(event.target.value);
                    setSelectedTime("");
                  }}
                  disabled={doctors.length === 0}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50 disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                  <option value="">
                    {doctors.length === 0
                      ? "No doctors available"
                      : "Select doctor"}
                  </option>

                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} — {doctor.department}
                    </option>
                  ))}
                </select>

                {selectedDoctor && (
                  <div className="mt-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                      <Stethoscope className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {selectedDoctor.name}
                      </p>

                      <p className="text-xs text-slate-500">
                        {selectedDoctor.department}
                      </p>
                    </div>
                  </div>
                )}

                {dataLoaded && doctors.length === 0 && (
                  <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />

                    <div>
                      <p className="font-medium">
                        No doctors available
                      </p>

                      <button
                        type="button"
                        onClick={() => router.push("/doctors")}
                        className="mt-1 font-semibold text-amber-800 underline underline-offset-2"
                      >
                        Go to Doctors
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Appointment Details */}
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                <ClipboardCheck className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Appointment Details
                </h2>

                <p className="text-sm text-slate-500">
                  Choose the date and appointment type.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {/* Date */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Appointment Date
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="date"
                    value={appointmentDate}
                    min={getTodayDate()}
                    onChange={(event) => {
                      setAppointmentDate(event.target.value);
                      setSelectedTime("");
                    }}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
                  />
                </div>
              </div>

              {/* Type */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Appointment Type
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <select
                  value={appointmentType}
                  onChange={(event) =>
                    setAppointmentType(event.target.value)
                  }
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
                >
                  {appointmentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Time Slots */}
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Clock3 className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Available Time Slots
                    {!isEmergency && (
                      <span className="ml-1 text-red-500">*</span>
                    )}
                  </h2>

                  <p className="text-sm text-slate-500">
                    {isEmergency
                      ? "Optional for emergency appointments."
                      : "Select an available appointment time."}
                  </p>
                </div>
              </div>

              {selectedDaySchedule?.enabled && (
                <span className="w-fit rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                  {formatTime(parseTime(selectedDaySchedule.startTime))}{" "}
                  –{" "}
                  {formatTime(parseTime(selectedDaySchedule.endTime))}
                </span>
              )}
            </div>

            {isEmergency ? (
              <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                    <Siren className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="font-semibold text-red-800">
                      Regular time slot not required
                    </p>

                    <p className="mt-1 text-sm leading-6 text-red-700">
                      This appointment is marked as emergency.
                      You can create it without selecting a
                      regular time slot.
                    </p>
                  </div>
                </div>
              </div>
            ) : !selectedDoctor ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
                <Stethoscope className="mx-auto h-8 w-8 text-slate-400" />

                <p className="mt-3 font-medium text-slate-700">
                  Select a doctor first
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Available time slots will appear here.
                </p>
              </div>
            ) : !selectedDaySchedule?.enabled ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
                <CalendarDays className="mx-auto h-8 w-8 text-amber-500" />

                <p className="mt-3 font-semibold text-amber-800">
                  Doctor is unavailable
                </p>

                <p className="mt-1 text-sm text-amber-700">
                  {selectedDoctor.name} does not have availability
                  configured for {selectedWeekday}.
                </p>
              </div>
            ) : availableTimeSlots.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
                <Clock3 className="mx-auto h-8 w-8 text-slate-400" />

                <p className="mt-3 font-medium text-slate-700">
                  No time slots available
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                {availableTimeSlots.map((slot) => {
                  const isSelected =
                    selectedTime === slot.time;

                  return (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={slot.disabled}
                      onClick={() =>
                        setSelectedTime(slot.time)
                      }
                      className={`relative rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                        slot.disabled
                          ? "cursor-not-allowed border-slate-100 bg-slate-100 text-slate-400"
                          : isSelected
                            ? "border-cyan-500 bg-cyan-600 text-white shadow-sm"
                            : "border-slate-200 bg-white text-slate-700 hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700"
                      }`}
                    >
                      {isSelected && (
                        <Check className="absolute right-2 top-2 h-3.5 w-3.5" />
                      )}

                      {slot.time}

                      {slot.disabled && (
                        <span className="mt-1 block text-[10px] font-medium">
                          Booked
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          {/* Emergency Priority */}
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    isEmergency
                      ? "bg-red-100 text-red-600"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <Siren className="h-5 w-5" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold text-slate-900">
                      Emergency Priority
                    </h2>

                    {/* Explicitly OPTIONAL */}
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Optional
                    </span>
                  </div>

                  <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                    Mark this appointment as an emergency if
                    immediate attention is required.
                  </p>

                  <p className="mt-2 text-xs font-medium text-slate-400">
                    When enabled, the regular time-slot requirement
                    will be skipped.
                  </p>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={isEmergency}
                onClick={() =>
                  handleEmergencyChange(!isEmergency)
                }
                className={`relative h-8 w-14 shrink-0 rounded-full transition ${
                  isEmergency
                    ? "bg-red-500"
                    : "bg-slate-300"
                }`}
              >
                <span
                  className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-sm transition ${
                    isEmergency ? "left-7" : "left-1"
                  }`}
                />
              </button>
            </div>

            {isEmergency && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-5 overflow-hidden"
              >
                <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-red-600" />

                  <div>
                    <p className="text-sm font-semibold text-red-800">
                      Emergency appointment enabled
                    </p>

                    <p className="mt-1 text-xs leading-5 text-red-700">
                      You can create this appointment without
                      selecting a normal time slot.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </section>

          {/* Reason */}
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <FileText className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Reason & Notes
                </h2>

                <p className="text-sm text-slate-500">
                  Optional information for the doctor.
                </p>
              </div>
            </div>

            <textarea
              value={reason}
              onChange={(event) =>
                setReason(event.target.value)
              }
              rows={5}
              placeholder="Enter symptoms, reason for visit, or additional notes..."
              className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
            />
          </section>

          {/* Summary */}
          <section className="rounded-3xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-blue-50 p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-cyan-600 shadow-sm">
                <HeartPulse className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Appointment Summary
                </h2>

                <p className="text-sm text-slate-500">
                  Review the information before creating.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-white bg-white/80 p-4">
                <p className="text-xs font-medium text-slate-400">
                  Patient
                </p>

                <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                  {selectedPatient?.name || "Not selected"}
                </p>
              </div>

              <div className="rounded-2xl border border-white bg-white/80 p-4">
                <p className="text-xs font-medium text-slate-400">
                  Doctor
                </p>

                <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                  {selectedDoctor?.name || "Not selected"}
                </p>
              </div>

              <div className="rounded-2xl border border-white bg-white/80 p-4">
                <p className="text-xs font-medium text-slate-400">
                  Date
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {appointmentDate || "Not selected"}
                </p>
              </div>

              <div className="rounded-2xl border border-white bg-white/80 p-4">
                <p className="text-xs font-medium text-slate-400">
                  Time
                </p>

                <p
                  className={`mt-1 text-sm font-semibold ${
                    isEmergency
                      ? "text-red-600"
                      : "text-slate-800"
                  }`}
                >
                  {isEmergency
                    ? "EMERGENCY"
                    : selectedTime || "Not selected"}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="hidden items-center gap-2 text-sm text-slate-500 sm:flex">
            <ShieldCheck className="h-4 w-4 text-cyan-600" />

            <span>
              {isEmergency
                ? "Emergency appointment — time slot skipped"
                : "Select a time slot before creating"}
            </span>
          </div>

          <div className="flex w-full gap-3 sm:w-auto">
            <button
              type="button"
              onClick={() => router.push("/appointments")}
              className="flex-1 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:flex-none"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={
                !isFormReady ||
                isSubmitting ||
                doctors.length === 0
              }
              onClick={handleSubmit}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-300 sm:flex-none"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Creating...
                </>
              ) : isEmergency ? (
                <>
                  <Siren className="h-4 w-4" />
                  Create Emergency Appointment
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Create Appointment
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}