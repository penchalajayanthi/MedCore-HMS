"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  ChevronDown,
  Edit3,
  Eye,
  Filter,
  HeartPulse,
  Hospital,
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
  Stethoscope,
  Trash2,
  Users,
  X,
} from "lucide-react";

type DepartmentStatus = "Active" | "Inactive";

type Department = {
  id: number;
  name: string;
  code: string;
  head: string;
  specialty: string;
  doctors: number;
  staff: number;
  patients: number;
  floor: string;
  contact: string;
  status: DepartmentStatus;
  description: string;
};

const initialDepartments: Department[] = [
  {
    id: 1,
    name: "Cardiology",
    code: "CARD",
    head: "Dr. Sarah Wilson",
    specialty: "Heart & Cardiovascular Care",
    doctors: 6,
    staff: 18,
    patients: 324,
    floor: "3rd Floor",
    contact: "+91 98765 43210",
    status: "Active",
    description:
      "Specialized care for heart and cardiovascular conditions including diagnosis, treatment, monitoring, and rehabilitation.",
  },
  {
    id: 2,
    name: "Neurology",
    code: "NEUR",
    head: "Dr. Michael Brown",
    specialty: "Brain & Nervous System",
    doctors: 4,
    staff: 12,
    patients: 186,
    floor: "4th Floor",
    contact: "+91 98765 43211",
    status: "Active",
    description:
      "Comprehensive diagnosis and treatment of neurological disorders affecting the brain, spinal cord, and nervous system.",
  },
  {
    id: 3,
    name: "Orthopedics",
    code: "ORTH",
    head: "Dr. James Anderson",
    specialty: "Bones & Musculoskeletal",
    doctors: 5,
    staff: 15,
    patients: 241,
    floor: "2nd Floor",
    contact: "+91 98765 43212",
    status: "Active",
    description:
      "Treatment of bone, joint, muscle, ligament, and other musculoskeletal conditions.",
  },
  {
    id: 4,
    name: "Pediatrics",
    code: "PEDI",
    head: "Dr. Emily Davis",
    specialty: "Child Healthcare",
    doctors: 4,
    staff: 14,
    patients: 198,
    floor: "1st Floor",
    contact: "+91 98765 43213",
    status: "Active",
    description:
      "Dedicated healthcare services for infants, children, and adolescents.",
  },
  {
    id: 5,
    name: "General Medicine",
    code: "GMED",
    head: "Dr. Robert Taylor",
    specialty: "General Healthcare",
    doctors: 7,
    staff: 21,
    patients: 452,
    floor: "Ground Floor",
    contact: "+91 98765 43214",
    status: "Active",
    description:
      "Primary and comprehensive medical care for adults with a wide range of health conditions.",
  },
  {
    id: 6,
    name: "Dermatology",
    code: "DERM",
    head: "Dr. Olivia Martin",
    specialty: "Skin & Hair Care",
    doctors: 3,
    staff: 8,
    patients: 126,
    floor: "5th Floor",
    contact: "+91 98765 43215",
    status: "Active",
    description:
      "Diagnosis and treatment of skin, hair, nail, and cosmetic dermatological conditions.",
  },
  {
    id: 7,
    name: "Emergency Medicine",
    code: "EMER",
    head: "Dr. Daniel Thomas",
    specialty: "Emergency & Critical Care",
    doctors: 8,
    staff: 26,
    patients: 387,
    floor: "Ground Floor",
    contact: "+91 98765 43216",
    status: "Active",
    description:
      "24/7 emergency medical services for urgent injuries, illnesses, and critical conditions.",
  },
  {
    id: 8,
    name: "ENT",
    code: "ENT",
    head: "Dr. Sophia Johnson",
    specialty: "Ear, Nose & Throat",
    doctors: 2,
    staff: 6,
    patients: 94,
    floor: "5th Floor",
    contact: "+91 98765 43217",
    status: "Inactive",
    description:
      "Medical and surgical treatment of ear, nose, throat, and related head and neck conditions.",
  },
];

