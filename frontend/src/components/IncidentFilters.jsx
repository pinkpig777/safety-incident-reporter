export function IncidentFilters({
  filters,
  onChange,
  locations,
  categories,
  severities,
  statuses,
}) {
  const selectClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none";

  return (
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
  );
}
