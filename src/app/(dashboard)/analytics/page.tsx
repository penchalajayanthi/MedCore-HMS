"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  BedDouble,
  Building2,
  CalendarDays,
  ChevronDown,
  Download,
  FlaskConical,
  HeartPulse,
  IndianRupee,
  Microscope,
  Pill,
  RefreshCw,
  Stethoscope,
  TrendingUp,
  Users,
} from "lucide-react";

type RangeType = "7D" | "30D" | "90D" | "1Y";

type MetricType = "patients" | "appointments" | "revenue";

type AnalyticsRange = {
  patients: number;
  appointments: number;
  revenue: number;
  occupancy: number;
  patientChange: number;
  appointmentChange: number;
  revenueChange: number;
  occupancyChange: number;
  labOrders: number;
  prescriptions: number;
  completedVisits: number;
  newPatients: number;
  occupiedBeds: number;
  availableBeds: number;
  totalBeds: number;
};

type DepartmentData = {
  name: string;
  patients: number;
  appointments: number;
  revenue: number;
  doctors: number;
};

type DoctorData = {
  name: string;
  specialty: string;
  appointments: number;
  patients: number;
  rating: number;
};

/* -------------------------------------------------------------------------- */
/* RANGE DATA                                                                  */
/* -------------------------------------------------------------------------- */

const rangeData: Record<RangeType, AnalyticsRange> = {
  "7D": {
    patients: 486,
    appointments: 264,
    revenue: 12.8,
    occupancy: 74.2,
    patientChange: 5.6,
    appointmentChange: 4.2,
    revenueChange: 7.8,
    occupancyChange: -1.4,
    labOrders: 86,
    prescriptions: 142,
    completedVisits: 118,
    newPatients: 38,
    occupiedBeds: 101,
    availableBeds: 35,
    totalBeds: 136,
  },

  "30D": {
    patients: 2847,
    appointments: 1560,
    revenue: 84.2,
    occupancy: 78.4,
    patientChange: 12.8,
    appointmentChange: 8.4,
    revenueChange: 15.6,
    occupancyChange: -2.1,
    labOrders: 386,
    prescriptions: 642,
    completedVisits: 518,
    newPatients: 148,
    occupiedBeds: 112,
    availableBeds: 24,
    totalBeds: 136,
  },

  "90D": {
    patients: 8124,
    appointments: 4680,
    revenue: 241.6,
    occupancy: 81.7,
    patientChange: 18.4,
    appointmentChange: 14.2,
    revenueChange: 21.8,
    occupancyChange: 3.6,
    labOrders: 1148,
    prescriptions: 1842,
    completedVisits: 1598,
    newPatients: 472,
    occupiedBeds: 111,
    availableBeds: 25,
    totalBeds: 136,
  },

  "1Y": {
    patients: 28470,
    appointments: 15840,
    revenue: 864.8,
    occupancy: 79.6,
    patientChange: 24.7,
    appointmentChange: 19.8,
    revenueChange: 28.4,
    occupancyChange: 1.8,
    labOrders: 4286,
    prescriptions: 7462,
    completedVisits: 6148,
    newPatients: 1826,
    occupiedBeds: 108,
    availableBeds: 28,
    totalBeds: 136,
  },
};

/* -------------------------------------------------------------------------- */
/* CHART DATA                                                                  */
/* -------------------------------------------------------------------------- */

const chartData: Record<
  RangeType,
  {
    label: string;
    patients: number;
    appointments: number;
    revenue: number;
  }[]
