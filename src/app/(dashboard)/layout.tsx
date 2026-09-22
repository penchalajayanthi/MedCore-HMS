// "use client";

// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import {
//   Activity,
//   BarChart3,
//   Bell,
//   Building2,
//   CalendarDays,
//   ChevronLeft,
//   ChevronRight,
//   CreditCard,
//   FileText,
//   FlaskConical,
//   HeartPulse,
//   LayoutDashboard,
//   LogOut,
//   Menu,
//   Pill,
//   Settings,
//   Stethoscope,
//   UserRound,
//   Users,
//   X,
// } from "lucide-react";
// import { useEffect, useState } from "react";
// import { toast } from "sonner";

// /* ============================================================
//    NAVIGATION
// ============================================================ */

// const navigation = [
//   {
//     section: "MAIN",
//     items: [
//       {
//         name: "Dashboard",
//         href: "/dashboard",
//         icon: LayoutDashboard,
//         color: "text-cyan-500",
//       },
//     ],
//   },
//   {
//     section: "CLINICAL",
//     items: [
//       {
//         name: "Patients",
//         href: "/patients",
//         icon: Users,
//         color: "text-blue-500",
//       },
//       {
//         name: "Doctors",
//         href: "/doctors",
//         icon: Stethoscope,
//         color: "text-violet-500",
//       },
//       {
//         name: "Appointments",
//         href: "/appointments",
//         icon: CalendarDays,
//         color: "text-emerald-500",
//       },
//       {
//         name: "Medical Records",
//         href: "/emr",
//         icon: FileText,
//         color: "text-orange-500",
//       },
//       {
//         name: "Prescriptions",
//         href: "/prescriptions",
//         icon: Pill,
//         color: "text-pink-500",
//       },
//     ],
//   },
//   {
//     section: "OPERATIONS",
//     items: [
//       {
//         name: "Laboratory",
//         href: "/laboratory",
//         icon: FlaskConical,
//         color: "text-purple-500",
//       },
//       {
//         name: "Pharmacy",
//         href: "/pharmacy",
//         icon: Pill,
//         color: "text-teal-500",
//       },
//       {
//         name: "Billing",
//         href: "/billing",
//         icon: CreditCard,
//         color: "text-amber-500",
//       },
//       {
//         name: "Departments",
//         href: "/departments",
//         icon: Building2,
//         color: "text-indigo-500",
//       },
//     ],
//   },
//   {
//     section: "INSIGHTS",
//     items: [
//       {
//         name: "Analytics",
//         href: "/analytics",
//         icon: BarChart3,
//         color: "text-fuchsia-500",
//       },
//     ],
//   },
//   {
//     section: "SYSTEM",
//     items: [
//       {
//         name: "Notifications",
//         href: "/notifications",
//         icon: Bell,
//         color: "text-red-500",
//       },
//       {
//         name: "Settings",
//         href: "/settings",
//         icon: Settings,
//         color: "text-slate-500",
//       },
//     ],
//   },
// ];

// /* ============================================================
//    TYPES
// ============================================================ */

// type SessionUser = {
//   fullName?: string;
//   email?: string;
//   hospitalName?: string;
//   role?: string;
//   emailVerified?: boolean;
// };

// type SessionData = {
//   user?: SessionUser;
//   isAuthenticated?: boolean;
//   remember?: boolean;
// };

// /* ============================================================
//    HELPERS
// ============================================================ */


// function getInitials(name: string) {
//   if (!name || name === "Hospital Admin") {
//     return "HA";
//   }

//   const words = name
//     .trim()
//     .split(/\s+/)
//     .filter(Boolean);

//   if (words.length >= 2) {
//     return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
//   }

//   // Handles names like "PenchalaJayanthi"
//   const camelCaseMatches = name.match(/[A-Z][a-z]*/g);

//   if (camelCaseMatches && camelCaseMatches.length >= 2) {
//     return `${camelCaseMatches[0][0]}${camelCaseMatches[camelCaseMatches.length - 1][0]}`.toUpperCase();
//   }

//   return name.substring(0, 2).toUpperCase();
// }

// /**
//  * Makes role look nicer.
//  *
//  * doctor -> Doctor
//  * hospital_admin -> Hospital Admin
//  * administrator -> Administrator
//  */
// function formatRole(role: string) {
//   if (!role) {
//     return "User";
//   }

