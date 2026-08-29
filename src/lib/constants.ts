import type { Category } from "./types";

export const CATEGORIES: Category[] = [
  { key: "phone", label: "Phones", icon: "phone" },
  { key: "tablet", label: "iPad", icon: "tablet" },
  { key: "laptop", label: "MacBook", icon: "laptop" },
  { key: "watch", label: "Watches", icon: "watch" },
  { key: "drone", label: "Drones", icon: "drone" },
  { key: "audio", label: "Audio", icon: "headphones" },
  { key: "speaker", label: "Theatre", icon: "speaker" },
  { key: "camera", label: "Cameras", icon: "camera" },
  { key: "mic", label: "Mics", icon: "mic" },
  { key: "access", label: "Accessories", icon: "plug" },
];

export const TILE_BY_CATEGORY: Record<string, string> = {
  phone: "linear-gradient(150deg,#eef0ff,#dde3ff)",
  tablet: "linear-gradient(150deg,#eef3ff,#e4e9ff)",
  laptop: "linear-gradient(150deg,#eef0ff,#e6e9f7)",
  camera: "linear-gradient(150deg,#fff2e2,#ffe3c2)",
  drone: "linear-gradient(150deg,#e9fbf1,#d3f5e2)",
  mic: "linear-gradient(150deg,#fdeef5,#f9dce9)",
  access: "linear-gradient(150deg,#eef0ff,#dde3ff)",
  watch: "linear-gradient(150deg,#fff7e6,#ffe9bd)",
  speaker: "linear-gradient(150deg,#eef3ff,#e0e7ff)",
  audio: "linear-gradient(150deg,#f3eeff,#e5daff)",
};

export function categoryLabel(key: string): string {
  if (key === "all") return "All products";
  if (key === "sale") return "On sale";
  return CATEGORIES.find((c) => c.key === key)?.label ?? "Products";
}
