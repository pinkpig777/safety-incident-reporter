export function IncidentFilters({
  filters,
  onChange,
  locations,
  categories,
  severities,
  statuses,
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        gap: "8px",
        marginBottom: "12px",
      }}
    >
      <select name="location" value={filters.location} onChange={onChange}>
        <option value="">All Locations</option>
        {locations.map((loc) => (
          <option key={loc} value={loc}>
            {loc}
          </option>
        ))}
      </select>

      <select name="category" value={filters.category} onChange={onChange}>
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <select name="severity" value={filters.severity} onChange={onChange}>
        <option value="">All Severities</option>
        {severities.map((sev) => (
          <option key={sev} value={sev}>
            {sev}
          </option>
        ))}
      </select>

      <select name="status" value={filters.status} onChange={onChange}>
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
