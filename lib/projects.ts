export type Project = {
  slug: string;
  name: string;
  eyebrow: string;
  title: string;
  summary: string;
  status: string;
  image: string;
  accent: string;
  accentRgb: string;
  liveUrl?: string;
  technologies: string[];
  capabilities: string[];
  challenge: string;
  approach: string;
};

export const projects: Project[] = [
  {
    slug: "topotools",
    name: "TopoTools",
    eyebrow: "Geospatial automation",
    title: "The surveying office, re-engineered.",
    summary: "A professional workflow that automates quoting, plan reading, drafting, georeferencing and neighborhood reconstruction for surveyors.",
    status: "Near production",
    image: "/images/topotools_background.png",
    accent: "#78f8e4",
    accentRgb: "120, 248, 228",
    liveUrl: "https://www.topo-tools.com",
    technologies: ["Python", "Computer Vision", "PostgreSQL", "Geospatial"],
    capabilities: ["Automated quoting", "Plan intelligence", "Georeferenced drafting", "Neighborhood reconstruction"],
    challenge: "Surveyors lose valuable time moving between disconnected quoting, plan-reading and drafting workflows.",
    approach: "TopoTools turns those repetitive office tasks into one focused system, helping professionals move from source plan to field-ready deliverable with less friction.",
  },
  {
    slug: "atlas",
    name: "Atlas",
    eyebrow: "Spatial intelligence",
    title: "Reality, reconstructed as geometry.",
    summary: "An AI engineering system that combines LiDAR geometry with GNSS anchors to reconstruct and georeference physical locations.",
    status: "Prototype · 20%",
    image: "/images/atlas_wallpaper.png",
    accent: "#81a9ff",
    accentRgb: "129, 169, 255",
    technologies: ["C++", "Python", "LiDAR", "GNSS", "ROS2"],
    capabilities: ["LiDAR processing", "Geometry construction", "GNSS anchoring", "Spatial reconstruction"],
    challenge: "Physical environments are rich in detail, but turning raw sensor data into useful, anchored geometry remains complex.",
    approach: "Atlas explores an AI-assisted pipeline for building real geometry from LiDAR and positioning it through GNSS, with a future path into the ROS2 ecosystem.",
  },
  {
    slug: "umbra-caeli",
    name: "Umbra Caeli",
    eyebrow: "Intelligent worlds",
    title: "Every player becomes a constellation.",
    summary: "An MMORPG where a natal chart shapes unique AI-powered abilities inside an intense, infinitely extensible souls-like progression system.",
    status: "In development",
    image: "/images/umbra_caeli_wallpaper.png",
    accent: "#bd91ff",
    accentRgb: "189, 145, 255",
    liveUrl: "https://www.umbra-caeli.com",
    technologies: ["Unreal Engine 5", "C++", "AI Systems", "Procedural Design"],
    capabilities: ["Natal-chart mechanics", "AI-powered abilities", "Deep customization", "Scalable progression"],
    challenge: "Online worlds often converge toward the same optimized character builds, diminishing identity and discovery.",
    approach: "Umbra Caeli makes each player’s astral profile part of the game system, creating personal abilities and a progression path designed to remain surprising.",
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
