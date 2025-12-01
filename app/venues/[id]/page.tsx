"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, DollarSign, Calendar, ArrowLeft } from "lucide-react";
import { useVenue } from "@/app/lib/hooks";
import { BookingForm } from "@/app/components/Bookings/BookingForm";
import { formatCurrency } from "@/app/lib/utils";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function VenuePage() {
  const params = useParams();
  const router = useRouter();
  const { data: venue, isLoading, error } = useVenue(params.id as string);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !venue) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Venue not found or error loading venue
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">{venue.name}</h1>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{venue.city}</span>
                  </div>
                  <Badge variant="secondary">Capacity: {venue.capacity}</Badge>
                </div>

                <div className="flex items-center gap-6 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{venue.capacity} people</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span>{formatCurrency(venue.pricePerNight)} / night</span>
                  </div>
                </div>

                {venue.description && (
                  <p className="text-muted-foreground">{venue.description}</p>
                )}

                {venue.amenities.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {venue.amenities.map((amenity, index) => (
                        <Badge key={index} variant="outline">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {venue.images.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Images</h3>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {venue.images.slice(0, 4).map((url, index) => (
                        <div
                          key={index}
                          className="aspect-video bg-muted rounded-lg overflow-hidden"
                          style={{
                            backgroundImage: `url(${url})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <BookingForm venue={venue} />
        </div>
      </div>
    </div>
  );
}
