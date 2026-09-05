"use client";

import { useMagneticButton } from "@/hooks/useMagneticButton";
import { calTriggerProps } from "@/lib/cal";

type ButtonVariant = "primary" | "dark" | "light";

interface ButtonProps {
  variant: ButtonVariant;
  size?: "default" | "sm";
  href?: string;
  /** Renders the label with lang="mn" — used for Mongolian button copy mixed into the English shell. */
  lang?: "mn";
  /** Attaches the magnetic-pull hover effect (legacy-static/motion/magnetic-button.js port). */
  magnetic?: boolean;
  /** Wires the button to the Cal.com "pop up via element click" booking modal. */
  cal?: boolean;
  className?: string;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-royal-blue border-royal-blue text-white",
  dark: "bg-black border-black text-white",
  light: "bg-white border-transparent text-neutral-darkest",
};

export function Button({
  variant,
  size = "default",
  href = "#",
  lang,
  magnetic = false,
  cal = false,
  className = "",
  children,
}: ButtonProps) {
  const { elRef, labelRef } = useMagneticButton<HTMLAnchorElement>();

  const sizeClasses =
    size === "sm" ? "py-[7px] px-[19px]" : "py-[9px] px-[23px]";

  return (
    <a
      ref={magnetic ? elRef : undefined}
      href={href}
      {...(cal ? calTriggerProps : {})}
      className={[
        "inline-flex items-center justify-center whitespace-nowrap rounded-btn border text-regular font-medium leading-body",
        "max-480:min-w-0 max-480:flex-1",
        sizeClasses,
        variantClasses[variant],
        className,
      ].join(" ")}
    >
      <span
        ref={magnetic ? labelRef : undefined}
        lang={lang}
        className="max-480:overflow-hidden max-480:text-ellipsis"
      >
        {children}
      </span>
    </a>
  );
}
