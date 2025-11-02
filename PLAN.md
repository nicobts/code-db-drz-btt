# Development Plan: General SaaS Starter (PostgreSQL + BetterAuth + Drizzle)

## Tech Stack Changes

### Original Stack (code/)
- ❌ Supabase (Database + Auth)
- ❌ Supabase SDK

### New Stack (code-db-drz-btt/)
- ✅ **PostgreSQL** - Via Docker Compose for local development
- ✅ **BetterAuth** - Modern authentication library for Next.js
- ✅ **Drizzle ORM** - TypeScript-first ORM with excellent DX
- ✅ **Drizzle Studio** - Visual database explorer
- ✅ **Docker** - For PostgreSQL containerization

### Unchanged Components
- ✅ Next.js 16 (App Router)
- ✅ TypeScript (Strict Mode)
- ✅ Tailwind CSS
- ✅ Shadcn UI
- ✅ React Hook Form + Zod
- ✅ next-intl (EN, IT, DE, ES)

---

## Updated Development Plan

### Phase 1: Project Setup & Foundation (Day 1-2)
- ✅ Initialize Next.js 16 project with TypeScript
- ✅ Configure Tailwind CSS + Shadcn UI
- ✅ Set up project structure (app, components, lib, types)
- ✅ Install core dependencies
- ✅ Configure ESLint, Prettier, TypeScript strict mode
- ✅ **NEW: Set up Docker Compose for PostgreSQL**
- ✅ **NEW: Install Drizzle ORM and Drizzle Kit**
- ✅ **NEW: Configure Drizzle connection**
- ✅ Create environment variable templates

### Phase 2: Authentication System with BetterAuth (Day 3-5)
- **NEW: Install and configure BetterAuth**
- **NEW: Set up BetterAuth database schema**
- Email/Password authentication with BetterAuth
- OAuth providers (Google, GitHub) via BetterAuth
- Magic link (passwordless) authentication
- Two-Factor Authentication (2FA)
- Email verification flow
- Password reset functionality
- Session management with BetterAuth
- Auth middleware for protected routes
- Login/Signup/Reset UI components

### Phase 3: Database Schema & Drizzle (Day 6-7)
- **NEW: Design schema with Drizzle ORM**
- Create database tables:
  - profiles (user profiles)
  - workspaces (organizations/tenants)
  - workspace_members (team membership)
  - invitations (team invites)
  - audit_logs (activity tracking)
- **NEW: Create Drizzle migrations**
- **NEW: Set up Drizzle Studio for database visualization**
- **NEW: Implement database-level constraints and indexes**
- **NEW: Set up connection pooling (pg)**
- Generate TypeScript types from schema

### Phase 4: Multitenancy & RBAC (Day 8-10)
- Workspace/Organization management (CRUD)
- Team member invitation system
- Role-based access control (Owner, Admin, Member, Guest)
- **NEW: Implement RBAC using Drizzle queries**
- Permission checking utilities
- Workspace switcher component
- Team member management UI
- Invitation flow (send, accept, revoke)
- Workspace settings page

### Phase 5: Core UI Components (Day 11-12)
- Set up Shadcn UI component library (40+ components)
- Dashboard layout with responsive sidebar
- Navigation components (top nav, breadcrumbs)
- Dark/Light theme toggle
- User menu dropdown
- Command palette (Cmd+K)
- Data tables with sorting/filtering
- Forms with validation (React Hook Form + Zod)
- Toast notifications (Sonner)
- Loading states & skeletons
- Empty states & error boundaries

### Phase 6: CRUD Framework with Drizzle (Day 13-14)
- **NEW: Generic CRUD utilities with Drizzle**
- **NEW: Type-safe database queries**
- Server actions for mutations
- API route handlers
- Data fetching patterns with caching
- Optimistic UI updates
- Form validation schemas with Zod
- Example CRUD implementation (e.g., "Projects" or "Items")
- Reusable patterns for future entities

### Phase 7: Internationalization (Day 15-16)
- Set up next-intl for i18n
- Configure 4 languages:
  - **English (EN)** - Primary language
  - **Italian (IT)** - Secondary
  - **German (DE)** - Secondary
  - **Spanish (ES)** - Secondary
- Language switcher component
- Translation files structure
- Server-side and client-side translations
- Date/time/currency formatting
- Dynamic locale routing

### Phase 8: Dashboard & User Management (Day 17-18)
- Admin dashboard with metrics
- User profile management
- Account settings page
- Activity logs viewer (reading from audit_logs table)
- User management interface
- Workspace analytics
- Recent activity feeds

### Phase 9: Email System (Day 19)
- Set up React Email for templates
- Configure email provider (Resend/SendGrid)
- Transactional emails:
  - Welcome email
  - Email verification
  - Password reset
  - Team invitations
  - Account notifications
- Multi-language email support (EN, IT, DE, ES)
- **NEW: Email sending via BetterAuth hooks**

### Phase 10: Testing & Polish (Day 20-22)
- Unit tests for utilities
- Component tests with React Testing Library
- E2E tests with Playwright
- **NEW: Database migration testing**
- Error handling improvements
- Performance optimization
- Security audit
- Developer documentation
- **NEW: Docker deployment setup**
- Production database migration strategy

---

## Key Technical Decisions

