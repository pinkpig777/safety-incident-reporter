export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

function buildError(message, details = {}) {
  const error = new Error(message);
  Object.assign(error, details);
  return error;
}

async function handleResponse(res) {
  if (res.ok) {
    return res.json();
  }

  const contentType = res.headers.get("content-type") || "";
  let body = null;
  let text = "";

  if (contentType.includes("application/json")) {
    body = await res.json().catch(() => null);
  } else {
    text = await res.text().catch(() => "");
  }

  const message =
    body?.error?.message ||
    body?.detail ||
    text ||
    res.statusText ||
    "Request failed";

  throw buildError(message, { status: res.status, body });
}

async function request(url, options) {
  try {
    const res = await fetch(url, options);
    return await handleResponse(res);
  } catch (err) {
    if (err instanceof Error && err.name === "TypeError") {
      throw buildError("Backend unreachable", { isNetwork: true });
    }
    throw err;
  }
}

export async function fetchHealth() {
  return request(`${API_BASE_URL}/health`);
}

export async function fetchIncidents(includeArchived = false) {
  const url = new URL(`${API_BASE_URL}/incidents`);
  if (includeArchived) {
    url.searchParams.set("include_archived", "true");
  }
  return request(url);
}

export async function createIncident(payload) {
  return request(`${API_BASE_URL}/incidents`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function patchIncident(id, patch) {
  return request(`${API_BASE_URL}/incidents/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
}

export async function archiveIncident(id) {
  return request(`${API_BASE_URL}/incidents/${id}`, {
    method: "DELETE",
  });
}
