import React from "react";
import { Loader2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  textIdle: string;
  isLoading?: boolean;
  isSuccess?: boolean;
  enableRipplePulse?: boolean; // ativa animação de pulse e ripple
};

/**
 * Animated pill button for submit/save actions.
 * - Spinner while loading
 * - Check after success
 */
export function ActionButton({
  textIdle,
  isLoading = false,
  isSuccess = false,
  disabled,
  className = "",
  children,
  enableRipplePulse = false,
  onClick,
  ...rest
}: Props) {
  const [ripple, setRipple] = React.useState(false);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (isLoading || disabled) return;
    if (enableRipplePulse) {
      setRipple(true);
      setTimeout(() => setRipple(false), 450);
    }
    onClick?.(e);
  };
  const base =
    "group relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 font-semibold transition shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer";
  const colors = isSuccess
    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
    : "bg-purple-700 hover:bg-purple-800 text-white";

  return (
    <button
      {...rest}
      onClick={handleClick}
      disabled={!!disabled}
      aria-busy={isLoading}
      className={`${base} ${colors} ${className} ${
        enableRipplePulse ? "hover:scale-[1.02] active:scale-[0.97]" : ""
      }`}
    >
      {/* Ripple */}
      {enableRipplePulse && ripple && (
        <motion.span
          initial={{ opacity: 0.35, scale: 0 }}
          animate={{ opacity: 0, scale: 3 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="pointer-events-none absolute inset-0 m-auto h-8 w-8 rounded-full bg-white/40"
        />
      )}
      <span className="relative flex items-center gap-2">
        <span>{textIdle}</span>
        <AnimatePresence mode="wait" initial={false}>
          {isLoading ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.15 }}
              className="flex"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
            </motion.span>
          ) : isSuccess ? (
            <motion.span
              key="success"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="flex items-center justify-center h-5 w-5 rounded-full bg-white/90 text-emerald-700"
            >
              <Check className="h-3.5 w-3.5" />
            </motion.span>
          ) : null}
        </AnimatePresence>
      </span>
      {children}
    </button>
  );
}
