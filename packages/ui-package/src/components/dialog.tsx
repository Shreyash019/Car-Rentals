"use client";

import { useId, useState, type ReactNode } from "react";
import {
  Dialog as AriaDialog,
  DialogTrigger,
  Heading,
  Modal,
  ModalOverlay,
} from "react-aria-components";
import { cn } from "../lib/cn";
import { Button } from "./button";
import { XIcon } from "./icons";

type Content = ReactNode | ((opts: { close: () => void }) => ReactNode);

type ModalCommonProps = {
  /** Opens it. Must be a <TriggerButton>. Leave out and use isOpen/onOpenChange to open from code. */
  trigger?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  children?: Content;
  /** Buttons row at the bottom. A function gets { close }. */
  footer?: Content;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  /** Clicking the backdrop closes it. Default true. */
  isDismissable?: boolean;
  /** Hide the × button. */
  hideClose?: boolean;
  closeLabel?: string;
  className?: string;
  classNames?: Partial<
    Record<
      | "overlay"
      | "modal"
      | "header"
      | "title"
      | "description"
      | "body"
      | "footer"
      | "close",
      string
    >
  >;
};

function render(content: Content | undefined, close: () => void) {
  return typeof content === "function" ? content({ close }) : content;
}

function ModalShell({
  trigger,
  title,
  description,
  children,
  footer,
  isOpen,
  defaultOpen,
  onOpenChange,
  isDismissable = true,
  hideClose = false,
  closeLabel = "Close",
  className,
  classNames = {},
  role,
  overlayClassName,
  modalClassName,
}: ModalCommonProps & {
  role?: "dialog" | "alertdialog";
  overlayClassName: string;
  modalClassName: string;
}) {
  const descriptionId = useId();
  const overlay = (
    <ModalOverlay
      isDismissable={isDismissable}
      {...(trigger ? {} : { isOpen, defaultOpen, onOpenChange })}
      className={cn(
        "fixed inset-0 z-50 flex bg-overlay overlay-fade",
        overlayClassName,
        classNames.overlay,
      )}
    >
      <Modal
        className={cn(
          "flex max-h-full outline-none",
          modalClassName,
          className,
          classNames.modal,
        )}
      >
        <AriaDialog
          role={role}
          aria-describedby={description ? descriptionId : undefined}
          className="flex max-h-full w-full flex-col outline-none"
        >
          {({ close }) => (
            <>
              <div
                className={cn(
                  "flex items-start justify-between gap-4 p-gutter pb-0",
                  classNames.header,
                )}
              >
                <div className="grid min-w-0 gap-1">
                  <Heading
                    slot="title"
                    className={cn("font-display text-h4", classNames.title)}
                  >
                    {title}
                  </Heading>
                  {description && (
                    <p
                      id={descriptionId}
                      className={cn(
                        "text-small text-muted-foreground",
                        classNames.description,
                      )}
                    >
                      {description}
                    </p>
                  )}
                </div>
                {!hideClose && (
                  <button
                    type="button"
                    onClick={close}
                    aria-label={closeLabel}
                    className={cn(
                      "-m-1 shrink-0 rounded-control p-1 text-muted-foreground hover:bg-muted hover:text-foreground",
                      classNames.close,
                    )}
                  >
                    <XIcon className="size-5" />
                  </button>
                )}
              </div>
              <div
                className={cn(
                  "min-h-0 flex-1 overflow-y-auto p-gutter",
                  classNames.body,
                )}
              >
                {render(children, close)}
              </div>
              {footer && (
                <div
                  className={cn(
                    "flex flex-wrap justify-end gap-3 border-t border-border px-gutter py-4",
                    classNames.footer,
                  )}
                >
                  {render(footer, close)}
                </div>
              )}
            </>
          )}
        </AriaDialog>
      </Modal>
    </ModalOverlay>
  );

  if (!trigger) return overlay;
  return (
    <DialogTrigger
      isOpen={isOpen}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      {trigger}
      {overlay}
    </DialogTrigger>
  );
}

const DIALOG_SIZE = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
} as const;

export type DialogProps = ModalCommonProps & {
  size?: keyof typeof DIALOG_SIZE;
};

/** Centered modal. Focus is trapped inside; Esc closes it. */
export function Dialog({ size = "md", ...props }: DialogProps) {
  return (
    <ModalShell
      {...props}
      overlayClassName="items-center justify-center p-4"
      modalClassName={cn("overlay-panel overlay-pop w-full", DIALOG_SIZE[size])}
    />
  );
}

export type ConfirmDialogProps = Omit<
  ModalCommonProps,
  "children" | "footer" | "hideClose"
> & {
  children?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** "danger" for destructive actions (red button). */
  tone?: "primary" | "danger";
  /** Can be async: the button shows a spinner until it finishes. If it throws, the dialog stays open. */
  onConfirm: () => void | Promise<void>;
};

/** "Are you sure?" dialog. Backdrop click doesn't close it, so a choice is made on purpose. */
export function ConfirmDialog({
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "primary",
  onConfirm,
  isDismissable = false,
  children,
  ...props
}: ConfirmDialogProps) {
  const [busy, setBusy] = useState(false);

  return (
    <ModalShell
      {...props}
      role="alertdialog"
      isDismissable={isDismissable}
      hideClose
      overlayClassName="items-center justify-center p-4"
      modalClassName={cn("overlay-panel overlay-pop w-full", DIALOG_SIZE.sm)}
      footer={({ close }) => (
        <>
          <Button variant="ghost" onClick={close} disabled={busy}>
            {cancelLabel}
          </Button>
          <Button
            variant={tone}
            loading={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await onConfirm();
                close();
              } catch {
                // Keep the dialog open; show the error from onConfirm (e.g. with toast.error).
              } finally {
                setBusy(false);
              }
            }}
          >
            {confirmLabel}
          </Button>
        </>
      )}
    >
      {children}
    </ModalShell>
  );
}

const DRAWER = {
  right: {
    overlay: "justify-end",
    modal:
      "h-full w-full max-w-md border-s border-border bg-surface text-surface-foreground shadow-overlay overlay-slide-right",
  },
  left: {
    overlay: "justify-start",
    modal:
      "h-full w-full max-w-md border-e border-border bg-surface text-surface-foreground shadow-overlay overlay-slide-left",
  },
  bottom: {
    overlay: "items-end",
    modal:
      "max-h-[85dvh] w-full rounded-t-card border-t border-border bg-surface text-surface-foreground shadow-overlay overlay-slide-bottom",
  },
} as const;

export type DrawerProps = ModalCommonProps & { side?: keyof typeof DRAWER };

/** Panel that slides in from an edge: phone menu, search filters, details. */
export function Drawer({ side = "right", ...props }: DrawerProps) {
  return (
    <ModalShell
      {...props}
      overlayClassName={DRAWER[side].overlay}
      modalClassName={DRAWER[side].modal}
    />
  );
}