//   return role
//     .replace(/[_-]/g, " ")
//     .replace(/\b\w/g, (letter) => letter.toUpperCase());
// }

// /* ============================================================
//    DASHBOARD LAYOUT
// ============================================================ */

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const pathname = usePathname();
//   const router = useRouter();

//   const [collapsed, setCollapsed] = useState(false);
//   const [mobileOpen, setMobileOpen] = useState(false);

//   /* ==========================================================
//      USER STATE
//   ========================================================== */

//   const [userName, setUserName] =
//     useState("Hospital Admin");

//   const [userRole, setUserRole] =
//     useState("Administrator");

//   const [hospitalName, setHospitalName] =
//     useState("MedCore Hospital");

//   const [userInitials, setUserInitials] =
//     useState("HA");

//   /* ==========================================================
//      LOAD USER FROM LOCAL STORAGE
//   ========================================================== */

//   useEffect(() => {
//     const loadUser = () => {
//       try {
//         const session =
//           localStorage.getItem("medcore_session");

//         if (session) {
//           const parsedSession: SessionData =
//             JSON.parse(session);

//           const user = parsedSession?.user;

//           if (user) {
//             const name =
//               user.fullName?.trim() ||
//               "Hospital Admin";

//             const role =
//               user.role?.trim() ||
//               "Administrator";

//             const hospital =
//               user.hospitalName?.trim() ||
//               "MedCore Hospital";

//             setUserName(name);
//             setUserRole(formatRole(role));
//             setHospitalName(hospital);
//             setUserInitials(getInitials(name));

//             return;
//           }
//         }

//         /* ======================================================
//            FALLBACK
//         ====================================================== */

//         const account =
//           localStorage.getItem("medcore_account");

//         if (account) {
//           const parsedAccount: SessionUser =
//             JSON.parse(account);

//           const name =
//             parsedAccount.fullName?.trim() ||
//             "Hospital Admin";

//           const role =
//             parsedAccount.role?.trim() ||
//             "Administrator";

//           const hospital =
//             parsedAccount.hospitalName?.trim() ||
//             "MedCore Hospital";

//           setUserName(name);
//           setUserRole(formatRole(role));
//           setHospitalName(hospital);
//           setUserInitials(getInitials(name));
//         }
//       } catch (error) {
//         console.error(
//           "Unable to load user information:",
//           error
//         );
//       }
//     };

//     loadUser();

//     /* ==========================================================
//        UPDATE IF LOCAL STORAGE CHANGES
//     ========================================================== */

//     window.addEventListener(
//       "storage",
//       loadUser
//     );

//     return () => {
//       window.removeEventListener(
//         "storage",
//         loadUser
//       );
//     };
//   }, []);

//   /* ==========================================================
//      LOGOUT
//   ========================================================== */

//   const handleLogout = () => {
//     localStorage.removeItem("medcore_session");

//     toast.success("Logged out successfully");

//     router.push("/login");
//   };

//   const sidebarWidth = collapsed
//     ? "w-[82px]"
//     : "w-[270px]";

//   return (
//     <div className="min-h-screen bg-slate-100 dark:bg-slate-950">

//       {/* ======================================================
//           MOBILE OVERLAY
//       ====================================================== */}

//       {mobileOpen && (
//         <div
//           className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
//           onClick={() => setMobileOpen(false)}
//         />
//       )}

//       {/* ======================================================
//           SIDEBAR
//       ====================================================== */}

//       <aside
//         className={`
//           fixed inset-y-0 left-0 z-50
//           flex flex-col
//           border-r border-slate-200
//           bg-white
//           shadow-xl shadow-slate-200/40
//           transition-all duration-300
//           dark:border-slate-800
//           dark:bg-slate-900
//           dark:shadow-black/20

//           ${sidebarWidth}

//           ${
//             mobileOpen
//               ? "translate-x-0"
//               : "-translate-x-full lg:translate-x-0"
//           }
//         `}
//       >

//         {/* ==================================================
//             LOGO
//         ================================================== */}

//         <div
//           className={`
//             flex h-[76px] shrink-0 items-center
//             border-b border-slate-100
//             dark:border-slate-800
//             ${collapsed ? "justify-center" : "px-5"}
//           `}
//         >

//           <Link
//             href="/dashboard"
//             className="flex min-w-0 items-center gap-3"
//             onClick={() => setMobileOpen(false)}
//           >

