import { useMemo, useState } from "react";
import { ExternalLink, FileText, Github } from "lucide-react";
import { projects, type Project } from "../../data/projects";
import { SectionShell, Tag, TechPanel } from "../ui-tech/Panel";

function ProjectCard({ project }: { project: Project }) {
  return (
    <TechPanel active={project.featured}>
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[11px] tracking-wide text-accent">{project.year}</span>
        <h3 className="text-base font-medium">{project.title}</h3>
        <span className="label-tech ml-auto">{project.status.toUpperCase()}</span>
      </div>
      {project.image ? (
        <img
          src={project.image}
          alt={`Preview of ${project.title}`}
          loading="lazy"
          className="mt-4 w-full border border-border object-cover"
        />
      ) : null}
      <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-muted-foreground">
        {project.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.technologies.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-4 font-mono text-[11px] tracking-[0.12em]">
        {project.github ? (
          <a className="flex items-center gap-1.5 text-muted-foreground hover:text-accent" href={project.github}>
            <Github size={13} /> CODE
          </a>
        ) : null}
        {project.live ? (
          <a className="flex items-center gap-1.5 text-muted-foreground hover:text-accent" href={project.live}>
            <ExternalLink size={13} /> LIVE
          </a>
        ) : null}
        {project.docs ? (
          <a className="flex items-center gap-1.5 text-muted-foreground hover:text-accent" href={project.docs}>
            <FileText size={13} /> DOCS
          </a>
        ) : null}
      </div>
    </TechPanel>
  );
}

export default function Projects() {
  const [tab, setTab] = useState<"completed" | "upcoming">("completed");
  const list = useMemo(() => projects.filter((p) => p.status === tab), [tab]);
  const counts = useMemo(
    () => ({
      completed: projects.filter((p) => p.status === "completed").length,
      upcoming: projects.filter((p) => p.status === "upcoming").length,
    }),
    [],
  );

  return (
    <SectionShell id="projects" code="NODE 03" title="Projects" meta="LAB RECORDS">
      <div role="tablist" aria-label="Project categories" className="flex gap-px border border-border bg-border">
        {(["completed", "upcoming"] as const).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            type="button"
            onClick={() => setTab(t)}
            className={`min-h-[44px] flex-1 bg-background px-4 font-mono text-[11px] tracking-[0.14em] transition-colors ${
              tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className={tab === t ? "border-b border-accent pb-1" : ""}>
              {t.toUpperCase()} PROJECTS ({counts[t]})
            </span>
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4">
        {list.length === 0 ? (
          <TechPanel>
            <p className="label-tech text-accent">NO RECORDS</p>
            <p className="mt-3 max-w-[58ch] text-sm leading-relaxed text-muted-foreground">
              {tab === "completed"
                ? "No completed projects have been published yet. Networking lab work and configuration projects will be documented here as they are finished."
                : "No upcoming projects are listed yet. Planned lab builds and network design work will appear here."}
            </p>
            <p className="mt-4 font-mono text-[11px] tracking-[0.12em] text-muted-foreground">
              SOURCE: src/data/projects.ts
            </p>
          </TechPanel>
        ) : (
          list.map((p) => <ProjectCard key={p.id} project={p} />)
        )}
      </div>
    </SectionShell>
  );
}
