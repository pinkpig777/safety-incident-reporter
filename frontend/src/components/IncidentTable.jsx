import { useState } from "react";
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
  const [expandedRows, setExpandedRows] = useState({});

  function toggleExpanded(id) {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/70">
      <div className="max-h-[60vh] overflow-auto md:max-h-[480px] lg:max-h-[560px]">
        <table className="w-full min-w-[900px] text-xs sm:text-sm">
          <thead className="sticky top-0 z-10 bg-slate-100 text-[0.65rem] uppercase tracking-[0.2em] text-slate-500 sm:text-xs">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Created</th>
              <th className="px-4 py-3 text-left">Location</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Severity</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-left">Reported By</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/70">
            {loading && (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-6 text-center text-sm text-slate-500"
                >
                  Loading incidents...
                </td>
              </tr>
            )}

            {!loading && incidents.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-6 text-center text-sm text-slate-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}

            {incidents.map((inc) => {
              const resolved = inc.status === "Resolved";
              const created = inc.created_at
                ? new Date(inc.created_at).toLocaleString()
                : "-";
              const description = inc.description || "";
              const isLong = description.length > 120;
              const isExpanded = expandedRows[inc.id];
              const displayDescription =
                isExpanded || !isLong
                  ? description
                  : `${description.slice(0, 120)}...`;
              const primaryText = resolved ? "text-slate-500" : "text-slate-900";
              const secondaryText = resolved ? "text-slate-400" : "text-slate-700";

              return (
                <tr
                  key={inc.id}
                  className={`odd:bg-white even:bg-slate-50 ${
                    resolved ? "text-slate-400" : "text-slate-700"
                  }`}
                >
                  <td className={`px-4 py-3 font-semibold ${primaryText}`}>
                    #{inc.id}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{created}</td>
                  <td className="px-4 py-3">{inc.location}</td>
                  <td className="px-4 py-3">{inc.category}</td>
                  <td className="px-4 py-3 max-w-[260px] break-words">
                    <SeverityLabel severity={inc.severity} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={inc.status} />
                  </td>
                  <td className="px-4 py-3">
                    <p className={`text-sm ${secondaryText}`}>
                      {displayDescription}
                    </p>
                    {isLong && (
                      <button
                        type="button"
                        onClick={() => toggleExpanded(inc.id)}
                        className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 transition hover:text-indigo-500"
                      >
                        {isExpanded ? "Collapse" : "Expand"}
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3">{inc.reported_by || "-"}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <select
                        value={inc.status}
                        onChange={(e) =>
                          onStatusChange(inc.id, e.target.value)
                        }
                        className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none"
                      >
                        {statuses.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => onArchive(inc.id)}
                        className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 transition hover:text-rose-600"
                      >
                        Archive
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
