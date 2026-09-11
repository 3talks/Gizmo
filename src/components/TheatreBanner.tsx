import Icon from "@/components/Icon";

export default function TheatreBanner() {
  return (
    <div className="relative mx-[18px] my-6 overflow-hidden rounded-l bg-gradient-to-br from-ink via-[#1b1e2b] to-[#23283b] p-6 text-white sm:mx-8 sm:p-10 lg:mx-14 lg:p-14">
      <div className="pointer-events-none absolute -right-[70px] -top-[90px] h-[220px] w-[220px] rounded-full bg-[radial-gradient(circle,rgba(51,85,255,.5),transparent_70%)] blur-[4px]" />
      <div className="relative font-mono text-[10.5px] font-semibold uppercase tracking-wider text-amber">Action Nepal</div>
      <h3 className="relative mb-2.5 mt-1.5 max-w-[480px] font-display text-[23px] font-semibold leading-tight sm:text-3xl lg:text-[32px]">
        Capture it. Mount it. Repeat
      </h3>
      <p className="relative mb-4.5 max-w-[480px] text-[12.5px] leading-relaxed text-[#c7c9d6] lg:text-sm">
        Chest Mounts, Floating grips, ND filters and spare batteries - everything your action cam needs to keep up.
      </p>
      <button className="relative inline-flex items-center gap-1.5 rounded-full border border-white/35 px-4.5 py-2.5 font-mono text-xs transition-colors active:bg-white/15">
        Explore more <Icon name="arrow-r" className="h-3.5 w-3.5 stroke-white" />
      </button>
    </div>
  );
}
