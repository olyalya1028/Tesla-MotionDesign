import Image from "next/image";

interface MediaProps {
  src: string;
  alt: string;
  /**
   * "relative" (default) — the frame is a normal-flow box; give it a size via
   * className (aspect-*, h-full, etc). Used where the image sits in a sized
   * flex/aspect box, e.g. the feature or split-card media panes.
   *
   * "fill" — the frame stretches absolutely over an already-sized ancestor
   * (that ancestor must be position:relative). Used for full-bleed
   * backgrounds like the hero and product-card media.
   */
  variant?: "relative" | "fill";
  priority?: boolean;
  sizes?: string;
  className?: string;
}

/**
 * Image frame. The frame owns the crop; the <img> inside stays free to be
 * scaled or panned later (Ken Burns, parallax, …) without touching layout —
 * mirrors legacy-static/styles.css's .media / .media--fill / .media__img.
 */
export function Media({
  src,
  alt,
  variant = "relative",
  priority = false,
  sizes = "100vw",
  className = "",
}: MediaProps) {
  return (
    <div
      className={[
        "overflow-hidden",
        variant === "fill" ? "absolute inset-0" : "relative",
        className,
      ].join(" ")}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover object-center"
      />
    </div>
  );
}