### Why PostgreSQL via Docker?
- **Local Development**: Easy setup with Docker Compose
- **Production Ready**: Can deploy to any PostgreSQL provider (Neon, Supabase, Railway, AWS RDS)
- **Full Control**: Complete control over database configuration
- **Cost Effective**: No vendor lock-in

### Why BetterAuth?
- **Modern & Type-Safe**: Built for TypeScript and Next.js App Router
- **Flexible**: Supports multiple auth strategies out of the box
- **Provider Agnostic**: Works with any database via adapters
- **Active Development**: Growing community and excellent documentation
- **Features**: Email/password, OAuth, magic links, 2FA, session management

### Why Drizzle ORM?
- **TypeScript-First**: Best-in-class TypeScript support
- **Performance**: Generates efficient SQL queries
- **Drizzle Studio**: Beautiful database GUI for development
- **Migrations**: Simple, SQL-based migration system
- **Type Safety**: Full type inference from schema to queries
- **Lightweight**: Minimal runtime overhead

---

## Project Structure

```
code-db-drz-btt/
├── app/                    # Next.js app directory
├── components/             # React components
│   └── ui/                # Shadcn UI components
├── lib/
│   ├── db/                # Drizzle database client
│   ├── auth/              # BetterAuth configuration
│   └── utils.ts           # Utility functions
├── db/
│   ├── schema/            # Drizzle schema definitions
│   │   ├── users.ts       # User-related tables
│   │   ├── workspaces.ts  # Workspace tables
│   │   └── index.ts       # Schema exports
│   └── migrations/        # SQL migration files
├── types/                 # TypeScript type definitions
├── hooks/                 # Custom React hooks
├── utils/                 # Helper functions
├── config/                # Configuration files
├── actions/               # Server actions
├── middleware/            # Middleware files
├── docker/                # Docker configuration
│   └── docker-compose.yml # PostgreSQL container
├── drizzle.config.ts      # Drizzle configuration
└── public/                # Static assets
```

---

## Environment Variables

```env
# Database (PostgreSQL via Docker)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/saas_db

# BetterAuth
BETTER_AUTH_SECRET=your-secret-key-min-32-chars
BETTER_AUTH_URL=http://localhost:3000

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Email Provider
EMAIL_FROM=noreply@yourdomain.com
RESEND_API_KEY=your_resend_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=SaaS Starter
```

---

## Database Schema Overview

### Core Tables (via Drizzle)

1. **users** (managed by BetterAuth)
   - id, email, emailVerified, name, image, createdAt, updatedAt

2. **sessions** (managed by BetterAuth)
   - id, userId, expiresAt, token

3. **accounts** (managed by BetterAuth - for OAuth)
   - id, userId, provider, providerAccountId

4. **verification_tokens** (managed by BetterAuth)
   - identifier, token, expires

5. **profiles** (custom)
   - id, userId (FK), fullName, avatarUrl, bio, timezone, language

6. **workspaces**
   - id, name, slug, logoUrl, domain, settings (JSONB), createdAt

7. **workspace_members**
   - id, workspaceId (FK), userId (FK), role, invitedBy (FK), joinedAt

8. **invitations**
   - id, workspaceId (FK), email, role, token, status, expiresAt

9. **audit_logs**
   - id, workspaceId (FK), userId (FK), action, resource, metadata (JSONB)

---

## Key Differences from Supabase Version

| Feature | Supabase Version | PostgreSQL + Drizzle Version |
|---------|-----------------|------------------------------|
| Database | Supabase PostgreSQL | Docker PostgreSQL (local) |
| Auth | Supabase Auth | BetterAuth |
| ORM | Supabase SDK | Drizzle ORM |
| Real-time | Supabase Realtime | ❌ Not included (can add with Pusher/Ably) |
| Storage | Supabase Storage | ❌ Not included (can add S3/Cloudflare R2) |
| RLS | Built-in | Manual implementation via middleware |
| Admin Panel | Supabase Dashboard | Drizzle Studio |
| Hosting | Supabase | Any PostgreSQL provider |
| Local Dev | Cloud/Local | Docker (fully local) |
| Migrations | SQL Editor | Drizzle Kit migrations |

---

## Docker Setup

### docker-compose.yml
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: saas-postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: saas_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

---

## npm Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
    "db:seed": "tsx db/seed.ts",
    "docker:up": "docker-compose -f docker/docker-compose.yml up -d",
    "docker:down": "docker-compose -f docker/docker-compose.yml down"
  }
}
```

---

## Deliverables

1. ✅ Production-ready Next.js + PostgreSQL codebase
2. ✅ Complete authentication system with BetterAuth
3. ✅ Multitenancy with RBAC using Drizzle
4. ✅ Internationalization (EN, IT, DE, ES)
5. ✅ Shadcn UI component library
6. ✅ CRUD framework with type-safe queries
7. ✅ Docker setup for local development
8. ✅ Drizzle Studio for database management
9. ✅ Migration system with Drizzle Kit
10. ✅ Developer documentation
11. ✅ Deployment guides for production

---

## Estimated Timeline

**Total: 20-22 days for complete implementation**

This fork provides:
- ✅ Full ownership of your data and infrastructure
- ✅ No vendor lock-in
- ✅ Type-safe database queries with Drizzle
- ✅ Modern authentication with BetterAuth
- ✅ Easy local development with Docker
- ✅ Production-ready for any PostgreSQL provider
