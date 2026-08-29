import Icon from "@/components/Icon";

const DEFAULT_TILE = "linear-gradient(150deg,#eef0ff,#dde3ff)";

/**
 * Fills its nearest `relative` ancestor. Shows the product photo if one has
 * been uploaded; otherwise falls back to the category-tinted tile with a
 * neutral placeholder icon, so cards never look broken while a catalog is
 * still being photographed.
 */
export default function ProductMedia({
  src,
  alt,
  tile,
  iconClassName = "h-8 w-8",
}: {
  src: string | null;
  alt: string;
  tile?: string;
  iconClassName?: string;
}) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element -- photos live on the user's own Supabase project, domain unknown at build time
    return <img src={src} alt={alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />;
  }
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ background: tile || DEFAULT_TILE }}>
      <Icon name="camera" className={`${iconClassName} stroke-ink-faint opacity-60`} />
    </div>
  );
}
