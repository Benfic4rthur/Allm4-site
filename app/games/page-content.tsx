"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { games } from "@/lib/games";
import { localizeTree, useSiteLanguage } from "@/lib/i18n/runtime";
import { StudioHeader } from "@/components/brand/studio-header";
import "../umbrella.css";
import "./games.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function GamesContent() {
  useSiteLanguage();
  return localizeTree(
    <div className="umbrella-site games-site" id="inicio">
      <a className="umb-skip" href="#games-content">Pular para o conteúdo</a>
      <StudioHeader current="games" />
      <main className="studio-shell games-main" id="games-content">
        <div className="games-intro">
          <p className="studio-eyebrow"><span /> ALLM4 · GAMES</p>
          <h1>Games<span>.</span></h1>
          <p>Mundos que eu crio para explorar.</p>
          <p className="games-intro-note">Jogos autorais, com suas próprias histórias, paisagens e possibilidades.</p>
        </div>
        <section className="games-catalog" aria-labelledby="games-catalog-title">
          <div className="studio-section-heading">
            <div className="studio-title-group"><h2 id="games-catalog-title">Explore os jogos</h2><span className="studio-count">{String(games.length).padStart(2, "0")}</span></div>
            <span className="studio-catalog-note">Cada jogo, um universo.</span>
          </div>
          <div className="games-grid">
            {games.map((game, index) => <article className="games-card" key={game.slug}>
              <a className="games-card-link" href={game.external ? game.url : `${basePath}${game.url}`} aria-label={game.external ? `Jogar ${game.name} no site oficial` : `Conhecer o jogo ${game.name}`}>
                <div className="games-card-art" data-image-fit={game.imageFit}>
                  <Image src={`${basePath}${game.image}`} alt={game.imageAlt} width={1440} height={900} unoptimized priority={index === 0} />
                  {game.imageLabel && <span className="games-capture-label">{game.imageLabel}</span>}
                </div>
                <div className="games-card-copy">
                  <div className="games-card-identity"><Image src={`${basePath}${game.icon}`} alt="" width={58} height={58} unoptimized /><div><p>{game.genre}</p><h3>{game.name}</h3></div></div>
                  <p className="games-card-description">{game.description}</p>
                  <span className="games-card-cta">{game.actionLabel ?? "Conhecer o jogo"} {game.external ? <ArrowUpRight size={17} aria-hidden="true" /> : <ArrowRight size={17} aria-hidden="true" />}</span>
                </div>
              </a>
            </article>)}
          </div>
        </section>
      </main>
      <footer className="studio-shell games-footer"><a href={`${basePath}/`}><ArrowLeft size={14} aria-hidden="true" /> Voltar ao ALLM4</a><span>© {new Date().getFullYear()} ALLM4</span></footer>
    </div>,
  );
}
