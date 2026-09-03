import Image from "next/image";
import Link from "next/link";
import { AstralClassifier } from "@/components/astral-classifier";
import { EtherealArrow } from "@/components/ethereal-arrow";
import { ProjectCard } from "@/components/project-card";
import { SceneEffects } from "@/components/scene-effects";
import { TechnologyBadge } from "@/components/technology-badge";
import { TechnologyOrbit } from "@/components/technology-orbit";
import { projects } from "@/lib/projects";

const technologies = ["C++", "Python", "TypeScript", "Swift", "Unreal Engine 5", "AI Engineering", "Computer Vision", "ROS2", "React", "PostgreSQL", "Docker", "LiDAR", "GNSS", "Node.js", "MongoDB"];

export default function Home() {
  return (
    <main>
      <SceneEffects />
      <section className="hero" id="top">
        <div className="ambient ambient-one" aria-hidden="true" /><div className="ambient ambient-two" aria-hidden="true" /><div className="star-field" aria-hidden="true" />
        <div className="hero-content">
          <div className="hero-copy-block">
            <p className="eyebrow"><span /> Software alchemy · Costa Rica</p>
            <h1>Engineering software <em>that feels like magic.</em></h1>
            <p className="hero-copy">Complex ideas transformed into intelligent systems, spatial technology and immersive digital worlds.</p>
            <div className="hero-actions"><a className="button button-primary" href="#work">Explore the work <EtherealArrow direction="down-right" /></a><a className="button button-quiet" href="#contact">Let&apos;s build something</a></div>
            <div className="hero-proof" aria-label="Areas of expertise"><span><strong>04</strong> product worlds</span><span><strong>12+</strong> core technologies</span><span><strong>CR</strong> built in Costa Rica</span></div>
          </div>
          <div className="magic-core" aria-label="MendezSoftwagic technology core">
            <TechnologyOrbit />
            <div className="core-center"><div className="spacetime-logo spacetime-logo--core"><Image src="/images/mendez_softwagic_icon-v3.png" alt="MendezSoftwagic wizard technologist logo" width={124} height={124} priority /><i className="spacetime-lens" aria-hidden="true" /></div></div>
          </div>
        </div>
        <div className="scroll-cue" aria-hidden="true"><span /> Scroll to discover</div>
      </section>

      <section className="tech-marquee" aria-label="Technology stack"><div className="tech-track">{[...technologies, ...technologies].map((technology, index) => <TechnologyBadge name={technology} variant="marquee" key={`${technology}-${index}`} />)}</div></section>

      <section className="section projects-section" id="work">
        <div className="section-heading reveal"><div><p className="section-kicker">Selected work / 2026</p><h2>Four worlds.<br /><em>One obsession.</em></h2></div><p>From land and physical geometry to persistent digital universes—and the moments people gather to remember.</p></div>
        <div className="projects-grid">{projects.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}</div>
      </section>

      <section className="section lab-section" id="astral">
        <div className="section-heading reveal"><div><p className="section-kicker">Umbra Caeli / interactive</p><h2>Your birth becomes<br /><em>a playable identity.</em></h2></div><p>A lightweight glimpse into Umbra Caeli&apos;s natal system: discover the element carried by your Sun and the class awakened by your Ascendant.</p></div>
        <AstralClassifier />
      </section>

      <section className="section about-section" id="about">
        <div className="about-grid">
          <div className="about-portrait reveal"><div className="portrait-rings" aria-hidden="true"><i /><i /><i /></div><div className="spacetime-logo"><Image src="/images/mendez_softwagic_icon-v3.png" alt="MendezSoftwagic wizard technologist logo" width={360} height={360} /><i className="spacetime-lens" aria-hidden="true" /></div><span>MS / CR</span></div>
          <div className="about-copy reveal"><p className="section-kicker">The mind behind the magic</p><h2>Software is the medium.<br /><em>Possibility is the material.</em></h2><p>MendezSoftwagic is an independent engineering practice exploring the edge between practical software, artificial intelligence and immersive systems.</p><p>Built from Costa Rica with C++, Python, TypeScript, Swift and Unreal Engine—choosing the right tool for the idea, never the other way around.</p><div className="principles"><span><strong>01</strong> Build for reality</span><span><strong>02</strong> Design for wonder</span><span><strong>03</strong> Engineer for scale</span></div></div>
        </div>
      </section>

      <section className="contact-section" id="contact"><div className="contact-orb" aria-hidden="true" /><div className="contact-inner reveal"><p className="section-kicker">Have an impossible idea?</p><h2>Let&apos;s make it<br /><em>feel inevitable.</em></h2><p>Open to ambitious products, spatial systems, AI engineering and interactive world-building.</p><div className="contact-actions"><a className="contact-link contact-whatsapp" href="https://wa.me/50672005586?text=Hola%20Daniel%2C%20vi%20MendezSoftwagic%20y%20me%20gustar%C3%ADa%20conversar%20sobre%20un%20proyecto." target="_blank" rel="noreferrer"><span><small>Start a conversation</small>WhatsApp</span><EtherealArrow /></a><a className="contact-link contact-email" href="mailto:danielmendez2590@icloud.com?subject=Project%20inquiry%20%E2%80%94%20MendezSoftwagic"><span><small>Send the brief</small>Email</span><EtherealArrow /></a></div></div></section>

      <footer><a className="brand" href="#top"><span className="brand-mark">M</span><span>MendezSoftwagic</span></a><p>Software that creates magic · Costa Rica</p><div><Link href="/work/topotools">Work</Link><a href="https://github.com/SekaniaMendez" target="_blank" rel="noreferrer">GitHub</a><a href="#top">Back to top <EtherealArrow direction="up" small /></a></div></footer>
    </main>
  );
}