> = {
  "7D": [
    { label: "Mon", patients: 58, appointments: 32, revenue: 1.8 },
    { label: "Tue", patients: 64, appointments: 36, revenue: 2.1 },
    { label: "Wed", patients: 71, appointments: 40, revenue: 2.4 },
    { label: "Thu", patients: 68, appointments: 38, revenue: 2.2 },
    { label: "Fri", patients: 79, appointments: 43, revenue: 2.6 },
    { label: "Sat", patients: 82, appointments: 45, revenue: 2.9 },
    { label: "Sun", patients: 64, appointments: 30, revenue: 0.8 },
  ],

  "30D": [
    { label: "Week 1", patients: 620, appointments: 310, revenue: 15.2 },
    { label: "Week 2", patients: 690, appointments: 352, revenue: 18.1 },
    { label: "Week 3", patients: 742, appointments: 401, revenue: 21.4 },
    { label: "Week 4", patients: 795, appointments: 497, revenue: 29.5 },
  ],

  "90D": [
    { label: "Month 1", patients: 2240, appointments: 1210, revenue: 68.4 },
    { label: "Month 2", patients: 2680, appointments: 1510, revenue: 79.2 },
    { label: "Month 3", patients: 3204, appointments: 1960, revenue: 94.0 },
  ],

  "1Y": [
    { label: "Jan", patients: 1820, appointments: 920, revenue: 42 },
    { label: "Feb", patients: 1960, appointments: 1010, revenue: 46 },
    { label: "Mar", patients: 2110, appointments: 1090, revenue: 51 },
    { label: "Apr", patients: 2250, appointments: 1180, revenue: 55 },
    { label: "May", patients: 2380, appointments: 1260, revenue: 61 },
    { label: "Jun", patients: 2540, appointments: 1340, revenue: 67 },
    { label: "Jul", patients: 2630, appointments: 1410, revenue: 72 },
    { label: "Aug", patients: 2750, appointments: 1490, revenue: 78 },
    { label: "Sep", patients: 2847, appointments: 1560, revenue: 84 },
  ],
};

/* -------------------------------------------------------------------------- */
/* DEPARTMENT DATA                                                             */
/* -------------------------------------------------------------------------- */

const departmentData: Record<RangeType, DepartmentData[]> = {
  "7D": [
    {
      name: "General Medicine",
      patients: 84,
      appointments: 58,
      revenue: 3.2,
      doctors: 7,
    },
    {
      name: "Cardiology",
      patients: 61,
      appointments: 45,
      revenue: 4.1,
      doctors: 6,
    },
    {
      name: "Emergency Medicine",
      patients: 72,
      appointments: 51,
      revenue: 3.7,
      doctors: 8,
    },
    {
      name: "Orthopedics",
      patients: 48,
      appointments: 38,
      revenue: 2.4,
      doctors: 5,
    },
    {
      name: "Pediatrics",
      patients: 37,
      appointments: 31,
      revenue: 1.8,
      doctors: 4,
    },
    {
      name: "Neurology",
      patients: 32,
      appointments: 26,
      revenue: 2.1,
      doctors: 4,
    },
  ],

  "30D": [
    {
      name: "General Medicine",
      patients: 452,
      appointments: 310,
      revenue: 18.6,
      doctors: 7,
    },
    {
      name: "Cardiology",
      patients: 324,
      appointments: 248,
      revenue: 24.2,
      doctors: 6,
    },
    {
      name: "Emergency Medicine",
      patients: 387,
      appointments: 292,
      revenue: 21.8,
      doctors: 8,
    },
    {
      name: "Orthopedics",
      patients: 241,
      appointments: 194,
      revenue: 15.4,
      doctors: 5,
    },
    {
      name: "Pediatrics",
      patients: 198,
      appointments: 162,
      revenue: 11.7,
      doctors: 4,
    },
    {
      name: "Neurology",
      patients: 186,
      appointments: 145,
      revenue: 13.9,
      doctors: 4,
    },
  ],

  "90D": [
    {
      name: "General Medicine",
      patients: 1328,
      appointments: 912,
      revenue: 54.2,
      doctors: 7,
    },
    {
      name: "Cardiology",
      patients: 982,
      appointments: 704,
      revenue: 71.6,
      doctors: 6,
    },
    {
      name: "Emergency Medicine",
      patients: 1164,
      appointments: 826,
      revenue: 65.4,
      doctors: 8,
    },
    {
      name: "Orthopedics",
      patients: 748,
      appointments: 582,
      revenue: 46.8,
      doctors: 5,
    },
    {
      name: "Pediatrics",
      patients: 614,
      appointments: 486,
      revenue: 35.2,
      doctors: 4,
    },
    {
      name: "Neurology",
      patients: 532,
      appointments: 418,
      revenue: 42.4,
      doctors: 4,
    },
  ],

  "1Y": [
    {
      name: "General Medicine",
      patients: 5280,
      appointments: 3640,
      revenue: 214.8,
      doctors: 7,
    },
    {
      name: "Cardiology",
      patients: 3910,
      appointments: 2840,
      revenue: 286.4,
      doctors: 6,
    },
    {
      name: "Emergency Medicine",
      patients: 4620,
      appointments: 3290,
      revenue: 261.8,
      doctors: 8,
    },
    {
      name: "Orthopedics",
      patients: 3020,
      appointments: 2310,
      revenue: 187.4,
      doctors: 5,
    },
    {
      name: "Pediatrics",
      patients: 2460,
      appointments: 1940,
      revenue: 141.6,
      doctors: 4,
    },
    {
      name: "Neurology",
      patients: 2180,
      appointments: 1720,
      revenue: 159.2,
      doctors: 4,
    },
  ],
};

