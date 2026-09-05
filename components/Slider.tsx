"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./Button";
import { Media } from "./Media";
import type { SlideData } from "@/lib/slides";

interface SliderProps {
  id: string;
  slides: SlideData[];
}

/**
 * Reusable product slider (used for both the Vehicles and Energy sections).
 *
 * The legacy static build shipped only the markup/hooks for this — the
 * README documented a data-slider-track/translateX API but no script ever
 * drove it. Rather than port guesswork, this uses native CSS scroll-snap:
 * the track is a horizontally scrolling flex row with snap points, dots and
 * arrows call scrollTo/scrollIntoView, and an IntersectionObserver reports
 * back which slide is currently in view to drive aria-current and the
 * arrows' disabled state.
 */
export function Slider({ id, slides }: SliderProps) {
  const viewportRef = useRef<HTMLUListElement | null>(null);
  const slideRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let best: { index: number; ratio: number } | null = null;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number((entry.target as HTMLElement).dataset.index);
          if (!best || entry.intersectionRatio > best.ratio) {
            best = { index, ratio: entry.intersectionRatio };
          }
        }
        if (best) setActiveIndex(best.index);
      },
      { root: viewport, threshold: [0.5, 0.75, 0.99] }
    );

    slideRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [slides.length]);

  function goTo(index: number) {
    const clamped = Math.max(0, Math.min(slides.length - 1, index));
    slideRefs.current[clamped]?.scrollIntoView({
      behavior: "smooth",
      inline: "start",
      block: "nearest",
    });
  }

  return (
    <div className="flex flex-col gap-12 max-767:gap-8" data-slider={id}>
      <ul
        ref={viewportRef}
        className="flex w-full items-start gap-slider-gap overflow-x-auto snap-x snap-mandatory no-scrollbar"
      >
        {slides.map((slide, i) => (
          <li
            key={slide.title}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            data-index={i}
            className="w-slide flex-none snap-start max-767:w-[88%]"
          >
            <article className="relative flex aspect-[1080/630] min-h-[380px] flex-col justify-end gap-6 overflow-hidden p-[clamp(24px,3.333vw,48px)] text-white">
              <Media variant="fill" src={slide.src} alt={slide.alt} className="z-0" />

              <div className="relative z-10 flex flex-col justify-end gap-6">
                <div className="flex flex-col gap-2">
                  {slide.tagline && (
                    <p className="text-regular font-semibold leading-body">
                      <span className="inline-block">{slide.tagline}</span>
                    </p>
                  )}
                  <h3 className="text-heading-2 font-medium leading-tight2 tracking-heading">
                    <span className="inline-block">{slide.title}</span>
                  </h3>
                </div>
                <div className="flex flex-col gap-8">
                  <p className="text-medium font-semibold leading-body">{slide.meta}</p>
                  <div className="flex flex-wrap items-center gap-6 max-480:gap-4">
                    <Button variant="primary" lang="mn">
                      Одоо захиалах
                    </Button>
                    <Button variant="light" lang="mn">
                      Дэлгэрэнгүй
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>

      <div className="flex min-h-12 items-center justify-between gap-6">
        <ul className="flex items-center gap-2">
          {slides.map((slide, i) => (
            <li key={slide.title}>
              <button
                type="button"
                aria-current={i === activeIndex}
                onClick={() => goTo(i)}
                className={`block h-2 w-2 rounded-full bg-scheme1-text ${
                  i === activeIndex ? "opacity-100" : "opacity-20"
                }`}
              >
                <span className="visually-hidden">
                  Slide {i + 1}: {slide.title}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-start gap-4">
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            disabled={activeIndex === 0}
            className="inline-flex items-center justify-center rounded-arrow border border-scheme1-bg bg-scheme1-fg p-[11px] disabled:opacity-40"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- plain SVG icon, next/image's optimizer disallows SVG by default */}
            <img
              src="/assets/icon-arrow-back.svg"
              alt=""
              width={24}
              height={24}
              aria-hidden="true"
              className="h-6 w-6"
            />
            <span className="visually-hidden">Previous slide</span>
          </button>
          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            disabled={activeIndex === slides.length - 1}
            className="inline-flex items-center justify-center rounded-arrow border border-scheme1-bg bg-scheme1-fg p-[11px] disabled:opacity-40"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- plain SVG icon, next/image's optimizer disallows SVG by default */}
            <img
              src="/assets/icon-arrow-forward.svg"
              alt=""
              width={24}
              height={24}
              aria-hidden="true"
              className="h-6 w-6"
            />
            <span className="visually-hidden">Next slide</span>
          </button>
        </div>
      </div>
    </div>
  );
}
