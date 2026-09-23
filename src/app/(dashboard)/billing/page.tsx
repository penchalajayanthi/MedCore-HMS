"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowDownToLine,
  ArrowLeft,
  BadgeIndianRupee,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  FileText,
  Filter,
  HeartPulse,
  MoreHorizontal,
  Pencil,
  Plus,
  Receipt,
  RotateCcw,
  Search,
  Trash2,
  UserRound,
  WalletCards,
  X,
  Eye,
  AlertCircle,
  Clock3,
  Banknote,
} from "lucide-react";

type PaymentStatus = "Paid" | "Pending" | "Overdue" | "Partial";

type PaymentMethod =
  | "Cash"
  | "UPI"
  | "Card"
  | "Bank Transfer"
  | "Insurance";

type Invoice = {
  id: string;
  patient: string;
  patientId: string;
  date: string;
  services: string[];
  amount: number;
  paidAmount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
};

const initialInvoices: Invoice[] = [
  {
    id: "INV-2026-001",
    patient: "Ananya Reddy",
    patientId: "PT-1024",
    date: "23 Sep 2026",
    services: ["Consultation", "Blood Test", "ECG"],
    amount: 2850,
    paidAmount: 2850,
    paymentMethod: "UPI",
    status: "Paid",
  },
  {
    id: "INV-2026-002",
    patient: "Rahul Kumar",
    patientId: "PT-1025",
    date: "23 Sep 2026",
    services: ["Cardiology Consultation", "ECG"],
    amount: 4200,
    paidAmount: 2000,
    paymentMethod: "Card",
    status: "Partial",
  },
  {
    id: "INV-2026-003",
    patient: "Priya Sharma",
    patientId: "PT-1026",
    date: "22 Sep 2026",
    services: ["General Consultation", "Pharmacy"],
    amount: 1850,
    paidAmount: 0,
    paymentMethod: "Cash",
    status: "Pending",
  },
  {
    id: "INV-2026-004",
    patient: "Vikram Singh",
    patientId: "PT-1027",
    date: "21 Sep 2026",
    services: ["MRI Scan", "Radiology Consultation"],
    amount: 7800,
    paidAmount: 0,
    paymentMethod: "Insurance",
    status: "Overdue",
  },
  {
    id: "INV-2026-005",
    patient: "Sneha Reddy",
    patientId: "PT-1028",
    date: "20 Sep 2026",
    services: ["Dental Consultation", "X-Ray"],
    amount: 3200,
    paidAmount: 3200,
    paymentMethod: "Card",
    status: "Paid",
  },
  {
    id: "INV-2026-006",
    patient: "Arjun Mehta",
    patientId: "PT-1029",
    date: "19 Sep 2026",
    services: ["Orthopedic Consultation", "X-Ray", "Medicines"],
    amount: 5100,
    paidAmount: 2500,
    paymentMethod: "Bank Transfer",
    status: "Partial",
  },
  {
    id: "INV-2026-007",
    patient: "Lakshmi Devi",
    patientId: "PT-1030",
    date: "18 Sep 2026",
    services: ["Neurology Consultation"],
    amount: 2500,
    paidAmount: 2500,
    paymentMethod: "UPI",
    status: "Paid",
  },
  {
    id: "INV-2026-008",
    patient: "Karthik Rao",
    patientId: "PT-1031",
    date: "17 Sep 2026",
    services: ["Emergency Consultation", "Medicines", "Lab Tests"],
    amount: 6400,
    paidAmount: 0,
    paymentMethod: "Cash",
    status: "Pending",
  },
];

const statusOptions = ["All Status", "Paid", "Pending", "Partial", "Overdue"];

const paymentOptions = [
  "All Methods",
  "Cash",
  "UPI",
  "Card",
  "Bank Transfer",
  "Insurance",
];

const formatCurrency = (amount: number) =>
  `₹${amount.toLocaleString("en-IN")}`;

const statusStyles: Record<PaymentStatus, string> = {
  Paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Partial: "bg-blue-50 text-blue-700 border-blue-200",
  Overdue: "bg-rose-50 text-rose-700 border-rose-200",
};

const statusDotStyles: Record<PaymentStatus, string> = {
  Paid: "bg-emerald-500",
  Pending: "bg-amber-500",
  Partial: "bg-blue-500",
  Overdue: "bg-rose-500",
};

