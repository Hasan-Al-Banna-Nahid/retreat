// app/components/BookingForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateBooking, useVenues } from "@/app/lib/hooks";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Calendar,
  Users,
  Building2,
  Mail,
  Briefcase,
  Loader2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const bookingSchema = z
  .object({
    venueId: z.string().min(1, "Please select a venue"),
    companyName: z.string().min(1, "Company name is required"),
    email: z.string().email("Please enter a valid email"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    attendeeCount: z.coerce.number().min(1, "At least 1 attendee is required"),
    specialRequests: z.string().optional(),
  })
  .refine((data) => new Date(data.startDate) < new Date(data.endDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  venueId?: string;
  onSuccess?: () => void;
}

export function BookingForm({ venueId, onSuccess }: BookingFormProps) {
  const { data: venuesData, isLoading: venuesLoading } = useVenues();
  const createBooking = useCreateBooking();

  const venues = Array.isArray(venuesData?.data)
    ? venuesData.data
    : Array.isArray(venuesData)
    ? venuesData
    : [];

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      venueId: venueId || "",
      companyName: "",
      email: "",
      startDate: "",
      endDate: "",
      attendeeCount: 1,
      specialRequests: "",
    },
  });

  const selectedVenueId = form.watch("venueId");
  const selectedVenue = venues.find((v) => v.id === selectedVenueId);

  useEffect(() => {
    if (venueId) {
      form.setValue("venueId", venueId);
    }
  }, [venueId, form]);

  const onSubmit = async (data: BookingFormData) => {
    try {
      await createBooking.mutateAsync({
        ...data,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
      });

      toast.success("Booking request submitted successfully!");
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to submit booking"
      );
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Book a Venue
        </CardTitle>
        <CardDescription>
          Fill out the form below to request a booking for your retreat.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Venue Selection */}
            <FormField
              control={form.control}
              name="venueId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Select Venue *
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a venue" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {venuesLoading ? (
                        <div className="flex items-center justify-center py-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      ) : venues.length === 0 ? (
                        <div className="py-2 text-center text-muted-foreground">
                          No venues available
                        </div>
                      ) : (
                        venues.map((venue) => (
                          <SelectItem key={venue.id} value={venue.id}>
                            <div className="flex items-center justify-between">
                              <span>{venue.name}</span>
                              <span className="text-xs text-muted-foreground ml-2">
                                {venue.city}
                              </span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Venue Info Card */}
            {selectedVenue && (
              <Card className="bg-muted/50">
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Venue Capacity</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedVenue.capacity} people
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Price per Night</p>
                      <p className="text-sm text-muted-foreground">
                        ${(selectedVenue.pricePerNight / 100).toFixed(2)}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm font-medium">Amenities</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedVenue.amenities
                          ?.slice(0, 3)
                          .map((amenity, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-background px-2 py-1 rounded"
                            >
                              {amenity}
                            </span>
                          ))}
                        {selectedVenue.amenities?.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{selectedVenue.amenities.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Company Name *
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Your company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="contact@company.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date *</FormLabel>
                    <FormControl>
                      <Input type="date" min={today} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date *</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        min={form.getValues("startDate") || today}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="attendeeCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Number of Attendees *
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="1"
                        max={selectedVenue?.capacity || 1000}
                        {...field}
                      />
                      {selectedVenue && (
                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                          Max: {selectedVenue.capacity}
                        </span>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specialRequests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Requests</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any special requirements or notes..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={createBooking.isPending}
              className="w-full"
              size="lg"
            >
              {createBooking.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Booking Request"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
