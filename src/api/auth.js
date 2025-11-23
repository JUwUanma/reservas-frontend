import api from "./axios";

export const register = async (data) => {
  await api.get("/sanctum/csrf-cookie");
  return api.post("/api/register", data);
};

export const login = async (data) => {
  await api.get("/sanctum/csrf-cookie");
  return api.post("/api/login", data);
};

export const logout = async () => {
  return api.post("/api/logout");
};

export const getUser = async () => {
  return api.get("/api/user");
};

