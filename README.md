# Retreat Venue Booking Platform

![Retreat Platform Screenshot](https://retreat-zv61.vercel.app/social-card.png) *(This is a placeholder image, please replace with a real screenshot)*

Welcome to the Retreat Venue Booking Platform! This application provides a comprehensive solution for managing venue listings and facilitating booking requests. Built with Next.js, React, and powered by a robust API, it offers a seamless experience for both venue administrators and users looking to book the perfect retreat location.

Live Site: [https://retreat-zv61.vercel.app/](https://retreat-zv61.vercel.app/)

## Table of Contents

-   [Features](#features)
-   [Technology Stack](#technology-stack)
-   [Project Structure](#project-structure)
-   [Core Components & Pages](#core-components--pages)
    -   [Pages](#pages)
    -   [Application-Specific Components (`app/components`)](#application-specific-components-appcomponents)
    -   [UI Library Components (`components/ui`)](#ui-library-components-componentsui)
-   [Libraries, Hooks, and Types](#libraries-hooks-and-types)
    -   [API Client (`app/lib/api.ts`)](#api-client-applibapits)
    -   [Custom Hooks (`app/lib/hooks.ts`)](#custom-hooks-applibhooksts)
    -   [Utilities (`app/lib/utils.tsx`)](#utilities-applibutilstsa)
    -   [Global State/Providers (`app/providers/QueryProviders.tsx`)](#global-stateproviders-appprovidersqueryproviderstsa)
    -   [Type Definitions (`app/types/index.ts`)](#type-definitions-apptypesindex_ts)
-   [How it Works](#how-it-works)
-   [Getting Started](#getting-started)
-   [Contributing](#contributing)
-   [License](#license)

## Features

-   **Venue Management:** Create, view, edit, and delete venue listings with details like capacity, price, images, and amenities.
-   **Venue Search & Filtering:** Efficiently search for venues by city, minimum capacity, and maximum price.
-   **Booking Requests:** Users can submit booking requests for specific venues, specifying company details, dates, and attendee counts.
-   **Booking Management:** Administrators can view, filter, search, and update the status (confirm/reject) of booking requests.
-   **Intuitive UI:** A clean and responsive user interface built with Shadcn UI components.
-   **Data Fetching & Caching:** Leverages React Query for efficient, up-to-date data handling.

## Technology Stack

-   **Framework:** Next.js 14 (React)
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS
-   **UI Components:** Shadcn UI
-   **Form Management:** React Hook Form, Zod (for validation)
-   **Data Fetching:** React Query (`@tanstack/react-query`)
-   **API Client:** Axios
-   **Date Manipulation:** `date-fns`
-   **Icons:** Lucide React
-   **Backend:** (Assumed external REST API, accessed via `/api` endpoint)

## Project Structure

The project follows a standard Next.js application structure with logical separation of concerns:

```
.
├── app/                  # Main application routes, layout, global styles, and core logic
│   ├── bookings/         # Bookings page and related components/logic
│   ├── components/       # Reusable components specific to the application's domain
│   ├── lib/              # API client, custom hooks, and utility functions
│   ├── providers/        # Global context providers (e.g., React Query)
│   ├── types/            # TypeScript type definitions
│   └── venues/           # Venues pages (list and detail) and related components/logic
├── components/           # General-purpose UI components (e.g., Shadcn UI)
│   └── ui/               # Re-usable UI components (buttons, cards, forms, etc.)
└── public/               # Static assets
└── ...                   # Other configuration files (.gitignore, package.json, etc.)
```

## Core Components & Pages

### Pages

-   **`/` (Home Page - `app/page.tsx`)**: The main landing page for the application. *(Content not provided in analysis, assumed to be a welcome/overview page)*
-   **`/bookings` (`app/bookings/page.tsx`)**:
    -   Displays a comprehensive list of all booking requests.
    -   Allows searching bookings by company name or email.
    -   Shows essential booking details like venue, company, dates, attendees, and status.
    -   Utilizes `useBookings` hook for data fetching.
-   **`/venues` (`app/venues/page.tsx`)**:
    -   Presents a list of available venues with search and filtering capabilities (city, min capacity, max price).
    -   Offers pagination for browsing large numbers of venues.
    -   Includes functionality to add new venues via a modal form (`VenueForm`).
    -   Utilizes `useVenues` hook for data fetching.
-   **`/venues/[id]` (`app/venues/[id]/page.tsx`)**:
    -   Shows detailed information for a specific venue, including description, images, amenities, capacity, and price.
    -   Provides a dedicated form (`BookingForm`) to submit a booking request for the displayed venue.
    -   Utilizes `useVenue` hook to fetch individual venue data.

### Application-Specific Components (`app/components`)

-   **`Bookings/BookingForm.tsx`**:
    -   A dynamic form for creating new booking requests, potentially pre-filled for a specific venue.
    -   Handles input validation using Zod and `react-hook-form`.
    -   Interacts with `useCreateBooking` and `useVenues` hooks.
-   **`Bookings/BookingManager.tsx`**:
    -   An administrative component to view, filter, and manage all booking requests.
    -   Allows updating booking statuses (CONFIRMED, REJECTED) and provides a placeholder for deletion.
    -   Uses `useBookings` and `useUpdateBookingStatus` hooks.
-   **`Header/Header.tsx`**:
    -   The global navigation bar, providing links to the "Home", "Venues", and "Bookings" pages.
    -   Highlights the currently active page.
-   **`Venue/VenueBookingDashboard.tsx`**:
    -   Displays statistics and a breakdown of bookings for a particular venue.
    -   Includes summary cards for total, confirmed, and pending bookings, and estimated revenue.
    -   Organizes bookings into tabs (Upcoming, Pending, Past).
    -   Uses `useVenueBookings` hook.
-   **`Venue/VenueCard.tsx`**:
    -   A display component representing a single venue in a card format.
    -   Shows key venue information and includes actions to "Edit" (via `VenueForm`) or "Delete" (with confirmation).
-   **`Venue/VenueForm.tsx`**:
    -   A versatile form for creating new venues or editing existing venue details.
    -   Manages dynamic inputs for images and amenities.
    -   Uses `useCreateVenue` and `useUpdateVenue` hooks.
-   **`Venue/VenueList.tsx`**:
    -   A container component that renders a grid of `VenueCard`s.
    -   Handles loading, error states, and orchestrates delete actions for individual venues.

### UI Library Components (`components/ui`)

This directory contains re-usable UI components sourced from `shadcn/ui`, including but not limited to: `alert-dialog`, `alert`, `badge`, `button`, `calendar`, `card`, `dialog`, `dropdown-menu`, `form`, `input`, `label`, `popover`, `select`, `separator`, `sonner` (for toasts), `tabs`, and `textarea`. These components provide a consistent and accessible design system.

## Libraries, Hooks, and Types

### API Client (`app/lib/api.ts`)

-   **`axios`**: Configured as the HTTP client with a base URL (from `NEXT_PUBLIC_API_URL` environment variable or `http://localhost:5000/api`).
-   **Interceptors**:
    -   **Request:** Automatically attaches `Authorization` headers with a bearer token from `localStorage`.
    -   **Response:** Standardizes error handling, extracts data consistently, and includes logic for redirecting on 401 errors.
-   **`venueApi`**: Provides methods for all CRUD operations on venue resources.
-   **`bookingApi`**: Provides methods for CRUD operations on booking resources, including specific `updateStatus` and `getByVenue` functions.

### Custom Hooks (`app/lib/hooks.ts`)

Leverages `@tanstack/react-query` for declarative, efficient, and cached data fetching.

-   **`useVenues(params?: any)`**: Fetches a paginated and filtered list of venues.
-   **`useVenue(id: string)`**: Fetches details for a single venue by its ID.
-   **`useCreateVenue()`, `useUpdateVenue()`, `useDeleteVenue()`**: Mutations for managing venue data, automatically invalidating relevant queries on success.
-   **`useBookings(params?: any)`**: Fetches a paginated and filtered list of bookings.
-   **`useBooking(id: string)`**: Fetches details for a single booking by its ID.
-   **`useCreateBooking()`, `useUpdateBookingStatus()`**: Mutations for managing booking data.
-   **`useVenueBookings(venueId: string)`**: Fetches all bookings associated with a specific venue.
-   **Utility Hooks**:
    -   **`useLocalStorage<T>(key: string, initialValue: T)`**: A React hook for persisting state in `localStorage`.
    -   **`useDebounce<T>(value: T, delay: number)`**: Delays updating a value until a specified time has passed without further changes, useful for search inputs.
    -   **`useMediaQuery(query: string)`**: Determines if a CSS media query matches the current viewport, useful for responsive design.

### Utilities (`app/lib/utils.tsx`)

-   **`cn(...inputs: ClassValue[])`**: A utility function for conditionally joining Tailwind CSS classes, enhancing readability and maintainability of styling.
-   **`formatCurrency(amount: number)`**: Formats a numerical value (assumed to be in cents) into a user-friendly currency string (e.g., "$100.00").

### Global State/Providers (`app/providers/QueryProviders.tsx`)

-   **`QueryClientProvider`**: Wraps the entire application (or relevant parts) to provide the React Query `QueryClient` instance, enabling all data fetching and caching capabilities.
-   **`ReactQueryDevtools`**: Included for easy debugging and monitoring of React Query's cache and requests during development.

### Type Definitions (`app/types/index.ts`)

-   **`Venue`**: Interface defining the structure of venue objects.
-   **`Booking`**: Interface defining the structure of booking objects, including nested venue details.
-   **`CreateVenueInput`, `CreateBookingInput`**: Interfaces for the data payloads sent to create new venues or bookings.
-   **`ApiResponse<T>`, `PaginatedResponse<T>`**: Generic interfaces for standardizing API responses, including pagination metadata.
-   **`VenueFilters`, `BookingFilters`**: Interfaces for parameters used in filtering venue and booking lists.

## How it Works

The application operates as a single-page application (SPA) with routing handled by Next.js.

1.  **Navigation**: Users navigate between different sections (Home, Venues, Bookings) using the `Header` component.
2.  **Data Flow (Client-Side)**:
    -   When a page or component requires data (e.g., `VenuesPage` needs venue listings), it uses a custom React Query hook (e.g., `useVenues`).
    -   This hook internally calls the `venueApi` (or `bookingApi`) to make an HTTP request to the backend.
    -   `axios` handles the actual network request, including attaching authentication tokens and processing responses.
    -   React Query caches the fetched data, manages loading and error states, and automatically re-fetches data when necessary (e.g., after a mutation or when a component re-mounts).
    -   UI components then render based on the data and state provided by the React Query hooks.
3.  **Mutations (Client-Side)**:
    -   When a user performs an action that modifies data (e.g., creating a booking via `BookingForm`), a React Query mutation hook (e.g., `useCreateBooking`) is used.
    -   The mutation hook sends the data to the backend via the `bookingApi`.
    -   Upon successful completion, the mutation automatically "invalidates" relevant cached queries, prompting React Query to re-fetch fresh data for affected lists or detail views. This ensures the UI is always up-to-date.
4.  **Form Management**: `react-hook-form` simplifies form handling, while `zod` provides robust schema-based validation, ensuring data integrity before API submission.
5.  **UI/UX**: `shadcn/ui` components ensure a consistent, accessible, and aesthetically pleasing user experience.

## Getting Started

To get a local copy up and running, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [repository-url]
    cd retreat
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Set up environment variables:**
    Create a `.env.local` file in the root directory and add your API base URL:
    ```
    NEXT_PUBLIC_API_URL=http://localhost:5000/api
    ```
    *(Replace `http://localhost:5000/api` with your actual backend API URL)*

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License.