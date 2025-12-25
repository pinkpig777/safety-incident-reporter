export function SeverityLabel({ severity }) {
  const value = (severity || "").toLowerCase();

  const classes =
    value === "high"
      ? "bg-rose-600 text-white"
      : value === "medium"
        ? "bg-amber-400 text-slate-900"
        : "bg-slate-200 text-slate-700";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.2em] ${classes}`}
    >
      {severity}
    </span>
  );
}