//             <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-500 to-violet-600 shadow-lg shadow-cyan-500/20">

//               <HeartPulse className="h-6 w-6 text-white" />

//               <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-400 dark:border-slate-900" />

//             </div>

//             {!collapsed && (
//               <div className="min-w-0">

//                 <p className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
//                   MedCore
//                 </p>

//                 <p className="truncate text-[9px] font-bold uppercase tracking-[0.22em] text-cyan-600 dark:text-cyan-400">
//                   Hospital Management
//                 </p>

//               </div>
//             )}

//           </Link>

//           {/* Mobile Close */}

//           <button
//             type="button"
//             onClick={() => setMobileOpen(false)}
//             className="ml-auto rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
//           >
//             <X className="h-5 w-5" />
//           </button>

//         </div>

//         {/* ==================================================
//             HOSPITAL INFO
//         ================================================== */}

//         {!collapsed && (
//           <div className="mx-3 mt-4 rounded-xl border border-cyan-100 bg-gradient-to-r from-cyan-50 to-blue-50 p-3 dark:border-slate-800 dark:from-slate-800 dark:to-cyan-950/20">

//             <div className="flex items-center gap-3">

//               <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-sm">
//                 <Building2 className="h-4 w-4" />
//               </div>

//               <div className="min-w-0">

//                 <p className="truncate text-sm font-semibold text-slate-800 dark:text-white">
//                   {hospitalName}
//                 </p>

//                 <p className="text-xs text-slate-500 dark:text-slate-400">
//                   Hospital Management
//                 </p>

//               </div>

//             </div>

//           </div>
//         )}

//         {/* ==================================================
//             NAVIGATION
//         ================================================== */}

//         <nav className="flex-1 overflow-y-auto px-3 py-5">

//           {navigation.map((group) => (
//             <div
//               key={group.section}
//               className="mb-6"
//             >

//               {!collapsed && (
//                 <p className="mb-2 px-3 text-[10px] font-bold tracking-[0.18em] text-slate-400">
//                   {group.section}
//                 </p>
//               )}

//               <div className="space-y-1">

//                 {group.items.map((item) => {
//                   const Icon = item.icon;

//                   const isActive =
//                     pathname === item.href ||
//                     (item.href !== "/dashboard" &&
//                       pathname.startsWith(item.href));

//                   return (
//                     <Link
//                       key={item.href}
//                       href={item.href}
//                       onClick={() =>
//                         setMobileOpen(false)
//                       }
//                       title={
//                         collapsed
//                           ? item.name
//                           : undefined
//                       }
//                       className={`
//                         group relative flex items-center
//                         gap-3 rounded-xl px-3 py-2.5
//                         text-sm font-medium
//                         transition-all duration-200

//                         ${
//                           isActive
//                             ? "bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 shadow-sm dark:from-cyan-950/50 dark:to-blue-950/40 dark:text-cyan-300"
//                             : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-white"
//                         }

//                         ${
//                           collapsed
//                             ? "justify-center"
//                             : ""
//                         }
//                       `}
//                     >

//                       {/* Active Indicator */}

//                       {isActive && (
//                         <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-cyan-500 to-blue-600" />
//                       )}

//                       <Icon
//                         className={`
//                           h-[19px] w-[19px] shrink-0

//                           ${
//                             isActive
//                               ? "text-cyan-600 dark:text-cyan-400"
//                               : item.color
//                           }
//                         `}
//                       />

//                       {!collapsed && (
//                         <span className="truncate">
//                           {item.name}
//                         </span>
//                       )}

//                       {!collapsed &&
//                         item.name ===
//                           "Notifications" && (
//                           <span className="ml-auto flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
//                             4
//                           </span>
//                         )}

//                     </Link>
//                   );
//                 })}

//               </div>
//             </div>
//           ))}

//         </nav>

//         {/* ==================================================
//             USER CARD
//         ================================================== */}

//         <div className="shrink-0 border-t border-slate-100 p-3 dark:border-slate-800">

//           {!collapsed ? (
//             <div className="mb-2 flex items-center gap-3 rounded-xl bg-gradient-to-r from-slate-50 to-cyan-50 p-3 dark:from-slate-800 dark:to-cyan-950/30">

//               {/* Dynamic Initials */}

