import Image from "next/image";
import { WeddingCardStars } from "@/components/wedding-card-stars";
import type { Project } from "@/lib/projects";

type ProjectArtworkProps = {
  project: Project;
  alt: string;
  priority?: boolean;
  sizes: string;
  animateWeddingSky?: boolean;
};

export function ProjectArtwork({ project, alt, priority = false, sizes, animateWeddingSky = false }: ProjectArtworkProps) {
  if (project.artwork === "wedding") {
    return (
      <div
        className="wedding-artwork"
        aria-hidden={alt ? undefined : true}
        aria-label={alt || undefined}
        role={alt ? "img" : undefined}
      >
        {animateWeddingSky ? <WeddingCardStars /> : null}
        <span className="wedding-moon" aria-hidden="true">
          <Image src="/images/wedding-moon-texture.jpg" alt="" fill sizes="140px" />
        </span>
        <Image
          className="wedding-script"
          src={project.image}
          alt=""
          width={962}
          height={116}
          priority={priority}
          unoptimized
        />
      </div>
    );
  }

  return <Image src={project.image} alt={alt} fill priority={priority} sizes={sizes} />;
}
