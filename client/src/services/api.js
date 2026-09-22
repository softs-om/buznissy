import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ------------------------------
// Business
// ------------------------------
export const getMyBusinesses = () => {
  return api.get("/businesses");
};

// -----------------------------
// Categories
// -----------------------------
export const getCategories = (businessId) => {
  return api.get(`/categories/business/${businessId}`);
};

export const getCategory = async (categoryId) => {
  const response = await api.get(`/categories/${categoryId}`);
  return response;
};

export const createCategory = (data) => {
  return api.post("/categories", data);
};

export const updateCategory = (categoryId, data) => {
  return api.put(`/categories/${categoryId}`, data);
};

export const deleteCategory = (categoryId) => {
  return api.delete(`/categories/${categoryId}`);
};
// -----------------------------
// Products / Services
// -----------------------------
export const getServices = (categoryId) => {
  return api.get(`/services/category/${categoryId}`);
};

export const createService = (data) => {
  return api.post("/services", data);
};

export const updateService = (serviceId, data) => {
  return api.put(`/services/${serviceId}`, data);
};

export const deleteService = (serviceId) => {
  return api.delete(`/services/${serviceId}`);
};

export default api;
