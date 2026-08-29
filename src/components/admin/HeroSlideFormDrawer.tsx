"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";
import { createClient } from "@/lib/supabase/client";
import { upsertHeroSlideAction, type HeroSlideInput } from "@/app/admin/actions";
import type { HeroSlide } from "@/lib/types";

interface Props {
  slide: HeroSlide | null | undefined; // undefined = closed, null = adding, HeroSlide = editing
  nextSortOrder: number;
  onClose: () => void;
  onSaved: () => void;
}

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB
const FALLBACK_GRADIENT = "linear-gradient(135deg, #12141A, #454b5e)";

const emptyForm: HeroSlideInput = {
  tag: "",
  title_line1: "",
  title_line2: "",
  subtitle: "",
  href: "/category/all",
  image_url: null,
  color_from: null,
  color_via: null,
  color_to: null,
  sort_order: 0,
};

export default function HeroSlideFormDrawer({ slide, nextSortOrder, onClose, onSaved }: Props) {
  const [form, setForm] = useState<HeroSlideInput>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isOpen = slide !== undefined;

  useEffect(() => {
    if (slide) {
      setForm({
        id: slide.id,
        tag: slide.tag,
        title_line1: slide.title_line1,
        title_line2: slide.title_line2,
        subtitle: slide.subtitle,
        href: slide.href,
        image_url: slide.image_url,
        color_from: slide.color_from,
        color_via: slide.color_via,
        color_to: slide.color_to,
        sort_order: slide.sort_order,
      });
    } else {
      setForm({ ...emptyForm, sort_order: nextSortOrder });
    }
    setError(null);
  }, [slide, nextSortOrder]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
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
    const localPreview = URL.createObjectURL(file);
    setForm((f) => ({ ...f, image_url: localPreview }));

    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("hero-images").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("hero-images").getPublicUrl(path);
      setForm((f) => ({ ...f, image_url: data.publicUrl }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed — please try again.");
      setForm((f) => ({ ...f, image_url: slide?.image_url ?? null }));
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploading) return;
    if (!form.title_line1.trim()) {
      setError("Add at least a first title line.");
      return;
    }
    setSaving(true);
    setError(null);
    const result = await upsertHeroSlideAction(form);
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
          <h3 className="font-display text-[17px]">{slide ? "Edit slide" : "Add slide"}</h3>
          <button onClick={onClose} className="flex h-[38px] w-[38px] items-center justify-center rounded-xl border border-line">
            <Icon name="x" className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={submit} className="flex-1 overflow-y-auto">
          {/* live preview */}
          <div
            className="relative mb-4 flex h-[110px] flex-col justify-end overflow-hidden rounded-2xl p-3.5 text-white"
            style={{ background: form.image_url ? undefined : FALLBACK_GRADIENT }}
          >
            {form.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.image_url} alt="Slide preview" className="absolute inset-0 h-full w-full object-cover" />
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            <div className="relative">
              {form.tag && (
                <span className="mb-1.5 inline-block rounded-full bg-white/[.18] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide backdrop-blur">
                  {form.tag}
                </span>
              )}
              <h4 className="font-display text-[15px] font-semibold leading-tight">
                {form.title_line1 || "Title line 1"}
                {form.title_line2 && (
                  <>
                    <br />
                    {form.title_line2}
                  </>
                )}
              </h4>
              {form.subtitle && <p className="text-[10px] opacity-90">{form.subtitle}</p>}
            </div>
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 font-mono text-[10px] text-white">
                Uploading…
              </div>
            )}
          </div>

          <Field label="Photo">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-[10px] border border-line px-3.5 py-2.5 text-xs font-semibold text-ink-soft"
              >
                {form.image_url ? "Change photo" : "Upload photo"}
              </button>
              {form.image_url && (
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, image_url: null }))}
                  className="text-[11px] font-medium text-[#e0345c]"
                >
                  Remove
                </button>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </div>
            <span className="mt-1 text-[10px] text-ink-faint">
              JPG or PNG, up to 5MB, landscape works best. No photo yet? A neutral dark background is used until you add one.
            </span>
          </Field>

          <Field label="Tag (small badge, optional)">
            <input value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} placeholder="e.g. Limited drop" className="input" />
          </Field>

          <div className="grid grid-cols-2 gap-2.5">
            <Field label="Title line 1">
              <input value={form.title_line1} onChange={(e) => setForm({ ...form, title_line1: e.target.value })} required className="input" />
            </Field>
            <Field label="Title line 2 (optional)">
              <input value={form.title_line2} onChange={(e) => setForm({ ...form, title_line2: e.target.value })} className="input" />
            </Field>
          </div>

          <Field label="Subtitle (optional)">
            <input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="input" />
          </Field>

          <Field label="Link (where tapping the slide goes)">
            <input
              value={form.href}
              onChange={(e) => setForm({ ...form, href: e.target.value })}
              placeholder="/category/phone"
              className="input"
            />
          </Field>

          <Field label="Order (lower shows first)">
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
              className="input"
            />
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
              {saving ? "Saving…" : uploading ? "Uploading photo…" : "Save slide"}
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
