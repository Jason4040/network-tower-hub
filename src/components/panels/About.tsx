import { profile } from "../../data/profile";
import { Prose, SectionShell, Tag, TechPanel } from "../ui-tech/Panel";

export default function About() {
  return (
    <SectionShell id="about" code="NODE 01" title="About" meta="PROFILE">
      <Prose>
        {profile.about.map((p) => (
          <p key={p} className="mb-4 last:mb-0">
            {p}
          </p>
        ))}
      </Prose>

      <div className="mt-6 flex flex-wrap gap-2">
        {profile.directions.map((d) => (
          <Tag key={d}>{d}</Tag>
        ))}
      </div>

      <TechPanel className="mt-8 max-w-[70ch]">
        <p className="label-tech text-accent">CAREER OBJECTIVE</p>
        <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-foreground/90">
          {profile.objective}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[12px] tracking-[0.12em] text-muted-foreground">
          <span className="border border-border px-2 py-1">NETWORKING</span>
          <span className="text-accent">+</span>
          <span className="border border-border px-2 py-1">CLOUD</span>
          <span className="text-accent">+</span>
          <span className="border border-border px-2 py-1">SECURITY</span>
          <span className="text-accent">=</span>
          <span className="border border-accent px-2 py-1 text-foreground">
            CLOUD SECURITY ENGINEERING
          </span>
        </div>
      </TechPanel>

      <div className="mt-8 grid gap-px border border-border bg-border sm:grid-cols-2">
        <div className="bg-background p-5">
          <p className="label-tech">LANGUAGES</p>
          <ul className="mt-3 space-y-2">
            {profile.languages.map((l) => (
              <li key={l.name} className="flex items-baseline justify-between gap-4 text-sm">
                <span className="text-foreground/90">{l.name}</span>
                <span className="font-mono text-[11px] tracking-wide text-muted-foreground">
                  {l.level.toUpperCase()}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-background p-5">
          <p className="label-tech">AVAILABLE FOR</p>
          <ul className="mt-3 space-y-2 text-sm text-foreground/90">
            {profile.availability.items.map((i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 bg-accent" aria-hidden="true" />
                {i}
              </li>
            ))}
          </ul>
          <p className="mt-4 max-w-[46ch] text-xs leading-relaxed text-muted-foreground">
            {profile.availability.note}
          </p>
        </div>
      </div>
    </SectionShell>
  );
}
