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
  return (
    <section
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "24px",
      }}
    >
      <h2>Report a Safety Incident</h2>
      <form onSubmit={onSubmit}>
        <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
          <div style={{ flex: 1 }}>
            <label>
              Location *
              <br />
              <select
                name="location"
                value={form.location}
                onChange={onChange}
                style={{ width: "100%", padding: "6px" }}
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
                onChange={onChange}
                style={{ width: "100%", padding: "6px" }}
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
                onChange={onChange}
                style={{ width: "100%", padding: "6px" }}
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
              onChange={onChange}
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
                onChange={onChange}
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
                onChange={onChange}
                style={{ width: "100%", padding: "6px" }}
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: "8px 16px",
            backgroundColor: "#2563eb",
            color: "white",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
          }}
        >
          {submitting ? "Submitting..." : "Submit Incident"}
        </button>
      </form>
    </section>
  );
}
