"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
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

type AvailabilityStore = Record<
  string,
  StoredDoctorAvailability
>;

const PATIENTS_STORAGE_KEY = "medcore_patients";
const APPOINTMENTS_STORAGE_KEY =
  "medcore_appointments";
const AVAILABILITY_STORAGE_KEY =
  "medcore_doctor_availability";

const PATIENTS_UPDATED_EVENT =
  "medcore-patients-updated";
const APPOINTMENTS_UPDATED_EVENT =
  "medcore-appointments-updated";

const doctors: Doctor[] = [
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
];

const fallbackPatients: Patient[] = [
  {
    id: "PT-1001",
    name: "Ananya Reddy",
    phone: "+91 98765 43210",
  },
  {
    id: "PT-1002",
    name: "Rahul Kumar",
    phone: "+91 98765 12345",
  },
  {
    id: "PT-1003",
    name: "Sneha Patel",
    phone: "+91 99887 66554",
  },
  {
    id: "PT-1004",
    name: "Vikram Singh",
    phone: "+91 91234 56789",
  },
];

const defaultSchedule: DaySchedule[] = [
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
];

const appointmentTypes = [
  {
    value: "CONSULTATION",
    label: "Consultation",
  },
  {
    value: "FOLLOW_UP",
    label: "Follow-up",
  },
  {
    value: "CHECKUP",
    label: "General Check-up",
  },
  {
    value: "PROCEDURE",
    label: "Procedure",
  },
];

const getTodayDate = () => {
  const date = new Date();

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1,
  ).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
};

const normalizePatient = (
  value: Record<string, unknown>,
): Patient | null => {
  const id =
    typeof value.id === "string"
      ? value.id
      : typeof value.patientId === "string"
        ? value.patientId
        : "";

  const name =
    typeof value.name === "string"
      ? value.name
      : typeof value.fullName === "string"
        ? value.fullName
        : "";

  const phone =
    typeof value.phone === "string"
      ? value.phone
      : typeof value.mobile === "string"
        ? value.mobile
        : typeof value.mobileNumber === "string"
          ? value.mobileNumber
          : "";

  if (!id || !name) {
    return null;
  }

  return {
    id,
    name,
    phone,
  };
};

const parseTime = (time: string) => {
  const [hours, minutes] = time
    .split(":")
    .map(Number);

  return hours * 60 + minutes;
};

const formatTime = (minutes: number) => {
  const hours24 = Math.floor(minutes / 60);
  const mins = minutes % 60;

  const suffix =
    hours24 >= 12 ? "PM" : "AM";

  const hours12 =
    hours24 % 12 === 0
      ? 12
      : hours24 % 12;

  return `${String(hours12).padStart(
    2,
    "0",
  )}:${String(mins).padStart(
    2,
    "0",
  )} ${suffix}`;
};

const generateSlots = (
  startTime: string,
  endTime: string,
  duration: number,
) => {
  const slots: string[] = [];

  let current = parseTime(startTime);
  const end = parseTime(endTime);

  while (
    current + duration <= end
  ) {
    slots.push(formatTime(current));
    current += duration;
  }

  return slots;
};

const getWeekday = (dateString: string) => {
  const date = new Date(
    `${dateString}T00:00:00`,
  );

  return date.toLocaleDateString(
    "en-US",
    {
      weekday: "long",
    },
  );
};

const getDefaultAvailability = (
  doctor: Doctor,
): StoredDoctorAvailability => ({
  doctorId: doctor.id,
  doctorName: doctor.name,
  schedule: defaultSchedule,
});

function SectionTitle({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
        {icon}
      </div>

      <div>
        <h2 className="text-base font-bold text-slate-900">
          {title}
        </h2>

        <p className="mt-0.5 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function FieldLabel({
  children,
  required = false,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600">
      {children}

      {required && (
        <span className="ml-1 text-rose-500">
          *
        </span>
      )}
    </label>
  );
}

function SummaryItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-cyan-600 shadow-sm">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="truncate text-sm font-semibold text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function NewAppointmentPage() {
  const router = useRouter();

  const [patients, setPatients] =
    useState<Patient[]>([]);

  const [appointments, setAppointments] =
    useState<Appointment[]>([]);

  const [availabilityStore, setAvailabilityStore] =
    useState<AvailabilityStore>({});

  const [patientId, setPatientId] =
    useState("");

  const [doctorId, setDoctorId] =
    useState("");

  const [appointmentDate, setAppointmentDate] =
    useState(getTodayDate());

  const [selectedTime, setSelectedTime] =
    useState("");

  const [appointmentType, setAppointmentType] =
    useState("CONSULTATION");

  const [isEmergency, setIsEmergency] =
    useState(false);

  const [reason, setReason] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [dataLoaded, setDataLoaded] =
    useState(false);

  const selectedDoctor = useMemo(
    () =>
      doctors.find(
        (doctor) => doctor.id === doctorId,
      ),
    [doctorId],
  );

  const selectedPatient = useMemo(
    () =>
      patients.find(
        (patient) => patient.id === patientId,
      ),
    [patients, patientId],
  );

  const loadPatients = () => {
    try {
      const stored = localStorage.getItem(
        PATIENTS_STORAGE_KEY,
      );

      if (!stored) {
        setPatients(fallbackPatients);
        return;
      }

      const parsed = JSON.parse(stored);

      if (!Array.isArray(parsed)) {
        setPatients(fallbackPatients);
        return;
      }

      const normalized = parsed
        .map((item) =>
          normalizePatient(
            item as Record<string, unknown>,
          ),
        )
        .filter(
          (
            item,
          ): item is Patient =>
            item !== null,
        );

      setPatients(normalized);
    } catch {
      setPatients(fallbackPatients);
    }
  };

  const loadAppointments = () => {
    try {
      const stored = localStorage.getItem(
        APPOINTMENTS_STORAGE_KEY,
      );

      if (!stored) {
        setAppointments([]);
        return;
      }

      const parsed = JSON.parse(stored);

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
      const stored = localStorage.getItem(
        AVAILABILITY_STORAGE_KEY,
      );

      if (!stored) {
        setAvailabilityStore({});
        return;
      }

      const parsed = JSON.parse(stored);

     
      if (
        parsed &&
        typeof parsed === "object" &&
        !Array.isArray(parsed) &&
        !("doctorId" in parsed)
      ) {
        setAvailabilityStore(
          parsed as AvailabilityStore,
        );
        return;
      }

      // Backward compatibility with the
      // previous single-doctor format.
      if (
        parsed &&
        typeof parsed === "object" &&
        !Array.isArray(parsed) &&
        typeof parsed.doctor === "string" &&
        Array.isArray(parsed.schedule)
      ) {
        const matchedDoctor =
          doctors.find(
            (doctor) =>
              doctor.name === parsed.doctor,
          );

        if (matchedDoctor) {
          setAvailabilityStore({
            [matchedDoctor.id]: {
              doctorId: matchedDoctor.id,
              doctorName:
                matchedDoctor.name,
              schedule: parsed.schedule,
            },
          });
        }
      }
    } catch {
      setAvailabilityStore({});
    }
  };

  useEffect(() => {
    loadPatients();
    loadAppointments();
    loadAvailability();

    setDataLoaded(true);

    const handlePatientsUpdated = () => {
      loadPatients();
    };

    const handleAppointmentsUpdated = () => {
      loadAppointments();
    };

    window.addEventListener(
      PATIENTS_UPDATED_EVENT,
      handlePatientsUpdated,
    );

    window.addEventListener(
      APPOINTMENTS_UPDATED_EVENT,
      handleAppointmentsUpdated,
    );

    const handleStorage = (
      event: StorageEvent,
    ) => {
      if (
        event.key === PATIENTS_STORAGE_KEY
      ) {
        loadPatients();
      }

      if (
        event.key ===
        APPOINTMENTS_STORAGE_KEY
      ) {
        loadAppointments();
      }

      if (
        event.key ===
        AVAILABILITY_STORAGE_KEY
      ) {
        loadAvailability();
      }
    };

    window.addEventListener(
      "storage",
      handleStorage,
    );

    return () => {
      window.removeEventListener(
        PATIENTS_UPDATED_EVENT,
        handlePatientsUpdated,
      );

      window.removeEventListener(
        APPOINTMENTS_UPDATED_EVENT,
        handleAppointmentsUpdated,
      );

      window.removeEventListener(
        "storage",
        handleStorage,
      );
    };
  }, []);

  const currentAvailability =
    selectedDoctor
      ? availabilityStore[
          selectedDoctor.id
        ] ??
        getDefaultAvailability(
          selectedDoctor,
        )
      : null;

  const selectedWeekday = useMemo(
    () => getWeekday(appointmentDate),
    [appointmentDate],
  );

  const selectedDaySchedule =
    useMemo(() => {
      if (!currentAvailability) {
        return null;
      }

      return (
        currentAvailability.schedule.find(
          (day) =>
            day.day === selectedWeekday,
        ) ?? null
      );
    }, [
      currentAvailability,
      selectedWeekday,
    ]);

  const timeSlots = useMemo(() => {
    if (
      !selectedDaySchedule ||
      !selectedDaySchedule.enabled
    ) {
      return [];
    }

    return generateSlots(
      selectedDaySchedule.startTime,
      selectedDaySchedule.endTime,
      selectedDaySchedule.slotDuration,
    );
  }, [selectedDaySchedule]);

  const activeAppointments =
    useMemo(() => {
      return appointments.filter(
        (appointment) =>
          appointment.status !==
            "CANCELLED" &&
          appointment.status !==
            "NO_SHOW",
      );
    }, [appointments]);

  const doctorConflictingTimes =
    useMemo(() => {
      if (!doctorId || !appointmentDate) {
        return new Set<string>();
      }

      return new Set(
        activeAppointments
          .filter(
            (appointment) =>
              appointment.doctorId ===
                doctorId &&
              appointment.date ===
                appointmentDate &&
              appointment.time !==
                "EMERGENCY",
          )
          .map(
            (appointment) =>
              appointment.time,
          ),
      );
    }, [
      activeAppointments,
      doctorId,
      appointmentDate,
    ]);

  const patientConflictingTimes =
    useMemo(() => {
      if (!patientId || !appointmentDate) {
        return new Set<string>();
      }

      return new Set(
        activeAppointments
          .filter(
            (appointment) =>
              appointment.patientId ===
                patientId &&
              appointment.date ===
                appointmentDate &&
              appointment.time !==
                "EMERGENCY",
          )
          .map(
            (appointment) =>
              appointment.time,
          ),
      );
    }, [
      activeAppointments,
      patientId,
      appointmentDate,
    ]);

  const isSlotTaken = (
    slot: string,
  ) => {
    return (
      doctorConflictingTimes.has(slot) ||
      patientConflictingTimes.has(slot)
    );
  };

  const isFormReady =
    patientId &&
    doctorId &&
    appointmentDate &&
    (isEmergency || selectedTime);

  const handleDoctorChange = (
    value: string,
  ) => {
    setDoctorId(value);
    setSelectedTime("");
  };

  const handleDateChange = (
    value: string,
  ) => {
    setAppointmentDate(value);
    setSelectedTime("");
  };

  const handleEmergencyChange = (
    value: boolean,
  ) => {
    setIsEmergency(value);

    if (value) {
      setSelectedTime("");
    }
  };

  const handleSubmit = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    if (!selectedPatient) {
      toast.error(
        "Please select a patient.",
      );
      return;
    }

    if (!selectedDoctor) {
      toast.error(
        "Please select a doctor.",
      );
      return;
    }

    if (!appointmentDate) {
      toast.error(
        "Please select an appointment date.",
      );
      return;
    }

    if (
      !isEmergency &&
      !selectedTime
    ) {
      toast.error(
        "Please select an available time slot.",
      );
      return;
    }

    if (!isEmergency && selectedTime) {
      const doctorConflict =
        activeAppointments.some(
          (appointment) =>
            appointment.doctorId ===
              selectedDoctor.id &&
            appointment.date ===
              appointmentDate &&
            appointment.time ===
              selectedTime,
        );

      if (doctorConflict) {
        toast.error(
          "This doctor already has an appointment at this time.",
        );
        return;
      }

      const patientConflict =
        activeAppointments.some(
          (appointment) =>
            appointment.patientId ===
              selectedPatient.id &&
            appointment.date ===
              appointmentDate &&
            appointment.time ===
              selectedTime,
        );

      if (patientConflict) {
        toast.error(
          "This patient already has an appointment at this time.",
        );
        return;
      }
    }

    setIsSubmitting(true);

    try {
      await new Promise(
        (resolve) =>
          setTimeout(resolve, 700),
      );

      const newAppointment: Appointment = {
        id: `APT-${Date.now()}`,
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        department:
          selectedDoctor.department,
        date: appointmentDate,
        time: isEmergency
          ? "EMERGENCY"
          : selectedTime,
        type: appointmentType,
        reason: reason.trim(),
        emergency: isEmergency,
        status: "PENDING",
      };

      const stored =
        localStorage.getItem(
          APPOINTMENTS_STORAGE_KEY,
        );

      let existing: Appointment[] = [];

      if (stored) {
        try {
          const parsed = JSON.parse(
            stored,
          );

          if (Array.isArray(parsed)) {
            existing = parsed;
          }
        } catch {
          existing = [];
        }
      }

      const updatedAppointments = [
        ...existing,
        newAppointment,
      ];

      localStorage.setItem(
        APPOINTMENTS_STORAGE_KEY,
        JSON.stringify(
          updatedAppointments,
        ),
      );

      window.dispatchEvent(
        new Event(
          APPOINTMENTS_UPDATED_EVENT,
        ),
      );

      toast.success(
        isEmergency
          ? "Emergency appointment created successfully."
          : "Appointment created successfully.",
      );

      router.push("/appointments");
    } catch {
      toast.error(
        "Unable to create appointment. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFormattedDate = () => {
    if (!appointmentDate) {
      return "Not selected";
    }

    return new Date(
      `${appointmentDate}T00:00:00`,
    ).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-5 lg:p-6">
      <div className="mx-auto max-w-[1450px]">
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Header */}
          <motion.div
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="overflow-hidden rounded-3xl border border-cyan-100 bg-gradient-to-br from-cyan-50 via-white to-blue-50 shadow-sm"
          >
            <div className="flex flex-col gap-4 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      "/appointments",
                    )
                  }
                  className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                  aria-label="Back to appointments"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                      New Appointment
                    </h1>

                    <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[11px] font-bold text-cyan-700">
                      Appointment Scheduling
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    Schedule a patient visit with
                    the selected doctor.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-white bg-white/80 px-3 py-2 shadow-sm">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />

                <span className="text-xs font-semibold text-slate-600">
                  HMS Scheduling
                </span>
              </div>
            </div>
          </motion.div>

          {/* Emergency Notice */}
          {isEmergency && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              className="rounded-2xl border border-rose-200 bg-rose-50 p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                  <Siren className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-bold text-rose-800">
                    Emergency appointment
                  </p>

                  <p className="mt-1 text-xs leading-5 text-rose-700">
                    Emergency appointments do
                    not require a regular time
                    slot. The appointment will be
                    marked as emergency priority.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Patient & Doctor */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <SectionTitle
              icon={
                <UserRound className="h-5 w-5" />
              }
              title="Patient & Doctor"
              description="Select the patient and doctor for this appointment."
            />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div>
                <FieldLabel required>
                  Patient
                </FieldLabel>

                <select
                  value={patientId}
                  onChange={(event) =>
                    setPatientId(
                      event.target.value,
                    )
                  }
                  className="w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                >
                  <option value="">
                    Select patient
                  </option>

                  {patients.map((patient) => (
                    <option
                      key={patient.id}
                      value={patient.id}
                    >
                      {patient.name} —{" "}
                      {patient.id}
                    </option>
                  ))}
                </select>

                {dataLoaded &&
                  patients.length === 0 && (
                    <p className="mt-2 text-xs font-medium text-amber-600">
                      No patients are available.
                      Please create a patient
                      first.
                    </p>
                  )}

                {selectedPatient && (
                  <div className="mt-3 rounded-xl border border-cyan-100 bg-cyan-50/60 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-cyan-600">
                        <UserRound className="h-4 w-4" />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          {selectedPatient.name}
                        </p>

                        <p className="text-xs text-slate-500">
                          {selectedPatient.id}
                          {selectedPatient.phone
                            ? ` • ${selectedPatient.phone}`
                            : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <FieldLabel required>
                  Doctor
                </FieldLabel>

                <select
                  value={doctorId}
                  onChange={(event) =>
                    handleDoctorChange(
                      event.target.value,
                    )
                  }
                  className="w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                >
                  <option value="">
                    Select doctor
                  </option>

                  {doctors.map((doctor) => (
                    <option
                      key={doctor.id}
                      value={doctor.id}
                    >
                      {doctor.name} —{" "}
                      {doctor.department}
                    </option>
                  ))}
                </select>

                {selectedDoctor && (
                  <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50/60 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-blue-600">
                        <Stethoscope className="h-4 w-4" />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          {selectedDoctor.name}
                        </p>

                        <p className="text-xs text-slate-500">
                          {
                            selectedDoctor.department
                          }{" "}
                          • {selectedDoctor.id}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Appointment Details */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <SectionTitle
              icon={
                <CalendarDays className="h-5 w-5" />
              }
              title="Appointment Details"
              description="Choose the appointment date and visit type."
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <FieldLabel required>
                  Appointment Date
                </FieldLabel>

                <input
                  type="date"
                  min={getTodayDate()}
                  value={appointmentDate}
                  onChange={(event) =>
                    handleDateChange(
                      event.target.value,
                    )
                  }
                  className="w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                />

                {selectedDoctor && (
                  <p className="mt-2 text-xs text-slate-500">
                    Selected day:{" "}
                    <span className="font-semibold text-cyan-700">
                      {selectedWeekday}
                    </span>
                  </p>
                )}
              </div>

              <div>
                <FieldLabel required>
                  Appointment Type
                </FieldLabel>

                <select
                  value={appointmentType}
                  onChange={(event) =>
                    setAppointmentType(
                      event.target.value,
                    )
                  }
                  className="w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                >
                  {appointmentTypes.map(
                    (type) => (
                      <option
                        key={type.value}
                        value={type.value}
                      >
                        {type.label}
                      </option>
                    ),
                  )}
                </select>
              </div>
            </div>
          </section>

          {/* Time Slots */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <SectionTitle
              icon={
                <Clock3 className="h-5 w-5" />
              }
              title="Available Time Slots"
              description="Available slots are generated from the selected doctor's saved availability."
            />

            {!selectedDoctor ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                <Stethoscope className="mx-auto h-7 w-7 text-slate-400" />

                <p className="mt-2 text-sm font-semibold text-slate-700">
                  Select a doctor first
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Doctor availability will appear
                  here.
                </p>
              </div>
            ) : !selectedDaySchedule ||
              !selectedDaySchedule.enabled ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                  <div>
                    <p className="text-sm font-bold text-amber-800">
                      Doctor unavailable
                    </p>

                    <p className="mt-1 text-xs leading-5 text-amber-700">
                      {
                        selectedDoctor.name
                      }{" "}
                      is not scheduled on{" "}
                      {selectedWeekday}.
                      Please choose another date
                      or enable this day in Doctor
                      Availability.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-cyan-100 bg-cyan-50/60 p-3">
                  <div>
                    <p className="text-xs font-bold text-cyan-800">
                      {selectedWeekday} schedule
                    </p>

                    <p className="mt-0.5 text-[11px] text-slate-500">
                      {
                        selectedDaySchedule.startTime
                      }{" "}
                      –{" "}
                      {
                        selectedDaySchedule.endTime
                      }{" "}
                      •{" "}
                      {
                        selectedDaySchedule.slotDuration
                      }{" "}
                      minute slots
                    </p>
                  </div>

                  <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-cyan-700 shadow-sm">
                    {timeSlots.length} slots
                  </span>
                </div>

                {!isEmergency && (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {timeSlots.map((slot) => {
                      const taken =
                        isSlotTaken(slot);

                      const selected =
                        selectedTime ===
                        slot;

                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={taken}
                          onClick={() =>
                            setSelectedTime(
                              slot,
                            )
                          }
                          className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                            taken
                              ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                              : selected
                                ? "cursor-pointer border-cyan-600 bg-cyan-600 text-white shadow-sm"
                                : "cursor-pointer border-slate-200 bg-white text-slate-700 hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700"
                          }`}
                        >
                          <div className="flex items-center justify-center gap-1.5">
                            {selected && (
                              <Check className="h-4 w-4" />
                            )}

                            {slot}
                          </div>

                          {taken && (
                            <span className="mt-1 block text-[9px] font-medium">
                              Booked
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {isEmergency && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-center">
                    <Siren className="mx-auto h-6 w-6 text-rose-600" />

                    <p className="mt-2 text-sm font-bold text-rose-800">
                      Regular time selection
                      bypassed
                    </p>

                    <p className="mt-1 text-xs text-rose-700">
                      Emergency appointment will
                      be saved with EMERGENCY
                      priority.
                    </p>
                  </div>
                )}
              </>
            )}
          </section>

          {/* Emergency Priority */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <SectionTitle
              icon={
                <AlertTriangle className="h-5 w-5" />
              }
              title="Emergency Priority"
              description="Use emergency priority only when the patient requires immediate attention."
            />

            <button
              type="button"
              onClick={() =>
                handleEmergencyChange(
                  !isEmergency,
                )
              }
              className={`flex w-full cursor-pointer items-center justify-between rounded-2xl border p-4 text-left transition ${
                isEmergency
                  ? "border-rose-300 bg-rose-50"
                  : "border-slate-200 bg-slate-50 hover:border-cyan-200 hover:bg-cyan-50/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    isEmergency
                      ? "bg-rose-100 text-rose-600"
                      : "bg-white text-slate-500"
                  }`}
                >
                  <Siren className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Mark as Emergency
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Bypasses regular time slot
                    selection.
                  </p>
                </div>
              </div>

              <div
                className={`flex h-6 w-11 items-center rounded-full p-1 transition ${
                  isEmergency
                    ? "bg-rose-500"
                    : "bg-slate-300"
                }`}
              >
                <div
                  className={`h-4 w-4 rounded-full bg-white shadow-sm transition ${
                    isEmergency
                      ? "translate-x-5"
                      : "translate-x-0"
                  }`}
                />
              </div>
            </button>
          </section>

          {/* Reason */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <SectionTitle
              icon={
                <FileText className="h-5 w-5" />
              }
              title="Reason & Notes"
              description="Add the patient's visit reason or relevant appointment notes."
            />

            <textarea
              value={reason}
              onChange={(event) =>
                setReason(event.target.value)
              }
              rows={4}
              placeholder="Enter reason for appointment..."
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
            />

            <div className="mt-2 flex justify-end">
              <span className="text-[11px] text-slate-400">
                {reason.length}/500
              </span>
            </div>
          </section>

          {/* Summary */}
          <section className="rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50/80 via-white to-blue-50/70 p-4 shadow-sm sm:p-5">
            <SectionTitle
              icon={
                <ClipboardCheck className="h-5 w-5" />
              }
              title="Appointment Summary"
              description="Review the appointment information before creating it."
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <SummaryItem
                icon={
                  <UserRound className="h-4 w-4" />
                }
                label="Patient"
                value={
                  selectedPatient
                    ? `${selectedPatient.name} (${selectedPatient.id})`
                    : "Not selected"
                }
              />

              <SummaryItem
                icon={
                  <Stethoscope className="h-4 w-4" />
                }
                label="Doctor"
                value={
                  selectedDoctor
                    ? selectedDoctor.name
                    : "Not selected"
                }
              />

              <SummaryItem
                icon={
                  <CalendarDays className="h-4 w-4" />
                }
                label="Date"
                value={getFormattedDate()}
              />

              <SummaryItem
                icon={
                  <Clock3 className="h-4 w-4" />
                }
                label="Time"
                value={
                  isEmergency
                    ? "Emergency"
                    : selectedTime ||
                      "Not selected"
                }
              />
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
                {
                  appointmentTypes.find(
                    (item) =>
                      item.value ===
                      appointmentType,
                  )?.label
                }
              </span>

              {isEmergency && (
                <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600">
                  Emergency Priority
                </span>
              )}

              {selectedDoctor && (
                <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                  {
                    selectedDoctor.department
                  }
                </span>
              )}
            </div>
          </section>

          {/* Footer */}
          <div className="sticky bottom-3 z-20 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur sm:p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="hidden items-center gap-2 sm:flex">
                <HeartPulse className="h-4 w-4 text-cyan-600" />

                <p className="text-xs text-slate-500">
                  Appointment will be created with{" "}
                  <span className="font-semibold text-slate-700">
                    Pending
                  </span>{" "}
                  status.
                </p>
              </div>

              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      "/appointments",
                    )
                  }
                  className="w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    !isFormReady ||
                    isSubmitting
                  }
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition sm:w-auto ${
                    !isFormReady ||
                    isSubmitting
                      ? "cursor-not-allowed bg-slate-300"
                      : "cursor-pointer bg-cyan-600 shadow-sm hover:bg-cyan-700"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Creating...
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
        </form>
      </div>
    </div>
  );
}