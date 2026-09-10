import { Download, ExternalLink } from "lucide-react";
import { CV_URL, profile } from "../../data/profile";
import { SectionShell, TechPanel } from "../ui-tech/Panel";

export default function CV() {
  return (
    <SectionShell id="cv" code="NODE 06" title="Curriculum Vitae" meta="DOCUMENT">
      <TechPanel className="max-w-[62ch]">
        <p className="label-tech text-accent">CURRICULUM VITAE</p>
        <h3 className="mt-3 font-display text-2xl font-medium">{profile.name}</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {profile.role}
          <br />
          {profile.aspiration}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={CV_URL}
            download
            className="inline-flex min-h-[44px] items-center gap-2 border border-accent bg-accent px-5 font-mono text-[12px] tracking-[0.14em] text-accent-foreground transition-colors hover:bg-transparent hover:text-accent"
          >
            DOWNLOAD CV <Download size={14} />
          </a>
          <a
            href={CV_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 border border-border-strong px-5 font-mono text-[12px] tracking-[0.14em] transition-colors hover:border-accent hover:text-accent"
          >
            OPEN CV <ExternalLink size={14} />
          </a>
        </div>
        <p className="mt-5 font-mono text-[11px] tracking-[0.12em] text-muted-foreground">
          FILE: {CV_URL}
        </p>
      </TechPanel>
    </SectionShell>
  );
}
