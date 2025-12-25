export function StatusBadge({ status }) {
  const value = (status || "").toLowerCase();

  let bg = "#eee";
  if (value === "open") bg = "#e0f2fe"; // light blue
  if (value === "investigating") bg = "#fef3c7"; // light yellow
  if (value === "resolved") bg = "#dcfce7"; // light green

  const style = {
    padding: "2px 10px",
    borderRadius: "999px",
    fontSize: "0.75rem",
    fontWeight: 600,
    backgroundColor: bg,
    textTransform: "capitalize",
  };

  return <span style={style}>{status}</span>;
}
