# CLAUDE.md - PickleProX Admin Panel

This file provides guidance to Claude Code when working with this codebase.

## Important Preferences

- **Git Commits**: Never include "Co-Authored-By: Claude" or any Claude attribution in commit messages

## Project Overview

PickleProX Admin is the web-based administration panel for the PickleProX pickleball platform. It allows administrators to manage users, courts, games, tournaments, and content (tips) for the mobile app.

**Category**: Admin Panel / Content Management
**Target Users**: Platform administrators, court owners, tournament admins

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Architecture

### Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Auth**: AWS Cognito via amazon-cognito-identity-js
- **Charts**: Recharts
- **Icons**: Lucide React
- **Utilities**: clsx, date-fns

### Project Structure

```
pickleprox-admin/
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Root layout (AuthProvider, ThemeProvider)
│   │   ├── globals.css               # Tailwind config + brand colors
│   │   ├── login/page.tsx            # Login page (no sidebar)
│   │   └── (dashboard)/             # Route group with sidebar layout
│   │       ├── layout.tsx            # Dashboard layout (Sidebar + Header)
│   │       ├── page.tsx              # Dashboard overview
│   │       ├── users/page.tsx        # Users management
│   │       ├── courts/page.tsx       # Courts management
│   │       ├── games/page.tsx        # Games & Events
│   │       ├── tournaments/page.tsx  # Tournaments
│   │       └── tips/page.tsx         # Tips content management
│   ├── components/
│   │   ├── layout/                   # Sidebar, Header, AuthGuard
│   │   ├── ui/                       # Reusable UI (DataTable, Badge, Button, etc.)
│   │   └── dashboard/               # Dashboard-specific (charts, activity)
│   ├── contexts/
│   │   ├── AuthContext.tsx           # Cognito auth state
│   │   └── ThemeContext.tsx          # Dark/light mode
│   ├── lib/
│   │   ├── api.ts                    # API client (real + mock endpoints)
│   │   ├── auth.ts                   # Cognito auth utilities
│   │   ├── mock-data.ts             # Mock data for admin endpoints
│   │   └── utils.ts                  # Utility functions
│   └── types/
│       └── models.ts                 # Shared TypeScript types
```

### Navigation

- **6 pages**: Dashboard, Users, Courts, Games & Events, Tournaments, Tips
- Left sidebar with section grouping (Main, Management, Content)
- Collapsible sidebar on desktop, drawer on mobile
- Dark/light mode toggle

### Brand Colors

```css
--color-brand-orange: #FF8A00;  /* Primary */
--color-brand-yellow: #FFC83D;  /* Accent */
--color-brand-red: #E53935;     /* Danger */
--color-dark: #1F1F1F;          /* Dark backgrounds */
--color-success: #22C55E;
--color-error: #EF4444;
```

### Key Components

#### Layout
- `Sidebar` - Navigation with sections, collapsible, mobile-responsive
- `Header` - Menu toggle, theme switch, user dropdown
- `AuthGuard` - Redirects to /login if not authenticated

#### UI Components
- `DataTable` - Sortable columns, search, pagination, filter tabs, loading skeleton
- `StatCard` - Dashboard stat card with icon and change indicator
- `Badge` - Status badges with color variants
- `Button` - Primary/secondary/danger/ghost variants
- `Modal` - Dialog overlay for forms
- `Card` - Content wrapper

#### Dashboard
- `UserGrowthChart` - Recharts AreaChart (dynamically imported, no SSR)
- `RecentActivity` - Activity feed with icons and timestamps

### Data Layer

- **Real API endpoints** (via `api.ts`): courts, games, tournaments, current user
- **Mock data** (via `mock-data.ts`): users, dashboard stats, tips, activity
- Mock functions return `ApiResponse<T>` matching real API signature
- Each mock function has a `// TODO: Replace with real API` comment

### Authentication

- Same Cognito User Pool as mobile app
- Email/password auth only (no Google OAuth)
- Admin check: verifies `cognito:groups` includes `app_managers`, `court_owners`, or `tournament_admins`
- Token automatically refreshed via cognito-identity-js

### State Management

- React Context for auth state and theme
- Local component state with `useState` + `useEffect` for data fetching
- All pages are `'use client'` (client-side data fetching with Cognito tokens)

## Backend Integration

### AWS Services

- **Cognito**: User Pool `us-east-1_1DUCb2aMQ`
- **API Gateway**: REST API at `NEXT_PUBLIC_API_ENDPOINT`
- **DynamoDB**: Single-table design
- **CloudFront**: CDN at `NEXT_PUBLIC_CDN_URL`

### API Endpoints

**Existing (Real):**
- `GET /v1/courts` - List courts
- `POST /v1/courts` - Create court
- `PUT /v1/courts/{courtId}` - Update court
- `DELETE /v1/courts/{courtId}` - Delete court
- `GET /v1/games` - List games
- `GET /v1/tournaments` - List tournaments
- `GET /v1/users/me` - Get current user

**Admin (Mock, To Be Built):**
- `GET /v1/admin/users` - List all users
- `GET /v1/admin/tips` - CRUD tips
- `GET /v1/admin/tournaments` - CRUD tournaments
- `GET /v1/admin/analytics/dashboard` - Dashboard stats

### Environment Variables

```
NEXT_PUBLIC_AWS_REGION
NEXT_PUBLIC_USER_POOL_ID
NEXT_PUBLIC_USER_POOL_CLIENT_ID
NEXT_PUBLIC_API_ENDPOINT
NEXT_PUBLIC_CDN_URL
```

## Related Repositories

| Repository | Description | Location |
|------------|-------------|----------|
| pickle-pro | Mobile app (React Native/Expo) | `../pickle-pro` |
| infrastructure | Backend CloudFormation | `../infrastructure` |
| shared | Shared types and docs | `../shared` |

For full platform architecture, see `../shared/CONTEXT.md`