//               <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white shadow-md">
//                 {userInitials}
//               </div>

//               <div className="min-w-0 flex-1">

//                 {/* Dynamic Full Name */}

//                 <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
//                   {userName}
//                 </p>

//                 {/* Dynamic Role */}

//                 <p className="truncate text-xs text-slate-500 dark:text-slate-400">
//                   {userRole}
//                 </p>

//               </div>

//               <UserRound className="h-4 w-4 shrink-0 text-slate-400" />

//             </div>
//           ) : (
//             <div className="mb-2 flex justify-center">

//               {/* Dynamic Initials When Collapsed */}

//               <div
//                 title={userName}
//                 className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white shadow-md"
//               >
//                 {userInitials}
//               </div>

//             </div>
//           )}

//           {/* Logout */}

//           <button
//             type="button"
//             onClick={handleLogout}
//             className={`
//               flex w-full items-center gap-3
//               rounded-xl px-3 py-2.5
//               text-sm font-medium text-red-500
//               transition hover:bg-red-50
//               dark:hover:bg-red-950/30

//               ${collapsed ? "justify-center" : ""}
//             `}
//           >

//             <LogOut className="h-[18px] w-[18px]" />

//             {!collapsed && (
//               <span>Sign out</span>
//             )}

//           </button>

//         </div>

//         {/* ==================================================
//             COLLAPSE BUTTON
//         ================================================== */}

//         <button
//           type="button"
//           onClick={() =>
//             setCollapsed(!collapsed)
//           }
//           className="absolute -right-3 top-20 hidden h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-md transition hover:text-cyan-600 lg:flex dark:border-slate-700 dark:bg-slate-900"
//         >
//           {collapsed ? (
//             <ChevronRight className="h-4 w-4" />
//           ) : (
//             <ChevronLeft className="h-4 w-4" />
//           )}
//         </button>

//       </aside>

//       {/* ======================================================
//           MAIN CONTENT
//       ====================================================== */}

//       <div
//         className={`
//           min-h-screen
//           transition-all duration-300

//           ${
//             collapsed
//               ? "lg:pl-[82px]"
//               : "lg:pl-[270px]"
//           }
//         `}
//       >

//         {/* ==================================================
//             TOP HEADER
//         ================================================== */}

//         <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white/90 px-3 shadow-sm backdrop-blur-xl sm:px-6 dark:border-slate-800 dark:bg-slate-900/90">

//           {/* LEFT */}

//           <div className="flex min-w-0 items-center gap-2 sm:gap-3">

//             {/* Mobile Menu */}

//             <button
//               type="button"
//               onClick={() =>
//                 setMobileOpen(true)
//               }
//               className="rounded-xl p-2.5 text-slate-600 hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800"
//             >
//               <Menu className="h-5 w-5" />
//             </button>

//             <div className="min-w-0">

//               <p className="truncate text-[10px] text-slate-400 sm:text-xs">
//                 {hospitalName} HMS
//               </p>

//               <p className="truncate text-xs font-semibold text-slate-800 sm:text-sm dark:text-white">
//                 Hospital Administration
//               </p>

//             </div>

//           </div>

//           {/* RIGHT */}

//           <div className="flex shrink-0 items-center gap-1 sm:gap-3">

//             {/* Activity */}

//             <button
//               type="button"
//               className="relative rounded-xl p-2 sm:p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-cyan-600 dark:hover:bg-slate-800"
//             >
//               <Activity className="h-4 w-4 sm:h-5 sm:w-5" />

//               <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
//             </button>

//             {/* Notifications */}

//             <button
//               type="button"
//               onClick={() =>
//                 router.push(
//                   "/notifications"
//                 )
//               }
//               className="relative rounded-xl p-2 sm:p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-cyan-600 dark:hover:bg-slate-800"
//             >
//               <Bell className="h-4 w-4 sm:h-5 sm:w-5" />

//               <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
//                 4
//               </span>
//             </button>

//             <div className="hidden h-8 w-px bg-slate-200 sm:block dark:bg-slate-700" />

//             {/* ==================================================
//                 PROFILE
//             ================================================== */}

//             <button
//               type="button"
//               onClick={() =>
//                 router.push("/profile")
//               }
//               className="flex min-w-0 items-center gap-2 rounded-xl p-1.5 pr-1 sm:gap-3 sm:pr-2 transition hover:bg-slate-50 dark:hover:bg-slate-800"
//             >

