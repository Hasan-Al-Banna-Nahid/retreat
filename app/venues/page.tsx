"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, FilterX, Loader2 } from "lucide-react";
import { VenueList } from "@/app/components/VenueList";
import { VenueForm } from "@/app/components/VenueForm";
import { useVenues } from "@/app/lib/hooks";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function VenuesPage() {
  // Filter states
  const [city, setCity] = useState("");
  const [minCapacity, setMinCapacity] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);

  // Prepare query parameters
  const [queryParams, setQueryParams] = useState<any>({
    page: "1",
    limit: "12",
  });

  // Update query params when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      const params: any = {
        page: page.toString(),
        limit: "12",
      };

      if (city && city.trim() !== "") {
        params.city = city.trim();
      }

      if (minCapacity && minCapacity.trim() !== "") {
        params.minCapacity = minCapacity.trim();
      }

      if (maxPrice && maxPrice.trim() !== "") {
        params.maxPrice = maxPrice.trim();
      }

      console.log("Setting query params:", params);
      setQueryParams(params);
    }, 300);

    return () => clearTimeout(timer);
  }, [city, minCapacity, maxPrice, page]);

  const { data, isLoading, error, refetch } = useVenues(queryParams);

  // Debug log to see API response
  useEffect(() => {
    if (data) {
      console.log("API Data:", data);
      console.log("Data type:", typeof data);
      console.log("Is success?", data.success);
      console.log("Data.data:", data.data);
      console.log("Is array?", Array.isArray(data.data));
    }
  }, [data]);

  // Safely extract data from API response - handle both nested and flat structures
  let venues: any[] = [];
  let pagination = { page: 1, limit: 12, total: 0, totalPages: 1 };

  if (data) {
    // Handle nested response structure: data.success -> data.data
    if (data.success && data.data && Array.isArray(data.data)) {
      venues = data.data;
      pagination = data.pagination || pagination;
    }
    // Handle flat structure: just data array
    else if (Array.isArray(data)) {
      venues = data;
    }
    // Handle another nested structure: data.data.data
    else if (data.data && data.data.data && Array.isArray(data.data.data)) {
      venues = data.data.data;
      pagination = data.data.pagination || pagination;
    }
  }

  const clearFilters = () => {
    setCity("");
    setMinCapacity("");
    setMaxPrice("");
    setPage(1);
  };

  const hasActiveFilters = city || minCapacity || maxPrice;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Venues</h1>
          <p className="text-muted-foreground">
            {pagination.total} venues found
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters}>
              <FilterX className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          )}

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Venue
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <VenueForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">City</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by city..."
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    setPage(1); // Reset to page 1 when filter changes
                  }}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Min Capacity</label>
              <Input
                type="number"
                placeholder="Minimum capacity"
                value={minCapacity}
                onChange={(e) => {
                  setMinCapacity(e.target.value);
                  setPage(1);
                }}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Max Price</label>
              <Input
                type="number"
                placeholder="Maximum price"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  setPage(1);
                }}
                min="1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      {/* Venues list */}
      {!isLoading && !error && (
        <>
          <VenueList venues={venues} isLoading={isLoading} error={error} />

          {/* Pagination */}
          {pagination.totalPages > 1 && venues.length > 0 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {(pagination.page - 1) * pagination.limit + 1} -
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} venues
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === 1}
                  onClick={() => setPage(pagination.page - 1)}
                >
                  Previous
                </Button>
                <span className="flex items-center px-3 text-sm">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => setPage(pagination.page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
