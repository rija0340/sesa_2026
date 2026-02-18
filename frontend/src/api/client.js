const API_BASE_URL = "http://localhost:8080";

/**
 * Client HTTP pour communiquer avec le backend Symfony / API Platform.
 */
let token = localStorage.getItem("auth_token");

export function setAuthToken(newToken) {
  token = newToken;
  localStorage.setItem("auth_token", newToken);
}

export function removeAuthToken() {
  token = null;
  localStorage.removeItem("auth_token");
}

// Debugging: Log token status on load
console.log("Client.js loaded.");

function getHeaders(baseHeaders = {}) {
  const headers = { ...baseHeaders };
  const storedToken = localStorage.getItem("auth_token");
  
  if (storedToken) {
    headers["Authorization"] = `Bearer ${storedToken}`;
    console.log("Sending Authorization Header: Bearer " + storedToken.substring(0, 10) + "...");
  } else {
    console.warn("No token found in localStorage when building headers.");
  }
  return headers;
}

/**
 * Client HTTP pour communiquer avec le backend Symfony / API Platform.
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const mergedHeaders = getHeaders({
    "Content-Type": "application/ld+json",
    Accept: "application/ld+json",
    ...(options.headers || {}),
  });

  const config = {
    ...options,
    headers: mergedHeaders,
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 401) {
      console.warn("401 Unauthorized received. Redirecting to login.");
      removeAuthToken();
      if (window.location.pathname !== "/login") {
         window.location.href = "/login";
      }
      throw new Error("Session expirée");
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error["hydra:description"] || error.message || `Erreur HTTP ${response.status}`
      );
    }

    if (response.status === 204) return null;
    return response.json();
  } catch (error) {
     // Ensure we don't catch the 401 redirect error and swallow it without redirecting if missed above
     throw error;
  }
}

/**
 * Même chose mais pour les endpoints custom (JSON classique, pas JSON-LD).
 */
async function requestJson(endpoint) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: getHeaders({ Accept: "application/json" }),
  });
  
  if (response.status === 401) {
    console.warn("401 Unauthorized received (JSON). Redirecting to login.");
    removeAuthToken();
    if (window.location.pathname !== "/login") {
        window.location.href = "/login";
    }
    throw new Error("Session expirée");
  }

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
  // Special case for login which is standard JSON, not LD+JSON usually, but Lexik accepts JSON.
  // We use request() which defaults to LD+JSON headers, but for login we might want standard JSON.
  // Let's check if it is login_check
  
  if (endpoint === "/api/login_check") {
     return fetch(`${API_BASE_URL}${endpoint}`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(data)
     }).then(async r => {
         if (!r.ok) throw new Error("Identifiants incorrects");
         return r.json();
     });
  }

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
