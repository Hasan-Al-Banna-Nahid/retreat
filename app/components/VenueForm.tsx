// app/components/VenueForm.tsx - UPDATED
"use client";

import { useState } from "react";
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
import { useCreateVenue, useUpdateVenue } from "@/app/lib/hooks";
import { Venue } from "@/app/types";
import { toast } from "sonner";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Define the venue schema
const venueSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  city: z.string().min(1, "City is required"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  pricePerNight: z.coerce.number().min(1, "Price must be at least 1"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  amenities: z.array(z.string()).default([]),
});

type VenueFormData = z.infer<typeof venueSchema>;

interface VenueFormProps {
  venue?: Venue;
  onSuccess?: () => void;
}

export function VenueForm({ venue, onSuccess }: VenueFormProps) {
  const [amenity, setAmenity] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const form = useForm<VenueFormData>({
    resolver: zodResolver(venueSchema),
    defaultValues: venue
      ? {
          name: venue.name || "",
          description: venue.description || "",
          city: venue.city || "",
          capacity: venue.capacity || 10,
          pricePerNight: venue.pricePerNight || 10000,
          images: venue.images || [],
          amenities: venue.amenities || [],
        }
      : {
          name: "",
          description: "",
          city: "",
          capacity: 10,
          pricePerNight: 10000,
          images: [],
          amenities: [],
        },
  });

  const createVenue = useCreateVenue();
  const updateVenue = useUpdateVenue();

  const onSubmit = async (data: VenueFormData) => {
    try {
      if (venue) {
        await updateVenue.mutateAsync({ id: venue.id, data });
        toast.success("Venue updated successfully!");
      } else {
        await createVenue.mutateAsync(data);
        toast.success("Venue created successfully!");
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save venue"
      );
    }
  };

  const addAmenity = () => {
    if (amenity.trim()) {
      const currentAmenities = form.getValues("amenities") || [];
      form.setValue("amenities", [...currentAmenities, amenity.trim()]);
      setAmenity("");
    }
  };

  const removeAmenity = (index: number) => {
    const currentAmenities = form.getValues("amenities") || [];
    form.setValue(
      "amenities",
      currentAmenities.filter((_, i) => i !== index)
    );
  };

  const addImage = () => {
    if (imageUrl.trim()) {
      const currentImages = form.getValues("images") || [];
      form.setValue("images", [...currentImages, imageUrl.trim()]);
      setImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    const currentImages = form.getValues("images") || [];
    form.setValue(
      "images",
      currentImages.filter((_, i) => i !== index)
    );
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{venue ? "Edit Venue" : "Create Venue"}</DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter venue name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the venue..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter city" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacity *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter capacity"
                      min="1"
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
            name="pricePerNight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price Per Night (in cents) *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter price"
                    min="1"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormLabel>Amenities</FormLabel>
            <div className="flex gap-2 mb-3 mt-2">
              <Input
                value={amenity}
                onChange={(e) => setAmenity(e.target.value)}
                placeholder="Add an amenity (e.g., WiFi, Parking)"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addAmenity();
                  }
                }}
              />
              <Button type="button" onClick={addAmenity} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(form.watch("amenities") || []).map((item, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="gap-1 pl-3 pr-2 py-1"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => removeAmenity(index)}
                    className="ml-1 hover:bg-muted rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <FormLabel>Images *</FormLabel>
            <div className="flex gap-2 mb-3 mt-2">
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                type="url"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addImage();
                  }
                }}
              />
              <Button type="button" onClick={addImage} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {(form.watch("images") || []).map((url, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <span className="text-sm truncate">{url}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            {form.formState.errors.images && (
              <p className="text-sm font-medium text-destructive mt-1">
                {form.formState.errors.images.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={createVenue.isPending || updateVenue.isPending}
            className="w-full"
          >
            {(createVenue.isPending || updateVenue.isPending) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {venue ? "Update Venue" : "Create Venue"}
          </Button>
        </form>
      </Form>
    </>
  );
}
