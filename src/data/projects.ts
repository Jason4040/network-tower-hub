// EDITABLE CONTENT — add projects here; the UI renders automatically.
//
// HOW TO ADD A PROJECT:
// 1. Copy the shape below into `projects`.
// 2. status: "completed" | "upcoming"
// 3. Leave any URL empty ("") to hide its button.
//
// Example (replace with real content, do not ship placeholders):
// {
//   id: "campus-lan",
//   title: "PLACEHOLDER — Campus LAN Design",
//   description: "PLACEHOLDER — replace with a real project description.",
//   category: "Network Design",
//   status: "completed",
//   technologies: ["Cisco Packet Tracer", "VLANs", "OSPF"],
//   year: "2026",
//   image: "",
//   github: "",
//   live: "",
//   docs: "",
//   featured: true,
// },

export type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "completed" | "upcoming";
  technologies: string[];
  year: string;
  image?: string;
  github?: string;
  live?: string;
  docs?: string;
  featured?: boolean;
};

export const projects: Project[] = [];
