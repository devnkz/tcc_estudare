import React from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonSecondaryProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
}

const InteractiveHoverButtonSecondary = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonSecondaryProps
>(({ text = "Button", className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-full border border-zinc-300 bg-zinc-200 px-7 py-4 text-center font-medium text-black transition-all duration-300 hover:border-zinc-400 hover:bg-zinc-300",
        className
      )}
      {...props}
    >
      <span className="relative z-10 inline-flex items-center gap-2 transition-all duration-300 group-hover:gap-3">
        <span className="transition-transform duration-300 group-hover:scale-105">
          {text}
        </span>
        <Info className="h-4 w-4 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
      </span>
      <div className="absolute inset-0 -z-0 bg-gradient-to-r from-zinc-300/0 via-zinc-400/30 to-zinc-300/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
    </button>
  );
});

InteractiveHoverButtonSecondary.displayName = "InteractiveHoverButtonSecondary";

export { InteractiveHoverButtonSecondary };
