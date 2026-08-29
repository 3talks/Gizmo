"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/Icon";
import { signInAction } from "@/app/admin/actions";

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await signInAction(formData);
      if (result && "error" in result && result.error) {
        setError(result.error);
      }
      // On success the action itself redirects, so there's nothing else to do here.
    });
  };

  return (
    <div className="flex min-h-[74vh] flex-col items-center justify-center px-[18px] py-10 text-center">
      <div className="mb-4.5 flex h-[54px] w-[54px] items-center justify-center rounded-2xl bg-ink text-white">
        <Icon name="lock" className="h-[22px] w-[22px] stroke-white" />
      </div>
      <h2 className="mb-1.5 font-display text-[21px]">Oliz Admin</h2>
      <p className="mb-6 max-w-[280px] text-[12.5px] text-ink-soft">Sign in with your admin account to manage products and brands.</p>

      <form onSubmit={handleSubmit} className="flex w-full max-w-[300px] flex-col gap-3">
        <input type="hidden" name="next" value={next} />
        <input
          type="email"
          name="email"
          placeholder="you@olizstore.com"
          required
          autoComplete="username"
          className="rounded-xl border border-line bg-surface px-3.5 py-3 text-center text-sm focus:outline focus:outline-2 focus:outline-accent"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          autoComplete="current-password"
          className="rounded-xl border border-line bg-surface px-3.5 py-3 text-center text-sm focus:outline focus:outline-2 focus:outline-accent"
        />
        {error && <div className="text-xs font-medium text-[#e0345c]">{error}</div>}
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-ink py-3 text-[13px] font-semibold text-white transition-transform active:scale-[0.97] disabled:opacity-60"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="mt-5 max-w-[300px] rounded-xl border border-line bg-surface px-4 py-3 text-left text-[11px] leading-relaxed text-ink-faint">
        No account yet? Create one in your Supabase project under{" "}
        <span className="font-semibold text-ink-soft">Authentication → Users → Add user</span>. Public sign-up is
        intentionally disabled — only accounts you create there can sign in here.
      </div>

      <Link href="/" className="mt-4 inline-flex items-center gap-1 text-[11.5px] text-ink-soft">
        <Icon name="chevron-l" className="h-[13px] w-[13px]" />
        Back to store
      </Link>
    </div>
  );
}
