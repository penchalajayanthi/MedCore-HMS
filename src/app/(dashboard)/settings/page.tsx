"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Activity,
  Bell,
  Building2,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  Eye,
  EyeOff,
  Globe2,
  Hospital,
  KeyRound,
  Lock,
  Mail,
  MapPin,
  Monitor,
  Palette,
  Phone,
  RefreshCw,
  Save,
  Server,
  ShieldCheck,
  Smartphone,
  Sun,
  Moon,
  UserRound,
  Wifi,
} from "lucide-react";

type SettingsSection =
  | "General"
  | "Hospital"
  | "Profile"
  | "Security"
  | "Notifications"
  | "Appearance"
  | "Integrations";

type UserRole =
  | "hospital-admin"
  | "doctor"
  | "nurse"
  | "receptionist"
  | "patient";

type MedCoreUser = {
  fullName?: string;
  email?: string;
  hospitalName?: string;
  role?: UserRole | string;
  emailVerified?: boolean;
};

type MedCoreSession = {
  user?: MedCoreUser;
  isAuthenticated?: boolean;
  remember?: boolean;
};

type SettingsData = {
  timezone: string;
  dateFormat: string;
  currency: string;
  language: string;

  registrationNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  emergencyContact: string;
  openingTime: string;
  closingTime: string;

  appointmentNotifications: boolean;
  laboratoryNotifications: boolean;
  prescriptionNotifications: boolean;
  billingNotifications: boolean;
  patientNotifications: boolean;
  emailNotifications: boolean;
  browserNotifications: boolean;

  theme: "light" | "dark" | "system";
  compactMode: boolean;
  collapsedSidebar: boolean;

  emailIntegration: boolean;
  smsIntegration: boolean;
  paymentIntegration: boolean;
  cloudIntegration: boolean;
  apiIntegration: boolean;
};

type ProfileData = {
  fullName: string;
  email: string;
  hospitalName: string;
  role: string;
};

const SETTINGS_STORAGE_KEY = "medcore_settings";
const SESSION_STORAGE_KEY = "medcore_session";
const ACCOUNT_STORAGE_KEY = "medcore_account";

const defaultSettings: SettingsData = {
  timezone: "Asia/Kolkata",
  dateFormat: "DD/MM/YYYY",
  currency: "INR (₹)",
  language: "English",

  registrationNumber: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  emergencyContact: "",
  openingTime: "08:00",
  closingTime: "20:00",

  appointmentNotifications: true,
  laboratoryNotifications: true,
  prescriptionNotifications: true,
  billingNotifications: true,
  patientNotifications: true,
  emailNotifications: true,
  browserNotifications: true,

  theme: "light",
  compactMode: false,
  collapsedSidebar: false,

  emailIntegration: true,
  smsIntegration: false,
  paymentIntegration: true,
  cloudIntegration: true,
  apiIntegration: true,
};

const settingsMenu: {
  id: SettingsSection;
  label: string;
  description: string;
  icon: typeof Building2;
}[] = [
  {
    id: "General",
    label: "General",
    description: "Basic system preferences",
    icon: Globe2,
  },
  {
    id: "Hospital",
    label: "Hospital",
    description: "Hospital information",
    icon: Hospital,
  },
  {
    id: "Profile",
    label: "Profile",
    description: "Your account information",
    icon: UserRound,
  },
  {
    id: "Security",
    label: "Security",
    description: "Password and access",
    icon: ShieldCheck,
  },
  {
    id: "Notifications",
    label: "Notifications",
    description: "Notification preferences",
    icon: Bell,
  },
  {
    id: "Appearance",
    label: "Appearance",
    description: "Customize your workspace",
    icon: Palette,
  },
  {
    id: "Integrations",
    label: "Integrations",
    description: "Connected services",
    icon: Wifi,
  },
];

function formatRole(role?: string) {
  if (!role) return "User";

  const roleMap: Record<string, string> = {
    "hospital-admin": "Hospital Admin",
    doctor: "Doctor",
    nurse: "Nurse",
    receptionist: "Receptionist",
    patient: "Patient",
  };

  return (
    roleMap[role] ||
    role
      .split("-")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() + word.slice(1),
      )
      .join(" ")
  );
}

