export function HealthStatus({ health }) {
  const status =
    health?.status === "ok"
      ? "Operational"
      : health?.status === "degraded"
        ? "Degraded"
        : "Checking...";
  const color =
    health?.status === "ok"
      ? "green"
      : health?.status === "degraded"
        ? "#b45309"
        : "gray";
  const dbInfo =
    health?.status && health?.db !== "unknown"
      ? ` (${health.db === "up" ? "DB up" : "DB down"})`
      : "";

  return <p style={{ color }}>Backend status: {status}{dbInfo}</p>;
}
