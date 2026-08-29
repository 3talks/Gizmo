import type { Brand } from "@/lib/types";

// A small curated palette (matching the site's own accent colors) used to
// tint each brand's monogram badge — deterministic per name, so the same
// brand always gets the same color without needing a logo asset.
const PALETTE: [string, string][] = [
  ["#3355FF", "#7d5cff"],
  ["#FF9F1C", "#ff7a3d"],
  ["#1FAA59", "#0e7a45"],
  ["#12141A", "#454b5e"],
  ["#FF3860", "#ff7a9c"],
  ["#0EA5E9", "#38bdf8"],
];

function hashName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return h;
}

function monogram(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase();
  return words[0].length <= 3 ? words[0].toUpperCase() : words[0].slice(0, 2).toUpperCase();
}

function BrandBadge({ brand }: { brand: Brand }) {
  const [from, to] = PALETTE[hashName(brand.name) % PALETTE.length];
  return (
    <div className="group flex shrink-0 items-center gap-3 whitespace-nowrap rounded-2xl border border-line bg-surface px-4 py-3 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-pop">
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-[11px] font-bold tracking-wide text-white transition-transform duration-200 group-hover:scale-110"
        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      >
        {monogram(brand.name)}
      </span>
      <span className="font-display text-sm font-semibold text-ink">{brand.name}</span>
    </div>
  );
}

function MarqueeRow({ brands, reverse }: { brands: Brand[]; reverse?: boolean }) {
  const doubled = [...brands, ...brands];
  return (
    <div
      className={`flex w-max gap-3.5 pb-3.5 last:pb-0 hover:[animation-play-state:paused] ${
        reverse ? "animate-marqueeReverse" : "animate-marquee"
      }`}
    >
      {doubled.map((b, i) => (
        <BrandBadge key={`${b.id}-${i}`} brand={b} />
      ))}
    </div>
  );
}

export default function BrandMarquee({ brands }: { brands: Brand[] }) {
  if (!brands.length) return null;

  // Split into two rows so they can drift in opposite directions —
  // reads as one cohesive, alive showcase rather than a single flat ticker.
  const rowA = brands.filter((_, i) => i % 2 === 0);
  const rowB = brands.filter((_, i) => i % 2 === 1);

  return (
    <div className="py-6 sm:py-8">
      <div className="mb-4 px-[18px] sm:px-8 lg:px-14">
        <div className="font-mono text-[10.5px] font-semibold uppercase tracking-[.12em] text-accent">Trusted worldwide</div>
        <h2 className="mt-1 font-display text-xl font-semibold tracking-tight lg:text-2xl">Brands we carry</h2>
      </div>
      <div className="relative overflow-hidden before:absolute before:inset-y-0 before:left-0 before:z-[2] before:w-14 before:bg-gradient-to-r before:from-bg before:to-transparent after:absolute after:inset-y-0 after:right-0 after:z-[2] after:w-14 after:bg-gradient-to-l after:from-bg after:to-transparent">
        <div className="flex flex-col px-[18px] sm:px-8 lg:px-14">
          <MarqueeRow brands={rowA.length ? rowA : brands} />
          {rowB.length > 0 && <MarqueeRow brands={rowB} reverse />}
        </div>
      </div>
    </div>
  );
}
