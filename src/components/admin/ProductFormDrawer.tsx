"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";
import { CATEGORIES, TILE_BY_CATEGORY } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { upsertProductAction, type ProductInput } from "@/app/admin/actions";
import type { Product, ProductTag } from "@/lib/types";

interface Props {
  product: Product | null | undefined; // undefined = closed, null = adding, Product = editing
  brands: { id: string; name: string }[];
  onClose: () => void;
  onSaved: () => void;
}

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB

const emptyForm: ProductInput = {
  name: "",
  category: CATEGORIES[0].key,
  image_url: null,
  price: 0,
  old_price: null,
  rating: 4.5,
  reviews: 0,
  tag: null,
  brand: "",
  tile: TILE_BY_CATEGORY[CATEGORIES[0].key],
};

export default function ProductFormDrawer({ product, brands, onClose, onSaved }: Props) {
  const [form, setForm] = useState<ProductInput>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isOpen = product !== undefined;

  useEffect(() => {
    if (product) {
      setForm({
        id: product.id,
        name: product.name,
        category: product.category,
        image_url: product.image_url,
        price: product.price,
        old_price: product.old_price,
        rating: product.rating,
        reviews: product.reviews,
        tag: product.tag,
        brand: product.brand,
        tile: product.tile,
      });
    } else {
      setForm(emptyForm);
    }
    setError(null);
  }, [product]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError("Image is larger than 5MB — please choose a smaller file.");
      return;
    }

    setError(null);
    setUploading(true);
    // Show an instant local preview while the real upload finishes.
    const localPreview = URL.createObjectURL(file);
    setForm((f) => ({ ...f, image_url: localPreview }));

    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("product-images").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      setForm((f) => ({ ...f, image_url: data.publicUrl }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed — please try again.");
      setForm((f) => ({ ...f, image_url: product?.image_url ?? null }));
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploading) return;
    if (!form.name.trim() || !form.category || !form.price) {
      setError("Fill in name, category & price");
      return;
    }
    setSaving(true);
    setError(null);
    const result = await upsertProductAction({ ...form, tile: TILE_BY_CATEGORY[form.category] || form.tile });
    setSaving(false);
    if (result && "error" in result && result.error) {
      setError(result.error);
      return;
    }
    onSaved();
  };

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[80] bg-[rgba(12,13,18,.5)] backdrop-blur-[2px] transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        className={`fixed bottom-0 left-0 right-0 z-[90] mx-auto flex max-h-[86vh] max-w-[600px] flex-col rounded-t-[26px] bg-surface px-[18px] pb-[calc(20px+env(safe-area-inset-bottom))] pt-2 transition-transform duration-[380ms] ease-[cubic-bezier(.2,.85,.3,1)] lg:inset-y-0 lg:right-0 lg:left-auto lg:max-h-none lg:w-[440px] lg:max-w-[440px] lg:rounded-none lg:px-6 lg:pb-6 lg:pt-2.5 lg:shadow-[-16px_0_40px_rgba(12,13,16,.12)] ${
          isOpen ? "translate-y-0 lg:translate-x-0" : "translate-y-full lg:translate-x-full"
        }`}
      >
        <div className="mx-auto mb-3 mt-2 h-1 w-9 rounded-full bg-line lg:hidden" />
        <div className="mb-3.5 flex items-center justify-between">
          <h3 className="font-display text-[17px]">{product ? "Edit product" : "Add product"}</h3>
          <button onClick={onClose} className="flex h-[38px] w-[38px] items-center justify-center rounded-xl border border-line">
            <Icon name="x" className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={submit} className="flex-1 overflow-y-auto">
          <Field label="Name">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="input"
            />
          </Field>

          <Field label="Photo">
            <div className="flex items-center gap-3.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="relative flex h-[84px] w-[84px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-line bg-bg"
              >
                {form.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.image_url} alt="Product preview" className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <Icon name="camera" className="h-6 w-6 stroke-ink-faint" />
                )}
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 font-mono text-[9px] text-white">
                    Uploading…
                  </div>
                )}
              </button>
              <div className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-[10px] border border-line px-3 py-2 text-left text-xs font-semibold text-ink-soft"
                >
                  {form.image_url ? "Change photo" : "Upload photo"}
                </button>
                {form.image_url && (
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, image_url: null }))}
                    className="text-left text-[11px] font-medium text-[#e0345c]"
                  >
                    Remove photo
                  </button>
                )}
                <span className="text-[10px] text-ink-faint">JPG or PNG, up to 5MB</span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-2.5">
            <Field label="Category">
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input">
                {CATEGORIES.map((c) => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Brand">
              <select value={form.brand ?? ""} onChange={(e) => setForm({ ...form, brand: e.target.value || null })} className="input">
                <option value="">— none —</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <Field label="Price (Rs)">
              <input
                type="number"
                min={0}
                value={form.price || ""}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                required
                className="input"
              />
            </Field>
            <Field label="Sale price (optional)">
              <input
                type="number"
                min={0}
                value={form.old_price ?? ""}
                onChange={(e) => setForm({ ...form, old_price: e.target.value ? Number(e.target.value) : null })}
                className="input"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <Field label="Rating">
              <input
                type="number"
                min={0}
                max={5}
                step={0.1}
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                className="input"
              />
            </Field>
            <Field label="Reviews">
              <input
                type="number"
                min={0}
                value={form.reviews}
                onChange={(e) => setForm({ ...form, reviews: Number(e.target.value) })}
                className="input"
              />
            </Field>
          </div>

          <Field label="Tag">
            <select
              value={form.tag ?? ""}
              onChange={(e) => setForm({ ...form, tag: (e.target.value || null) as ProductTag })}
              className="input"
            >
              <option value="">None</option>
              <option value="new">New</option>
              <option value="sale">Sale</option>
              <option value="best">Bestseller</option>
            </select>
          </Field>

          {error && <div className="mb-2.5 text-xs font-medium text-[#e0345c]">{error}</div>}

          <div className="mt-1.5 flex gap-2.5 pb-2.5">
            <button type="button" onClick={onClose} className="rounded-[10px] border border-line px-3.5 py-2.5 text-xs font-semibold text-ink-soft">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="flex-1 rounded-xl bg-ink py-3.5 text-[12.5px] font-semibold text-white transition-transform active:scale-[0.97] disabled:opacity-60"
            >
              {saving ? "Saving…" : uploading ? "Uploading photo…" : "Save product"}
            </button>
          </div>
        </form>
      </div>

      <style jsx global>{`
        .input {
          border: 1px solid #e5e7ed;
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 13px;
          font-family: inherit;
          background: #fff;
          color: #12141a;
          width: 100%;
        }
        .input:focus {
          outline: 2px solid #3355ff;
          outline-offset: 1px;
        }
      `}</style>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3.5 flex flex-col gap-1.5">
      <label className="font-mono text-[11px] font-semibold uppercase tracking-wide text-ink-soft">{label}</label>
      {children}
    </div>
  );
}
