import Image from "next/image";
import Link from "next/link";
import { MagicLab } from "@/components/magic-lab";
import { Navigation } from "@/components/navigation";
import { ProjectCard } from "@/components/project-card";
import { SceneEffects } from "@/components/scene-effects";
import { projects } from "@/lib/projects";

const technologies = ["C++", "Python", "TypeScript", "Unreal Engine 5", "AI Engineering", "Computer Vision", "ROS2", "React", "PostgreSQL", "Docker", "LiDAR", "GNSS"];

export default function Home() {
  return (
    <main>
      <SceneEffects />
      <Navigation />
      <section className="hero" id="top">
        <div className="ambient ambient-one" aria-hidden="true" /><div className="ambient ambient-two" aria-hidden="true" /><div className="star-field" aria-hidden="true" />
        <div className="hero-content">
          <div className="hero-copy-block">
            <p className="eyebrow"><span /> Software alchemy · Costa Rica</p>
            <h1>Engineering software <em>that feels like magic.</em></h1>
            <p className="hero-copy">Complex ideas transformed into intelligent systems, spatial technology and immersive digital worlds.</p>
            <div className="hero-actions"><a className="button button-primary" href="#work">Explore the work <span>↘</span></a><a className="button button-quiet" href="#contact">Let&apos;s build something</a></div>
            <div className="hero-proof" aria-label="Areas of expertise"><span><strong>03</strong> product worlds</span><span><strong>12+</strong> core technologies</span><span><strong>CR</strong> built in Costa Rica</span></div>
          </div>
          <div className="magic-core" aria-label="MendezSoftwagic technology core">
            <div className="core-haze" /><div className="orbit orbit-a"><span>C++</span><i /><i /><i /></div><div className="orbit orbit-b"><span>AI</span><i /><i /><i /></div><div className="orbit orbit-c"><span>3D</span><i /><i /><i /></div>
            <div className="core-center"><Image src="/images/mendez_softwagic_icon.png" alt="MendezSoftwagic emblem" width={124} height={124} priority /></div>
            <p>Ideas enter.<br /><strong>Magic emerges.</strong></p>
          </div>
        </div>
        <div className="scroll-cue" aria-hidden="true"><span /> Scroll to discover</div>
      </section>

      <section className="tech-marquee" aria-label="Technology stack"><div className="tech-track">{[...technologies, ...technologies].map((technology, index) => <span key={`${technology}-${index}`}><i />{technology}</span>)}</div></section>

      <section className="section projects-section" id="work">
        <div className="section-heading reveal"><div><p className="section-kicker">Selected work / 2026</p><h2>Three worlds.<br /><em>One obsession.</em></h2></div><p>From land and physical geometry to persistent digital universes—each project starts where conventional software stops.</p></div>
        <div className="projects-grid">{projects.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}</div>
      </section>

      <section className="section lab-section" id="lab">
        <div className="section-heading reveal"><div><p className="section-kicker">The Magic Lab / interactive</p><h2>Don&apos;t just watch.<br /><em>Bend the system.</em></h2></div><p>A small experiment in emergence: simple rules, intelligent behavior and a little human influence.</p></div>
        <MagicLab />
      </section>

      <section className="section about-section" id="about">
        <div className="about-grid">
          <div className="about-portrait reveal"><div className="portrait-rings" aria-hidden="true"><i /><i /><i /></div><Image src="/images/mendez_softwagic_icon.png" alt="MendezSoftwagic" width={260} height={260} /><span>MS / CR</span></div>
          <div className="about-copy reveal"><p className="section-kicker">The mind behind the magic</p><h2>Software is the medium.<br /><em>Possibility is the material.</em></h2><p>MendezSoftwagic is an independent engineering practice exploring the edge between practical software, artificial intelligence and immersive systems.</p><p>Built from Costa Rica with C++, Python, TypeScript and Unreal Engine—choosing the right tool for the idea, never the other way around.</p><div className="principles"><span><strong>01</strong> Build for reality</span><span><strong>02</strong> Design for wonder</span><span><strong>03</strong> Engineer for scale</span></div></div>
        </div>
      </section>

      <section className="contact-section" id="contact"><div className="contact-orb" aria-hidden="true" /><div className="contact-inner reveal"><p className="section-kicker">Have an impossible idea?</p><h2>Let&apos;s make it<br /><em>feel inevitable.</em></h2><p>Open to ambitious products, spatial systems, AI engineering and interactive world-building.</p><a className="contact-link" href="https://github.com/SekaniaMendez" target="_blank" rel="noreferrer">Start a conversation <span>↗</span></a></div></section>

      <footer><a className="brand" href="#top"><span className="brand-mark">M</span><span>MendezSoftwagic</span></a><p>Software that creates magic · Costa Rica</p><div><Link href="/work/topotools">Work</Link><a href="https://github.com/SekaniaMendez" target="_blank" rel="noreferrer">GitHub</a><a href="#top">Back to top ↑</a></div></footer>
    </main>
  );
}
