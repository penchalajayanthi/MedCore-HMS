"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  Bell,
  CalendarDays,
  CreditCard,
  FlaskConical,
  LayoutDashboard,
  Pill,
  Stethoscope,
  UserRound,
  Users,
  Building2,
  FileText,
  HeartPulse,
  X,
} from "lucide-react";

interface AppSidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

type SessionUser = {
  fullName?: string;
  email?: string;
  hospitalName?: string;
  role?: string;
  emailVerified?: boolean;
};

type SessionData = {
  user?: SessionUser;
  isAuthenticated?: boolean;
  remember?: boolean;
};

const navigation = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Analytics",
        href: "/analytics",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Clinical",
    items: [
      {
        label: "Patients",
        href: "/patients",
        icon: Users,
      },
      {
        label: "Doctors",
        href: "/doctors",
        icon: Stethoscope,
      },
      {
        label: "Appointments",
        href: "/appointments",
        icon: CalendarDays,
      },
      {
        label: "Medical Records",
        href: "/emr",
        icon: FileText,
      },
      {
        label: "Prescriptions",
        href: "/prescriptions",
        icon: Pill,
      },
      {
        label: "Laboratory",
        href: "/laboratory",
        icon: FlaskConical,
      },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        label: "Pharmacy",
        href: "/pharmacy",
        icon: Pill,
      },
      {
        label: "Billing",
        href: "/billing",
        icon: CreditCard,
      },
      {
        label: "Departments",
        href: "/departments",
        icon: Building2,
      },
      {
        label: "Notifications",
        href: "/notifications",
        icon: Bell,
      },
    ],
  },
];

export function AppSidebar({
  mobileOpen = false,
  onClose,
}: AppSidebarProps) {
  const pathname = usePathname();

  const [userName, setUserName] = useState("Hospital Admin");
  const [userRole, setUserRole] = useState("Administrator");
  const [hospitalName, setHospitalName] =
    useState("MedCore Hospital");

  useEffect(() => {
    try {
      /* ========================================================
         PRIMARY SOURCE: medcore_session
      ======================================================== */

      const session = localStorage.getItem("medcore_session");

      if (session) {
        const parsedSession: SessionData =
          JSON.parse(session);

        const user = parsedSession?.user;

        if (user?.fullName) {
          setUserName(user.fullName);
        }

        if (user?.role) {
          setUserRole(user.role);
        }

        if (user?.hospitalName) {
          setHospitalName(user.hospitalName);
        }

        return;
      }

      /* ========================================================
         FALLBACK: medcore_account
      ======================================================== */

      const account = localStorage.getItem("medcore_account");

      if (account) {
        const parsedAccount: SessionUser =
          JSON.parse(account);

        if (parsedAccount?.fullName) {
          setUserName(parsedAccount.fullName);
        }

        if (parsedAccount?.role) {
          setUserRole(parsedAccount.role);
        }

        if (parsedAccount?.hospitalName) {
          setHospitalName(parsedAccount.hospitalName);
        }
      }
    } catch (error) {
      console.error(
        "Unable to load sidebar user information:",
        error
      );
    }
  }, []);

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-72
          flex-col border-r border-slate-200 bg-white
          transition-transform duration-300
          dark:border-slate-800 dark:bg-slate-950
          lg:translate-x-0
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-slate-200 px-6 dark:border-slate-800">
          <Link
            href="/dashboard"
            className="flex items-center gap-3"
            onClick={onClose}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-600 text-white shadow-lg shadow-cyan-600/20">
              <HeartPulse className="h-6 w-6" />
            </div>

            <div>
              <p className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                MedCore
              </p>

              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">
                HMS
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Hospital */}
        <div className="mx-4 mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-100 dark:bg-cyan-950">
              <Building2 className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                {hospitalName}
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Main Branch
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-5">
          {navigation.map((section) => (
            <div key={section.title} className="mb-6">
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {section.title}
              </p>

              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;

                  const active =
                    pathname === item.href ||
                    pathname.startsWith(
                      `${item.href}/`
                    );

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`
                        flex items-center gap-3 rounded-xl px-3 py-2.5
                        text-sm font-medium transition-all
                        ${
                          active
                            ? "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-400"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                        }
                      `}
                    >
                      <Icon
                        className={`h-4.5 w-4.5 ${
                          active
                            ? "text-cyan-600 dark:text-cyan-400"
                            : ""
                        }`}
                      />

                      <span>{item.label}</span>

                      {active && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-600 dark:bg-cyan-400" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User */}
        <div className="border-t border-slate-200 p-4 dark:border-slate-800">
          <div className="flex items-center gap-3 rounded-xl p-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-950">
              <UserRound className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                {userName}
              </p>

              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                {userRole}
              </p>
            </div>

            <Activity className="ml-auto h-4 w-4 shrink-0 text-emerald-500" />
          </div>
        </div>
      </aside>
    </>
  );
}
