"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Menu,
  Search,
  Settings,
  LogOut,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface TopHeaderProps {
  onMenuClick?: () => void;
}

interface SessionUser {
  fullName?: string;
  email?: string;
  hospitalName?: string;
  role?: string;
  emailVerified?: boolean;
}

export function TopHeader({
  onMenuClick,
}: TopHeaderProps) {
  const router = useRouter();

  const [showProfile, setShowProfile] =
    useState(false);

  const [user, setUser] = useState<SessionUser>({
    fullName: "User",
    role: "User",
  });

  // ============================================================
  // GET LOGGED-IN USER
  // ============================================================

  useEffect(() => {
    try {
      const storedSession =
        localStorage.getItem("medcore_session");

      if (!storedSession) {
        return;
      }

      const session = JSON.parse(storedSession);

      if (session?.user) {
        setUser({
          fullName:
            session.user.fullName || "User",

          email:
            session.user.email || "",

          hospitalName:
            session.user.hospitalName || "MedCore",

          role:
            session.user.role || "User",

          emailVerified:
            session.user.emailVerified ?? false,
        });
      }
    } catch (error) {
      console.error(
        "Failed to read MedCore session:",
        error
      );
    }
  }, []);

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = () => {
    localStorage.removeItem("medcore_session");

    setShowProfile(false);

    router.push("/login");
  };

  // ============================================================
  // FORMAT ROLE
  // ============================================================

  const formattedRole =
    user.role
      ? user.role.charAt(0).toUpperCase() +
        user.role.slice(1)
      : "User";

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center border-b border-slate-200 bg-white/95 px-3 backdrop-blur-xl sm:h-20 sm:px-5 lg:px-6 dark:border-slate-800 dark:bg-slate-950/95">

      <div className="flex w-full min-w-0 items-center justify-between gap-2 sm:gap-4">

        {/* ======================================================
            LEFT
        ======================================================= */}

        <div className="flex min-w-0 items-center gap-2 sm:gap-3">

          {/* Mobile menu */}
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open menu"
            className="shrink-0 rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Search */}
          <div className="relative hidden w-56 md:block lg:w-80 xl:w-96">

            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Search patients, doctors..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </div>

          {/* Mobile title */}
          <div className="min-w-0 md:hidden">
            <p className="truncate text-sm font-semibold text-slate-800 dark:text-white">
              MedCore
            </p>

            <p className="text-[10px] text-slate-400">
              HMS
            </p>
          </div>
        </div>

        {/* ======================================================
            RIGHT
        ======================================================= */}

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">

          {/* Notifications */}
          <button
            type="button"
            onClick={() =>
              router.push("/notifications")
            }
            aria-label="Notifications"
            className="relative rounded-xl p-2 sm:p-2.5 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Bell className="h-5 w-5" />

            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white sm:right-2 sm:top-2 dark:ring-slate-950" />
          </button>

          {/* Settings */}
          <button
            type="button"
            aria-label="Settings"
            className="hidden rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 sm:block dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Settings className="h-5 w-5" />
          </button>

          {/* ====================================================
              PROFILE
          ===================================================== */}

          <div className="relative ml-1">

            <button
              type="button"
              onClick={() =>
                setShowProfile(
                  (value) => !value
                )
              }
              className="flex max-w-[220px] items-center gap-2 rounded-xl p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
            >

              {/* Avatar */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md">
                <UserRound className="h-4 w-4" />
              </div>

              {/* User information */}
              <div className="hidden min-w-0 text-left lg:block">

                <p className="max-w-[150px] truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {user.fullName}
                </p>

                <p className="text-xs capitalize text-slate-500">
                  {formattedRole}
                </p>

              </div>
            </button>

            {/* ==================================================
                PROFILE DROPDOWN
            =================================================== */}

            {showProfile && (
              <div className="absolute right-0 top-14 z-50 w-[calc(100vw-2rem)] max-w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-800 dark:bg-slate-950">

                {/* User info */}
                <div className="border-b border-slate-100 px-3 py-3 dark:border-slate-800">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                      <UserRound className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">

                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                        {user.fullName}
                      </p>

                      <p className="truncate text-xs text-slate-500">
                        {user.email}
                      </p>

                      <p className="mt-0.5 text-xs capitalize text-cyan-600 dark:text-cyan-400">
                        {formattedRole}
                      </p>

                    </div>

                  </div>
                </div>

                {/* Profile */}
                <button
                  type="button"
                  onClick={() => {
                    setShowProfile(false);
                    router.push("/profile");
                  }}
                  className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
                >
                  <UserRound className="h-4 w-4" />

                  Profile
                </button>

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <LogOut className="h-4 w-4" />

                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}