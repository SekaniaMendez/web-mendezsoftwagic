import {
  SiCplusplus,
  SiDocker,
  SiExpress,
  SiGreensock,
  SiMongodb,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRos,
  SiSwift,
  SiTypescript,
  SiUnrealengine,
} from "react-icons/si";
import { TbBrain, TbCube3dSphere, TbEye, TbMap2, TbRadar2, TbSatellite, TbSparkles, TbTopologyStar3 } from "react-icons/tb";

type TechnologyBadgeProps = {
  name: string;
  variant?: "compact" | "marquee" | "stack";
};

export function TechnologyIcon({ name }: { name: string }) {
  const normalized = name.toLowerCase();

  if (normalized === "c++") return <SiCplusplus />;
  if (normalized === "python") return <SiPython />;
  if (normalized === "typescript") return <SiTypescript />;
  if (normalized.startsWith("unreal engine")) return <SiUnrealengine />;
  if (normalized.startsWith("react")) return <SiReact />;
  if (normalized === "postgresql") return <SiPostgresql />;
  if (normalized === "docker") return <SiDocker />;
  if (normalized === "ros2") return <SiRos />;
  if (normalized === "swift") return <SiSwift />;
  if (normalized === "node.js") return <SiNodedotjs />;
  if (normalized === "express") return <SiExpress />;
  if (normalized === "mongodb") return <SiMongodb />;
  if (normalized === "gsap") return <SiGreensock />;
  if (normalized.includes("computer vision")) return <TbEye />;
  if (normalized.includes("lidar")) return <TbRadar2 />;
  if (normalized.includes("gnss")) return <TbSatellite />;
  if (normalized.includes("geospatial")) return <TbMap2 />;
  if (normalized.includes("procedural")) return <TbTopologyStar3 />;
  if (normalized.includes("3d")) return <TbCube3dSphere />;
  if (normalized.includes("ai")) return <TbBrain />;
  return <TbSparkles />;
}

export function TechnologyBadge({ name, variant = "compact" }: TechnologyBadgeProps) {
  return (
    <span className={`technology-badge technology-badge-${variant}`}>
      <span className="technology-sigil" aria-hidden="true"><TechnologyIcon name={name} /></span>
      <span className="technology-name">{name}</span>
    </span>
  );
}
