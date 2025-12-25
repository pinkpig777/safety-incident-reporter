export function StatusBadge({ status }) {
  const value = (status || "").toLowerCase();

  const classes =
    value === "open"
      ? "border-rose-200 bg-rose-100 text-rose-700"
      : value === "investigating"
        ? "border-amber-200 bg-amber-100 text-amber-700"
        : value === "resolved"
          ? "border-emerald-200 bg-emerald-100 text-emerald-700"
          : "border-slate-200 bg-slate-100 text-slate-600";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.2em] ${classes}`}
    >
      {status}
    </span>
  );
}
