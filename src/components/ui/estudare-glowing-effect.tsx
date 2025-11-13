"use client";

import { memo } from "react";
import { GlowingEffect } from "./glowing-effect";
import { cn } from "@/lib/utils";

interface EstudareGlowingEffectProps {
  blur?: number;
  inactiveZone?: number;
  proximity?: number;
  spread?: number;
  glow?: boolean;
  className?: string;
  disabled?: boolean;
  movementDuration?: number;
  borderWidth?: number;
}

const EstudareGlowingEffect = memo(
  ({
    blur = 0,
    inactiveZone = 0.5,
    proximity = 80,
    spread = 50,
    glow = true,
    className,
    movementDuration = 1.5,
    borderWidth = 2,
    disabled = false,
  }: EstudareGlowingEffectProps) => {
    return (
      <div
        style={
          {
            "--estudare-gradient": `radial-gradient(circle, #a855f7 10%, #a855f700 20%),
                radial-gradient(circle at 40% 40%, #c084fc 5%, #c084fc00 15%),
                radial-gradient(circle at 60% 60%, #9333ea 10%, #9333ea00 20%), 
                radial-gradient(circle at 40% 60%, #7c3aed 10%, #7c3aed00 20%),
                repeating-conic-gradient(
                  from 236.84deg at 50% 50%,
                  #a855f7 0%,
                  #c084fc 5%,
                  #9333ea 10%, 
                  #7c3aed 15%,
                  #a855f7 20%
                )`,
          } as React.CSSProperties
        }
        className={cn("relative", className)}
      >
        <GlowingEffect
          blur={blur}
          inactiveZone={inactiveZone}
          proximity={proximity}
          spread={spread}
          glow={glow}
          disabled={disabled}
          movementDuration={movementDuration}
          borderWidth={borderWidth}
          variant="default"
        />
      </div>
    );
  }
);

EstudareGlowingEffect.displayName = "EstudareGlowingEffect";

export { EstudareGlowingEffect };
