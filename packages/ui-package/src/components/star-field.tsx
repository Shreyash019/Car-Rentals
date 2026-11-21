"use client";

import { useEffect, useRef } from "react";
import { createStarFieldRenderer, type RGB } from "../lib/star-field-renderer";
import type { StarFieldMessage } from "../lib/star-field.worker";

export type StarFieldProps = {
  /** CSS color token for the stars. Default "--starfield" (set per theme in styles.css). */
  colorToken?: string;
  /** CSS token holding the opacity (0–1). Default "--starfield-opacity" (set per theme). */
  opacityToken?: string;
  /** Stars on screens wider than 640px. */
  count?: number;
  /** Stars on phones. */
  mobileCount?: number;
  size?: number;
  fps?: number;
  /** Pixel density cap (higher = sharper, more GPU work). */
  maxDpr?: number;
};

/** Resolve a CSS token (any color format) to 0–1 sRGB via the browser itself. */
function readColor(token: string): RGB | null {
  const probe = document.createElement("span");
  probe.style.cssText = `display:none;color:var(${token})`;
  document.body.appendChild(probe);
  const value = getComputedStyle(probe).color; // "rgb(29, 78, 216)" or "color(srgb …)"
  probe.remove();
  const nums = value.match(/-?[\d.]+/g)?.map(Number);
  if (!nums || nums.length < 3) return null;
  const scale = value.startsWith("color(") ? 1 : 255;
  return [nums[0] / scale, nums[1] / scale, nums[2] / scale];
}

/** Current theme's star look, read from CSS tokens. */
function readAppearance(colorToken: string, opacityToken: string) {
  const color = readColor(colorToken);
  if (!color) return null;
  const opacity = Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue(opacityToken),
  );
  return { color, opacity: Number.isFinite(opacity) ? opacity : 0.6 };
}

/** Run after the load event, in an idle period, so it never competes with the page. */
function afterLoadWhenIdle(callback: () => void) {
  let idleId = 0;
  let timerId = 0;
  const schedule = () => {
    // typeof checks: TS assumes these APIs always exist, but older Safari lacks them.
    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(callback, { timeout: 4000 });
    } else {
      timerId = window.setTimeout(callback, 1000);
    }
  };
  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule, { once: true });
  return () => {
    window.removeEventListener("load", schedule);
    if (idleId && typeof window.cancelIdleCallback === "function")
      window.cancelIdleCallback(idleId);
    clearTimeout(timerId);
  };
}

/** Decorative starfield behind the page. ~4 KB, starts after load, renders in a worker when possible. */
export function StarField({
  colorToken = "--starfield",
  opacityToken = "--starfield-opacity",
  count = 5000,
  mobileCount = 2000,
  size = 0.0025,
  fps = 30,
  maxDpr = 1.5,
}: StarFieldProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    if (connection?.saveData) return; // respect data-saver mode

    let teardown = () => {};

    const cancelSchedule = afterLoadWhenIdle(() => {
      const appearance = readAppearance(colorToken, opacityToken);
      if (!appearance) return;

      const settings = {
        count: window.matchMedia("(max-width: 40rem)").matches
          ? mobileCount
          : count,
        size,
        fps,
        ...appearance,
        animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      };
      const pixels = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
        return {
          width: Math.round(canvas.clientWidth * dpr),
          height: Math.round(canvas.clientHeight * dpr),
        };
      };
      const markReady = () => canvas.setAttribute("data-ready", "");

      let resize: (w: number, h: number) => void;
      let setAppearance: (c: RGB, o: number) => void;
      let destroy: () => void;

      if (typeof canvas.transferControlToOffscreen === "function") {
        // Preferred: all WebGL work happens off the main thread.
        let worker: Worker;
        let offscreen: OffscreenCanvas;
        try {
          worker = new Worker(
            new URL("../lib/star-field.worker.ts", import.meta.url),
            { type: "module" },
          );
          offscreen = canvas.transferControlToOffscreen();
        } catch {
          return; // decorative: if this fails, show nothing
        }
        const post = (
          message: StarFieldMessage,
          transfer: Transferable[] = [],
        ) => worker.postMessage(message, transfer);
        worker.onmessage = (e: MessageEvent<"ready" | "failed">) => {
          if (e.data === "ready") markReady();
        };
        post({ type: "init", canvas: offscreen, settings, ...pixels() }, [
          offscreen,
        ]);
        resize = (width, height) => post({ type: "resize", width, height });
        setAppearance = (c, o) =>
          post({ type: "appearance", color: c, opacity: o });
        destroy = () => worker.terminate();
      } else {
        // Fallback (older Safari): same renderer on the main thread; each frame is well under 1 ms.
        const renderer = createStarFieldRenderer(canvas, {
          ...settings,
          onReady: markReady,
        });
        if (!renderer) return;
        const first = pixels();
        renderer.resize(first.width, first.height);
        resize = renderer.resize;
        setAppearance = renderer.setAppearance;
        destroy = renderer.destroy;
      }

      const resizeObserver = new ResizeObserver(() => {
        const { width, height } = pixels();
        resize(width, height);
      });
      resizeObserver.observe(canvas);

      const themeObserver = new MutationObserver(() => {
        const next = readAppearance(colorToken, opacityToken);
        if (next) setAppearance(next.color, next.opacity);
      });
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });

      teardown = () => {
        resizeObserver.disconnect();
        themeObserver.disconnect();
        destroy();
        canvas.removeAttribute("data-ready");
      };
    });

    return () => {
      cancelSchedule();
      teardown();
    };
  }, [colorToken, opacityToken, count, mobileCount, size, fps, maxDpr]);

  return (
    <canvas
      // A canvas handed to a worker can't be reused, so new settings get a fresh canvas.
      key={`${colorToken}-${opacityToken}-${count}-${mobileCount}-${size}-${fps}-${maxDpr}`}
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 size-full opacity-0 transition-opacity duration-1000 data-ready:opacity-100"
    />
  );
}
