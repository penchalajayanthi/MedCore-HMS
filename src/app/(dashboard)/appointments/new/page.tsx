"use client";

import { useMemo, useState } from "react";
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

export default function NewAppointmentPage() {
  const router = useRouter();

  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [appointmentDate, setAppointmentDate] =
    useState("");
  const [selectedTime, setSelectedTime] =
    useState("");
  const [appointmentType, setAppointmentType] =
    useState("CONSULTATION");
  const [isEmergency, setIsEmergency] =
    useState(false);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const selectedDoctor = useMemo(
    () =>
      doctors.find(
        (doctor) => doctor.id === doctorId
      ),
    [doctorId]
  );

  const selectedPatient = useMemo(
    () =>
      patients.find(
        (patient) => patient.id === patientId
      ),
    [patientId]
  );

  const isDoctorConflict = (time: string) => {
    return existingAppointments.some(
      (appointment) =>
        appointment.doctorId === doctorId &&
        appointment.time === time
    );
  };

  const isPatientConflict = (time: string) => {
    return existingAppointments.some(
      (appointment) =>
        appointment.patientId === patientId &&
        appointment.time === time
    );
  };

  const canSelectSlot = (time: string) => {
    if (isEmergency) return true;

    if (unavailableSlots.includes(time)) {
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

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!patientId) {
      toast.error("Please select a patient");
      return;
    }

    if (!doctorId) {
      toast.error("Please select a doctor");
      return;
    }

    if (!appointmentDate) {
      toast.error("Please select an appointment date");
      return;
    }

    if (!isEmergency && !selectedTime) {
      toast.error("Please select an available time slot");
      return;
    }

    if (!isEmergency && selectedTime) {
      if (isDoctorConflict(selectedTime)) {
        toast.error(
          "Doctor is already booked for this time slot"
        );
        return;
      }

      if (isPatientConflict(selectedTime)) {
        toast.error(
          "Patient already has an appointment at this time"
        );
        return;
      }
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) =>
        setTimeout(resolve, 800)
      );

      const newAppointment = {
        id: `APT-${Date.now()}`,
        patientId,
        patientName: selectedPatient?.name,
        doctorId,
        doctorName: selectedDoctor?.name,
        department: selectedDoctor?.department,
        date: appointmentDate,
        time: isEmergency
          ? "EMERGENCY"
          : selectedTime,
        type: appointmentType,
        reason,
        emergency: isEmergency,
        status: "PENDING",
      };

      const existing =
        JSON.parse(
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

      setTimeout(() => {
        router.push("/appointments");
      }, 500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-6">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center"
        >
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div>
            <div className="mb-1 flex items-center gap-2 text-xs text-slate-500">
              <CalendarDays className="h-4 w-4 text-cyan-600" />
              Appointments
              <span>/</span>
              New Appointment
            </div>

            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Book Appointment
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Schedule a patient appointment with an
              available doctor.
            </p>
          </div>
        </motion.div>

        {/* EMERGENCY NOTICE */}
        {isEmergency && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4"
          >
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

            <div>
              <p className="text-sm font-semibold text-red-800">
                Emergency booking enabled
              </p>

              <p className="mt-1 text-xs leading-5 text-red-700">
                Emergency bookings bypass normal slot
                availability according to the appointment
                business rules.
              </p>
            </div>
          </motion.div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* PATIENT + DOCTOR */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
          >
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <UserRound className="h-5 w-5 text-cyan-600" />

                <h2 className="font-semibold text-slate-900">
                  Patient & Doctor
                </h2>
              </div>

              <p className="mt-1 text-xs text-slate-500">
                Select the patient and doctor for this
                appointment.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              {/* PATIENT */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Patient
                </label>

                <select
                  value={patientId}
                  onChange={(event) =>
                    setPatientId(event.target.value)
                  }
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                >
                  <option value="">
                    Select patient
                  </option>

                  {patients.map((patient) => (
                    <option
                      key={patient.id}
                      value={patient.id}
                    >
                      {patient.name} — {patient.id}
                    </option>
                  ))}
                </select>

                {selectedPatient && (
                  <p className="mt-2 text-xs text-slate-400">
                    {selectedPatient.phone}
                  </p>
                )}
              </div>

              {/* DOCTOR */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Doctor
                </label>

                <select
                  value={doctorId}
                  onChange={(event) => {
                    setDoctorId(event.target.value);
                    setSelectedTime("");
                  }}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                >
                  <option value="">
                    Select doctor
                  </option>

                  {doctors.map((doctor) => (
                    <option
                      key={doctor.id}
                      value={doctor.id}
                    >
                      {doctor.name} — {doctor.department}
                    </option>
                  ))}
                </select>

                {selectedDoctor && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                    <Stethoscope className="h-3.5 w-3.5" />
                    {selectedDoctor.department}
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* DATE + TYPE */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
          >
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-cyan-600" />

                <h2 className="font-semibold text-slate-900">
                  Appointment Details
                </h2>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              {/* DATE */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Appointment Date
                </label>

                <input
                  type="date"
                  value={appointmentDate}
                  onChange={(event) => {
                    setAppointmentDate(
                      event.target.value
                    );
                    setSelectedTime("");
                  }}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              {/* TYPE */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Appointment Type
                </label>

                <select
                  value={appointmentType}
                  onChange={(event) =>
                    setAppointmentType(
                      event.target.value
                    )
                  }
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-100"
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
          </motion.div>

          {/* TIME SLOTS */}
          {!isEmergency && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Clock3 className="h-5 w-5 text-cyan-600" />

                    <h2 className="font-semibold text-slate-900">
                      Available Time Slots
                    </h2>
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    Select a slot based on the doctor's
                    configured availability.
                  </p>
                </div>

                <span className="text-xs text-slate-400">
                  30-minute intervals
                </span>
              </div>

              {!doctorId ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                  <Stethoscope className="mx-auto h-7 w-7 text-slate-300" />

                  <p className="mt-2 text-sm font-medium text-slate-600">
                    Select a doctor first
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Available appointment slots will appear
                    here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {timeSlots.map((time) => {
                    const unavailable =
                      !canSelectSlot(time);

                    const doctorConflict =
                      isDoctorConflict(time);

                    const patientConflict =
                      isPatientConflict(time);

                    const selected =
                      selectedTime === time;

                    let reason = "";

                    if (unavailableSlots.includes(time)) {
                      reason = "Unavailable";
                    } else if (doctorConflict) {
                      reason = "Doctor booked";
                    } else if (patientConflict) {
                      reason = "Patient booked";
                    }

                    return (
                      <button
                        key={time}
                        type="button"
                        disabled={unavailable}
                        onClick={() =>
                          setSelectedTime(time)
                        }
                        className={`rounded-xl border px-3 py-3 text-left transition ${
                          selected
                            ? "border-cyan-500 bg-cyan-50 ring-2 ring-cyan-100"
                            : unavailable
                              ? "cursor-not-allowed border-slate-100 bg-slate-50 opacity-60"
                              : "border-slate-200 bg-white hover:border-cyan-300 hover:bg-cyan-50/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-sm font-semibold ${
                              selected
                                ? "text-cyan-700"
                                : "text-slate-700"
                            }`}
                          >
                            {time}
                          </span>

                          {selected && (
                            <Check className="h-4 w-4 text-cyan-600" />
                          )}
                        </div>

                        <p className="mt-1 text-[10px] text-slate-400">
                          {unavailable
                            ? reason
                            : "Available"}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}

              {selectedTime && (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-xs text-emerald-700">
                  <ShieldCheck className="h-4 w-4" />

                  Selected slot:{" "}
                  <strong>{selectedTime}</strong>
                </div>
              )}
            </motion.div>
          )}

          {/* EMERGENCY OPTION */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className={`rounded-2xl border p-5 shadow-sm sm:p-6 ${
              isEmergency
                ? "border-red-200 bg-red-50/60"
                : "border-slate-200 bg-white"
            }`}
          >
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={isEmergency}
                onChange={(event) => {
                  setIsEmergency(
                    event.target.checked
                  );

                  if (event.target.checked) {
                    setSelectedTime("");
                  }
                }}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
              />

              <div>
                <p
                  className={`text-sm font-semibold ${
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
                  Emergency bookings bypass normal slot
                  availability and are flagged as emergency
                  appointments.
                </p>
              </div>
            </label>
          </motion.div>

          {/* REASON */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
          >
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Reason / Notes
            </label>

            <textarea
              value={reason}
              onChange={(event) =>
                setReason(event.target.value)
              }
              rows={4}
              placeholder="Enter the patient's reason for the appointment..."
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-100"
            />
          </motion.div>

          {/* SUMMARY */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl border border-cyan-100 bg-cyan-50/60 p-5 sm:p-6"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-cyan-600 shadow-sm">
                <HeartPulse className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-slate-900">
                  Appointment Summary
                </h3>

                <div className="mt-3 grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
                  <p>
                    <strong>Patient:</strong>{" "}
                    {selectedPatient?.name || "Not selected"}
                  </p>

                  <p>
                    <strong>Doctor:</strong>{" "}
                    {selectedDoctor?.name || "Not selected"}
                  </p>

                  <p>
                    <strong>Date:</strong>{" "}
                    {appointmentDate || "Not selected"}
                  </p>

                  <p>
                    <strong>Time:</strong>{" "}
                    {isEmergency
                      ? "Emergency"
                      : selectedTime || "Not selected"}
                  </p>

                  <p>
                    <strong>Type:</strong>{" "}
                    {appointmentType.replace(
                      "_",
                      " "
                    )}
                  </p>

                  <p>
                    <strong>Status:</strong> PENDING
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ACTIONS */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="h-12 rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-7 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Booking...
                </>
              ) : (
                <>
                  <CalendarDays className="h-4 w-4" />
                  Create Appointment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}