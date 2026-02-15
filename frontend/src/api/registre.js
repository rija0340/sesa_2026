import { get, getJson, post, patch, del } from "./client";
import { extractCollection } from "./normalize";

const BASE = "/api/sekoly-sabata/registre_resources";
const STATS = "/stats";

// --- CRUD Registre ---

export async function getRegistres() {
  const res = await get(BASE);
  return extractCollection(res);
}

export function getRegistre(id) {
  return get(`${BASE}/${id}`);
}

export function createRegistre(data) {
  return post(BASE, data);
}

export function updateRegistre(id, data) {
  return patch(`${BASE}/${id}`, data);
}

export function deleteRegistre(id) {
  return del(`${BASE}/${id}`);
}

// --- Statistiques (custom controller, JSON classique) ---

export function getStatsKilasy(kilasyId) {
  return getJson(`${STATS}/kilasy/${kilasyId}`);
}

export function getStatsPeriode(dateDebut, dateFin) {
  return getJson(`${STATS}/periode?date_debut=${dateDebut}&date_fin=${dateFin}`);
}

export function getStatsKilasyPeriode(kilasyId, dateDebut, dateFin) {
  return getJson(
    `${STATS}/kilasy/${kilasyId}/periode?date_debut=${dateDebut}&date_fin=${dateFin}`
  );
}
