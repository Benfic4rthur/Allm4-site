import { ArrowUpRight } from "lucide-react";
import { BrandMark } from "@/components/brand/brand-mark";
import { StudioStory } from "@/components/brand/studio-story";
import { ProfileContact, ProfileEducation, ProfileExperience, ProfileIdentity, ProfileProjectStory, ProfileTechnologies } from "@/components/brand/studio-profile";
import "./studio-about.css";
import "./studio-profile.css";
import "./studio-story.css";

const chapters = ["O estúdio", "Arthur Benfica", "Experiência", "Formação", "Tecnologias", "LUM4", "JáCopiei?", "Beira", "Vamos conversar"];

export function StudioAbout() {
  return (
    <section className="studio-about studio-about--story studio-shell" id="sobre" aria-labelledby="studio-about-title" tabIndex={-1}>
      <StudioStory chapters={chapters}>
      <div className="studio-story-introduction">
      <div className="studio-about-intro">
        <div className="studio-about-copy">
          <p className="studio-eyebrow"><span /> SOBRE O ALLM4</p>
          <h2 id="studio-about-title">Software útil, simples <span>e bem construído.</span></h2>
          <p>
            Sou Arthur Benfica, criador do ALLM4, um estúdio independente de
            software. Crio aplicativos e extensões para facilitar a rotina.
          </p>
          <p>
            Da ideia à interface e ao código, cada produto passa pelas minhas
            mãos. Aqui reúno as ferramentas que construo e continuo aprimorando.
          </p>
          <nav className="studio-about-links" aria-label="Links de Arthur Benfica">
            <a href="https://github.com/Benfic4rthur" target="_blank" rel="noopener noreferrer" aria-label="GitHub de Arthur Benfica (abre em nova aba)">
              GitHub <ArrowUpRight size={13} aria-hidden="true" />
            </a>
            <a className="studio-about-profile-link" href="https://www.linkedin.com/in/benfic4rthur" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn de Arthur Benfica (abre em nova aba)">
              LinkedIn <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          </nav>
        </div>
        <div className="studio-about-signature">
          <div className="studio-about-emblem">
            <BrandMark className="studio-about-mark" decorative />
          </div>
          <strong>ALLM4</strong>
          <span>Estúdio independente</span>
        </div>
      </div>
      <div className="studio-story-principles"><span>Útil primeiro.</span><span>Clareza na experiência.</span><span>Cuidado nos detalhes.</span></div>
      </div>
      <ProfileIdentity />
      <ProfileExperience />
      <ProfileEducation />
      <ProfileTechnologies />
      <ProfileProjectStory slug="lum4" />
      <ProfileProjectStory slug="jacopiei" />
      <ProfileProjectStory slug="beira" />
      <ProfileContact />
      </StudioStory>
    </section>
  );
}
