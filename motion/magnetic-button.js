/*!
 * Magnetic Button — isolated motion module (zero dependencies)
 *
 * Scope
 * -----
 * Only elements matching [data-motion-target~="magnetic-button"]. If that
 * selector matches nothing, this file does nothing at all — no listeners are
 * attached, no globals are created. It never touches styles.css, and it
 * writes only the `transform` inline style (plus a small state class) on the
 * elements it targets and their .btn__label child. Delete this file and its
 * <script> tag (and the sibling magnetic-button.css + its <link>) and the
 * page returns to its exact prior state.
 *
 * Behaviour
 * ---------
 * - A padded "influence area" (the button's own box, expanded on every side
 *   by --magnetic-influence-padding) is tracked by hand — a native
 *   pointerenter/pointerleave pair on the button itself only fires at its
 *   literal edge, which is too late for a magnetic feel; the pull needs to
 *   start before the pointer actually touches the button. So throughout this
 *   file, "entering/leaving the influence area" is what stands in for
 *   pointerenter/pointerleave.
 * - While the pointer is inside that area, the button eases toward it, each
 *   axis independently capped at --magnetic-max-offset. Its label rides
 *   along at --magnetic-label-ratio of the button's own offset, for a subtle
 *   parallax/depth cue.
 * - The moment the pointer leaves the influence area — or leaves the browser
 *   viewport entirely, or the window/tab loses focus — the button springs
 *   back to exactly (0, 0) over --magnetic-spring-duration with one soft
 *   overshoot and no repeated bounce.
 * - Every position update runs inside a requestAnimationFrame loop and
 *   writes only `transform`. No CSS transition/animation is used anywhere.
 * - Disabled outright — never even attaches a listener — when the primary
 *   pointer isn't fine (touch/coarse devices) or prefers-reduced-motion is
 *   set, and both are re-checked live if the user changes them mid-session.
 */
