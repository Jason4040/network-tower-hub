import { ArrowDown, Download } from "lucide-react";
import { CV_URL, profile } from "../data/profile";

export default function Hero({ onProjects }: { onProjects: () => void }) {
  return (
    <section id="top" aria-labelledby="hero-title" className="pt-24 pb-20 lg:pt-28 lg:pb-32">
      <p className="label-tech">NETWORK / INFRASTRUCTURE / SECURITY</p>
      <h1
        id="hero-title"
        className="mt-4 font-display text-[2.6rem] leading-[1.05] font-medium tracking-tight sm:text-6xl"
      >
        Irumva Jason
      </h1>
      <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-foreground/85">
        {profile.role}
        <span className="mx-2 text-border-strong">/</span>
        <span className="text-accent">{profile.aspiration}</span>
      </p>
      <p className="mt-3 max-w-[58ch] text-sm leading-relaxed text-muted-foreground">
        {profile.statement}
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onProjects}
          className="inline-flex min-h-[44px] items-center gap-2 border border-accent bg-accent px-5 font-mono text-[12px] tracking-[0.14em] text-accent-foreground transition-colors hover:bg-transparent hover:text-accent"
        >
          VIEW PROJECTS <ArrowDown size={14} />
        </button>
        <a
          href={CV_URL}
          download
          className="inline-flex min-h-[44px] items-center gap-2 border border-border-strong px-5 font-mono text-[12px] tracking-[0.14em] text-foreground transition-colors hover:border-accent hover:text-accent"
        >
          DOWNLOAD CV <Download size={14} />
        </a>
      </div>

      <dl className="mt-12 grid max-w-md grid-cols-2 gap-px border border-border bg-border">
        {[
          ["SYSTEM", "NETWORKING"],
          ["STATUS", profile.status],
          ["FOCUS", "CLOUD SECURITY"],
          ["LOCATION", "KIGALI, RWANDA"],
        ].map(([k, v]) => (
          <div key={k} className="bg-background px-4 py-3">
            <dt className="label-tech">{k}</dt>
            <dd className="mt-1 font-mono text-[13px] tracking-wide text-foreground">
              {k === "STATUS" ? (
                <span className="flex items-center gap-2">
                  <span className="pulse-dot inline-block h-1.5 w-1.5 bg-accent" aria-hidden="true" />
                  {v}
                </span>
              ) : (
                v
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
