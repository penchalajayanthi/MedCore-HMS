"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  FileText,
  FlaskConical,
  MoreHorizontal,
  Plus,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "sonner";


type LabStatus = "Pending" | "In Progress" | "Completed" | "Cancelled";
type Priority = "Normal" | "Urgent" | "Critical";

type LabOrder = {
  id: string;
  orderId: string;
  patient: string;
  patientId: string;
  test: string;
  sample: string;
  orderedBy: string;
  date: string;
  time: string;
  status: LabStatus;
  priority: Priority;
  result: string;
};

const initialOrders: LabOrder[] = [
  {
    id: "1",
    orderId: "LAB-1024",
    patient: "Arjun Kumar",
    patientId: "PT-10231",
    test: "Complete Blood Count",
    sample: "Blood",
    orderedBy: "Dr. Priya Sharma",
    date: "23 Sep 2026",
    time: "09:30 AM",
    status: "Completed",
    priority: "Normal",
    result: "Available",
  },
  {
    id: "2",
    orderId: "LAB-1025",
    patient: "Lakshmi Devi",
    patientId: "PT-10232",
    test: "Lipid Profile",
    sample: "Blood",
    orderedBy: "Dr. Rahul Verma",
    date: "23 Sep 2026",
    time: "10:15 AM",
    status: "In Progress",
    priority: "Normal",
    result: "Processing",
  },
  {
    id: "3",
    orderId: "LAB-1026",
    patient: "Ravi Teja",
    patientId: "PT-10233",
    test: "Liver Function Test",
    sample: "Blood",
    orderedBy: "Dr. Ananya Rao",
    date: "23 Sep 2026",
    time: "10:45 AM",
    status: "Pending",
    priority: "Urgent",
    result: "Pending",
  },
  {
    id: "4",
    orderId: "LAB-1027",
    patient: "Sowmya Reddy",
    patientId: "PT-10234",
    test: "Urine Routine",
    sample: "Urine",
    orderedBy: "Dr. Priya Sharma",
    date: "22 Sep 2026",
    time: "04:20 PM",
    status: "Completed",
    priority: "Normal",
    result: "Available",
  },
  {
    id: "5",
    orderId: "LAB-1028",
    patient: "Vikram Singh",
    patientId: "PT-10235",
    test: "Thyroid Profile",
    sample: "Blood",
    orderedBy: "Dr. Rahul Verma",
    date: "22 Sep 2026",
    time: "05:10 PM",
    status: "Cancelled",
    priority: "Normal",
    result: "Cancelled",
  },
];

const statusClasses: Record<LabStatus, string> = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  "In Progress": "bg-blue-50 text-blue-700 border-blue-200",
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
};

const priorityClasses: Record<Priority, string> = {
  Normal: "bg-slate-50 text-slate-600 border-slate-200",
  Urgent: "bg-orange-50 text-orange-700 border-orange-200",
  Critical: "bg-red-50 text-red-700 border-red-200",
};

function StatusIcon({ status }: { status: LabStatus }) {
  if (status === "Completed") {
    return <CheckCircle2 className="h-4 w-4" />;
  }

  if (status === "In Progress") {
    return <Clock3 className="h-4 w-4" />;
  }

  if (status === "Cancelled") {
    return <X className="h-4 w-4" />;
  }

  return <AlertCircle className="h-4 w-4" />;
}

