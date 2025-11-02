# SaaS Starter - Setup Guide (PostgreSQL + Drizzle + BetterAuth)

## Prerequisites

- Node.js 18+ installed
- Docker and Docker Compose installed
- Git installed

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start PostgreSQL Database

Start the PostgreSQL container using Docker Compose:

```bash
npm run docker:up
```

This will:
- Pull the PostgreSQL 16 Alpine image
- Create a database named `saas_db`
- Start PostgreSQL on port 5432
- Create a persistent volume for data

To check if the database is running:
```bash
npm run docker:logs
```

To stop the database:
```bash
npm run docker:down
```

### 3. Configure Environment Variables

The `.env.local` file has been created with default values for local development. The database connection should work out of the box with Docker.

**Important for Production:**
- Change `BETTER_AUTH_SECRET` to a random 32+ character string
- Add your OAuth credentials if using Google/GitHub login
- Add your email provider API key (Resend recommended)

### 4. Set Up Database Schema

Once you've created database schemas in Phase 2/3, you'll run:

```bash
# Generate migrations from schema
npm run db:generate

# Push schema to database
npm run db:push
```

### 5. Launch Drizzle Studio (Optional)

View and manage your database with a beautiful GUI:

```bash
npm run db:studio
```

This opens Drizzle Studio at [https://local.drizzle.studio](https://local.drizzle.studio)

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

### Development
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server

### Code Quality
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking

### Database
- `npm run db:generate` - Generate migrations from Drizzle schema
- `npm run db:migrate` - Run pending migrations
- `npm run db:push` - Push schema changes directly (dev only)
- `npm run db:studio` - Launch Drizzle Studio GUI
- `npm run db:seed` - Seed database with sample data (when implemented)

### Docker
- `npm run docker:up` - Start PostgreSQL container
- `npm run docker:down` - Stop PostgreSQL container
- `npm run docker:logs` - View PostgreSQL logs

## Project Structure

```
code-db-drz-btt/
├── app/                    # Next.js app directory
├── components/             # React components
│   └── ui/                # Shadcn UI components (24 components)
├── lib/
│   ├── db/                # Drizzle database client
│   ├── auth/              # BetterAuth configuration
│   └── utils.ts           # Utility functions
├── db/
│   ├── schema/            # Drizzle schema definitions
│   │   └── index.ts       # Schema exports (to be populated)
│   └── migrations/        # SQL migration files (auto-generated)
├── types/                 # TypeScript type definitions
├── hooks/                 # Custom React hooks
├── utils/                 # Helper functions
├── config/                # Configuration files
├── actions/               # Server actions
├── middleware/            # Middleware files
├── docker-compose.yml     # PostgreSQL container config
├── drizzle.config.ts      # Drizzle configuration
└── public/                # Static assets
```

## Database Management

### Viewing the Database

**Option 1: Drizzle Studio (Recommended)**
```bash
npm run db:studio
```
Beautiful GUI for browsing and editing data.

**Option 2: psql CLI**
```bash
docker exec -it saas-postgres psql -U postgres -d saas_db
```

**Option 3: Any PostgreSQL Client**
Connect using:
- Host: localhost
- Port: 5432
- Database: saas_db
- User: postgres
- Password: postgres

### Migration Workflow

1. **Modify Schema**: Edit files in `db/schema/`
2. **Generate Migration**: `npm run db:generate`
3. **Review SQL**: Check files in `db/migrations/`
4. **Apply Migration**: `npm run db:migrate`

For development, you can use `npm run db:push` to skip migration generation.

## Authentication with BetterAuth

BetterAuth is configured with:
- ✅ Email/Password authentication
- ✅ Google OAuth (when credentials added)
- ✅ GitHub OAuth (when credentials added)
- ✅ Session management
- ✅ Drizzle adapter for database

### Adding OAuth Providers

**Google:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add to `.env.local`:
   ```
   GOOGLE_CLIENT_ID=your_id
   GOOGLE_CLIENT_SECRET=your_secret
   ```

**GitHub:**
1. Go to Settings > Developer settings > OAuth Apps
2. Create new OAuth App
3. Add to `.env.local`:
   ```
   GITHUB_CLIENT_ID=your_id
   GITHUB_CLIENT_SECRET=your_secret
   ```

## Next Steps

After completing the setup:

1. **Phase 2**: Implement authentication system with BetterAuth
2. **Phase 3**: Create database schema with Drizzle
3. **Phase 4**: Build multitenancy and RBAC
4. **Phase 5**: Create UI components
5. **Phase 6**: Build CRUD framework
6. **Phase 7**: Add internationalization (EN, IT, DE, ES)
7. **Phase 8**: Build dashboards
8. **Phase 9**: Set up email system
9. **Phase 10**: Testing and deployment

## Tech Stack

- **Framework**: Next.js 16 (App Router with Server Components)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS 4
- **UI Components**: Shadcn UI (24 components installed)
- **Database**: PostgreSQL 16 (via Docker)
- **ORM**: Drizzle ORM
- **Authentication**: BetterAuth
- **Forms**: React Hook Form + Zod
- **Internationalization**: next-intl (EN, IT, DE, ES)

## Troubleshooting

### Database connection failed
```bash
# Check if Docker is running
docker ps

# Restart the database
npm run docker:down
npm run docker:up

# Check logs
npm run docker:logs
```

### Port 5432 already in use
If you have another PostgreSQL instance running:
```bash
# Option 1: Stop other PostgreSQL
# Option 2: Change port in docker-compose.yml

# Edit docker-compose.yml ports section:
ports:
  - "5433:5432"  # Use port 5433 instead

# Update DATABASE_URL in .env.local:
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/saas_db
```

### Drizzle Studio won't start
```bash
# Make sure db/schema/index.ts exports something
# Even an empty export {} works

# Try clearing node_modules
rm -rf node_modules
npm install
```

## Deployment

### Database Options
- **Neon** - Serverless PostgreSQL (recommended, free tier available)
- **Railway** - Managed PostgreSQL ($5/month)
- **Supabase** - PostgreSQL with extras ($25/month)
- **Vercel Postgres** - Integrated with Vercel
- **AWS RDS** - Enterprise option

### Steps
1. Create production PostgreSQL database
2. Update `DATABASE_URL` in production environment
3. Run migrations: `npm run db:migrate`
4. Deploy Next.js app to Vercel/your preferred host

## Support

For issues or questions, check:
- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [BetterAuth Documentation](https://better-auth.com)
- [Shadcn UI Documentation](https://ui.shadcn.com)

## License

This is a starter template - use it however you like!
