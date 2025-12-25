export function IncidentFilters({
  filters,
  onChange,
  onReset,
  locations,
  categories,
  severities,
  statuses,
}) {
  const selectClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none";
  const sortLabels = {
    created: "Created",
    severity: "Severity",
    status: "Status",
    location: "Location",
  };
  const sortStackLabel = filters.sortStack?.length
    ? `Priority: ${filters.sortStack.map((key) => sortLabels[key]).join(" → ")}`
    : "Priority: none";

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <select
          name="location"
          value={filters.location}
          onChange={onChange}
          className={selectClass}
        >
          <option value="">All Locations</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        <select
          name="category"
          value={filters.category}
          onChange={onChange}
          className={selectClass}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          name="severity"
          value={filters.severity}
          onChange={onChange}
          className={selectClass}
        >
          <option value="">All Severities</option>
          {severities.map((sev) => (
            <option key={sev} value={sev}>
              {sev}
            </option>
          ))}
        </select>

        <select
          name="status"
          value={filters.status}
          onChange={onChange}
          className={selectClass}
        >
          <option value="">All Statuses</option>
          {statuses.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onReset}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
        >
          Clear filters
        </button>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Sort stack (last selected = highest priority)
        </p>
        <p className="text-xs text-slate-500">{sortStackLabel}</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <select
            name="sortCreated"
            value={filters.sortCreated}
            onChange={onChange}
            className={selectClass}
          >
            <option value="">Created: None</option>
            <option value="desc">Created: Newest first</option>
            <option value="asc">Created: Oldest first</option>
          </select>

          <select
            name="sortSeverity"
            value={filters.sortSeverity}
            onChange={onChange}
            className={selectClass}
          >
            <option value="">Severity: None</option>
            <option value="desc">Severity: High to Low</option>
            <option value="asc">Severity: Low to High</option>
          </select>

          <select
            name="sortStatus"
            value={filters.sortStatus}
            onChange={onChange}
            className={selectClass}
          >
            <option value="">Status: None</option>
            <option value="asc">Status: Open to Resolved</option>
            <option value="desc">Status: Resolved to Open</option>
          </select>

          <select
            name="sortLocation"
            value={filters.sortLocation}
            onChange={onChange}
            className={selectClass}
          >
            <option value="">Location: None</option>
            <option value="asc">Location: A to Z</option>
            <option value="desc">Location: Z to A</option>
          </select>
        </div>
      </div>
    </div>
  );
}
