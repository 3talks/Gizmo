"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import { CATEGORIES } from "@/lib/constants";
import { upsertSubcategoryAction, type SubcategoryInput } from "@/app/admin/actions";
import type { SubCategory } from "@/lib/types";

interface Props {
  subcategory: SubCategory | null | undefined; // undefined = closed, null = adding, SubCategory = editing
  nextSortOrder: number;
  onClose: () => void;
  onSaved: () => void;
}

const emptyForm: SubcategoryInput = {
  category: CATEGORIES[0].key,
  name: "",
  href: `/category/${CATEGORIES[0].key}`,
  sort_order: 0,
};

export default function SubcategoryFormDrawer({ subcategory, nextSortOrder, onClose, onSaved }: Props) {
  const [form, setForm] = useState<SubcategoryInput>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isOpen = subcategory !== undefined;

  useEffect(() => {
    if (subcategory) {
      setForm({
        id: subcategory.id,
        category: subcategory.category,
        name: subcategory.name,
        href: subcategory.href,
        sort_order: subcategory.sort_order,
      });
    } else {
      setForm({ ...emptyForm, sort_order: nextSortOrder });
    }
    setError(null);
  }, [subcategory, nextSortOrder]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Give the subcategory a name.");
      return;
    }
    setSaving(true);
    setError(null);
    const result = await upsertSubcategoryAction(form);
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
        className={`fixed bottom-0 left-0 right-0 z-[90] mx-auto flex max-h-[86vh] max-w-[600px] flex-col rounded-t-[26px] bg-surface px-[18px] pb-[calc(20px+env(safe-area-inset-bottom))] pt-2 transition-transform duration-[380ms] ease-[cubic-bezier(.2,.85,.3,1)] lg:inset-y-0 lg:right-0 lg:left-auto lg:max-h-none lg:w-[420px] lg:max-w-[420px] lg:rounded-none lg:px-6 lg:pb-6 lg:pt-2.5 lg:shadow-[-16px_0_40px_rgba(12,13,16,.12)] ${
          isOpen ? "translate-y-0 lg:translate-x-0" : "translate-y-full lg:translate-x-full"
        }`}
      >
        <div className="mx-auto mb-3 mt-2 h-1 w-9 rounded-full bg-line lg:hidden" />
        <div className="mb-3.5 flex items-center justify-between">
          <h3 className="font-display text-[17px]">{subcategory ? "Edit subcategory" : "Add subcategory"}</h3>
          <button onClick={onClose} className="flex h-[38px] w-[38px] items-center justify-center rounded-xl border border-line">
            <Icon name="x" className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={submit} className="flex-1 overflow-y-auto">
          <Field label="Parent category">
            <select
              value={form.category}
              onChange={(e) => {
                const nextCategory = e.target.value;
                setForm((f) => ({
                  ...f,
                  category: nextCategory,
                  href: f.href === `/category/${f.category}` ? `/category/${nextCategory}` : f.href,
                }));
              }}
              className="input"
            >
              {CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
            <span className="mt-1 block text-[10px] text-ink-faint">This is which nav item the dropdown appears under.</span>
          </Field>

          <Field label="Name (shown in the dropdown)">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. iPhone 17 series" required className="input" />
          </Field>

          <Field label="Link (where it goes)">
            <input
              value={form.href}
              onChange={(e) => setForm({ ...form, href: e.target.value })}
              placeholder="/category/phone"
              className="input"
            />
            <span className="mt-1 block text-[10px] text-ink-faint">Any internal path — usually a category page, e.g. /category/phone or /category/sale.</span>
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
              disabled={saving}
              className="flex-1 rounded-xl bg-ink py-3.5 text-[12.5px] font-semibold text-white transition-transform active:scale-[0.97] disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save subcategory"}
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
