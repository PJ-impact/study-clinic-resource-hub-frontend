# System State Documentation

**Date:** 2026-01-21
**Project Name:** Resource Hub

## Overview
This project is a web-based "Resource Hub" platform designed to serve academic and holistic growth needs. It is built using **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**. The current state represents a high-fidelity frontend prototype with mock data and interactive UI components, but without backend integration or real authentication.





## Tech Stack
- **Framework:** Next.js 16.0.10 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4.x (with `tailwindcss-animate`)
- **UI Library:** Radix UI primitives (via shadcn/ui structure), Lucide React icons
- **Animation:** Framer Motion
- **Form Handling:** React Hook Form + Zod
- **Other Libraries:** Recharts, Date-fns, Embla Carousel

## Project Structure

### Key Directories
- `app/`: Contains the application routes and layouts.
- `components/`:
  - `ui/`: Reusable UI components (buttons, inputs, dialogs, etc.).
  - Feature-specific components (e.g., `sidebar.tsx`, `resource-card.tsx`, `login-panel.tsx`).
- `lib/`: Utility functions (`utils.ts`).
- `public/`: Static assets (images, icons).

### Routes & Pages
1.  **Home (`/`)**
    -   **Description:** Main dashboard.
    -   **Components:** `Sidebar`, `DashboardHero`, `ResourceCard` (displaying Pinned & Recent resources), `UploadModal`.
    -   **Data:** Mock data defined in `app/page.tsx` (`pinnedResources`).

2.  **Login (`/login`)**
    -   **Description:** Split-screen login page for Students and Contributors.
    -   **Components:** `StudentLoginPanel`, `ContributorLoginPanel`.
    -   **Functionality:** UI-only. `handleSubmit` simulates a network delay but does not perform actual authentication.

3.  **Departments (`/departments/[slug]`)**
    -   **Description:** Dynamic pages for specific academic departments (e.g., Law, Pharmacy, IT).
    -   **Components:** `Sidebar`, `ResourceCard`, Filtering UI.
    -   **Data:** Mock data dictionary (`departmentData`) in `app/departments/[slug]/page.tsx`.

4.  **Growth (`/growth/[category]`)**
    -   **Description:** Dynamic pages for growth categories (e.g., Career, Spiritual).
    -   **Components:** `Sidebar`, `ResumeTemplateCard`, `VideoCarousel`, `ReflectionModeToggle`.
    -   **Data:** Mock data objects (`careerResources`, `spiritualResources`) in `app/growth/[category]/page.tsx`.

## Current Functionality & Limitations

### Implemented
-   **Responsive UI:** Complete layout with Sidebar navigation and responsive grids.
-   **Routing:** Functional navigation between Dashboard, Departments, and Growth pages.
-   **Interactivity:**
    -   Upload Modal opens/closes.
    -   Tabs and sorting buttons (UI state changes).
    -   Form inputs in Login panels (state managed).
-   **Visuals:** Animations using Framer Motion (especially on Login page).

### Missing / To Be Implemented
-   **Backend Integration:** No API routes or database connection. All data is static/mocked.
-   **Authentication:** No real user sessions, JWT handling, or database verification.
-   **File Upload:** The `UploadModal` exists but does not actually upload files to any storage (e.g., S3, Blob Storage).
-   **State Management:** Currently relies on local `useState`. No global state management (Context/Redux/Zustand) for user data or complex app state.

## Next Steps (Recommended)
1.  **Backend Setup:** Initialize a database (e.g., PostgreSQL/Supabase) and Prisma/Drizzle ORM.
2.  **Authentication:** Implement Auth.js (NextAuth) or similar for real user login.
3.  **API Development:** Create API routes to serve dynamic resource data instead of mock objects.
4.  **File Storage:** Integrate a storage solution for the "Upload" functionality.
