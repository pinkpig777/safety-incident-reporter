import { useEffect, useState } from "react";
import {
  fetchHealth,
  fetchIncidents,
  createIncident,
  patchIncident,
  archiveIncident,
  API_BASE_URL,
} from "./api";
import { ErrorBanner } from "./components/ErrorBanner";
import { HealthStatus } from "./components/HealthStatus";
import { IncidentFilters } from "./components/IncidentFilters";
import { IncidentForm } from "./components/IncidentForm";
import { IncidentTable } from "./components/IncidentTable";

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
  const [health, setHealth] = useState({ status: "checking", db: "unknown" });
  const [incidents, setIncidents] = useState([]);
  const [loadingIncidents, setLoadingIncidents] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

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

  function setErrorFrom(err, fallback) {
    if (!err) {
      setError({ type: "unknown", message: fallback });
      return;
    }
    if (err.isNetwork) {
      setError({
        type: "network",
        message: `Backend unreachable. Ensure the API is running at ${API_BASE_URL}.`,
      });
      return;
    }
    if (err.status >= 500) {
      setError({
        type: "server",
        message: "Server error. Please try again shortly.",
      });
      return;
    }
    setError({ type: "client", message: err.message || fallback });
  }

  async function loadHealth() {
    try {
      const data = await fetchHealth();
      setHealth(data);
      return true;
    } catch (err) {
      console.error(err);
      setHealth({ status: "degraded", db: "down" });
      setErrorFrom(err, "Failed to check backend health");
      return false;
    }
  }

  // Load initial data
  useEffect(() => {
    async function init() {
      try {
        setError(null);
        await loadHealth();
        await loadIncidents();
      } catch (err) {
        console.error(err);
        setErrorFrom(err, "Failed to load data");
      }
    }
    init();
  }, []);

  async function loadIncidents() {
    setLoadingIncidents(true);
    try {
      const data = await fetchIncidents(false);
      setIncidents(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setErrorFrom(err, "Failed to fetch incidents");
    } finally {
      setLoadingIncidents(false);
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
    setError(null);
    const errs = validateForm();
    setFormErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      setSubmitting(true);
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
      setErrorFrom(err, "Failed to create incident");
    } finally {
      setSubmitting(false);
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
      setError(null);
      await patchIncident(id, { status: newStatus });
      await loadIncidents();
    } catch (err) {
      console.error(err);
      setErrorFrom(err, "Failed to update status");
    }
  }

  async function handleArchive(id) {
    const ok = window.confirm("Archive this incident?");
    if (!ok) return;
    try {
      setError(null);
      await archiveIncident(id);
      await loadIncidents();
    } catch (err) {
      console.error(err);
      setErrorFrom(err, "Failed to archive incident");
    }
  }

  const visibleIncidents = filteredIncidents();
  const hasFilters = Object.values(filters).some((value) => value);
  const emptyMessage = incidents.length === 0
    ? "No incidents yet. Submit the form to start tracking safety issues."
    : hasFilters
      ? "No incidents match the current filters."
      : "No incidents to display.";
  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "16px" }}>
      <h1>Safety Incident Reporter</h1>
      <HealthStatus health={health} />
      <ErrorBanner error={error} />
      <IncidentForm
        form={form}
        formErrors={formErrors}
        submitting={submitting}
        onChange={handleFormChange}
        onSubmit={handleSubmit}
        locations={LOCATIONS}
        categories={CATEGORIES}
        severities={SEVERITIES}
      />

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
            disabled={loadingIncidents}
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              border: "1px solid #d1d5db",
              backgroundColor: "white",
              cursor: "pointer",
            }}
          >
            {loadingIncidents ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <IncidentFilters
          filters={filters}
          onChange={handleFilterChange}
          locations={LOCATIONS}
          categories={CATEGORIES}
          severities={SEVERITIES}
          statuses={STATUSES}
        />
        <IncidentTable
          incidents={visibleIncidents}
          loading={loadingIncidents}
          emptyMessage={emptyMessage}
          statuses={STATUSES}
          onStatusChange={handleStatusChange}
          onArchive={handleArchive}
        />
      </section>
    </div>
  );
}

export default App;
