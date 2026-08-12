import type { ReactNode } from "react";

export function SectionHeading({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-12 max-w-3xl">
      <p className="mb-4 font-mono text-xs tracking-[0.3em] text-primary uppercase">
        {index} — {title}
      </p>
      {children && (
        <h2 className="text-display text-4xl text-balance sm:text-5xl">
          {children}
        </h2>
      )}
    </div>
  );
}
