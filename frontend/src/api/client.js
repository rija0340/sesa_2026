const API_BASE_URL = "http://localhost:8080";

/**
 * Client HTTP pour communiquer avec le backend Symfony / API Platform.
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      "Content-Type": "application/ld+json",
      Accept: "application/ld+json",
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error["hydra:description"] || error.message || `Erreur HTTP ${response.status}`
    );
  }

  if (response.status === 204) return null;
  return response.json();
}

/**
 * Même chose mais pour les endpoints custom (JSON classique, pas JSON-LD).
 */
async function requestJson(endpoint) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `Erreur HTTP ${response.status}`);
  }
  return response.json();
}

export function get(endpoint) {
  return request(endpoint, { method: "GET" });
}

export function getJson(endpoint) {
  return requestJson(endpoint);
}

export function post(endpoint, data) {
  return request(endpoint, { method: "POST", body: JSON.stringify(data) });
}

export function patch(endpoint, data) {
  return request(endpoint, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/merge-patch+json" },
  });
}

export function del(endpoint) {
  return request(endpoint, { method: "DELETE" });
}
