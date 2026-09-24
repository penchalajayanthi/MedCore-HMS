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

type NotificationItem = {
  status?: "Unread" | "Read";
};

const NOTIFICATIONS_STORAGE_KEY = "medcore_notifications";
const NOTIFICATIONS_UPDATED_EVENT =
  "medcore-notifications-updated";

export function TopHeader({
  onMenuClick,
}: TopHeaderProps) {
  const router = useRouter();

  const [showProfile, setShowProfile] = useState(false);

  const [unreadNotifications, setUnreadNotifications] =
    useState(0);

  const [user, setUser] = useState<SessionUser>({
    fullName: "User",
    role: "Administrator",
  });

  /*
   * ==========================================================
   * LOAD USER
   * ==========================================================
   */

  useEffect(() => {
    const loadUser = () => {
      try {
        /*
         * PRIMARY SOURCE:
         * medcore_session
         */

        const session =
          localStorage.getItem("medcore_session");

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

        /*
         * FALLBACK:
         * medcore_account
         */

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
          "Unable to load header user information:",
          error,
        );
      }
    };

    loadUser();

    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  /*
   * ==========================================================
   * LOAD UNREAD NOTIFICATION COUNT
   * ==========================================================
   */

  useEffect(() => {
    const loadNotificationCount = () => {
      try {
        const storedNotifications =
          localStorage.getItem(
            NOTIFICATIONS_STORAGE_KEY,
          );

        if (!storedNotifications) {
          setUnreadNotifications(0);
          return;
        }

        const parsedNotifications: NotificationItem[] =
          JSON.parse(storedNotifications);

        if (!Array.isArray(parsedNotifications)) {
          setUnreadNotifications(0);
          return;
        }

        const unreadCount = parsedNotifications.filter(
          (notification) =>
            notification.status === "Unread",
        ).length;

        setUnreadNotifications(unreadCount);
      } catch (error) {
        console.error(
          "Unable to load notification count:",
          error,
        );

        setUnreadNotifications(0);
      }
    };

    /*
     * Load immediately when header mounts.
     */
    loadNotificationCount();

    /*
     * Custom event:
     * Fired by Notifications page when its data changes.
     */
    window.addEventListener(
      NOTIFICATIONS_UPDATED_EVENT,
      loadNotificationCount,
    );

    /*
     * Storage event:
     * Useful when localStorage changes from another tab.
     */
    window.addEventListener(
      "storage",
      loadNotificationCount,
    );

    return () => {
      window.removeEventListener(
        NOTIFICATIONS_UPDATED_EVENT,
        loadNotificationCount,
      );

      window.removeEventListener(
        "storage",
        loadNotificationCount,
      );
    };
  }, []);

  /*
   * ==========================================================
   * USER DISPLAY
   * ==========================================================
   */

  const displayName =
    user.fullName?.trim() || "User";

  const displayRole = user.role?.trim()
    ? user.role.charAt(0).toUpperCase() +
      user.role.slice(1)
    : "Administrator";

  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .map((name) => name.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  /*
   * ==========================================================
   * LOGOUT
   * ==========================================================
   */

  const handleLogout = () => {
    localStorage.removeItem("medcore_session");

    setShowProfile(false);

    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 min-h-16 items-center border-b border-slate-200 bg-white/95 px-3 backdrop-blur-xl sm:h-20 sm:px-4 md:px-6 dark:border-slate-800 dark:bg-slate-950/95">
      <div className="flex w-full min-w-0 items-center justify-between gap-2 sm:gap-4">
        {/* ==================================================
            LEFT
        ================================================== */}

        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          {/* Mobile Menu */}

          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            className="shrink-0 cursor-pointer rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Header Title */}

          <div className="hidden min-w-0 sm:block lg:hidden">
            <p className="truncate text-[11px] font-medium text-cyan-600 dark:text-cyan-400">
              MedCore HMS
            </p>

            <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
              Hospital Administration
            </p>
          </div>

          {/* Search */}

          <div className="relative hidden w-64 md:block lg:w-80 xl:w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Search patients, doctors..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* ==================================================
            RIGHT
        ================================================== */}

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {/* Activity */}

          <button
            type="button"
            aria-label="Activity"
            className="hidden cursor-pointer rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 sm:block dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <div className="relative">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M3 12h4l2-6 4 12 2-6h6" />
              </svg>

              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-950" />
            </div>
          </button>

          {/* ==================================================
              NOTIFICATIONS
          ================================================== */}

         <button
  type="button"
  onClick={() => router.push("/notifications")}
  aria-label="Open notifications"
  className="relative cursor-pointer rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 sm:p-2.5 dark:text-slate-300 dark:hover:bg-slate-800"
>
  <Bell className="h-5 w-5" />

  {unreadNotifications > 0 && (
    <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white ring-2 ring-white dark:ring-slate-950">
      {unreadNotifications > 99 ? "99+" : unreadNotifications}
    </span>
  )}
</button>
          {/* Settings */}

          <button
            type="button"
            onClick={() => router.push("/settings")}
            aria-label="Settings"
            className="hidden cursor-pointer rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 md:block dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Settings className="h-5 w-5" />
          </button>

          {/* Divider */}

          <div className="hidden h-8 w-px bg-slate-200 sm:block dark:bg-slate-800" />

          {/* ==================================================
              PROFILE
          ================================================== */}

          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setShowProfile((value) => !value)
              }
              className="flex max-w-[190px] cursor-pointer items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-100 sm:gap-3 dark:hover:bg-slate-800"
              aria-label="Open profile menu"
            >
              {/* Avatar */}

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-xs font-bold text-white shadow-md shadow-cyan-500/20 sm:h-10 sm:w-10">
                {initials}
              </div>

              {/* Name */}

              <div className="hidden min-w-0 text-left sm:block">
                <p className="max-w-[120px] truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {displayName}
                </p>

                <p className="max-w-[120px] truncate text-xs capitalize text-slate-500 dark:text-slate-400">
                  {displayRole}
                </p>
              </div>
            </button>

            {/* ==================================================
                PROFILE DROPDOWN
            ================================================== */}

            {showProfile && (
              <>
                {/* Mobile Backdrop */}

                <div
                  className="fixed inset-0 z-40"
                  onClick={() =>
                    setShowProfile(false)
                  }
                />

                <div className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
                  {/* User Info */}

                  <div className="border-b border-slate-100 bg-gradient-to-br from-cyan-50 to-blue-50 p-4 dark:border-slate-800 dark:from-cyan-950/40 dark:to-blue-950/40">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white">
                        {initials}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                          {displayName}
                        </p>

                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                          {user.email || "No email"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu */}

                  <div className="p-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfile(false);
                        router.push("/profile");
                      }}
                      className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
                    >
                      <UserRound className="h-4 w-4" />
                      Profile
                    </button>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}