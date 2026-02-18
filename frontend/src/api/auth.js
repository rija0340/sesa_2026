import { getJson, post, setAuthToken, removeAuthToken } from "./client";

export function login(username, password) {
  return post("/api/login_check", { username, password })
    .then((data) => {
      if (data.token) {
        setAuthToken(data.token);
        return data.token;
      }
      throw new Error("Token manquant dans la réponse");
    });
}

export function logout() {
  removeAuthToken();
}

export function getCurrentUser() {
  // Optionnel : si on veut récupérer les infos de l'utilisateur
  // return getJson("/api/me"); 
  return null; 
}
