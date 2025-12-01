"use client";

import { Venue } from "@/app/types";
import { VenueCard } from "./VenueCard";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { useDeleteVenue } from "@/app/lib/hooks";
import { toast } from "sonner";

interface VenueListProps {
  venues: Venue[] | any;
  isLoading?: boolean;
  error?: string;
}

export function VenueList({ venues, isLoading, error }: VenueListProps) {
  const deleteVenue = useDeleteVenue();

  const handleDelete = async (id: string) => {
    try {
      await deleteVenue.mutateAsync(id);
      toast.success("Venue deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete venue");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Safely handle venues - ensure it's an array
  const venuesArray = Array.isArray(venues) ? venues : [];

  if (venuesArray.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No venues found</h3>
        <p className="text-muted-foreground">
          Try adjusting your filters or create a new venue
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {venuesArray.map((venue: Venue) => (
        <VenueCard
          key={venue.id}
          venue={venue}
          onDelete={() => handleDelete(venue.id)}
        />
      ))}
    </div>
  );
}
