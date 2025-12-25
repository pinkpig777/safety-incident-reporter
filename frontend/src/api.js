const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API error ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

export async function fetchHealth() {
  const res = await fetch(`${API_BASE_URL}/health`);
  return handleResponse(res);
}

export async function fetchIncidents(includeArchived = false) {
  const url = new URL(`${API_BASE_URL}/incidents`);
  if (includeArchived) {
    url.searchParams.set("include_archived", "true");
  }
  const res = await fetch(url);
  return handleResponse(res);
}

export async function createIncident(payload) {
  const res = await fetch(`${API_BASE_URL}/incidents`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function patchIncident(id, patch) {
  const res = await fetch(`${API_BASE_URL}/incidents/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  return handleResponse(res);
}

export async function archiveIncident(id) {
  const res = await fetch(`${API_BASE_URL}/incidents/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API error ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}
