// app/lib/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  timeout: 30000, // Increased timeout for large operations
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with better error handling
api.interceptors.response.use(
  (response) => {
    // Handle different response structures
    if (response.data?.success === false) {
      throw new Error(
        response.data.error || response.data.message || "API Error"
      );
    }

    // Return data consistently
    return {
      ...response,
      data: response.data?.data || response.data,
      success: response.data?.success ?? true,
      message: response.data?.message,
      pagination: response.data?.pagination,
    };
  },
  (error) => {
    console.error("API Error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
    });

    // Handle specific error cases
    if (error.response?.status === 401) {
      // Redirect to login or refresh token
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    if (error.response?.status === 404) {
      throw new Error("Resource not found");
    }

    if (error.response?.status === 500) {
      throw new Error("Server error. Please try again later.");
    }

    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    throw new Error(errorMessage);
  }
);

// Helper functions
const prepareQueryParams = (params?: any) => {
  if (!params) return {};

  const prepared: any = {};
  Object.keys(params).forEach((key) => {
    if (
      params[key] !== undefined &&
      params[key] !== null &&
      params[key] !== ""
    ) {
      prepared[key] = params[key];
    }
  });

  return prepared;
};

// Venues API
export const venueApi = {
  getAll: (params?: any) => {
    const queryParams = prepareQueryParams(params);
    return api.get("/venues", { params: queryParams });
  },

  getById: (id: string) => api.get(`/venues/${id}`),

  create: (data: any) => api.post("/venues", data),

  update: (id: string, data: any) => api.put(`/venues/${id}`, data),

  delete: (id: string) => api.delete(`/venues/${id}`),

  // Optional: Bulk operations
  bulkDelete: (ids: string[]) => api.post("/venues/bulk-delete", { ids }),

  bulkUpdate: (ids: string[], data: any) =>
    api.put("/venues/bulk-update", { ids, data }),
};

// Bookings API
export const bookingApi = {
  getAll: (params?: any) => {
    const queryParams = prepareQueryParams(params);
    return api.get("/bookings", { params: queryParams });
  },

  getById: (id: string) => api.get(`/bookings/${id}`),

  getByVenue: (venueId: string) => api.get(`/bookings/venue/${venueId}`),

  create: (data: any) => {
    // Ensure dates are in correct format
    const formattedData = {
      ...data,
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
    };
    return api.post("/bookings", formattedData);
  },

  update: (id: string, data: any) => api.put(`/bookings/${id}`, data),

  updateStatus: (id: string, status: string) =>
    api.put(`/bookings/${id}/status`, { status }),

  delete: (id: string) => api.delete(`/bookings/${id}`),

  // Optional: Booking statistics
  getStats: () => api.get("/bookings/stats"),
};

// Dashboard API (optional)
export const dashboardApi = {
  getOverview: () => api.get("/dashboard/overview"),

  getRecentBookings: (limit = 10) =>
    api.get("/dashboard/recent-bookings", { params: { limit } }),

  getRevenueStats: (period = "monthly") =>
    api.get("/dashboard/revenue", { params: { period } }),
};

export default api;
