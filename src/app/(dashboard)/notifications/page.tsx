"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  Bell,
  BellRing,
  CalendarDays,
  Check,
  CheckCheck,
  ChevronRight,
  Clock3,
  CreditCard,
  Download,
  FlaskConical,
  Info,
  Mail,
  Pill,
  Search,
  Settings2,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

type NotificationType =
  | "Appointment"
  | "Laboratory"
  | "Prescription"
  | "Billing"
  | "System"
  | "Patient";

type NotificationPriority = "High" | "Medium" | "Low";

type NotificationStatus = "Unread" | "Read";

type NotificationItem = {
  id: number;
  title: string;
  description: string;
  type: NotificationType;
  priority: NotificationPriority;
  status: NotificationStatus;
  time: string;
  date: string;
  patient?: string;
  action?: string;
};

const NOTIFICATIONS_STORAGE_KEY = "medcore_notifications";
const NOTIFICATIONS_UPDATED_EVENT = "medcore-notifications-updated";

const initialNotifications: NotificationItem[] = [
  {
    id: 1,
    title: "New Appointment Scheduled",
    description:
      "A new appointment has been scheduled with Dr. Sarah Wilson for today at 10:30 AM.",
    type: "Appointment",
    priority: "High",
    status: "Unread",
    time: "10 min ago",
    date: "Today",
    patient: "Olivia Johnson",
    action: "View Appointment",
  },
  {
    id: 2,
    title: "Laboratory Result Available",
    description:
      "CBC blood test results for Michael Anderson are now available for review.",
    type: "Laboratory",
    priority: "High",
    status: "Unread",
    time: "28 min ago",
    date: "Today",
    patient: "Michael Anderson",
    action: "View Result",
  },
  {
    id: 3,
    title: "Prescription Updated",
    description:
      "Dr. Emily Carter updated the prescription for Sophia Williams.",
    type: "Prescription",
    priority: "Medium",
    status: "Unread",
    time: "1 hour ago",
    date: "Today",
    patient: "Sophia Williams",
    action: "View Prescription",
  },
  {
    id: 4,
    title: "Payment Received",
    description:
      "A payment of ₹4,500 has been successfully received for invoice INV-1024.",
    type: "Billing",
    priority: "Medium",
    status: "Unread",
    time: "2 hours ago",
    date: "Today",
    action: "View Invoice",
  },
  {
    id: 5,
    title: "New Patient Registered",
    description:
      "A new patient profile has been successfully registered in MedCore HMS.",
    type: "Patient",
    priority: "Low",
    status: "Read",
    time: "3 hours ago",
    date: "Today",
    patient: "James Miller",
    action: "View Patient",
  },
  {
    id: 6,
    title: "Appointment Reminder",
    description:
      "You have 5 appointments scheduled for tomorrow. Please review your schedule.",
    type: "Appointment",
    priority: "Medium",
    status: "Read",
    time: "5 hours ago",
    date: "Today",
    action: "View Schedule",
  },
  {
    id: 7,
    title: "Pharmacy Stock Alert",
    description:
      "Paracetamol 500mg stock is running low. Current available quantity is 18 units.",
    type: "System",
    priority: "High",
    status: "Unread",
    time: "Yesterday",
    date: "Yesterday",
    action: "View Pharmacy",
  },
  {
    id: 8,
    title: "Invoice Overdue",
    description:
      "Invoice INV-1017 has passed its due date and requires follow-up.",
    type: "Billing",
    priority: "High",
    status: "Unread",
    time: "Yesterday",
    date: "Yesterday",
    action: "View Invoice",
  },
  {
    id: 9,
    title: "System Maintenance Scheduled",
    description:
      "Scheduled maintenance will take place tonight from 11:00 PM to 12:00 AM.",
    type: "System",
    priority: "Low",
    status: "Read",
    time: "2 days ago",
    date: "Sep 22, 2026",
    action: "View Details",
  },
  {
    id: 10,
    title: "Patient Follow-up Required",
    description:
      "A follow-up appointment is recommended for patient Daniel Brown.",
    type: "Patient",
    priority: "Medium",
    status: "Read",
    time: "2 days ago",
    date: "Sep 22, 2026",
    patient: "Daniel Brown",
    action: "View Patient",
  },
];

