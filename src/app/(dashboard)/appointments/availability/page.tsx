"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Clock3,
  Plus,
  Trash2,
  Save,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
} from "lucide-react";
import { toast } from "sonner";

type DaySchedule = {
  day: string;
  shortDay: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
  slotDuration: number;
};

const initialSchedule: DaySchedule[] = [
  {
    day: "Monday",
    shortDay: "MON",
    enabled: true,
    startTime: "09:00",
    endTime: "13:00",
    slotDuration: 30,
  },
  {
    day: "Tuesday",
    shortDay: "TUE",
    enabled: true,
    startTime: "09:00",
    endTime: "13:00",
    slotDuration: 30,
  },
  {
    day: "Wednesday",
    shortDay: "WED",
    enabled: true,
    startTime: "09:00",
    endTime: "13:00",
    slotDuration: 30,
  },
  {
    day: "Thursday",
    shortDay: "THU",
    enabled: true,
    startTime: "09:00",
    endTime: "13:00",
    slotDuration: 30,
  },
  {
    day: "Friday",
    shortDay: "FRI",
    enabled: true,
    startTime: "09:00",
    endTime: "13:00",
    slotDuration: 30,
  },
  {
    day: "Saturday",
    shortDay: "SAT",
    enabled: false,
    startTime: "09:00",
    endTime: "13:00",
    slotDuration: 30,
  },
  {
    day: "Sunday",
    shortDay: "SUN",
    enabled: false,
    startTime: "09:00",
    endTime: "13:00",
    slotDuration: 30,
  },
];

