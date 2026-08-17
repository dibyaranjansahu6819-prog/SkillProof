import api from "./api";

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register/", userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post("/token/", credentials);

  localStorage.setItem("access_token", response.data.access);
  localStorage.setItem("refresh_token", response.data.refresh);

  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me/");
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

export const getAccessToken = () => {
  return localStorage.getItem("access_token");
};

