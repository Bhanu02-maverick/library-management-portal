import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5001/api" });

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("lp_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto logout on 401
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("lp_token");
      localStorage.removeItem("lp_user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ── Auth ────────────────────────────────────────────────────
export const authAPI = {
  login:    (data)  => API.post("/auth/login",    data),
  register: (data)  => API.post("/auth/register", data),
  me:       ()      => API.get("/auth/me"),
};

// ── Books ───────────────────────────────────────────────────
export const booksAPI = {
  getAll:  (params) => API.get("/books",     { params }),
  getOne:  (id)     => API.get(`/books/${id}`),
  create:  (data)   => API.post("/books",    data),
  update:  (id, data) => API.put(`/books/${id}`, data),
  delete:  (id)     => API.delete(`/books/${id}`),
};

// ── Borrows ─────────────────────────────────────────────────
export const borrowsAPI = {
  getAll:  (params) => API.get("/borrows",              { params }),
  issue:   (data)   => API.post("/borrows",             data),
  return:  (id)     => API.put(`/borrows/${id}/return`),
};

// ── Users ───────────────────────────────────────────────────
export const usersAPI = {
  getAll:  (params)    => API.get("/users",        { params }),
  getOne:  (id)        => API.get(`/users/${id}`),
  update:  (id, data)  => API.put(`/users/${id}`,  data),
};

// ── Stats ───────────────────────────────────────────────────
export const statsAPI = {
  dashboard: () => API.get("/stats/dashboard"),
};

export default API;
