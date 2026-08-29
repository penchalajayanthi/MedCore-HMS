"use client";

export default function MedCoreLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/95 backdrop-blur-sm">
      <div className="relative flex h-20 w-20 items-center justify-center">
        {/* Spinning circle */}
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-cyan-500/20 border-t-cyan-400" />

        {/* M */}
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-600 shadow-lg shadow-cyan-500/30">
          <span className="text-2xl font-bold text-white">
            M
          </span>
        </div>
      </div>
    </div>
  );
}