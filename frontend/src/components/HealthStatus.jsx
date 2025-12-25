export function HealthStatus({ health }) {
  const status =
    health?.status === "ok"
      ? "Operational"
      : health?.status === "degraded"
        ? "Degraded"
        : "Checking...";
  const dotClass =
    health?.status === "ok"
      ? "bg-emerald-500"
      : health?.status === "degraded"
        ? "bg-amber-500"
        : "bg-slate-400";
  const dbInfo =
    health?.status && health?.db !== "unknown"
      ? ` (${health.db === "up" ? "DB up" : "DB down"})`
      : "";

  return (
    <span className="inline-flex items-center gap-2 text-sm text-slate-600">
      <span className={`h-2 w-2 rounded-full ${dotClass}`} />
      <span>
        {status}
        {dbInfo}
      </span>
    </span>
  );
}
