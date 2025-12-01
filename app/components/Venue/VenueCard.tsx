"use client";

import { Venue } from "@/app/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Users,
  DollarSign,
  Trash2,
  Edit,
  Building2,
} from "lucide-react";
import { formatCurrency } from "@/app/lib/utils";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { VenueForm } from "./VenueForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface VenueCardProps {
  venue: Venue;
  onDelete: () => void;
}

export function VenueCard({ venue, onDelete }: VenueCardProps) {
  const router = useRouter();

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">{venue.name}</CardTitle>
          </div>
          <Badge variant="secondary">{venue.city}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="mr-2 h-4 w-4" />
          {venue.city}
        </div>

        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="mr-2 h-4 w-4" />
          Capacity: {venue.capacity} people
        </div>

        <div className="flex items-center text-sm text-muted-foreground">
          <DollarSign className="mr-2 h-4 w-4" />
          {formatCurrency(venue.pricePerNight)} / night
        </div>

        {venue.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
            {venue.description}
          </p>
        )}

        {venue.amenities?.length > 0 && (
          <div className="pt-2">
            <div className="flex flex-wrap gap-1">
              {venue.amenities.slice(0, 3).map((amenity, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {amenity}
                </Badge>
              ))}
              {(venue.amenities?.length || 0) > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{(venue.amenities?.length || 0) - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2 pt-0">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex-1">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <VenueForm venue={venue} />
          </DialogContent>
        </Dialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="flex-1">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Venue</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{venue.name}"? This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
