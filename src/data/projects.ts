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

export const projects: Project[] = [
  {
    id: "tower-field-installation",
    title: "Tower Field Installation",
    description: "A communications tower study focused on structural layout, antenna placement, and practical site infrastructure.",
    category: "Telecommunications",
    status: "completed",
    technologies: ["RF Systems", "Antenna Planning", "Site Infrastructure"],
    year: "2026",
    image: "/images/tower.jpg",
    featured: true,
  },
  {
    id: "connected-home-network",
    title: "Connected Home Network",
    description: "A visual concept for a resilient home network with wireless coverage, connected devices, and clean equipment organization.",
    category: "Network Design",
    status: "completed",
    technologies: ["Wi-Fi Planning", "Network Security", "IoT"],
    year: "2026",
    image: "/images/house.jpeg",
    featured: true,
  },
];
