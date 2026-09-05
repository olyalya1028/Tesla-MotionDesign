"use client";

import { useMagneticButton } from "@/hooks/useMagneticButton";
import { calTriggerProps } from "@/lib/cal";

type ButtonVariant = "primary" | "dark" | "light";
type ButtonSize = "default" | "sm";

interface ButtonProps {
  variant: ButtonVariant;
  size?: ButtonSize;
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

/**
 * The button's visual contract, shared by every element that has to *look*
 * like a button. <Button> below is the link flavour; real <button> elements
 * (the contact form's submit, see components/ContactForm.tsx) call this
 * directly so the styling stays single-sourced.
 */
export function buttonClasses({
  variant,
  size = "default",
  className = "",
}: {
  variant: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  return [
    "inline-flex items-center justify-center whitespace-nowrap rounded-btn border text-regular font-medium leading-body",
    "max-480:min-w-0 max-480:flex-1",
    size === "sm" ? "py-[7px] px-[19px]" : "py-[9px] px-[23px]",
    variantClasses[variant],
    className,
  ].join(" ");
}

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

  return (
    <a
      ref={magnetic ? elRef : undefined}
      href={href}
      {...(cal ? calTriggerProps : {})}
      className={buttonClasses({ variant, size, className })}
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
