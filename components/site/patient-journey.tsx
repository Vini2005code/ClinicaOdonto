"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const steps = [
  { title: "Primeira conversa", detail: "Escutamos suas prioridades e esclarecemos o que você espera do cuidado.", image: "/images/hero-aura.webp", alt: "Conversa inicial em ambiente clínico" },
  { title: "Avaliação", detail: "Examinamos com tempo e reunimos os registros necessários para compreender seu caso.", image: "/images/clinica-aura.webp", alt: "Ambiente sereno para a avaliação odontológica" },
  { title: "Diagnóstico", detail: "Conectamos sinais clínicos e imagens para explicar as possibilidades com clareza.", image: "/images/caso-aura.webp", alt: "Imagem ilustrativa usada na análise do sorriso" },
  { title: "Planejamento", detail: "Desenhamos um plano individualizado, com etapas e decisões compartilhadas.", image: "/images/orthodontic-sequence/frame-01.webp", alt: "Visualização ilustrativa do planejamento digital" },
  { title: "Tratamento", detail: "Executamos cada etapa com precisão, conforto e acompanhamento próximo.", image: "/images/orthodontic-sequence/frame-12.webp", alt: "Visualização ilustrativa de uma etapa do tratamento" },
  { title: "Acompanhamento", detail: "Reavaliamos resultados e orientamos os cuidados para mantê-los ao longo do tempo.", image: "/images/especialistas-aura.webp", alt: "Equipe ilustrativa responsável pelo acompanhamento" },
];

export function PatientJourney() {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const items = Array.from(listRef.current?.querySelectorAll<HTMLElement>("[data-journey-step]") ?? []);
    if (!items.length) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const section = sectionRef.current?.getBoundingClientRect();
      if (!section || section.top > window.innerHeight || section.bottom < 0) return;
      const readingLine = window.innerHeight * (window.innerWidth <= 640 ? 0.65 : 0.5);
      let nearest = 0;
      let nearestDistance = Infinity;
      items.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - readingLine);
        if (distance < nearestDistance) {
          nearest = index;
          nearestDistance = distance;
        }
      });
      setActive((previous) => previous === nearest ? previous : nearest);
    };
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    scheduleUpdate();
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const current = steps[active];
  return (
    <section className="journey section-dark" id="jornada" ref={sectionRef}>
      <div className="section-head light"><div><p className="eyebrow light">Sua jornada</p><h2>Clareza em cada etapa.</h2></div><p>Você sabe o que acontece, por que acontece e qual é o próximo passo.</p></div>
      <div className="journey-layout">
        <ol className="journey-steps" ref={listRef}>
          {steps.map((step, i) => <li key={step.title} data-journey-step={i} className={active === i ? "is-active" : ""}>
            <span className="journey-step-number">{String(i + 1).padStart(2, "0")}</span>
            <div><h3><button type="button" className="journey-step-trigger" aria-current={active === i ? "step" : undefined} onClick={() => setActive(i)}>{step.title}</button></h3><p>{step.detail}</p></div>
          </li>)}
        </ol>
        <div className="journey-visual" aria-live="off">
          {steps.map((step, i) => <div key={step.image} className={`journey-visual-frame ${active === i ? "is-active" : ""}`} aria-hidden={active !== i}>
            <Image src={step.image} alt={step.alt} fill unoptimized loading="lazy" sizes="(max-width: 900px) 90vw, 42vw" />
          </div>)}
          <div className="journey-visual-caption" aria-hidden="true"><span>AURA / ETAPA {String(active + 1).padStart(2, "0")}</span><span>{current.title}</span></div>
        </div>
      </div>
    </section>
  );
}
