import apiRequest from "@/config/api";

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  login: (data: { email: string; password: string }) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  logout: () =>
    apiRequest("/auth/logout", {
      method: "POST",
    }),
  getCurrentUser: () =>
    apiRequest("/auth/me", {
      method: "GET",
    }),
};