export default function AvailabilityPage() {
  const [schedule, setSchedule] =
    useState<DaySchedule[]>(initialSchedule);

  const [selectedDoctor, setSelectedDoctor] =
    useState("Dr. Priya Sharma");

  const [weekOffset, setWeekOffset] = useState(0);

  const updateDay = (
    index: number,
    field: keyof DaySchedule,
    value: string | boolean | number
  ) => {
    setSchedule((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const saveSchedule = () => {
    localStorage.setItem(
      "medcore_doctor_availability",
      JSON.stringify({
        doctor: selectedDoctor,
        schedule,
      })
    );

    toast.success("Doctor availability saved successfully");
  };

  const enabledDays = schedule.filter(
    (item) => item.enabled
  ).length;

  return (
    <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
              <CalendarDays className="h-4 w-4 text-cyan-600" />
              <span>Appointments</span>
              <span>/</span>
              <span className="text-slate-700">
                Doctor Availability
              </span>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Doctor Availability
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Configure weekly schedules and appointment time slots.
            </p>
          </div>

          <button
            onClick={saveSchedule}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-[1.02] sm:w-auto"
          >
            <Save className="h-4 w-4" />
            Save Schedule
          </button>
        </motion.div>

        {/* DOCTOR SELECTOR */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">

            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                <Stethoscope className="h-6 w-6" />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Doctor
                </p>

                <select
                  value={selectedDoctor}
                  onChange={(e) =>
                    setSelectedDoctor(e.target.value)
                  }
                  className="mt-1 bg-transparent text-base font-semibold text-slate-800 outline-none"
                >
                  <option>Dr. Priya Sharma</option>
                  <option>Dr. Arjun Rao</option>
                  <option>Dr. Meera Nair</option>
                  <option>Dr. Karthik Reddy</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <SummaryCard
                label="Working Days"
                value={enabledDays.toString()}
              />

              <SummaryCard
                label="Slot Duration"
                value="30 min"
              />

              <SummaryCard
                label="Schedule"
                value="Weekly"
              />
            </div>
          </div>
        </motion.div>

        {/* WEEK NAVIGATION */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <button
            onClick={() =>
              setWeekOffset((value) => value - 1)
            }
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-cyan-600" />

            <span className="text-sm font-semibold text-slate-800 sm:text-base">
              {weekOffset === 0
                ? "Current Weekly Schedule"
                : weekOffset > 0
                  ? `Week +${weekOffset}`
                  : `Week ${weekOffset}`}
            </span>
          </div>

          <button
            onClick={() =>
              setWeekOffset((value) => value + 1)
            }
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* WEEKLY SCHEDULE */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-semibold text-slate-900">
              Weekly Schedule
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Define working hours and configurable appointment slots.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {schedule.map((item, index) => (
              <div
                key={item.day}
                className="p-4 sm:p-5"
              >
                <div className="grid gap-4 lg:grid-cols-[180px_100px_1fr_160px] lg:items-center">

                  {/* DAY */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl text-xs font-bold ${
                        item.enabled
                          ? "bg-cyan-50 text-cyan-700"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {item.shortDay}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {item.day}
                      </p>

                      <p className="text-xs text-slate-400">
                        {item.enabled
                          ? "Available"
                          : "Day off"}
                      </p>
                    </div>
                  </div>

                  {/* ENABLE */}
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={item.enabled}
                      onChange={(e) =>
                        updateDay(
                          index,
                          "enabled",
                          e.target.checked
                        )
                      }
                      className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                    />

                    <span className="text-sm text-slate-600">
                      Working day
                    </span>
                  </label>

                  {/* TIME */}
                  <div className="grid grid-cols-2 gap-3 sm:max-w-md">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-500">
                        Start time
                      </label>

                      <div className="relative">
                        <Clock3 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                          type="time"
                          disabled={!item.enabled}
                          value={item.startTime}
                          onChange={(e) =>
                            updateDay(
                              index,
                              "startTime",
                              e.target.value
                            )
                          }
                          className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-2 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-500">
                        End time
                      </label>

                      <div className="relative">
                        <Clock3 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                          type="time"
                          disabled={!item.enabled}
                          value={item.endTime}
                          onChange={(e) =>
                            updateDay(
                              index,
                              "endTime",
                              e.target.value
                            )
                          }
                          className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-2 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SLOT */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-500">
                      Slot duration
                    </label>

                    <select
                      disabled={!item.enabled}
                      value={item.slotDuration}
                      onChange={(e) =>
                        updateDay(
                          index,
                          "slotDuration",
                          Number(e.target.value)
                        )
                      }
                      className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={20}>20 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={45}>45 minutes</option>
                      <option value={60}>60 minutes</option>
                    </select>
                  </div>
                </div>

                {/* DISABLED MESSAGE */}
                {!item.enabled && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-400">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Doctor is unavailable on this day.
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* SLOT PREVIEW */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Time Slot Preview
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Generated from the configured schedule.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                toast.info(
                  "Additional slot configuration will be connected to the booking engine."
                )
              }
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Slot
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {generateSlots("09:00", "13:00", 30).map(
              (slot) => (
                <span
                  key={slot}
                  className="rounded-lg border border-cyan-100 bg-cyan-50 px-3 py-2 text-xs font-medium text-cyan-700"
                >
                  {slot}
                </span>
              )
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 px-4 py-3">
      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-slate-800">
        {value}
      </p>
    </div>
  );
}

function generateSlots(
  start: string,
  end: string,
  duration: number
) {
  const slots: string[] = [];

  const [startHour, startMinute] = start
    .split(":")
    .map(Number);

  const [endHour, endMinute] = end
    .split(":")
    .map(Number);

  let current =
    startHour * 60 + startMinute;

  const endMinutes =
    endHour * 60 + endMinute;

  while (current < endMinutes) {
    const hour = Math.floor(current / 60);
    const minute = current % 60;

    const formattedHour =
      hour % 12 === 0 ? 12 : hour % 12;

    const formattedMinute =
      minute.toString().padStart(2, "0");

    const period = hour >= 12 ? "PM" : "AM";

    slots.push(
      `${formattedHour}:${formattedMinute} ${period}`
    );

    current += duration;
  }

  return slots;
}