import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { EtherealArrow } from "@/components/ethereal-arrow";
import { ProjectArtwork } from "@/components/project-artwork";
import { SceneEffects } from "@/components/scene-effects";
import { TechnologyBadge } from "@/components/technology-badge";
import { getProject, projects } from "@/lib/projects";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return projects.map((project) => ({ slug: project.slug })); }

async function getOrigin() {
  const incoming = await headers();
  const host = incoming.get("x-forwarded-host") ?? incoming.get("host") ?? "mendezsoftwagic.vercel.app";
  const protocol = incoming.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  return `${protocol}://${host}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const origin = await getOrigin();
  const image = new URL(project.socialImage ?? project.image, origin).toString();
  const title = `${project.name} — ${project.title}`;
  return {
    title, description: project.summary,
    openGraph: { title, description: project.summary, images: [{ url: image, alt: `${project.name} project artwork` }] },
    twitter: { card: "summary_large_image", title, description: project.summary, images: [image] },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return (
    <main className="case-page" style={{ "--project-accent": project.accent, "--project-rgb": project.accentRgb } as CSSProperties}>
      <SceneEffects />
      <section className="case-hero">
        <div className="case-background"><ProjectArtwork project={project} alt="" priority sizes="100vw" /></div><div className="case-overlay" />
        <div className="case-hero-inner"><Link className="back-link" href="/#work"><EtherealArrow direction="left" small /> Back to selected work</Link><p className="section-kicker">{project.eyebrow}</p><h1>{project.name}</h1><p className="case-title">{project.title}</p><div className="case-meta"><span>Status</span><strong>{project.status}</strong><span>Focus</span><strong>{project.technologies.slice(0, 2).join(" + ")}</strong></div></div>
      </section>
      <section className="case-content">
        <div className="case-intro reveal"><p className="section-kicker">The project</p><h2>{project.summary}</h2></div>
        {project.ai ? <section className="ai-profile reveal"><div className="ai-profile-core" aria-hidden="true"><span>AI</span></div><div><p className="section-kicker">Specialized intelligence</p><h2>{project.ai.name}</h2><p>{project.ai.description}</p></div></section> : null}
        <div className="case-columns reveal"><article><span>01 / Challenge</span><h3>Why it exists</h3><p>{project.challenge}</p></article><article><span>02 / Approach</span><h3>How it works</h3><p>{project.approach}</p></article></div>
        <div className="capability-block reveal"><div><p className="section-kicker">System capabilities</p><h2>Built around the work<br /><em>that matters.</em></h2></div><ol>{project.capabilities.map((capability, index) => <li key={capability}><span>0{index + 1}</span>{capability}</li>)}</ol></div>
        <div className="stack-block reveal"><p>Technology constellation</p><div>{project.technologies.map((technology) => <TechnologyBadge name={technology} variant="stack" key={technology} />)}</div></div>
        <div className="case-actions reveal">{project.liveUrl ? <a className="button button-primary" href={project.liveUrl} target="_blank" rel="noreferrer">Visit the project <EtherealArrow /></a> : <span className="button button-quiet">Private development build</span>}<Link className="button button-quiet" href="/#contact">Discuss a project</Link></div>
      </section>
      <footer><Link className="brand" href="/"><span className="brand-mark">M</span><span>MendezSoftwagic</span></Link><p>Engineering the impossible.</p><div><Link href="/#work">All work</Link><Link href="/#contact">Contact</Link></div></footer>
    </main>
  );
}