(function () {
  'use strict';

  var SELECTOR = '[data-motion-target~="magnetic-button"]';
  var LABEL_SELECTOR = '.btn__label';
  var ACTIVE_CLASS = 'is-magnetic-active';

  if (!('matchMedia' in window) || !('PointerEvent' in window)) return;

  var finePointerQuery = window.matchMedia('(pointer: fine)');
  var reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  var tokens = getComputedStyle(document.documentElement);

  function readNumber(name, fallback) {
    var n = parseFloat(tokens.getPropertyValue(name));
    return isNaN(n) ? fallback : n;
  }

  function readMilliseconds(name, fallback) {
    var raw = tokens.getPropertyValue(name).trim();
    if (!raw) return fallback;
    var n = parseFloat(raw);
    if (isNaN(n)) return fallback;
    return raw.slice(-2) === 'ms' ? n : n * 1000; // also accepts "0.46s"
  }

  var MAX_OFFSET = readNumber('--magnetic-max-offset', 8);
  var LABEL_RATIO = readNumber('--magnetic-label-ratio', 0.4);
  var INFLUENCE_PADDING = readNumber('--magnetic-influence-padding', 48);
  var FOLLOW_EASE = readNumber('--magnetic-follow-ease', 0.2);
  var SPRING_DURATION = readMilliseconds('--magnetic-spring-duration', 460);

  // Gentler than the classic easeOutBack constant (1.70158) — at an 8px
  // range even the standard curve's overshoot is barely visible, but this
  // keeps it deliberately restrained ("нарийн мэдрэмжтэй").
  var BACK_OVERSHOOT = 1.2;

  function clamp(value, min, max) {
    return value < min ? min : value > max ? max : value;
  }

  // Single soft overshoot past 1, then settles at 1 — never oscillates
  // further. f(0) = 0, f(1) = 1.
  function easeOutBack(t) {
    var p = t - 1;
    return 1 + (BACK_OVERSHOOT + 1) * p * p * p + BACK_OVERSHOOT * p * p;
  }

  function round(value) {
    return Math.round(value * 100) / 100;
  }

  function Instance(el) {
    this.el = el;
    this.label = el.querySelector(LABEL_SELECTOR);
    this.mode = 'idle'; // 'idle' | 'follow' | 'spring'
    this.curX = 0;
    this.curY = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.springFromX = 0;
    this.springFromY = 0;
    this.springStart = 0;
  }

  // px/py are viewport coordinates (a pointer event's clientX/clientY).
  // Updates this instance's mode/target in place.
  Instance.prototype.consider = function (px, py) {
    var rect = this.el.getBoundingClientRect();
    // getBoundingClientRect() reports the box *after* any transform already
    // applied, so mid-pull it's offset by (curX, curY) from the button's
    // true layout position. Subtract that back out — otherwise a button
    // that's already moving would measure its own center in the wrong
    // place each frame and drift instead of tracking the pointer cleanly.
    var trueLeft = rect.left - this.curX;
    var trueTop = rect.top - this.curY;
    var cx = trueLeft + rect.width / 2;
    var cy = trueTop + rect.height / 2;
    var halfW = rect.width / 2 + INFLUENCE_PADDING;
    var halfH = rect.height / 2 + INFLUENCE_PADDING;
    var dx = px - cx;
    var dy = py - cy;

    if (Math.abs(dx) > halfW || Math.abs(dy) > halfH) {
      if (this.mode === 'follow') this.release();
      return;
    }

    this.mode = 'follow';
    this.targetX = clamp(dx / halfW, -1, 1) * MAX_OFFSET;
    this.targetY = clamp(dy / halfH, -1, 1) * MAX_OFFSET;
  };

  Instance.prototype.release = function () {
    if (this.mode === 'idle') return;
    this.mode = 'spring';
    this.springFromX = this.curX;
    this.springFromY = this.curY;
    this.targetX = 0;
    this.targetY = 0;
    this.springStart = performance.now();
  };

  // Advances this instance by one frame. Returns true while it still needs
  // further frames, false once it has settled (caller can then stop calling
  // step() until something — a new pointermove — reactivates it).
  Instance.prototype.step = function (now, dt) {
    if (this.mode === 'follow') {
      var ease = 1 - Math.pow(1 - FOLLOW_EASE, dt);
      this.curX += (this.targetX - this.curX) * ease;
      this.curY += (this.targetY - this.curY) * ease;
      if (Math.abs(this.targetX - this.curX) < 0.05 && Math.abs(this.targetY - this.curY) < 0.05) {
        this.curX = this.targetX;
        this.curY = this.targetY;
        this.paint();
        return false;
      }
    } else if (this.mode === 'spring') {
      var t = clamp((now - this.springStart) / SPRING_DURATION, 0, 1);
      var eased = easeOutBack(t);
      this.curX = this.springFromX * (1 - eased);
      this.curY = this.springFromY * (1 - eased);
      if (t >= 1) {
        this.curX = 0;
        this.curY = 0;
        this.mode = 'idle';
        this.paint();
        this.el.classList.remove(ACTIVE_CLASS);
        return false;
      }
    } else {
      return false;
    }
    this.paint();
    return true;
  };

  Instance.prototype.paint = function () {
    var x = round(this.curX);
    var y = round(this.curY);
    this.el.style.transform = (x || y) ? 'translate3d(' + x + 'px,' + y + 'px,0)' : '';
    if (this.label) {
      var lx = round(x * LABEL_RATIO);
      var ly = round(y * LABEL_RATIO);
      this.label.style.transform = (lx || ly) ? 'translate3d(' + lx + 'px,' + ly + 'px,0)' : '';
    }
  };

  Instance.prototype.reset = function () {
    this.mode = 'idle';
    this.curX = this.curY = this.targetX = this.targetY = 0;
    this.el.style.transform = '';
    this.el.classList.remove(ACTIVE_CLASS);
    if (this.label) this.label.style.transform = '';
  };

  var instances = [];
  var rafId = null;
  var lastTime = 0;

  function loop(now) {
    var dt = lastTime ? clamp((now - lastTime) / (1000 / 60), 0, 4) : 1;
    lastTime = now;
    var stillActive = false;
    for (var i = 0; i < instances.length; i++) {
      var inst = instances[i];
      if (inst.mode === 'idle') continue;
      inst.el.classList.add(ACTIVE_CLASS);
      if (inst.step(now, dt)) stillActive = true;
    }
    if (stillActive) {
      rafId = requestAnimationFrame(loop);
    } else {
      rafId = null;
      lastTime = 0;
    }
  }

  function ensureLoop() {
    if (rafId === null) rafId = requestAnimationFrame(loop);
  }

  function onPointerMove(event) {
    if (event.pointerType === 'touch') return;
    var needsLoop = false;
    for (var i = 0; i < instances.length; i++) {
      instances[i].consider(event.clientX, event.clientY);
      if (instances[i].mode !== 'idle') needsLoop = true;
    }
    if (needsLoop) ensureLoop();
  }

  // Covers the pointer leaving the influence area by leaving the browser
  // viewport entirely (relatedTarget is null in that case) — a fast flick
  // off-screen may not land a final pointermove exactly at the boundary.
  function onPointerOut(event) {
    if (event.relatedTarget) return;
    releaseAll();
  }

  function releaseAll() {
    var needsLoop = false;
    for (var i = 0; i < instances.length; i++) {
      if (instances[i].mode === 'follow') {
        instances[i].release();
        needsLoop = true;
      }
    }
    if (needsLoop) ensureLoop();
  }

  function attachListeners() {
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerout', onPointerOut, { passive: true });
    window.addEventListener('blur', releaseAll);
  }

  function detachListeners() {
    window.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerout', onPointerOut);
    window.removeEventListener('blur', releaseAll);
  }

  function setup() {
    var els = document.querySelectorAll(SELECTOR);
    if (!els.length) return;
    instances = Array.prototype.map.call(els, function (el) { return new Instance(el); });
    attachListeners();
  }

  function teardown() {
    detachListeners();
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    lastTime = 0;
    for (var i = 0; i < instances.length; i++) instances[i].reset();
    instances = [];
  }

  function evaluate() {
    var eligible = finePointerQuery.matches && !reducedMotionQuery.matches;
    if (eligible && instances.length === 0) {
      setup();
    } else if (!eligible && instances.length > 0) {
      teardown();
    }
  }

  function start() {
    evaluate();
    if (finePointerQuery.addEventListener) {
      finePointerQuery.addEventListener('change', evaluate);
      reducedMotionQuery.addEventListener('change', evaluate);
    } else if (finePointerQuery.addListener) { // Safari < 14
      finePointerQuery.addListener(evaluate);
      reducedMotionQuery.addListener(evaluate);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
