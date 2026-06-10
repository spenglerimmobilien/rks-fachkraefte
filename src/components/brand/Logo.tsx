import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  variant?: "default" | "light";
  className?: string;
}

const sizes = {
  sm: { img: 36, text: "text-sm" },
  md: { img: 48, text: "text-base" },
  lg: { img: 72, text: "text-xl" },
  xl: { img: 120, text: "text-2xl" },
};

export function Logo({ size = "md", showText = true, variant = "default", className }: LogoProps) {
  const s = sizes[size];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn(
        "relative rounded-full overflow-hidden shrink-0 bg-white shadow-sm",
        size === "xl" && "animate-float ring-4 ring-white/20"
      )}>
        <Image
          src="/images/logo.png"
          alt="RKS Fachkräfte Logo"
          width={s.img}
          height={s.img}
          className="object-cover"
          priority={size === "xl"}
        />
      </div>
      {showText && (
        <div className="hidden sm:block leading-tight">
          <span className={cn(
            "font-black tracking-tight block",
            s.text,
            variant === "light" ? "text-white" : "text-navy"
          )}>
            RKS
          </span>
          <span className={cn(
            "text-[0.65em] font-semibold tracking-[0.25em] uppercase block -mt-0.5",
            variant === "light" ? "text-white/70" : "text-muted"
          )}>
            Fachkräfte
          </span>
        </div>
      )}
    </div>
  );
}
