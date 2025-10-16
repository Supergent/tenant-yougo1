# Setup Guide - Minimal Todo App

This guide will walk you through setting up and running the Minimal Todo App from scratch.

## Quick Start (5 minutes)

```bash
# 1. Install dependencies
pnpm install

# 2. Set up Convex (follow prompts)
npx convex dev

# 3. Copy environment variables
cp .env.local.example .env.local

# 4. Generate Better Auth secret
openssl rand -base64 32

# 5. Edit .env.local with:
#    - Convex URLs from step 2
#    - Better Auth secret from step 4

# 6. Start the app
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) and create an account!

---

## Detailed Setup

### Step 1: Install Dependencies

```bash
pnpm install
```

This installs:
- Next.js 15 (frontend)
- Convex (backend)
- Better Auth (authentication)
- Tailwind CSS & shadcn/ui (styling)
- All Convex components (Rate Limiter, Agent)

### Step 2: Set Up Convex Backend

```bash
npx convex dev
```

**What this does:**
1. Prompts you to create a Convex account (or login)
2. Creates a new Convex project
3. Generates a deployment URL
4. Starts watching your `convex/` directory
5. Syncs your schema and functions to the cloud

**You'll see output like:**
```
✔ Deployment URL: https://abc123.convex.cloud
✔ Dashboard: https://dashboard.convex.dev/t/abc123
```

**Keep this terminal open** - it needs to run continuously during development.

### Step 3: Configure Environment Variables

Copy the example file:
```bash
cp .env.local.example .env.local
```

Generate a Better Auth secret:
```bash
openssl rand -base64 32
```

Edit `.env.local`:
```bash
# From "npx convex dev" output
CONVEX_DEPLOYMENT=dev:abc123
NEXT_PUBLIC_CONVEX_URL=https://abc123.convex.cloud

# Generate with: openssl rand -base64 32
BETTER_AUTH_SECRET=your-generated-secret-here

# Local development URLs
SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Optional:** If you want to add AI features later:
```bash
# Choose one:
OPENAI_API_KEY=sk-...
# OR
ANTHROPIC_API_KEY=sk-ant-...
```

### Step 4: Start the Development Server

Open a **new terminal** (keep `convex dev` running in the first one):

```bash
pnpm dev
```

