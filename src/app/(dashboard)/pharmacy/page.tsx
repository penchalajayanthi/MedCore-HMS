"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
    AlertCircle,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Download,
    Eye,
    FileText,
    MoreHorizontal,
    Package,
    Plus,
    Search,
    ShoppingCart,
    Trash2,
    X,
} from "lucide-react";

type MedicineStatus =
    | "In Stock"
    | "Low Stock"
    | "Out of Stock"
    | "Expiring Soon";

type MedicineCategory =
    | "Tablet"
    | "Capsule"
    | "Syrup"
    | "Injection"
    | "Ointment";

type Medicine = {
    id: string;
    medicineId: string;
    name: string;
    genericName: string;
    category: MedicineCategory;
    stock: number;
    unit: string;
    expiry: string;
    supplier: string;
    price: number;
    status: MedicineStatus;
};

const initialMedicines: Medicine[] = [
    {
        id: "1",
        medicineId: "MED-1001",
        name: "Paracetamol 500mg",
        genericName: "Paracetamol",
        category: "Tablet",
        stock: 850,
        unit: "Tablets",
        expiry: "Dec 2027",
        supplier: "MediPlus Pharma",
        price: 2.5,
        status: "In Stock",
    },
    {
        id: "2",
        medicineId: "MED-1002",
        name: "Amoxicillin 500mg",
        genericName: "Amoxicillin",
        category: "Capsule",
        stock: 120,
        unit: "Capsules",
        expiry: "Nov 2027",
        supplier: "HealthCare Labs",
        price: 6.75,
        status: "In Stock",
    },
    {
        id: "3",
        medicineId: "MED-1003",
        name: "Azithromycin 250mg",
        genericName: "Azithromycin",
        category: "Tablet",
        stock: 35,
        unit: "Tablets",
        expiry: "Mar 2027",
        supplier: "MediPlus Pharma",
        price: 8.5,
        status: "Low Stock",
    },
    {
        id: "4",
        medicineId: "MED-1004",
        name: "Cough Relief Syrup",
        genericName: "Dextromethorphan",
        category: "Syrup",
        stock: 18,
        unit: "Bottles",
        expiry: "Oct 2026",
        supplier: "Wellness Pharma",
        price: 95,
        status: "Expiring Soon",
    },
    {
        id: "5",
        medicineId: "MED-1005",
        name: "Insulin Glargine",
        genericName: "Insulin Glargine",
        category: "Injection",
        stock: 0,
        unit: "Vials",
        expiry: "Aug 2027",
        supplier: "LifeCare Medicals",
        price: 720,
        status: "Out of Stock",
    },
    {
        id: "6",
        medicineId: "MED-1006",
        name: "Mupirocin Ointment",
        genericName: "Mupirocin",
        category: "Ointment",
        stock: 64,
        unit: "Tubes",
        expiry: "Jan 2028",
        supplier: "HealthCare Labs",
        price: 85,
        status: "In Stock",
    },
];

const statusClasses: Record<MedicineStatus, string> = {
    "In Stock":
        "border-emerald-200 bg-emerald-50 text-emerald-700",

    "Low Stock":
        "border-amber-200 bg-amber-50 text-amber-700",

    "Out of Stock":
        "border-red-200 bg-red-50 text-red-700",

    "Expiring Soon":
        "border-orange-200 bg-orange-50 text-orange-700",
};

const categoryClasses: Record<
    MedicineCategory,
    string
> = {
    Tablet:
        "border-blue-200 bg-blue-50 text-blue-700",

    Capsule:
        "border-violet-200 bg-violet-50 text-violet-700",

    Syrup:
        "border-cyan-200 bg-cyan-50 text-cyan-700",

    Injection:
        "border-indigo-200 bg-indigo-50 text-indigo-700",

    Ointment:
        "border-teal-200 bg-teal-50 text-teal-700",
};

function MedicineStatusIcon({
    status,
}: {
    status: MedicineStatus;
}) {
    if (status === "In Stock") {
        return <CheckCircle2 className="h-4 w-4" />;
    }

    if (status === "Low Stock") {
        return <AlertCircle className="h-4 w-4" />;
    }

    if (status === "Out of Stock") {
        return <Package className="h-4 w-4" />;
    }

    return <Clock3 className="h-4 w-4" />;
}

