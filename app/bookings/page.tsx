"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Building2, Users } from "lucide-react";
import { useBookings } from "@/app/lib/hooks";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

export default function BookingsPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useBookings();

  // Debug: Log the data structure to console
  console.log("Bookings data:", data);

  // Safely extract bookings array
  const getBookingsArray = () => {
    if (!data) return [];

    // Try different possible structures
    if (Array.isArray(data)) {
      return data;
    }

    if (data && typeof data === "object") {
      if (Array.isArray(data.data)) {
        return data.data;
      }
      if (Array.isArray(data.bookings)) {
        return data.bookings;
      }
      if (Array.isArray(data.items)) {
        return data.items;
      }
    }

    return [];
  };

  const bookings = getBookingsArray();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-500";
      case "REJECTED":
        return "bg-red-500";
      default:
        return "bg-yellow-500";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bookings</h1>
        <p className="text-muted-foreground">View and manage your bookings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by company name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {bookings.map((booking) => (
          <Card key={booking.id}>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">
                      {booking.venue?.name || "Unknown Venue"}
                    </span>
                  </div>
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status}
                  </Badge>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Company</div>
                    <div className="text-sm text-muted-foreground">
                      {booking.companyName}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-medium">Email</div>
                    <div className="text-sm text-muted-foreground">
                      {booking.email}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-medium">Attendees</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {booking.attendeeCount}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(new Date(booking.startDate), "MMM dd, yyyy")}
                    </span>
                    <span>to</span>
                    <span>
                      {format(new Date(booking.endDate), "MMM dd, yyyy")}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {bookings.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No bookings found</p>
        </div>
      )}
    </div>
  );
}
