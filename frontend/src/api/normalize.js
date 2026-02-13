/**
 * Normalize collection-like API responses to a plain array.
 * Supports Hydra JSON-LD and common envelope shapes.
 */
export function extractCollection(response) {
  if (Array.isArray(response)) {
    return response;
  }

  if (!response || typeof response !== "object") {
    return [];
  }

  if (Array.isArray(response["hydra:member"])) {
    return response["hydra:member"];
  }

  if (Array.isArray(response.member)) {
    return response.member;
  }

  if (Array.isArray(response.items)) {
    return response.items;
  }

  if (Array.isArray(response.data)) {
    return response.data;
  }

  return [];
}