const typeOptions = [
  "All",
  "Appointment",
  "Laboratory",
  "Prescription",
  "Billing",
  "Patient",
  "System",
];

const statusOptions = ["All", "Unread", "Read"];

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "Appointment":
      return CalendarDays;
    case "Laboratory":
      return FlaskConical;
    case "Prescription":
      return Pill;
    case "Billing":
      return CreditCard;
    case "Patient":
      return UserRound;
    case "System":
      return Settings2;
    default:
      return Bell;
  }
};

const getTypeClasses = (type: NotificationType) => {
  switch (type) {
    case "Appointment":
      return {
        icon: "bg-blue-50 text-blue-600 border-blue-100",
        badge: "bg-blue-50 text-blue-700 border-blue-100",
      };

    case "Laboratory":
      return {
        icon: "bg-violet-50 text-violet-600 border-violet-100",
        badge: "bg-violet-50 text-violet-700 border-violet-100",
      };

    case "Prescription":
      return {
        icon: "bg-cyan-50 text-cyan-600 border-cyan-100",
        badge: "bg-cyan-50 text-cyan-700 border-cyan-100",
      };

    case "Billing":
      return {
        icon: "bg-emerald-50 text-emerald-600 border-emerald-100",
        badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
      };

    case "Patient":
      return {
        icon: "bg-pink-50 text-pink-600 border-pink-100",
        badge: "bg-pink-50 text-pink-700 border-pink-100",
      };

    case "System":
      return {
        icon: "bg-amber-50 text-amber-600 border-amber-100",
        badge: "bg-amber-50 text-amber-700 border-amber-100",
      };
  }
};

