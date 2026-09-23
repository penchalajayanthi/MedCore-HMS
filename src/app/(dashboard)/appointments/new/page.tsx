"use client";

import {
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock3,
  HeartPulse,
  Stethoscope,
  UserRound,
  AlertTriangle,
  ShieldCheck,
  FileText,
  Siren,
  ClipboardCheck,
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

/* =======================================================
   DOCTORS
======================================================= */

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

/* =======================================================
   PATIENTS
======================================================= */

const patients: Patient[] = [
  {
    id: "PT-1024",
    name: "Ananya Reddy",
    phone: "+91 98765 43210",
  },
  {
    id: "PT-1025",
    name: "Rahul Kumar",
    phone: "+91 98765 12345",
  },
  {
    id: "PT-1026",
    name: "Sneha Patel",
    phone: "+91 99887 66554",
  },
  {
    id: "PT-1027",
    name: "Vikram Singh",
    phone: "+91 91234 56789",
  },
];

/* =======================================================
   TIME SLOTS
======================================================= */

const timeSlots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
];

const unavailableSlots = [
  "10:00 AM",
  "11:30 AM",
];

/* =======================================================
   EXISTING APPOINTMENTS
======================================================= */

const existingAppointments = [
  {
    doctorId: "DOC-001",
    patientId: "PT-1024",
    time: "09:30 AM",
  },
  {
    doctorId: "DOC-002",
    patientId: "PT-1025",
    time: "10:30 AM",
  },
];

/* =======================================================
   TODAY
======================================================= */

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

/* =======================================================
   MAIN PAGE
======================================================= */

