# Minimal Todo List Application

A minimal, user-friendly todo list application built with modern web technologies. Each user has their own private todo list with full CRUD capabilities and the ability to mark items as complete or incomplete.

## 🏗️ Architecture

This project follows the **four-layer Convex architecture pattern**:

1. **Database Layer** (`convex/db/`) - Pure CRUD operations, only place where `ctx.db` is used
2. **Endpoint Layer** (`convex/endpoints/`) - Business logic that composes database operations
3. **Workflow Layer** (`convex/workflows/`) - Durable external service integrations (if needed)
4. **Helper Layer** (`convex/helpers/`) - Pure utility functions with no database access

## 🛠️ Tech Stack

- **Backend**: [Convex](https://convex.dev) - Reactive backend with real-time sync
- **Frontend**: [Next.js 15](https://nextjs.org) with App Router
- **Authentication**: [Better Auth](https://better-auth.com) with Convex adapter
- **Styling**: [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- **Language**: TypeScript (strict mode)

## 📦 Detected Components

This project uses the following Convex Components:

### Core Components (Always Present)

- **Better Auth** (`@convex-dev/better-auth`) - User authentication and session management
  - Email/password authentication
  - JWT-based sessions with 30-day expiration
  - Secure password hashing

- **Rate Limiter** (`@convex-dev/rate-limiter`) - API rate limiting to prevent abuse
  - Token bucket algorithm for smooth rate limiting
  - Configurable limits per operation
  - User-scoped rate limits

### Optional Components

- **Agent** (`@convex-dev/agent`) - AI agent orchestration for future enhancements
  - Multi-step reasoning capabilities
  - Integration with LLM providers (OpenAI, Anthropic)
  - Not required for basic todo functionality

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or later
- **pnpm** 8.x or later (recommended) or npm
- **Convex account** - Sign up at [dashboard.convex.dev](https://dashboard.convex.dev)

### Installation

1. **Clone the repository** (if not already done)

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up Convex**
   ```bash
   npx convex dev
   ```

   This will:
   - Create a new Convex project (or link to existing)
   - Generate your deployment URL
   - Start the Convex development server

4. **Configure environment variables**

   Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

   Then fill in the required values:

   ```bash
   # Convex - Get from: npx convex dev output
   CONVEX_DEPLOYMENT=dev:your-deployment-name
   NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

   # Better Auth - Generate secret
   BETTER_AUTH_SECRET=$(openssl rand -base64 32)
   SITE_URL=http://localhost:3000
   NEXT_PUBLIC_SITE_URL=http://localhost:3000

   # AI Provider (Optional - only if adding AI features)
   # OPENAI_API_KEY=your-openai-key
   # OR
   # ANTHROPIC_API_KEY=your-anthropic-key
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

   This will start both:
   - Convex dev server (backend)
   - Next.js dev server (frontend) at [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

### Tables

#### `todos`
Core todo items table with user isolation.

| Field | Type | Description |
|-------|------|-------------|
| `userId` | string | Owner of the todo (Better Auth user ID) |
| `title` | string | Todo title/description |
| `description` | string? | Optional detailed description |
| `isCompleted` | boolean | Completion status |
| `completedAt` | number? | Timestamp when marked complete |
| `priority` | enum? | Optional priority: low, medium, high |
| `createdAt` | number | Creation timestamp |
| `updatedAt` | number | Last update timestamp |

**Indexes:**
- `by_user` - Get all todos for a user
- `by_user_and_completion` - Filter by completion status
- `by_user_and_created` - Sort by creation time

#### `userPreferences`
User-specific settings and preferences.

| Field | Type | Description |
|-------|------|-------------|
| `userId` | string | User ID |
| `theme` | enum? | Theme preference: light, dark, system |
| `defaultPriority` | enum? | Default priority for new todos |
| `sortOrder` | enum? | Default sort: created, updated, priority |
| `createdAt` | number | Creation timestamp |
| `updatedAt` | number | Last update timestamp |

**Indexes:**
- `by_user` - Get preferences for a user

## 🔒 Authentication Setup

Better Auth is configured with:

- **Email/Password** authentication (no email verification required for simplicity)
- **JWT tokens** with 30-day expiration
- **Convex adapter** for seamless database integration

Authentication endpoints are automatically available at `/auth/*`.

## 🚦 Rate Limiting

Rate limiting is pre-configured to prevent abuse:

- **Create todo**: 10 requests/minute (burst capacity: 3)
- **Update todo**: 50 requests/minute
- **Delete todo**: 30 requests/minute
- **List todos**: 100 requests/minute

Rate limits are user-scoped and use the token bucket algorithm for smooth limiting.

## 📁 Project Structure

```
minimal-todo-app/
├── convex/                    # Backend (Convex)
│   ├── schema.ts             # Database schema
│   ├── convex.config.ts      # Component configuration
│   ├── auth.ts               # Better Auth setup
│   ├── http.ts               # HTTP routes
│   ├── db/                   # Database layer (Phase 2)
│   ├── endpoints/            # API endpoints (Phase 2)
│   └── helpers/              # Utility functions (Phase 2)
├── apps/
│   └── web/                  # Frontend (Next.js) (Phase 2)
├── packages/                 # Shared packages (Phase 2)
├── .env.local               # Environment variables (create from example)
├── .env.local.example       # Environment template
└── package.json             # Root dependencies
```

## 🎨 Design System

This project uses a custom theme based on:

- **Tone**: Neutral
- **Density**: Balanced
- **Primary Color**: Indigo (#6366f1)
- **Typography**: Inter font family
- **Components**: shadcn/ui with Radix UI primitives

## 📝 Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature
   ```

2. **Make changes** following the four-layer architecture

3. **Test locally**
   ```bash
   pnpm dev
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push origin feature/your-feature
   ```

## 🔧 Component-Specific Setup

### Better Auth (Required)

No additional setup needed beyond environment variables. Authentication endpoints are automatically configured.

### Rate Limiter (Required)

No additional setup needed. Rate limits are configured in code (see `convex/rateLimiter.ts` in Phase 2).

### Agent (Optional)

Only needed if you want to add AI features (e.g., AI-powered todo suggestions, smart categorization):

1. Get an API key from [OpenAI](https://platform.openai.com) or [Anthropic](https://anthropic.com)
2. Add to `.env.local`:
   ```bash
   OPENAI_API_KEY=your-key-here
   # OR
   ANTHROPIC_API_KEY=your-key-here
   ```

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Vercel will auto-detect Next.js

3. **Add environment variables** in Vercel dashboard:
   - All variables from `.env.local`
   - Change `SITE_URL` to your production domain

4. **Deploy Convex to production**
   ```bash
   npx convex deploy
   ```

   Update `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL` in Vercel with production values.

## 📚 Implementation Status

**Phase 1 (Complete):** ✅ Infrastructure setup
- Schema definition
- Component configuration
- Environment variables
- Authentication setup

**Phase 2 (Complete):** ✅ Implementation
- ✅ Database layer (`convex/db/`)
- ✅ Endpoint layer (`convex/endpoints/`)
- ✅ Helper layer (`convex/helpers/`)
- ✅ Rate limiter configuration
- ✅ Design tokens package
- ✅ Components package with shadcn/ui
- ✅ Next.js frontend with todo list UI
- ✅ Authentication UI (login/signup)
- ✅ Complete CRUD operations

## 🤝 Contributing

This is a minimal todo app template. Feel free to extend it with:

- **Tags/Categories** - Organize todos
- **Due dates** - Time-based todo management
- **Shared lists** - Collaborate with others (requires organization plugin)
- **AI suggestions** - Use the Agent component for smart features
- **Email notifications** - Add Resend component for reminders

## 📄 License

MIT

## 🆘 Support

- **Convex Docs**: [docs.convex.dev](https://docs.convex.dev)
- **Better Auth Docs**: [better-auth.com/docs](https://better-auth.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
