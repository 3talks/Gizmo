"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/Icon";
import type { HeroSlide } from "@/lib/types";

const AUTOPLAY_MS = 4600;
const SCROLL_DURATION = 620;

// A slightly more "premium" ease than the browser's built-in smooth-scroll —
// starts and ends gently, matching the cubic-bezier used elsewhere on the site.
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

const FALLBACK_GRADIENT = "linear-gradient(135deg, #12141A, #454b5e)";

function slideGradient(s: HeroSlide) {
  if (!s.color_from || !s.color_to) return FALLBACK_GRADIENT;
  const stops = s.color_via ? `${s.color_from}, ${s.color_via} 55%, ${s.color_to}` : `${s.color_from}, ${s.color_to}`;
  return `linear-gradient(135deg, ${stops})`;
}

export default function Hero({ slides }: { slides: HeroSlide[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rafRef = useRef<number | null>(null);
  const [active, setActive] = useState(0);
  const router = useRouter();

  // Scales down + fades slides as they drift away from center, so the whole
  // strip feels like it has depth rather than snapping between flat frames.
  // Driven 1:1 by scroll position every frame — no CSS transition layered on
  // top, since that would fight the continuous updates and feel laggy.
  const applyParallax = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const width = el.clientWidth || 1;
    const viewportCenter = el.scrollLeft + width / 2;
    slideRefs.current.forEach((slide) => {
      if (!slide) return;
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      const dist = Math.min(1, Math.abs(slideCenter - viewportCenter) / width);
      slide.style.transform = `scale(${1 - dist * 0.06})`;
      slide.style.opacity = String(1 - dist * 0.35);
    });
  }, []);

  const smoothScrollTo = useCallback(
    (targetLeft: number) => {
      const el = scrollerRef.current;
      if (!el) return;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const start = el.scrollLeft;
      const change = targetLeft - start;
      const startTime = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - startTime) / SCROLL_DURATION);
        el.scrollLeft = start + change * easeInOutCubic(t);
        applyParallax();
        rafRef.current = t < 1 ? requestAnimationFrame(step) : null;
      };
      rafRef.current = requestAnimationFrame(step);
    },
    [applyParallax]
  );

  const goTo = useCallback(
    (index: number) => {
      const el = scrollerRef.current;
      if (!el || slides.length === 0) return;
      const clamped = (index + slides.length) % slides.length;
      smoothScrollTo(clamped * el.clientWidth);
      setActive(clamped);
    },
    [smoothScrollTo, slides.length]
  );

  const restartAutoplay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (slides.length < 2) return;
    timerRef.current = setInterval(() => {
      setActive((prev) => {
        const next = (prev + 1) % slides.length;
        const el = scrollerRef.current;
        if (el) smoothScrollTo(next * el.clientWidth);
        return next;
      });
    }, AUTOPLAY_MS);
  }, [smoothScrollTo, slides.length]);

  // Keeps `active` + the parallax transforms in sync with real (touch/trackpad) scrolling too.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        applyParallax();
        setActive(Math.round(el.scrollLeft / el.clientWidth));
        ticking = false;
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    applyParallax();
    window.addEventListener("resize", applyParallax);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", applyParallax);
    };
  }, [applyParallax]);

  useEffect(() => {
    restartAutoplay();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [restartAutoplay]);

  const handleManualNav = (index: number) => {
    goTo(index);
    restartAutoplay();
  };

  if (slides.length === 0) return null;

  return (
    <div className="pt-3.5 pb-1 sm:pt-4.5 lg:pt-6">
      <div className="relative">
        <div
          ref={scrollerRef}
          onTouchStart={() => timerRef.current && clearInterval(timerRef.current)}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-[18px] sm:px-8 lg:gap-4 lg:px-14"
        >
          {slides.map((s, i) => (
            <button
              key={s.id}
              ref={(node) => {
                slideRefs.current[i] = node;
              }}
              onClick={() => router.push(s.href)}
              style={{ transformOrigin: "center", background: slideGradient(s) }}
              className="relative isolate flex h-[190px] w-[calc(100%-36px)] shrink-0 snap-center flex-col justify-end overflow-hidden rounded-l p-[18px] text-left text-white sm:h-[230px] sm:w-[calc(60%-16px)] lg:h-[270px] lg:w-[calc(46%-16px)]"
            >
              {s.image_url && (
                // eslint-disable-next-line @next/next/no-img-element -- photos live on the user's own Supabase project, domain unknown at build time
                <img src={s.image_url} alt="" loading={i === 0 ? "eager" : "lazy"} className="absolute inset-0 h-full w-full object-cover" />
              )}
              <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <div key={`content-${i}-${i === active}`} className={`relative z-10 ${i === active ? "animate-heroFade" : ""}`}>
                {s.tag && (
                  <span className="mb-2 inline-block rounded-full bg-white/[.18] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide backdrop-blur">
                    {s.tag}
                  </span>
                )}
                <h3 className="mb-1 font-display text-[22px] font-semibold leading-tight sm:text-[27px] lg:text-[27px]">
                  {s.title_line1}
                  {s.title_line2 && (
                    <>
                      <br />
                      {s.title_line2}
                    </>
                  )}
                </h3>
                {s.subtitle && <p className="text-[12.5px] opacity-90">{s.subtitle}</p>}
              </div>
            </button>
          ))}
        </div>

        {/* Click-to-browse arrows — the primary way non-touch (desktop/mouse) visitors navigate */}
        {slides.length > 1 && (
          <>
            <button
              onClick={() => handleManualNav(active - 1)}
              aria-label="Previous slide"
              className="absolute left-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-pop backdrop-blur transition-transform hover:scale-105 active:scale-95 sm:left-4 sm:flex lg:left-10"
            >
              <Icon name="chevron-l" className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleManualNav(active + 1)}
              aria-label="Next slide"
              className="absolute right-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-pop backdrop-blur transition-transform hover:scale-105 active:scale-95 sm:right-4 sm:flex lg:right-10"
            >
              <Icon name="chevron-r" className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {slides.length > 1 && (
        <div className="mt-3 flex justify-center gap-1.5">
          {slides.map((s, i) => (
            <button key={s.id} onClick={() => handleManualNav(i)} aria-label={`Go to slide ${i + 1}`} className="p-1">
              <i className={`block h-1.5 rounded-full bg-ink-faint transition-all duration-300 ${i === active ? "w-[18px] bg-accent" : "w-1.5"}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