export default function NewAppointmentPage() {
  const router = useRouter();

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

  /* =====================================================
     SELECTED DOCTOR
  ===================================================== */

  const selectedDoctor = useMemo(
    () =>
      doctors.find(
        (doctor) =>
          doctor.id === doctorId
      ),
    [doctorId]
  );

  /* =====================================================
     SELECTED PATIENT
  ===================================================== */

  const selectedPatient = useMemo(
    () =>
      patients.find(
        (patient) =>
          patient.id === patientId
      ),
    [patientId]
  );

  /* =====================================================
     DOCTOR CONFLICT
  ===================================================== */

  const isDoctorConflict = (
    time: string
  ) => {
    return existingAppointments.some(
      (appointment) =>
        appointment.doctorId === doctorId &&
        appointment.time === time
    );
  };

  /* =====================================================
     PATIENT CONFLICT
  ===================================================== */

  const isPatientConflict = (
    time: string
  ) => {
    return existingAppointments.some(
      (appointment) =>
        appointment.patientId === patientId &&
        appointment.time === time
    );
  };

  /* =====================================================
     CAN SELECT SLOT
  ===================================================== */

  const canSelectSlot = (
    time: string
  ) => {
    if (isEmergency) {
      return true;
    }

    if (
      unavailableSlots.includes(time)
    ) {
      return false;
    }

    if (isDoctorConflict(time)) {
      return false;
    }

    if (isPatientConflict(time)) {
      return false;
    }

    return true;
  };

  /* =====================================================
     FORM COMPLETION
  ===================================================== */

  const isFormReady =
    Boolean(
      patientId &&
        doctorId &&
        appointmentDate &&
        (isEmergency || selectedTime)
    );

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (!patientId) {
      toast.error(
        "Please select a patient"
      );
      return;
    }

    if (!doctorId) {
      toast.error(
        "Please select a doctor"
      );
      return;
    }

    if (!appointmentDate) {
      toast.error(
        "Please select an appointment date"
      );
      return;
    }

    if (
      !isEmergency &&
      !selectedTime
    ) {
      toast.error(
        "Please select an available time slot"
      );
      return;
    }

    if (
      !isEmergency &&
      selectedTime
    ) {
      if (
        isDoctorConflict(
          selectedTime
        )
      ) {
        toast.error(
          "Doctor is already booked for this time slot"
        );
        return;
      }

      if (
        isPatientConflict(
          selectedTime
        )
      ) {
        toast.error(
          "Patient already has an appointment at this time"
        );
        return;
      }
    }

    setIsSubmitting(true);

    try {
      await new Promise(
        (resolve) =>
          setTimeout(resolve, 800)
      );

      const newAppointment = {
        id: `APT-${Date.now()}`,
        patientId,
        patientName:
          selectedPatient?.name,
        doctorId,
        doctorName:
          selectedDoctor?.name,
        department:
          selectedDoctor?.department,
        date: appointmentDate,
        time: isEmergency
          ? "EMERGENCY"
          : selectedTime,
        type: appointmentType,
        reason,
        emergency: isEmergency,
        status: "PENDING",
      };

      const existing = JSON.parse(
        localStorage.getItem(
          "medcore_appointments"
        ) || "[]"
      );

      localStorage.setItem(
        "medcore_appointments",
        JSON.stringify([
          ...existing,
          newAppointment,
        ])
      );

      toast.success(
        isEmergency
          ? "Emergency appointment created"
          : "Appointment created successfully"
      );

      router.push(
        "/appointments"
      );
    } catch {
      toast.error(
        "Unable to create appointment"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-white">
      <div className="mx-auto min-h-screen w-full max-w-[1500px]">

        {/* =================================================
            HIGHLIGHTED HEADER
        ================================================= */}

        <motion.header
          initial={{
            opacity: 0,
            y: -15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="border-b border-cyan-700/30 bg-gradient-to-r from-cyan-700 via-cyan-600 to-blue-600 text-white shadow-lg"
        >
          <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">

              <div className="flex min-w-0 items-center gap-3">

                {/* BACK */}

                <button
                  type="button"
                  onClick={() =>
                    router.back()
                  }
                  className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white shadow-sm transition hover:bg-white/20 active:scale-95"
                  aria-label="Go back"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>

                {/* ICON */}

                <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-sm sm:flex">
                  <CalendarDays className="h-6 w-6 text-white" />
                </div>

                {/* TITLE */}

                <div className="min-w-0">
                  <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-cyan-50/90">
                    <span>
                      Hospital Management
                    </span>

                    <span>/</span>

                    <span>
                      Appointments
                    </span>

                    <span>/</span>

                    <span>
                      New Appointment
                    </span>
                  </div>

                  <h1 className="truncate text-xl font-bold sm:text-2xl lg:text-3xl">
                    Book Appointment
                  </h1>

                  <p className="mt-1 hidden text-xs text-cyan-50/80 sm:block sm:text-sm">
                    Schedule a patient appointment
                    with an available doctor.
                  </p>
                </div>
              </div>

              {/* MODE BADGE */}

              <div className="hidden shrink-0 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white sm:flex">
                <CalendarDays className="h-4 w-4" />

                New Appointment
              </div>
            </div>

            {/* MOBILE DESCRIPTION */}

            <p className="text-xs leading-5 text-cyan-50/85 sm:hidden">
              Schedule a patient appointment
              with an available doctor.
            </p>
          </div>
        </motion.header>

        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <div className="px-3 py-4 sm:px-5 sm:py-6 md:px-6 lg:px-8 lg:py-8">

          {/* =================================================
              EMERGENCY NOTICE
          ================================================= */}

          {isEmergency && (
            <motion.div
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 border-l-4 border-l-red-500 bg-red-50 p-4 shadow-sm sm:p-5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <AlertTriangle className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-bold text-red-800">
                  Emergency booking enabled
                </p>

                <p className="mt-1 text-xs leading-5 text-red-700">
                  Emergency bookings bypass
                  normal slot availability
                  according to the appointment
                  business rules.
                </p>
              </div>
            </motion.div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5 sm:space-y-6"
          >

            {/* =================================================
                PATIENT + DOCTOR
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
              className="overflow-hidden rounded-2xl border border-cyan-200 border-l-4 border-l-cyan-500 bg-white shadow-sm"
            >
              {/* SECTION HEADER */}

              <div className="border-b border-cyan-100 bg-cyan-50/60 px-4 py-4 sm:px-6">
                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
                    <UserRound className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      Patient & Doctor
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Select the patient and
                      doctor for this appointment.
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION BODY */}

              <div className="p-4 sm:p-6">
                <div className="grid gap-5 md:grid-cols-2">

                  {/* PATIENT */}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Patient
                    </label>

                    <select
                      value={patientId}
                      onChange={(event) =>
                        setPatientId(
                          event.target.value
                        )
                      }
                      className="h-12 w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition hover:border-cyan-300 focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                    >
                      <option value="">
                        Select patient
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
                        )
                      )}
                    </select>

                    {selectedPatient && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                        <UserRound className="h-3.5 w-3.5" />

                        {selectedPatient.phone}
                      </div>
                    )}
                  </div>

                  {/* DOCTOR */}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Doctor
                    </label>

                    <select
                      value={doctorId}
                      onChange={(event) => {
                        setDoctorId(
                          event.target.value
                        );

                        setSelectedTime("");
                      }}
                      className="h-12 w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition hover:border-cyan-300 focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                    >
                      <option value="">
                        Select doctor
                      </option>

                      {doctors.map(
                        (doctor) => (
                          <option
                            key={doctor.id}
                            value={doctor.id}
                          >
                            {doctor.name} —{" "}
                            {doctor.department}
                          </option>
                        )
                      )}
                    </select>

                    {selectedDoctor && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                        <Stethoscope className="h-3.5 w-3.5" />

                        {selectedDoctor.department}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.section>

            {/* =================================================
                APPOINTMENT DETAILS
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
              transition={{
                delay: 0.05,
              }}
              className="overflow-hidden rounded-2xl border border-blue-200 border-l-4 border-l-blue-500 bg-white shadow-sm"
            >
              {/* HEADER */}

              <div className="border-b border-blue-100 bg-blue-50/60 px-4 py-4 sm:px-6">
                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <CalendarDays className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      Appointment Details
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Choose the appointment date
                      and type.
                    </p>
                  </div>
                </div>
              </div>

              {/* BODY */}

              <div className="p-4 sm:p-6">
                <div className="grid gap-5 md:grid-cols-2">

                  {/* DATE */}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Appointment Date
                    </label>

                    <input
                      type="date"
                      value={appointmentDate}
                      min={getTodayDate()}
                      onChange={(event) => {
                        setAppointmentDate(
                          event.target.value
                        );

                        setSelectedTime("");
                      }}
                      className="h-12 w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition hover:border-blue-300 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  {/* TYPE */}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Appointment Type
                    </label>

                    <select
                      value={appointmentType}
                      onChange={(event) =>
                        setAppointmentType(
                          event.target.value
                        )
                      }
                      className="h-12 w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition hover:border-blue-300 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="CONSULTATION">
                        Consultation
                      </option>

                      <option value="FOLLOW_UP">
                        Follow-up
                      </option>

                      <option value="ROUTINE_CHECKUP">
                        Routine Checkup
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* =================================================
                TIME SLOTS
            ================================================= */}

            {!isEmergency && (
              <motion.section
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
                className="overflow-hidden rounded-2xl border border-violet-200 border-l-4 border-l-violet-500 bg-white shadow-sm"
              >
                {/* HEADER */}

                <div className="border-b border-violet-100 bg-violet-50/60 px-4 py-4 sm:px-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                        <Clock3 className="h-5 w-5" />
                      </div>

                      <div>
                        <h2 className="font-bold text-slate-900">
                          Available Time Slots
                        </h2>

                        <p className="mt-0.5 text-xs text-slate-500">
                          Select an available slot
                          for the selected doctor.
                        </p>
                      </div>
                    </div>

                    <span className="w-fit rounded-full border border-violet-200 bg-white px-3 py-1.5 text-[10px] font-semibold text-violet-700">
                      30-minute intervals
                    </span>
                  </div>
                </div>

                {/* BODY */}

                <div className="p-4 sm:p-6">

                  {!doctorId ? (
                    <div className="rounded-2xl border border-dashed border-violet-200 bg-violet-50/30 p-8 text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-500">
                        <Stethoscope className="h-7 w-7" />
                      </div>

                      <p className="mt-3 text-sm font-semibold text-slate-700">
                        Select a doctor first
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Available appointment
                        slots will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                      {timeSlots.map(
                        (time) => {
                          const unavailable =
                            !canSelectSlot(
                              time
                            );

                          const doctorConflict =
                            isDoctorConflict(
                              time
                            );

                          const patientConflict =
                            isPatientConflict(
                              time
                            );

                          const selected =
                            selectedTime ===
                            time;

                          let reason =
                            "";

                          if (
                            unavailableSlots.includes(
                              time
                            )
                          ) {
                            reason =
                              "Unavailable";
                          } else if (
                            doctorConflict
                          ) {
                            reason =
                              "Doctor booked";
                          } else if (
                            patientConflict
                          ) {
                            reason =
                              "Patient booked";
                          }

                          return (
                            <button
                              key={time}
                              type="button"
                              disabled={
                                unavailable
                              }
                              onClick={() =>
                                setSelectedTime(
                                  time
                                )
                              }
                              className={`rounded-xl border p-3 text-left transition ${
                                selected
                                  ? "border-violet-500 bg-violet-50 ring-2 ring-violet-100"
                                  : unavailable
                                    ? "cursor-not-allowed border-slate-100 bg-slate-50 opacity-60"
                                    : "cursor-pointer border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50/50 active:scale-[0.98]"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">

                                <span
                                  className={`text-sm font-semibold ${
                                    selected
                                      ? "text-violet-700"
                                      : "text-slate-700"
                                  }`}
                                >
                                  {time}
                                </span>

                                {selected && (
                                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-white">
                                    <Check className="h-3 w-3" />
                                  </div>
                                )}
                              </div>

                              <p
                                className={`mt-1 text-[10px] ${
                                  unavailable
                                    ? "text-red-400"
                                    : "text-emerald-500"
                                }`}
                              >
                                {unavailable
                                  ? reason
                                  : "Available"}
                              </p>
                            </button>
                          );
                        }
                      )}
                    </div>
                  )}

                  {selectedTime && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 5,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm">
                        <ShieldCheck className="h-4 w-4" />
                      </div>

                      <span>
                        Selected slot:{" "}
                        <strong>
                          {selectedTime}
                        </strong>
                      </span>
                    </motion.div>
                  )}
                </div>
              </motion.section>
            )}

            {/* =================================================
                EMERGENCY
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
              transition={{
                delay: 0.15,
              }}
              className={`overflow-hidden rounded-2xl border border-l-4 shadow-sm ${
                isEmergency
                  ? "border-red-200 border-l-red-600 bg-red-50/70"
                  : "border-rose-200 border-l-rose-400 bg-white"
              }`}
            >
              <div
                className={`border-b px-4 py-4 sm:px-6 ${
                  isEmergency
                    ? "border-red-100 bg-red-100/60"
                    : "border-rose-100 bg-rose-50/50"
                }`}
              >
                <div className="flex items-center gap-3">

                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      isEmergency
                        ? "bg-red-100 text-red-700"
                        : "bg-rose-100 text-rose-600"
                    }`}
                  >
                    <Siren className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      Emergency Priority
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Mark this appointment as
                      an emergency if immediate
                      attention is required.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <label className="flex cursor-pointer items-start gap-3">

                  <input
                    type="checkbox"
                    checked={isEmergency}
                    onChange={(event) => {
                      setIsEmergency(
                        event.target.checked
                      );

                      if (
                        event.target.checked
                      ) {
                        setSelectedTime("");
                      }
                    }}
                    className="mt-1 h-4 w-4 cursor-pointer rounded border-slate-300 text-red-600 focus:ring-red-500"
                  />

                  <div>
                    <p
                      className={`text-sm font-bold ${
                        isEmergency
                          ? "text-red-800"
                          : "text-slate-800"
                      }`}
                    >
                      Mark as Emergency
                    </p>

                    <p
                      className={`mt-1 text-xs leading-5 ${
                        isEmergency
                          ? "text-red-700"
                          : "text-slate-500"
                      }`}
                    >
                      Emergency bookings bypass
                      normal slot availability
                      and are flagged as emergency
                      appointments.
                    </p>
                  </div>
                </label>
              </div>
            </motion.section>

            {/* =================================================
                REASON / NOTES
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
              transition={{
                delay: 0.2,
              }}
              className="overflow-hidden rounded-2xl border border-amber-200 border-l-4 border-l-amber-500 bg-white shadow-sm"
            >
              <div className="border-b border-amber-100 bg-amber-50/60 px-4 py-4 sm:px-6">
                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                    <FileText className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      Reason & Notes
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Add additional information
                      for the medical team.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Reason / Notes
                </label>

                <textarea
                  value={reason}
                  onChange={(event) =>
                    setReason(
                      event.target.value
                    )
                  }
                  rows={4}
                  placeholder="Enter the patient's reason for the appointment..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-amber-300 focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
                />

                <p className="mt-2 text-[11px] text-slate-400">
                  Optional — add symptoms,
                  follow-up details, or other
                  clinical notes.
                </p>
              </div>
            </motion.section>

            {/* =================================================
                SUMMARY
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
              transition={{
                delay: 0.25,
              }}
              className="overflow-hidden rounded-2xl border border-emerald-200 border-l-4 border-l-emerald-500 bg-white shadow-sm"
            >
              <div className="border-b border-emerald-100 bg-emerald-50/60 px-4 py-4 sm:px-6">
                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <ClipboardCheck className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      Appointment Summary
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Review the appointment
                      information before creating it.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6">

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

                  <SummaryItem
                    label="Patient"
                    value={
                      selectedPatient?.name ||
                      "Not selected"
                    }
                    icon={
                      <UserRound className="h-4 w-4" />
                    }
                  />

                  <SummaryItem
                    label="Doctor"
                    value={
                      selectedDoctor?.name ||
                      "Not selected"
                    }
                    icon={
                      <Stethoscope className="h-4 w-4" />
                    }
                  />

                  <SummaryItem
                    label="Department"
                    value={
                      selectedDoctor?.department ||
                      "Not selected"
                    }
                    icon={
                      <HeartPulse className="h-4 w-4" />
                    }
                  />

                  <SummaryItem
                    label="Date"
                    value={
                      appointmentDate ||
                      "Not selected"
                    }
                    icon={
                      <CalendarDays className="h-4 w-4" />
                    }
                  />

                  <SummaryItem
                    label="Time"
                    value={
                      isEmergency
                        ? "Emergency"
                        : selectedTime ||
                          "Not selected"
                    }
                    icon={
                      <Clock3 className="h-4 w-4" />
                    }
                  />

                  <SummaryItem
                    label="Type"
                    value={appointmentType.replace(
                      "_",
                      " "
                    )}
                    icon={
                      <ClipboardCheck className="h-4 w-4" />
                    }
                  />
                </div>

                {/* READY STATUS */}

                <div
                  className={`mt-4 flex items-center gap-3 rounded-xl border p-4 ${
                    isFormReady
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                      isFormReady
                        ? "bg-white text-emerald-600"
                        : "bg-white text-slate-400"
                    }`}
                  >
                    {isFormReady ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <CalendarDays className="h-5 w-5" />
                    )}
                  </div>

                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        isFormReady
                          ? "text-emerald-800"
                          : "text-slate-700"
                      }`}
                    >
                      {isFormReady
                        ? "Ready to create appointment"
                        : "Complete the required details"}
                    </p>

                    <p
                      className={`mt-0.5 text-xs ${
                        isFormReady
                          ? "text-emerald-700"
                          : "text-slate-500"
                      }`}
                    >
                      {isFormReady
                        ? "All required appointment information has been selected."
                        : "Patient, doctor, date and an available time are required."}
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* =================================================
                ACTION FOOTER
            ================================================= */}

            <div className="sticky bottom-0 z-20 -mx-3 border-t border-slate-200 bg-white/95 px-3 py-3 shadow-[0_-8px_25px_rgba(15,23,42,0.08)] backdrop-blur sm:-mx-5 sm:px-5 md:-mx-6 md:px-6 lg:-mx-8 lg:px-8">

              <div className="mx-auto flex w-full max-w-[1500px] flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">

                {/* FOOTER INFO */}

                <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
                  <CalendarDays className="h-4 w-4 text-cyan-500" />

                  <span>
                    Review all details before
                    creating the appointment.
                  </span>
                </div>

                {/* BUTTONS */}

                <div className="flex w-full gap-2 sm:w-auto">

                  {/* CANCEL */}

                  <button
                    type="button"
                    onClick={() =>
                      router.back()
                    }
                    disabled={isSubmitting}
                    className="h-11 flex-1 cursor-pointer rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                  >
                    Cancel
                  </button>

                  {/* CREATE */}

                  <button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      !isFormReady
                    }
                    className={`inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold text-white shadow-lg transition active:scale-[0.98] sm:flex-none sm:min-w-[190px] ${
                      isSubmitting ||
                      !isFormReady
                        ? "cursor-not-allowed bg-slate-300 shadow-none"
                        : "cursor-pointer bg-gradient-to-r from-cyan-600 via-cyan-600 to-blue-600 shadow-cyan-500/25 hover:from-cyan-700 hover:via-cyan-700 hover:to-blue-700 hover:shadow-cyan-500/30"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                        Creating...
                      </>
                    ) : (
                      <>
                        <CalendarDays className="h-4 w-4" />

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
    </div>
  );
}

/* =======================================================
   SUMMARY ITEM
======================================================= */

function SummaryItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 transition hover:border-emerald-200 hover:bg-emerald-50/30">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}

        <span className="text-[10px] font-bold uppercase tracking-wider">
          {label}
        </span>
      </div>

      <p className="mt-1.5 truncate text-sm font-semibold capitalize text-slate-700">
        {value}
      </p>
    </div>
  );
}