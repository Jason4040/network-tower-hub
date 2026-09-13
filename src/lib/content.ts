import { certifications as seedCerts } from "../data/certifications";
import { contact as seedContact } from "../data/contact";
import { education as seedEducation } from "../data/education";
import { CV_URL, profile as seedProfile } from "../data/profile";
import { projects as seedProjects, type Project } from "../data/projects";
import { skills as seedSkills } from "../data/skills";

export type SkillGroup = {
  code: string;
  category: string;
  items: string[];
};

export type EducationItem = {
  period: string;
  title: string;
  institution: string;
  location: string;
  details: string[];
  current: boolean;
};

export type Credential = {
  id: string;
  code: string;
  name: string;
  issuers: string[];
  url?: string;
  fileUrl?: string;
  fileName?: string;
  kind: "certification" | "achievement";
  issued?: string;
};

export type ProfileContent = {
  name: string;
  role: string;
  aspiration: string;
  location: string;
  statement: string;
  status: string;
  about: string[];
  directions: string[];
  objective: string;
  availability: {
    items: string[];
    note: string;
  };
  languages: Array<{ name: string; level: string }>;
  coursework: string[];
  extracurricular: string[];
  interests: string[];
  photoUrl: string;
};

export type ContactContent = {
  name: string;
  location: string;
  phone: string;
  phoneHref: string;
  email: string;
  linkedinLabel: string;
  linkedinUrl: string;
};

export type SiteContent = {
  profile: ProfileContent;
  skills: SkillGroup[];
  projects: Project[];
  education: EducationItem[];
  credentials: Credential[];
  contact: ContactContent;
  cvUrl: string;
};

export const CONTENT_STORAGE_KEY = "nth-portfolio-content";
export const CONTENT_JSON_URL = "/content/portfolio.json";

export function defaultContent(): SiteContent {
  return {
    profile: {
      ...seedProfile,
      photoUrl: seedProfile.photoUrl,
    },
    skills: seedSkills.map((group) => ({ ...group, items: [...group.items] })),
    projects: seedProjects.map((project) => ({ ...project, technologies: [...project.technologies] })),
    education: seedEducation.map((item) => ({ ...item, details: [...item.details] })),
    credentials: seedCerts.map((item) => ({ ...item })),
    contact: { ...seedContact },
    cvUrl: CV_URL,
  };
}

export function cloneContent(content: SiteContent): SiteContent {
  return JSON.parse(JSON.stringify(content)) as SiteContent;
}

export function readLocalContent(): SiteContent | null {
  try {
    const raw = window.localStorage.getItem(CONTENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SiteContent>;
    return mergeContent(defaultContent(), parsed);
  } catch {
    return null;
  }
}

export function writeLocalContent(content: SiteContent) {
  window.localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(content));
}

export function mergeContent(base: SiteContent, overlay: Partial<SiteContent>): SiteContent {
  return {
    profile: { ...base.profile, ...overlay.profile },
    skills: overlay.skills ?? base.skills,
    projects: overlay.projects ?? base.projects,
    education: overlay.education ?? base.education,
    credentials: overlay.credentials ?? base.credentials,
    contact: { ...base.contact, ...overlay.contact },
    cvUrl: overlay.cvUrl ?? base.cvUrl,
  };
}

export async function fetchPublishedContent(): Promise<SiteContent | null> {
  try {
    const response = await fetch(CONTENT_JSON_URL, { cache: "no-store" });
    if (!response.ok) return null;
    const parsed = (await response.json()) as Partial<SiteContent>;
    return mergeContent(defaultContent(), parsed);
  } catch {
    return null;
  }
}

export function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
