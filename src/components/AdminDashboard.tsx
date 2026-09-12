import { useMemo, useState } from "react";
import { ArrowLeft, ExternalLink, Plus, Save, Trash2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { certifications as seededCertifications } from "../data/certifications";
import { nodes, profile, type NodeId } from "../data/profile";
import { projects as seededProjects, type Project } from "../data/projects";
import { skills as seededSkills } from "../data/skills";

type Section = "cards" | "projects" | "certifications";

type CardDraft = Record<NodeId, string>;

const cardLabels: Record<NodeId, string> = {
  about: "About",
  skills: "Skills",
  projects: "Projects",
  education: "Education",
  certification: "Certifications",
  cv: "CV",
  contact: "Contact",
};

const initialDrafts: CardDraft = {
  about: profile.about.join("\n\n"),
  skills: seededSkills.map((group) => `${group.category}: ${group.items.join(", ")}`).join("\n"),
  projects: "Project records are managed in the Projects tab.",
  education: "Education records are managed in the public content files.",
  certification: "Certification records are managed in the Certifications tab.",
  cv: `${profile.role}\n${profile.aspiration}`,
  contact: "Contact details are managed in the public content files.",
};

export default function AdminDashboard() {
  const [section, setSection] = useState<Section>("cards");
  const [activeCard, setActiveCard] = useState<NodeId>("about");
  const [drafts, setDrafts] = useState<CardDraft>(initialDrafts);
  const [projects, setProjects] = useState<Project[]>(seededProjects);
  const [certifications, setCertifications] = useState(() => seededCertifications.map((item) => ({ ...item })));
  const [saved, setSaved] = useState(false);

  const activeLabel = useMemo(() => cardLabels[activeCard], [activeCard]);
  const updateDraft = (value: string) => {
    setSaved(false);
    setDrafts((current) => ({ ...current, [activeCard]: value }));
  };
  const addProject = () => {
    setSaved(false);
    setProjects((current) => [...current, {
      id: `project-${current.length + 1}`,
      title: "New project",
      description: "Describe the network, infrastructure, or security work.",
      category: "Network Engineering",
      status: "upcoming",
      technologies: ["Add technology"],
      year: String(new Date().getFullYear()),
    }]);
  };
  const updateProject = (id: string, patch: Partial<Project>) => {
    setSaved(false);
    setProjects((current) => current.map((project) => project.id === id ? { ...project, ...patch } : project));
  };
  const addCertification = () => {
    setSaved(false);
    setCertifications((current) => [...current, { code: `CERT-${current.length + 1}`, name: "New certification", issuers: ["Issuer"] }]);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-surface px-5 py-4 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="label-tech text-accent">IRUMVA JASON / CONTROL ROOM</p>
            <h1 className="mt-1 text-2xl sm:text-3xl">Portfolio editor</h1>
            <p className="mt-1 text-sm text-muted-foreground">Edit the public tower content and review records before publishing.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" className="rounded-none border-border-strong">
              <Link to="/"><ArrowLeft data-icon="inline-start" /> Portfolio</Link>
            </Button>
            <Button variant="default" className="rounded-none bg-accent text-accent-foreground hover:bg-accent-dim" onClick={() => { setSaved(true); }}>
              <Save data-icon="inline-start" /> {saved ? "Saved" : "Save changes"}
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-6 sm:px-8 lg:flex-row">
        <aside className="panel h-fit w-full shrink-0 p-2 lg:w-60">
          <p className="label-tech px-3 py-3">CONTENT SYSTEM</p>
          <nav className="flex gap-1 overflow-x-auto lg:flex-col" aria-label="Dashboard sections">
            {(["cards", "projects", "certifications"] as Section[]).map((item) => (
              <button key={item} type="button" onClick={() => setSection(item)} className={`whitespace-nowrap px-3 py-3 text-left text-sm transition-colors ${section === item ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-surface-raised hover:text-foreground"}`}>
                {item === "cards" ? "Information cards" : item[0].toUpperCase() + item.slice(1)}
              </button>
            ))}
          </nav>
        </aside>

        <section className="min-w-0 flex-1">
          {section === "cards" && (
            <Card className="rounded-none border-border bg-surface shadow-none">
              <CardHeader className="border-b border-border">
                <CardTitle>Information cards</CardTitle>
                <CardDescription>These records are presented beside the matching node in the interactive tower.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 p-5 md:grid-cols-[180px_1fr]">
                <div className="flex gap-1 overflow-x-auto md:flex-col">
                  {nodes.map((node) => <button key={node.id} type="button" onClick={() => setActiveCard(node.id)} className={`border px-3 py-2 text-left text-sm ${activeCard === node.id ? "border-accent bg-accent text-accent-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>{cardLabels[node.id]}</button>)}
                </div>
                <div className="flex flex-col gap-3">
                  <label htmlFor="card-copy" className="label-tech">{activeLabel.toUpperCase()} COPY</label>
                  <textarea id="card-copy" value={drafts[activeCard]} onChange={(event) => updateDraft(event.target.value)} className="min-h-72 w-full resize-y border border-border bg-background p-4 text-sm leading-6 outline-none focus:border-accent" />
                  <p className="text-xs text-muted-foreground">Line breaks are preserved as editable copy. Save changes currently updates this working session.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {section === "projects" && (
            <Card className="rounded-none border-border bg-surface shadow-none">
              <CardHeader className="flex-row items-center justify-between border-b border-border">
                <div><CardTitle>Project records</CardTitle><CardDescription>Manage the work shown inside the PROJECTS card.</CardDescription></div>
                <Button size="sm" variant="outline" className="rounded-none" onClick={addProject}><Plus data-icon="inline-start" /> Add project</Button>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 p-5">
                {projects.length === 0 && <p className="border border-dashed border-border-strong p-8 text-center text-sm text-muted-foreground">No project records yet. Add the first one above.</p>}
                {projects.map((project) => <article key={project.id} className="grid gap-3 border border-border p-4 lg:grid-cols-[1fr_150px_auto]">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input aria-label="Project title" value={project.title} onChange={(event) => updateProject(project.id, { title: event.target.value })} className="border border-border bg-background px-3 py-2 text-sm" />
                    <input aria-label="Project category" value={project.category} onChange={(event) => updateProject(project.id, { category: event.target.value })} className="border border-border bg-background px-3 py-2 text-sm" />
                    <textarea aria-label="Project description" value={project.description} onChange={(event) => updateProject(project.id, { description: event.target.value })} className="min-h-20 border border-border bg-background px-3 py-2 text-sm sm:col-span-2" />
                  </div>
                  <div className="flex flex-col gap-3"><input aria-label="Project year" value={project.year} onChange={(event) => updateProject(project.id, { year: event.target.value })} className="border border-border bg-background px-3 py-2 text-sm" /><select aria-label="Project status" value={project.status} onChange={(event) => updateProject(project.id, { status: event.target.value as Project["status"] })} className="border border-border bg-background px-3 py-2 text-sm"><option value="upcoming">Upcoming</option><option value="completed">Completed</option></select></div>
                  <Button variant="ghost" size="icon" className="rounded-none self-start text-muted-foreground hover:text-accent" aria-label={`Delete ${project.title}`} onClick={() => setProjects((current) => current.filter((item) => item.id !== project.id))}><Trash2 /></Button>
                </article>)}
              </CardContent>
            </Card>
          )}

          {section === "certifications" && (
            <Card className="rounded-none border-border bg-surface shadow-none">
              <CardHeader className="flex-row items-center justify-between border-b border-border"><div><CardTitle>Certification records</CardTitle><CardDescription>Maintain credentials and attach a public document link when available.</CardDescription></div><Button size="sm" variant="outline" className="rounded-none" onClick={addCertification}><Plus data-icon="inline-start" /> Add certification</Button></CardHeader>
              <CardContent className="flex flex-col gap-4 p-5">{certifications.map((certificate, index) => <article key={`${certificate.code}-${index}`} className="grid gap-3 border border-border p-4 md:grid-cols-[140px_1fr_1fr_auto]"><input aria-label="Certification code" value={certificate.code} onChange={(event) => { setSaved(false); setCertifications((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, code: event.target.value } : item)); }} className="border border-border bg-background px-3 py-2 text-sm" /><input aria-label="Certification name" value={certificate.name} onChange={(event) => { setSaved(false); setCertifications((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, name: event.target.value } : item)); }} className="border border-border bg-background px-3 py-2 text-sm" /><input aria-label="Document link" placeholder="https://... document link" className="border border-border bg-background px-3 py-2 text-sm" /><Button asChild variant="ghost" size="icon" className="rounded-none" aria-label="Open certification link"><a href="#document-link"><ExternalLink /></a></Button></article>)}</CardContent>
            </Card>
          )}
        </section>
      </div>
    </main>
  );
}
