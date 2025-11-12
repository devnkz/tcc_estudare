"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, XCircle } from "lucide-react";

export type ToastKind = "success" | "error" | "info";
export type Toast = {
  id: string;
  kind: ToastKind;
  title?: string;
  message: string;
  duration?: number; // ms
};

type ToastContextType = {
  push: (t: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((t: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2);
    const toast: Toast = { id, duration: 3500, ...t };
    setToasts((prev) => [...prev, toast]);
    const d = toast.duration ?? 3500;
    if (d > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== id));
      }, d);
    }
  }, []);

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport
        toasts={toasts}
        onClose={(id) => setToasts((p) => p.filter((x) => x.id !== id))}
      />
    </ToastContext.Provider>
  );
}

function Icon({ kind }: { kind: ToastKind }) {
  const common = "w-5 h-5";
  if (kind === "success")
    return <CheckCircle2 className={`${common} text-emerald-600`} />;
  if (kind === "error") return <XCircle className={`${common} text-red-600`} />;
  return <Info className={`${common} text-sky-600`} />;
}

export function ToastViewport({
  toasts,
  onClose,
}: {
  toasts: Toast[];
  onClose: (id: string) => void;
}) {
  return (
    <div className="pointer-events-none fixed top-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="pointer-events-auto rounded-xl border border-zinc-200 bg-white/95 backdrop-blur px-4 py-3 shadow-lg"
          >
            <div className="flex items-start gap-3">
              <Icon kind={t.kind} />
              <div className="flex-1">
                {t.title && (
                  <div className="text-sm font-semibold text-zinc-900">
                    {t.title}
                  </div>
                )}
                <div className="text-sm text-zinc-700">{t.message}</div>
              </div>
              <button
                onClick={() => onClose(t.id)}
                className="ml-2 rounded-md p-1 text-zinc-400 hover:text-zinc-700"
                aria-label="Fechar aviso"
              >
                ✕
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
