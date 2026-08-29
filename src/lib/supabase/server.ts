import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase client for use inside Server Components, Server Actions and
 * Route Handlers. It reads/writes the auth session via cookies, so any
 * query made with this client runs AS the currently signed-in user and is
 * subject to that user's Row Level Security policies — this is what makes
 * the admin writes secure without ever needing a service-role key.
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Called from a Server Component render — safe to ignore because
            // middleware.ts already refreshes the session on every request.
          }
        },
      },
    }
  );
}
