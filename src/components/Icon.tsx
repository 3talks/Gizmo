type IconName =
  | "search" | "heart" | "bag" | "home" | "grid" | "x" | "chevron-r" | "chevron-l"
  | "chevron-d" | "star" | "plus" | "minus" | "arrow-r" | "check" | "phone" | "tablet"
  | "laptop" | "watch" | "drone" | "headphones" | "speaker" | "camera" | "mic" | "plug"
  | "shield" | "pin" | "trash" | "edit" | "lock" | "logout";

const paths: Record<IconName, React.ReactNode> = {
  search: <><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.6" y2="16.6" /></>,
  heart: <path d="M12 21s-7.5-4.6-10-9.3C.5 8 2.4 4.5 6 4.1c2.1-.2 3.9 1 6 3.4 2.1-2.4 3.9-3.6 6-3.4 3.6.4 5.5 3.9 4 7.6C19.5 16.4 12 21 12 21z" />,
  bag: <><path d="M6 8h12l1 13H5L6 8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>,
  home: <><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
  x: <><line x1="5" y1="5" x2="19" y2="19" /><line x1="19" y1="5" x2="5" y2="19" /></>,
  "chevron-r": <polyline points="9 6 15 12 9 18" />,
  "chevron-l": <polyline points="15 6 9 12 15 18" />,
  "chevron-d": <polyline points="6 9 12 15 18 9" />,
  star: <polygon points="12 2 15 9 22 10 17 15 18.5 22 12 18.5 5.5 22 7 15 2 10 9 9" />,
  plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
  minus: <line x1="5" y1="12" x2="19" y2="12" />,
  "arrow-r": <><line x1="4" y1="12" x2="20" y2="12" /><polyline points="14 6 20 12 14 18" /></>,
  check: <polyline points="20 6 9 17 4 12" />,
  phone: <><rect x="6" y="2" width="12" height="20" rx="2.5" /><line x1="10.5" y1="19" x2="13.5" y2="19" /></>,
  tablet: <><rect x="3" y="4" width="18" height="16" rx="2.5" /><line x1="16.5" y1="17" x2="16.5" y2="17.01" /></>,
  laptop: <><rect x="4" y="4" width="16" height="11" rx="1.5" /><line x1="2" y1="19.5" x2="22" y2="19.5" /></>,
  watch: <><rect x="7" y="7" width="10" height="10" rx="2.5" /><line x1="9" y1="2" x2="15" y2="2" /><line x1="9" y1="22" x2="15" y2="22" /></>,
  drone: <><circle cx="12" cy="12" r="2.5" /><circle cx="4" cy="4" r="2.5" /><circle cx="20" cy="4" r="2.5" /><circle cx="4" cy="20" r="2.5" /><circle cx="20" cy="20" r="2.5" /><line x1="10" y1="10" x2="5.5" y2="5.5" /><line x1="14" y1="10" x2="18.5" y2="5.5" /><line x1="10" y1="14" x2="5.5" y2="18.5" /><line x1="14" y1="14" x2="18.5" y2="18.5" /></>,
  headphones: <><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><rect x="2" y="14" width="5" height="7" rx="2" /><rect x="17" y="14" width="5" height="7" rx="2" /></>,
  speaker: <><rect x="5" y="2" width="14" height="20" rx="2.5" /><circle cx="12" cy="8" r="2.4" /><circle cx="12" cy="16" r="1.3" /></>,
  camera: <><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13.5" r="3.6" /></>,
  mic: <><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 11a7 7 0 0 0 14 0" /><line x1="12" y1="18" x2="12" y2="22" /></>,
  plug: <><path d="M9 2v5M15 2v5M6 7h12l-1 6a5 5 0 0 1-5 4 5 5 0 0 1-5-4L6 7z" /><line x1="12" y1="17" x2="12" y2="22" /></>,
  shield: <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5l8-3z" />,
  pin: <><path d="M12 22s7-7.5 7-13a7 7 0 0 0-14 0c0 5.5 7 13 7 13z" /><circle cx="12" cy="9" r="2.5" /></>,
  trash: <><polyline points="4 7 20 7" /><path d="M6 7l1 14h10l1-14" /><path d="M10 11v6M14 11v6" /><path d="M9 7V4h6v3" /></>,
  edit: <><path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3z" /><line x1="13.5" y1="6.5" x2="17.5" y2="10.5" /></>,
  lock: <><rect x="5" y="11" width="14" height="10" rx="2.5" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>,
  logout: <><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" /><line x1="10" y1="12" x2="21" y2="12" /><polyline points="17 8 21 12 17 16" /><path d="M10 20H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4" /></>,
};

export default function Icon({ name, className = "w-5 h-5" }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      stroke="currentColor"
      fill="none"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

export type { IconName };
