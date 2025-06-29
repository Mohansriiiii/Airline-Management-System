# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Frontend (React + Vite):**
- `npm run dev` - Start development server (runs on http://localhost:5173)
- `npm run build` - Build for production
- `npm run lint` - Run ESLint for code quality
- `npm run preview` - Preview production build

**Backend (Node.js/Express):**
- `cd backend && npm run serve` - Start backend server with nodemon (runs on http://localhost:3000)

**Full Development Setup:**
1. Start backend: `cd backend && npm run serve`
2. Start frontend: `npm run dev` (from project root)

## Architecture Overview

This is a full-stack airline management system with clear separation between frontend and backend:

**Frontend Structure:**
- React app with Vite build tool
- Context-based state management using React Context API for flight info and authentication
- Router-based navigation with React Router DOM
- Component structure: `/src/components/`, `/src/pages/`, `/src/Helper/`, `/src/auth/`
- Main state contexts: `AuthContext`, `ProfileContext`, `FlightContext`, and `Info` context for flight data

**Backend Structure:**
- Express.js API server with MongoDB/Mongoose
- Modular route structure: `/backend/api/` contains route handlers
- Models in `/backend/models/` for MongoDB collections
- Scheduled jobs using node-cron for moving past flights
- Email functionality using Nodemailer
- File upload handling with Cloudinary and Multer

**Key Data Flow:**
- Flight booking flow: Home → Search → Display → Price Confirmation → Traveller Selection → Seat Selection → Final Confirmation → Success
- User authentication managed through AuthContext across the entire app
- Flight information passed through Info context provider across booking pages
- Backend uses separate collections for current bookings, past flights, users, and flight data

**Database Models:**
- `user.model.js` - User accounts and profiles
- `flight.model.js` - Flight schedules and details  
- `currentBooking.model.js` - Active bookings
- `pastFlights.model.js` - Historical flight data
- `admin.model.js` - Admin user management

**Environment Configuration:**
- Backend requires `.env` file with MongoDB URI, email credentials, Cloudinary config, and CORS settings
- Frontend uses Vite environment variables (VITE_ prefix)
- Default ports: Backend (3000), Frontend (5173)

**Scheduled Tasks:**
- Hourly cron job moves completed flights from current to past flights collection

## Important Notes

- The app uses React Context extensively instead of Redux, despite having Redux dependencies
- Authentication state is managed through AuthContext and persists across page refreshes
- Backend API routes are organized by domain: `/user`, `/admin`, `/currentBooking`, `/email`
- File uploads are handled through Cloudinary integration
- CORS is configured to allow frontend-backend communication with credentials