function getInitials(name?: string) {
  if (!name?.trim()) return "U";

  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function FieldLabel({
  children,
  required = false,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="mb-1.5 block text-xs font-bold text-slate-600">
      {children}
      {required && (
        <span className="ml-1 text-rose-500">*</span>
      )}
    </label>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon: Icon,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  icon?: typeof Mail;
  required?: boolean;
}) {
  return (
    <div>
      <FieldLabel required={required}>{label}</FieldLabel>

      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        )}

        <input
          type={type}
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder={placeholder}
          className={`h-11 w-full rounded-xl border border-slate-200 bg-white text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50 ${
            Icon ? "pl-10 pr-3" : "px-3"
          }`}
        />
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  title,
  description,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-cyan-200 hover:bg-cyan-50/30"
    >
      <div className="min-w-0">
        <p className="text-sm font-bold text-slate-800">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>

      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-cyan-500" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </span>
    </button>
  );
}

function SectionCard({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: typeof Building2;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-blue-100 bg-white shadow-sm">
      <div className="flex items-start gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-base font-extrabold text-slate-800">
            {title}
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {children}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("General");

  const [settings, setSettings] =
    useState<SettingsData>(defaultSettings);

  const [profile, setProfile] = useState<ProfileData>({
    fullName: "",
    email: "",
    hospitalName: "",
    role: "",
  });

  const [sessionLoaded, setSessionLoaded] =
    useState(false);

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [isSaving, setIsSaving] =
    useState(false);

  // ======================================================
  // LOAD SETTINGS + LOGIN SESSION
  // ======================================================

  useEffect(() => {
    try {
      // ----------------------------------------------
      // Load normal settings
      // ----------------------------------------------

      const savedSettings = localStorage.getItem(
        SETTINGS_STORAGE_KEY,
      );

      if (savedSettings) {
        setSettings({
          ...defaultSettings,
          ...JSON.parse(savedSettings),
        });
      }

      // ----------------------------------------------
      // Load logged-in user
      // ----------------------------------------------

      const savedSession = localStorage.getItem(
        SESSION_STORAGE_KEY,
      );

      if (savedSession) {
        const parsedSession: MedCoreSession =
          JSON.parse(savedSession);

        if (
          parsedSession.isAuthenticated &&
          parsedSession.user
        ) {
          const user = parsedSession.user;

          setProfile({
            fullName: user.fullName || "",
            email: user.email || "",
            hospitalName: user.hospitalName || "",
            role: formatRole(user.role),
          });
        }
      }
    } catch (error) {
      console.error(
        "Settings loading error:",
        error,
      );
    } finally {
      setSessionLoaded(true);
    }
  }, []);

  // ======================================================
  // UPDATE SETTINGS
  // ======================================================

  const updateSetting = <K extends keyof SettingsData>(
    key: K,
    value: SettingsData[K],
  ) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  };

  // ======================================================
  // SAVE GENERAL SETTINGS
  // ======================================================

  const saveSettings = () => {
    setIsSaving(true);

    window.setTimeout(() => {
      localStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify(settings),
      );

      setIsSaving(false);

      toast.success("Settings saved successfully", {
        description:
          "Your MedCore preferences have been updated.",
      });
    }, 500);
  };

  // ======================================================
  // SAVE PROFILE
  // ======================================================

 const saveProfile = () => {
  if (!profile.fullName.trim()) {
    toast.error("Full name is required.");
    return;
  }

  if (!profile.email.trim()) {
    toast.error("Email address is required.");
    return;
  }

  if (!profile.hospitalName.trim()) {
    toast.error("Hospital name is required.");
    return;
  }

  try {
    // ----------------------------------------------
    // Load existing account
    // ----------------------------------------------

    const storedAccount = localStorage.getItem(
      ACCOUNT_STORAGE_KEY,
    );

    if (!storedAccount) {
      toast.error("Account not found.");
      return;
    }

    const account = JSON.parse(storedAccount) as {
      fullName?: string;
      email?: string;
      hospitalName?: string;
      role?: UserRole | string;
      password?: string;
      emailVerified?: boolean;
      [key: string]: unknown;
    };

    // ----------------------------------------------
    // Load existing session
    // ----------------------------------------------

    const sessionString = localStorage.getItem(
      SESSION_STORAGE_KEY,
    );

    let existingSession: MedCoreSession & {
      [key: string]: unknown;
    } = {
      isAuthenticated: true,
      remember: false,
    };

    if (sessionString) {
      existingSession = JSON.parse(
        sessionString,
      ) as MedCoreSession & {
        [key: string]: unknown;
      };
    }

    // ----------------------------------------------
    // Preserve original role + verification status
    // ----------------------------------------------

    const originalRole =
      account.role ||
      existingSession.user?.role ||
      "";

    const emailVerified =
      typeof account.emailVerified === "boolean"
        ? account.emailVerified
        : existingSession.user?.emailVerified ?? false;

    // ----------------------------------------------
    // Update account
    // ----------------------------------------------

    const updatedAccount = {
      ...account,
      fullName: profile.fullName.trim(),
      email: profile.email.trim().toLowerCase(),
      hospitalName: profile.hospitalName.trim(),
      role: originalRole,
      emailVerified,
    };

    localStorage.setItem(
      ACCOUNT_STORAGE_KEY,
      JSON.stringify(updatedAccount),
    );

    // ----------------------------------------------
    // Create safe session user
    // Password is NEVER stored in session.user
    // ----------------------------------------------

    const {
      password: _password,
      ...safeUser
    } = updatedAccount;

    // ----------------------------------------------
    // Update session
    // ----------------------------------------------

    localStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({
        ...existingSession,
        user: safeUser,
      }),
    );

    // ----------------------------------------------
    // Notify TopHeader
    // ----------------------------------------------

    window.dispatchEvent(
      new Event("medcore-session-updated"),
    );

    toast.success("Profile updated successfully", {
      description:
        "Your profile information has been updated.",
    });
  } catch (error) {
    console.error(
      "Profile update error:",
      error,
    );

    toast.error("Unable to update profile", {
      description: "Please try again.",
    });
  }
};
  // ======================================================
  // RESET SETTINGS
  // ======================================================

  const resetSettings = () => {
    setSettings(defaultSettings);

    localStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify(defaultSettings),
    );

    toast.success("Settings restored", {
      description:
        "Default MedCore settings have been restored.",
    });
  };

  // ======================================================
  // CHANGE PASSWORD
  // ======================================================

  const changePassword = () => {
    if (!currentPassword.trim()) {
      toast.error(
        "Enter your current password.",
      );
      return;
    }

    if (newPassword.length < 8) {
      toast.error(
        "New password must contain at least 8 characters.",
      );
      return;
    }

    if (
      !/[A-Z]/.test(newPassword) ||
      !/[a-z]/.test(newPassword) ||
      !/\d/.test(newPassword)
    ) {
      toast.error(
        "Password must contain uppercase, lowercase, and a number.",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(
        "New passwords do not match.",
      );
      return;
    }

    try {
      const storedAccount =
        localStorage.getItem(
          ACCOUNT_STORAGE_KEY,
        );

      if (!storedAccount) {
        toast.error("Account not found.");
        return;
      }

      const account = JSON.parse(
        storedAccount,
      );

      if (
        account.password !== currentPassword
      ) {
        toast.error(
          "Current password is incorrect.",
        );
        return;
      }

      account.password = newPassword;

      localStorage.setItem(
        ACCOUNT_STORAGE_KEY,
        JSON.stringify(account),
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      toast.success(
        "Password changed successfully",
        {
          description:
            "Your account password has been updated.",
        },
      );
    } catch (error) {
      console.error(
        "Password update error:",
        error,
      );

      toast.error(
        "Unable to change password.",
      );
    }
  };

  const activeMenu = useMemo(
    () =>
      settingsMenu.find(
        (item) =>
          item.id === activeSection,
      ),
    [activeSection],
  );

  // ======================================================
  // GENERAL
  // ======================================================

  const renderGeneral = () => (
    <SectionCard
      title="General Settings"
      description="Configure the basic preferences used across your MedCore workspace."
      icon={Globe2}
    >
      <div className="grid gap-5 md:grid-cols-2">
        <SelectField
          label="Time Zone"
          value={settings.timezone}
          onChange={(value) =>
            updateSetting("timezone", value)
          }
          options={[
            "Asia/Kolkata",
            "Asia/Dubai",
            "Asia/Singapore",
            "UTC",
          ]}
        />

        <SelectField
          label="Date Format"
          value={settings.dateFormat}
          onChange={(value) =>
            updateSetting("dateFormat", value)
          }
          options={[
            "DD/MM/YYYY",
            "MM/DD/YYYY",
            "YYYY-MM-DD",
          ]}
        />

        <SelectField
          label="Currency"
          value={settings.currency}
          onChange={(value) =>
            updateSetting("currency", value)
          }
          options={[
            "INR (₹)",
            "USD ($)",
            "EUR (€)",
            "GBP (£)",
          ]}
        />

        <SelectField
          label="Language"
          value={settings.language}
          onChange={(value) =>
            updateSetting("language", value)
          }
          options={[
            "English",
            "Telugu",
            "Hindi",
          ]}
        />
      </div>
    </SectionCard>
  );

  // ======================================================
  // HOSPITAL
  // ======================================================

  const renderHospital = () => (
    <SectionCard
      title="Hospital Information"
      description="Manage hospital registration, location, contact, and working-hour details."
      icon={Building2}
    >
      <div className="mb-5 rounded-2xl border border-cyan-100 bg-cyan-50/60 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-cyan-600">
            <Hospital className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-extrabold text-slate-800">
              {profile.hospitalName ||
                "Hospital"}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Hospital information is connected to
              your logged-in account.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <InputField
          label="Hospital Name"
          value={profile.hospitalName}
          onChange={(value) =>
            setProfile((current) => ({
              ...current,
              hospitalName: value,
            }))
          }
          icon={Hospital}
          required
        />

        <InputField
          label="Registration Number"
          value={settings.registrationNumber}
          onChange={(value) =>
            updateSetting(
              "registrationNumber",
              value,
            )
          }
          icon={ShieldCheck}
        />

        <div className="md:col-span-2">
          <InputField
            label="Address"
            value={settings.address}
            onChange={(value) =>
              updateSetting(
                "address",
                value,
              )
            }
            icon={MapPin}
          />
        </div>

        <InputField
          label="City"
          value={settings.city}
          onChange={(value) =>
            updateSetting("city", value)
          }
        />

        <InputField
          label="State"
          value={settings.state}
          onChange={(value) =>
            updateSetting("state", value)
          }
        />

        <InputField
          label="PIN Code"
          value={settings.pincode}
          onChange={(value) =>
            updateSetting(
              "pincode",
              value
                .replace(/\D/g, "")
                .slice(0, 6),
            )
          }
          icon={MapPin}
        />

        <InputField
          label="Emergency Contact"
          value={settings.emergencyContact}
          onChange={(value) =>
            updateSetting(
              "emergencyContact",
              value.replace(
                /[^\d+\s-]/g,
                "",
              ),
            )
          }
          icon={Phone}
        />

        <div className="grid gap-5 sm:grid-cols-2 md:col-span-2">
          <div>
            <FieldLabel>
              Opening Time
            </FieldLabel>

            <div className="relative">
              <Clock3 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="time"
                value={settings.openingTime}
                onChange={(event) =>
                  updateSetting(
                    "openingTime",
                    event.target.value,
                  )
                }
                className="h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-700 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
              />
            </div>
          </div>

          <div>
            <FieldLabel>
              Closing Time
            </FieldLabel>

            <div className="relative">
              <Clock3 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="time"
                value={settings.closingTime}
                onChange={(event) =>
                  updateSetting(
                    "closingTime",
                    event.target.value,
                  )
                }
                className="h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-700 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
              />
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );

  // ======================================================
  // PROFILE
  // ======================================================

  const renderProfile = () => (
    <SectionCard
      title="Profile Information"
      description="This information comes directly from your MedCore login session."
      icon={UserRound}
    >
      {!sessionLoaded ? (
        <div className="flex items-center justify-center py-16">
          <RefreshCw className="h-6 w-6 animate-spin text-cyan-500" />
        </div>
      ) : (
        <>
          {/* Profile Header */}
          <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-cyan-100 bg-gradient-to-r from-cyan-50 to-blue-50 p-5 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-lg font-extrabold text-white shadow-lg shadow-cyan-100">
              {getInitials(
                profile.fullName,
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate text-base font-extrabold text-slate-800">
                {profile.fullName ||
                  "Logged-in User"}
              </p>

              <p className="mt-1 truncate text-xs text-slate-500">
                {profile.email ||
                  "No email available"}
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full bg-cyan-100 px-2.5 py-1 text-[10px] font-extrabold text-cyan-700">
                  {profile.role ||
                    "User"}
                </span>

                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-extrabold text-emerald-700">
                  Logged In
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <InputField
              label="Full Name"
              value={profile.fullName}
              onChange={(value) =>
                setProfile((current) => ({
                  ...current,
                  fullName: value,
                }))
              }
              icon={UserRound}
              required
            />

            <InputField
              label="Email Address"
              value={profile.email}
              onChange={(value) =>
                setProfile((current) => ({
                  ...current,
                  email: value,
                }))
              }
              type="email"
              icon={Mail}
              required
            />

            <InputField
              label="Hospital / Organization"
              value={profile.hospitalName}
              onChange={(value) =>
                setProfile((current) => ({
                  ...current,
                  hospitalName: value,
                }))
              }
              icon={Hospital}
              required
            />

            <div>
              <FieldLabel>
                Role
              </FieldLabel>

              <div className="flex h-11 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3">
                <ShieldCheck className="h-4 w-4 text-cyan-500" />

                <span className="text-sm font-semibold text-slate-700">
                  {profile.role ||
                    "User"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Activity className="h-4 w-4" />
              </div>

              <div>
                <p className="text-xs font-extrabold text-blue-800">
                  Login session connected
                </p>

                <p className="mt-1 text-[11px] leading-5 text-slate-500">
                  Profile information is loaded
                  from{" "}
                  <span className="font-bold text-slate-700">
                    medcore_session
                  </span>
                  , the same session used by
                  the MedCore header.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={saveProfile}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-xs font-extrabold text-white shadow-sm transition hover:from-cyan-600 hover:to-blue-700 sm:w-auto"
            >
              <Save className="h-4 w-4" />
              Save Profile
            </button>
          </div>
        </>
      )}
    </SectionCard>
  );

  // ======================================================
  // SECURITY
  // ======================================================

  const renderSecurity = () => (
    <div className="space-y-5">
      <SectionCard
        title="Password & Security"
        description="Protect your MedCore administrator account with a strong password."
        icon={Lock}
      >
        <div className="grid gap-5">
          <div>
            <FieldLabel required>
              Current Password
            </FieldLabel>

            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type={
                  showCurrentPassword
                    ? "text"
                    : "password"
                }
                value={currentPassword}
                onChange={(event) =>
                  setCurrentPassword(
                    event.target.value,
                  )
                }
                placeholder="Enter current password"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-11 text-sm text-slate-700 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
              />

              <button
                type="button"
                onClick={() =>
                  setShowCurrentPassword(
                    (value) => !value,
                  )
                }
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-cyan-600"
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <FieldLabel required>
                New Password
              </FieldLabel>

              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type={
                    showNewPassword
                      ? "text"
                      : "password"
                  }
                  value={newPassword}
                  onChange={(event) =>
                    setNewPassword(
                      event.target.value,
                    )
                  }
                  placeholder="Minimum 8 characters"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-11 text-sm text-slate-700 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowNewPassword(
                      (value) => !value,
                    )
                  }
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-cyan-600"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <FieldLabel required>
                Confirm Password
              </FieldLabel>

              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value,
                    )
                  }
                  placeholder="Repeat new password"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-11 text-sm text-slate-700 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (value) => !value,
                    )
                  }
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-cyan-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
            <p className="text-xs font-bold text-blue-800">
              Password requirements
            </p>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {[
                [
                  "At least 8 characters",
                  newPassword.length >= 8,
                ],
                [
                  "Contains uppercase letter",
                  /[A-Z]/.test(
                    newPassword,
                  ),
                ],
                [
                  "Contains lowercase letter",
                  /[a-z]/.test(
                    newPassword,
                  ),
                ],
                [
                  "Contains a number",
                  /\d/.test(newPassword),
                ],
              ].map(
                ([label, valid]) => (
                  <div
                    key={String(label)}
                    className="flex items-center gap-2 text-xs text-slate-600"
                  >
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full ${
                        valid
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-white text-slate-300"
                      }`}
                    >
                      <Check className="h-3 w-3" />
                    </span>

                    {label}
                  </div>
                ),
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={changePassword}
            className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:from-cyan-600 hover:to-blue-700 sm:w-fit"
          >
            Change Password
          </button>
        </div>
      </SectionCard>

      <SectionCard
        title="Account Protection"
        description="Additional security controls for your MedCore account."
        icon={ShieldCheck}
      >
        <div className="grid gap-3">
          <div className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-800">
                  Account protection
                </p>

                <p className="text-xs text-slate-500">
                  Your account security status is active.
                </p>
              </div>
            </div>

            <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-extrabold text-emerald-700">
              ACTIVE
            </span>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-blue-100 bg-blue-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Smartphone className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-800">
                  Two-factor authentication
                </p>

                <p className="text-xs text-slate-500">
                  Add an extra verification step to your account.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                toast.info(
                  "Two-factor authentication setup will be available soon.",
                )
              }
              className="cursor-pointer rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50"
            >
              Configure
            </button>
          </div>
        </div>
      </SectionCard>
    </div>
  );

  // ======================================================
  // NOTIFICATIONS
  // ======================================================

  const renderNotifications = () => (
    <SectionCard
      title="Notification Preferences"
      description="Choose which hospital activities should send notifications."
      icon={Bell}
    >
      <div className="grid gap-3">
        <Toggle
          checked={
            settings.appointmentNotifications
          }
          onChange={(value) =>
            updateSetting(
              "appointmentNotifications",
              value,
            )
          }
          title="Appointment Notifications"
          description="Receive alerts for new, updated, and cancelled appointments."
        />

        <Toggle
          checked={
            settings.laboratoryNotifications
          }
          onChange={(value) =>
            updateSetting(
              "laboratoryNotifications",
              value,
            )
          }
          title="Laboratory Notifications"
          description="Get notified when laboratory orders and reports are updated."
        />

        <Toggle
          checked={
            settings.prescriptionNotifications
          }
          onChange={(value) =>
            updateSetting(
              "prescriptionNotifications",
              value,
            )
          }
          title="Prescription Notifications"
          description="Receive updates about prescriptions and medication activity."
        />

        <Toggle
          checked={
            settings.billingNotifications
          }
          onChange={(value) =>
            updateSetting(
              "billingNotifications",
              value,
            )
          }
          title="Billing Notifications"
          description="Get alerts for payments, pending bills, and overdue invoices."
        />

        <Toggle
          checked={
            settings.patientNotifications
          }
          onChange={(value) =>
            updateSetting(
              "patientNotifications",
              value,
            )
          }
          title="Patient Notifications"
          description="Receive important patient registration and profile updates."
        />

        <div className="my-2 border-t border-slate-100" />

        <Toggle
          checked={settings.emailNotifications}
          onChange={(value) =>
            updateSetting(
              "emailNotifications",
              value,
            )
          }
          title="Email Notifications"
          description="Send supported hospital notifications to your email."
        />

        <Toggle
          checked={settings.browserNotifications}
          onChange={(value) =>
            updateSetting(
              "browserNotifications",
              value,
            )
          }
          title="Browser Notifications"
          description="Show notification alerts directly in the browser."
        />
      </div>
    </SectionCard>
  );

  // ======================================================
  // APPEARANCE
  // ======================================================

  const renderAppearance = () => (
    <SectionCard
      title="Appearance"
      description="Customize how MedCore looks and behaves on your device."
      icon={Palette}
    >
      <div>
        <FieldLabel>
          Theme
        </FieldLabel>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              value: "light" as const,
              label: "Light",
              icon: Sun,
              description: "Bright workspace",
            },
            {
              value: "dark" as const,
              label: "Dark",
              icon: Moon,
              description: "Dark workspace",
            },
            {
              value: "system" as const,
              label: "System",
              icon: Monitor,
              description: "Follow device",
            },
          ].map((item) => {
            const Icon = item.icon;
            const selected =
              settings.theme ===
              item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() =>
                  updateSetting(
                    "theme",
                    item.value,
                  )
                }
                className={`cursor-pointer rounded-2xl border p-4 text-left transition ${
                  selected
                    ? "border-cyan-400 bg-cyan-50 ring-4 ring-cyan-50"
                    : "border-slate-200 bg-white hover:border-cyan-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      selected
                        ? "bg-cyan-500 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  {selected && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500 text-white">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  )}
                </div>

                <p className="mt-3 text-sm font-bold text-slate-800">
                  {item.label}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {item.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        <Toggle
          checked={settings.compactMode}
          onChange={(value) =>
            updateSetting(
              "compactMode",
              value,
            )
          }
          title="Compact Mode"
          description="Reduce spacing to display more information on screen."
        />

        <Toggle
          checked={
            settings.collapsedSidebar
          }
          onChange={(value) =>
            updateSetting(
              "collapsedSidebar",
              value,
            )
          }
          title="Collapsed Sidebar"
          description="Keep the navigation sidebar compact by default."
        />
      </div>
    </SectionCard>
  );

  // ======================================================
  // INTEGRATIONS
  // ======================================================

  const renderIntegrations = () => {
    const integrations = [
      {
        key: "emailIntegration" as const,
        title: "Email Service",
        description:
          "Hospital email delivery and automated messages.",
        icon: Mail,
      },
      {
        key: "smsIntegration" as const,
        title: "SMS Service",
        description:
          "Appointment reminders and patient SMS alerts.",
        icon: Smartphone,
      },
      {
        key: "paymentIntegration" as const,
        title: "Payment Gateway",
        description:
          "Process online hospital billing payments.",
        icon: Activity,
      },
      {
        key: "cloudIntegration" as const,
        title: "Cloud Storage",
        description:
          "Secure storage for hospital documents and reports.",
        icon: Server,
      },
      {
        key: "apiIntegration" as const,
        title: "Hospital API",
        description:
          "Connect external applications to MedCore.",
        icon: Wifi,
      },
    ];

    return (
      <SectionCard
        title="Integrations"
        description="Manage external services connected to your MedCore hospital system."
        icon={Wifi}
      >
        <div className="grid gap-3">
          {integrations.map(
            (integration) => {
              const Icon =
                integration.icon;

              const connected =
                settings[
                  integration.key
                ];

              return (
                <div
                  key={integration.key}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-cyan-200 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        connected
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800">
                        {integration.title}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {integration.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:shrink-0">
                    <span
                      className={`rounded-full px-3 py-1.5 text-[10px] font-extrabold ${
                        connected
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {connected
                        ? "CONNECTED"
                        : "NOT CONNECTED"}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        updateSetting(
                          integration.key,
                          !connected,
                        )
                      }
                      className={`cursor-pointer rounded-xl px-3 py-2 text-xs font-bold transition ${
                        connected
                          ? "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                          : "bg-cyan-500 text-white hover:bg-cyan-600"
                      }`}
                    >
                      {connected
                        ? "Disconnect"
                        : "Connect"}
                    </button>
                  </div>
                </div>
              );
            },
          )}
        </div>
      </SectionCard>
    );
  };

  // ======================================================
  // CONTENT
  // ======================================================

  const renderContent = () => {
    switch (activeSection) {
      case "General":
        return renderGeneral();

      case "Hospital":
        return renderHospital();

      case "Profile":
        return renderProfile();

      case "Security":
        return renderSecurity();

      case "Notifications":
        return renderNotifications();

      case "Appearance":
        return renderAppearance();

      case "Integrations":
        return renderIntegrations();

      default:
        return renderGeneral();
    }
  };

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="min-h-screen bg-blue-50/70 p-3 sm:p-4 lg:p-6">
      <div className="mx-auto max-w-[1500px]">

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: -10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-5 overflow-hidden rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-600 via-cyan-500 to-cyan-400 shadow-lg shadow-blue-100"
        >
          <div className="relative p-5 sm:p-6 lg:p-7">
            <div className="absolute -right-10 -top-20 h-56 w-56 rounded-full bg-white/10 blur-2xl" />

            <div className="absolute -bottom-24 right-32 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-blue-100">
                  <span>System</span>

                  <ChevronRight className="h-3.5 w-3.5" />

                  <span className="text-white">
                    Settings
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-sm">
                    <Activity className="h-6 w-6" />
                  </div>

                  <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                      Settings
                    </h1>

                    <p className="mt-1 max-w-2xl text-xs leading-5 text-blue-50 sm:text-sm">
                      Manage your hospital preferences,
                      account, security, notifications,
                      and system configuration.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={resetSettings}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reset
                </button>

                <button
                  type="button"
                  onClick={
                    activeSection === "Profile"
                      ? saveProfile
                      : saveSettings
                  }
                  disabled={isSaving}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-extrabold text-blue-600 shadow-sm transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSaving ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}

                  {isSaving
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ================================================== */}
        {/* MAIN */}
        {/* ================================================== */}

        <div className="grid gap-5 lg:grid-cols-[270px_minmax(0,1fr)]">

          {/* ================================================== */}
          {/* SETTINGS SIDEBAR */}
          {/* ================================================== */}

          <motion.aside
            initial={{
              opacity: 0,
              x: -10,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            className="h-fit rounded-3xl border border-blue-100 bg-white p-3 shadow-sm"
          >
            <div className="mb-3 px-3 py-2">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
                Settings
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Manage your workspace
              </p>
            </div>

            <div className="space-y-1">
              {settingsMenu.map(
                (item) => {
                  const Icon =
                    item.icon;

                  const active =
                    activeSection ===
                    item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        setActiveSection(
                          item.id,
                        )
                      }
                      className={`group flex w-full cursor-pointer items-center gap-3 rounded-2xl border px-3 py-3 text-left transition ${
                        active
                          ? "border-cyan-200 bg-cyan-50 text-cyan-700"
                          : "border-transparent text-slate-600 hover:border-slate-100 hover:bg-slate-50"
                      }`}
                    >
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
                          active
                            ? "bg-cyan-500 text-white shadow-sm"
                            : "bg-slate-100 text-slate-500 group-hover:bg-cyan-50 group-hover:text-cyan-600"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-extrabold">
                          {item.label}
                        </p>

                        <p
                          className={`mt-0.5 truncate text-[10px] ${
                            active
                              ? "text-cyan-600"
                              : "text-slate-400"
                          }`}
                        >
                          {
                            item.description
                          }
                        </p>
                      </div>

                      {active && (
                        <ChevronRight className="h-4 w-4 shrink-0 text-cyan-500" />
                      )}
                    </button>
                  );
                },
              )}
            </div>

            {/* Help */}
            <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <CircleHelp className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Need help?
                  </p>

                  <p className="mt-1 text-[10px] leading-4 text-slate-500">
                    Contact your hospital
                    administrator for system
                    configuration support.
                  </p>
                </div>
              </div>
            </div>
          </motion.aside>

          {/* ================================================== */}
          {/* CONTENT */}
          {/* ================================================== */}

          <main className="min-w-0">
            <motion.div
              key={activeSection}
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.2,
              }}
              className="space-y-5"
            >
              <div className="flex items-center justify-between px-1">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-800">
                    {activeMenu?.label}
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    {
                      activeMenu?.description
                    }
                  </p>
                </div>

                <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 sm:flex">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />

                  <span className="text-[10px] font-bold text-emerald-700">
                    System Active
                  </span>
                </div>
              </div>

              {renderContent()}

              {/* Bottom Action */}
              {activeSection !==
                "Security" &&
                activeSection !==
                  "Integrations" && (
                  <div className="flex flex-col gap-3 rounded-3xl border border-blue-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                        <Check className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          Ready to save?
                        </p>

                        <p className="text-xs text-slate-500">
                          Your changes are saved
                          locally for this demo.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={
                        activeSection ===
                        "Profile"
                          ? saveProfile
                          : saveSettings
                      }
                      disabled={isSaving}
                      className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-xs font-extrabold text-white shadow-sm transition hover:from-cyan-600 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isSaving ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}

                      {isSaving
                        ? "Saving..."
                        : activeSection ===
                            "Profile"
                          ? "Save Profile"
                          : "Save Settings"}
                    </button>
                  </div>
                )}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}