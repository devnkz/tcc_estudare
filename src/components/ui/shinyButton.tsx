"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type ButtonMotionProps = Omit<
  React.ComponentProps<typeof motion.button>,
  "ref"
>;
interface ShinyButtonProps extends Omit<ButtonMotionProps, "children"> {
  children?: React.ReactNode;
  variant?: "primary" | "secondary";
  sparkles?: number; // how many decorative sparkles
}

export const ShinyButton = ({
  children,
  className,
  variant = "primary",
  sparkles = 5,
  ...rest
}: ShinyButtonProps) => {
  const colors =
    variant === "primary"
      ? "bg-gradient-to-r from-purple-600 via-violet-600 to-purple-600"
      : "bg-gradient-to-r from-zinc-600 via-zinc-600 to-purple-600";

  // Generate persistent random star positions & sizes
  const stars = React.useMemo(() => {
    return Array.from({ length: sparkles }).map(() => ({
      top: Math.random() * 60 + 10, // 10% - 70%
      left: Math.random() * 70 + 5, // 5% - 75%
      scale: Math.random() * 0.6 + 0.7, // 0.7 - 1.3
      delay: Math.random() * 0.25, // 0 - .25s
      rotate: Math.random() * 90, // initial rotation
    }));
  }, [sparkles]);

  return (
    <motion.button
      type="button"
      initial="rest"
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
      variants={{
        rest: {
          scale: 1,
          boxShadow:
            "0 2px 6px -2px rgba(79,70,229,0.30), 0 1px 3px -1px rgba(0,0,0,0.15)",
        },
        hover: {
          scale: 1.02,
          boxShadow:
            "0 6px 14px -4px rgba(79,70,229,0.45), 0 3px 8px -2px rgba(0,0,0,0.22)",
          transition: {
            type: "spring",
            stiffness: 280,
            damping: 22,
          },
        },
      }}
      className={cn(
        "group relative inline-flex items-center gap-2 font-semibold tracking-wide text-white rounded-full px-6 py-3 overflow-hidden shadow-lg transition focus:outline-none focus:ring-2 focus:ring-purple-300 cursor-pointer",
        colors,
        className
      )}
      {...rest}
    >
      {/* Animated shine only on hover */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/70 to-transparent"
        variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
        animate={{ x: ["-130%", "130%"] }}
        transition={{
          x: { repeat: Infinity, duration: 1.6, ease: "easeInOut" },
        }}
      />
      {/* Stars (hover only, random) */}
      {stars.map((s, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="pointer-events-none absolute"
          style={{ top: `${s.top}%`, left: `${s.left}%` }}
          variants={{
            rest: { opacity: 0, scale: 0 },
            hover: { opacity: 1, scale: s.scale },
          }}
        >
          <motion.svg
            width={14}
            height={14}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            initial={{ rotate: s.rotate }}
            variants={{
              rest: { opacity: 0 },
              hover: {
                opacity: [0, 1, 1, 0.8, 1],
                rotate: [s.rotate, s.rotate + 180, s.rotate + 360],
              },
            }}
            transition={{
              duration: 1.4,
              ease: "easeInOut",
              delay: s.delay,
              repeat: Infinity,
            }}
            className="drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]"
          >
            <path
              d="M12 2.5L14.7 8.4L21.2 9.2L16.6 13.6L17.8 20L12 17.1L6.2 20L7.4 13.6L2.8 9.2L9.3 8.4L12 2.5Z"
              fill="white"
              fillOpacity={0.95}
            />
          </motion.svg>
        </motion.span>
      ))}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
};
