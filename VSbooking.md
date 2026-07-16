# Specification & Build Instructions: Resort & Venue Booking Platform

This document serves as the complete specification and instruction set for building and running the **Resort & Venue Booking Platform**. Use this file as a prompt/directive for your VS Code AI agent (e.g., Cursor, Roo Code, Copilot) to generate the entire codebase, install dependencies, and run the application.

---

## 1. Project Overview & Architecture

- **Website Name:** Booking Hotels (Resort Booking Model)
- **Core Concept:** A premium resort, room, and venue/meeting hall booking platform featuring live availability checks, interactive amenities, dining menus, and integrated feedback loops.
- **Tech Stack (MERN / Full-Stack Next.js Recommended for ease of build):**
  - **Frontend:** React with Next.js (App Router), Tailwind CSS, Lucide Icons, and Shadcn UI (or Radix primitives).
  - **State Management & Theme:** React Context (for Light/Dark mode and Booking Cart state).
  - **Backend/Middleware:** Next.js Server Actions or Node.js/Express API with robust middleware (Authentication, Validation, Error Handling).
  - **Database:** MongoDB (using Mongoose) or PostgreSQL (using Prisma) to store Rooms, Venues, Bookings, Users, and Reviews.

---

## 2. Key Features

The website must implement the following features seamlessly:
1. **Room & Venue Types:** Categorized listings (Deluxe Rooms, Executive Suites, Party Halls, Meeting/Conference Rooms).
2. **Resort Amenities:** Interactive displays of:
   - Reception desk information.
   - Dining & Restaurants (including an interactive **Food Menu** with categories and pricing).
   - Children's Play Area & Garden.
   - Service Center / Concierge request portal.
3. **Interactive Parking System:** Live **Car Parking Availability** checker (showing occupied vs. empty spots and allowing reservation).
4. **Live Room/Hall Availability:** A booking calendar system that dynamically checks if a room/hall is available for selected dates.
5. **Maps & Directions:** Integrated mock/live map component (Leaflet.js or Google Maps iframe) showing resort directions.
6. **Social & Feedback Engine:**
   - User reviews, star ratings, and detailed comments section for rooms and services.
   - High-quality image gallery for each room and amenity.
7. **System Theme Preferences:** Modern, clean UI supporting a fully toggleable **Light Mode** and **Dark Mode** preference.

---

## 3. UI/UX Design System (Tailwind CSS)

### Light Mode Palette
- **Primary:** Emerald-600 (Resort / Nature feel)
- **Secondary:** Amber-500 (Luxury highlight)
- **Background:** Slate-50
- **Card Background:** White
- **Text:** Slate-900

### Dark Mode Palette
- **Primary:** Emerald-500
- **Secondary:** Amber-400
- **Background:** Slate-950
- **Card Background:** Slate-900
- **Text:** Slate-50

---

## 4. File Structure to Generate

Generate the workspace with the following directory structure:

```text
booking-hotels/
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Global theme provider, Navbar, Footer
│   │   ├── page.tsx           # Landing page with search, featured rooms, amenities
│   │   ├── rooms/
│   │   │   └── page.tsx       # Rooms listing & filtering
│   │   ├── rooms/[id]/
│   │   │   └── page.tsx       # Room detail, interactive booking, reviews, images
│   │   ├── parking/
│   │   │   └── page.tsx       # Real-time Parking grid and slot reservation
│   │   ├── dining/
│   │   │   └── page.tsx       # Food Menu with filter options
│   │   └── api/               # Next.js Server API routes (Rooms, Bookings, Parking)
│   ├── components/
│   │   ├── Navbar.tsx         # Responsive header with Dark/Light toggle
│   │   ├── ParkingMap.tsx     # Custom visualization of parking spots
│   │   ├── ReviewSection.tsx  # User reviews, ratings, and comments builder
│   │   └── MapDirection.tsx   # Integrated Map with directions
│   ├── context/
│   │   └── ThemeContext.tsx   # Light/Dark mode state
│   └── lib/
│       ├── db.ts              # Database connection handler
│       └── models/            # Mongoose schemas (Room, Booking, Review, Parking)
