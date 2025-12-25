import { SeverityLabel } from "./SeverityLabel";
import { StatusBadge } from "./StatusBadge";

export function IncidentTable({
  incidents,
  loading,
  emptyMessage,
  statuses,
  onStatusChange,
  onArchive,
}) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "0.9rem",
        }}
      >
        <thead>
          <tr>
            <th align="left">ID</th>
            <th align="left">Created</th>
            <th align="left">Location</th>
            <th align="left">Category</th>
            <th align="left">Severity</th>
            <th align="left">Status</th>
            <th align="left">Description</th>
            <th align="left">Reported By</th>
            <th align="left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={9} style={{ padding: "8px", textAlign: "center" }}>
                Loading incidents...
              </td>
            </tr>
          )}

          {!loading && incidents.length === 0 && (
            <tr>
              <td colSpan={9} style={{ padding: "8px", textAlign: "center" }}>
                {emptyMessage}
              </td>
            </tr>
          )}

          {incidents.map((inc) => {
            const resolved = inc.status === "Resolved";
            const rowStyle = resolved
              ? { backgroundColor: "#f9fafb", color: "#6b7280" }
              : {};
            const created = inc.created_at
              ? new Date(inc.created_at).toLocaleString()
              : "-";

            return (
              <tr key={inc.id} style={rowStyle}>
                <td>{inc.id}</td>
                <td>{created}</td>
                <td>{inc.location}</td>
                <td>{inc.category}</td>
                <td>
                  <SeverityLabel severity={inc.severity} />
                </td>
                <td>
                  <StatusBadge status={inc.status} />
                </td>
                <td>{inc.description}</td>
                <td>{inc.reported_by || "-"}</td>
                <td>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <select
                      value={inc.status}
                      onChange={(e) => onStatusChange(inc.id, e.target.value)}
                    >
                      {statuses.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                    <button onClick={() => onStatusChange(inc.id, "Investigating")}>
                      Investigating
                    </button>
                    <button onClick={() => onStatusChange(inc.id, "Resolved")}>
                      Resolved
                    </button>
                    <button onClick={() => onArchive(inc.id)}>Archive</button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
