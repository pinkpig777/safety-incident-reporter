export function IncidentForm({
  form,
  formErrors,
  submitting,
  onChange,
  onSubmit,
  locations,
  categories,
  severities,
}) {
  const fieldClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none";
  const labelClass =
    "flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500";
  const errorClass = "mt-1 text-xs font-semibold text-rose-600";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>
            Location *
            <select
              name="location"
              value={form.location}
              onChange={onChange}
              className={fieldClass}
            >
              <option value="">Select location</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </label>
          {formErrors.location && (
            <div className={errorClass}>{formErrors.location}</div>
          )}
        </div>

        <div>
          <label className={labelClass}>
            Category *
            <select
              name="category"
              value={form.category}
              onChange={onChange}
              className={fieldClass}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>
          {formErrors.category && (
            <div className={errorClass}>{formErrors.category}</div>
          )}
        </div>

        <div>
          <label className={labelClass}>
            Severity *
            <select
              name="severity"
              value={form.severity}
              onChange={onChange}
              className={fieldClass}
            >
              <option value="">Select severity</option>
              {severities.map((sev) => (
                <option key={sev} value={sev}>
                  {sev}
                </option>
              ))}
            </select>
          </label>
          {formErrors.severity && (
            <div className={errorClass}>{formErrors.severity}</div>
          )}
        </div>

        <div>
          <label className={labelClass}>
            Reported By
            <input
              type="text"
              name="reported_by"
              value={form.reported_by}
              onChange={onChange}
              className={fieldClass}
              placeholder="Optional"
            />
          </label>
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>
            Description *
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              rows={3}
              className={`${fieldClass} resize-none`}
              placeholder="Describe what happened and any immediate actions taken."
            />
          </label>
          {formErrors.description && (
            <div className={errorClass}>{formErrors.description}</div>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>
            Photo URL
            <input
              type="text"
              name="photo_url"
              value={form.photo_url}
              onChange={onChange}
              className={fieldClass}
              placeholder="Optional"
            />
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? "Submitting..." : "Submit Incident"}
        </button>
        <p className="text-xs text-slate-400">
          Required fields are marked with *.
        </p>
      </div>
    </form>
  );
}