const getPriorityClasses = (priority: NotificationPriority) => {
  switch (priority) {
    case "High":
      return "bg-red-50 text-red-600 border-red-100";

    case "Medium":
      return "bg-amber-50 text-amber-700 border-amber-100";

    case "Low":
      return "bg-slate-50 text-slate-600 border-slate-200";
  }
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedNotification, setSelectedNotification] =
    useState<NotificationItem | null>(null);

  const [notificationToDelete, setNotificationToDelete] =
    useState<NotificationItem | null>(null);

  const [showSettings, setShowSettings] = useState(false);

  /*
   * Load notifications from localStorage.
   * If nothing exists, create the initial notification data.
   */
  useEffect(() => {
    try {
      const storedNotifications = localStorage.getItem(
        NOTIFICATIONS_STORAGE_KEY,
      );

      if (storedNotifications) {
        const parsedNotifications = JSON.parse(storedNotifications);

        if (Array.isArray(parsedNotifications)) {
          setNotifications(parsedNotifications);
          return;
        }
      }

      localStorage.setItem(
        NOTIFICATIONS_STORAGE_KEY,
        JSON.stringify(initialNotifications),
      );

      setNotifications(initialNotifications);
    } catch (error) {
      console.error("Unable to load notifications:", error);
      setNotifications(initialNotifications);
    }
  }, []);

  /*
   * Save notifications whenever the data changes.
   * Notify TopHeader so its badge updates immediately.
   */
  useEffect(() => {
    if (notifications.length === 0) {
      return;
    }

    try {
      localStorage.setItem(
        NOTIFICATIONS_STORAGE_KEY,
        JSON.stringify(notifications),
      );

      window.dispatchEvent(
        new Event(NOTIFICATIONS_UPDATED_EVENT),
      );
    } catch (error) {
      console.error("Unable to save notifications:", error);
    }
  }, [notifications]);

  const unreadCount = notifications.filter(
    (notification) => notification.status === "Unread",
  ).length;

  const highPriorityCount = notifications.filter(
    (notification) =>
      notification.priority === "High" &&
      notification.status === "Unread",
  ).length;

  const appointmentCount = notifications.filter(
    (notification) => notification.type === "Appointment",
  ).length;

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        notification.title.toLowerCase().includes(search) ||
        notification.description.toLowerCase().includes(search) ||
        notification.patient?.toLowerCase().includes(search);

      const matchesType =
        typeFilter === "All" || notification.type === typeFilter;

      const matchesStatus =
        statusFilter === "All" || notification.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [notifications, searchTerm, typeFilter, statusFilter]);

  const markAsRead = (id: number) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              status: "Read",
            }
          : notification,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        status: "Read",
      })),
    );
  };

  const handleNotificationClick = (
    notification: NotificationItem,
  ) => {
    if (notification.status === "Unread") {
      markAsRead(notification.id);
    }

    setSelectedNotification({
      ...notification,
      status: "Read",
    });
  };

  const deleteNotification = () => {
    if (!notificationToDelete) return;

    setNotifications((current) =>
      current.filter(
        (notification) =>
          notification.id !== notificationToDelete.id,
      ),
    );

    if (
      selectedNotification?.id === notificationToDelete.id
    ) {
      setSelectedNotification(null);
    }

    setNotificationToDelete(null);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setTypeFilter("All");
    setStatusFilter("All");
  };


  return (
    <div className="min-h-screen bg-blue-50/70 p-4 sm:p-5 lg:p-6">
      <div className="mx-auto max-w-[1600px] space-y-5">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl border border-cyan-100 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 p-5 text-white shadow-sm sm:p-6"
        >
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                <BellRing className="h-7 w-7" />
              </div>

              <div>
                <div className="mb-1 flex flex-wrap items-center gap-2 text-sm text-white/80">
                  <span>System</span>
                  <ChevronRight className="h-4 w-4" />
                  <span className="text-white">
                    Notifications
                  </span>
                </div>

                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Notifications
                </h1>

                <p className="mt-1 max-w-2xl text-sm text-white/80">
                  Stay updated with appointments, patients,
                  laboratory results, prescriptions, billing
                  and system alerts.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/15 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/25 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CheckCheck className="h-4 w-4" />
                Mark All Read
              </button>

            
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Total Notifications",
              value: notifications.length,
              icon: Bell,
              iconClass: "bg-blue-50 text-blue-600",
              valueClass: "text-slate-900",
            },
            {
              title: "Unread",
              value: unreadCount,
              icon: Mail,
              iconClass: "bg-cyan-50 text-cyan-600",
              valueClass: "text-cyan-700",
            },
            {
              title: "High Priority",
              value: highPriorityCount,
              icon: AlertCircle,
              iconClass: "bg-red-50 text-red-600",
              valueClass: "text-red-600",
            },
            {
              title: "Appointments",
              value: appointmentCount,
              icon: CalendarDays,
              iconClass: "bg-violet-50 text-violet-600",
              valueClass: "text-violet-700",
            },
          ].map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {stat.title}
                    </p>

                    <p
                      className={`mt-2 text-2xl font-bold ${stat.valueClass}`}
                    >
                      {stat.value}
                    </p>
                  </div>

                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconClass}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm">
          {/* Toolbar */}
          <div className="border-b border-slate-100 p-4 sm:p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Recent Notifications
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {filteredNotifications.length} notification
                  {filteredNotifications.length !== 1
                    ? "s"
                    : ""}{" "}
                  found
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative min-w-0 sm:w-72">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) =>
                      setSearchTerm(event.target.value)
                    }
                    placeholder="Search notifications..."
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-50"
                  />
                </div>

                <select
                  value={typeFilter}
                  onChange={(event) =>
                    setTypeFilter(event.target.value)
                  }
                  className="h-10 cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-50"
                >
                  {typeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option === "All"
                        ? "All Types"
                        : option}
                    </option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value)
                  }
                  className="h-10 cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-50"
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option === "All"
                        ? "All Status"
                        : option}
                    </option>
                  ))}
                </select>

                {(searchTerm ||
                  typeFilter !== "All" ||
                  statusFilter !== "All") && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-cyan-100 bg-cyan-50 px-4 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-100"
                  >
                    <X className="h-4 w-4" />
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="divide-y divide-slate-100">
            <AnimatePresence mode="popLayout">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map(
                  (notification, index) => {
                    const Icon = getNotificationIcon(
                      notification.type,
                    );

                    const typeClasses = getTypeClasses(
                      notification.type,
                    );

                    return (
                      <motion.div
                        key={notification.id}
                        layout
                        initial={{
                          opacity: 0,
                          y: 10,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          height: 0,
                        }}
                        transition={{
                          delay: index * 0.02,
                        }}
                        className={`group relative p-4 transition hover:bg-blue-50/40 sm:p-5 ${
                          notification.status ===
                          "Unread"
                            ? "bg-cyan-50/30"
                            : "bg-white"
                        }`}
                      >
                        {notification.status ===
                          "Unread" && (
                          <div className="absolute bottom-0 left-0 top-0 w-1 bg-cyan-500" />
                        )}

                        <div className="flex gap-3 sm:gap-4">
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${typeClasses.icon}`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3
                                    className={`text-sm font-bold ${
                                      notification.status ===
                                      "Unread"
                                        ? "text-slate-900"
                                        : "text-slate-700"
                                    }`}
                                  >
                                    {notification.title}
                                  </h3>

                                  {notification.status ===
                                    "Unread" && (
                                    <span className="h-2 w-2 rounded-full bg-cyan-500" />
                                  )}
                                </div>

                                <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
                                  {notification.description}
                                </p>
                              </div>

                              <div className="flex shrink-0 items-center gap-2">
                                <span
                                  className={`rounded-lg border px-2.5 py-1 text-xs font-semibold ${typeClasses.badge}`}
                                >
                                  {notification.type}
                                </span>

                                <span
                                  className={`rounded-lg border px-2.5 py-1 text-xs font-semibold ${getPriorityClasses(
                                    notification.priority,
                                  )}`}
                                >
                                  {notification.priority}
                                </span>
                              </div>
                            </div>

                            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
                                <span className="inline-flex items-center gap-1.5">
                                  <Clock3 className="h-3.5 w-3.5" />
                                  {notification.time}
                                </span>

                                <span className="inline-flex items-center gap-1.5">
                                  <CalendarDays className="h-3.5 w-3.5" />
                                  {notification.date}
                                </span>

                                {notification.patient && (
                                  <span className="inline-flex items-center gap-1.5">
                                    <UserRound className="h-3.5 w-3.5" />
                                    {notification.patient}
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center gap-2">
                                {/* View */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleNotificationClick(
                                      notification,
                                    )
                                  }
                                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-cyan-100 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700 transition hover:bg-cyan-100"
                                >
                                  <Info className="h-3.5 w-3.5" />
                                  View
                                </button>

                                {/* Mark Read */}
                                {notification.status ===
                                  "Unread" && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      markAsRead(
                                        notification.id,
                                      )
                                    }
                                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                                  >
                                    <Check className="h-3.5 w-3.5" />
                                    Mark Read
                                  </button>
                                )}

                                {/* Delete */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    setNotificationToDelete(
                                      notification,
                                    )
                                  }
                                  className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-red-100 bg-red-50 p-1.5 text-red-600 transition hover:bg-red-100"
                                  aria-label="Delete notification"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  },
                )
              ) : (
                <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                    <Bell className="h-7 w-7" />
                  </div>

                  <h3 className="mt-4 text-base font-bold text-slate-800">
                    No notifications found
                  </h3>

                  <p className="mt-1 max-w-md text-sm text-slate-500">
                    Try changing your search or filter
                    settings.
                  </p>

                  <button
                    type="button"
                    onClick={resetFilters}
                    className="mt-4 cursor-pointer rounded-xl bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-100"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Cards */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                <BellRing className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Notification Center
                </p>

                <p className="text-xs text-slate-500">
                  Keep track of important hospital updates.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCheck className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Read Status
                </p>

                <p className="text-xs text-slate-500">
                  {notifications.length - unreadCount}{" "}
                  notifications have been read.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Settings2 className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Preferences
                  </p>

                  <p className="text-xs text-slate-500">
                    Manage notification preferences.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowSettings(true)}
                className="cursor-pointer rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
              >
                Manage
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedNotification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setSelectedNotification(null);
              }
            }}
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.96,
                y: 15,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.96,
                y: 15,
              }}
              className="w-full max-w-lg overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between bg-gradient-to-r from-cyan-500 to-blue-600 p-5 text-white">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                    <Bell className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-white/75">
                      Notification Details
                    </p>

                    <h2 className="text-lg font-bold">
                      {selectedNotification.type}
                    </h2>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedNotification(null)
                  }
                  className="cursor-pointer rounded-lg p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-5 p-5 sm:p-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">
                    {selectedNotification.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {selectedNotification.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs font-medium text-slate-400">
                      Priority
                    </p>

                    <span
                      className={`mt-1 inline-flex rounded-lg border px-2.5 py-1 text-xs font-semibold ${getPriorityClasses(
                        selectedNotification.priority,
                      )}`}
                    >
                      {selectedNotification.priority}
                    </span>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs font-medium text-slate-400">
                      Status
                    </p>

                    <span className="mt-1 inline-flex rounded-lg border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      {selectedNotification.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-100 p-3">
                    <p className="text-xs font-medium text-slate-400">
                      Time
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {selectedNotification.time}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-100 p-3">
                    <p className="text-xs font-medium text-slate-400">
                      Date
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {selectedNotification.date}
                    </p>
                  </div>
                </div>

                {selectedNotification.patient && (
                  <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-blue-600">
                        <UserRound className="h-4 w-4" />
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">
                          Patient
                        </p>

                        <p className="text-sm font-semibold text-slate-700">
                          {selectedNotification.patient}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedNotification(null)
                    }
                    className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    Close
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedNotification(null)
                    }
                    className="cursor-pointer rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-600"
                  >
                    {selectedNotification.action ??
                      "View Details"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {notificationToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setNotificationToDelete(null);
              }
            }}
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
                y: 15,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: 15,
              }}
              className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-6 shadow-2xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <Trash2 className="h-6 w-6" />
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-800">
                Delete Notification?
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-slate-700">
                  “{notificationToDelete.title}”
                </span>
                ? This action cannot be undone.
              </p>

              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setNotificationToDelete(null)
                  }
                  className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={deleteNotification}
                  className="cursor-pointer rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
                >
                  Delete Notification
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preferences */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setShowSettings(false);
              }
            }}
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.96,
                y: 15,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.96,
                y: 15,
              }}
              className="w-full max-w-lg rounded-3xl border border-blue-100 bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 p-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">
                    Notification Preferences
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Choose which notifications you want to
                    receive.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="cursor-pointer rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3 p-5">
                {[
                  {
                    label: "Appointment Notifications",
                    description:
                      "New appointments and appointment reminders",
                  },
                  {
                    label: "Laboratory Notifications",
                    description:
                      "New laboratory and diagnostic results",
                  },
                  {
                    label: "Prescription Notifications",
                    description:
                      "Prescription and medication updates",
                  },
                  {
                    label: "Billing Notifications",
                    description:
                      "Payments, invoices and billing alerts",
                  },
                  {
                    label: "System Notifications",
                    description:
                      "Security and system updates",
                  },
                ].map((item) => (
                  <label
                    key={item.label}
                    className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:border-cyan-100 hover:bg-cyan-50/40"
                  >
                    <div className="pr-4">
                      <p className="text-sm font-semibold text-slate-700">
                        {item.label}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {item.description}
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 cursor-pointer accent-cyan-500"
                    />
                  </label>
                ))}
              </div>

              <div className="flex justify-end border-t border-slate-100 p-5">
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="cursor-pointer rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-600"
                >
                  Save Preferences
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}