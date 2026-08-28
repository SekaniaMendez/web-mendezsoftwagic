export type Project = {
  slug: string;
  name: string;
  eyebrow: string;
  title: string;
  summary: string;
  status: string;
  image: string;
  socialImage?: string;
  artwork?: "wedding";
  accent: string;
  accentRgb: string;
  liveUrl?: string;
  technologies: string[];
  capabilities: string[];
  ai?: {
    name: string;
    description: string;
  };
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
    ai: {
      name: "Surveying intelligence",
      description: "Specialized AI interprets source plans, supports automated estimates and accelerates geospatial production workflows.",
    },
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
    ai: {
      name: "Spatial reconstruction intelligence",
      description: "Specialized AI reasons over sensor geometry to transform LiDAR observations and GNSS anchors into useful spatial structure.",
    },
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
    technologies: ["Unreal Engine 5", "C++", "AI Systems", "Procedural Design"],
    capabilities: ["Natal-chart mechanics", "AI-powered abilities", "Deep customization", "Scalable progression"],
    ai: {
      name: "Adaptive world intelligence",
      description: "Specialized AI shapes player abilities and progression around each natal profile, producing systems designed to remain personal and surprising.",
    },
    challenge: "Online worlds often converge toward the same optimized character builds, diminishing identity and discovery.",
    approach: "Umbra Caeli makes each player’s astral profile part of the game system, creating personal abilities and a progression path designed to remain surprising.",
  },
  {
    slug: "wedding-manager",
    name: "Wedding Manager",
    eyebrow: "Event orchestration",
    title: "Every guest, every moment, beautifully coordinated.",
    summary: "A complete wedding experience that pairs cinematic digital invitations with tokenized RSVP, guest operations and a shared event gallery.",
    status: "Live event system",
    image: "/images/wedding-title-handwrite.svg",
    socialImage: "/images/wedding-invitation-card.png",
    artwork: "wedding",
    accent: "#f3d8df",
    accentRgb: "243, 216, 223",
    technologies: ["React 19", "Node.js", "Express", "MongoDB", "GSAP"],
    capabilities: ["Personalized token RSVP", "Guest and capacity management", "WhatsApp invitation workflows", "Event photo gallery", "Attendance reports and CSV export"],
    challenge: "A real wedding needs more than a beautiful invitation: every response, assigned space, child guest and communication must stay coordinated as plans evolve.",
    approach: "Wedding Manager connects an immersive public experience to a protected operational system. Each guest receives a personalized RSVP link, while the organizers manage capacity, confirmations, messaging and exports from one place.",
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
