import { certifications } from "../../data/certifications";
import { SectionShell, TechPanel } from "../ui-tech/Panel";

export default function Certifications() {
  return (
    <SectionShell id="certification" code="NODE 05" title="Certification" meta="VERIFIED TRAINING">
      <div className="grid gap-4 sm:grid-cols-2">
        {certifications.map((c) => (
          <TechPanel key={c.code}>
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[11px] tracking-wide text-accent">{c.code}</span>
              <h3 className="text-base font-medium">{c.name}</h3>
            </div>
            <p className="label-tech mt-4">ISSUED BY</p>
            <ul className="mt-2 space-y-1 text-sm text-foreground/85">
              {c.issuers.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
            {c.url ? (
              <a href={c.url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm text-accent hover:underline">
                Open link
              </a>
            ) : null}
            {c.fileUrl ? (
              <a href={c.fileUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm text-accent hover:underline">
                {c.fileName || "View document"}
              </a>
            ) : null}
          </TechPanel>
        ))}
      </div>
    </SectionShell>
  );
}
