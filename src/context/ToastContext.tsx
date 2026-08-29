"use client";

import { createContext, useCallback, useContext, useState } from "react";
import Icon, { type IconName } from "@/components/Icon";

interface Toast {
  id: number;
  message: string;
  icon: IconName;
}

const ToastContext = createContext<{ show: (message: string, icon?: IconName) => void }>({
  show: () => {},
});

let toastId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((message: string, icon: IconName = "check") => {
    const id = ++toastId;
    setToasts((t) => [...t, { id, message, icon }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 2600);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed top-3.5 left-0 right-0 z-[100] mx-auto flex max-w-[400px] flex-col gap-2 px-4 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-2.5 rounded-2xl bg-ink px-3.5 py-2.5 text-[12.5px] font-medium text-white shadow-[0_10px_24px_rgba(0,0,0,.25)] animate-toastIn"
          >
            <Icon name={t.icon} className="h-4 w-4 shrink-0 stroke-green-500" />
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
