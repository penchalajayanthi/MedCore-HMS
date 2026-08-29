"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  BarChart3,
  Bell,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  CreditCard,
  FileText,
  FlaskConical,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  Menu,
  Pill,
  Settings,
  Stethoscope,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const navigation = [
  {
    section: "MAIN",
    items: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        color: "text-cyan-500",
      },
    ],
  },
  {
    section: "CLINICAL",
    items: [
      {
        name: "Patients",
        href: "/patients",
        icon: Users,
        color: "text-blue-500",
      },
      {
        name: "Doctors",
        href: "/doctors",
        icon: Stethoscope,
        color: "text-violet-500",
      },
      {
        name: "Appointments",
        href: "/appointments",
        icon: CalendarDays,
        color: "text-emerald-500",
      },
      {
        name: "Medical Records",
        href: "/emr",
        icon: FileText,
        color: "text-orange-500",
      },
      {
        name: "Prescriptions",
        href: "/prescriptions",
        icon: Pill,
        color: "text-pink-500",
      },
    ],
  },
  {
    section: "OPERATIONS",
    items: [
      {
        name: "Laboratory",
        href: "/laboratory",
        icon: FlaskConical,
        color: "text-purple-500",
      },
      {
        name: "Pharmacy",
        href: "/pharmacy",
        icon: Pill,
        color: "text-teal-500",
      },
      {
        name: "Billing",
        href: "/billing",
        icon: CreditCard,
        color: "text-amber-500",
      },
      {
        name: "Departments",
        href: "/departments",
        icon: Building2,
        color: "text-indigo-500",
      },
    ],
  },
  {
    section: "INSIGHTS",
    items: [
      {
        name: "Analytics",
        href: "/analytics",
        icon: BarChart3,
        color: "text-fuchsia-500",
      },
    ],
  },
  {
    section: "SYSTEM",
    items: [
      {
        name: "Notifications",
        href: "/notifications",
        icon: Bell,
        color: "text-red-500",
      },
      {
        name: "Settings",
        href: "/settings",
        icon: Settings,
        color: "text-slate-500",
      },
    ],
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("medcore_session");

    toast.success("Logged out successfully");

    router.push("/login");
  };

  const sidebarWidth = collapsed ? "w-[82px]" : "w-[270px]";

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex flex-col
          border-r border-slate-200
          bg-white
          shadow-xl shadow-slate-200/40
          transition-all duration-300
          dark:border-slate-800
          dark:bg-slate-900
          dark:shadow-black/20
          ${sidebarWidth}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >

        {/* Logo */}
        <div
          className={`
            flex h-[76px] items-center border-b border-slate-100
            dark:border-slate-800
            ${collapsed ? "justify-center" : "px-5"}
          `}
        >
          <Link
            href="/dashboard"
            className="flex items-center gap-3"
          >
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-500 to-violet-600 shadow-lg shadow-cyan-500/20">
              <HeartPulse className="h-6 w-6 text-white" />

              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-400 dark:border-slate-900" />
            </div>

            {!collapsed && (
              <div>
                <p className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  MedCore
                </p>

                <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-cyan-600 dark:text-cyan-400">
                  Hospital Management
                </p>
              </div>
            )}
          </Link>

          {/* Mobile Close */}
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">

          {navigation.map((group) => (
            <div key={group.section} className="mb-6">

              {!collapsed && (
                <p className="mb-2 px-3 text-[10px] font-bold tracking-[0.18em] text-slate-400">
                  {group.section}
                </p>
              )}

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;

                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" &&
                      pathname.startsWith(item.href));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      title={collapsed ? item.name : undefined}
                      className={`
                        group relative flex items-center gap-3 rounded-xl
                        px-3 py-2.5 text-sm font-medium
                        transition-all duration-200
                        ${
                          isActive
                            ? "bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 shadow-sm dark:from-cyan-950/50 dark:to-blue-950/40 dark:text-cyan-300"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-white"
                        }
                        ${collapsed ? "justify-center" : ""}
                      `}
                    >

                      {isActive && (
                        <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-cyan-500 to-blue-600" />
                      )}

                      <Icon
                        className={`
                          h-[19px] w-[19px] shrink-0
                          ${
                            isActive
                              ? "text-cyan-600 dark:text-cyan-400"
                              : item.color
                          }
                        `}
                      />

                      {!collapsed && (
                        <span>{item.name}</span>
                      )}

                      {!collapsed && item.name === "Notifications" && (
                        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                          4
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

        </nav>

        {/* User Card */}
        <div className="border-t border-slate-100 p-3 dark:border-slate-800">

          {!collapsed ? (
            <div className="mb-2 flex items-center gap-3 rounded-xl bg-gradient-to-r from-slate-50 to-cyan-50 p-3 dark:from-slate-800 dark:to-cyan-950/30">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white">
                JD
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                  Jayanthi
                </p>

                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  Hospital Admin
                </p>
              </div>

              <UserRound className="h-4 w-4 text-slate-400" />
            </div>
          ) : (
            <div className="mb-2 flex justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white">
                JD
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`
              flex w-full items-center gap-3 rounded-xl px-3 py-2.5
              text-sm font-medium text-red-500
              transition hover:bg-red-50
              dark:hover:bg-red-950/30
              ${collapsed ? "justify-center" : ""}
            `}
          >
            <LogOut className="h-[18px] w-[18px]" />

            {!collapsed && "Sign out"}
          </button>
        </div>

        {/* Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 hidden h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-md hover:text-cyan-600 lg:flex dark:border-slate-700 dark:bg-slate-900"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>

      </aside>

      {/* ================= MAIN ================= */}

      <div
        className={`
          min-h-screen transition-all duration-300
          ${collapsed ? "lg:pl-[82px]" : "lg:pl-[270px]"}
        `}
      >

        {/* Header */}
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white/90 px-4 shadow-sm backdrop-blur-xl sm:px-6 dark:border-slate-800 dark:bg-slate-900/90">

          <div className="flex items-center gap-3">

            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-xl p-2.5 text-slate-600 hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="hidden sm:block">
              <p className="text-xs text-slate-400">
                MedCore HMS
              </p>

              <p className="text-sm font-semibold text-slate-800 dark:text-white">
                Hospital Administration
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">

            {/* Activity */}
            <button className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-cyan-600 dark:hover:bg-slate-800">
              <Activity className="h-5 w-5" />

              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            </button>

            {/* Notifications */}
            <button className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-cyan-600 dark:hover:bg-slate-800">
              <Bell className="h-5 w-5" />

              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                4
              </span>
            </button>

            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />

            {/* Profile */}
            <button className="flex items-center gap-3 rounded-xl p-1.5 pr-2 transition hover:bg-slate-50 dark:hover:bg-slate-800">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-xs font-bold text-white shadow-md">
                JD
              </div>

              <div className="hidden text-left md:block">
                <p className="text-sm font-semibold text-slate-800 dark:text-white">
                  Jayanthi
                </p>

                <p className="text-[11px] text-slate-400">
                  Administrator
                </p>
              </div>
            </button>

          </div>
        </header>

        {/* Page */}
        <main>
          {children}
        </main>

      </div>
    </div>
  );
}