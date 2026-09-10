import type { ReactNode } from "react";

export function SectionShell({
  id,
  code,
  title,
  children,
  meta,
}: {
  id: string;
  code: string;
  title: string;
  meta?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      data-node={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-24 border-l border-border bg-background/92 py-14 pl-5 backdrop-blur-[2px] sm:pl-8"
    >
      <div className="mb-6 flex items-baseline gap-3">
        <span className="label-tech text-accent">{code}</span>
        <span className="h-px w-6 bg-border-strong" aria-hidden="true" />
        <h2 id={`${id}-title`} className="text-xl font-medium tracking-tight sm:text-2xl">
          {title}
        </h2>
        {meta ? <span className="label-tech ml-auto hidden sm:inline">{meta}</span> : null}
      </div>
      {children}
    </section>
  );
}

export function TechPanel({
  children,
  className = "",
  active,
}: {
  children: ReactNode;
  className?: string;
  active?: boolean;
}) {
  return (
    <div
      className={`panel relative p-5 ${active ? "border-accent" : ""} ${className}`}
      style={{ background: "rgba(20,19,18,0.86)" }}
    >
      {children}
    </div>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="border border-border px-2 py-1 font-mono text-[11px] tracking-wide text-muted-foreground">
      {children}
    </span>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return <div className="max-w-[64ch] text-[15px] leading-relaxed text-muted-foreground">{children}</div>;
}