function PaymentStatusIcon({ status }: { status: PaymentStatus }) {
  if (status === "Paid") {
    return <CheckCircle2 className="h-4 w-4" />;
  }

  if (status === "Pending") {
    return <Clock3 className="h-4 w-4" />;
  }

  if (status === "Partial") {
    return <CreditCard className="h-4 w-4" />;
  }

  return <AlertCircle className="h-4 w-4" />;
}

function MethodIcon({ method }: { method: PaymentMethod }) {
  if (method === "Cash") {
    return <Banknote className="h-4 w-4" />;
  }

  if (method === "UPI") {
    return <WalletCards className="h-4 w-4" />;
  }

  if (method === "Card") {
    return <CreditCard className="h-4 w-4" />;
  }

  if (method === "Insurance") {
    return <FileText className="h-4 w-4" />;
  }

  return <BadgeIndianRupee className="h-4 w-4" />;
}

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [paymentFilter, setPaymentFilter] = useState("All Methods");

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] =
    useState<Invoice | null>(null);
  const [invoiceToDelete, setInvoiceToDelete] =
    useState<Invoice | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const [newInvoice, setNewInvoice] = useState({
    patient: "",
    patientId: "",
    date: new Date().toISOString().split("T")[0],
    services: "",
    amount: "",
    paidAmount: "",
    paymentMethod: "Cash" as PaymentMethod,
    status: "Pending" as PaymentStatus,
  });

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        invoice.id.toLowerCase().includes(search) ||
        invoice.patient.toLowerCase().includes(search) ||
        invoice.patientId.toLowerCase().includes(search) ||
        invoice.services.some((service) =>
          service.toLowerCase().includes(search),
        );

      const matchesStatus =
        statusFilter === "All Status" ||
        invoice.status === statusFilter;

      const matchesPayment =
        paymentFilter === "All Methods" ||
        invoice.paymentMethod === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [invoices, searchTerm, statusFilter, paymentFilter]);

  const totalRevenue = useMemo(
    () => invoices.reduce((sum, invoice) => sum + invoice.amount, 0),
    [invoices],
  );

  const totalPaid = useMemo(
    () => invoices.reduce((sum, invoice) => sum + invoice.paidAmount, 0),
    [invoices],
  );

  const totalPending = useMemo(
    () =>
      invoices
        .filter(
          (invoice) =>
            invoice.status === "Pending" ||
            invoice.status === "Partial",
        )
        .reduce(
          (sum, invoice) => sum + (invoice.amount - invoice.paidAmount),
          0,
        ),
    [invoices],
  );

  const totalOutstanding = useMemo(
    () =>
      invoices
        .filter((invoice) => invoice.status === "Overdue")
        .reduce(
          (sum, invoice) => sum + (invoice.amount - invoice.paidAmount),
          0,
        ),
    [invoices],
  );

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("All Status");
    setPaymentFilter("All Methods");
  };

  const handleCreateInvoice = () => {
    if (
      !newInvoice.patient.trim() ||
      !newInvoice.patientId.trim() ||
      !newInvoice.services.trim() ||
      !newInvoice.amount
    ) {
      return;
    }

    const amount = Number(newInvoice.amount);
    const paidAmount = Number(newInvoice.paidAmount || 0);

    if (amount <= 0 || paidAmount < 0 || paidAmount > amount) {
      return;
    }

    const status: PaymentStatus =
      paidAmount === amount
        ? "Paid"
        : paidAmount > 0
          ? "Partial"
          : newInvoice.status;

    const formattedDate = new Date(
      `${newInvoice.date}T00:00:00`,
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const createdInvoice: Invoice = {
      id: `INV-2026-${String(invoices.length + 1).padStart(3, "0")}`,
      patient: newInvoice.patient.trim(),
      patientId: newInvoice.patientId.trim(),
      date: formattedDate,
      services: newInvoice.services
        .split(",")
        .map((service) => service.trim())
        .filter(Boolean),
      amount,
      paidAmount,
      paymentMethod: newInvoice.paymentMethod,
      status,
    };

    setInvoices((current) => [createdInvoice, ...current]);

    setNewInvoice({
      patient: "",
      patientId: "",
      date: new Date().toISOString().split("T")[0],
      services: "",
      amount: "",
      paidAmount: "",
      paymentMethod: "Cash",
      status: "Pending",
    });

    setShowAddModal(false);
  };

  const handleDeleteInvoice = () => {
    if (!invoiceToDelete) return;

    setInvoices((current) =>
      current.filter((invoice) => invoice.id !== invoiceToDelete.id),
    );

    if (selectedInvoice?.id === invoiceToDelete.id) {
      setSelectedInvoice(null);
    }

    setInvoiceToDelete(null);
    setOpenMenu(null);
  };

  const handleExport = () => {
    const headers = [
      "Invoice ID",
      "Patient",
      "Patient ID",
      "Date",
      "Services",
      "Amount",
      "Paid Amount",
      "Balance",
      "Payment Method",
      "Status",
    ];

    const rows = filteredInvoices.map((invoice) => [
      invoice.id,
      invoice.patient,
      invoice.patientId,
      invoice.date,
      invoice.services.join(" | "),
      invoice.amount,
      invoice.paidAmount,
      invoice.amount - invoice.paidAmount,
      invoice.paymentMethod,
      invoice.status,
    ]);

    const csv = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "medcore-billing-invoices.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const handleMenuAction = (
    action: "view" | "delete",
    invoice: Invoice,
  ) => {
    setOpenMenu(null);

    if (action === "view") {
      setSelectedInvoice(invoice);
    }

    if (action === "delete") {
      setInvoiceToDelete(invoice);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50/70">
      {/* Header */}
      <div className="border-b border-blue-100 bg-white">
        <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-200">
                <Receipt className="h-5 w-5 text-white" />
              </div>

              <div>
                <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <span>Operations</span>
                  <span>/</span>
                  <span className="text-blue-600">Billing</span>
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Billing
                </h1>

                <p className="mt-1 max-w-2xl text-sm text-slate-500">
                  Manage invoices, payments, insurance claims and
                  outstanding patient balances.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={handleExport}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50"
              >
                <ArrowDownToLine className="h-4 w-4" />
                Export
              </button>

              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200 transition hover:from-blue-700 hover:to-cyan-600"
              >
                <Plus className="h-4 w-4" />
                Add Invoice
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Revenue
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {formatCurrency(totalRevenue)}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <BadgeIndianRupee className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-3 flex items-center gap-1 text-xs font-medium text-blue-600">
              <ArrowDownToLine className="h-3.5 w-3.5 rotate-180" />
              All generated invoices
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Paid Bills
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {formatCurrency(totalPaid)}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-3 text-xs font-medium text-emerald-600">
              Successfully collected
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Pending Bills
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {formatCurrency(totalPending)}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Clock3 className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-3 text-xs font-medium text-amber-600">
              Awaiting payment
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Outstanding
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {formatCurrency(totalOutstanding)}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <AlertCircle className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-3 text-xs font-medium text-rose-600">
              Overdue balances
            </div>
          </motion.div>
        </div>

        {/* Main Card */}
        <div className="mt-6 overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm">
          {/* Card Header */}
          <div className="border-b border-blue-100 bg-gradient-to-r from-blue-50/80 via-white to-cyan-50/60 px-4 py-5 sm:px-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <FileText className="h-4 w-4" />
                  </div>

                  <h2 className="text-lg font-bold text-slate-900">
                    Invoices & Payments
                  </h2>
                </div>

                <p className="mt-1 pl-11 text-sm text-slate-500">
                  Track patient invoices, payment status and outstanding
                  balances.
                </p>
              </div>

              <div className="rounded-xl bg-blue-100/70 px-3 py-2 text-sm font-semibold text-blue-700">
                {filteredInvoices.length} invoice
                {filteredInvoices.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="border-b border-slate-100 p-4 sm:p-5">
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(260px,1fr)_180px_180px_auto]">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                  placeholder="Search invoice, patient or service..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
                />
              </div>

              {/* Status */}
              <div className="relative">
                <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-500" />

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value)
                  }
                  className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-blue-100 bg-blue-50/60 pl-10 pr-9 text-sm font-medium text-slate-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                >
                  {statusOptions.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>

              {/* Payment */}
              <div className="relative">
                <CreditCard className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-500" />

                <select
                  value={paymentFilter}
                  onChange={(event) =>
                    setPaymentFilter(event.target.value)
                  }
                  className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-cyan-100 bg-cyan-50/60 pl-10 pr-9 text-sm font-medium text-slate-700 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
                >
                  {paymentOptions.map((method) => (
                    <option key={method}>{method}</option>
                  ))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>

              {/* Reset */}
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                <RotateCcw className="h-4 w-4" />
                Reset Filters
              </button>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[1050px]">
              <thead>
                <tr className="border-b border-blue-100 bg-blue-50/70">
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-blue-700">
                    Invoice
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-blue-700">
                    Patient
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-blue-700">
                    Date
                  </th>

                  
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-blue-700">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-blue-700">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((invoice, index) => (
                    <motion.tr
                      key={invoice.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: index * 0.025,
                      }}
                      className="group transition hover:bg-blue-50/40"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <Receipt className="h-4 w-4" />
                          </div>

                          <div>
                            <p className="text-sm font-bold text-slate-800">
                              {invoice.id}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              {invoice.services.length} service
                              {invoice.services.length !== 1
                                ? "s"
                                : ""}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-50 text-cyan-600">
                            <UserRound className="h-4 w-4" />
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {invoice.patient}
                            </p>

                            <p className="text-xs text-slate-400">
                              {invoice.patientId}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <CalendarDays className="h-4 w-4 text-blue-500" />
                          {invoice.date}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-semibold ${statusStyles[invoice.status]}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${statusDotStyles[invoice.status]}`}
                          />
                          {invoice.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                        

                          <div className="relative">
                            <button
                              type="button"
                              onClick={() =>
                                setOpenMenu(
                                  openMenu === invoice.id
                                    ? null
                                    : invoice.id,
                                )
                              }
                              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                              title="More Actions"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>

                            {openMenu === invoice.id && (
                              <div className="absolute right-0 z-30 mt-2 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleMenuAction(
                                      "view",
                                      invoice,
                                    )
                                  }
                                  className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                                >
                                  <Eye className="h-4 w-4" />
                                  View Details
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleMenuAction(
                                      "delete",
                                      invoice,
                                    )
                                  }
                                  className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-600 hover:bg-rose-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8}>
                      <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
                          <Receipt className="h-7 w-7" />
                        </div>

                        <h3 className="mt-4 text-base font-bold text-slate-800">
                          No invoices found
                        </h3>

                        <p className="mt-1 max-w-sm text-sm text-slate-500">
                          Try changing your search or filters to find
                          billing records.
                        </p>

                        <button
                          type="button"
                          onClick={resetFilters}
                          className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                        >
                          <RotateCcw className="h-4 w-4" />
                          Reset Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile / Tablet Cards */}
          <div className="divide-y divide-slate-100 lg:hidden">
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="p-4 transition hover:bg-blue-50/30 sm:p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Receipt className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          {invoice.id}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          {invoice.date}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-semibold ${statusStyles[invoice.status]}`}
                    >
                      <PaymentStatusIcon status={invoice.status} />
                      {invoice.status}
                    </span>
                  </div>

                  <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-50 text-cyan-600">
                        <UserRound className="h-4 w-4" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {invoice.patient}
                        </p>
                        <p className="text-xs text-slate-400">
                          {invoice.patientId}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Amount
                        </p>
                        <p className="mt-1 text-sm font-bold text-slate-800">
                          {formatCurrency(invoice.amount)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Balance
                        </p>
                        <p className="mt-1 text-sm font-bold text-rose-600">
                          {formatCurrency(
                            invoice.amount - invoice.paidAmount,
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Services
                      </p>

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {invoice.services.map((service) => (
                          <span
                            key={service}
                            className="rounded-lg bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                        <MethodIcon method={invoice.paymentMethod} />
                        {invoice.paymentMethod}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleMenuAction("view", invoice)
                          }
                          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleMenuAction("delete", invoice)
                          }
                          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-rose-100 bg-rose-50 text-rose-600"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
                  <Receipt className="h-7 w-7" />
                </div>

                <h3 className="mt-4 text-base font-bold text-slate-800">
                  No invoices found
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Try changing your search or filters.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-3 sm:px-6">
            <div className="flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <span>
                Showing{" "}
                <strong className="text-slate-700">
                  {filteredInvoices.length}
                </strong>{" "}
                of{" "}
                <strong className="text-slate-700">
                  {invoices.length}
                </strong>{" "}
                invoices
              </span>

              <span className="flex items-center gap-1.5">
                <HeartPulse className="h-3.5 w-3.5 text-blue-500" />
                MedCore Hospital Billing
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Add Invoice Modal */}
     {/* Add Invoice Modal */}
<AnimatePresence>
  {showAddModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-3 backdrop-blur-sm sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        {/* Modal Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-600 to-cyan-500 px-5 py-4 text-white sm:px-6">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />
          <div className="absolute -bottom-16 right-20 h-32 w-32 rounded-full bg-cyan-300/10" />

          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 shadow-inner">
                <Receipt className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-bold sm:text-xl">
                  Create Invoice
                </h2>

                <p className="mt-0.5 text-xs text-blue-100 sm:text-sm">
                  Create a new patient billing record
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Patient Information */}
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <UserRound className="h-4 w-4" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-blue-800">
                    Patient Information
                  </h3>

                  <p className="text-[11px] text-blue-500">
                    Basic patient details
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-600">
                    Patient Name
                  </label>

                  <input
                    value={newInvoice.patient}
                    onChange={(event) =>
                      setNewInvoice((current) => ({
                        ...current,
                        patient: event.target.value,
                      }))
                    }
                    placeholder="Enter patient name"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-600">
                    Patient ID
                  </label>

                  <input
                    value={newInvoice.patientId}
                    onChange={(event) =>
                      setNewInvoice((current) => ({
                        ...current,
                        patientId: event.target.value,
                      }))
                    }
                    placeholder="e.g. PT-1032"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-600">
                    Invoice Date
                  </label>

                  <div className="relative">
                    <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-500" />

                    <input
                      type="date"
                      value={newInvoice.date}
                      onChange={(event) =>
                        setNewInvoice((current) => ({
                          ...current,
                          date: event.target.value,
                        }))
                      }
                      className="h-10 w-full cursor-pointer rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Billing Information */}
            <div className="rounded-2xl border border-cyan-100 bg-cyan-50/40 p-4">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600">
                  <BadgeIndianRupee className="h-4 w-4" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-cyan-800">
                    Billing Information
                  </h3>

                  <p className="text-[11px] text-cyan-600">
                    Payment and invoice details
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-600">
                    Services
                  </label>

                  <input
                    value={newInvoice.services}
                    onChange={(event) =>
                      setNewInvoice((current) => ({
                        ...current,
                        services: event.target.value,
                      }))
                    }
                    placeholder="Consultation, Blood Test, ECG"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
                  />

                  <p className="mt-1 text-[11px] text-slate-400">
                    Separate multiple services with commas
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-600">
                      Total Amount
                    </label>

                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                        ₹
                      </span>

                     <input
  type="text"
  inputMode="numeric"
  value={newInvoice.amount}
  onChange={(event) => {
    const amount = event.target.value.replace(/\D/g, "");

    setNewInvoice((current) => {
      const numericAmount = Number(amount || 0);
      const currentPaid = Number(current.paidAmount || 0);

      return {
        ...current,
        amount,
        paidAmount:
          currentPaid > numericAmount
            ? amount
            : current.paidAmount,
      };
    });
  }}
  placeholder="0"
  className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-8 pr-2 text-sm font-semibold text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
/>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-600">
                      Paid Amount
                    </label>

                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                        ₹
                      </span>

                     <input
  type="text"
  inputMode="numeric"
  value={newInvoice.paidAmount}
  onChange={(event) => {
    const paidAmount = event.target.value.replace(/\D/g, "");

    setNewInvoice((current) => {
      const totalAmount = Number(current.amount || 0);
      const numericPaidAmount = Number(paidAmount || 0);

      if (totalAmount <= 0) {
        return {
          ...current,
          paidAmount: "",
        };
      }

      return {
        ...current,
        paidAmount: String(
          Math.min(numericPaidAmount, totalAmount),
        ),
      };
    });
  }}
  placeholder="0"
  className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-8 pr-2 text-sm font-semibold text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
/>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-600">
                      Payment Method
                    </label>

                    <select
                      value={newInvoice.paymentMethod}
                      onChange={(event) =>
                        setNewInvoice((current) => ({
                          ...current,
                          paymentMethod:
                            event.target.value as PaymentMethod,
                        }))
                      }
                      className="h-10 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50 sm:px-3 sm:text-sm"
                    >
                      {paymentOptions
                        .filter(
                          (option) => option !== "All Methods",
                        )
                        .map((method) => (
                          <option key={method}>{method}</option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-600">
                      Status
                    </label>

                    <select
                      value={newInvoice.status}
                      onChange={(event) =>
                        setNewInvoice((current) => ({
                          ...current,
                          status:
                            event.target.value as PaymentStatus,
                        }))
                      }
                      className="h-10 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50 sm:px-3 sm:text-sm"
                    >
                      <option>Pending</option>
                      <option>Overdue</option>
                      <option>Partial</option>
                      <option>Paid</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Amount Preview */}
          <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                <WalletCards className="h-4 w-4" />
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Payment Summary
                </p>

                <p className="text-sm font-bold text-slate-800">
                  Balance Due
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-lg font-bold text-blue-700">
                {formatCurrency(
                  Math.max(
                    0,
                    Number(newInvoice.amount || 0) -
                      Number(newInvoice.paidAmount || 0),
                  ),
                )}
              </p>

              <p className="text-[11px] text-slate-400">
                Remaining amount
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleCreateInvoice}
              className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 text-sm font-semibold text-white shadow-md shadow-blue-100 transition hover:from-blue-700 hover:to-cyan-600"
            >
              <Plus className="h-4 w-4" />
              Create Invoice
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>
      {/* Invoice Details Modal */}
      <AnimatePresence>
        {selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-5 text-white sm:px-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-blue-100">
                      <Receipt className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase tracking-wider">
                        Invoice Details
                      </span>
                    </div>

                    <h2 className="mt-1 text-xl font-bold">
                      {selectedInvoice.id}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedInvoice(null)}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-white/10 hover:bg-white/20"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-blue-500">
                      Patient
                    </p>

                    <p className="mt-2 text-base font-bold text-slate-800">
                      {selectedInvoice.patient}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {selectedInvoice.patientId}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-cyan-100 bg-cyan-50/60 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-cyan-600">
                      Invoice Date
                    </p>

                    <p className="mt-2 text-base font-bold text-slate-800">
                      {selectedInvoice.date}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Services
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedInvoice.services.map((service) => (
                      <span
                        key={service}
                        className="rounded-xl bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-medium text-slate-400">
                      Total
                    </p>
                    <p className="mt-1 text-lg font-bold text-slate-800">
                      {formatCurrency(selectedInvoice.amount)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-emerald-50 p-4">
                    <p className="text-xs font-medium text-emerald-600">
                      Paid
                    </p>
                    <p className="mt-1 text-lg font-bold text-emerald-700">
                      {formatCurrency(selectedInvoice.paidAmount)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-rose-50 p-4">
                    <p className="text-xs font-medium text-rose-600">
                      Balance
                    </p>
                    <p className="mt-1 text-lg font-bold text-rose-700">
                      {formatCurrency(
                        selectedInvoice.amount -
                          selectedInvoice.paidAmount,
                      )}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${statusStyles[selectedInvoice.status]}`}
                  >
                    <PaymentStatusIcon
                      status={selectedInvoice.status}
                    />
                    {selectedInvoice.status}
                  </span>

                  <span className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700">
                    <MethodIcon
                      method={selectedInvoice.paymentMethod}
                    />
                    {selectedInvoice.paymentMethod}
                  </span>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedInvoice(null)}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-50 px-5 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {invoiceToDelete && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                <Trash2 className="h-6 w-6" />
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-900">
                Delete Invoice?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Are you sure you want to delete{" "}
                <strong className="text-slate-700">
                  {invoiceToDelete.id}
                </strong>{" "}
                for{" "}
                <strong className="text-slate-700">
                  {invoiceToDelete.patient}
                </strong>
                ? This action cannot be undone.
              </p>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setInvoiceToDelete(null)}
                  className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDeleteInvoice}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-rose-100 hover:bg-rose-600"
                >
                  <Trash2 className="h-4 w-4" />
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}