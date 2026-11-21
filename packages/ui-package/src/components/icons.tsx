import type { ReactNode, SVGProps } from "react";
import { cn } from "../lib/cn";

export type IconProps = SVGProps<SVGSVGElement> & {
  /** Accessible name. Leave it out for decorative icons (hidden from screen readers). */
  label?: string;
};

function createIcon(name: string, paths: ReactNode) {
  function Icon({ label, className, strokeWidth = 2, ...props }: IconProps) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        role={label ? "img" : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : true}
        focusable="false"
        className={cn("size-4 shrink-0", className)}
        {...props}
      >
        {paths}
      </svg>
    );
  }
  Icon.displayName = name;
  return Icon;
}

export const ChevronDownIcon = createIcon("ChevronDownIcon", <path d="m6 9 6 6 6-6" />);
export const ChevronUpIcon = createIcon("ChevronUpIcon", <path d="m18 15-6-6-6 6" />);
export const ChevronLeftIcon = createIcon("ChevronLeftIcon", <path d="m15 18-6-6 6-6" />);
export const ChevronRightIcon = createIcon("ChevronRightIcon", <path d="m9 18 6-6-6-6" />);
export const CheckIcon = createIcon("CheckIcon", <path d="M20 6 9 17l-5-5" />);
export const XIcon = createIcon("XIcon", <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>);
export const PlusIcon = createIcon("PlusIcon", <><path d="M5 12h14" /><path d="M12 5v14" /></>);
export const MinusIcon = createIcon("MinusIcon", <path d="M5 12h14" />);
export const SearchIcon = createIcon("SearchIcon", <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>);
export const InfoIcon = createIcon(
  "InfoIcon",
  <><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></>,
);
export const AlertTriangleIcon = createIcon(
  "AlertTriangleIcon",
  <>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </>,
);
export const CheckCircleIcon = createIcon(
  "CheckCircleIcon",
  <><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></>,
);
export const XCircleIcon = createIcon(
  "XCircleIcon",
  <><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></>,
);
export const StarIcon = createIcon(
  "StarIcon",
  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
);
export const SunIcon = createIcon(
  "SunIcon",
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
  </>,
);
export const MoonIcon = createIcon("MoonIcon", <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />);
export const MonitorIcon = createIcon(
  "MonitorIcon",
  <><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8" /><path d="M12 17v4" /></>,
);
export const UploadIcon = createIcon(
  "UploadIcon",
  <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m17 8-5-5-5 5" /><path d="M12 3v12" /></>,
);
export const FileIcon = createIcon(
  "FileIcon",
  <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></>,
);
export const CalendarIcon = createIcon(
  "CalendarIcon",
  <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" /></>,
);
export const MoreHorizontalIcon = createIcon(
  "MoreHorizontalIcon",
  <><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>,
);
export const MenuIcon = createIcon("MenuIcon", <><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /></>);
export const InboxIcon = createIcon(
  "InboxIcon",
  <>
    <path d="M22 12h-6l-2 3h-4l-2-3H2" />
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </>,
);
export const PhoneIcon = createIcon(
  "PhoneIcon",
  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.14 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.84.58 2.8.7A2 2 0 0 1 22 16.92z" />,
);