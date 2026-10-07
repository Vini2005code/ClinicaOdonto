"use client";

import { useEffect } from "react";
import Image from "next/image";
import { ArrowDown, ArrowRight } from "lucide-react";
import { stagger, useAnimate, useReducedMotion } from "framer-motion";
import { BookingButton } from "@/components/site/booking-button";

const firstLine = ["Precisão", "clínica."];
const secondLine = ["Naturalidade", "em", "cada", "resultado."];

export function Hero() {
  const [titleRef, animate] = useAnimate();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    // Server-rendered words stay readable before hydration; motion only adds polish.
    const controls = animate(
      "[data-hero-word]",
      { opacity: [0.76, 1], filter: ["blur(4px)", "blur(0px)"], y: [6, 0] },
      { duration: 0.42, ease: "easeOut", delay: stagger(0.045) },
    );
    return () => controls.stop();
  }, [animate, reduceMotion]);

  return (
    <section className="hero" id="inicio">
      <Image src="/images/hero-aura.webp" alt="Dentista da AURA apresentando um diagnóstico digital a uma paciente" fill priority unoptimized sizes="100vw" className="hero-image" />
      <div className="hero-wash" />
      <div className="hero-content">
        <p className="eyebrow light">Diagnóstico · Planejamento · Cuidado</p>
        <h1 ref={titleRef} className="hero-title" aria-label="Precisão clínica. Naturalidade em cada resultado.">
          <span className="hero-title-line" aria-hidden="true">{firstLine.map((word) => <span data-hero-word key={word}>{word} </span>)}</span>
          <span className="hero-title-line hero-highlight" aria-hidden="true">{secondLine.map((word) => <span data-hero-word key={word}>{word} </span>)}</span>
        </h1>
        <p className="hero-copy">Diagnóstico cuidadoso, planejamento digital e tratamentos integrados — com tempo para explicar cada decisão.</p>
        <div className="hero-actions"><BookingButton /><a className="text-link light" href="#manifesto">Conhecer a abordagem <ArrowRight size={16} aria-hidden="true" /></a></div>
      </div>
      <a href="#manifesto" className="scroll-note">Descubra a AURA <ArrowDown size={16} aria-hidden="true" /></a>
      <span className="hero-index">AURA / 01</span>
    </section>
  );
}
