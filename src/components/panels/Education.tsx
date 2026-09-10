import { education } from "../../data/education";
import { profile } from "../../data/profile";
import { SectionShell } from "../ui-tech/Panel";

export default function Education() {
  return (
    <SectionShell id="education" code="NODE 04" title="Education" meta="TIMELINE">
      <ol className="relative border-l border-border pl-6">
        {education.map((e) => (
          <li key={e.period + e.title} className="relative pb-10 last:pb-0">
            <span
              className={`absolute -left-[27px] top-1.5 h-2 w-2 ${e.current ? "bg-accent" : "bg-border-strong"}`}
              aria-hidden="true"
            />
            <p className="font-mono text-[11px] tracking-[0.12em] text-accent">{e.period}</p>
            <h3 className="mt-2 max-w-[52ch] text-base font-medium leading-snug">{e.title}</h3>
            <p className="mt-1 text-sm text-foreground/80">{e.institution}</p>
            <p className="label-tech mt-1">{e.location}</p>
            {e.details.length > 0 ? (
              <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                {e.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ol>

      <div className="mt-10">
        <p className="label-tech">KEY COURSEWORK</p>
        <div className="mt-4 grid gap-px border border-border bg-border sm:grid-cols-2">
          {profile.coursework.map((c, i) => (
            <div key={c} className="flex items-baseline gap-3 bg-background p-4">
              <span className="font-mono text-[11px] text-accent">
                M{String(i + 1).padStart(2, "0")}
              </span>
              <span className="max-w-[38ch] text-sm text-foreground/90">{c}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-px border border-border bg-border sm:grid-cols-2">
        <div className="bg-background p-5">
          <p className="label-tech">ACTIVITIES</p>
          <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
            {profile.extracurricular.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        <div className="bg-background p-5">
          <p className="label-tech">INTERESTS</p>
          <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
            {profile.interests.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </div>
    </SectionShell>
  );
}