//               {/* Dynamic Initials */}

//               <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-[10px] font-bold text-white shadow-md sm:h-9 sm:w-9 sm:text-xs">
//                 {userInitials}
//               </div>

//               <div className="hidden min-w-0 text-left md:block">

//                 {/* Dynamic Full Name */}

//                 <p className="max-w-[140px] truncate text-sm font-semibold text-slate-800 dark:text-white">
//                   {userName}
//                 </p>

//                 {/* Dynamic Role */}

//                 <p className="text-[11px] text-slate-400">
//                   {userRole}
//                 </p>

//               </div>

//             </button>

//           </div>

//         </header>

//         {/* ==================================================
//             PAGE CONTENT
//         ================================================== */}

//         <main className="min-w-0">
//           {children}
//         </main>

//       </div>
//     </div>
//   );
// }






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
import { useEffect, useState } from "react";
import { toast } from "sonner";

/* ============================================================
   NAVIGATION
============================================================ */

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

/* ============================================================
   TYPES
============================================================ */

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

/* ============================================================
   HELPERS
============================================================ */

function getInitials(name: string) {
  if (!name || name === "Hospital Admin") {
    return "HA";
  }

  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length >= 2) {
    return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
  }

  const camelCaseMatches = name.match(/[A-Z][a-z]*/g);

  if (camelCaseMatches && camelCaseMatches.length >= 2) {
    return `${camelCaseMatches[0][0]}${camelCaseMatches[
      camelCaseMatches.length - 1
    ][0]}`.toUpperCase();
  }

  return name.substring(0, 2).toUpperCase();
}

