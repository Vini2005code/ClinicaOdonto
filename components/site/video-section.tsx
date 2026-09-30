"use client";

import { useEffect, useRef, useState } from "react";

const details = [
  { title: "Controle tridimensional", text: "Cada movimento é planejado considerando posição, inclinação e relação entre as arcadas.", point: .12 },
  { title: "Forças progressivas", text: "A biomecânica distribui forças com precisão para conduzir o alinhamento de forma controlada.", point: .48 },
  { title: "Acompanhamento contínuo", text: "A evolução é observada em etapas para manter conforto, segurança e previsibilidade.", point: .78 },
];

export function VideoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(0);
  const selectDetail = (index: number) => {
    setActive(index);
    const video = videoRef.current;
    if (video?.duration) { video.currentTime = video.duration * details[index].point; void video.play().catch(() => undefined); }
  };
  useEffect(() => {
    const section = sectionRef.current; const video = videoRef.current; if (!section || !video) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) void video.play().catch(() => undefined); else video.pause(); }, { threshold: .28 });
    observer.observe(section); return () => observer.disconnect();
  }, []);
  return <section className="precision-film section-dark" id="precisao" ref={sectionRef} data-reveal>
    <div className="film-copy"><p className="eyebrow light">Ortodontia de alta precisão</p><h2>Precisão em<br /><em>cada detalhe.</em></h2><p>Movimentos pequenos exigem decisões exatas. Planejamos cada etapa para alinhar função, estética e previsibilidade.</p><span>Planejamento digital · acompanhamento contínuo</span></div>
    <div className="film-experience">
      <div className="film-frame"><div className="film-index">Modelo clínico interativo / 02</div><video ref={videoRef} src="/media/aura-protese.mp4" muted loop playsInline preload="metadata" disablePictureInPicture aria-label="Modelo animado de tratamento ortodôntico em uma arcada dentária" /><div className="film-mask" />
        <button className={`film-hotspot hotspot-one ${active === 0 ? "is-active" : ""}`} onClick={() => selectDetail(0)} aria-label="Explorar controle tridimensional"><span>01</span></button>
        <button className={`film-hotspot hotspot-two ${active === 1 ? "is-active" : ""}`} onClick={() => selectDetail(1)} aria-label="Explorar forças progressivas"><span>02</span></button>
        <button className={`film-hotspot hotspot-three ${active === 2 ? "is-active" : ""}`} onClick={() => selectDetail(2)} aria-label="Explorar acompanhamento contínuo"><span>03</span></button>
      </div>
      <div className="film-details"><div><span>0{active + 1}</span><strong>{details[active].title}</strong><p>{details[active].text}</p></div><small>Selecione um ponto no modelo para explorar</small></div>
    </div>
  </section>;
}
