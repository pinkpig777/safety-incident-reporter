export function ErrorBanner({ error }) {
  if (!error) return null;

  const title =
    error.type === "network"
      ? "Backend unreachable"
      : error.type === "server"
        ? "Server error"
        : "Request failed";
  const variant =
    error.type === "server"
      ? "border-amber-200 bg-amber-50 text-amber-900"
      : "border-rose-200 bg-rose-50 text-rose-900";

  return (
    <div className={`mb-4 rounded-xl border px-4 py-3 text-sm ${variant}`}>
      <p className="font-semibold">{title}.</p>
      <p className="mt-1">{error.message}</p>
    </div>
  );
}
