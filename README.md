# GIZMONEPAL Store — production-ready Next.js + Supabase

A mobile-first storefront (Next.js 14 App Router, TypeScript, Tailwind) with a
real, server-side-authenticated admin portal for managing products and brands.

## What's inside

- **Public storefront**: home, category listing (`/category/[key]`), product
  detail (`/product/[id]`), search, cart & wishlist (persisted in the
  browser), all reading live data from Supabase.
- **Admin portal** (`/admin`): protected by real Supabase Auth sessions,
  enforced in `middleware.ts` *and* re-checked inside every server action —
  not a hidden URL, not client-side-only. Full CRUD for products and brands.
- **No service-role key required.** Admin writes run as the signed-in
  admin's own session and are authorized by Postgres Row Level Security
  (see `supabase/schema.sql`). The only credentials you ever add are the
  public URL + anon key.

## 1. Create your Supabase project

1. Go to [supabase.com](https://supabase.com) → New project.
2. Once it's ready, open **SQL Editor** → paste the full contents of
   [`supabase/schema.sql`](./supabase/schema.sql) → **Run**.
   This creates the `products` and `brands` tables, sets up Row Level
   Security (public read, authenticated-only write), seeds the same demo
   catalog used during development, and creates a public **`product-images`**
   Storage bucket (with the same public-read / admin-write policy pattern)
   that the admin's photo upload uses.
   - Already ran an earlier version of this file? Just re-run the whole
     thing — every statement is written to be safe to re-run, including the
     `alter table ... add column if not exists image_url` line that adds
     photo support to an existing `products` table.
3. Go to **Authentication → Providers** and make sure **Email** sign-ups are
   **disabled** (Settings → Auth → "Allow new users to sign up" → off).
   This is what makes "authenticated" mean "admin" in this app — there's no
   separate roles table, so nobody should be able to self-register.
4. Go to **Authentication → Users → Add user** and create your own admin
   account (email + password, with **Auto Confirm User** checked). Create
   one per person who needs access.

## 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in the two values from
**Project Settings → API** in your Supabase dashboard:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-PUBLIC-KEY
```

That's the *only* file you need to touch. No other code changes needed.

## 3. Run it

```bash
npm install
npm run dev
```

- Storefront: http://localhost:3000
- Admin: http://localhost:3000/admin/login — sign in with the account you
  created in step 1.4.

## 4. Deploy (Vercel is easiest)

1. Push this project to a GitHub repo.
2. Import it in [Vercel](https://vercel.com/new).
3. Add the same two environment variables from `.env.local` in the Vercel
   project settings (Project → Settings → Environment Variables).
4. Deploy. Middleware-based auth works the same in production as in dev.

## How the admin security works

- `middleware.ts` runs on every request, refreshes the Supabase session
  cookie, and **redirects unauthenticated visitors away from `/admin`**
  (except the login page itself) before any admin page ever renders.
- `app/admin/page.tsx` checks the session **again** server-side before
  rendering the dashboard (defense in depth).
- Every mutation in `app/admin/actions.ts` (`upsertProductAction`,
  `deleteProductAction`, `addBrandAction`, `deleteBrandAction`) independently
  calls `requireAdmin()` and throws if there's no session — so even a
  crafted request straight to a server action can't write data unauthenticated.
- Postgres **Row Level Security** enforces the same rule at the database
  layer regardless of what the app code does: only `authenticated` requests
  can insert/update/delete; anyone can read.

There is no passcode, no hidden route, and no admin logic that runs only in
the browser — every check that matters happens on the server or in the
database.

## Dependency security note

This project pins `next@14.2.35` — the latest patch release on the Next.js
14 line, which is what the App Router code here (Server Actions,
`middleware.ts`, route conventions) is built and verified against. It
carries the security backports available for 14.x. A few advisories in the
Next.js issue tracker are only resolved by moving to the Next 15/16 major
line, which changes several APIs (e.g. `cookies()` and dynamic route
`params` become `Promise`-based). That's a worthwhile upgrade to do
deliberately later — just budget time to update `middleware.ts`,
`lib/supabase/server.ts`, and the `params` typing in the two dynamic route
pages when you do. Run `npm audit` any time to check current status.

## Extending it

- **Payments**: intentionally not included, per the original scope. When
  you're ready, Stripe or a local Nepali gateway (eSewa/Khalti) would plug
  into the `CartDrawer` checkout button in
  `src/components/CartDrawer.tsx`.
- **Product photos**: built in. The admin form uploads directly to the
  `product-images` Storage bucket and stores the public URL on the
  product's `image_url`. Products without a photo yet fall back to a
  category-tinted placeholder tile, so an unphotographed catalog still
  looks intentional rather than broken.
  - One known limitation: deleting a product or replacing its photo doesn't
    delete the old file from Storage, so orphaned images will accumulate
    over time. Fine to ignore at small scale; if it matters later, add a
    cleanup call to `supabase.storage.from('product-images').remove([...])`
    in `deleteProductAction` / `upsertProductAction` in `app/admin/actions.ts`.
- **Multiple admins**: just add more users under Authentication → Users —
  no code changes needed.
- **Homepage hero slides**: also fully admin-managed now (Admin → Hero
  slides tab) — add, edit, reorder (via the numeric "order" field), or
  delete the banners at the top of the homepage without touching code.
  Colors are plain hex values combined into a CSS gradient at render time
  (not Tailwind classes), which is what makes them safely editable from the
  database — Tailwind can only style class names it sees at build time, so
  arbitrary colors from a database couldn't work as utility classes.

## Project structure

```
src/
  app/
    (store)/            storefront routes — home, category, product
    admin/               admin routes — login, dashboard, server actions
    layout.tsx            root layout (fonts, global providers)
  components/            shared UI (product cards, drawers, header, etc.)
    admin/                admin-only UI
  context/                Cart / Wishlist / Search / Toast (client state)
  lib/
    supabase/             browser/server/middleware Supabase clients
    data.ts               read-side data fetchers (Server Components)
    types.ts, constants.ts, format.ts
  middleware.ts           protects /admin server-side
supabase/
  schema.sql              tables, RLS policies, seed data
```
