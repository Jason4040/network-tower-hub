import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useContent } from "../../lib/content-context";
import {
  cloneContent,
  defaultContent,
  fileToDataUrl,
  type Credential,
  type EducationItem,
  type SiteContent,
  type SkillGroup,
} from "../../lib/content";
import { type Project } from "../../data/projects";
import { endAdminSession, setAdminPassword } from "../../lib/admin-auth";
import { toast } from "sonner";

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="label-tech">{label}</span>
      {children}
    </label>
  );
}

function splitLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function AdminDashboard() {
  const { content, setContent, saveContent, resetContent } = useContent();
  const [draft, setDraft] = useState<SiteContent>(() => cloneContent(content));
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    setDraft(cloneContent(content));
  }, [content]);

  const update = (patch: (current: SiteContent) => SiteContent) => {
    setDraft((current) => patch(cloneContent(current)));
  };

  const persist = () => {
    setContent(draft);
    saveContent(draft);
    toast.success("Portfolio content saved");
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "portfolio.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const importJson = async (file: File) => {
    const text = await file.text();
    const parsed = JSON.parse(text) as SiteContent;
    setDraft(parsed);
    toast.success("Imported JSON into the editor");
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8 text-foreground">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <p className="label-tech text-accent">ADMIN</p>
            <h1 className="font-display text-2xl">Portfolio dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Update every tower card. Visitors do not see this page.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" className="rounded-none">
              <Link to="/">View site</Link>
            </Button>
            <Button
              variant="outline"
              className="rounded-none"
              onClick={() => {
                endAdminSession();
                window.location.href = "/admin";
              }}
            >
              Log out
            </Button>
          </div>
        </header>

        <div className="flex flex-wrap gap-2">
          <Button className="rounded-none bg-accent text-accent-foreground hover:bg-accent-dim" onClick={persist}>
            Save changes
          </Button>
          <Button variant="outline" className="rounded-none" onClick={exportJson}>
            Export JSON
          </Button>
          <Label className="inline-flex h-9 cursor-pointer items-center border border-border px-3 font-mono text-xs tracking-[0.12em]">
            Import JSON
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void importJson(file);
              }}
            />
          </Label>
          <Button
            variant="outline"
            className="rounded-none"
            onClick={() => {
              resetContent();
              setDraft(defaultContent());
              toast.message("Reset to built-in content");
            }}
          >
            Reset
          </Button>
        </div>

        <Tabs defaultValue="about">
          <TabsList className="flex h-auto flex-wrap rounded-none">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="certs">Certifications</TabsTrigger>
            <TabsTrigger value="cv">CV / Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-4 pt-4">
            <Field label="Name">
              <Input
                className="rounded-none"
                value={draft.profile.name}
                onChange={(event) =>
                  update((current) => {
                    current.profile.name = event.target.value;
                    return current;
                  })
                }
              />
            </Field>
            <Field label="Role">
              <Input
                className="rounded-none"
                value={draft.profile.role}
                onChange={(event) =>
                  update((current) => {
                    current.profile.role = event.target.value;
                    return current;
                  })
                }
              />
            </Field>
            <Field label="Aspiration">
              <Input
                className="rounded-none"
                value={draft.profile.aspiration}
                onChange={(event) =>
                  update((current) => {
                    current.profile.aspiration = event.target.value;
                    return current;
                  })
                }
              />
            </Field>
            <Field label="About paragraphs (one per line)">
              <Textarea
                className="min-h-32 rounded-none"
                value={draft.profile.about.join("\n")}
                onChange={(event) =>
                  update((current) => {
                    current.profile.about = splitLines(event.target.value);
                    return current;
                  })
                }
              />
            </Field>
            <Field label="Directions (comma separated)">
              <Input
                className="rounded-none"
                value={draft.profile.directions.join(", ")}
                onChange={(event) =>
                  update((current) => {
                    current.profile.directions = splitList(event.target.value);
                    return current;
                  })
                }
              />
            </Field>
            <Field label="Career objective">
              <Textarea
                className="min-h-24 rounded-none"
                value={draft.profile.objective}
                onChange={(event) =>
                  update((current) => {
                    current.profile.objective = event.target.value;
                    return current;
                  })
                }
              />
            </Field>
            <Field label="Profile photo">
              <Input
                type="file"
                accept="image/*"
                className="rounded-none"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  const url = await fileToDataUrl(file);
                  update((current) => {
                    current.profile.photoUrl = url;
                    return current;
                  });
                }}
              />
            </Field>
            <img src={draft.profile.photoUrl} alt="Profile preview" className="max-h-64 w-auto object-contain" />
          </TabsContent>

          <TabsContent value="skills" className="space-y-4 pt-4">
            {draft.skills.map((group, index) => (
              <div key={group.code + index} className="grid gap-2 border border-border p-3">
                <Input
                  className="rounded-none"
                  value={group.category}
                  onChange={(event) =>
                    update((current) => {
                      const next = current.skills[index];
                      if (next) next.category = event.target.value;
                      return current;
                    })
                  }
                />
                <Input
                  className="rounded-none"
                  value={group.items.join(", ")}
                  onChange={(event) =>
                    update((current) => {
                      const next = current.skills[index];
                      if (next) next.items = splitList(event.target.value);
                      return current;
                    })
                  }
                />
                <Button
                  variant="outline"
                  className="w-fit rounded-none"
                  onClick={() =>
                    update((current) => {
                      current.skills.splice(index, 1);
                      return current;
                    })
                  }
                >
                  Remove group
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              className="rounded-none"
              onClick={() =>
                update((current) => {
                  const next: SkillGroup = {
                    code: `SKL-${String(current.skills.length + 1).padStart(2, "0")}`,
                    category: "New skill group",
                    items: [],
                  };
                  current.skills.push(next);
                  return current;
                })
              }
            >
              Add skill group
            </Button>
          </TabsContent>

          <TabsContent value="projects" className="space-y-4 pt-4">
            {draft.projects.map((project, index) => (
              <div key={project.id} className="grid gap-2 border border-border p-3">
                <Input
                  className="rounded-none"
                  value={project.title}
                  onChange={(event) =>
                    update((current) => {
                      const next = current.projects[index];
                      if (next) next.title = event.target.value;
                      return current;
                    })
                  }
                />
                <Textarea
                  className="rounded-none"
                  value={project.description}
                  onChange={(event) =>
                    update((current) => {
                      const next = current.projects[index];
                      if (next) next.description = event.target.value;
                      return current;
                    })
                  }
                />
                <Input
                  className="rounded-none"
                  value={project.technologies.join(", ")}
                  onChange={(event) =>
                    update((current) => {
                      const next = current.projects[index];
                      if (next) next.technologies = splitList(event.target.value);
                      return current;
                    })
                  }
                />
                <Input
                  className="rounded-none"
                  value={project.year}
                  onChange={(event) =>
                    update((current) => {
                      const next = current.projects[index];
                      if (next) next.year = event.target.value;
                      return current;
                    })
                  }
                />
                <Button
                  variant="outline"
                  className="w-fit rounded-none"
                  onClick={() =>
                    update((current) => {
                      current.projects.splice(index, 1);
                      return current;
                    })
                  }
                >
                  Remove project
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              className="rounded-none"
              onClick={() =>
                update((current) => {
                  const next: Project = {
                    id: crypto.randomUUID(),
                    title: "New project",
                    description: "",
                    category: "Networking",
                    status: "upcoming",
                    technologies: [],
                    year: String(new Date().getFullYear()),
                  };
                  current.projects.push(next);
                  return current;
                })
              }
            >
              Add project
            </Button>
          </TabsContent>

          <TabsContent value="education" className="space-y-4 pt-4">
            {draft.education.map((item, index) => (
              <div key={item.title + index} className="grid gap-2 border border-border p-3">
                <Input
                  className="rounded-none"
                  value={item.period}
                  onChange={(event) =>
                    update((current) => {
                      const next = current.education[index];
                      if (next) next.period = event.target.value;
                      return current;
                    })
                  }
                />
                <Input
                  className="rounded-none"
                  value={item.title}
                  onChange={(event) =>
                    update((current) => {
                      const next = current.education[index];
                      if (next) next.title = event.target.value;
                      return current;
                    })
                  }
                />
                <Input
                  className="rounded-none"
                  value={item.institution}
                  onChange={(event) =>
                    update((current) => {
                      const next = current.education[index];
                      if (next) next.institution = event.target.value;
                      return current;
                    })
                  }
                />
                <Input
                  className="rounded-none"
                  value={item.location}
                  onChange={(event) =>
                    update((current) => {
                      const next = current.education[index];
                      if (next) next.location = event.target.value;
                      return current;
                    })
                  }
                />
                <Button
                  variant="outline"
                  className="w-fit rounded-none"
                  onClick={() =>
                    update((current) => {
                      current.education.splice(index, 1);
                      return current;
                    })
                  }
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              className="rounded-none"
              onClick={() =>
                update((current) => {
                  const next: EducationItem = {
                    period: "",
                    title: "New education item",
                    institution: "",
                    location: "",
                    details: [],
                    current: false,
                  };
                  current.education.push(next);
                  return current;
                })
              }
            >
              Add education
            </Button>
          </TabsContent>

          <TabsContent value="certs" className="space-y-4 pt-4">
            <p className="text-sm text-muted-foreground">
              Upload certification documents or add achievement links. They appear on the Certification node.
            </p>
            {draft.credentials.map((item, index) => (
              <div key={item.id} className="grid gap-2 border border-border p-3">
                <Input
                  className="rounded-none"
                  value={item.name}
                  onChange={(event) =>
                    update((current) => {
                      const next = current.credentials[index];
                      if (next) next.name = event.target.value;
                      return current;
                    })
                  }
                />
                <Input
                  className="rounded-none"
                  value={item.issuers.join(", ")}
                  onChange={(event) =>
                    update((current) => {
                      const next = current.credentials[index];
                      if (next) next.issuers = splitList(event.target.value);
                      return current;
                    })
                  }
                />
                <Input
                  className="rounded-none"
                  placeholder="https:// link"
                  value={item.url ?? ""}
                  onChange={(event) =>
                    update((current) => {
                      const next = current.credentials[index];
                      if (next) next.url = event.target.value;
                      return current;
                    })
                  }
                />
                <select
                  className="h-9 border border-border bg-background px-2 text-sm"
                  value={item.kind}
                  onChange={(event) =>
                    update((current) => {
                      const next = current.credentials[index];
                      if (next) next.kind = event.target.value as Credential["kind"];
                      return current;
                    })
                  }
                >
                  <option value="certification">Certification</option>
                  <option value="achievement">Achievement</option>
                </select>
                <Input
                  type="file"
                  accept=".pdf,image/*,.doc,.docx"
                  className="rounded-none"
                  onChange={async (event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    const url = await fileToDataUrl(file);
                    update((current) => {
                      const next = current.credentials[index];
                      if (!next) return current;
                      next.fileUrl = url;
                      next.fileName = file.name;
                      return current;
                    });
                  }}
                />
                {item.fileName ? <p className="text-xs text-muted-foreground">File: {item.fileName}</p> : null}
                <Button
                  variant="outline"
                  className="w-fit rounded-none"
                  onClick={() =>
                    update((current) => {
                      current.credentials.splice(index, 1);
                      return current;
                    })
                  }
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              className="rounded-none"
              onClick={() =>
                update((current) => {
                  const next: Credential = {
                    id: crypto.randomUUID(),
                    code: `CERT-${String(current.credentials.length + 1).padStart(2, "0")}`,
                    name: "New credential",
                    issuers: [],
                    kind: "certification",
                  };
                  current.credentials.push(next);
                  return current;
                })
              }
            >
              Add certification or achievement
            </Button>
          </TabsContent>

          <TabsContent value="cv" className="space-y-4 pt-4">
            <Field label="CV file">
              <Input
                type="file"
                accept=".pdf"
                className="rounded-none"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  const url = await fileToDataUrl(file);
                  update((current) => {
                    current.cvUrl = url;
                    return current;
                  });
                }}
              />
            </Field>
            <Field label="Location">
              <Input
                className="rounded-none"
                value={draft.contact.location}
                onChange={(event) =>
                  update((current) => {
                    current.contact.location = event.target.value;
                    return current;
                  })
                }
              />
            </Field>
            <Field label="Phone">
              <Input
                className="rounded-none"
                value={draft.contact.phone}
                onChange={(event) =>
                  update((current) => {
                    current.contact.phone = event.target.value;
                    current.contact.phoneHref = `tel:${event.target.value.replace(/\s+/g, "")}`;
                    return current;
                  })
                }
              />
            </Field>
            <Field label="Email">
              <Input
                className="rounded-none"
                value={draft.contact.email}
                onChange={(event) =>
                  update((current) => {
                    current.contact.email = event.target.value;
                    return current;
                  })
                }
              />
            </Field>
            <Field label="LinkedIn URL">
              <Input
                className="rounded-none"
                value={draft.contact.linkedinUrl}
                onChange={(event) =>
                  update((current) => {
                    current.contact.linkedinUrl = event.target.value;
                    return current;
                  })
                }
              />
            </Field>
            <form
              className="grid gap-2 border border-border p-3"
              onSubmit={async (event: FormEvent) => {
                event.preventDefault();
                if (newPassword.trim().length < 8) {
                  toast.error("Use at least 8 characters");
                  return;
                }
                await setAdminPassword(newPassword);
                setNewPassword("");
                toast.success("Admin password updated on this device");
              }}
            >
              <p className="label-tech">CHANGE PASSWORD</p>
              <Input
                type="password"
                className="rounded-none"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />
              <Button type="submit" variant="outline" className="w-fit rounded-none">
                Update password
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
