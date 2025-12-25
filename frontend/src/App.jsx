import { useEffect, useRef, useState } from "react";
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
import { ToastStack } from "./components/ToastStack";

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
  const [toasts, setToasts] = useState([]);
  const toastIdRef = useRef(0);

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

  function pushToast({ type, message }) {
    const id = toastIdRef.current + 1;
    toastIdRef.current = id;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4200);
  }

  function dismissToast(id) {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }

  function setErrorFrom(err, fallback, options = {}) {
    let type = "unknown";
    let message = fallback;

    if (err?.isNetwork) {
      type = "network";
      message = `Backend unreachable. Ensure the API is running at ${API_BASE_URL}.`;
    } else if (err?.status >= 500) {
      type = "server";
      message = "Server error. Please try again shortly.";
    } else if (err?.message) {
      type = "client";
      message = err.message || fallback;
    }

    setError({ type, message });
    if (options.toast) {
      pushToast({ type: "error", message });
    }
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
      pushToast({ type: "success", message: "Incident submitted successfully." });
    } catch (err) {
      console.error(err);
      setErrorFrom(err, "Failed to create incident", { toast: true });
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
      pushToast({ type: "success", message: `Status set to ${newStatus}.` });
    } catch (err) {
      console.error(err);
      setErrorFrom(err, "Failed to update status", { toast: true });
    }
  }

  async function handleArchive(id) {
    const ok = window.confirm("Archive this incident?");
    if (!ok) return;
    try {
      setError(null);
      await archiveIncident(id);
      await loadIncidents();
      pushToast({ type: "success", message: "Incident archived." });
    } catch (err) {
      console.error(err);
      setErrorFrom(err, "Failed to archive incident", { toast: true });
    }
  }

  const visibleIncidents = filteredIncidents();
  const hasFilters = Object.values(filters).some((value) => value);
  const emptyMessage = incidents.length === 0
    ? "No incidents yet. Submit the form to start tracking safety issues."
    : hasFilters
      ? "No incidents match the current filters."
      : "No incidents to display.";
  const summaryCards = [
    {
      label: "Open",
      value: visibleIncidents.filter((inc) => inc.status === "Open").length,
      helper: "Awaiting review",
      tone: "text-indigo-600",
    },
    {
      label: "Investigating",
      value: visibleIncidents.filter((inc) => inc.status === "Investigating")
        .length,
      helper: "In progress",
      tone: "text-amber-600",
    },
    {
      label: "High Severity",
      value: visibleIncidents.filter((inc) => inc.severity === "High").length,
      helper: "Escalations",
      tone: "text-rose-700",
    },
  ];
  return (
    <div className="min-h-screen">
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              Safety Operations
            </p>
            <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl lg:text-4xl">
              Safety Incident Reporter
            </h1>
            <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
              Centralize incident intake, track investigation progress, and
              keep high-severity issues visible to the right teams.
            </p>
          </div>
          <div className="flex w-full items-center justify-between gap-3 rounded-full border border-slate-200/70 bg-white/70 px-4 py-2 text-sm text-slate-600 shadow-sm md:w-auto">
            <span className="font-medium text-slate-700">System Health</span>
            <HealthStatus health={health} />
          </div>
        </header>

        <ErrorBanner error={error} />

        <div className="grid gap-6">
          <section className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm sm:p-6">
            <div className="mb-6 space-y-1">
              <h2 className="text-xl font-semibold text-slate-900">
                Report Form
              </h2>
              <p className="text-sm text-slate-500">
                Log new incidents with accurate details for quick response.
              </p>
            </div>
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
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white/80 shadow-sm">
            <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 sm:py-5 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-slate-900">
                  Incident Dashboard
                </h2>
                <p className="text-sm text-slate-500">
                  Update statuses, scan details, and keep teams aligned.
                </p>
              </div>
              <button
                onClick={loadIncidents}
                disabled={loadingIncidents}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loadingIncidents ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            <div className="border-t border-slate-200/70 px-4 py-4 sm:px-6">
              <IncidentFilters
                filters={filters}
                onChange={handleFilterChange}
                locations={LOCATIONS}
                categories={CATEGORIES}
                severities={SEVERITIES}
                statuses={STATUSES}
              />
            </div>

            <div className="border-t border-slate-200/70 px-4 py-4 sm:px-6">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {summaryCards.map((card) => (
                  <div
                    key={card.label}
                    className="rounded-xl border border-slate-200/70 bg-slate-50/70 px-4 py-3"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      {card.label}
                    </p>
                    <p
                      className={`mt-2 text-2xl font-semibold ${card.tone}`}
                    >
                      {card.value}
                    </p>
                    <p className="text-xs text-slate-500">{card.helper}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200/70 px-4 py-4 sm:px-6">
              <IncidentTable
                incidents={visibleIncidents}
                loading={loadingIncidents}
                emptyMessage={emptyMessage}
                statuses={STATUSES}
                onStatusChange={handleStatusChange}
                onArchive={handleArchive}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;
