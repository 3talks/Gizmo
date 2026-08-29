import Link from "next/link";
import Icon from "@/components/Icon";
import { CATEGORIES } from "@/lib/constants";

export default function CategoryChips({ activeKey }: { activeKey?: string }) {
  return (
    <div className="flex gap-2.5 overflow-x-auto px-[18px] pb-1 pt-0.5 sm:px-8 lg:flex-wrap lg:gap-4 lg:overflow-visible lg:px-14">
      {CATEGORIES.map((c) => {
        const isActive = c.key === activeKey;
        return (
          <Link
            key={c.key}
            href={`/category/${c.key}`}
            className="flex w-[68px] shrink-0 flex-col items-center gap-1.5 text-center lg:w-[84px]"
          >
            <span
              className={`flex h-[58px] w-[58px] items-center justify-center rounded-2xl border border-line transition-transform lg:h-[66px] lg:w-[66px] ${
                isActive ? "-translate-y-0.5 bg-accent text-white shadow-pop" : "bg-surface text-accent"
              }`}
            >
              <Icon name={c.icon as any} className="h-5 w-5" />
            </span>
            <span className={`text-[11px] ${isActive ? "font-semibold text-ink" : "font-medium text-ink-soft"}`}>{c.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
