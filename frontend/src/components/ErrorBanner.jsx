export function ErrorBanner({ error }) {
  if (!error) return null;

  const title =
    error.type === "network"
      ? "Backend unreachable"
      : error.type === "server"
        ? "Server error"
        : "Request failed";
  const styles = {
    marginBottom: "12px",
    padding: "8px 12px",
    borderRadius: "4px",
    backgroundColor: error.type === "server" ? "#ffedd5" : "#fee2e2",
    color: error.type === "server" ? "#9a3412" : "#b91c1c",
  };

  return (
    <div style={styles}>
      <strong>{title}.</strong> {error.message}
    </div>
  );
}
