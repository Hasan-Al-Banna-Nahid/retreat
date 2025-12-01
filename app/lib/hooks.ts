// app/lib/hooks.ts
"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { venueApi, bookingApi } from "./api";
import { Venue, Booking, ApiResponse, PaginatedResponse } from "@/app/types";

// ============ VENUE HOOKS ============

export const useVenues = (params?: any) => {
  return useQuery<ApiResponse<PaginatedResponse<Venue>>, Error>({
    queryKey: ["venues", params],
    queryFn: async () => {
      const response = await venueApi.getAll(params);
      return response.data;
    },
    retry: 1,
    retryDelay: 1000,
  });
};

export const useVenue = (
  id: string,
  options?: Partial<UseQueryOptions<Venue, Error>>
) => {
  return useQuery<Venue, Error>({
    queryKey: ["venue", id],
    queryFn: async () => {
      const response = await venueApi.getById(id);
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
};

export const useCreateVenue = () => {
  const queryClient = useQueryClient();

  return useMutation<Venue, Error, Partial<Venue>>({
    mutationFn: async (data) => {
      const response = await venueApi.create(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["venues"] });
    },
    onError: (error) => {
      console.error("Failed to create venue:", error);
    },
  });
};

export const useUpdateVenue = () => {
  const queryClient = useQueryClient();

  return useMutation<Venue, Error, { id: string; data: Partial<Venue> }>({
    mutationFn: async ({ id, data }) => {
      const response = await venueApi.update(id, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["venues"] });
      queryClient.invalidateQueries({ queryKey: ["venue", variables.id] });
    },
    onError: (error) => {
      console.error("Failed to update venue:", error);
    },
  });
};

export const useDeleteVenue = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await venueApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["venues"] });
    },
    onError: (error) => {
      console.error("Failed to delete venue:", error);
    },
  });
};

// ============ BOOKING HOOKS ============

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation<Booking, Error, any>({
    mutationFn: async (data) => {
      const response = await bookingApi.create(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (error) => {
      console.error("Failed to create booking:", error);
    },
  });
};

export const useBookings = (params?: any) => {
  return useQuery<ApiResponse<PaginatedResponse<Booking>>, Error>({
    queryKey: ["bookings", params],
    queryFn: async () => {
      const response = await bookingApi.getAll(params);
      return response.data;
    },
  });
};

export const useBooking = (
  id: string,
  options?: Partial<UseQueryOptions<Booking, Error>>
) => {
  return useQuery<Booking, Error>({
    queryKey: ["booking", id],
    queryFn: async () => {
      const response = await bookingApi.getById(id);
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<Booking, Error, { id: string; status: string }>({
    mutationFn: async ({ id, status }) => {
      const response = await bookingApi.updateStatus(id, status);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (error) => {
      console.error("Failed to update booking status:", error);
    },
  });
};

export const useVenueBookings = (venueId: string) => {
  return useQuery<Booking[], Error>({
    queryKey: ["venue-bookings", venueId],
    queryFn: async () => {
      const response = await bookingApi.getByVenue(venueId);
      return response.data;
    },
    enabled: !!venueId,
  });
};

// ============ STATISTICS HOOKS ============

export const useBookingStats = () => {
  return useQuery({
    queryKey: ["booking-stats"],
    queryFn: async () => {
      // You can implement this API endpoint
      const response = await bookingApi.getAll();
      const bookings = response.data?.data || [];

      const confirmed = bookings.filter(
        (b: Booking) => b.status === "CONFIRMED"
      );
      const pending = bookings.filter((b: Booking) => b.status === "PENDING");
      const rejected = bookings.filter((b: Booking) => b.status === "REJECTED");

      return {
        total: bookings.length,
        confirmed: confirmed.length,
        pending: pending.length,
        rejected: rejected.length,
        revenue: confirmed.reduce((sum: number, booking: Booking) => {
          const days = Math.ceil(
            (new Date(booking.endDate).getTime() -
              new Date(booking.startDate).getTime()) /
              (1000 * 60 * 60 * 24)
          );
          // This is a simplified calculation - you should fetch venue price
          return sum + days * 10000; // $100 per day as example
        }, 0),
      };
    },
  });
};

// ============ BULK OPERATIONS HOOKS ============

export const useBulkVenueOperations = () => {
  const queryClient = useQueryClient();

  return {
    deleteMultiple: useMutation<void, Error, string[]>({
      mutationFn: async (ids) => {
        // You'll need to implement bulk delete API endpoint
        await Promise.all(ids.map((id) => venueApi.delete(id)));
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["venues"] });
      },
    }),

    updateMultiple: useMutation<
      void,
      Error,
      { ids: string[]; data: Partial<Venue> }
    >({
      mutationFn: async ({ ids, data }) => {
        // You'll need to implement bulk update API endpoint
        await Promise.all(ids.map((id) => venueApi.update(id, data)));
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["venues"] });
      },
    }),
  };
};

// ============ CUSTOM HOOKS FOR UI ============

export const useVenueFilters = () => {
  const [filters, setFilters] = useState({
    city: "",
    minCapacity: "",
    maxPrice: "",
    amenities: [] as string[],
    page: 1,
    limit: 12,
  });

  const { data, isLoading, error } = useVenues(filters);

  const updateFilter = (key: keyof typeof filters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      city: "",
      minCapacity: "",
      maxPrice: "",
      amenities: [],
      page: 1,
      limit: 12,
    });
  };

  return {
    filters,
    updateFilter,
    clearFilters,
    venues: data?.data?.data || [],
    pagination: data?.data?.pagination || {
      page: 1,
      limit: 12,
      total: 0,
      totalPages: 1,
    },
    isLoading,
    error,
  };
};

// ============ REACT HOOKS FOR STATE MANAGEMENT ============

import { useState, useEffect, useCallback } from "react";

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(error);
      }
    },
    [key, storedValue]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  return [storedValue, setValue] as const;
};

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
};
