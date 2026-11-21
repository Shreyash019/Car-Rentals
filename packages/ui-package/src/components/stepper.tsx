import type { ReactNode } from "react";
import { cn } from "../lib/cn";
import { CheckIcon } from "./icons";

export type Step = { title: ReactNode; description?: ReactNode };

const CIRCLE = {
  complete: "border-primary bg-primary text-primary-foreground",
  current: "border-primary bg-surface text-link",
  upcoming: "border-border bg-surface text-muted-foreground",
} as const;

const STATUS_TEXT = { complete: "Completed", current: "Current step", upcoming: "Not started" } as const;

export type StepperProps = {
  steps: Step[];
  /** Index of the current step (0-based). steps.length = all done. */
  current: number;
  /** Use "vertical" on narrow screens or for long descriptions. */
  orientation?: "horizontal" | "vertical";
  className?: string;
  classNames?: Partial<Record<"root" | "step" | "circle" | "title" | "description" | "connector", string>>;
};

/** Progress through a multi-step flow (onboarding, booking). */
export function Stepper({ steps, current, orientation = "horizontal", className, classNames = {} }: StepperProps) {
  const horizontal = orientation === "horizontal";

  return (
    <ol className={cn(horizontal ? "flex w-full items-start" : "flex flex-col", className, classNames.root)}>
      {steps.map((step, i) => {
        const status = i < current ? "complete" : i === current ? "current" : "upcoming";
        return (
          <li
            key={i}
            aria-current={status === "current" ? "step" : undefined}
            className={cn(
              "relative flex",
              horizontal ? "flex-1 flex-col items-center text-center" : "gap-4 pb-8 last:pb-0",
              classNames.step,
            )}
          >
            {i < steps.length - 1 && (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute",
                  horizontal
                    ? "top-4 right-[calc(-50%+1.25rem)] left-[calc(50%+1.25rem)] h-0.5 -translate-y-1/2"
                    : "top-10 bottom-1 left-4 w-0.5 -translate-x-1/2",
                  i < current ? "bg-primary" : "bg-border",
                  classNames.connector,
                )}
              />
            )}
            <span
              className={cn(
                "relative grid size-8 shrink-0 place-items-center rounded-full border-2 text-small font-semibold",
                CIRCLE[status],
                classNames.circle,
              )}
            >
              {status === "complete" ? <CheckIcon /> : i + 1}
            </span>
            <div className={horizontal ? "mt-2 px-2" : "pt-1"}>
              <p className={cn("text-small font-medium", status === "upcoming" && "text-muted-foreground", classNames.title)}>
                {step.title}
                <span className="sr-only"> ({STATUS_TEXT[status]})</span>
              </p>
              {step.description && (
                <p className={cn("text-caption text-muted-foreground", classNames.description)}>{step.description}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
