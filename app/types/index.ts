// app/types/index.ts
export interface Venue {
  id: string;
  name: string;
  description?: string;
  city: string;
  capacity: number;
  pricePerNight: number; // in cents
  images: string[];
  amenities: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  venueId: string;
  companyName: string;
  email: string;
  startDate: string;
  endDate: string;
  attendeeCount: number;
  status: "PENDING" | "CONFIRMED" | "REJECTED";
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
  venue?: {
    id: string;
    name: string;
    city: string;
    capacity: number;
    pricePerNight: number;
  };
}

export interface CreateVenueInput {
  name: string;
  description?: string;
  city: string;
  capacity: number;
  pricePerNight: number;
  images: string[];
  amenities: string[];
}

export interface CreateBookingInput {
  venueId: string;
  companyName: string;
  email: string;
  startDate: string;
  endDate: string;
  attendeeCount: number;
  specialRequests?: string;
}

export interface UpdateBookingStatusInput {
  id: string;
  status: "PENDING" | "CONFIRMED" | "REJECTED";
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Filter Types
export interface VenueFilters {
  city?: string;
  minCapacity?: number;
  maxPrice?: number;
  amenities?: string[];
  page?: number;
  limit?: number;
}

export interface BookingFilters {
  status?: string;
  venueId?: string;
  companyName?: string;
  email?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// Statistics Types
export interface BookingStats {
  total: number;
  confirmed: number;
  pending: number;
  rejected: number;
  revenue: number;
  occupancyRate: number;
}

export interface VenueStats {
  totalVenues: number;
  totalCapacity: number;
  averagePrice: number;
  popularCities: string[];
}
