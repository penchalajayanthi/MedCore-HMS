"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  HeartPulse,
  Mail,
  MapPin,
  Phone,
  Stethoscope,
  Users,
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

type Doctor = {
  id: number;
  name: string;
  specialization: string;
  department: string;
  qualification: string;
  experience: string;
  fee: number;
  email: string;
  phone: string;
  room: string;
  workingHours: string;
  status: string;
};

const departments: Department[] = [
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

/*
 * IMPORTANT:
 * Keep this Doctor structure synchronized with your existing
 * Doctors page data.
 *
 * The department field is what connects a doctor to a department.
 */
const doctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. Sarah Wilson",
    specialization: "Cardiologist",
    department: "Cardiology",
    qualification: "MD Cardiology",
    experience: "12 years",
    fee: 800,
    email: "sarah.wilson@medcore.com",
    phone: "+91 98765 10001",
    room: "301",
    workingHours: "09:00 AM - 02:00 PM",
    status: "Active",
  },
  {
    id: 2,
    name: "Dr. Michael Brown",
    specialization: "Cardiologist",
    department: "Cardiology",
    qualification: "MBBS, MD",
    experience: "10 years",
    fee: 750,
    email: "michael.brown@medcore.com",
    phone: "+91 98765 10002",
    room: "302",
    workingHours: "10:00 AM - 04:00 PM",
    status: "Active",
  },
  {
    id: 3,
    name: "Dr. Emily Johnson",
    specialization: "Cardiologist",
    department: "Cardiology",
    qualification: "MBBS, DM Cardiology",
    experience: "8 years",
    fee: 900,
    email: "emily.johnson@medcore.com",
    phone: "+91 98765 10003",
    room: "303",
    workingHours: "11:00 AM - 05:00 PM",
    status: "Active",
  },
  {
    id: 4,
    name: "Dr. James Anderson",
    specialization: "Orthopedic Surgeon",
    department: "Orthopedics",
    qualification: "MBBS, MS Orthopedics",
    experience: "14 years",
    fee: 900,
    email: "james.anderson@medcore.com",
    phone: "+91 98765 10004",
    room: "201",
    workingHours: "09:00 AM - 03:00 PM",
    status: "Active",
  },
  {
    id: 5,
    name: "Dr. Robert Taylor",
    specialization: "General Physician",
    department: "General Medicine",
    qualification: "MBBS, MD",
    experience: "11 years",
    fee: 600,
    email: "robert.taylor@medcore.com",
    phone: "+91 98765 10005",
    room: "101",
    workingHours: "09:00 AM - 01:00 PM",
    status: "Active",
  },
  {
    id: 6,
    name: "Dr. Michael Brown",
    specialization: "Neurologist",
    department: "Neurology",
    qualification: "MBBS, DM Neurology",
    experience: "13 years",
    fee: 1000,
    email: "michael.neuro@medcore.com",
    phone: "+91 98765 10006",
    room: "401",
    workingHours: "10:00 AM - 03:00 PM",
    status: "Active",
  },
];

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-IN").format(value);