export default function PharmacyPage() {
    const [medicines, setMedicines] =
        useState<Medicine[]>(initialMedicines);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState<
        "All" | MedicineStatus
    >("All");

    const [categoryFilter, setCategoryFilter] =
        useState<"All" | MedicineCategory>("All");

    const [isAddModalOpen, setIsAddModalOpen] =
        useState(false);

    const [selectedMedicine, setSelectedMedicine] =
        useState<Medicine | null>(null);

    /* Delete confirmation state */
    const [medicineToDelete, setMedicineToDelete] =
        useState<Medicine | null>(null);

    const [medicineName, setMedicineName] =
        useState("");

    const [genericName, setGenericName] =
        useState("");

    const [category, setCategory] =
        useState<MedicineCategory>("Tablet");

    const [stock, setStock] = useState("");

    const [unit, setUnit] = useState("");

    const [expiry, setExpiry] = useState("");

    const [supplier, setSupplier] =
        useState("");

    const [price, setPrice] = useState("");

    /* ================= FILTER ================= */

    const filteredMedicines = useMemo(() => {
        return medicines.filter((medicine) => {
            const searchValue =
                search.toLowerCase().trim();

            const matchesSearch =
                !searchValue ||
                medicine.medicineId
                    .toLowerCase()
                    .includes(searchValue) ||
                medicine.name
                    .toLowerCase()
                    .includes(searchValue) ||
                medicine.genericName
                    .toLowerCase()
                    .includes(searchValue) ||
                medicine.supplier
                    .toLowerCase()
                    .includes(searchValue);

            const matchesStatus =
                statusFilter === "All" ||
                medicine.status === statusFilter;

            const matchesCategory =
                categoryFilter === "All" ||
                medicine.category === categoryFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesCategory
            );
        });
    }, [
        medicines,
        search,
        statusFilter,
        categoryFilter,
    ]);

    /* ================= STATISTICS ================= */

    const totalMedicines = medicines.length;

    const lowStockCount = medicines.filter(
        (medicine) =>
            medicine.status === "Low Stock"
    ).length;

    const outOfStockCount = medicines.filter(
        (medicine) =>
            medicine.status === "Out of Stock"
    ).length;

    const expiringSoonCount = medicines.filter(
        (medicine) =>
            medicine.status === "Expiring Soon"
    ).length;

    /* ================= RESET FILTERS ================= */

    const resetFilters = () => {
        setSearch("");
        setStatusFilter("All");
        setCategoryFilter("All");
    };

    /* ================= ADD MEDICINE ================= */

    const handleAddMedicine = () => {
        if (
            !medicineName.trim() ||
            !genericName.trim() ||
            !stock ||
            !unit.trim() ||
            !expiry.trim() ||
            !supplier.trim() ||
            !price
        ) {
            toast.error(
                "Please fill in all required fields."
            );
            return;
        }

        const stockNumber = Number(stock);
        const priceNumber = Number(price);

        if (
            Number.isNaN(stockNumber) ||
            Number.isNaN(priceNumber)
        ) {
            toast.error(
                "Please enter valid stock and price."
            );
            return;
        }

        let medicineStatus: MedicineStatus =
            "In Stock";

        if (stockNumber === 0) {
            medicineStatus = "Out of Stock";
        } else if (stockNumber <= 50) {
            medicineStatus = "Low Stock";
        }

        const newMedicine: Medicine = {
            id: Date.now().toString(),

            medicineId: `MED-${1007 + medicines.length}`,

            name: medicineName.trim(),

            genericName: genericName.trim(),

            category,

            stock: stockNumber,

            unit: unit.trim(),

            expiry: expiry.trim(),

            supplier: supplier.trim(),

            price: priceNumber,

            status: medicineStatus,
        };

        setMedicines((current) => [
            newMedicine,
            ...current,
        ]);

        setMedicineName("");
        setGenericName("");
        setCategory("Tablet");
        setStock("");
        setUnit("");
        setExpiry("");
        setSupplier("");
        setPrice("");

        setIsAddModalOpen(false);

        toast.success(
            "Medicine added successfully."
        );
    };

    /* ================= MORE ACTION ================= */

    const handleMedicineAction = (
        medicine: Medicine
    ) => {
        if (medicine.status === "Out of Stock") {
            toast.warning(
                `${medicine.name} is out of stock. Please restock it.`
            );
            return;
        }

        if (medicine.status === "Low Stock") {
            toast.warning(
                `${medicine.name} has only ${medicine.stock} ${medicine.unit.toLowerCase()} remaining.`
            );
            return;
        }

        if (
            medicine.status === "Expiring Soon"
        ) {
            toast.info(
                `${medicine.name} is approaching its expiry date.`
            );
            return;
        }

        toast.success(
            `${medicine.name} is currently well stocked.`
        );
    };

    /* ================= DELETE MEDICINE ================= */

    const handleDeleteMedicine = (
        medicine: Medicine
    ) => {
        setMedicines((current) =>
            current.filter(
                (item) => item.id !== medicine.id
            )
        );

        setSelectedMedicine(null);
        setMedicineToDelete(null);

        toast.success(
            `${medicine.name} removed from pharmacy inventory.`
        );
    };

    /* ================= EXPORT ================= */

    const handleExport = () => {
        if (medicines.length === 0) {
            toast.info(
                "There are no medicines to export."
            );
            return;
        }

        const headers = [
            "Medicine ID",
            "Medicine Name",
            "Generic Name",
            "Category",
            "Stock",
            "Unit",
            "Expiry",
            "Supplier",
            "Price",
            "Status",
        ];

        const rows = medicines.map(
            (medicine) => [
                medicine.medicineId,
                medicine.name,
                medicine.genericName,
                medicine.category,
                medicine.stock,
                medicine.unit,
                medicine.expiry,
                medicine.supplier,
                medicine.price,
                medicine.status,
            ]
        );

        const csvContent = [
            headers,
            ...rows,
        ]
            .map((row) =>
                row
                    .map(
                        (value) =>
                            `"${String(value).replace(
                                /"/g,
                                '""'
                            )}"`
                    )
                    .join(",")
            )
            .join("\n");

        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;

        link.download = `medcore-pharmacy-inventory-${new Date()
            .toISOString()
            .split("T")[0]}.csv`;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        toast.success(
            "Pharmacy inventory exported successfully."
        );
    };

    return (
        <div className="min-h-screen bg-blue-50/70 p-3 sm:p-5 lg:p-6">
            <div className="mx-auto w-full max-w-[1600px]">

                {/* ================= HEADER ================= */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: -12,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    className="mb-6 overflow-hidden rounded-2xl border border-blue-300 bg-gradient-to-r from-blue-600 via-blue-600 to-cyan-500 shadow-lg"
                >
                    <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between lg:p-7">

                        <div>
                            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-100">
                                <span>
                                    Operations
                                </span>

                                <span>/</span>

                                <span className="text-white">
                                    Pharmacy
                                </span>
                            </div>

                            <div className="flex items-center gap-3">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">
                                    <ShoppingCart className="h-6 w-6 text-white" />
                                </div>

                                <h1 className="text-2xl font-bold text-white sm:text-3xl">
                                    Pharmacy
                                </h1>
                            </div>

                            <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-50 sm:text-base">
                                Manage medicines, inventory,
                                stock levels, suppliers and
                                pharmacy operations.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setIsAddModalOpen(true)
                            }
                            className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-700 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white/70 sm:w-auto"
                        >
                            <Plus className="h-5 w-5" />

                            Add Medicine
                        </button>
                    </div>
                </motion.div>

                {/* ================= STATISTICS ================= */}

                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 10,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                    >
                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Total Medicines
                                </p>

                                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                                    {totalMedicines}
                                </h3>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <Package className="h-5 w-5" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 10,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            delay: 0.05,
                        }}
                        className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                    >
                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Low Stock
                                </p>

                                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                                    {lowStockCount}
                                </h3>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                <AlertCircle className="h-5 w-5" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 10,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            delay: 0.1,
                        }}
                        className="rounded-2xl border border-red-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                    >
                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Out of Stock
                                </p>

                                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                                    {outOfStockCount}
                                </h3>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                                <ShoppingCart className="h-5 w-5" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 10,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            delay: 0.15,
                        }}
                        className="rounded-2xl border border-orange-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                    >
                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Expiring Soon
                                </p>

                                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                                    {expiringSoonCount}
                                </h3>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                                <Clock3 className="h-5 w-5" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* ================= MAIN CARD ================= */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 15,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    className="overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm"
                >

                    {/* Card Header */}

                    <div className="border-b border-blue-100 bg-blue-50/50 p-5">

                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                            <div>

                                <div className="flex items-center gap-2">

                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                                        <FileText className="h-5 w-5" />
                                    </div>

                                    <h2 className="text-lg font-bold text-slate-900">
                                        Pharmacy Inventory
                                    </h2>
                                </div>

                                <p className="mt-1 text-sm text-slate-500">
                                    Monitor medicines, stock
                                    availability, expiry dates
                                    and suppliers.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={resetFilters}
                                className="cursor-pointer self-start rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 transition hover:border-blue-300 hover:bg-blue-50 lg:self-auto"
                            >
                                Reset Filters
                            </button>
                        </div>
                    </div>

                    {/* ================= SEARCH ================= */}

                    <div className="border-b border-slate-100 p-5">

                        <div className="flex flex-col gap-3 xl:flex-row">

                            <div className="relative flex-1">

                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Search medicine, ID, generic name or supplier..."
                                    className="w-full rounded-xl border border-blue-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row">

                                <select
                                    value={categoryFilter}
                                    onChange={(event) =>
                                        setCategoryFilter(
                                            event.target
                                                .value as
                                            | "All"
                                            | MedicineCategory
                                        )
                                    }
                                    className="cursor-pointer rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="All">
                                        All Categories
                                    </option>

                                    <option value="Tablet">
                                        Tablet
                                    </option>

                                    <option value="Capsule">
                                        Capsule
                                    </option>

                                    <option value="Syrup">
                                        Syrup
                                    </option>

                                    <option value="Injection">
                                        Injection
                                    </option>

                                    <option value="Ointment">
                                        Ointment
                                    </option>
                                </select>

                                <select
                                    value={statusFilter}
                                    onChange={(event) =>
                                        setStatusFilter(
                                            event.target
                                                .value as
                                            | "All"
                                            | MedicineStatus
                                        )
                                    }
                                    className="cursor-pointer rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="All">
                                        All Status
                                    </option>

                                    <option value="In Stock">
                                        In Stock
                                    </option>

                                    <option value="Low Stock">
                                        Low Stock
                                    </option>

                                    <option value="Out of Stock">
                                        Out of Stock
                                    </option>

                                    <option value="Expiring Soon">
                                        Expiring Soon
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* ================= DESKTOP TABLE ================= */}

                    <div className="hidden overflow-x-auto lg:block">

                        <table className="w-full min-w-[1200px]">

                            <thead>

                                <tr className="border-b border-cyan-200 bg-cyan-50 text-left">

                                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-cyan-800">
                                        Medicine
                                    </th>

                                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-cyan-800">
                                        Category
                                    </th>

                                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-cyan-800">
                                        Stock
                                    </th>

                                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-cyan-800">
                                        Expiry
                                    </th>

                                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-cyan-800">
                                        Supplier
                                    </th>

                                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-cyan-800">
                                        Price
                                    </th>

                                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-cyan-800">
                                        Status
                                    </th>

                                    <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-cyan-800">
                                        Actions
                                    </th>
                                </tr>

                            </thead>

                            <tbody>

                                {filteredMedicines.length > 0 ? (
                                    filteredMedicines.map(
                                        (medicine, index) => (
                                            <motion.tr
                                                key={medicine.id}
                                                initial={{
                                                    opacity: 0,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                }}
                                                transition={{
                                                    delay:
                                                        index * 0.03,
                                                }}
                                                className="border-b border-slate-100 transition hover:bg-blue-50/40"
                                            >

                                                {/* Medicine */}

                                                <td className="px-5 py-4">

                                                    <div className="flex items-center gap-3">

                                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                                            <Package className="h-5 w-5" />
                                                        </div>

                                                        <div>

                                                            <p className="text-sm font-semibold text-slate-900">
                                                                {medicine.name}
                                                            </p>

                                                            <p className="text-xs text-slate-500">
                                                                {medicine.medicineId}
                                                            </p>

                                                            <p className="text-xs text-slate-400">
                                                                {medicine.genericName}
                                                            </p>

                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Category */}

                                                <td className="px-5 py-4">

                                                    <span
                                                        className={`rounded-lg border px-2.5 py-1 text-xs font-medium ${categoryClasses[medicine.category]}`}
                                                    >
                                                        {medicine.category}
                                                    </span>

                                                </td>

                                                {/* Stock */}

                                                <td className="px-5 py-4">

                                                    <p className="text-sm font-semibold text-slate-800">
                                                        {medicine.stock}
                                                    </p>

                                                    <p className="text-xs text-slate-400">
                                                        {medicine.unit}
                                                    </p>

                                                </td>

                                                {/* Expiry */}

                                                <td className="px-5 py-4">

                                                    <div className="flex items-center gap-2 text-sm text-slate-600">

                                                        <CalendarDays className="h-4 w-4 text-blue-500" />

                                                        <span>
                                                            {medicine.expiry}
                                                        </span>

                                                    </div>

                                                </td>

                                                {/* Supplier */}

                                                <td className="px-5 py-4">

                                                    <p className="text-sm text-slate-700">
                                                        {medicine.supplier}
                                                    </p>

                                                </td>

                                                {/* Price */}

                                                <td className="px-5 py-4">

                                                    <p className="text-sm font-semibold text-slate-800">
                                                        ₹
                                                        {medicine.price.toFixed(
                                                            2
                                                        )}
                                                    </p>

                                                </td>

                                                {/* Status */}

                                                <td className="px-5 py-4">

                                                    <span
                                                        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium ${statusClasses[medicine.status]}`}
                                                    >

                                                        <MedicineStatusIcon
                                                            status={
                                                                medicine.status
                                                            }
                                                        />

                                                        {medicine.status}

                                                    </span>

                                                </td>

                                                {/* Actions */}

                                                <td className="px-5 py-4">

                                                    <div className="flex items-center justify-end gap-2">

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setSelectedMedicine(
                                                                    medicine
                                                                )
                                                            }
                                                            title="View medicine"
                                                            className="cursor-pointer rounded-lg border border-blue-200 bg-white p-2 text-blue-600 transition-all hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleMedicineAction(
                                                                    medicine
                                                                )
                                                            }
                                                            title="Medicine action"
                                                            className="cursor-pointer rounded-lg border border-cyan-200 bg-cyan-50 p-2 text-cyan-700 transition-all hover:border-cyan-300 hover:bg-cyan-100 hover:shadow-sm"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </button>

                                                    </div>

                                                </td>

                                            </motion.tr>
                                        )
                                    )
                                ) : (
                                    <tr>

                                        <td
                                            colSpan={8}
                                            className="px-5 py-14 text-center"
                                        >

                                            <div className="flex flex-col items-center">

                                                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-500">
                                                    <Package className="h-6 w-6" />
                                                </div>

                                                <p className="font-semibold text-slate-800">
                                                    No medicines found
                                                </p>

                                                <p className="mt-1 text-sm text-slate-500">
                                                    Try changing your
                                                    search or filters.
                                                </p>

                                            </div>

                                        </td>

                                    </tr>
                                )}

                            </tbody>

                        </table>
                    </div>

                    {/* ================= MOBILE / TABLET ================= */}

                    <div className="grid gap-4 p-4 lg:hidden">

                        {filteredMedicines.length > 0 ? (
                            filteredMedicines.map(
                                (medicine) => (
                                    <motion.div
                                        key={medicine.id}
                                        initial={{
                                            opacity: 0,
                                            y: 8,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm"
                                    >

                                        <div className="flex items-start justify-between gap-3">

                                            <div className="flex items-center gap-3">

                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                                    <Package className="h-5 w-5" />
                                                </div>

                                                <div>

                                                    <p className="text-sm font-bold text-slate-900">
                                                        {medicine.name}
                                                    </p>

                                                    <p className="text-xs text-blue-600">
                                                        {medicine.medicineId}
                                                    </p>

                                                </div>

                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSelectedMedicine(
                                                        medicine
                                                    )
                                                }
                                                className="cursor-pointer rounded-lg border border-blue-200 bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>

                                        </div>

                                        <div className="mt-4 grid grid-cols-2 gap-3">

                                            <div>

                                                <p className="text-xs text-slate-400">
                                                    Category
                                                </p>

                                                <span
                                                    className={`mt-1 inline-flex rounded-lg border px-2 py-1 text-xs font-medium ${categoryClasses[medicine.category]}`}
                                                >
                                                    {medicine.category}
                                                </span>

                                            </div>

                                            <div>

                                                <p className="text-xs text-slate-400">
                                                    Stock
                                                </p>

                                                <p className="mt-1 text-sm font-semibold text-slate-800">
                                                    {medicine.stock}{" "}
                                                    {medicine.unit}
                                                </p>

                                            </div>

                                            <div>

                                                <p className="text-xs text-slate-400">
                                                    Expiry
                                                </p>

                                                <p className="mt-1 text-sm font-medium text-slate-700">
                                                    {medicine.expiry}
                                                </p>

                                            </div>

                                            <div>

                                                <p className="text-xs text-slate-400">
                                                    Price
                                                </p>

                                                <p className="mt-1 text-sm font-semibold text-slate-800">
                                                    ₹
                                                    {medicine.price.toFixed(
                                                        2
                                                    )}
                                                </p>

                                            </div>

                                        </div>

                                        <div className="mt-4 rounded-xl bg-slate-50 p-3">

                                            <p className="text-xs text-slate-400">
                                                Supplier
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-slate-700">
                                                {medicine.supplier}
                                            </p>

                                        </div>

                                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">

                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium ${statusClasses[medicine.status]}`}
                                            >

                                                <MedicineStatusIcon
                                                    status={
                                                        medicine.status
                                                    }
                                                />

                                                {medicine.status}

                                            </span>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleMedicineAction(
                                                        medicine
                                                    )
                                                }
                                                className="cursor-pointer rounded-lg border border-cyan-200 bg-cyan-50 p-2 text-cyan-700 transition hover:bg-cyan-100"
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                            </button>

                                        </div>

                                    </motion.div>
                                )
                            )
                        ) : (
                            <div className="py-12 text-center">

                                <Package className="mx-auto h-8 w-8 text-blue-400" />

                                <p className="mt-3 font-semibold text-slate-800">
                                    No medicines found
                                </p>

                            </div>
                        )}

                    </div>

                    {/* ================= FOOTER ================= */}

                    <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                        <p className="text-sm text-slate-500">
                            Showing{" "}
                            <span className="font-semibold text-slate-700">
                                {filteredMedicines.length}
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold text-slate-700">
                                {medicines.length}
                            </span>{" "}
                            medicines
                        </p>

                        <button
                            type="button"
                            onClick={handleExport}
                            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition-all hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm"
                        >
                            <Download className="h-4 w-4" />
                            Export
                        </button>

                    </div>

                </motion.div>
            </div>

            {/* ================================================= */}
            {/* ADD MEDICINE MODAL */}
            {/* ================================================= */}

            <AnimatePresence>

                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-3 backdrop-blur-sm sm:p-5">

                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: 0.96,
                                y: 10,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                y: 0,
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.96,
                                y: 10,
                            }}
                            transition={{
                                duration: 0.2,
                            }}
                            className="w-full max-w-2xl overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-2xl"
                        >

                            {/* Header */}

                            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-4 sm:px-6">

                                <div className="flex items-center justify-between">

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                                            <Package className="h-5 w-5 text-white" />
                                        </div>

                                        <div>

                                            <h2 className="text-lg font-bold text-white">
                                                Add Medicine
                                            </h2>

                                            <p className="text-xs text-blue-100">
                                                Add a new medicine to pharmacy inventory
                                            </p>

                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsAddModalOpen(
                                                false
                                            )
                                        }
                                        className="cursor-pointer rounded-lg p-2 text-white/80 transition hover:bg-white/15 hover:text-white"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>

                                </div>
                            </div>

                            {/* Body */}

                            <div className="p-5 sm:p-6">

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                    {/* Medicine Name */}

                                    <div>

                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                            Medicine Name
                                        </label>

                                        <input
                                            type="text"
                                            value={medicineName}
                                            onChange={(event) =>
                                                setMedicineName(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Enter medicine name"
                                            className="w-full rounded-xl border border-blue-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />

                                    </div>

                                    {/* Generic Name */}

                                    <div>

                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                            Generic Name
                                        </label>

                                        <input
                                            type="text"
                                            value={genericName}
                                            onChange={(event) =>
                                                setGenericName(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Enter generic name"
                                            className="w-full rounded-xl border border-blue-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />

                                    </div>

                                    {/* Category */}

                                    <div>

                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                            Category
                                        </label>

                                        <select
                                            value={category}
                                            onChange={(event) =>
                                                setCategory(
                                                    event.target
                                                        .value as MedicineCategory
                                                )
                                            }
                                            className="w-full cursor-pointer rounded-xl border border-blue-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        >

                                            <option value="Tablet">
                                                Tablet
                                            </option>

                                            <option value="Capsule">
                                                Capsule
                                            </option>

                                            <option value="Syrup">
                                                Syrup
                                            </option>

                                            <option value="Injection">
                                                Injection
                                            </option>

                                            <option value="Ointment">
                                                Ointment
                                            </option>

                                        </select>

                                    </div>

                                    {/* Stock */}

                                    <div>

                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                            Stock Quantity
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            value={stock}
                                            onChange={(event) =>
                                                setStock(
                                                    event.target.value.replace(
                                                        /\D/g,
                                                        ""
                                                    )
                                                )
                                            }
                                            placeholder="Enter quantity"
                                            className="w-full rounded-xl border border-blue-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />

                                    </div>

                                    {/* Unit */}

                                    <div>

                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                            Unit
                                        </label>

                                        <select
                                            value={unit}
                                            onChange={(event) =>
                                                setUnit(
                                                    event.target.value
                                                )
                                            }
                                            className="w-full cursor-pointer rounded-xl border border-blue-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        >

                                            <option value="">
                                                Select unit
                                            </option>

                                            <option value="Tablets">
                                                Tablets
                                            </option>

                                            <option value="Capsules">
                                                Capsules
                                            </option>

                                            <option value="Bottles">
                                                Bottles
                                            </option>

                                            <option value="Vials">
                                                Vials
                                            </option>

                                            <option value="Tubes">
                                                Tubes
                                            </option>

                                        </select>

                                    </div>

                                    {/* Expiry */}

                                    <div>

                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                            Expiry
                                        </label>

                                        <input
                                            type="month"
                                            value={expiry}
                                            onChange={(event) =>
                                                setExpiry(
                                                    event.target.value
                                                )
                                            }
                                            className="w-full cursor-pointer rounded-xl border border-blue-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />

                                    </div>

                                    {/* Supplier */}

                                    <div>

                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                            Supplier
                                        </label>

                                        <input
                                            type="text"
                                            value={supplier}
                                            onChange={(event) =>
                                                setSupplier(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Enter supplier"
                                            className="w-full rounded-xl border border-blue-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />

                                    </div>

                                    {/* Price */}

                                    <div>

                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                            Price per Unit
                                        </label>

                                        <div className="relative">

                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                                                ₹
                                            </span>

                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                value={price}
                                                onChange={(event) =>
                                                    setPrice(
                                                        event.target.value.replace(
                                                            /[^0-9.]/g,
                                                            ""
                                                        )
                                                    )
                                                }
                                                placeholder="0.00"
                                                className="w-full rounded-xl border border-blue-200 py-2.5 pl-8 pr-3.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                            />

                                        </div>

                                    </div>

                                </div>
                            </div>

                            {/* Footer */}

                            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsAddModalOpen(
                                            false
                                        )
                                    }
                                    className="cursor-pointer rounded-xl border border-blue-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-blue-300 hover:bg-blue-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={handleAddMedicine}
                                    className="cursor-pointer rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
                                >
                                    Add Medicine
                                </button>

                            </div>

                        </motion.div>
                    </div>
                )}

            </AnimatePresence>

            {/* ================================================= */}
            {/* MEDICINE DETAILS MODAL */}
            {/* ================================================= */}

            <AnimatePresence>

                {selectedMedicine && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-3 backdrop-blur-sm sm:p-5">

                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: 0.96,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.96,
                            }}
                            className="w-full max-w-lg overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-2xl"
                        >

                            {/* Details Header */}

                            <div className="flex items-center justify-between border-b border-blue-100 bg-blue-50 px-5 py-4">

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                                        Pharmacy Medicine
                                    </p>

                                    <h2 className="mt-1 text-lg font-bold text-slate-900">
                                        {selectedMedicine.medicineId}
                                    </h2>

                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedMedicine(
                                            null
                                        )
                                    }
                                    className="cursor-pointer rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-slate-700"
                                >
                                    <X className="h-5 w-5" />
                                </button>

                            </div>

                            {/* Details Body */}

                            <div className="space-y-4 p-5">

                                <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/50 p-3">

                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                        <Package className="h-5 w-5" />
                                    </div>

                                    <div>

                                        <p className="font-semibold text-slate-900">
                                            {selectedMedicine.name}
                                        </p>

                                        <p className="text-sm text-slate-500">
                                            {selectedMedicine.genericName}
                                        </p>

                                    </div>

                                </div>

                                <div className="grid grid-cols-2 gap-4">

                                    <div>

                                        <p className="text-xs text-slate-400">
                                            Category
                                        </p>

                                        <span
                                            className={`mt-1 inline-flex rounded-lg border px-2.5 py-1 text-xs font-medium ${categoryClasses[selectedMedicine.category]}`}
                                        >
                                            {selectedMedicine.category}
                                        </span>

                                    </div>

                                    <div>

                                        <p className="text-xs text-slate-400">
                                            Stock
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-slate-800">
                                            {selectedMedicine.stock}{" "}
                                            {selectedMedicine.unit}
                                        </p>

                                    </div>

                                    <div>

                                        <p className="text-xs text-slate-400">
                                            Expiry
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-slate-800">
                                            {selectedMedicine.expiry}
                                        </p>

                                    </div>

                                    <div>

                                        <p className="text-xs text-slate-400">
                                            Price
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-slate-800">
                                            ₹
                                            {selectedMedicine.price.toFixed(
                                                2
                                            )}
                                        </p>

                                    </div>

                                    <div className="col-span-2">

                                        <p className="text-xs text-slate-400">
                                            Supplier
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-slate-800">
                                            {selectedMedicine.supplier}
                                        </p>

                                    </div>

                                    <div className="col-span-2">

                                        <p className="text-xs text-slate-400">
                                            Status
                                        </p>

                                        <span
                                            className={`mt-1 inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium ${statusClasses[selectedMedicine.status]}`}
                                        >

                                            <MedicineStatusIcon
                                                status={
                                                    selectedMedicine.status
                                                }
                                            />

                                            {selectedMedicine.status}

                                        </span>

                                    </div>

                                </div>
                            </div>

                            {/* Details Footer */}

                            <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-between">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setMedicineToDelete(
                                            selectedMedicine
                                        )
                                    }
                                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Remove
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedMedicine(
                                            null
                                        )
                                    }
                                    className="cursor-pointer rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                                >
                                    Close
                                </button>

                            </div>

                        </motion.div>
                    </div>
                )}

            </AnimatePresence>

            {/* ================================================= */}
            {/* DELETE CONFIRMATION MODAL */}
            {/* ================================================= */}

            <AnimatePresence>

                {medicineToDelete && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">

                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: 0.95,
                                y: 10,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                y: 0,
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.95,
                                y: 10,
                            }}
                            transition={{
                                duration: 0.2,
                            }}
                            className="w-full max-w-md overflow-hidden rounded-2xl border border-red-200 bg-white shadow-2xl"
                        >

                            {/* Confirmation Header */}

                            <div className="border-b border-red-100 bg-red-50 px-5 py-4">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-red-600">
                                        <AlertCircle className="h-5 w-5" />
                                    </div>

                                    <div>

                                        <h2 className="text-lg font-bold text-slate-900">
                                            Remove Medicine?
                                        </h2>

                                        <p className="text-xs text-red-600">
                                            Please confirm this action
                                        </p>

                                    </div>

                                </div>
                            </div>

                            {/* Confirmation Body */}

                            <div className="px-5 py-5">

                                <p className="text-sm leading-6 text-slate-600">

                                    Are you sure you want to remove{" "}

                                    <span className="font-semibold text-slate-900">
                                        {medicineToDelete.name}
                                    </span>{" "}

                                    from the pharmacy inventory?

                                </p>

                                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">

                                    <p className="text-xs leading-5 text-amber-700">
                                        This medicine will be removed
                                        from the current inventory list.
                                        This action cannot be undone.
                                    </p>

                                </div>

                            </div>

                            {/* Confirmation Footer */}

                            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setMedicineToDelete(
                                            null
                                        )
                                    }
                                    className="cursor-pointer rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleDeleteMedicine(
                                            medicineToDelete
                                        )
                                    }
                                    className="cursor-pointer rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                                >
                                    Yes, Remove
                                </button>

                            </div>

                        </motion.div>
                    </div>
                )}

            </AnimatePresence>
        </div>
    );
}