This starts:
- **Backend:** Convex dev server (watching for changes)
- **Frontend:** Next.js on [http://localhost:3000](http://localhost:3000)

### Step 5: Create Your First Account

1. Open [http://localhost:3000](http://localhost:3000)
2. Click "Don't have an account? Sign up"
3. Enter your email and password
4. Start adding todos!

---

## What You Get

### Backend (Convex)

**Database Layer** (`convex/db/`)
- `todos.ts` - CRUD operations for todos
- `userPreferences.ts` - User settings management
- `dashboard.ts` - Dashboard metrics

**Endpoint Layer** (`convex/endpoints/`)
- `todos.ts` - Todo business logic (create, update, delete, toggle)
- `userPreferences.ts` - Preferences management
- `dashboard.ts` - Summary statistics

**Helper Layer** (`convex/helpers/`)
- `validation.ts` - Input validation functions
- `constants.ts` - Application constants

**Configuration**
- `auth.ts` - Better Auth setup
- `http.ts` - HTTP routes for authentication
- `rateLimiter.ts` - Rate limiting rules

### Frontend (Next.js)

**Pages**
- `app/page.tsx` - Main todo list page

**Components** (`components/`)
- `auth-guard.tsx` - Authentication protection
- `login-form.tsx` - Login/signup form
- `app-header.tsx` - App header with user info
- `todo-list.tsx` - Todo list with tabs and stats
- `todo-item.tsx` - Individual todo item with edit/delete
- `add-todo-form.tsx` - Form to add new todos

**Providers** (`providers/`)
- `convex-provider.tsx` - Convex + Better Auth setup

**Libraries** (`lib/`)
- `auth-client.ts` - Client-side auth utilities
- `convex.ts` - Convex React client

### Design System

**Packages**
- `packages/design-tokens/` - Theme tokens and Tailwind plugin
- `packages/components/` - Reusable UI components (Button, Card, Input, Checkbox, etc.)

---

## Architecture Overview

This app follows the **four-layer Convex architecture**:

```
┌─────────────────────────────────────────┐
│           Frontend (Next.js)            │
│  Components → Queries/Mutations → API   │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│      Endpoint Layer (convex/endpoints/) │
│   Business logic + Auth + Rate limiting │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│      Database Layer (convex/db/)        │
│   ONLY place where ctx.db is used       │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Convex Database (Cloud)         │
│   Real-time, reactive data storage      │
└─────────────────────────────────────────┘
```

**Key Principles:**
- ✅ **Never use `ctx.db` outside the database layer**
- ✅ **All operations are user-scoped** (userId on every table)
- ✅ **Rate limiting on all mutations** (prevent abuse)
- ✅ **Authentication on all endpoints** (secure by default)

---

## Features

### ✅ Authentication
- Email/password signup and login
- Session management with JWT tokens
- Automatic session refresh
- Secure logout

### ✅ Todo Management
- Create todos with title (description and priority optional)
- Mark todos as complete/incomplete
- Edit todo titles inline
- Delete individual todos
- Clear all completed todos at once

### ✅ Organization
- Filter by: All, Active, Completed
- Real-time statistics:
  - Total todos
  - Active count
  - Completed count
  - Completion rate
- Recent todos view

### ✅ User Experience
- **Real-time updates** - See changes instantly (no refresh needed)
- **Responsive design** - Works on mobile, tablet, desktop
- **Keyboard shortcuts** - Press Enter to save, Escape to cancel
- **Loading states** - Skeletons while data loads
- **Empty states** - Helpful messages when no todos
- **Error handling** - Clear error messages

### ✅ Security
- Rate limiting on all operations (prevent abuse)
- User data isolation (each user sees only their todos)
- Secure password hashing
- CSRF protection
- XSS protection

---

## Development Workflow

### Making Changes

**Backend changes** (`convex/`):
1. Edit files in `convex/db/`, `convex/endpoints/`, or `convex/helpers/`
2. Convex dev server auto-detects changes
3. Functions are redeployed in ~1 second
4. Frontend automatically re-queries

**Frontend changes** (`apps/web/`):
1. Edit files in `app/`, `components/`, or `lib/`
2. Next.js Fast Refresh updates instantly
3. No page reload needed (in most cases)

**Design system changes** (`packages/`):
1. Edit tokens in `packages/design-tokens/src/theme.ts`
2. Edit components in `packages/components/src/`
3. Changes propagate to `apps/web/` automatically

### Adding a New Todo Field

Let's say you want to add a "due date" field:

**1. Update Schema** (`convex/schema.ts`):
```typescript
todos: defineTable({
  // ... existing fields
  dueDate: v.optional(v.number()), // ← Add this
})
```

**2. Update Database Layer** (`convex/db/todos.ts`):
```typescript
export async function createTodo(ctx: MutationCtx, args: {
  // ... existing args
  dueDate?: number; // ← Add this
}) {
  return await ctx.db.insert("todos", {
    // ... existing fields
    dueDate: args.dueDate, // ← Add this
  });
}
```

**3. Update Endpoint** (`convex/endpoints/todos.ts`):
```typescript
export const create = mutation({
  args: {
    // ... existing args
    dueDate: v.optional(v.number()), // ← Add this
  },
  handler: async (ctx, args) => {
    // ... existing logic
    return await Todos.createTodo(ctx, {
      // ... existing fields
      dueDate: args.dueDate, // ← Add this
    });
  },
});
```

**4. Update Frontend** (`apps/web/components/add-todo-form.tsx`):
```typescript
// Add date input to form
<Input
  type="date"
  onChange={(e) => setDueDate(new Date(e.target.value).getTime())}
/>
```

That's it! The changes are live.

---

## Troubleshooting

### "Not authenticated" errors

**Solution:** You need to log in first. The app redirects to login if not authenticated.

### "Rate limit exceeded" errors

**Solution:** Wait a minute and try again. Rate limits reset every 60 seconds.

To adjust limits, edit `convex/rateLimiter.ts`:
```typescript
createTodo: {
  rate: 20, // ← Increase this number
  period: MINUTE,
}
```

### "Module not found" errors

**Solution:** Install dependencies again:
```bash
pnpm install
```

### Convex dev server not running

**Error:** "Failed to fetch from Convex"

**Solution:** Make sure `npx convex dev` is running in a separate terminal.

### Changes not reflecting

**Solution:**
1. Check that `convex dev` is running
2. Check browser console for errors
3. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
4. Restart both servers:
   ```bash
   # Kill both terminals, then:
   npx convex dev
   # In another terminal:
   pnpm dev
   ```

---

## Next Steps

### Extend the App

**Add Tags:**
1. Add `tags: v.array(v.string())` to schema
2. Create tag input in UI
3. Filter todos by tag

**Add Due Dates:**
1. Add `dueDate: v.optional(v.number())` to schema
2. Create date picker in UI
3. Sort by due date

**Add Collaboration:**
1. Add `@convex-dev/better-auth` organization plugin
2. Add `organizationId` to schema
3. Share todos with team members

**Add AI Features:**
1. Get OpenAI API key
2. Create agent workflow
3. Add "Suggest todos based on my habits" button

### Deploy to Production

See the [README.md](README.md#-deployment) for deployment instructions.

---

## Resources

- **Convex Docs:** [docs.convex.dev](https://docs.convex.dev)
- **Better Auth Docs:** [better-auth.com/docs](https://better-auth.com/docs)
- **Next.js Docs:** [nextjs.org/docs](https://nextjs.org/docs)
- **Tailwind Docs:** [tailwindcss.com/docs](https://tailwindcss.com/docs)
- **shadcn/ui:** [ui.shadcn.com](https://ui.shadcn.com)

---

## Support

If you run into issues:

1. Check the [Convex Discord](https://convex.dev/community) - Very active community
2. Read the [Convex docs](https://docs.convex.dev) - Comprehensive guides
3. Check the [Better Auth docs](https://better-auth.com/docs) - Auth-specific help

Happy coding! 🚀
