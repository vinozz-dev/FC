# FusionCircle - Innovation Ecosystem Platform

## Overview

FusionCircle is a full-stack web application designed as an innovation ecosystem platform that connects project creators (students, entrepreneurs) with investors, mentors, and institutions. The platform facilitates collaboration, resource sharing, funding opportunities, and knowledge exchange within the innovation community.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom design tokens and role-based color schemes
- **Routing**: Wouter for client-side routing
- **State Management**: React Query (TanStack Query) for server state management
- **Authentication**: Custom JWT-based authentication with localStorage persistence
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Authentication**: JWT tokens with bcrypt for password hashing
- **Session Management**: PostgreSQL session store with connect-pg-simple
- **API Design**: RESTful API with role-based access control

### Data Storage Solutions
- **Primary Database**: PostgreSQL hosted on Neon Database
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Session Storage**: PostgreSQL-backed session store
- **File Storage**: Not yet implemented (likely to be cloud-based)

## Key Components

### User Management System
- **Multi-Role Support**: Students, entrepreneurs, wantrepreneurs, mentors, investors, and institutions
- **Authentication**: JWT-based with protected routes and role-based access
- **Profile Management**: User profiles with skills, bio, and verification status
- **Authorization**: Role-based permissions and dashboard customization

### Project Management
- **Project Creation**: Users can create projects with descriptions, categories, and funding goals
- **Project Discovery**: Browse and search projects by category and criteria
- **Collaboration**: Team formation and project collaboration features
- **Status Tracking**: Project lifecycle management (active, completed, cancelled)

### Funding System
- **Crowdfunding**: Project creators can set funding goals and track progress
- **Investor Dashboard**: Investors can browse and fund projects
- **Payment Integration**: Ready for payment processor integration
- **Funding Analytics**: Track funding progress and investor engagement

### Mentorship Platform
- **Mentor Registration**: Verified mentors with expertise areas and ratings
- **Mentorship Matching**: Connect mentees with suitable mentors
- **Session Management**: Booking and communication features
- **Review System**: Mentor rating and feedback system

### Resource Sharing
- **Resource Catalog**: Institutions can list available resources
- **Resource Requests**: Users can request specific tech resources
- **Lending Management**: Track resource lending and returns
- **Resource Categories**: Organize resources by type and availability

### Event Management
- **Event Discovery**: List and search hackathons and innovation events
- **Event Registration**: Users can register for events
- **Event Categories**: Filter events by type, location, and date
- **Event Analytics**: Track registrations and event engagement

### Social Features (Reels)
- **Content Sharing**: Users can share project updates and innovations
- **Media Support**: Image and video content support
- **Social Interaction**: Like, comment, and share functionality
- **Content Discovery**: Browse and discover innovation content

## Data Flow

### Authentication Flow
1. User registers/logs in via API endpoints
2. Server validates credentials and generates JWT token
3. Token stored in localStorage and included in subsequent requests
4. Protected routes verify token before allowing access
5. Role-based access control determines available features

### Project Flow
1. Users create projects with details and funding goals
2. Projects stored in database with creator association
3. Other users can browse, fund, or collaborate on projects
4. Real-time updates via React Query for project status
5. Funding transactions tracked and project progress updated

### Mentorship Flow
1. Mentors register with expertise and experience
2. Mentees search and request mentorship
3. Matching system connects suitable mentor-mentee pairs
4. Communication and session management through platform
5. Review and rating system maintains mentor quality

## External Dependencies

### Database & ORM
- **PostgreSQL**: Primary database system
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database operations
- **Drizzle Kit**: Schema management and migrations

### Authentication & Security
- **bcrypt**: Password hashing
- **jsonwebtoken**: JWT token generation and verification
- **connect-pg-simple**: PostgreSQL session store

### Frontend Libraries
- **React**: UI framework
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling
- **React Query**: Server state management
- **React Hook Form**: Form management
- **Wouter**: Lightweight routing

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety
- **ESLint/Prettier**: Code quality (likely configured)
- **Replit Integration**: Development environment support

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot module replacement
- **Database**: Neon Database connection with environment variables
- **Environment Variables**: DATABASE_URL and JWT_SECRET required
- **Development Mode**: Automatic banner and development tools integration

### Production Build
- **Frontend**: Vite builds static assets to `dist/public`
- **Backend**: esbuild bundles Node.js server to `dist/index.js`
- **Database**: Drizzle migrations applied via `db:push` command
- **Deployment**: Single server deployment with static file serving

### Architecture Considerations
- **Monorepo Structure**: Client, server, and shared code in single repository
- **Shared Types**: Type definitions shared between frontend and backend
- **Environment Separation**: Development and production configurations
- **Database Migrations**: Version-controlled schema changes via Drizzle
- **Session Management**: PostgreSQL-backed sessions for scalability

The application is designed with a modular architecture that supports the various innovation ecosystem features while maintaining type safety and scalability. The role-based system allows for different user experiences based on user type, and the comprehensive feature set supports the full innovation lifecycle from idea to funding to mentorship.