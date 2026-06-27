import { useEffect, useRef, useState, type ReactNode, type CSSProperties, type ElementType } from "react";

type Variant = "up" | "left" | "pop";

export function Reveal({
  children,
  variant = "up",
  delay = 0,
  className = "",
  as: As = "div",
}: {
  children: ReactNode;
  variant?: Variant;
  delay?: number;
  className?: string;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { setVisible(true); return; }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const base = variant === "left" ? "reveal-left" : variant === "pop" ? "reveal-pop" : "reveal";
  const style: CSSProperties = { transitionDelay: visible ? `${delay}ms` : "0ms" };
  // @ts-expect-error - polymorphic ref
  return <As ref={ref} style={style} className={`${base} ${visible ? "is-visible" : ""} ${className}`}>{children}</As>;
}