export default function LaboratoryPage() {
  const [orders, setOrders] = useState<LabOrder[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | LabStatus>("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<LabOrder | null>(null);

  const [patientName, setPatientName] = useState("");
  const [patientId, setPatientId] = useState("");
  const [testName, setTestName] = useState("");
  const [sampleType, setSampleType] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [priority, setPriority] = useState<Priority>("Normal");

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        order.orderId.toLowerCase().includes(searchValue) ||
        order.patient.toLowerCase().includes(searchValue) ||
        order.patientId.toLowerCase().includes(searchValue) ||
        order.test.toLowerCase().includes(searchValue) ||
        order.orderedBy.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const completedCount = orders.filter(
    (order) => order.status === "Completed"
  ).length;

  const pendingCount = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const inProgressCount = orders.filter(
    (order) => order.status === "In Progress"
  ).length;

  const handleAddOrder = () => {
    if (
      !patientName.trim() ||
      !patientId.trim() ||
      !testName.trim() ||
      !sampleType.trim() ||
      !doctorName.trim()
    ) {
      return;
    }

    const newOrder: LabOrder = {
      id: Date.now().toString(),
      orderId: `LAB-${1030 + orders.length}`,
      patient: patientName.trim(),
      patientId: patientId.trim(),
      test: testName.trim(),
      sample: sampleType,
      orderedBy: doctorName.trim(),
      date: "23 Sep 2026",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "Pending",
      priority,
      result: "Pending",
    };

    setOrders((current) => [newOrder, ...current]);

    setPatientName("");
    setPatientId("");
    setTestName("");
    setSampleType("");
    setDoctorName("");
    setPriority("Normal");
    setIsAddModalOpen(false);
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
  };

  const handleAction = (order: LabOrder) => {
  if (order.status === "Completed") {
    toast.success(`Result downloaded for ${order.patient}`);
    return;
  }

  if (order.status === "In Progress") {
    toast.info(`Test is still processing for ${order.patient}`);
    return;
  }

  if (order.status === "Pending") {
    toast.info(`Lab test is still pending for ${order.patient}`);
    return;
  }

  toast.error(`This order has been cancelled`);
};

const handleExport = () => {
  if (orders.length === 0) {
    toast.info("There are no laboratory orders to export.");
    return;
  }

  const headers = [
    "Order ID",
    "Patient",
    "Patient ID",
    "Test",
    "Sample",
    "Ordered By",
    "Date",
    "Time",
    "Priority",
    "Status",
    "Result",
  ];

  const rows = orders.map((order) => [
    order.orderId,
    order.patient,
    order.patientId,
    order.test,
    order.sample,
    order.orderedBy,
    order.date,
    order.time,
    order.priority,
    order.status,
    order.result,
  ]);

  const csvContent = [
    headers,
    ...rows,
  ]
    .map((row) =>
      row
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `medcore-laboratory-orders-${new Date()
    .toISOString()
    .split("T")[0]}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);

  toast.success("Laboratory orders exported successfully.");
};

  return (
    <div className="min-h-screen bg-blue-50/70 p-3 sm:p-5 lg:p-6">
      <div className="mx-auto w-full max-w-[1600px]">
        {/* Main Laboratory Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 overflow-hidden rounded-2xl border border-blue-300 bg-gradient-to-r from-blue-600 via-blue-600 to-cyan-500 shadow-lg"
        >
          <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between lg:p-7">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-100">
                <span>Clinical</span>
                <span>/</span>
                <span className="text-white">Laboratory</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">
                  <FlaskConical className="h-6 w-6 text-white" />
                </div>

                <h1 className="text-2xl font-bold text-white sm:text-3xl">
                  Laboratory
                </h1>
              </div>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-50 sm:text-base">
                Manage laboratory tests, samples, orders and patient results.
              </p>
            </div>

            {/* Add Lab Order Button */}
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-700 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white/70 sm:w-auto"
            >
              <Plus className="h-5 w-5" />
              Add Lab Order
            </button>
          </div>
        </motion.div>

        {/* Statistics */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Lab Orders
                </p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                  {orders.length}
                </h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FlaskConical className="h-5 w-5" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Completed
                </p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                  {completedCount}
                </h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Pending
                </p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                  {pendingCount}
                </h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <AlertCircle className="h-5 w-5" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-cyan-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  In Progress
                </p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                  {inProgressCount}
                </h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                <Clock3 className="h-5 w-5" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Laboratory Orders Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm"
        >
          {/* Card Header */}
          <div className="border-b border-blue-100 bg-blue-50/50 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <FileText className="h-5 w-5" />
                  </div>

                  <h2 className="text-lg font-bold text-slate-900">
                    Laboratory Orders
                  </h2>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  View and manage laboratory test orders and patient results.
                </p>
              </div>

              <button
                type="button"
                onClick={resetFilters}
                className="cursor-pointer self-start rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 transition hover:border-blue-300 hover:bg-blue-50 lg:self-auto"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="border-b border-slate-100 p-5">
            <div className="flex flex-col gap-3 lg:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search patient, order ID, test or doctor..."
                  className="w-full rounded-xl border border-blue-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {(
                  [
                    "All",
                    "Pending",
                    "In Progress",
                    "Completed",
                    "Cancelled",
                  ] as const
                ).map((status) => {
                  const active = statusFilter === status;

                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setStatusFilter(status)}
                      className={`cursor-pointer rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                        active
                          ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                          : "border-blue-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                      }`}
                    >
                      {status}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[1100px]">
         <thead>
  <tr className="border-b border-cyan-200 bg-cyan-50 text-left">
    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-cyan-800">
      Order
    </th>

    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-cyan-800">
      Patient
    </th>

    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-cyan-800">
      Test
    </th>

    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-cyan-800">
      Sample
    </th>

    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-cyan-800">
      Ordered By
    </th>

    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-cyan-800">
      Date
    </th>

    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-cyan-800">
      Priority
    </th>

    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-cyan-800">
      Status
    </th>

    <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-cyan-800">
      Action
    </th>
  </tr>
</thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order, index) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b border-slate-100 transition hover:bg-blue-50/40"
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-blue-700">
                          {order.orderId}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            <UserRound className="h-4 w-4" />
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {order.patient}
                            </p>
                            <p className="text-xs text-slate-500">
                              {order.patientId}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-slate-800">
                          {order.test}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                          {order.sample}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm text-slate-700">
                          {order.orderedBy}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <CalendarDays className="h-4 w-4 text-blue-500" />
                          <div>
                            <p>{order.date}</p>
                            <p className="text-xs text-slate-400">
                              {order.time}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-lg border px-2.5 py-1 text-xs font-medium ${priorityClasses[order.priority]}`}
                        >
                          {order.priority}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium ${statusClasses[order.status]}`}
                        >
                          <StatusIcon status={order.status} />
                          {order.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
  {/* View */}
  <button
    type="button"
    onClick={() => setSelectedOrder(order)}
    title="View details"
    className="cursor-pointer rounded-lg border border-blue-200 bg-white p-2 text-blue-600 transition-all hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm"
  >
    <Eye className="h-4 w-4" />
  </button>

  {/* Action */}
  <button
    type="button"
    onClick={() => handleAction(order)}
    title={
      order.status === "Completed"
        ? "Download result"
        : "View order status"
    }
    className="cursor-pointer rounded-lg border border-cyan-200 bg-cyan-50 p-2 text-cyan-700 transition-all hover:border-cyan-300 hover:bg-cyan-100 hover:shadow-sm"
  >
    <MoreHorizontal className="h-4 w-4" />
  </button>
</div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-5 py-14 text-center">
                      <div className="flex flex-col items-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-500">
                          <FlaskConical className="h-6 w-6" />
                        </div>

                        <p className="font-semibold text-slate-800">
                          No laboratory orders found
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Try changing your search or filters.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile / Tablet Cards */}
          <div className="grid gap-4 p-4 lg:hidden">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <FlaskConical className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-blue-700">
                          {order.orderId}
                        </p>
                        <p className="text-sm font-semibold text-slate-900">
                          {order.test}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="cursor-pointer rounded-lg border border-blue-200 bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-4 rounded-xl bg-slate-50 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <UserRound className="h-4 w-4" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {order.patient}
                        </p>
                        <p className="text-xs text-slate-500">
                          {order.patientId}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-slate-400">Sample</p>
                      <p className="mt-1 text-sm font-medium text-slate-700">
                        {order.sample}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">Ordered By</p>
                      <p className="mt-1 text-sm font-medium text-slate-700">
                        {order.orderedBy}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">Date</p>
                      <p className="mt-1 text-sm font-medium text-slate-700">
                        {order.date}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">Priority</p>
                      <span
                        className={`mt-1 inline-flex rounded-lg border px-2 py-1 text-xs font-medium ${priorityClasses[order.priority]}`}
                      >
                        {order.priority}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium ${statusClasses[order.status]}`}
                    >
                      <StatusIcon status={order.status} />
                      {order.status}
                    </span>

                    <span className="text-xs font-medium text-slate-500">
                      Result: {order.result}
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-12 text-center">
                <FlaskConical className="mx-auto h-8 w-8 text-blue-400" />
                <p className="mt-3 font-semibold text-slate-800">
                  No laboratory orders found
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {filteredOrders.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {orders.length}
              </span>{" "}
              laboratory orders
            </p>

         <button
  type="button"
  onClick={handleExport}
  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition-all hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm"
>
  <Download className="h-4 w-4" />
  Export
</button>
          </div>
        </motion.div>
      </div>

      {/* Add Lab Order Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-3 backdrop-blur-sm sm:p-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-2xl"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                      <FlaskConical className="h-5 w-5 text-white" />
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-white">
                        Add Lab Order
                      </h2>
                      <p className="text-xs text-blue-100">
                        Create a new laboratory test order
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="cursor-pointer rounded-lg p-2 text-white/80 transition hover:bg-white/15 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-5 sm:p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Patient Name */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Patient Name
                    </label>

                    <input
                      type="text"
                      value={patientName}
                      onChange={(event) => setPatientName(event.target.value)}
                      placeholder="Enter patient name"
                      className="w-full rounded-xl border border-blue-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  {/* Patient ID */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Patient ID
                    </label>

                    <input
                      type="text"
                      value={patientId}
                      onChange={(event) => setPatientId(event.target.value)}
                      placeholder="e.g. PT-10236"
                      className="w-full rounded-xl border border-blue-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  {/* Test */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Laboratory Test
                    </label>

                    <select
                      value={testName}
                      onChange={(event) => setTestName(event.target.value)}
                      className="w-full cursor-pointer rounded-xl border border-blue-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">Select test</option>
                      <option value="Complete Blood Count">
                        Complete Blood Count
                      </option>
                      <option value="Lipid Profile">Lipid Profile</option>
                      <option value="Liver Function Test">
                        Liver Function Test
                      </option>
                      <option value="Kidney Function Test">
                        Kidney Function Test
                      </option>
                      <option value="Thyroid Profile">Thyroid Profile</option>
                      <option value="Urine Routine">Urine Routine</option>
                      <option value="Blood Sugar">Blood Sugar</option>
                    </select>
                  </div>

                  {/* Sample */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Sample Type
                    </label>

                    <select
                      value={sampleType}
                      onChange={(event) => setSampleType(event.target.value)}
                      className="w-full cursor-pointer rounded-xl border border-blue-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">Select sample</option>
                      <option value="Blood">Blood</option>
                      <option value="Urine">Urine</option>
                      <option value="Stool">Stool</option>
                      <option value="Saliva">Saliva</option>
                      <option value="Swab">Swab</option>
                    </select>
                  </div>

                  {/* Doctor */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Ordering Doctor
                    </label>

                    <input
                      type="text"
                      value={doctorName}
                      onChange={(event) => setDoctorName(event.target.value)}
                      placeholder="Enter doctor name"
                      className="w-full rounded-xl border border-blue-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Priority
                    </label>

                    <select
                      value={priority}
                      onChange={(event) =>
                        setPriority(event.target.value as Priority)
                      }
                      className="w-full cursor-pointer rounded-xl border border-blue-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="Normal">Normal</option>
                      <option value="Urgent">Urgent</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="cursor-pointer rounded-xl border border-blue-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-blue-300 hover:bg-blue-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleAddOrder}
                  className="cursor-pointer rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
                >
                  Create Lab Order
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-3 backdrop-blur-sm sm:p-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-lg overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-blue-100 bg-blue-50 px-5 py-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                    Laboratory Order
                  </p>
                  <h2 className="mt-1 text-lg font-bold text-slate-900">
                    {selectedOrder.orderId}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="cursor-pointer rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 p-5">
                <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/50 p-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <UserRound className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900">
                      {selectedOrder.patient}
                    </p>
                    <p className="text-sm text-slate-500">
                      {selectedOrder.patientId}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-400">Test</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {selectedOrder.test}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Sample</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {selectedOrder.sample}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Ordered By</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {selectedOrder.orderedBy}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Date & Time</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {selectedOrder.date}
                    </p>
                    <p className="text-xs text-slate-500">
                      {selectedOrder.time}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Priority</p>
                    <span
                      className={`mt-1 inline-flex rounded-lg border px-2.5 py-1 text-xs font-medium ${priorityClasses[selectedOrder.priority]}`}
                    >
                      {selectedOrder.priority}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Result</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {selectedOrder.result}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 bg-slate-50 px-5 py-4 text-right">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="cursor-pointer rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}