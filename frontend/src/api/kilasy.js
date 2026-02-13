import { get, post, patch, del } from "./client";
import { extractCollection } from "./normalize";

const BASE = "/api/sekoly-sabata/kilasy_resources";

export async function getKilasys() {
  const res = await get(BASE);
  return extractCollection(res);
}

export function getKilasy(id) {
  return get(`${BASE}/${id}`);
}

export function createKilasy(data) {
  return post(BASE, data);
}

export function updateKilasy(id, data) {
  return patch(`${BASE}/${id}`, data);
}

export function deleteKilasy(id) {
  return del(`${BASE}/${id}`);
}
