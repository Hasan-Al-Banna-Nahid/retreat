// app/components/VenueBookingDashboard.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Users,
  DollarSign,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import { useVenueBookings } from "@/app/lib/hooks";
import { format } from "date-fns";

interface VenueBookingDashboardProps {
  venueId: string;
  venueName: string;
  venueCapacity: number;
  venuePrice: number;
}

export function VenueBookingDashboard({
  venueId,
  venueName,
  venueCapacity,
  venuePrice,
}: VenueBookingDashboardProps) {
  const { data: bookingsData, isLoading } = useVenueBookings(venueId);

  const bookings = Array.isArray(bookingsData)
    ? bookingsData
    : Array.isArray(bookingsData?.data)
    ? bookingsData.data
    : [];

  // Calculate statistics
  const confirmedBookings = bookings.filter((b) => b.status === "CONFIRMED");
  const pendingBookings = bookings.filter((b) => b.status === "PENDING");
  const totalRevenue = confirmedBookings.reduce((sum, booking) => {
    const days = Math.ceil(
      (new Date(booking.endDate).getTime() -
        new Date(booking.startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return sum + days * venuePrice;
  }, 0);

  const occupancyRate = ((confirmedBookings.length * 30) / (365 * 0.7)) * 100; // Simplified calculation

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">Loading booking data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Booking Dashboard: {venueName}</span>
            <Badge variant="outline" className="text-sm">
              Capacity: {venueCapacity}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Bookings
                    </p>
                    <p className="text-2xl font-bold">{bookings.length}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Confirmed
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {confirmedBookings.length}
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <TrendingUp className="h-8 w-8" />
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Pending
                    </p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {pendingBookings.length}
                    </p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <Users className="h-8 w-8" />
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Revenue
                    </p>
                    <p className="text-2xl font-bold">
                      ${(totalRevenue / 100).toFixed(2)}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="upcoming">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {confirmedBookings
            .filter((b) => new Date(b.startDate) > new Date())
            .map((booking) => (
              <Card key={booking.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{booking.companyName}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(booking.startDate), "MMM dd")} -{" "}
                        {format(new Date(booking.endDate), "MMM dd, yyyy")}
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {booking.attendeeCount} attendees
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {pendingBookings.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{booking.companyName}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.email}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
