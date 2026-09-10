import { useState } from "react";
import { Menu, X } from "lucide-react";
import { nodes, type NodeId } from "../data/profile";

export default function Navigation({
  active,
  onNavigate,
}: {
  active: NodeId | null;
  onNavigate: (id: NodeId) => void;
}) {
  const [open, setOpen] = useState(false);

  const links = nodes.filter((n) => n.id !== "certification");

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-[1500px] items-center gap-4 px-4 py-3 sm:px-6">
        <a href="#top" className="flex items-baseline gap-3">
          <span className="font-display text-sm tracking-[0.18em]">JASON</span>
          <span className="label-tech flex items-center gap-1.5">
            <span className="pulse-dot inline-block h-1.5 w-1.5 bg-accent" aria-hidden="true" />
            STATUS: ONLINE
          </span>
        </a>

        <nav aria-label="Sections" className="ml-auto hidden items-center gap-1 lg:flex">
          {links.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => onNavigate(n.id)}
              aria-current={active === n.id ? "true" : undefined}
              className={`border px-3 py-1.5 font-mono text-[11px] tracking-[0.12em] transition-colors ${
                active === n.id
                  ? "border-accent text-foreground"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
              }`}
            >
              {n.label}
            </button>
          ))}
        </nav>

        <button
          type="button"
          className="ml-auto flex h-11 w-11 items-center justify-center border border-border lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Sections"
          className="border-t border-border bg-background lg:hidden"
        >
          {nodes.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => {
                setOpen(false);
                onNavigate(n.id);
              }}
              className="flex min-h-[48px] w-full items-center gap-3 border-b border-border px-5 text-left font-mono text-xs tracking-[0.14em] text-muted-foreground"
            >
              <span className="text-accent">{n.code}</span>
              <span className={active === n.id ? "text-foreground" : ""}>{n.label}</span>
            </button>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
