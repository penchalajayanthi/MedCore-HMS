"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  HeartPulse,
  Plus,
  Save,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { toast } from "sonner";

type Doctor = {
  id: string;
  name: string;
  department: string;
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

const AVAILABILITY_STORAGE_KEY =
  "medcore_doctor_availability";

const AVAILABILITY_UPDATED_EVENT =
  "medcore-doctor-availability-updated";

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

const initialSchedule: DaySchedule[] = [
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

const cloneSchedule = (
  schedule: DaySchedule[],
) =>
  schedule.map((day) => ({
    ...day,
  }));

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

function StatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            {title}
          </p>

          <p className="mt-2 text-xl font-bold text-slate-900">
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

export default function AvailabilityPage() {
  const [schedule, setSchedule] =
    useState<DaySchedule[]>(
      cloneSchedule(initialSchedule),
    );

  const [selectedDoctorId, setSelectedDoctorId] =
    useState("DOC-001");

  const [availabilityStore, setAvailabilityStore] =
    useState<AvailabilityStore>({});

  const [weekOffset, setWeekOffset] =
    useState(0);

  const [isSaving, setIsSaving] =
    useState(false);

  const selectedDoctor = useMemo(
    () =>
      doctors.find(
        (doctor) =>
          doctor.id === selectedDoctorId,
      ) ?? doctors[0],
    [selectedDoctorId],
  );

  const loadAvailability = () => {
    try {
      const stored = localStorage.getItem(
        AVAILABILITY_STORAGE_KEY,
      );

      if (!stored) {
        setAvailabilityStore({});
        setSchedule(
          cloneSchedule(initialSchedule),
        );
        return;
      }

      const parsed = JSON.parse(stored);

      // New format
      if (
        parsed &&
        typeof parsed === "object" &&
        !Array.isArray(parsed) &&
        !("doctorId" in parsed)
      ) {
        const store =
          parsed as AvailabilityStore;

        setAvailabilityStore(store);

        const doctorSchedule =
          store[selectedDoctorId];

        setSchedule(
          doctorSchedule?.schedule
            ? cloneSchedule(
                doctorSchedule.schedule,
              )
            : cloneSchedule(
                initialSchedule,
              ),
        );

        return;
      }

      // Previous format:
      // {
      //   doctor: "Dr. Priya Sharma",
      //   schedule: [...]
      // }
      if (
        parsed &&
        typeof parsed === "object" &&
        !Array.isArray(parsed) &&
        typeof parsed.doctor ===
          "string" &&
        Array.isArray(parsed.schedule)
      ) {
        const matchedDoctor =
          doctors.find(
            (doctor) =>
              doctor.name ===
              parsed.doctor,
          );

        if (matchedDoctor) {
          const migratedStore: AvailabilityStore =
            {
              [matchedDoctor.id]: {
                doctorId:
                  matchedDoctor.id,
                doctorName:
                  matchedDoctor.name,
                schedule:
                  parsed.schedule,
              },
            };

          setAvailabilityStore(
            migratedStore,
          );

          if (
            matchedDoctor.id ===
            selectedDoctorId
          ) {
            setSchedule(
              cloneSchedule(
                parsed.schedule,
              ),
            );
          }

          return;
        }
      }

      setAvailabilityStore({});
      setSchedule(
        cloneSchedule(initialSchedule),
      );
    } catch {
      setAvailabilityStore({});
      setSchedule(
        cloneSchedule(initialSchedule),
      );
    }
  };

  useEffect(() => {
    loadAvailability();

    const handleAvailabilityUpdated =
      () => {
        loadAvailability();
      };

    window.addEventListener(
      AVAILABILITY_UPDATED_EVENT,
      handleAvailabilityUpdated,
    );

    const handleStorage = (
      event: StorageEvent,
    ) => {
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
        AVAILABILITY_UPDATED_EVENT,
        handleAvailabilityUpdated,
      );

      window.removeEventListener(
        "storage",
        handleStorage,
      );
    };
  }, [selectedDoctorId]);

  const handleDoctorChange = (
    doctorId: string,
  ) => {
    setSelectedDoctorId(doctorId);

    const saved =
      availabilityStore[doctorId];

    setSchedule(
      saved?.schedule
        ? cloneSchedule(
            saved.schedule,
          )
        : cloneSchedule(
            initialSchedule,
          ),
    );
  };

  const updateDay = (
    index: number,
    updates: Partial<DaySchedule>,
  ) => {
    setSchedule((current) =>
      current.map((day, dayIndex) =>
        dayIndex === index
          ? {
              ...day,
              ...updates,
            }
          : day,
      ),
    );
  };

  const saveSchedule = async () => {
    if (!selectedDoctor) {
      return;
    }

    for (const day of schedule) {
      if (!day.enabled) {
        continue;
      }

      if (
        parseTime(day.startTime) >=
        parseTime(day.endTime)
      ) {
        toast.error(
          `${day.day}: end time must be after start time.`,
        );
        return;
      }

      if (
        !Number.isFinite(
          day.slotDuration,
        ) ||
        day.slotDuration <= 0
      ) {
        toast.error(
          `${day.day}: please select a valid slot duration.`,
        );
        return;
      }
    }

    setIsSaving(true);

    try {
      await new Promise(
        (resolve) =>
          setTimeout(resolve, 500),
      );

      const updatedStore: AvailabilityStore =
        {
          ...availabilityStore,
          [selectedDoctor.id]: {
            doctorId: selectedDoctor.id,
            doctorName:
              selectedDoctor.name,
            schedule:
              cloneSchedule(schedule),
          },
        };

      setAvailabilityStore(
        updatedStore,
      );

      localStorage.setItem(
        AVAILABILITY_STORAGE_KEY,
        JSON.stringify(updatedStore),
      );

      window.dispatchEvent(
        new Event(
          AVAILABILITY_UPDATED_EVENT,
        ),
      );

      toast.success(
        `${selectedDoctor.name}'s availability saved successfully.`,
      );
    } finally {
      setIsSaving(false);
    }
  };

  const enabledDays = schedule.filter(
    (day) => day.enabled,
  ).length;

  const totalSlots = schedule.reduce(
    (total, day) => {
      if (!day.enabled) {
        return total;
      }

      return (
        total +
        generateSlots(
          day.startTime,
          day.endTime,
          day.slotDuration,
        ).length
      );
    },
    0,
  );

  const averageSlotDuration =
    schedule.length > 0
      ? Math.round(
          schedule.reduce(
            (sum, day) =>
              sum + day.slotDuration,
            0,
          ) / schedule.length,
        )
      : 30;

  const selectedDoctorSaved =
    Boolean(
      availabilityStore[
        selectedDoctor.id
      ],
    );

  const previewDay = schedule.find(
    (day) => day.enabled,
  );

  const previewSlots = previewDay
    ? generateSlots(
        previewDay.startTime,
        previewDay.endTime,
        previewDay.slotDuration,
      )
    : [];

  const weekLabel =
    weekOffset === 0
      ? "Current Week"
      : weekOffset > 0
        ? `Next ${weekOffset} Week${
            weekOffset === 1 ? "" : "s"
          }`
        : `Previous ${
            Math.abs(weekOffset)
          } Week${
            Math.abs(weekOffset) === 1
              ? ""
              : "s"
          }`;

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-5 lg:p-6">
      <div className="mx-auto max-w-[1500px] space-y-5">
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
          <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-cyan-600 shadow-sm ring-1 ring-cyan-100">
                <Clock3 className="h-6 w-6" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                    Doctor Availability
                  </h1>

                  <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[11px] font-bold text-cyan-700">
                    Scheduling
                  </span>
                </div>

                <p className="mt-1 max-w-2xl text-sm text-slate-500">
                  Configure working days, hours
                  and appointment slot duration for
                  each doctor.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={saveSchedule}
              disabled={isSaving}
              className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-sm transition ${
                isSaving
                  ? "cursor-not-allowed bg-slate-300"
                  : "bg-cyan-600 hover:bg-cyan-700"
              }`}
            >
              {isSaving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Schedule
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Doctor Selector */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Select Doctor
              </label>

              <select
                value={selectedDoctorId}
                onChange={(event) =>
                  handleDoctorChange(
                    event.target.value,
                  )
                }
                className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-100"
              >
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
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600">
                <Stethoscope className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-800">
                  {selectedDoctor.name}
                </p>

                <p className="text-xs text-slate-500">
                  {selectedDoctor.department} •{" "}
                  {selectedDoctor.id}
                </p>
              </div>
            </div>
          </div>

          {selectedDoctorSaved && (
            <div className="mt-3 flex items-center gap-2 text-xs font-medium text-emerald-600">
              <Check className="h-4 w-4" />
              Saved availability loaded for this
              doctor.
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Working Days"
            value={`${enabledDays} / 7`}
            description="Enabled working days"
            icon={
              <CalendarDays className="h-5 w-5" />
            }
          />

          <StatCard
            title="Slot Duration"
            value={`${averageSlotDuration} min`}
            description="Configured average"
            icon={
              <Clock3 className="h-5 w-5" />
            }
          />

          <StatCard
            title="Weekly Slots"
            value={String(totalSlots)}
            description="Estimated available slots"
            icon={
              <HeartPulse className="h-5 w-5" />
            }
          />

          <StatCard
            title="Schedule"
            value={
              selectedDoctorSaved
                ? "Saved"
                : "Default"
            }
            description={
              selectedDoctorSaved
                ? "Doctor schedule configured"
                : "Using default schedule"
            }
            icon={
              <ShieldCheck className="h-5 w-5" />
            }
          />
        </div>

        {/* Week Navigation */}
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Schedule View
            </p>

            <p className="mt-1 text-sm font-bold text-slate-900">
              {weekLabel}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setWeekOffset(
                  (value) => value - 1,
                )
              }
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
              aria-label="Previous week"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() =>
                setWeekOffset(0)
              }
              className="cursor-pointer rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-2.5 text-xs font-bold text-cyan-700 transition hover:bg-cyan-100"
            >
              Current Week
            </button>

            <button
              type="button"
              onClick={() =>
                setWeekOffset(
                  (value) => value + 1,
                )
              }
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
              aria-label="Next week"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Weekly Schedule */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-4 sm:p-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Weekly Schedule
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Configure the doctor's regular
                working hours.
              </p>
            </div>
          </div>

          <div className="space-y-3 p-3 sm:p-4">
            {schedule.map(
              (day, index) => (
                <motion.div
                  key={day.day}
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
                  className={`rounded-2xl border p-4 transition ${
                    day.enabled
                      ? "border-slate-200 bg-white"
                      : "border-slate-100 bg-slate-50"
                  }`}
                >
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-[180px_1fr_auto] lg:items-center">
                    {/* Day */}
                    <div className="flex items-center justify-between gap-3 lg:justify-start">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold ${
                            day.enabled
                              ? "bg-cyan-50 text-cyan-700"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {day.shortDay}
                        </div>

                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            {day.day}
                          </p>

                          <p className="text-xs text-slate-400">
                            {day.enabled
                              ? "Working day"
                              : "Day off"}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          updateDay(
                            index,
                            {
                              enabled:
                                !day.enabled,
                            },
                          )
                        }
                        className="cursor-pointer"
                        aria-label={`Toggle ${day.day}`}
                      >
                        <div
                          className={`flex h-6 w-11 items-center rounded-full p-1 transition ${
                            day.enabled
                              ? "bg-cyan-600"
                              : "bg-slate-300"
                          }`}
                        >
                          <div
                            className={`h-4 w-4 rounded-full bg-white shadow-sm transition ${
                              day.enabled
                                ? "translate-x-5"
                                : "translate-x-0"
                            }`}
                          />
                        </div>
                      </button>
                    </div>

                    {/* Time */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Start Time
                        </label>

                        <input
                          type="time"
                          value={
                            day.startTime
                          }
                          disabled={
                            !day.enabled
                          }
                          onChange={(
                            event,
                          ) =>
                            updateDay(
                              index,
                              {
                                startTime:
                                  event
                                    .target
                                    .value,
                              },
                            )
                          }
                          className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          End Time
                        </label>

                        <input
                          type="time"
                          value={
                            day.endTime
                          }
                          disabled={
                            !day.enabled
                          }
                          onChange={(
                            event,
                          ) =>
                            updateDay(
                              index,
                              {
                                endTime:
                                  event
                                    .target
                                    .value,
                              },
                            )
                          }
                          className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="min-w-[170px]">
                      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Slot Duration
                      </label>

                      <select
                        value={
                          day.slotDuration
                        }
                        disabled={
                          !day.enabled
                        }
                        onChange={(event) =>
                          updateDay(
                            index,
                            {
                              slotDuration:
                                Number(
                                  event
                                    .target
                                    .value,
                                ),
                            },
                          )
                        }
                        className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value={15}>
                          15 minutes
                        </option>

                        <option value={30}>
                          30 minutes
                        </option>

                        <option value={45}>
                          45 minutes
                        </option>

                        <option value={60}>
                          60 minutes
                        </option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              ),
            )}
          </div>
        </div>

        {/* Slot Preview */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Slot Preview
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Preview generated slots from the
                first enabled working day.
              </p>
            </div>

            <span className="rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-bold text-cyan-700">
              {previewDay
                ? previewDay.day
                : "No working day"}
            </span>
          </div>

          <div className="p-4 sm:p-5">
            {previewSlots.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                <Clock3 className="mx-auto h-7 w-7 text-slate-400" />

                <p className="mt-2 text-sm font-semibold text-slate-700">
                  No slots available
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Enable at least one working day
                  to generate appointment slots.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
                {previewSlots.map(
                  (slot) => (
                    <div
                      key={slot}
                      className="flex items-center justify-center gap-2 rounded-xl border border-cyan-100 bg-cyan-50/60 px-3 py-3 text-xs font-semibold text-cyan-700"
                    >
                      <Clock3 className="h-3.5 w-3.5" />
                      {slot}
                    </div>
                  ),
                )}
              </div>
            )}

            <button
              type="button"
              onClick={() =>
                toast.info(
                  "Slots are generated automatically from the working hours and slot duration.",
                )
              }
              className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
            >
              <Plus className="h-4 w-4" />
              Add Slot
            </button>
          </div>
        </div>

        {/* Save Footer */}
        <div className="sticky bottom-3 z-20 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />

              <p className="text-xs text-slate-500">
                Changes apply to{" "}
                <span className="font-bold text-slate-700">
                  {selectedDoctor.name}
                </span>{" "}
                only.
              </p>
            </div>

            <button
              type="button"
              onClick={saveSchedule}
              disabled={isSaving}
              className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition ${
                isSaving
                  ? "cursor-not-allowed bg-slate-300"
                  : "bg-cyan-600 hover:bg-cyan-700"
              }`}
            >
              {isSaving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Doctor Schedule
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}