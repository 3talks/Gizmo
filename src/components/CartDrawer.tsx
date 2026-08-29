"use client";

import Icon from "@/components/Icon";
import ProductMedia from "@/components/ProductMedia";
import { fmt } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import { useProductsCache } from "@/context/ProductsCacheContext";
import { useToast } from "@/context/ToastContext";

export default function CartDrawer() {
  const cart = useCart();
  const { byId } = useProductsCache();
  const { show } = useToast();

  const rows = cart.lines
    .map((line) => ({ line, product: byId(line.id) }))
    .filter((r): r is { line: typeof cart.lines[number]; product: NonNullable<ReturnType<typeof byId>> } => !!r.product);

  const subtotal = rows.reduce((sum, r) => sum + (r.product.old_price || r.product.price) * r.line.qty, 0);

  return (
    <>
      <div
        onClick={cart.close}
        className={`fixed inset-0 z-[80] bg-[rgba(12,13,18,.5)] backdrop-blur-[2px] transition-opacity ${
          cart.isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        className={`fixed bottom-0 left-0 right-0 z-[90] mx-auto flex max-h-[82vh] max-w-[600px] flex-col rounded-t-[26px] bg-surface px-[18px] pb-[calc(20px+env(safe-area-inset-bottom))] pt-2 transition-transform duration-[380ms] ease-[cubic-bezier(.2,.85,.3,1)] lg:inset-y-0 lg:right-0 lg:left-auto lg:max-h-none lg:w-[420px] lg:max-w-[420px] lg:rounded-none lg:px-6 lg:pb-6 lg:pt-2.5 lg:shadow-[-16px_0_40px_rgba(12,13,16,.12)] ${
          cart.isOpen ? "translate-y-0 lg:translate-x-0" : "translate-y-full lg:translate-x-full"
        }`}
      >
        <div className="mx-auto mb-3 mt-2 h-1 w-9 rounded-full bg-line lg:hidden" />
        <div className="mb-3.5 flex items-center justify-between">
          <h3 className="font-display text-[17px]">Your cart</h3>
          <button onClick={cart.close} className="flex h-[38px] w-[38px] items-center justify-center rounded-xl border border-line">
            <Icon name="x" className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {rows.length === 0 ? (
            <div className="py-10 text-center text-ink-soft">
              <Icon name="bag" className="mx-auto mb-2.5 h-9 w-9 stroke-ink-faint" />
              <div>Your cart is empty</div>
            </div>
          ) : (
            rows.map(({ line, product }) => (
              <div key={line.id} className="flex items-center gap-3 border-b border-line py-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                  <ProductMedia src={product.image_url} alt={product.name} tile={product.tile} iconClassName="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h5 className="mb-1 truncate text-[12.5px] font-semibold">{product.name}</h5>
                  <div className="font-mono text-xs">{fmt(product.old_price || product.price)}</div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <button onClick={() => cart.changeQty(line.id, -1)} className="flex h-[22px] w-[22px] items-center justify-center rounded-[7px] border border-line">
                      <Icon name="minus" className="h-2.5 w-2.5" />
                    </button>
                    <span className="min-w-[14px] text-center font-mono text-xs">{line.qty}</span>
                    <button onClick={() => cart.changeQty(line.id, 1)} className="flex h-[22px] w-[22px] items-center justify-center rounded-[7px] border border-line">
                      <Icon name="plus" className="h-2.5 w-2.5" />
                    </button>
                  </div>
                </div>
                <button onClick={() => cart.remove(line.id)} className="shrink-0 text-ink-faint">
                  <Icon name="x" className="h-5 w-5" />
                </button>
              </div>
            ))
          )}
        </div>

        {rows.length > 0 && (
          <div className="mt-1.5 border-t border-line pt-3.5">
            <div className="mb-3 flex justify-between text-[13px]">
              <span>Subtotal</span>
              <b className="font-mono text-[15px]">{fmt(subtotal)}</b>
            </div>
            <button
              onClick={() => show("This is a demo — no payments here", "shield")}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-ink py-3.5 text-[13.5px] font-semibold text-white transition-transform active:scale-[0.97]"
            >
              <Icon name="shield" className="h-[15px] w-[15px] stroke-white" />
              Checkout securely
            </button>
            <div className="mt-2 text-center text-[10.5px] text-ink-faint">Demo store — payment processing isn&apos;t included</div>
          </div>
        )}
      </div>
    </>
  );
}
