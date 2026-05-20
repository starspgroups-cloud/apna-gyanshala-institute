import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://apna-gyanshala-institute.onrender.com";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const saveAuthData = (token: string, user: any, role: string) => {
  localStorage.setItem("ag_token", token);
  localStorage.setItem("ag_user_role", role);
  localStorage.setItem("ag_user_uid", user?._id || user?.uid || "");
  localStorage.setItem("ag_user_email", user?.email || "");
  localStorage.setItem("ag_user_data", JSON.stringify(user || {}));
};

export const clearAuthData = () => {
  localStorage.removeItem("ag_token");
  localStorage.removeItem("ag_user_role");
  localStorage.removeItem("ag_user_uid");
  localStorage.removeItem("ag_user_email");
  localStorage.removeItem("ag_user_data");
};