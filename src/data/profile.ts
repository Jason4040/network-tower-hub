// EDITABLE CONTENT — update these values without touching UI components.

export const CV_URL = "/cv/Irumva-Jason-CV.pdf";

export const profile = {
  name: "Irumva Jason",
  role: "Networking & Communication Systems Student",
  aspiration: "Aspiring Cloud Security Engineer",
  location: "Kigali, Rwanda",
  statement:
    "Building practical networking expertise while progressing toward Cloud Security Engineering.",
  status: "ONLINE",
  about: [
    "Irumva Jason is a third-year IT student specializing in Networking and Communication Systems at African University of Central Africa (AUCA) in Kigali, Rwanda.",
    "He is building a strong foundation in network configuration, routing, communication systems and network security, with a long-term goal of specializing in Cloud Security Engineering.",
  ],
  directions: [
    "Cloud networking",
    "Identity and access management",
    "Secure infrastructure design",
    "Infrastructure protection",
    "Network security",
  ],
  objective:
    "To secure an entry-level networking position or internship that provides practical real-world experience while progressively developing specialized knowledge in Cloud Security Engineering.",
  availability: {
    items: ["Internships", "Entry-level networking positions", "Starting immediately"],
    note: "Open to opportunities within Rwanda and East Africa.",
  },
  languages: [
    { name: "English", level: "Fluent" },
    { name: "Kinyarwanda", level: "Fluent" },
    { name: "Luganda", level: "Fluent" },
    { name: "Kiswahili", level: "Basic" },
  ],
  coursework: [
    "Networking Fundamentals & Routing Protocols",
    "Switching Technologies & VLAN Configuration",
    "Network Security & Access Control",
    "Communication Systems & Data Transmission",
    "IT Project Management Basics",
  ],
  extracurricular: [
    "IT and Networking student community",
    "Peer study groups",
    "Hands-on networking lab practice",
    "Basketball",
    "Music production and performance",
  ],
  interests: ["Network configuration projects", "Music", "Basketball"],
};

export const nodes = [
  { id: "about", code: "NODE 01", label: "ABOUT" },
  { id: "skills", code: "NODE 02", label: "SKILLS" },
  { id: "projects", code: "NODE 03", label: "PROJECTS" },
  { id: "education", code: "NODE 04", label: "EDUCATION" },
  { id: "certification", code: "NODE 05", label: "CERTIFICATION" },
  { id: "cv", code: "NODE 06", label: "CV" },
  { id: "contact", code: "NODE 07", label: "CONTACT" },
] as const;

export type NodeId = (typeof nodes)[number]["id"];