/* -------------------------------------------------------------------------- */
/* DOCTOR DATA                                                                 */
/* -------------------------------------------------------------------------- */

const doctorData: DoctorData[] = [
  {
    name: "Dr. Sarah Wilson",
    specialty: "Cardiology",
    appointments: 186,
    patients: 142,
    rating: 4.9,
  },
  {
    name: "Dr. James Anderson",
    specialty: "Orthopedics",
    appointments: 172,
    patients: 131,
    rating: 4.8,
  },
  {
    name: "Dr. Robert Taylor",
    specialty: "General Medicine",
    appointments: 164,
    patients: 148,
    rating: 4.8,
  },
  {
    name: "Dr. Emily Davis",
    specialty: "Pediatrics",
    appointments: 153,
    patients: 126,
    rating: 4.7,
  },
  {
    name: "Dr. Michael Brown",
    specialty: "Neurology",
    appointments: 141,
    patients: 108,
    rating: 4.7,
  },
];

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                     */
/* -------------------------------------------------------------------------- */

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-IN").format(value);

const getRangeLabel = (range: RangeType) => {
  switch (range) {
    case "7D":
      return "7 Days";
    case "30D":
      return "30 Days";
    case "90D":
      return "90 Days";
    case "1Y":
      return "1 Year";
  }
};

const getRevenueLabel = (value: number) => {
  if (value >= 100) {
    return `₹${value.toFixed(1)}L`;
  }

  return `₹${value.toFixed(1)}L`;
};

/* -------------------------------------------------------------------------- */
/* PAGE                                                                        */
/* -------------------------------------------------------------------------- */

