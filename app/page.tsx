// app/bookings/page.tsx - UPDATED
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingManager } from "@/app/components/BookingManager";
import { BookingForm } from "@/app/components/BookingForm";
import { Calendar, ListTodo, PlusCircle } from "lucide-react";

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState("manage");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Bookings Management</h1>
        <p className="text-muted-foreground">
          Manage booking requests and create new bookings
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="manage" className="flex items-center gap-2">
            <ListTodo className="h-4 w-4" />
            Manage Bookings
          </TabsTrigger>
          <TabsTrigger value="create" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Create Booking
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manage">
          <BookingManager />
        </TabsContent>

        <TabsContent value="create">
          <div className="max-w-4xl mx-auto">
            <BookingForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
