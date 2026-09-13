import { Download, ExternalLink, Link2, Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";
import { nodes, type NodeId } from "../data/profile";
import { useContent } from "../lib/content-context";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

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
  const { content } = useContent();
  const { profile, skills, projects, education, credentials, contact, cvUrl } = content;

  if (id === "about") {
    return (
      <>
        <img
          src={profile.photoUrl}
          alt={`${profile.name} portrait`}
          className="mb-5 block h-auto w-full max-w-none bg-transparent object-contain"
        />
        <p className="font-display text-xl tracking-wide">{profile.name}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {profile.role}
          <br />
          {profile.aspiration}
        </p>
        <div className="mt-4 space-y-3">
          {profile.about.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="mt-4">
          <Tags items={profile.directions} />
        </div>
        <div className="mt-5 border-l-2 border-accent pl-3">
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
            <div className="mt-2">
              <Tags items={group.items} />
            </div>
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
    return (
      <div className="space-y-4">
        {projects.map((project) => (
          <article key={project.id} className="border border-border p-4">
            <p className="font-mono text-[10px] text-accent">
              {project.year} / {project.status.toUpperCase()}
            </p>
            <h3 className="mt-1 text-base">{project.title}</h3>
            <p className="mt-2">{project.description}</p>
            <div className="mt-3">
              <Tags items={project.technologies} />
            </div>
          </article>
        ))}
      </div>
    );
  }

  if (id === "education") {
    return (
      <ol className="space-y-5 border-l border-border pl-4">
        {education.map((item) => (
          <li key={item.period + item.title} className="relative">
            <span className={`absolute -left-[19px] top-1 h-2 w-2 ${item.current ? "bg-accent" : "bg-border-strong"}`} />
            <p className="font-mono text-[10px] text-accent">{item.period}</p>
            <h3 className="mt-1 text-sm leading-snug">{item.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {item.institution} / {item.location}
            </p>
          </li>
        ))}
      </ol>
    );
  }

  if (id === "certification") {
    if (credentials.length === 0) {
      return <p>Certifications and achievements will appear here.</p>;
    }
    return (
      <div className="space-y-3">
        {credentials.map((item) => (
          <article key={item.id} className="border border-border p-4">
            <p className="font-mono text-[10px] text-accent">
              {item.code} / {item.kind === "achievement" ? "ACHIEVEMENT" : "CERTIFICATION"}
            </p>
            <h3 className="mt-1 text-lg">{item.name}</h3>
            <p className="mt-2 text-xs">Issued by {item.issuers.join(" and ")}</p>
            {item.issued ? <p className="mt-1 text-xs text-muted-foreground">{item.issued}</p> : null}
            <div className="mt-3 flex flex-wrap gap-2">
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-[10px] tracking-[0.12em] text-accent hover:underline"
                >
                  OPEN LINK <ExternalLink className="size-3" />
                </a>
              ) : null}
              {item.fileUrl ? (
                <a
                  href={item.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-[10px] tracking-[0.12em] text-accent hover:underline"
                >
                  {item.fileName || "VIEW DOCUMENT"} <Download className="size-3" />
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    );
  }

  if (id === "cv") {
    return (
      <div>
        <p>
          {profile.role}
          <br />
          {profile.aspiration}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button
            asChild
            className="h-11 rounded-none bg-accent font-mono text-xs tracking-[0.12em] text-accent-foreground hover:bg-accent-dim"
          >
            <a href={cvUrl} download>
              <Download /> DOWNLOAD CV
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-11 rounded-none border-border-strong bg-background font-mono text-xs tracking-[0.12em] hover:border-accent hover:bg-surface"
          >
            <a href={cvUrl} target="_blank" rel="noreferrer">
              <ExternalLink /> OPEN CV
            </a>
          </Button>
        </div>
      </div>
    );
  }

  const contactRows: Array<{ icon: typeof MapPin; label: string; value: string; href?: string }> = [
    { icon: MapPin, label: "LOCATION", value: contact.location },
    { icon: Phone, label: "PHONE", value: contact.phone, href: contact.phoneHref },
    { icon: Mail, label: "EMAIL", value: contact.email, href: `mailto:${contact.email}` },
    { icon: Link2, label: "LINKEDIN", value: contact.linkedinLabel, href: contact.linkedinUrl },
  ];
  return (
    <div className="space-y-2">
      {contactRows.map(({ icon: Icon, label, value, href }) => (
        <div key={label} className="flex items-center gap-3 border-b border-border py-3">
          <Icon className="size-4 text-accent" aria-hidden="true" />
          <span className="label-tech w-20 shrink-0">{label}</span>
          {href ? (
            <a
              href={href}
              className="break-all hover:text-accent"
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noreferrer" : undefined}
            >
              {value}
            </a>
          ) : (
            <span>{value}</span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function NodeAside({
  id,
  side,
  mode = "live",
  frozenTop,
  arrive = false,
  panelRef,
  onFallEnd,
}: {
  id: NodeId;
  side: "left" | "right";
  mode?: "live" | "fall";
  frozenTop?: number;
  arrive?: boolean;
  panelRef?: (el: HTMLElement | null) => void;
  onFallEnd?: () => void;
}) {
  const node = nodes.find((item) => item.id === id) ?? nodes[0];
  const liveTop = useAnchorTop(id, mode === "live");
  const top = mode === "fall" ? frozenTop : liveTop;

  useEffect(() => {
    if (mode !== "fall") return;
    const timer = window.setTimeout(() => onFallEnd?.(), 850);
    return () => window.clearTimeout(timer);
    // Capture the dismiss callback from mount; parent hover re-renders should not reset the fall.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return (
    <aside
      ref={panelRef}
      data-node-card={mode === "live" ? "live" : "fall"}
      onAnimationEnd={(event) => {
        if (mode !== "fall") return;
        if (event.currentTarget !== event.target) return;
        onFallEnd?.();
      }}
      className={cn(
        "pointer-events-auto fixed flex max-h-[min(78vh,44rem)] w-[min(22rem,calc(42vw-2rem))] flex-col overflow-hidden border border-accent/70 bg-background/92 shadow-2xl backdrop-blur-md",
        "max-md:bottom-3 max-md:left-3 max-md:right-3 max-md:w-auto max-md:max-h-[42vh] max-md:!top-auto",
        "md:bottom-auto",
        top == null && "md:top-24",
        side === "left"
          ? "md:left-4 lg:left-7 md:border-l-4 md:border-l-accent"
          : "md:right-4 lg:right-7 md:border-r-4 md:border-r-accent",
        mode === "fall" ? "node-card-fall pointer-events-none z-[28]" : "z-30",
        mode === "live" && arrive && "node-card-arrive",
      )}
      style={
        {
          ...(top != null ? { top } : null),
          "--fall-rot": side === "left" ? "-12deg" : "12deg",
          "--fall-x": side === "left" ? "-56px" : "56px",
          "--arrive-x": side === "left" ? "-32px" : "32px",
        } as CSSProperties
      }
      aria-live={mode === "live" ? "polite" : "off"}
      aria-hidden={mode === "fall"}
    >
      <div className="flex items-baseline gap-2 border-b border-border px-4 py-3">
        <span className="font-mono text-[10px] text-accent">{node?.code}</span>
        <strong className="font-display text-sm tracking-[0.08em]">{node?.label}</strong>
      </div>
      <div className="overflow-y-auto p-4 text-sm leading-relaxed text-foreground/90">
        <CardContent id={id} />
      </div>
    </aside>
  );
}

function useAnchorTop(id: NodeId, enabled: boolean) {
  const [top, setTop] = useState<number>();

  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    let tries = 0;
    const read = () => {
      const el = document.querySelector<HTMLElement>(`[data-node-label="${id}"]`);
      if (el) {
        const rect = el.getBoundingClientRect();
        const opacity = Number.parseFloat(el.style.opacity || "1");
        if (rect.width > 1 && opacity > 0.05) {
          const header = 88;
          const footer = 56;
          const estimated = Math.min(window.innerHeight * 0.62, 520);
          const maxTop = Math.max(header, window.innerHeight - estimated - footer);
          setTop(Math.max(header, Math.min(rect.top - 18, maxTop)));
          return;
        }
      }
      tries += 1;
      if (tries < 120) raf = requestAnimationFrame(read);
    };
    raf = requestAnimationFrame(read);
    return () => cancelAnimationFrame(raf);
  }, [id, enabled]);

  return top;
}