export default function AnalyticsPage() {
  const [range, setRange] = useState<RangeType>("30D");

  const [selectedMetric, setSelectedMetric] =
    useState<MetricType>("patients");

  const [departmentFilter, setDepartmentFilter] =
    useState("All");

  const currentData = rangeData[range];

  const currentChartData = chartData[range];

  const currentDepartments = departmentData[range];

  const filteredDepartments = useMemo(() => {
    if (departmentFilter === "All") {
      return currentDepartments;
    }

    return currentDepartments.filter(
      (department) => department.name === departmentFilter,
    );
  }, [currentDepartments, departmentFilter]);

  const maxChartValue = useMemo(() => {
    return Math.max(
      ...currentChartData.map((item) => {
        if (selectedMetric === "patients") {
          return item.patients;
        }

        if (selectedMetric === "appointments") {
          return item.appointments;
        }

        return item.revenue;
      }),
    );
  }, [currentChartData, selectedMetric]);

  const getMetricValue = (
    item: (typeof currentChartData)[number],
  ) => {
    if (selectedMetric === "patients") {
      return item.patients;
    }

    if (selectedMetric === "appointments") {
      return item.appointments;
    }

    return item.revenue;
  };

  const getMetricLabel = () => {
    if (selectedMetric === "patients") {
      return "Patients";
    }

    if (selectedMetric === "appointments") {
      return "Appointments";
    }

    return "Revenue";
  };

  const getCurrentMetricTotal = () => {
    if (selectedMetric === "patients") {
      return currentData.patients;
    }

    if (selectedMetric === "appointments") {
      return currentData.appointments;
    }

    return currentData.revenue;
  };

  const handleRangeChange = (newRange: RangeType) => {
    setRange(newRange);

    setDepartmentFilter("All");
  };

  const handleExport = () => {
    const headers = [
      "Period",
      "Patients",
      "Appointments",
      "Revenue (Lakhs)",
      "Occupancy (%)",
    ];

    const rows = currentChartData.map((item) => [
      item.label,
      item.patients,
      item.appointments,
      item.revenue,
      currentData.occupancy,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) =>
            `"${String(value).replace(/"/g, '""')}"`,
          )
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = `medcore-analytics-${range}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-full bg-blue-50/60 p-3 sm:p-4 lg:p-6">
      <div className="mx-auto max-w-[1600px] space-y-5">
        {/* ---------------------------------------------------------------- */}
        {/* HEADER                                                            */}
        {/* ---------------------------------------------------------------- */}

        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl border border-cyan-100 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 shadow-sm"
        >
          <div className="relative p-5 sm:p-6 lg:p-7">
            <div className="absolute -right-10 -top-14 h-40 w-40 rounded-full bg-white/10" />

            <div className="absolute -bottom-20 right-32 h-48 w-48 rounded-full bg-white/5" />

            <div className="relative flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20 backdrop-blur">
                  <BarChart3 className="h-7 w-7" />
                </div>

                <div>
                  <div className="mb-1 flex flex-wrap items-center gap-2 text-xs font-medium text-cyan-100">
                    <span>Insights</span>
                    <span>/</span>
                    <span>Analytics</span>
                  </div>

                  <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    Analytics
                  </h1>

                  <p className="mt-1 max-w-2xl text-sm leading-6 text-blue-50">
                    Monitor hospital performance, patient activity,
                    revenue, appointments, and department trends.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative">
                  <select
                    value={range}
                    onChange={(event) =>
                      handleRangeChange(
                        event.target.value as RangeType,
                      )
                    }
                    className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-white/20 bg-white/10 px-4 pr-10 text-sm font-semibold text-white outline-none backdrop-blur transition hover:bg-white/20 focus:ring-4 focus:ring-white/20 sm:w-40"
                  >
                    <option
                      value="7D"
                      className="text-slate-800"
                    >
                      Last 7 Days
                    </option>

                    <option
                      value="30D"
                      className="text-slate-800"
                    >
                      Last 30 Days
                    </option>

                    <option
                      value="90D"
                      className="text-slate-800"
                    >
                      Last 90 Days
                    </option>

                    <option
                      value="1Y"
                      className="text-slate-800"
                    >
                      Last 1 Year
                    </option>
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white" />
                </div>

                <button
                  type="button"
                  onClick={handleExport}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-blue-700 shadow-md transition hover:bg-blue-50"
                >
                  <Download className="h-4 w-4" />
                  Export Report
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ---------------------------------------------------------------- */}
        {/* RANGE SELECTOR                                                    */}
        {/* ---------------------------------------------------------------- */}

        <div className="flex flex-col gap-3 rounded-2xl border border-blue-100 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-slate-800">
              Performance Overview
            </p>

            <p className="text-xs text-slate-400">
              Showing analytics for the last{" "}
              <span className="font-bold text-blue-600">
                {getRangeLabel(range)}
              </span>
              .
            </p>
          </div>

          <div className="flex w-full rounded-xl bg-slate-100 p-1 sm:w-auto">
            {(["7D", "30D", "90D", "1Y"] as RangeType[]).map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleRangeChange(item)}
                  className={`flex-1 cursor-pointer rounded-lg px-4 py-2 text-xs font-bold transition sm:flex-none ${
                    range === item
                      ? "bg-white text-blue-700 shadow-sm"
                      : "text-slate-500 hover:text-blue-600"
                  }`}
                >
                  {item === "7D"
                    ? "7 Days"
                    : item === "30D"
                      ? "30 Days"
                      : item === "90D"
                        ? "90 Days"
                        : "1 Year"}
                </button>
              ),
            )}
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* MAIN STATS                                                        */}
        {/* ---------------------------------------------------------------- */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Total Patients",
              value: formatNumber(currentData.patients),
              change: currentData.patientChange,
              description: `Last ${getRangeLabel(range).toLowerCase()}`,
              icon: Users,
              iconClass: "bg-blue-50 text-blue-600",
              positive: currentData.patientChange >= 0,
            },
            {
              label: "Appointments",
              value: formatNumber(currentData.appointments),
              change: currentData.appointmentChange,
              description: `Last ${getRangeLabel(range).toLowerCase()}`,
              icon: CalendarDays,
              iconClass: "bg-cyan-50 text-cyan-600",
              positive: currentData.appointmentChange >= 0,
            },
            {
              label: "Total Revenue",
              value: getRevenueLabel(currentData.revenue),
              change: currentData.revenueChange,
              description: `Last ${getRangeLabel(range).toLowerCase()}`,
              icon: IndianRupee,
              iconClass: "bg-emerald-50 text-emerald-600",
              positive: currentData.revenueChange >= 0,
            },
            {
              label: "Bed Occupancy",
              value: `${currentData.occupancy}%`,
              change: currentData.occupancyChange,
              description: "Compared with previous period",
              icon: BedDouble,
              iconClass: "bg-violet-50 text-violet-600",
              positive: currentData.occupancyChange >= 0,
            },
          ].map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="rounded-3xl border border-blue-100 bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {stat.label}
                    </p>

                    <p className="mt-2 text-2xl font-bold text-slate-800">
                      {stat.value}
                    </p>
                  </div>

                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${stat.iconClass}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold ${
                      stat.positive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {stat.positive ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}

                    {Math.abs(stat.change)}%
                  </span>

                  <span className="text-[11px] text-slate-400">
                    {stat.description}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* CHART + INSIGHTS                                                  */}
        {/* ---------------------------------------------------------------- */}

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.8fr)_minmax(320px,0.8fr)]">
          {/* Trend Chart */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-blue-100 bg-white p-4 shadow-sm sm:p-5"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <TrendingUp className="h-4 w-4" />
                  </div>

                  <h2 className="text-lg font-bold text-slate-800">
                    Hospital Trends
                  </h2>
                </div>

                <p className="mt-1 text-xs text-slate-400">
                  {getRangeLabel(range)} performance overview
                </p>
              </div>

              <div className="flex rounded-xl bg-slate-100 p-1">
                {[
                  {
                    value: "patients" as MetricType,
                    label: "Patients",
                  },
                  {
                    value: "appointments" as MetricType,
                    label: "Appointments",
                  },
                  {
                    value: "revenue" as MetricType,
                    label: "Revenue",
                  },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() =>
                      setSelectedMetric(item.value)
                    }
                    className={`cursor-pointer rounded-lg px-3 py-2 text-xs font-bold transition ${
                      selectedMetric === item.value
                        ? "bg-white text-blue-700 shadow-sm"
                        : "text-slate-500 hover:text-blue-600"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-slate-800">
                    {selectedMetric === "revenue"
                      ? getRevenueLabel(getCurrentMetricTotal())
                      : formatNumber(getCurrentMetricTotal())}
                  </p>

                  <p className="text-xs text-slate-400">
                    {getMetricLabel()} in{" "}
                    {getRangeLabel(range).toLowerCase()}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                  <ArrowUpRight className="h-3.5 w-3.5" />

                  {selectedMetric === "patients"
                    ? currentData.patientChange
                    : selectedMetric === "appointments"
                      ? currentData.appointmentChange
                      : currentData.revenueChange}
                  %
                </div>
              </div>

              <div className="relative h-[280px] overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-b from-blue-50/60 to-white p-3 sm:p-5">
                {/* Chart Grid */}
                <div className="pointer-events-none absolute inset-x-5 top-5 bottom-10 flex flex-col justify-between">
                  {[0, 1, 2, 3, 4].map((line) => (
                    <div
                      key={line}
                      className="border-t border-dashed border-slate-200"
                    />
                  ))}
                </div>

                <div className="relative flex h-full items-end gap-2 sm:gap-4">
                  {currentChartData.map((item) => {
                    const value = getMetricValue(item);

                    const height = Math.max(
                      (value / maxChartValue) * 100,
                      8,
                    );

                    return (
                      <div
                        key={item.label}
                        className="flex h-full flex-1 flex-col justify-end"
                      >
                        <div className="group relative flex h-[88%] items-end justify-center">
                          <div
                            className="w-full max-w-[42px] rounded-t-xl bg-gradient-to-t from-blue-600 to-cyan-400 shadow-sm transition-all duration-500 group-hover:from-cyan-500 group-hover:to-blue-500"
                            style={{
                              height: `${height}%`,
                            }}
                          />

                          <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-800 px-2 py-1 text-[10px] font-bold text-white shadow-lg group-hover:block">
                            {selectedMetric === "revenue"
                              ? `₹${value}L`
                              : formatNumber(value)}
                          </div>
                        </div>

                        <p className="mt-2 truncate text-center text-[10px] font-semibold text-slate-400 sm:text-xs">
                          {item.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Insights */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border border-blue-100 bg-white p-4 shadow-sm sm:p-5"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                <Activity className="h-4 w-4" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Quick Insights
                </h2>

                <p className="text-xs text-slate-400">
                  {getRangeLabel(range)} indicators
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {[
                {
                  title: "Patient Growth",
                  value: `${currentData.patientChange}%`,
                  description: "New patient registrations",
                  icon: Users,
                  iconClass: "bg-blue-50 text-blue-600",
                },
                {
                  title: "Appointment Completion",
                  value: "91.6%",
                  description: `${formatNumber(
                    currentData.completedVisits,
                  )} completed visits`,
                  icon: CalendarDays,
                  iconClass: "bg-emerald-50 text-emerald-600",
                },
                {
                  title: "Lab Processing",
                  value: "94.2%",
                  description: `${formatNumber(
                    currentData.labOrders,
                  )} laboratory orders`,
                  icon: FlaskConical,
                  iconClass: "bg-violet-50 text-violet-600",
                },
                {
                  title: "Pharmacy Fulfillment",
                  value: "96.8%",
                  description: `${formatNumber(
                    currentData.prescriptions,
                  )} prescriptions`,
                  icon: Pill,
                  iconClass: "bg-cyan-50 text-cyan-600",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.iconClass}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-bold text-slate-700">
                          {item.title}
                        </p>

                        <span className="shrink-0 text-sm font-bold text-slate-800">
                          {item.value}
                        </span>
                      </div>

                      <p className="mt-0.5 text-[11px] text-slate-400">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50 p-4">
              <div className="flex items-start gap-3">
                <HeartPulse className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                <div>
                  <p className="text-sm font-bold text-slate-700">
                    Current Period
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Showing hospital activity for the last{" "}
                    <span className="font-bold text-blue-600">
                      {getRangeLabel(range).toLowerCase()}
                    </span>
                    .
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* DEPARTMENT PERFORMANCE                                             */}
        {/* ---------------------------------------------------------------- */}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm"
        >
          <div className="border-b border-blue-100 bg-gradient-to-r from-blue-50/90 via-white to-cyan-50/70 p-4 sm:p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <Building2 className="h-4 w-4" />
                  </div>

                  <h2 className="text-lg font-bold text-slate-800">
                    Department Performance
                  </h2>
                </div>

                <p className="mt-1 text-xs text-slate-400">
                  {getRangeLabel(range)} department activity.
                </p>
              </div>

              <div className="relative w-full sm:w-56">
                <select
                  value={departmentFilter}
                  onChange={(event) =>
                    setDepartmentFilter(event.target.value)
                  }
                  className="h-10 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-9 text-sm font-medium text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
                >
                  <option value="All">
                    All Departments
                  </option>

                  {currentDepartments.map((department) => (
                    <option
                      key={department.name}
                      value={department.name}
                    >
                      {department.name}
                    </option>
                  ))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[850px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Department
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Doctors
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Patients
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Appointments
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Revenue
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Activity
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredDepartments.map((department) => {
                  const activity = Math.min(
                    Math.round(
                      (department.appointments /
                        Math.max(
                          ...currentDepartments.map(
                            (item) => item.appointments,
                          ),
                        )) *
                        100,
                    ),
                    100,
                  );

                  return (
                    <tr
                      key={department.name}
                      className="border-b border-slate-100 transition hover:bg-blue-50/40"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <Stethoscope className="h-4 w-4" />
                          </div>

                          <div>
                            <p className="text-sm font-bold text-slate-700">
                              {department.name}
                            </p>

                            <p className="text-xs text-slate-400">
                              Clinical department
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm font-bold text-slate-700">
                        {department.doctors}
                      </td>

                      <td className="px-5 py-4 text-sm font-bold text-slate-700">
                        {formatNumber(department.patients)}
                      </td>

                      <td className="px-5 py-4 text-sm font-bold text-slate-700">
                        {formatNumber(
                          department.appointments,
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm font-bold text-slate-700">
                        ₹{department.revenue.toFixed(1)}L
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
                              style={{
                                width: `${activity}%`,
                              }}
                            />
                          </div>

                          <span className="text-xs font-bold text-slate-500">
                            {activity}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-3 p-4 lg:hidden">
            {filteredDepartments.map((department) => {
              const maxAppointments = Math.max(
                ...currentDepartments.map(
                  (item) => item.appointments,
                ),
              );

              const activity = Math.min(
                Math.round(
                  (department.appointments /
                    maxAppointments) *
                    100,
                ),
                100,
              );

              return (
                <div
                  key={department.name}
                  className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Stethoscope className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-700">
                        {department.name}
                      </p>

                      <p className="text-xs text-slate-400">
                        {department.doctors} doctors
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="rounded-xl bg-white p-3">
                      <p className="text-[10px] font-bold uppercase text-slate-400">
                        Patients
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-700">
                        {formatNumber(
                          department.patients,
                        )}
                      </p>
                    </div>

                    <div className="rounded-xl bg-white p-3">
                      <p className="text-[10px] font-bold uppercase text-slate-400">
                        Visits
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-700">
                        {formatNumber(
                          department.appointments,
                        )}
                      </p>
                    </div>

                    <div className="rounded-xl bg-white p-3">
                      <p className="text-[10px] font-bold uppercase text-slate-400">
                        Revenue
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-700">
                        ₹{department.revenue}L
                      </p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="mb-1.5 flex justify-between">
                      <span className="text-[10px] font-bold uppercase text-slate-400">
                        Activity
                      </span>

                      <span className="text-[10px] font-bold text-blue-600">
                        {activity}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-white">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
                        style={{
                          width: `${activity}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ---------------------------------------------------------------- */}
        {/* BOTTOM CARDS                                                      */}
        {/* ---------------------------------------------------------------- */}

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          {/* Doctor Performance */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-blue-100 bg-white p-4 shadow-sm sm:p-5"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                <Stethoscope className="h-4 w-4" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Doctor Performance
                </h2>

                <p className="text-xs text-slate-400">
                  Performance during selected period
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {doctorData.map((doctor, index) => {
                const scale =
                  range === "7D"
                    ? 0.24
                    : range === "30D"
                      ? 1
                      : range === "90D"
                        ? 2.8
                        : 10.5;

                const appointments = Math.round(
                  doctor.appointments * scale,
                );

                const patients = Math.round(
                  doctor.patients * scale,
                );

                return (
                  <div
                    key={doctor.name}
                    className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-3"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 text-xs font-bold text-blue-700">
                      {index + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-slate-700">
                        {doctor.name}
                      </p>

                      <p className="truncate text-[11px] text-slate-400">
                        {doctor.specialty} •{" "}
                        {formatNumber(appointments)} appointments
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-700">
                        ★ {doctor.rating}
                      </p>

                      <p className="text-[10px] text-slate-400">
                        {formatNumber(patients)} patients
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Bed Occupancy */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="rounded-3xl border border-blue-100 bg-white p-4 shadow-sm sm:p-5"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <BedDouble className="h-4 w-4" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Bed Occupancy
                </h2>

                <p className="text-xs text-slate-400">
                  Current capacity for selected period
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <div className="relative flex h-48 w-48 items-center justify-center">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(#2563eb 0deg ${
                      currentData.occupancy * 3.6
                    }deg, #e2e8f0 ${
                      currentData.occupancy * 3.6
                    }deg 360deg)`,
                  }}
                />

                <div className="absolute inset-5 flex flex-col items-center justify-center rounded-full bg-white">
                  <p className="text-3xl font-bold text-slate-800">
                    {currentData.occupancy}%
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Occupied
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-blue-50 p-3 text-center">
                <p className="text-lg font-bold text-blue-700">
                  {currentData.occupiedBeds}
                </p>

                <p className="text-[10px] font-bold uppercase text-blue-500">
                  Occupied
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 p-3 text-center">
                <p className="text-lg font-bold text-emerald-700">
                  {currentData.availableBeds}
                </p>

                <p className="text-[10px] font-bold uppercase text-emerald-500">
                  Available
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 text-center">
                <p className="text-lg font-bold text-slate-700">
                  {currentData.totalBeds}
                </p>

                <p className="text-[10px] font-bold uppercase text-slate-400">
                  Total
                </p>
              </div>
            </div>
          </motion.div>

          {/* Clinical Activity */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="rounded-3xl border border-blue-100 bg-white p-4 shadow-sm sm:p-5"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Microscope className="h-4 w-4" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Clinical Activity
                </h2>

                <p className="text-xs text-slate-400">
                  {getRangeLabel(range)} activity
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {[
                {
                  label: "Laboratory Orders",
                  value: currentData.labOrders,
                  total:
                    range === "7D"
                      ? 100
                      : range === "30D"
                        ? 700
                        : range === "90D"
                          ? 1400
                          : 5000,
                  icon: FlaskConical,
                  iconClass:
                    "bg-violet-50 text-violet-600",
                },
                {
                  label: "Prescriptions",
                  value: currentData.prescriptions,
                  total:
                    range === "7D"
                      ? 180
                      : range === "30D"
                        ? 800
                        : range === "90D"
                          ? 2200
                          : 8000,
                  icon: Pill,
                  iconClass:
                    "bg-cyan-50 text-cyan-600",
                },
                {
                  label: "Completed Visits",
                  value: currentData.completedVisits,
                  total:
                    range === "7D"
                      ? 140
                      : range === "30D"
                        ? 700
                        : range === "90D"
                          ? 2000
                          : 7000,
                  icon: HeartPulse,
                  iconClass:
                    "bg-rose-50 text-rose-500",
                },
                {
                  label: "New Patients",
                  value: currentData.newPatients,
                  total:
                    range === "7D"
                      ? 50
                      : range === "30D"
                        ? 200
                        : range === "90D"
                          ? 600
                          : 2200,
                  icon: Users,
                  iconClass:
                    "bg-blue-50 text-blue-600",
                },
              ].map((item) => {
                const Icon = item.icon;

                const percentage = Math.min(
                  Math.round(
                    (item.value / item.total) * 100,
                  ),
                  100,
                );

                return (
                  <div key={item.label}>
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.iconClass}`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-xs font-bold text-slate-700">
                            {item.label}
                          </p>

                          <span className="text-xs font-bold text-slate-600">
                            {formatNumber(item.value)}
                          </span>
                        </div>

                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-500"
                            style={{
                              width: `${percentage}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* FOOTER                                                            */}
        {/* ---------------------------------------------------------------- */}

        <div className="flex flex-col gap-2 rounded-2xl border border-blue-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-cyan-500" />

            <p className="text-xs text-slate-500">
              Analytics currently showing{" "}
              <span className="font-bold text-blue-600">
                {getRangeLabel(range)}
              </span>{" "}
              hospital activity.
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
}