export default function DepartmentDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const departmentId = Number(params.departmentId);

  const department = departments.find(
    (item) => item.id === departmentId,
  );

  const departmentDoctors = useMemo(() => {
    if (!department) return [];

    return doctors.filter(
      (doctor) =>
        doctor.department.toLowerCase() ===
        department.name.toLowerCase(),
    );
  }, [department]);

  if (!department) {
    return (
      <div className="min-h-full bg-blue-50/60 p-4 sm:p-6">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
          <div className="w-full rounded-3xl border border-blue-100 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Building2 className="h-7 w-7" />
            </div>

            <h1 className="mt-5 text-xl font-bold text-slate-800">
              Department Not Found
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              The department you are looking for does not exist.
            </p>

            <button
              type="button"
              onClick={() => router.push("/departments")}
              className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Departments
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-blue-50/60 p-3 sm:p-4 lg:p-6">
      <div className="mx-auto max-w-[1600px] space-y-5">
        {/* Back */}
        <button
          type="button"
          onClick={() => router.push("/departments")}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-blue-100 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Departments
        </button>

        {/* Department Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl border border-cyan-100 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 shadow-sm"
        >
          <div className="relative p-5 sm:p-6 lg:p-7">
            <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-white/10" />
            <div className="absolute -bottom-24 right-32 h-56 w-56 rounded-full bg-white/5" />

            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20">
                  <Building2 className="h-8 w-8" />
                </div>

                <div>
                  <div className="mb-1 flex flex-wrap items-center gap-2 text-xs font-medium text-cyan-100">
                    <span>Departments</span>
                    <span>/</span>
                    <span>{department.name}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl font-bold text-white sm:text-3xl">
                      {department.name}
                    </h1>

                    <span className="rounded-lg bg-white/15 px-2.5 py-1 text-xs font-bold text-white ring-1 ring-white/10">
                      {department.code}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        department.status === "Active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {department.status}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-blue-50">
                    {department.specialty}
                  </p>

                  <p className="mt-1 max-w-3xl text-sm leading-6 text-blue-100">
                    {department.description}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 p-4 text-white ring-1 ring-white/10 backdrop-blur">
                <p className="text-xs font-medium text-blue-100">
                  Department Head
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  <p className="font-bold">{department.head}</p>
                </div>

                <div className="mt-2 flex items-center gap-2 text-xs text-blue-100">
                  <MapPin className="h-3.5 w-3.5" />
                  {department.floor}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            {
              label: "Doctors",
              value: department.doctors,
              icon: Stethoscope,
              iconClass: "bg-blue-50 text-blue-600",
            },
            {
              label: "Staff",
              value: department.staff,
              icon: Users,
              iconClass: "bg-cyan-50 text-cyan-600",
            },
            {
              label: "Patients",
              value: department.patients,
              icon: HeartPulse,
              iconClass: "bg-rose-50 text-rose-500",
            },
            {
              label: "Status",
              value: department.status,
              icon: CheckCircle2,
              iconClass: "bg-emerald-50 text-emerald-600",
            },
          ].map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {stat.label}
                    </p>

                    <p className="mt-2 text-xl font-bold text-slate-800 sm:text-2xl">
                      {typeof stat.value === "number"
                        ? formatNumber(stat.value)
                        : stat.value}
                    </p>
                  </div>

                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconClass}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Doctors */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm"
        >
          <div className="border-b border-blue-100 bg-gradient-to-r from-blue-50 via-white to-cyan-50 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <Stethoscope className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-800">
                    Department Doctors
                  </h2>
                  <p className="text-xs text-slate-500">
                    Doctors assigned to {department.name}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push("/doctors")}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
              >
                View All Doctors
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-5">
            {departmentDoctors.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                {departmentDoctors.map((doctor) => (
                  <motion.div
                    key={doctor.id}
                    whileHover={{ y: -2 }}
                    className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition hover:border-blue-200 hover:bg-blue-50/30"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                          <Stethoscope className="h-5 w-5" />
                        </div>

                        <div>
                          <h3 className="font-bold text-slate-800">
                            {doctor.name}
                          </h3>

                          <p className="text-xs font-medium text-blue-600">
                            {doctor.specialization}
                          </p>
                        </div>
                      </div>

                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                        {doctor.status}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      <div className="rounded-xl bg-white p-2.5">
                        <p className="text-[10px] font-bold uppercase text-slate-400">
                          Experience
                        </p>
                        <p className="mt-1 text-xs font-bold text-slate-700">
                          {doctor.experience}
                        </p>
                      </div>

                      <div className="rounded-xl bg-white p-2.5">
                        <p className="text-[10px] font-bold uppercase text-slate-400">
                          Room
                        </p>
                        <p className="mt-1 text-xs font-bold text-slate-700">
                          {doctor.room}
                        </p>
                      </div>

                      <div className="rounded-xl bg-white p-2.5">
                        <p className="text-[10px] font-bold uppercase text-slate-400">
                          Fee
                        </p>
                        <p className="mt-1 text-xs font-bold text-slate-700">
                          ₹{formatNumber(doctor.fee)}
                        </p>
                      </div>

                      <div className="rounded-xl bg-white p-2.5">
                        <p className="text-[10px] font-bold uppercase text-slate-400">
                          Hours
                        </p>
                        <p className="mt-1 truncate text-xs font-bold text-slate-700">
                          {doctor.workingHours}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-col gap-2 text-xs text-slate-500 sm:flex-row">
                      <span className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-blue-500" />
                        {doctor.phone}
                      </span>

                      <span className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-cyan-500" />
                        {doctor.email}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center">
                <Stethoscope className="mx-auto h-8 w-8 text-slate-300" />

                <p className="mt-3 text-sm font-semibold text-slate-500">
                  No doctors assigned to this department yet.
                </p>

                <button
                  type="button"
                  onClick={() => router.push("/doctors")}
                  className="mt-4 cursor-pointer rounded-xl bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
                >
                  Open Doctors
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Staff + Patients */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {/* Staff */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                  <Users className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-800">
                    Department Staff
                  </h2>
                  <p className="text-xs text-slate-500">
                    Staff assigned to this department
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-bold text-cyan-700">
                {department.staff} Staff
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {[
                "Nursing Staff",
                "Technicians",
                "Reception Staff",
              ].map((role, index) => (
                <div
                  key={role}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-cyan-600 shadow-sm">
                      <Users className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-700">
                        {role}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Assigned to {department.name}
                      </p>
                    </div>
                  </div>

                  <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-slate-600">
                    {index === 0
                      ? Math.max(1, Math.floor(department.staff * 0.55))
                      : index === 1
                        ? Math.max(1, Math.floor(department.staff * 0.25))
                        : Math.max(1, department.staff -
                            Math.floor(department.staff * 0.55) -
                            Math.floor(department.staff * 0.25))}
                  </span>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="mt-4 w-full cursor-pointer rounded-xl border border-cyan-100 bg-cyan-50 py-2.5 text-sm font-bold text-cyan-700 transition hover:bg-cyan-100"
            >
              View Staff List
            </button>
          </motion.div>

          {/* Patients */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
                  <HeartPulse className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-800">
                    Department Patients
                  </h2>
                  <p className="text-xs text-slate-500">
                    Patients associated with this department
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600">
                {formatNumber(department.patients)}
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {[
                {
                  label: "Total Patients",
                  value: department.patients,
                  icon: Users,
                },
                {
                  label: "Today's Appointments",
                  value: Math.max(
                    1,
                    Math.floor(department.patients * 0.08),
                  ),
                  icon: CalendarDays,
                },
                {
                  label: "Currently Admitted",
                  value: Math.max(
                    1,
                    Math.floor(department.patients * 0.12),
                  ),
                  icon: HeartPulse,
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-rose-500 shadow-sm">
                        <Icon className="h-4 w-4" />
                      </div>

                      <p className="text-sm font-bold text-slate-700">
                        {item.label}
                      </p>
                    </div>

                    <p className="text-sm font-bold text-slate-800">
                      {formatNumber(item.value)}
                    </p>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => router.push("/patients")}
              className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-rose-100 bg-rose-50 py-2.5 text-sm font-bold text-rose-600 transition hover:bg-rose-100"
            >
              View All Patients
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        </div>

        {/* Department Information */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Building2 className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-bold text-slate-800">
                Department Information
              </h2>
              <p className="text-xs text-slate-500">
                Contact and operational details
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-blue-50/60 p-4">
              <MapPin className="h-4 w-4 text-blue-600" />
              <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-blue-600">
                Location
              </p>
              <p className="mt-1 text-sm font-bold text-slate-700">
                {department.floor}
              </p>
            </div>

            <div className="rounded-2xl bg-cyan-50/60 p-4">
              <Phone className="h-4 w-4 text-cyan-600" />
              <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-cyan-600">
                Contact
              </p>
              <p className="mt-1 text-sm font-bold text-slate-700">
                {department.contact}
              </p>
            </div>

            <div className="rounded-2xl bg-violet-50/60 p-4">
              <Clock3 className="h-4 w-4 text-violet-600" />
              <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-violet-600">
                Availability
              </p>
              <p className="mt-1 text-sm font-bold text-slate-700">
                Hospital Hours
              </p>
            </div>

            <div className="rounded-2xl bg-emerald-50/60 p-4">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                Department Status
              </p>
              <p className="mt-1 text-sm font-bold text-slate-700">
                {department.status}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}