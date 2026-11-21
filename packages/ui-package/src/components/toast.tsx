"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { Alert } from "./alert";
import { Button } from "./button";

export type ToastTone = "neutral" | "info" | "success" | "warning" | "danger";

export type ToastOptions = {
  title: ReactNode;
  description?: ReactNode;
  tone?: ToastTone;
  /** ms before it closes; 0 = stays until dismissed. Default 5000 (danger: 0). */
  duration?: number;
  action?: { label: string; onClick: () => void };
};

type ToastItem = ToastOptions & { id: number };

const MAX_VISIBLE = 5;
const EMPTY: ToastItem[] = [];
let items: ToastItem[] = EMPTY;
let nextId = 1;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
function show(options: ToastOptions) {
  const id = nextId++;
  items = [...items, { ...options, id }].slice(-MAX_VISIBLE);
  emit();
  return id;
}
function dismiss(id: number) {
  items = items.filter((t) => t.id !== id);
  emit();
}

type Shortcut = (title: ReactNode, options?: Omit<ToastOptions, "title" | "tone">) => number;
const withTone =
  (tone: ToastTone): Shortcut =>
  (title, options) =>
    show({ ...options, title, tone });

/**
 * Show a toast from any client code. Needs <Toaster /> (or <UIProvider>) once in the layout.
 *   toast.success("Booking saved")
 *   toast.error("Couldn't save", { description: "Check your connection." })
 *   toast({ title: "Partner removed", action: { label: "Undo", onClick: undo } })
 */
export const toast = Object.assign(show, {
  success: withTone("success"),
  error: withTone("danger"),
  warning: withTone("warning"),
  info: withTone("info"),
  dismiss,
});

const POSITION = {
  "bottom-right": "bottom-0 end-0",
  "bottom-center": "bottom-0 start-1/2 -translate-x-1/2",
  "top-right": "top-0 end-0",
  "top-center": "top-0 start-1/2 -translate-x-1/2",
} as const;

export type ToasterProps = { position?: keyof typeof POSITION; label?: string };

export function Toaster({ position = "bottom-right", label = "Notifications" }: ToasterProps) {
  const list = useSyncExternalStore(subscribe, () => items, () => EMPTY);
  return (
    <section aria-label={label} className={cn("pointer-events-none fixed z-50 w-full p-4 sm:w-auto", POSITION[position])}>
      <ol aria-live="polite" className="flex w-full flex-col gap-2 sm:w-96">
        {list.map((item) => (
          <ToastView key={item.id} item={item} />
        ))}
      </ol>
    </section>
  );
}

function ToastView({ item }: { item: ToastItem }) {
  const { id, title, description, tone = "neutral", action } = item;
  const duration = item.duration ?? (tone === "danger" ? 0 : 5000);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (duration <= 0) return;
    timer.current = setTimeout(() => dismiss(id), duration);
    return () => clearTimeout(timer.current);
  }, [id, duration]);

  // Pause while the user is reading or interacting with it.
  const pause = () => clearTimeout(timer.current);
  const resume = () => {
    clearTimeout(timer.current);
    if (duration > 0) timer.current = setTimeout(() => dismiss(id), duration);
  };

  return (
    <li onMouseEnter={pause} onMouseLeave={resume} onFocus={pause} onBlur={resume} className="pointer-events-auto fx-fade-up">
      <Alert
        tone={tone}
        title={title}
        role={tone === "danger" ? "alert" : "none"}
        onDismiss={() => dismiss(id)}
        className="shadow-overlay"
        action={
          action && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                action.onClick();
                dismiss(id);
              }}
            >
              {action.label}
            </Button>
          )
        }
      >
        {description}
      </Alert>
    </li>
  );
}
