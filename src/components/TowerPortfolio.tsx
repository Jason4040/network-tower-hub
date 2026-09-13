import ThemeToggle from "./ThemeToggle";

export default function TowerPortfolio() {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-start justify-between gap-3 px-3 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-7 sm:py-6">
      <div className="pointer-events-auto">
        <p className="font-display text-xs tracking-[0.18em] sm:text-sm">IRUMVA JASON</p>
        <p className="mt-1 flex items-center gap-2 font-mono text-[9px] tracking-[0.12em] text-muted-foreground sm:text-[10px]">
          <span className="pulse-dot h-1.5 w-1.5 bg-accent" /> NETWORKING / CLOUD SECURITY
        </p>
      </div>
      <div className="pointer-events-auto">
        <ThemeToggle />
      </div>
    </div>
  );
}
