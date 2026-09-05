"use client";

import { useEffect, useRef } from "react";

/**
 * Magnetic Button — React port of legacy-static/motion/magnetic-button.js.
 *
 * Behaviour is unchanged from the vanilla version: a padded "influence area"
 * (the button's own box, expanded on every side by --magnetic-influence-padding)
 * is tracked by hand so the pull starts before the pointer actually reaches
 * the button. While the pointer is inside it, the button eases toward it,
 * each axis independently capped at --magnetic-max-offset; its label rides
 * along at --magnetic-label-ratio of the button's own offset. The moment the
 * pointer leaves the influence area (or the viewport, or the tab loses
 * focus), the button springs back to (0, 0) over --magnetic-spring-duration
 * with one soft overshoot.
 *
 * Disabled outright when the primary pointer isn't fine (touch/coarse) or
 * prefers-reduced-motion is set, both re-checked live.
 *
 * Every button gets its own independent rAF loop and listeners — with only a
 * couple of magnetic buttons on the page, this is simpler than the vanilla
 * version's single shared loop and behaves identically.
 */
export function useMagneticButton<T extends HTMLElement, L extends HTMLElement = HTMLSpanElement>() {
  const elRef = useRef<T | null>(null);
  const labelRef = useRef<L | null>(null);

  useEffect(() => {
    if (!("matchMedia" in window) || !("PointerEvent" in window)) return;

    const el = elRef.current;
    if (!el) return;

    const finePointerQuery = window.matchMedia("(pointer: fine)");
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const tokens = getComputedStyle(document.documentElement);

    const readNumber = (name: string, fallback: number) => {
      const n = parseFloat(tokens.getPropertyValue(name));
      return isNaN(n) ? fallback : n;
    };

    const readMilliseconds = (name: string, fallback: number) => {
      const raw = tokens.getPropertyValue(name).trim();
      if (!raw) return fallback;
      const n = parseFloat(raw);
      if (isNaN(n)) return fallback;
      return raw.slice(-2) === "ms" ? n : n * 1000; // also accepts "0.46s"
    };

    const MAX_OFFSET = readNumber("--magnetic-max-offset", 8);
    const LABEL_RATIO = readNumber("--magnetic-label-ratio", 0.4);
    const INFLUENCE_PADDING = readNumber("--magnetic-influence-padding", 48);
    const FOLLOW_EASE = readNumber("--magnetic-follow-ease", 0.2);
    const SPRING_DURATION = readMilliseconds("--magnetic-spring-duration", 460);

    // Gentler than the classic easeOutBack constant (1.70158) — at an 8px
    // range even the standard curve's overshoot is barely visible, but this
    // keeps it deliberately restrained.
    const BACK_OVERSHOOT = 1.2;

    const clamp = (value: number, min: number, max: number) =>
      value < min ? min : value > max ? max : value;

    // Single soft overshoot past 1, then settles at 1. f(0) = 0, f(1) = 1.
    const easeOutBack = (t: number) => {
      const p = t - 1;
      return 1 + (BACK_OVERSHOOT + 1) * p * p * p + BACK_OVERSHOOT * p * p;
    };

    const round = (value: number) => Math.round(value * 100) / 100;

    type Mode = "idle" | "follow" | "spring";

    const instance = {
      mode: "idle" as Mode,
      curX: 0,
      curY: 0,
      targetX: 0,
      targetY: 0,
      springFromX: 0,
      springFromY: 0,
      springStart: 0,
    };

    function paint() {
      const x = round(instance.curX);
      const y = round(instance.curY);
      el!.style.transform = x || y ? `translate3d(${x}px,${y}px,0)` : "";
      const label = labelRef.current;
      if (label) {
        const lx = round(x * LABEL_RATIO);
        const ly = round(y * LABEL_RATIO);
        label.style.transform = lx || ly ? `translate3d(${lx}px,${ly}px,0)` : "";
      }
    }

    function reset() {
      instance.mode = "idle";
      instance.curX = instance.curY = instance.targetX = instance.targetY = 0;
      el!.style.transform = "";
      el!.removeAttribute("data-magnetic-active");
      const label = labelRef.current;
      if (label) label.style.transform = "";
    }

    function consider(px: number, py: number) {
      const rect = el!.getBoundingClientRect();
      // getBoundingClientRect() reports the box *after* any transform
      // already applied, so mid-pull it's offset by (curX, curY) from the
      // button's true layout position — subtract that back out.
      const trueLeft = rect.left - instance.curX;
      const trueTop = rect.top - instance.curY;
      const cx = trueLeft + rect.width / 2;
      const cy = trueTop + rect.height / 2;
      const halfW = rect.width / 2 + INFLUENCE_PADDING;
      const halfH = rect.height / 2 + INFLUENCE_PADDING;
      const dx = px - cx;
      const dy = py - cy;

      if (Math.abs(dx) > halfW || Math.abs(dy) > halfH) {
        if (instance.mode === "follow") release();
        return;
      }

      instance.mode = "follow";
      instance.targetX = clamp(dx / halfW, -1, 1) * MAX_OFFSET;
      instance.targetY = clamp(dy / halfH, -1, 1) * MAX_OFFSET;
    }

    function release() {
      if (instance.mode === "idle") return;
      instance.mode = "spring";
      instance.springFromX = instance.curX;
      instance.springFromY = instance.curY;
      instance.targetX = 0;
      instance.targetY = 0;
      instance.springStart = performance.now();
    }

    // Advances one frame. Returns true while it still needs further frames.
    function step(now: number, dt: number): boolean {
      if (instance.mode === "follow") {
        const ease = 1 - Math.pow(1 - FOLLOW_EASE, dt);
        instance.curX += (instance.targetX - instance.curX) * ease;
        instance.curY += (instance.targetY - instance.curY) * ease;
        if (
          Math.abs(instance.targetX - instance.curX) < 0.05 &&
          Math.abs(instance.targetY - instance.curY) < 0.05
        ) {
          instance.curX = instance.targetX;
          instance.curY = instance.targetY;
          paint();
          return false;
        }
      } else if (instance.mode === "spring") {
        const t = clamp((now - instance.springStart) / SPRING_DURATION, 0, 1);
        const eased = easeOutBack(t);
        instance.curX = instance.springFromX * (1 - eased);
        instance.curY = instance.springFromY * (1 - eased);
        if (t >= 1) {
          instance.curX = 0;
          instance.curY = 0;
          instance.mode = "idle";
          paint();
          el!.removeAttribute("data-magnetic-active");
          return false;
        }
      } else {
        return false;
      }
      paint();
      return true;
    }

    let rafId: number | null = null;
    let lastTime = 0;

    function loop(now: number) {
      const dt = lastTime ? clamp((now - lastTime) / (1000 / 60), 0, 4) : 1;
      lastTime = now;
      if (instance.mode !== "idle") {
        el!.setAttribute("data-magnetic-active", "");
        if (step(now, dt)) {
          rafId = requestAnimationFrame(loop);
          return;
        }
      }
      rafId = null;
      lastTime = 0;
    }

    function ensureLoop() {
      if (rafId === null) rafId = requestAnimationFrame(loop);
    }

    function onPointerMove(event: PointerEvent) {
      if (event.pointerType === "touch") return;
      consider(event.clientX, event.clientY);
      if (instance.mode !== "idle") ensureLoop();
    }

    // Covers the pointer leaving the influence area by leaving the browser
    // viewport entirely (relatedTarget is null in that case).
    function onPointerOut(event: PointerEvent) {
      if (event.relatedTarget) return;
      if (instance.mode === "follow") {
        release();
        ensureLoop();
      }
    }

    function onBlur() {
      if (instance.mode === "follow") {
        release();
        ensureLoop();
      }
    }

    let attached = false;

    function attachListeners() {
      if (attached) return;
      attached = true;
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("pointerout", onPointerOut, { passive: true });
      window.addEventListener("blur", onBlur);
    }

    function detachListeners() {
      if (!attached) return;
      attached = false;
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("blur", onBlur);
    }

    function teardown() {
      detachListeners();
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      lastTime = 0;
      reset();
    }

    function evaluate() {
      const eligible = finePointerQuery.matches && !reducedMotionQuery.matches;
      if (eligible) attachListeners();
      else teardown();
    }

    evaluate();

    if (finePointerQuery.addEventListener) {
      finePointerQuery.addEventListener("change", evaluate);
      reducedMotionQuery.addEventListener("change", evaluate);
    }

    return () => {
      teardown();
      finePointerQuery.removeEventListener?.("change", evaluate);
      reducedMotionQuery.removeEventListener?.("change", evaluate);
    };
  }, []);

  return { elRef, labelRef };
}