function formatRole(role: string) {
  if (!role) {
    return "User";
  }

  return role
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

/* ============================================================
   DASHBOARD LAYOUT
============================================================ */

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* ==========================================================
     USER STATE
  ========================================================== */

  const [userName, setUserName] = useState("Hospital Admin");

  const [userRole, setUserRole] =
    useState("Administrator");

  const [hospitalName, setHospitalName] =
    useState("MedCore Hospital");

  const [userInitials, setUserInitials] =
    useState("HA");

  /* ==========================================================
     LOAD USER
  ========================================================== */

  useEffect(() => {
    const loadUser = () => {
      try {
        const session =
          localStorage.getItem("medcore_session");

        if (session) {
          const parsedSession: SessionData =
            JSON.parse(session);

          const user = parsedSession?.user;

          if (user) {
            const name =
              user.fullName?.trim() ||
              "Hospital Admin";

            const role =
              user.role?.trim() ||
              "Administrator";

            const hospital =
              user.hospitalName?.trim() ||
              "MedCore Hospital";

            setUserName(name);
            setUserRole(formatRole(role));
            setHospitalName(hospital);
            setUserInitials(getInitials(name));

            return;
          }
        }

        /* ======================================================
           FALLBACK
        ====================================================== */

        const account =
          localStorage.getItem("medcore_account");

        if (account) {
          const parsedAccount: SessionUser =
            JSON.parse(account);

          const name =
            parsedAccount.fullName?.trim() ||
            "Hospital Admin";

          const role =
            parsedAccount.role?.trim() ||
            "Administrator";

          const hospital =
            parsedAccount.hospitalName?.trim() ||
            "MedCore Hospital";

          setUserName(name);
          setUserRole(formatRole(role));
          setHospitalName(hospital);
          setUserInitials(getInitials(name));
        }
      } catch (error) {
        console.error(
          "Unable to load user information:",
          error
        );
      }
    };

    loadUser();

    window.addEventListener(
      "storage",
      loadUser
    );

    return () => {
      window.removeEventListener(
        "storage",
        loadUser
      );
    };
  }, []);

  /* ==========================================================
     LOGOUT
  ========================================================== */

  const handleLogout = () => {
    localStorage.removeItem("medcore_session");

    toast.success("Logged out successfully");

    router.push("/login");
  };

  const sidebarWidth = collapsed
    ? "w-[82px]"
    : "w-[270px]";

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">

      {/* ======================================================
          MOBILE OVERLAY
      ====================================================== */}

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ======================================================
          SIDEBAR
      ====================================================== */}

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
          ${mobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
          }
        `}
      >

        {/* ==================================================
            LOGO
        ================================================== */}

        <div
          className={`
            flex h-[76px] shrink-0 items-center
            border-b border-slate-100
            dark:border-slate-800
            ${collapsed ? "justify-center" : "px-5"}
          `}
        >
          <Link
            href="/dashboard"
            className="flex min-w-0 items-center gap-3"
            onClick={() => setMobileOpen(false)}
          >
            {/* Logo */}

            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-500 to-violet-600 shadow-lg shadow-cyan-500/20">
              <HeartPulse className="h-6 w-6 text-white" />

              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-400 dark:border-slate-900" />
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <p className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  MedCore
                </p>

                <p className="truncate text-[9px] font-bold uppercase tracking-[0.22em] text-cyan-600 dark:text-cyan-400">
                  Hospital Management
                </p>
              </div>
            )}
          </Link>

          {/* Mobile Close */}

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
            className="ml-auto rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>



        {/* ==================================================
            NAVIGATION
        ================================================== */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {navigation.map((group) => (
            <div key={group.section} className="mb-6">
              {/* ============================================================
          SECTION TITLE
      ============================================================ */}

              {!collapsed && (
                <p className="mb-2 px-3 text-[10px] font-bold tracking-[0.18em] text-slate-400 dark:text-slate-500">
                  {group.section}
                </p>
              )}

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;

                  /*
                   * ==========================================================
                   * ACTIVE ROUTE
                   * ==========================================================
                   *
                   * Dashboard:
                   * Active ONLY on /dashboard
                   *
                   * Other pages:
                   * Active on their route and nested routes
                   */

                  const isActive =
                    item.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname === item.href ||
                      pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      title={collapsed ? item.name : undefined}
                      className={`
                group relative flex items-center
                gap-3 overflow-hidden
                rounded-xl px-3 py-2.5
                text-sm font-medium
                transition-all duration-200

                ${isActive
                          ? `
                      bg-cyan-500
                      text-white
                      shadow-md
                      ring-1
                      ring-cyan-600

                      dark:bg-cyan-600
                      dark:text-white
                      dark:ring-cyan-700
                    `
                          : `
                      text-slate-600
                      hover:bg-slate-50
                      hover:text-slate-900

                      dark:text-slate-400
                      dark:hover:bg-slate-800/70
                      dark:hover:text-white
                    `
                        }

                ${collapsed ? "justify-center" : ""}
              `}
                    >
                      {/* ======================================================
                  ACTIVE LEFT INDICATOR
              ====================================================== */}

                      {isActive && (
                        <span
                          className="
                    absolute left-0 top-1/2
                    h-7 w-1
                    -translate-y-1/2
                    rounded-r-full
                    bg-cyan-700
                  "
                        />
                      )}

                      {/* ======================================================
                  ICON CONTAINER
              ====================================================== */}

                      <div
                        className={`
                  flex h-8 w-8 shrink-0
                  items-center justify-center
                  rounded-lg
                  transition-all duration-200

                  ${isActive
                            ? `
                        bg-white
                        text-cyan-600
                        shadow-sm
                      `
                            : `
                        bg-transparent
                        ${item.color}

                        group-hover:bg-white
                        group-hover:shadow-sm

                        dark:group-hover:bg-slate-800
                      `
                          }
                `}
                      >
                        <Icon className="h-[18px] w-[18px]" />
                      </div>

                      {/* ======================================================
                  NAVIGATION LABEL
              ====================================================== */}

                      {!collapsed && (
                        <span className="truncate">
                          {item.name}
                        </span>
                      )}

                      {/* ======================================================
                  NOTIFICATION BADGE
              ====================================================== */}

                      {!collapsed &&
                        item.name === "Notifications" && (
                          <span
                            className={`
                      ml-auto flex h-5 min-w-5
                      shrink-0 items-center
                      justify-center
                      rounded-full
                      px-1.5 text-[10px]
                      font-bold

                      ${isActive
                                ? `
                            bg-white
                            text-cyan-600
                          `
                                : `
                            bg-red-500
                            text-white
                          `
                              }
                    `}
                          >
                            4
                          </span>
                        )}

                      {/* ======================================================
                  ACTIVE ARROW
              ====================================================== */}

                      {isActive && !collapsed && (
                        <ChevronRight
                          className="
                    ml-auto
                    h-4 w-4
                    shrink-0
                    text-white
                  "
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        {/* ==================================================
            USER CARD
        ================================================== */}

        <div className="shrink-0 border-t border-slate-100 p-3 dark:border-slate-800">

          {!collapsed ? (
            <div className="mb-2 flex items-center gap-3 rounded-xl bg-gradient-to-r from-slate-50 to-cyan-50 p-3 shadow-sm dark:from-slate-800 dark:to-cyan-950/30">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white shadow-md">
                {userInitials}
              </div>

              <div className="min-w-0 flex-1">

                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                  {userName}
                </p>

                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {userRole}
                </p>

              </div>

              <div className="relative">
                <UserRound className="h-4 w-4 text-slate-400" />

                <span className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </div>
            </div>
          ) : (
            <div className="mb-2 flex justify-center">
              <div
                title={userName}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white shadow-md"
              >
                {userInitials}
              </div>
            </div>
          )}

          {/* Logout */}

          <button
            type="button"
            onClick={handleLogout}
            className={`
              flex w-full items-center gap-3
              rounded-xl px-3 py-2.5
              text-sm font-medium
              text-red-500
              transition
              hover:bg-red-50
              dark:hover:bg-red-950/30

              ${collapsed ? "justify-center" : ""}
            `}
          >
            <LogOut className="h-[18px] w-[18px]" />

            {!collapsed && (
              <span>Sign out</span>
            )}
          </button>
        </div>

        {/* ==================================================
            COLLAPSE BUTTON
        ================================================== */}

        <button
          type="button"
          onClick={() =>
            setCollapsed(!collapsed)
          }
          aria-label={
            collapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
          className="absolute -right-3 top-20 hidden h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-md transition hover:text-cyan-600 lg:flex dark:border-slate-700 dark:bg-slate-900"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </aside>

      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      <div
        className={`
          min-h-screen
          transition-all duration-300
          ${collapsed
            ? "lg:pl-[82px]"
            : "lg:pl-[270px]"
          }
        `}
      >

        {/* ==================================================
            TOP HEADER
        ================================================== */}

        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white/90 px-3 shadow-sm backdrop-blur-xl sm:px-6 dark:border-slate-800 dark:bg-slate-900/90">

          {/* LEFT */}

          <div className="flex min-w-0 items-center gap-2 sm:gap-3">

            <button
              type="button"
              onClick={() =>
                setMobileOpen(true)
              }
              aria-label="Open sidebar"
              className="rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="min-w-0">

              <p className="truncate text-[10px] text-slate-400 sm:text-xs">
                {hospitalName} HMS
              </p>

              <p className="truncate text-xs font-semibold text-slate-800 sm:text-sm dark:text-white">
                Hospital Administration
              </p>

            </div>
          </div>

          {/* RIGHT */}

          <div className="flex shrink-0 items-center gap-1 sm:gap-3">

            {/* Activity */}

            <button
              type="button"
              className="relative rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-cyan-600 sm:p-2.5 dark:hover:bg-slate-800"
            >
              <Activity className="h-4 w-4 sm:h-5 sm:w-5" />

              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            </button>

            {/* Notifications */}

            <button
              type="button"
              onClick={() =>
                router.push("/notifications")
              }
              className="relative rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-cyan-600 sm:p-2.5 dark:hover:bg-slate-800"
            >
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />

              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                4
              </span>
            </button>

            <div className="hidden h-8 w-px bg-slate-200 sm:block dark:bg-slate-700" />

            {/* Profile */}

            <button
              type="button"
              onClick={() =>
                router.push("/profile")
              }
              className="flex min-w-0 items-center gap-2 rounded-xl p-1.5 pr-1 transition hover:bg-slate-50 sm:gap-3 sm:pr-2 dark:hover:bg-slate-800"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-[10px] font-bold text-white shadow-md sm:h-9 sm:w-9 sm:text-xs">
                {userInitials}
              </div>

              <div className="hidden min-w-0 text-left md:block">

                <p className="max-w-[140px] truncate text-sm font-semibold text-slate-800 dark:text-white">
                  {userName}
                </p>

                <p className="text-[11px] text-slate-400">
                  {userRole}
                </p>

              </div>
            </button>
          </div>
        </header>

        {/* ==================================================
            PAGE CONTENT
        ================================================== */}

        <main className="min-w-0">
          {children}
        </main>

      </div>
    </div>
  );
}
