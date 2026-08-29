import Icon from "@/components/Icon";

const SECTIONS = [
  { title: "Shop", links: ["Buy a phone", "Buy iPad", "Buy MacBook", "Watches"] },
  { title: "Explore", links: ["Action cameras", "Drones", "Speakers", "Microphones"] },
  { title: "Support", links: ["Our locations", "EMI calculator", "FAQ"] },
  { title: "Company", links: ["About us", "Press", "Partnership portal"] },
];

export default function Footer() {
  return (
    <footer className="mt-3.5 border-t border-line px-[18px] pb-[130px] pt-7 sm:px-8 sm:pb-[130px] lg:grid lg:grid-cols-[repeat(4,1fr)_1.4fr] lg:gap-9 lg:px-14 lg:pb-14 lg:pt-12">
      {SECTIONS.map((section) => (
        <details key={section.title} className="group border-b border-line lg:border-none" open>
          <summary className="flex cursor-pointer list-none items-center justify-between py-3.5 text-[13.5px] font-semibold lg:pointer-events-none lg:py-0 lg:pb-3.5 lg:font-mono lg:text-[13px] lg:uppercase lg:tracking-wide lg:text-ink-faint">
            {section.title}
            <Icon name="chevron-d" className="h-[15px] w-[15px] transition-transform group-open:rotate-180 lg:hidden" />
          </summary>
          <div className="flex flex-col gap-2.5 pb-3.5 lg:pb-0">
            {section.links.map((l) => (
              <a key={l} href="#" className="text-[12.5px] text-ink-soft">
                {l}
              </a>
            ))}
          </div>
        </details>
      ))}

      <div className="mt-5 text-[11.5px] leading-relaxed text-ink-soft lg:col-start-5 lg:row-start-1 lg:mt-0">
        <div>
          <b className="font-semibold text-ink">GizmoNepal </b> — registered gadget retailer
        </div>
        <div>Nayabazar, Falful Chowk, Kathmandu</div>
        <div>PAN/VAT: 304563074 · </div>
        <div>Care line: 9847681938</div>
      </div>

      <div className="my-5 flex gap-2.5 lg:col-start-5 lg:row-start-2 lg:my-4.5">
        {["IG", "YT", "TT", "X", "FB", "IN"].map((s) => (
          <a key={s} href="#" className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-line font-mono text-[10px] font-bold text-ink-soft">
            {s}
          </a>
        ))}
      </div>

      <div className="mt-4.5 border-t border-line pt-5 text-[10.5px] leading-relaxed text-ink-faint lg:col-span-full">
        Terms &amp; Conditions • Privacy Policy • Return Policy
        <br />© {new Date().getFullYear()} GizmoNepal Store all rights reserved by original owner.
      </div>
    </footer>
  );
}
