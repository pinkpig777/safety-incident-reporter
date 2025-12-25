import { useEffect, useState } from "react";
import {
  fetchHealth,
  fetchIncidents,
  createIncident,
  patchIncident,
  archiveIncident,
} from "./api";
import { SeverityLabel } from "./components/SeverityLabel";
import { StatusBadge } from "./components/StatusBadge";

const LOCATIONS = [
  "Rolling Mill",
  "Blast Furnace",
  "Scrap Yard",
  "Shipping Dock",
];
const CATEGORIES = ["Mechanical", "Electrical", "Chemical", "Slip/Trip/Fall"];
const SEVERITIES = ["Low", "Medium", "High"];
const STATUSES = ["Open", "Investigating", "Resolved"];

function App() {
  const [health, setHealth] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [form, setForm] = useState({
    location: "",
    category: "",
    severity: "",
    description: "",
    reported_by: "",
    photo_url: "",
  });
  const [formErrors, setFormErrors] = useState({});

  // Filter state
  const [filters, setFilters] = useState({
    location: "",
    category: "",
    severity: "",
    status: "",
  });

  // Load initial data
  useEffect(() => {
    async function init() {
      try {
        setError("");
        const h = await fetchHealth();
        setHealth(h.status);

        await loadIncidents();
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load data");
      }
    }
    init();
  }, []);

  async function loadIncidents() {
    setLoading(true);
    try {
      const data = await fetchIncidents(false);
      setIncidents(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch incidents");
    } finally {
      setLoading(false);
    }
  }

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validateForm() {
    const errs = {};
    if (!form.location) errs.location = "Location is required";
    if (!form.category) errs.category = "Category is required";
    if (!form.severity) errs.severity = "Severity is required";
    if (!form.description.trim()) errs.description = "Description is required";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const errs = validateForm();
    setFormErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      const payload = {
        location: form.location,
        category: form.category,
        severity: form.severity,
        description: form.description,
        reported_by: form.reported_by || undefined,
        photo_url: form.photo_url || undefined,
      };
      await createIncident(payload);
      setForm({
        location: "",
        category: "",
        severity: "",
        description: "",
        reported_by: "",
        photo_url: "",
      });
      await loadIncidents();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create incident");
    }
  }

  function handleFilterChange(e) {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  function filteredIncidents() {
    return incidents.filter((inc) => {
      if (filters.location && inc.location !== filters.location) return false;
      if (filters.category && inc.category !== filters.category) return false;
      if (filters.severity && inc.severity !== filters.severity) return false;
      if (filters.status && inc.status !== filters.status) return false;
      return true;
    });
  }

  async function handleStatusChange(id, newStatus) {
    try {
      await patchIncident(id, { status: newStatus });
      await loadIncidents();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update status");
    }
  }

  async function handleArchive(id) {
    const ok = window.confirm("Archive this incident?");
    if (!ok) return;
    try {
      await archiveIncident(id);
      await loadIncidents();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to archive incident");
    }
  }

  const visibleIncidents = filteredIncidents();

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "16px" }}>
      <h1>Safety Incident Reporter</h1>
      <p style={{ color: health === "System Online" ? "green" : "gray" }}>
        Backend status: {health || "Checking..."}
      </p>

      {error && (
        <div
          style={{
            marginBottom: "12px",
            padding: "8px 12px",
            borderRadius: "4px",
            backgroundColor: "#fee2e2",
            color: "#b91c1c",
          }}
        >
          {error}
        </div>
      )}

      {/* Reporting Form */}
      <section
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "24px",
        }}
      >
        <h2>Report a Safety Incident</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
            <div style={{ flex: 1 }}>
              <label>
                Location *
                <br />
                <select
                  name="location"
                  value={form.location}
                  onChange={handleFormChange}
                  style={{ width: "100%", padding: "6px" }}
                >
                  <option value="">Select location</option>
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </label>
              {formErrors.location && (
                <div style={{ color: "red", fontSize: "0.8rem" }}>
                  {formErrors.location}
                </div>
              )}
            </div>

            <div style={{ flex: 1 }}>
              <label>
                Category *
                <br />
                <select
                  name="category"
                  value={form.category}
                  onChange={handleFormChange}
                  style={{ width: "100%", padding: "6px" }}
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </label>
              {formErrors.category && (
                <div style={{ color: "red", fontSize: "0.8rem" }}>
                  {formErrors.category}
                </div>
              )}
            </div>

            <div style={{ flex: 1 }}>
              <label>
                Severity *
                <br />
                <select
                  name="severity"
                  value={form.severity}
                  onChange={handleFormChange}
                  style={{ width: "100%", padding: "6px" }}
                >
                  <option value="">Select severity</option>
                  {SEVERITIES.map((sev) => (
                    <option key={sev} value={sev}>
                      {sev}
                    </option>
                  ))}
                </select>
              </label>
              {formErrors.severity && (
                <div style={{ color: "red", fontSize: "0.8rem" }}>
                  {formErrors.severity}
                </div>
              )}
            </div>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label>
              Description *
              <br />
              <textarea
                name="description"
                value={form.description}
                onChange={handleFormChange}
                rows={3}
                style={{ width: "100%", padding: "6px" }}
              />
            </label>
            {formErrors.description && (
              <div style={{ color: "red", fontSize: "0.8rem" }}>
                {formErrors.description}
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
            <div style={{ flex: 1 }}>
              <label>
                Reported By
                <br />
                <input
                  type="text"
                  name="reported_by"
                  value={form.reported_by}
                  onChange={handleFormChange}
                  style={{ width: "100%", padding: "6px" }}
                />
              </label>
            </div>

            <div style={{ flex: 2 }}>
              <label>
                Photo URL
                <br />
                <input
                  type="text"
                  name="photo_url"
                  value={form.photo_url}
                  onChange={handleFormChange}
                  style={{ width: "100%", padding: "6px" }}
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "8px 16px",
              backgroundColor: "#2563eb",
              color: "white",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
            }}
          >
            {loading ? "Submitting..." : "Submit Incident"}
          </button>
        </form>
      </section>

      {/* Dashboard */}
      <section>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <h2>Active Incidents</h2>
          <button
            onClick={loadIncidents}
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              border: "1px solid #d1d5db",
              backgroundColor: "white",
              cursor: "pointer",
            }}
          >
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: "8px",
            marginBottom: "12px",
          }}
        >
          <select
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
          >
            <option value="">All Locations</option>
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            name="severity"
            value={filters.severity}
            onChange={handleFilterChange}
          >
            <option value="">All Severities</option>
            {SEVERITIES.map((sev) => (
              <option key={sev} value={sev}>
                {sev}
              </option>
            ))}
          </select>

          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All Statuses</option>
            {STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

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
              {visibleIncidents.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    style={{ padding: "8px", textAlign: "center" }}
                  >
                    No incidents to display.
                  </td>
                </tr>
              )}

              {visibleIncidents.map((inc) => {
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
                          onChange={(e) =>
                            handleStatusChange(inc.id, e.target.value)
                          }
                        >
                          {STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() =>
                            handleStatusChange(inc.id, "Investigating")
                          }
                        >
                          Investigating
                        </button>
                        <button
                          onClick={() => handleStatusChange(inc.id, "Resolved")}
                        >
                          Resolved
                        </button>
                        <button onClick={() => handleArchive(inc.id)}>
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
      </section>
    </div>
  );
}

export default App;
