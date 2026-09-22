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

  const [user, setUser] = useState<SessionUser>({});

  useEffect(() => {
    const loadUser = () => {
      try {
        /* ============================================
           PRIMARY SOURCE
        ============================================ */

        const session = localStorage.getItem(
          "medcore_session"
        );

        if (session) {
          const parsedSession: SessionData =
            JSON.parse(session);

          if (parsedSession?.user) {
            setUser({
              ...parsedSession.user,
            });

            return;
          }
        }

        /* ============================================
           FALLBACK
        ============================================ */

        const account =
          localStorage.getItem("medcore_account");

        if (account) {
          const parsedAccount: SessionUser =
            JSON.parse(account);

          setUser({
            ...parsedAccount,
          });
        }
      } catch (error) {
        console.error(
          "Unable to load sidebar user:",
          error
        );
      }
    };

    loadUser();

    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  const displayName =
    user.fullName?.trim() || "User";

  const displayRole =
    user.role?.trim()
      ? user.role.charAt(0).toUpperCase() +
        user.role.slice(1)
      : "Administrator";

  const displayHospital =
    user.hospitalName?.trim() ||
    "MedCore Hospital";

  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .map((name) => name.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      {/* ==================================================
          MOBILE OVERLAY
      ================================================== */}

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-72
          flex-col border-r border-slate-200 bg-white
          shadow-xl transition-transform duration-300
          dark:border-slate-800 dark:bg-slate-950
          lg:translate-x-0 lg:shadow-none
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* ==================================================
            LOGO
        ================================================== */}

        <div className="flex h-20 shrink-0 items-center justify-between border-b border-slate-200 px-5 dark:border-slate-800">

          <Link
            href="/dashboard"
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
              <HeartPulse className="h-6 w-6" />
            </div>

            <div>
              <p className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                MedCore
              </p>

              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">
                Hospital Management
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

        {/* ==================================================
            HOSPITAL
        ================================================== */}

        <div className="mx-4 mt-5 shrink-0 rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-blue-50 p-3 dark:border-cyan-950 dark:from-cyan-950/40 dark:to-blue-950/30">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-100 dark:bg-cyan-950">
              <Building2 className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            </div>

            <div className="min-w-0">

              <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-200">
                {displayHospital}
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Main Branch
              </p>

            </div>
          </div>
        </div>

        {/* ==================================================
            NAVIGATION
        ================================================== */}

        <nav className="flex-1 overflow-y-auto px-4 py-5">

          {navigation.map((section) => (
            <div
              key={section.title}
              className="mb-6"
            >

              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
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
                        group flex items-center gap-3
                        rounded-xl px-3 py-2.5
                        text-sm font-medium
                        transition-all
                        ${
                          active
                            ? "bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 shadow-sm dark:from-cyan-950/60 dark:to-blue-950/40 dark:text-cyan-400"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                        }
                      `}
                    >

                      <Icon
                        className={`
                          h-4.5 w-4.5 shrink-0
                          ${
                            active
                              ? "text-cyan-600 dark:text-cyan-400"
                              : "text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200"
                          }
                        `}
                      />

                      <span className="truncate">
                        {item.label}
                      </span>

                      {active && (
                        <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-600 dark:bg-cyan-400" />
                      )}
                    </Link>
                  );
                })}

              </div>
            </div>
          ))}
        </nav>

        {/* ==================================================
            USER
        ================================================== */}

        <div className="shrink-0 border-t border-slate-200 p-4 dark:border-slate-800">

          <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-50 to-blue-50 p-2.5 dark:from-cyan-950/40 dark:to-blue-950/30">

            {/* Avatar */}

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-xs font-bold text-white shadow-md">
              {initials}
            </div>

            {/* User */}

            <div className="min-w-0 flex-1">

              <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-200">
                {displayName}
              </p>

              <p className="truncate text-xs capitalize text-slate-500 dark:text-slate-400">
                {displayRole}
              </p>

            </div>

            <Activity className="h-4 w-4 shrink-0 text-emerald-500" />
          </div>
        </div>

      </aside>
    </>
  );
}