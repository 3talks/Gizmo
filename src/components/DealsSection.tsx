import Icon from "@/components/Icon";
import DealCountdown from "@/components/DealCountdown";

export default function DealsSection() {
  return (
    <div className="flex gap-3 overflow-x-auto px-[18px] pb-2 pt-0.5 sm:px-8 lg:px-14">
      <div className="flex min-h-[118px] w-[78%] shrink-0 flex-col justify-between rounded-m bg-gradient-to-br from-ink to-[#31364a] p-4 text-white sm:w-[340px] lg:min-h-[150px] lg:w-[400px] lg:p-[22px]">
        <div className="flex items-start justify-between">
          <span className="rounded-full bg-white/[.16] px-2 py-1 font-mono text-[10px]">Open box</span>
          <DealCountdown />
        </div>
        <div>
          <h4 className="mb-0.5 font-display text-lg font-semibold">Open Box Collection</h4>
          <p className="mb-2.5 text-[11.5px] opacity-85">Inspected, discounted, ready to ship</p>
          <button className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 font-mono text-[11px] font-semibold text-ink transition-transform active:scale-95">
            Shop now <Icon name="arrow-r" className="h-3 w-3 stroke-ink" />
          </button>
        </div>
      </div>
      <div className="flex min-h-[118px] w-[78%] shrink-0 flex-col justify-between rounded-m bg-gradient-to-br from-amber to-[#ff5d5d] p-4 text-white sm:w-[340px] lg:min-h-[150px] lg:w-[400px] lg:p-[22px]">
        <div className="flex items-start justify-between">
          <span className="rounded-full bg-white/20 px-2 py-1 font-mono text-[10px]">Sale 🏷️</span>
          <DealCountdown />
        </div>
        <div>
          <h4 className="mb-0.5 font-display text-lg font-semibold">Today&apos;s Sale</h4>
          <p className="mb-2.5 text-[11.5px] opacity-85">Up to 15% off selected gadgets</p>
          <button className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 font-mono text-[11px] font-semibold text-ink transition-transform active:scale-95">
            View deals <Icon name="arrow-r" className="h-3 w-3 stroke-ink" />
          </button>
        </div>
      </div>
    </div>
  );
}