const emptyDepartment: Omit<Department, "id"> = {
  name: "",
  code: "",
  head: "",
  specialty: "",
  doctors: 0,
  staff: 0,
  patients: 0,
  floor: "",
  contact: "",
  status: "Active",
  description: "",
};

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-IN").format(value);

export default function DepartmentsPage() {
  const [departments, setDepartments] =
    useState<Department[]>(initialDepartments);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | DepartmentStatus>(
    "All",
  );
 const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);

  const [editingDepartment, setEditingDepartment] =
    useState<Department | null>(null);

  const [departmentToDelete, setDepartmentToDelete] =
    useState<Department | null>(null);

  const [newDepartment, setNewDepartment] =
    useState<Omit<Department, "id">>(emptyDepartment);

  const filteredDepartments = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return departments.filter((department) => {
      const matchesSearch =
        !query ||
        department.name.toLowerCase().includes(query) ||
        department.code.toLowerCase().includes(query) ||
        department.head.toLowerCase().includes(query) ||
        department.specialty.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || department.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [departments, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const activeDepartments = departments.filter(
      (department) => department.status === "Active",
    );

    return {
      total: departments.length,
      active: activeDepartments.length,
      doctors: departments.reduce(
        (total, department) => total + department.doctors,
        0,
      ),
      staff: departments.reduce(
        (total, department) => total + department.staff,
        0,
      ),
    };
  }, [departments]);

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
  };

  const openAddModal = () => {
    setEditingDepartment(null);
    setNewDepartment(emptyDepartment);
    setShowAddModal(true);
  };

  const openEditModal = (department: Department) => {
    setEditingDepartment(department);

    setNewDepartment({
      name: department.name,
      code: department.code,
      head: department.head,
      specialty: department.specialty,
      doctors: department.doctors,
      staff: department.staff,
      patients: department.patients,
      floor: department.floor,
      contact: department.contact,
      status: department.status,
      description: department.description,
    });

    setShowAddModal(true);
  };

  const handleSaveDepartment = () => {
    if (
      !newDepartment.name.trim() ||
      !newDepartment.code.trim() ||
      !newDepartment.head.trim() ||
      !newDepartment.specialty.trim()
    ) {
      return;
    }

    if (editingDepartment) {
      setDepartments((current) =>
        current.map((department) =>
          department.id === editingDepartment.id
            ? {
                ...department,
                ...newDepartment,
                name: newDepartment.name.trim(),
                code: newDepartment.code.trim().toUpperCase(),
                head: newDepartment.head.trim(),
                specialty: newDepartment.specialty.trim(),
              }
            : department,
        ),
      );
    } else {
      const newId =
        departments.length > 0
          ? Math.max(...departments.map((department) => department.id)) + 1
          : 1;

      setDepartments((current) => [
        {
          id: newId,
          ...newDepartment,
          name: newDepartment.name.trim(),
          code: newDepartment.code.trim().toUpperCase(),
          head: newDepartment.head.trim(),
          specialty: newDepartment.specialty.trim(),
        },
        ...current,
      ]);
    }

    setShowAddModal(false);
    setEditingDepartment(null);
    setNewDepartment(emptyDepartment);
  };

  const openDetails = (department: Department) => {
    setSelectedDepartment(department);
    setShowDetailsModal(true);
  };

  const openDeleteModal = (department: Department) => {
    setDepartmentToDelete(department);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!departmentToDelete) return;

    setDepartments((current) =>
      current.filter(
        (department) => department.id !== departmentToDelete.id,
      ),
    );

    if (selectedDepartment?.id === departmentToDelete.id) {
      setSelectedDepartment(null);
      setShowDetailsModal(false);
    }

    setDepartmentToDelete(null);
    setShowDeleteModal(false);
  };

  const handleExport = () => {
    const headers = [
      "Department",
      "Code",
      "Department Head",
      "Specialty",
      "Doctors",
      "Staff",
      "Patients",
      "Floor",
      "Contact",
      "Status",
    ];

    const rows = filteredDepartments.map((department) => [
      department.name,
      department.code,
      department.head,
      department.specialty,
      department.doctors,
      department.staff,
      department.patients,
      department.floor,
      department.contact,
      department.status,
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
    link.download = "medcore-departments.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const updateField = <K extends keyof Omit<Department, "id">>(
    field: K,
    value: Omit<Department, "id">[K],
  ) => {
    setNewDepartment((current) => ({
      ...current,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-full bg-blue-50/60 p-3 sm:p-4 lg:p-6">
      <div className="mx-auto max-w-[1600px] space-y-5">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl border border-cyan-100 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 shadow-sm"
        >
          <div className="relative p-5 sm:p-6 lg:p-7">
            <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full bg-white/10" />
            <div className="absolute -bottom-20 right-24 h-48 w-48 rounded-full bg-white/5" />

            <div className="relative flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20 backdrop-blur">
                  <Building2 className="h-7 w-7" />
                </div>

                <div>
                  <div className="mb-1 flex flex-wrap items-center gap-2 text-xs font-medium text-cyan-100">
                    <span>Operations</span>
                    <span>/</span>
                    <span>Departments</span>
                  </div>

                  <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    Departments
                  </h1>

                  <p className="mt-1 max-w-2xl text-sm leading-6 text-blue-50">
                    Manage hospital departments, department heads, medical
                    teams, staff, and patient capacity from one place.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={openAddModal}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-blue-700 shadow-lg shadow-blue-900/10 transition hover:-translate-y-0.5 hover:bg-blue-50 sm:w-auto"
              >
                <Plus className="h-4 w-4" />
                Add Department
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Total Departments",
              value: stats.total,
              icon: Building2,
              description: "Registered departments",
              iconClass: "bg-blue-50 text-blue-600",
            },
            {
              label: "Active Departments",
              value: stats.active,
              icon: CheckCircle2,
              description: "Currently operational",
              iconClass: "bg-emerald-50 text-emerald-600",
            },
            {
              label: "Doctors",
              value: stats.doctors,
              icon: Stethoscope,
              description: "Across departments",
              iconClass: "bg-cyan-50 text-cyan-600",
            },
            {
              label: "Staff Members",
              value: stats.staff,
              icon: Users,
              description: "Department staff",
              iconClass: "bg-violet-50 text-violet-600",
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
                      {formatNumber(stat.value)}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {stat.description}
                    </p>
                  </div>

                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${stat.iconClass}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  Updated today
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm"
        >
          {/* Card Header */}
          <div className="border-b border-blue-100 bg-gradient-to-r from-blue-50/90 via-white to-cyan-50/70 p-4 sm:p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <Hospital className="h-4 w-4" />
                  </div>

                  <h2 className="text-lg font-bold text-slate-800">
                    Department Directory
                  </h2>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  View and manage all hospital departments.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleExport}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-50"
                >
                  <ArrowUpRight className="h-4 w-4" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="border-b border-slate-100 p-4 sm:p-5">
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_220px_auto]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search department, code, head or specialty..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-50"
                />
              </div>

              <div className="relative">
                <Filter className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value as "All" | DepartmentStatus,
                    )
                  }
                  className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-9 text-sm font-medium text-slate-700 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-50"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>

                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>

              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                <X className="h-4 w-4" />
                Reset Filters
              </button>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-xs text-slate-500">
                Showing{" "}
                <span className="font-bold text-slate-700">
                  {filteredDepartments.length}
                </span>{" "}
                of{" "}
                <span className="font-bold text-slate-700">
                  {departments.length}
                </span>{" "}
                departments
              </p>

              <div className="hidden items-center gap-1.5 text-xs text-slate-400 sm:flex">
                <Activity className="h-3.5 w-3.5 text-cyan-500" />
                Live department overview
              </div>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[1050px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Department
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Department Head
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Team
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Patients
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredDepartments.length > 0 ? (
                  filteredDepartments.map((department) => (
                    <motion.tr
                      layout
                      key={department.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-slate-100 transition hover:bg-blue-50/40"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-100 text-blue-600">
                            <Building2 className="h-5 w-5" />
                          </div>

                          <div className="min-w-0">
                            <button
  type="button"
  onClick={() => router.push(`/departments/${department.id}`)}
  className="cursor-pointer text-left font-bold text-slate-800 transition hover:text-blue-600"
>
  {department.name}
</button>

                            <div className="mt-0.5 flex items-center gap-2">
                              <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-600">
                                {department.code}
                              </span>

                              <span className="truncate text-xs text-slate-400">
                                {department.specialty}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-50 text-cyan-600">
                            <Stethoscope className="h-4 w-4" />
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-slate-700">
                              {department.head}
                            </p>
                            <p className="text-xs text-slate-400">
                              Department Head
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-sm font-bold text-slate-700">
                              {department.doctors}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              Doctors
                            </p>
                          </div>

                          <div className="h-7 w-px bg-slate-200" />

                          <div>
                            <p className="text-sm font-bold text-slate-700">
                              {department.staff}
                            </p>
                            <p className="text-[11px] text-slate-400">Staff</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-blue-500" />

                          <div>
                            <p className="text-sm font-bold text-slate-700">
                              {formatNumber(department.patients)}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              Patients
                            </p>
                          </div>
                        </div>
                      </td>

                    

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                            department.status === "Active"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              department.status === "Active"
                                ? "bg-emerald-500"
                                : "bg-slate-400"
                            }`}
                          />
                          {department.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openDetails(department)}
                            title="View Department"
                            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600 transition hover:border-blue-200 hover:bg-blue-100"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditModal(department)}
                            title="Edit Department"
                            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-cyan-100 bg-cyan-50 text-cyan-600 transition hover:border-cyan-200 hover:bg-cyan-100"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => openDeleteModal(department)}
                            title="Delete Department"
                            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-rose-100 bg-rose-50 text-rose-500 transition hover:border-rose-200 hover:bg-rose-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-16 text-center"
                    >
                      <div className="mx-auto flex max-w-sm flex-col items-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
                          <Search className="h-6 w-6" />
                        </div>

                        <h3 className="mt-4 font-bold text-slate-700">
                          No departments found
                        </h3>

                        <p className="mt-1 text-sm text-slate-400">
                          Try changing your search or status filter.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile / Tablet Cards */}
          <div className="space-y-3 p-4 lg:hidden">
            {filteredDepartments.length > 0 ? (
              filteredDepartments.map((department) => (
                <motion.div
                  layout
                  key={department.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                        <Building2 className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate font-bold text-slate-800">
                            {department.name}
                          </h3>

                          <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-600">
                            {department.code}
                          </span>
                        </div>

                        <p className="mt-1 truncate text-xs text-slate-400">
                          {department.specialty}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        department.status === "Active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {department.status}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Doctors
                      </p>
                      <p className="mt-1 font-bold text-slate-700">
                        {department.doctors}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Staff
                      </p>
                      <p className="mt-1 font-bold text-slate-700">
                        {department.staff}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Patients
                      </p>
                      <p className="mt-1 font-bold text-slate-700">
                        {formatNumber(department.patients)}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Floor
                      </p>
                      <p className="mt-1 truncate font-bold text-slate-700">
                        {department.floor}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl bg-cyan-50/60 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-cyan-600">
                      Department Head
                    </p>

                    <div className="mt-1 flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-cyan-600" />
                      <p className="text-sm font-semibold text-slate-700">
                        {department.head}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openDetails(department)}
                      className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2.5 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() => openEditModal(department)}
                      className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-cyan-100 bg-cyan-50 px-3 py-2.5 text-xs font-bold text-cyan-700 transition hover:bg-cyan-100"
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => openDeleteModal(department)}
                      className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-rose-100 bg-rose-50 text-rose-500 transition hover:bg-rose-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
                  <Search className="h-6 w-6" />
                </div>

                <h3 className="mt-4 font-bold text-slate-700">
                  No departments found
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Try changing your search or status filter.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Add / Edit Department Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-3 backdrop-blur-sm sm:p-5"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setShowAddModal(false);
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              className="w-full max-w-4xl overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-2xl"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20">
                      <Building2 className="h-5 w-5" />
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-white sm:text-xl">
                        {editingDepartment
                          ? "Edit Department"
                          : "Add Department"}
                      </h2>

                      <p className="mt-0.5 text-xs text-blue-50">
                        {editingDepartment
                          ? "Update department information"
                          : "Create a new hospital department"}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  {/* Department Information */}
                  <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                        <Building2 className="h-4 w-4" />
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-slate-800">
                          Department Information
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          Basic department details
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-blue-700">
                          Department Name
                        </label>

                        <input
                          type="text"
                          value={newDepartment.name}
                          onChange={(event) =>
                            updateField("name", event.target.value)
                          }
                          placeholder="e.g. Cardiology"
                          className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="mb-1.5 block text-xs font-bold text-blue-700">
                            Department Code
                          </label>

                          <input
                            type="text"
                            value={newDepartment.code}
                            onChange={(event) =>
                              updateField(
                                "code",
                                event.target.value.toUpperCase(),
                              )
                            }
                            placeholder="CARD"
                            maxLength={8}
                            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold uppercase text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
                          />
                        </div>

                        <div>
                          <label className="mb-1.5 block text-xs font-bold text-blue-700">
                            Floor
                          </label>

                          <input
                            type="text"
                            value={newDepartment.floor}
                            onChange={(event) =>
                              updateField("floor", event.target.value)
                            }
                            placeholder="3rd Floor"
                            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-blue-700">
                          Specialty
                        </label>

                        <input
                          type="text"
                          value={newDepartment.specialty}
                          onChange={(event) =>
                            updateField("specialty", event.target.value)
                          }
                          placeholder="e.g. Heart & Cardiovascular Care"
                          className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-blue-700">
                          Department Head
                        </label>

                        <input
                          type="text"
                          value={newDepartment.head}
                          onChange={(event) =>
                            updateField("head", event.target.value)
                          }
                          placeholder="Dr. Doctor Name"
                          className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-blue-700">
                          Contact Number
                        </label>

                        <input
                          type="text"
                          inputMode="numeric"
                          value={newDepartment.contact}
                          onChange={(event) => {
                            const value = event.target.value.replace(
                              /[^0-9+ ]/g,
                              "",
                            );

                            updateField("contact", value);
                          }}
                          placeholder="+91 98765 43210"
                          className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Team Information */}
                  <div className="rounded-2xl border border-cyan-100 bg-cyan-50/40 p-4">
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600">
                        <Users className="h-4 w-4" />
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-slate-800">
                          Department Capacity
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          Team and patient information
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-cyan-700">
                          Doctors
                        </label>

                        <input
                          type="text"
                          inputMode="numeric"
                          value={newDepartment.doctors || ""}
                          onChange={(event) => {
                            const value = event.target.value.replace(
                              /\D/g,
                              "",
                            );

                            updateField("doctors", Number(value || 0));
                          }}
                          placeholder="0"
                          className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-cyan-700">
                          Staff
                        </label>

                        <input
                          type="text"
                          inputMode="numeric"
                          value={newDepartment.staff || ""}
                          onChange={(event) => {
                            const value = event.target.value.replace(
                              /\D/g,
                              "",
                            );

                            updateField("staff", Number(value || 0));
                          }}
                          placeholder="0"
                          className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-cyan-700">
                          Patients
                        </label>

                        <input
                          type="text"
                          inputMode="numeric"
                          value={newDepartment.patients || ""}
                          onChange={(event) => {
                            const value = event.target.value.replace(
                              /\D/g,
                              "",
                            );

                            updateField("patients", Number(value || 0));
                          }}
                          placeholder="0"
                          className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="mb-1.5 block text-xs font-bold text-cyan-700">
                        Status
                      </label>

                      <select
                        value={newDepartment.status}
                        onChange={(event) =>
                          updateField(
                            "status",
                            event.target.value as DepartmentStatus,
                          )
                        }
                        className="h-10 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>

                    <div className="mt-3">
                      <label className="mb-1.5 block text-xs font-bold text-cyan-700">
                        Description
                      </label>

                      <textarea
                        value={newDepartment.description}
                        onChange={(event) =>
                          updateField("description", event.target.value)
                        }
                        placeholder="Describe the department and its services..."
                        rows={5}
                        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
                      />
                    </div>

                    <div className="mt-3 rounded-xl border border-cyan-100 bg-white p-3">
                      <div className="flex items-start gap-2">
                        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan-600" />

                        <p className="text-xs leading-5 text-slate-500">
                          Department information can be updated anytime from
                          the department directory.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="cursor-pointer rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveDepartment}
                    disabled={
                      !newDepartment.name.trim() ||
                      !newDepartment.code.trim() ||
                      !newDepartment.head.trim() ||
                      !newDepartment.specialty.trim()
                    }
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {editingDepartment ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Update Department
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Create Department
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedDepartment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setShowDetailsModal(false);
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              className="w-full max-w-2xl overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-2xl"
            >
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white">
                      <Building2 className="h-6 w-6" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-white">
                          {selectedDepartment.name}
                        </h2>

                        <span className="rounded-md bg-white/15 px-2 py-1 text-[10px] font-bold text-white">
                          {selectedDepartment.code}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-blue-50">
                        {selectedDepartment.specialty}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowDetailsModal(false)}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    {
                      label: "Doctors",
                      value: selectedDepartment.doctors,
                      icon: Stethoscope,
                    },
                    {
                      label: "Staff",
                      value: selectedDepartment.staff,
                      icon: Users,
                    },
                    {
                      label: "Patients",
                      value: selectedDepartment.patients,
                      icon: HeartPulse,
                    },
                    {
                      label: "Status",
                      value: selectedDepartment.status,
                      icon: CheckCircle2,
                    },
                  ].map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.label}
                        className="rounded-2xl border border-slate-100 bg-slate-50 p-3"
                      >
                        <Icon className="h-4 w-4 text-blue-600" />

                        <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          {item.label}
                        </p>

                        <p className="mt-1 truncate text-sm font-bold text-slate-700">
                          {typeof item.value === "number"
                            ? formatNumber(item.value)
                            : item.value}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                      Department Head
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-blue-600" />

                      <p className="text-sm font-bold text-slate-700">
                        {selectedDepartment.head}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-cyan-100 bg-cyan-50/60 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-cyan-600">
                      Location
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-cyan-600" />

                      <p className="text-sm font-bold text-slate-700">
                        {selectedDepartment.floor}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Contact
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {selectedDepartment.contact}
                  </p>
                </div>

                <div className="mt-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Description
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {selectedDepartment.description ||
                      "No description available for this department."}
                  </p>
                </div>

                <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setShowDetailsModal(false)}
                    className="cursor-pointer rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    Close
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowDetailsModal(false);
                      openEditModal(selectedDepartment);
                    }}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit Department
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && departmentToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.97 }}
              className="w-full max-w-md rounded-3xl border border-rose-100 bg-white p-5 shadow-2xl sm:p-6"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
                  <Trash2 className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-800">
                    Delete Department?
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Are you sure you want to delete{" "}
                    <span className="font-bold text-slate-700">
                      {departmentToDelete.name}
                    </span>
                    ? This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-rose-100 bg-rose-50/60 p-3">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-rose-500" />

                  <p className="text-sm font-bold text-slate-700">
                    {departmentToDelete.name}
                  </p>

                  <span className="rounded-md bg-white px-1.5 py-0.5 text-[10px] font-bold text-rose-500">
                    {departmentToDelete.code}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setDepartmentToDelete(null);
                    setShowDeleteModal(false);
                  }}
                  className="cursor-pointer rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={confirmDelete}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-rose-600"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Department
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}