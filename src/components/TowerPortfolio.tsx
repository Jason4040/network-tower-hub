import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Button } from "./ui/button";
import { certifications } from "../data/certifications";
import { contact } from "../data/contact";
import { education } from "../data/education";
import { CV_URL, nodes, profile, type NodeId } from "../data/profile";
import { projects } from "../data/projects";
import { skills } from "../data/skills";

type TowerPortfolioProps = {
  active: NodeId;
  onSelect: (id: NodeId) => void;
};

function Tags({ items }: { items: readonly string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className="border border-border px-2 py-1 font-mono text-[10px] text-muted-foreground">
          {item}
        </span>
      ))}
    </div>
  );
}

export function CardContent({ id }: { id: NodeId }) {
  if (id === "about") {
    return (
      <>
        {profile.about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <Tags items={profile.directions} />
        <div className="border-l-2 border-accent pl-3">
          <p className="label-tech text-accent">CAREER OBJECTIVE</p>
          <p className="mt-2">{profile.objective}</p>
        </div>
      </>
    );
  }

  if (id === "skills") {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {skills.map((group) => (
          <div key={group.code}>
            <p className="font-mono text-[10px] text-accent">{group.code}</p>
            <h3 className="mt-1 text-sm">{group.category}</h3>
            <div className="mt-2"><Tags items={group.items} /></div>
          </div>
        ))}
      </div>
    );
  }

  if (id === "projects") {
    if (projects.length === 0) {
      return (
        <div className="border border-border p-4">
          <p className="label-tech text-accent">LAB RECORDS</p>
          <p className="mt-3">Networking lab work and configuration projects will appear here after completion.</p>
        </div>
      );
    }
    return <div className="space-y-4">{projects.map((project) => (
      <article key={project.id} className="border border-border p-4">
        <p className="font-mono text-[10px] text-accent">{project.year} / {project.status.toUpperCase()}</p>
        <h3 className="mt-1 text-base">{project.title}</h3>
        <p className="mt-2">{project.description}</p>
        <div className="mt-3"><Tags items={project.technologies} /></div>
      </article>
    ))}</div>;
  }

  if (id === "education") {
    return (
      <ol className="space-y-5 border-l border-border pl-4">
        {education.map((item) => (
          <li key={item.period + item.title} className="relative">
            <span className={`absolute -left-[19px] top-1 h-2 w-2 ${item.current ? "bg-accent" : "bg-border-strong"}`} />
            <p className="font-mono text-[10px] text-accent">{item.period}</p>
            <h3 className="mt-1 text-sm leading-snug">{item.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{item.institution} / {item.location}</p>
          </li>
        ))}
      </ol>
    );
  }

  if (id === "certification") {
    return <div className="space-y-3">{certifications.map((certificate) => (
      <article key={certificate.code} className="border border-border p-4">
        <p className="font-mono text-[10px] text-accent">{certificate.code}</p>
        <h3 className="mt-1 text-lg">{certificate.name}</h3>
        <p className="mt-2 text-xs">Issued by {certificate.issuers.join(" and ")}</p>
      </article>
    ))}</div>;
  }

  if (id === "cv") {
    return (
      <div>
        <p>{profile.role}<br />{profile.aspiration}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button asChild className="h-11 rounded-none bg-accent font-mono text-xs tracking-[0.12em] text-accent-foreground hover:bg-accent-dim">
            <a href={CV_URL} download><Download /> DOWNLOAD CV</a>
          </Button>
          <Button asChild variant="outline" className="h-11 rounded-none border-border-strong bg-background font-mono text-xs tracking-[0.12em] hover:border-accent hover:bg-surface">
            <a href={CV_URL} target="_blank" rel="noreferrer"><ExternalLink /> OPEN CV</a>
          </Button>
        </div>
      </div>
    );
  }

  const contactRows: Array<{ icon: typeof MapPin; label: string; value: string; href?: string }> = [
    { icon: MapPin, label: "LOCATION", value: contact.location },
    { icon: Phone, label: "PHONE", value: contact.phone, href: contact.phoneHref },
    { icon: Mail, label: "EMAIL", value: contact.email, href: `mailto:${contact.email}` },
  ];
  return <div className="space-y-2">{contactRows.map(({ icon: Icon, label, value, href }) => (
    <div key={label} className="flex items-center gap-3 border-b border-border py-3">
      <Icon className="size-4 text-accent" aria-hidden="true" />
      <span className="label-tech w-20 shrink-0">{label}</span>
      {href ? <a href={href} className="break-all hover:text-accent">{value}</a> : <span>{value}</span>}
    </div>
  ))}</div>;
}

export default function TowerPortfolio({ active, onSelect }: TowerPortfolioProps) {
  const activeIndex = nodes.findIndex((node) => node.id === active);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      const next = nodes[(activeIndex + 1) % nodes.length];
      if (next) onSelect(next.id);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [activeIndex, onSelect, paused]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      const step = event.key === "ArrowRight" ? 1 : -1;
      const next = nodes[(activeIndex + step + nodes.length) % nodes.length];
      if (next) onSelect(next.id);
      setPaused(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, onSelect]);

  const move = (step: number) => {
    const next = nodes[(activeIndex + step + nodes.length) % nodes.length];
    if (next) onSelect(next.id);
    setPaused(true);
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-20" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
      <div className="absolute left-4 top-4 pointer-events-auto sm:left-7 sm:top-6">
        <p className="font-display text-sm tracking-[0.18em]">IRUMVA JASON</p>
        <p className="mt-1 flex items-center gap-2 font-mono text-[10px] tracking-[0.12em] text-muted-foreground">
          <span className="pulse-dot h-1.5 w-1.5 bg-accent" /> NETWORKING / CLOUD SECURITY
        </p>
      </div>

      <div className="pointer-events-auto absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
        <Button variant="outline" size="icon" className="size-11 rounded-none border-border-strong bg-background/90" onClick={() => move(-1)} aria-label="Previous portfolio card"><ArrowLeft /></Button>
        <div className="flex gap-1 px-2" aria-hidden="true">{nodes.map((node) => <span key={node.id} className={`h-1 w-4 ${node.id === active ? "bg-accent" : "bg-border-strong"}`} />)}</div>
        <Button variant="outline" size="icon" className="size-11 rounded-none border-border-strong bg-background/90" onClick={() => move(1)} aria-label="Next portfolio card"><ArrowRight /></Button>
      </div>
    </div>
  );
}
