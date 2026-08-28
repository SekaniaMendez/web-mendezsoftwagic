"use client";

import type { CSSProperties, PointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/projects";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const onMove = (event: PointerEvent<HTMLElement>) => {
    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    card.style.setProperty("--rx", `${(0.5 - y) * 6}deg`);
    card.style.setProperty("--ry", `${(x - 0.5) * 8}deg`);
    card.style.setProperty("--mx", `${x * 100}%`);
    card.style.setProperty("--my", `${y * 100}%`);
  };

  return (
    <article className="project-card reveal" onPointerMove={onMove} onPointerLeave={(event) => { event.currentTarget.style.setProperty("--rx", "0deg"); event.currentTarget.style.setProperty("--ry", "0deg"); }} style={{ "--project-accent": project.accent, "--project-rgb": project.accentRgb, "--delay": `${index * 90}ms` } as CSSProperties}>
      <div className="project-image">
        <Image src={project.image} alt={`${project.name} project artwork`} fill sizes="(max-width: 800px) 100vw, 50vw" />
        <div className="project-image-shade" /><span className="project-index">0{index + 1}</span><span className="project-status"><i /> {project.status}</span>
      </div>
      <div className="project-body">
        <p className="project-eyebrow">{project.eyebrow}</p><h3>{project.name}</h3><p>{project.summary}</p>
        <ul className="project-tech" aria-label={`${project.name} technologies`}>{project.technologies.slice(0, 4).map((technology) => <li key={technology}>{technology}</li>)}</ul>
        <Link className="project-link" href={`/work/${project.slug}`} aria-label={`Explore ${project.name} case study`}>Explore case study <span>↗</span></Link>
      </div>
      <div className="card-spotlight" aria-hidden="true" />
    </article>
  );
}
