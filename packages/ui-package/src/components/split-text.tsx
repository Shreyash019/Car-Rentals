import type { CSSProperties, ElementType, HTMLAttributes } from "react";
import { cn } from "../lib/cn";

const EFFECT_CLASS = {
  rise: "fx-letter-rise",
  fade: "fx-letter-fade",
  blur: "fx-letter-blur",
  wave: "fx-letter-wave",
} as const;

export type SplitTextEffect = keyof typeof EFFECT_CLASS;

export type SplitTextProps = Omit<HTMLAttributes<HTMLElement>, "children"> & {
  /** The text to animate. */
  text: string;
  /** rise / fade / blur play once; wave loops. Default "rise". */
  effect?: SplitTextEffect;
  /** Animate each letter or each word. Default "letter". */
  by?: "letter" | "word";
  /** Delay between pieces in ms. Default 35 (letters) / 90 (words). */
  stagger?: number;
  /** Element to render, e.g. "h1". Default "span". */
  as?: ElementType;
};

/**
 * Animates text piece by piece with the fx-letter-* classes.
 * Screen readers get the plain text; words never break in the middle.
 *
 *   <SplitText as="h1" text="Drive away today" effect="rise" />
 */
export function SplitText({
  text,
  effect = "rise",
  by = "letter",
  stagger,
  as: Tag = "span",
  className,
  ...props
}: SplitTextProps) {
  const pieceClass = EFFECT_CLASS[effect];
  const step = `${stagger ?? (by === "word" ? 90 : 35)}ms`;
  let i = 0;

  const style = (): CSSProperties => ({ "--fx-i": i++, "--fx-stagger": step }) as CSSProperties;

  return (
    <Tag className={cn(className)} {...props}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(/(\s+)/).map((part, w) => {
          if (part === "") return null;
          if (/^\s+$/.test(part)) return part;
          if (by === "word") {
            return (
              <span key={w} className={pieceClass} style={style()}>
                {part}
              </span>
            );
          }
          return (
            <span key={w} className="inline-block whitespace-nowrap">
              {Array.from(part).map((ch, c) => (
                <span key={c} className={pieceClass} style={style()}>
                  {ch}
                </span>
              ))}
            </span>
          );
        })}
      </span>
    </Tag>
  );
}
