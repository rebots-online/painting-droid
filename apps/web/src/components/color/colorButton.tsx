import type { RgbaColor } from "@/utils/color";
import { ColorProcessor } from "@/utils/colorProcessor";
import { cn } from "@/utils/css";
import { forwardRef } from "react";
import { Slot } from "../ui/slot";

export type ButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "color"
> & {
  color: RgbaColor;
  asChild?: boolean;
};

export const ColorButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const { color, asChild = false, className, ...rest } = props;
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        {...rest}
        ref={ref}
        className={cn(
          "transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          "pile rounded-md border overflow-hidden",
          className
        )}
      >
        <div className="size-full alpha-background" />
        <div
          style={{
            background: `linear-gradient(to right, ${ColorProcessor.fromRgba(
              color
            ).toRgbString()} 25%,${ColorProcessor.fromRgba(
              color
            ).toRgbaString()})`,
          }}
          className="size-full"
        />
      </Comp>
    );
  }
);
