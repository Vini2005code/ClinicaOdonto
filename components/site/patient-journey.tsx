"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";

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
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const items = listRef.current?.querySelectorAll<HTMLElement>("[data-journey-step]");
    if (!items?.length || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(Number((visible.target as HTMLElement).dataset.journeyStep));
    }, { rootMargin: "-25% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75] });
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const current = steps[active];
  return (
    <section className="journey section-dark" id="jornada">
      <div className="section-head light"><div><p className="eyebrow light">Sua jornada</p><h2>Clareza em cada etapa.</h2></div><p>Você sabe o que acontece, por que acontece e qual é o próximo passo.</p></div>
      <div className="journey-layout">
        <ol className="journey-steps" ref={listRef}>
          {steps.map((step, i) => <li key={step.title} data-journey-step={i} className={active === i ? "is-active" : ""}>
            <span className="journey-step-number">{String(i + 1).padStart(2, "0")}</span>
            <div><h3>{step.title}</h3><p>{step.detail}</p></div>
          </li>)}
        </ol>
        <div className="journey-visual" aria-live="off">
          <LazyMotion features={domAnimation} strict>
            <AnimatePresence initial={false} mode="sync">
              <m.div key={current.image} className="journey-visual-frame" initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={reduceMotion ? undefined : { opacity: 0 }} transition={{ duration: 0.32, ease: "easeOut" }}>
                <Image src={current.image} alt={current.alt} fill unoptimized sizes="(max-width: 900px) 90vw, 42vw" />
              </m.div>
            </AnimatePresence>
          </LazyMotion>
          <div className="journey-visual-caption" aria-hidden="true"><span>AURA / ETAPA {String(active + 1).padStart(2, "0")}</span><span>{current.title}</span></div>
        </div>
      </div>
    </section>
  );
}
